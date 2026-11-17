import sharp from "sharp";
import fs from "node:fs";

const inputPath = "C:\\Users\\G-Trader\\.gemini\\antigravity\\brain\\57f3ff44-59a5-4014-b507-4831902ed378\\tony_stark_hud_input.jpg";
const outputPath = "C:\\Users\\G-Trader\\.gemini\\antigravity\\brain\\57f3ff44-59a5-4014-b507-4831902ed378\\scratch\\sharp_clean_result.jpg";

async function main() {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);

  function getPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return [0, 0, 0];
    const idx = (y * width + x) * channels;
    return [pixels[idx], pixels[idx + 1], pixels[idx + 2]];
  }

  function setPixel(x, y, r, g, b) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * channels;
    pixels[idx] = Math.min(255, Math.max(0, Math.round(r)));
    pixels[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
    pixels[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
  }

  // 1. Remove the thin horizontal progress lines and reticle lines on the nose (y: 256-262 and y: 277-285, x: 360-660)
  for (let x = 340; x <= 670; x++) {
    // Upper reticle line (y: 256-260)
    for (let y = 256; y <= 260; y++) {
      const topP = getPixel(x, 254);
      const botP = getPixel(x, 262);
      const t = (y - 254) / 8;
      setPixel(
        x, y,
        (1 - t) * topP[0] + t * botP[0],
        (1 - t) * topP[1] + t * botP[1],
        (1 - t) * topP[2] + t * botP[2]
      );
    }

    // Lower progress bar line (y: 277-284)
    for (let y = 277; y <= 284; y++) {
      const topP = getPixel(x, 275);
      const botP = getPixel(x, 286);
      const t = (y - 275) / 11;
      setPixel(
        x, y,
        (1 - t) * topP[0] + t * botP[0],
        (1 - t) * topP[1] + t * botP[1],
        (1 - t) * topP[2] + t * botP[2]
      );
    }
  }

  // 2. Identify the mask for the red timer digits '00:30:00'
  // Bounding box: y from 110 to 220, x from 200 to 760
  const mask = new Uint8Array(width * height); // 1 = mask, 0 = keep
  for (let y = 110; y <= 220; y++) {
    for (let x = 200; x <= 760; x++) {
      const [r, g, b] = getPixel(x, y);
      // Digits are vibrant red/pink
      if (r > 150 && (r - g > 55) && (r - b > 40)) {
        mask[y * width + x] = 1;
      }
    }
  }

  // Dilate mask by 3px to cover antialiased edges
  const dilatedMask = new Uint8Array(width * height);
  const DILATE_R = 3;
  for (let y = 110; y <= 220; y++) {
    for (let x = 200; x <= 760; x++) {
      if (mask[y * width + x] === 1) {
        for (let dy = -DILATE_R; dy <= DILATE_R; dy++) {
          for (let dx = -DILATE_R; dx <= DILATE_R; dx++) {
            if (dx * dx + dy * dy <= DILATE_R * DILATE_R) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                dilatedMask[ny * width + nx] = 1;
              }
            }
          }
        }
      }
    }
  }

  // 3. In the glow region (halo of 14px around digits), suppress the diffuse red flare
  const GLOW_R = 14;
  for (let y = 100; y <= 230; y++) {
    for (let x = 190; x <= 770; x++) {
      if (dilatedMask[y * width + x] === 0) {
        // Check if near digit
        let near = false;
        for (let dy = -GLOW_R; dy <= GLOW_R && !near; dy += 2) {
          for (let dx = -GLOW_R; dx <= GLOW_R && !near; dx += 2) {
            if (dx * dx + dy * dy <= GLOW_R * GLOW_R) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                if (mask[ny * width + nx] === 1) near = true;
              }
            }
          }
        }

        if (near) {
          const [r, g, b] = getPixel(x, y);
          // Forehead skin natural ratio is R <= 1.4 * G
          const targetR = g * 1.35;
          if (r > targetR && r - g > 30) {
            const correctedR = targetR + (r - targetR) * 0.15;
            setPixel(x, y, correctedR, g, b);
          }
        }
      }
    }
  }

  // 4. Inpaint the masked stroke pixels using distance-weighted averaging of surrounding unmasked pixels
  const INPAINT_RADIUS = 7;
  // Multi-pass inpainting from boundary inwards
  // First pass: identify pixels to inpaint
  const toInpaint = [];
  for (let y = 105; y <= 225; y++) {
    for (let x = 195; x <= 765; x++) {
      if (dilatedMask[y * width + x] === 1) {
        toInpaint.push({ x, y });
      }
    }
  }

  // Perform inpainting
  for (const { x, y } of toInpaint) {
    let sumR = 0, sumG = 0, sumB = 0, sumW = 0;

    for (let dy = -INPAINT_RADIUS; dy <= INPAINT_RADIUS; dy++) {
      for (let dx = -INPAINT_RADIUS; dx <= INPAINT_RADIUS; dx++) {
        const distSq = dx * dx + dy * dy;
        if (distSq > 0 && distSq <= INPAINT_RADIUS * INPAINT_RADIUS) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            // Only sample UNMASKED pixels
            if (dilatedMask[ny * width + nx] === 0) {
              const w = 1.0 / (distSq * Math.sqrt(distSq));
              const [pr, pg, pb] = getPixel(nx, ny);
              sumR += pr * w;
              sumG += pg * w;
              sumB += pb * w;
              sumW += w;
            }
          }
        }
      }
    }

    if (sumW > 0) {
      setPixel(x, y, sumR / sumW, sumG / sumW, sumB / sumW);
    }
  }

  // Save the result
  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels }
  }).jpeg({ quality: 96 }).toFile(outputPath);

  console.log("Successfully generated:", outputPath);
}

main().catch(console.error);
