import { spawn } from "node:child_process";
import { closeSync, createReadStream, existsSync, openSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 5178);
const vieneuBaseUrl = process.env.VIENEU_TTS_URL || "http://127.0.0.1:8765";
const vieneuLocalDir = join(root, "tts", "vieneu-local");
const vieneuServerScript = join(vieneuLocalDir, "server.py");
const vieneuPython = join(vieneuLocalDir, ".venv", "Scripts", "python.exe");
let vieneuStartPromise = null;

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const fullPath = normalize(join(root, requested));
  return fullPath.startsWith(root) ? fullPath : null;
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(payload));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 1200) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function isVieneuHealthy() {
  try {
    const response = await fetchWithTimeout(`${vieneuBaseUrl}/health`, {}, 900);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForVieneuHealth(timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isVieneuHealthy()) return true;
    await sleep(450);
  }
  return false;
}

async function ensureVieneuStarted({ wait = true } = {}) {
  if (await isVieneuHealthy()) return true;

  if (!existsSync(vieneuPython) || !existsSync(vieneuServerScript)) {
    return false;
  }

  if (!vieneuStartPromise) {
    vieneuStartPromise = (async () => {
      const out = openSync(join(root, ".vieneu.out.log"), "a");
      const err = openSync(join(root, ".vieneu.err.log"), "a");
      try {
        const child = spawn(vieneuPython, [vieneuServerScript], {
          cwd: vieneuLocalDir,
          detached: true,
          stdio: ["ignore", out, err],
          windowsHide: true,
          env: { ...process.env, VIENEU_MODE: process.env.VIENEU_MODE || "turbo" },
        });
        child.unref();
      } finally {
        closeSync(out);
        closeSync(err);
      }
      return waitForVieneuHealth(12000);
    })().finally(() => {
      vieneuStartPromise = null;
    });
  }

  return wait ? vieneuStartPromise : true;
}

function readRequestBody(request, maxBytes = 20_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("Request body too large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

async function proxyVieneuTts(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Use POST /api/vieneu/tts" });
    return;
  }

  let body = "";
  try {
    body = await readRequestBody(request);
  } catch {
    sendJson(response, 413, { error: "文字太長，請縮短後再朗讀。" });
    return;
  }

  try {
    await ensureVieneuStarted({ wait: true });
    const backend = await fetch(`${vieneuBaseUrl}/tts`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    const buffer = Buffer.from(await backend.arrayBuffer());
    response.writeHead(backend.status, {
      "content-type": backend.headers.get("content-type") || "audio/wav",
      "cache-control": "no-store",
      "x-vieneu-cache": backend.headers.get("x-vieneu-cache") || "",
    });
    response.end(buffer);
  } catch {
    sendJson(response, 503, {
      error: "VieNeu-TTS 本機服務尚未啟動，已嘗試自動啟動但尚未成功。請確認 tts/vieneu-local/setup.ps1 已執行完成。",
    });
  }
}

async function proxyVieneuHealth(response) {
  await ensureVieneuStarted({ wait: true });
  try {
    const backend = await fetch(`${vieneuBaseUrl}/health`);
    const payload = await backend.json();
    sendJson(response, backend.status, payload);
  } catch {
    sendJson(response, 503, { ok: false, error: "VieNeu-TTS 本機服務未啟動。" });
  }
}

async function proxyVieneuVoices(response) {
  await ensureVieneuStarted({ wait: true });
  try {
    const backend = await fetch(`${vieneuBaseUrl}/voices`);
    const payload = await backend.json();
    sendJson(response, backend.status, payload);
  } catch {
    sendJson(response, 503, { ok: false, error: "VieNeu-TTS 本機服務未啟動。" });
  }
}

async function proxyVieneuCacheStatus(response) {
  await ensureVieneuStarted({ wait: true });
  try {
    const backend = await fetch(`${vieneuBaseUrl}/cache/status`);
    const payload = await backend.json();
    sendJson(response, backend.status, payload);
  } catch {
    sendJson(response, 503, { ok: false, error: "VieNeu-TTS 本機服務未啟動。" });
  }
}

async function proxyVieneuCacheClear(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Use POST /api/vieneu/cache/clear" });
    return;
  }

  try {
    await ensureVieneuStarted({ wait: true });
    const backend = await fetch(`${vieneuBaseUrl}/cache/clear`, { method: "POST" });
    const payload = await backend.json();
    sendJson(response, backend.status, payload);
  } catch {
    sendJson(response, 503, { ok: false, error: "VieNeu-TTS 本機服務未啟動。" });
  }
}

createServer(async (request, response) => {
  const pathname = new URL(request.url || "/", `http://localhost:${port}`).pathname;
  if (pathname === "/api/vieneu/tts") {
    await proxyVieneuTts(request, response);
    return;
  }
  if (pathname === "/api/vieneu/health") {
    await proxyVieneuHealth(response);
    return;
  }
  if (pathname === "/api/vieneu/voices") {
    await proxyVieneuVoices(response);
    return;
  }
  if (pathname === "/api/vieneu/cache/status") {
    await proxyVieneuCacheStatus(response);
    return;
  }
  if (pathname === "/api/vieneu/cache/clear") {
    await proxyVieneuCacheClear(request, response);
    return;
  }

  const fullPath = resolvePath(request.url || "/");

  if (!fullPath || !existsSync(fullPath) || statSync(fullPath).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": types[extname(fullPath)] || "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(fullPath).pipe(response);
}).listen(port, () => {
  console.log(`Southern Vietnamese learning site: http://localhost:${port}`);
  console.log(`VieNeu-TTS proxy: ${vieneuBaseUrl}`);
  ensureVieneuStarted({ wait: false });
});
