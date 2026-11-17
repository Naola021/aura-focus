import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9223;
// Store temp profile in os tmp directory so it never pollutes the project
const USER_DATA = path.join(process.env.TEMP || "C:\\Temp", "edge-aura-profile-" + Date.now());

async function captureUrl(url, outputPath, artifactPath) {
  console.log("Navigating to:", url);
  const edge = spawn(EDGE_PATH, [
    "--headless",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1280,800",
    "--disable-gpu",
    url,
  ]);

  let endpoint = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        const json = await res.json();
        endpoint = json.webSocketDebuggerUrl;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!endpoint) {
    console.error("Failed to connect to Edge debugging port");
    edge.kill();
    return;
  }

  const pagesRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const pages = await pagesRes.json();
  const pageWsUrl = pages[0]?.webSocketDebuggerUrl || endpoint;

  const ws = new WebSocket(pageWsUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let idCounter = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = idCounter++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener("message", handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send("Page.enable");
  // Wait 2.5s for fonts and wallpaper to render smoothly
  await new Promise((r) => setTimeout(r, 2500));

  const screenshotRes = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });

  const buffer = Buffer.from(screenshotRes.data, "base64");
  fs.writeFileSync(outputPath, buffer);
  if (artifactPath) {
    fs.writeFileSync(artifactPath, buffer);
  }
  console.log("Saved screenshot:", outputPath);

  ws.close();
  edge.kill();
  await new Promise((r) => setTimeout(r, 500));
}

async function main() {
  const artifactDir = "C:\\Users\\G-Trader\\.gemini\\antigravity\\brain\\57f3ff44-59a5-4014-b507-4831902ed378";

  // 1. Capture 50% zoom in Stark theme
  await captureUrl(
    "http://localhost:3000/focus?theme=stark&zoom=50",
    path.join(process.cwd(), "..", "aura-zoom-50-fixed.png"),
    path.join(artifactDir, "aura-zoom-50-fixed.png")
  );

  // 2. Capture 100% zoom in Stark theme
  await captureUrl(
    "http://localhost:3000/focus?theme=stark&zoom=100",
    path.join(process.cwd(), "..", "aura-zoom-100-fixed.png"),
    path.join(artifactDir, "aura-zoom-100-fixed.png")
  );

  // Clean up temp dir if possible
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}

  console.log("Verification screenshots captured successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
