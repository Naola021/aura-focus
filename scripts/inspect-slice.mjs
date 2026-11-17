import sharp from "sharp";

const inputPath = "C:\\Users\\G-Trader\\.gemini\\antigravity\\brain\\57f3ff44-59a5-4014-b507-4831902ed378\\tony_stark_hud_input.jpg";

async function main() {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, channels } = info;

  console.log("Vertical slice at X=500 from Y=240 to Y=320:");
  for (let y = 240; y <= 320; y += 2) {
    const idx = (y * width + 500) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    console.log(`y=${y}: R=${r}, G=${g}, B=${b}`);
  }
}

main().catch(console.error);
