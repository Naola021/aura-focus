import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9222;
const USER_DATA = path.join(process.cwd(), ".edge-temp-profile");

async function main() {
  console.log("Launching Edge headless on port", PORT);
  const edge = spawn(EDGE_PATH, [
    "--headless",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1280,900",
    "--disable-gpu",
    "about:blank",
  ]);

  // Wait for debugger port
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
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  if (!endpoint) {
    console.error("Failed to connect to Edge debugging port");
    edge.kill();
    process.exit(1);
  }

  // Get pages
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

  console.log("Navigating to http://localhost:3000/focus?tab=stats");
  await send("Page.navigate", { url: "http://localhost:3000/focus?tab=stats" });
  await new Promise((r) => setTimeout(r, 1500));

  // Seed history with attached tasks
  const sampleHistory = [
    {
      id: "hist-1",
      startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      endedAt: new Date(Date.now() - 3600000).toISOString(),
      durationMs: 45 * 60 * 1000,
      mode: "focus",
      completed: true,
      subjectId: "sub-1",
      subjectName: "Deep Systems",
      subjectColor: "#ef4444",
      tasksCompleted: 3,
      tasksTotal: 3,
      tasks: [
        { id: "t1", text: "Calibrate HUD telemetry stream", done: true },
        { id: "t2", text: "Verify Jarvis target acquisition link", done: true },
        { id: "t3", text: "Patch auxiliary flight core", done: true },
      ],
    },
    {
      id: "hist-2",
      startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      endedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      durationMs: 30 * 60 * 1000,
      mode: "focus",
      completed: true,
      subjectId: "sub-2",
      subjectName: "Tactical UI",
      subjectColor: "#3b82f6",
      tasksCompleted: 1,
      tasksTotal: 2,
      tasks: [
        { id: "t4", text: "Wire Pepper Potts secure comms", done: true },
        { id: "t5", text: "Arc reactor energy reserve test", done: false },
      ],
    },
    {
      id: "hist-3",
      startedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      endedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
      durationMs: 25 * 60 * 1000,
      mode: "focus",
      completed: true,
      subjectId: "sub-3",
      subjectName: "Mark VII Diagnostics",
      subjectColor: "#10b981",
      tasksCompleted: 2,
      tasksTotal: 2,
      tasks: [
        { id: "t6", text: "Zero-out scanline interference", done: true },
        { id: "t7", text: "Run thermal dissipation benchmark", done: true },
      ],
    },
  ];

  await send("Runtime.evaluate", {
    expression: `
      localStorage.setItem("aura:history", JSON.stringify(${JSON.stringify(sampleHistory)}));
      localStorage.setItem("aura:profile", JSON.stringify({ name: "Tony Stark", dailyTarget: { hours: 3 } }));
      window.location.reload();
    `,
  });

  await new Promise((r) => setTimeout(r, 2000));

  console.log("Capturing screenshot of Stats view with attached tasks...");
  const screenshotRes = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });

  const buffer = Buffer.from(screenshotRes.data, "base64");
  const localPath = path.join(process.cwd(), "..", "aura-stats-tasks-live.png");
  const artifactPath = "C:\\Users\\G-Trader\\.gemini\\antigravity\\brain\\57f3ff44-59a5-4014-b507-4831902ed378\\aura-stats-tasks-live.png";

  fs.writeFileSync(localPath, buffer);
  fs.writeFileSync(artifactPath, buffer);
  console.log("Screenshot successfully saved to:", localPath, "and", artifactPath);

  ws.close();
  edge.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
