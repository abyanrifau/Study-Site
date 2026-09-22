/** Renders the app icons once, from an inline SVG, so there are no binary assets to track. */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(OUT, { recursive: true });

const svg = (size, padded) => {
  const r = Math.round(size * 0.22);
  const fs1 = Math.round(size * (padded ? 0.26 : 0.32));
  const fs2 = Math.round(size * (padded ? 0.13 : 0.15));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${padded ? 0 : r}" fill="#0f7d72"/>
  <text x="50%" y="${padded ? "50%" : "47%"}" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        font-size="${fs1}" font-weight="700" fill="#ffffff" letter-spacing="${size * 0.01}">IAL</text>
  <text x="50%" y="${padded ? "70%" : "68%"}" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        font-size="${fs2}" font-weight="500" fill="#a8e0d8">revision</text>
</svg>`;
};

const jobs = [
  { file: "icon-192.png", size: 192, padded: false },
  { file: "icon-512.png", size: 512, padded: false },
  { file: "icon-maskable-512.png", size: 512, padded: true },
  { file: "apple-touch-icon.png", size: 180, padded: true },
];

for (const j of jobs) {
  await sharp(Buffer.from(svg(j.size, j.padded))).png().toFile(path.join(OUT, j.file));
  console.log("  icon", j.file);
}

fs.writeFileSync(path.join(process.cwd(), "public", "favicon.svg"), svg(64, false));
console.log("icons written");
