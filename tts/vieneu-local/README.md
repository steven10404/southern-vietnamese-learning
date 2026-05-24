# VieNeu-TTS local service

This folder wraps the VieNeu-TTS Python SDK as a small local HTTP service for the Southern Vietnamese learning site.

The website calls:

```text
POST http://localhost:5178/api/vieneu/tts
```

The Node server proxies that request to:

```text
http://127.0.0.1:8765/tts
```

## Setup

Run this once in PowerShell:

```powershell
cd "C:\Users\steve\OneDrive\桌面\越南語學習(南越)\tts\vieneu-local"
.\setup.ps1
```

This installs the `vieneu` SDK in a local `.venv` under this folder. It may download model/runtime packages and can take a while.

## Start

The main website server now auto-starts this TTS service when needed. In normal use, start the website with `node server.mjs` from the project root, then open:

```text
http://localhost:5178/#southern-reader
```

Manual start is still available for debugging:

```powershell
cd "C:\Users\steve\OneDrive\桌面\越南語學習(南越)\tts\vieneu-local"
.\start.ps1
```

## Notes

- Default mode is `turbo`, because it avoids installing PyTorch and is the lightest CPU path.
- Default voice is `Xuân Vĩnh (Nam - Miền Nam)`, a Southern male preset exposed by the SDK.
- The website exposes only this male preset, matching the pre-female-voice version.
- The local service returns the original VieNeu WAV without time-stretching. The website can apply a tightly clamped browser playback rate from `0.95x` to `1.05x`.
- Generated VieNeu WAV files are cached under `tts/vieneu-local/cache/`, keyed by text, voice, and mode.
- Clear the cache with `powershell -ExecutionPolicy Bypass -File .\clear-cache.ps1` or `POST http://localhost:5178/api/vieneu/cache/clear`.
- Requests are serialized with a single synthesis lock because the local model is not treated as thread-safe.
- You can set `VIENEU_MODE=standard` before starting if you later install the GPU/standard dependencies.
- The site keeps browser `vi-VN` speech as fallback only.
- The Google Translate TTS path is no longer used by the Southern Reader block.
