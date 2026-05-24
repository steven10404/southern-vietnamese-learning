import atexit
import hashlib
import json
import os
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


HOST = os.environ.get("VIENEU_HOST", "127.0.0.1")
PORT = int(os.environ.get("VIENEU_PORT", "8765"))
MODE = os.environ.get("VIENEU_MODE", "turbo")
MAX_CHARS = int(os.environ.get("VIENEU_MAX_CHARS", "900"))
DEFAULT_VOICE_ID = os.environ.get("VIENEU_VOICE_ID", "Xuân Vĩnh (Nam - Miền Nam)")
CACHE_DIR = Path(os.environ.get("VIENEU_CACHE_DIR", Path(__file__).with_name("cache")))
CACHE_DIR.mkdir(parents=True, exist_ok=True)

_engine = None
_synth_lock = threading.Lock()


def json_bytes(payload):
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


def get_engine():
    global _engine
    if _engine is None:
        from vieneu import Vieneu

        _engine = Vieneu(mode=MODE) if MODE else Vieneu()
    return _engine


def close_engine():
    if _engine is not None and hasattr(_engine, "close"):
        _engine.close()


atexit.register(close_engine)


def list_voices():
    return [{"description": DEFAULT_VOICE_ID, "id": DEFAULT_VOICE_ID}]


def resolve_voice(engine, voice_id):
    try:
        return engine.get_preset_voice(voice_id)
    except Exception:
        if voice_id != DEFAULT_VOICE_ID:
            return engine.get_preset_voice(DEFAULT_VOICE_ID)
        raise


def cache_path_for(text, voice_id):
    payload = {
        "version": 4,
        "mode": MODE,
        "voice_id": voice_id,
        "text": text,
    }
    digest = hashlib.sha256(json_bytes(payload)).hexdigest()
    return CACHE_DIR / f"{digest}.wav"


def cache_items():
    if not CACHE_DIR.exists():
        return 0
    return len(list(CACHE_DIR.glob("*.wav")))


def clear_cache():
    if not CACHE_DIR.exists():
        return 0
    removed = 0
    for cache_file in CACHE_DIR.glob("*.wav"):
        cache_file.unlink(missing_ok=True)
        removed += 1
    return removed


def synthesize_wav(text, voice_id=""):
    voice_id = DEFAULT_VOICE_ID
    output_path = cache_path_for(text, voice_id)
    if output_path.exists():
        return output_path.read_bytes(), True

    with _synth_lock:
        if output_path.exists():
            return output_path.read_bytes(), True

        engine = get_engine()
        kwargs = {"text": text}
        if voice_id:
            kwargs["voice"] = resolve_voice(engine, voice_id)
        if MODE.lower() == "turbo":
            kwargs["show_progress"] = False

        audio = engine.infer(**kwargs)
        fd, raw_path = tempfile.mkstemp(prefix="vieneu_", suffix=".wav", dir=str(CACHE_DIR))
        os.close(fd)
        temp_path = Path(raw_path)
        try:
            engine.save(audio, str(temp_path))
            os.replace(temp_path, output_path)
            return output_path.read_bytes(), False
        finally:
            temp_path.unlink(missing_ok=True)


class Handler(BaseHTTPRequestHandler):
    server_version = "SouthernVietnameseVieNeu/0.1"

    def _send_json(self, status, payload):
        data = json_bytes(payload)
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(data)))
        self.send_header("access-control-allow-origin", "http://localhost:5178")
        self.end_headers()
        self.wfile.write(data)

    def _send_wav(self, data, cache_hit=False):
        self.send_response(200)
        self.send_header("content-type", "audio/wav")
        self.send_header("content-length", str(len(data)))
        self.send_header("cache-control", "no-store")
        self.send_header("x-vieneu-cache", "hit" if cache_hit else "miss")
        self.send_header("access-control-allow-origin", "http://localhost:5178")
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("access-control-allow-origin", "http://localhost:5178")
        self.send_header("access-control-allow-methods", "GET, POST, OPTIONS")
        self.send_header("access-control-allow-headers", "content-type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self._send_json(
                200,
                {
                    "ok": True,
                    "mode": MODE,
                    "loaded": _engine is not None,
                    "default_voice": DEFAULT_VOICE_ID,
                    "cache_enabled": True,
                    "cache_items": cache_items(),
                },
            )
            return
        if self.path == "/voices":
            self._send_json(200, {"ok": True, "voices": list_voices()})
            return
        if self.path == "/cache/status":
            self._send_json(200, {"ok": True, "cache_enabled": True, "cache_items": cache_items()})
            return
        self._send_json(404, {"ok": False, "error": "Not found"})

    def do_POST(self):
        if self.path == "/cache/clear":
            removed = clear_cache()
            self._send_json(200, {"ok": True, "cache_enabled": True, "removed": removed})
            return

        if self.path != "/tts":
            self._send_json(404, {"ok": False, "error": "Not found"})
            return

        try:
            length = int(self.headers.get("content-length", "0"))
            if length > 20000:
                self._send_json(413, {"ok": False, "error": "文字太長，請縮短後再朗讀。"})
                return
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            text = str(payload.get("text", "")).strip()
            voice_id = str(payload.get("voice_id", "")).strip()
            if not text:
                self._send_json(400, {"ok": False, "error": "請先輸入越南文。"})
                return
            if len(text) > MAX_CHARS:
                self._send_json(413, {"ok": False, "error": f"單段文字最多 {MAX_CHARS} 字，請縮短後再朗讀。"})
                return
            wav, cache_hit = synthesize_wav(text, voice_id)
            self._send_wav(wav, cache_hit)
        except ModuleNotFoundError as exc:
            self._send_json(500, {"ok": False, "error": f"缺少 Python 套件：{exc.name or exc}. 請先執行 setup.ps1，或改用 VIENEU_MODE=turbo。"})
        except Exception as exc:
            self._send_json(500, {"ok": False, "error": f"VieNeu-TTS 產生失敗：{exc}"})

    def log_message(self, fmt, *args):
        print(f"[VieNeu-TTS] {self.address_string()} - {fmt % args}")


def main():
    print(f"VieNeu-TTS local server: http://{HOST}:{PORT}")
    print(f"Mode: {MODE}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
