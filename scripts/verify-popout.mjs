import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const USER_DATA = path.join(process.env.TEMP || "C:\\Temp", "chrome-aura-popout-" + Date.now());

async function run() {
  console.log("Launching Chrome headless on port", PORT);
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1280,850",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "http://localhost:3000/focus?theme=stark",
  ]);

  let endpoint = null;
  for (let i = 0; i < 20; i++) {
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
    console.error("Failed to connect to Chrome debugging port");
    chrome.kill();
    process.exit(1);
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
  await send("Runtime.enable");

  // Wait 3s for dashboard and fonts to hydrate
  await new Promise((r) => setTimeout(r, 3000));

  console.log("Clicking the Popout button directly in the DOM...");
  const clickRes = await send("Runtime.evaluate", {
    expression: `
      (() => {
        const btn = document.querySelector('button[title*="Popout"], button[title*="Keep on top"]');
        if (!btn) return "Button not found";
        btn.click();
        return "Clicked Popout button";
      })()
    `,
  });
  console.log("Click result:", clickRes);

  // Wait 1.5s for floating mini timer to render
  await new Promise((r) => setTimeout(r, 1500));

  const checkDom = await send("Runtime.evaluate", {
    expression: `
      (() => {
        const mini = document.querySelector('div[class*="fixed bottom-5 right-5"]');
        return {
          foundMiniTimer: Boolean(mini),
          miniStyle: mini ? mini.getAttribute('style') : null,
          miniClasses: mini ? mini.className : null,
        };
      })()
    `,
  });
  console.log("Popout DOM status:", checkDom);

  console.log("Capturing screenshot of Stark theme with popout mini timer...");
  const screenshotRes = await send("Page.captureScreenshot", {
    format: "png",
  });

  const buffer = Buffer.from(screenshotRes.data, "base64");
  const artifactDir = "C:\\Users\\G-Trader\\.gemini\\antigravity\\brain\\57f3ff44-59a5-4014-b507-4831902ed378";
  const artifactPath = path.join(artifactDir, "aura-popout-stark-live.png");
  fs.writeFileSync(artifactPath, buffer);
  console.log("Screenshot successfully saved to:", artifactPath);

  ws.close();
  chrome.kill();

  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
