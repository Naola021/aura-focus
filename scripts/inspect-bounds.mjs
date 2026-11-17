import sharp from "sharp";
import path from "node:path";

const inputPath = "C:\\Users\\G-Trader\\.gemini\\antigravity\\brain\\57f3ff44-59a5-4014-b507-4831902ed378\\tony_stark_hud_input.jpg";

async function main() {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(`Image size: ${width}x${height}, channels: ${channels}`);

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let count = 0;

  for (let y = 50; y < 350; y++) {
    for (let x = 200; x < 850; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // The red neon timer digits: bright red, high contrast over g and b
      if (r > 160 && (r - g > 65) && (r - b > 50)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        count++;
      }
    }
  }

  console.log(`Found ${count} red timer pixels.`);
  console.log(`Timer bounding box: X=[${minX}, ${maxX}] (width ${maxX - minX}), Y=[${minY}, ${maxY}] (height ${maxY - minY})`);

  // Now search for the horizontal progress bar line (y: 250 to 320, x: 340 to 680)
  // Progress line has r ≈ g ≈ b and is noticeably brighter than surrounding skin
  let lineMinY = height, lineMaxY = 0, lineMinX = width, lineMaxX = 0;
  let lineCount = 0;

  for (let y = 250; y < 320; y++) {
    for (let x = 340; x < 680; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const avg = (r + g + b) / 3;
      const isGray = Math.abs(r - g) < 20 && Math.abs(r - b) < 20;
      if (isGray && avg > 120 && avg < 210) {
        if (x < lineMinX) lineMinX = x;
        if (x > lineMaxX) lineMaxX = x;
        if (y < lineMinY) lineMinY = y;
        if (y > lineMaxY) lineMaxY = y;
        lineCount++;
      }
    }
  }

  console.log(`Progress line box: X=[${lineMinX}, ${lineMaxX}], Y=[${lineMinY}, ${lineMaxY}] (count ${lineCount})`);
}

main().catch(console.error);
