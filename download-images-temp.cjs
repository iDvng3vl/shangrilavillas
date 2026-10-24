const fs = require("fs");
const path = require("path");

const root = process.cwd();
const files = ["src/App.jsx", "src/App.css"];
const out = path.join(root, "public", "images");

fs.mkdirSync(out, { recursive: true });

async function main() {
  const urls = new Set();

  for (const file of files) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
      console.log("File not found:", file);
      continue;
    }

    const content = fs.readFileSync(full, "utf8");
    const matches = content.match(/https:\/\/images\.unsplash\.com\/[^"'`\s)]+/g) || [];
    matches.forEach(url => urls.add(url));
  }

  if (!urls.size) {
    console.log("No Unsplash URLs found in src/App.jsx or src/App.css.");
    return;
  }

  const replacements = new Map();
  let i = 0;

  for (const url of urls) {
    i++;
    const number = String(i).padStart(2, "0");

    try {
      console.log(`Downloading ${i}/${urls.size}...`);
      const response = await fetch(url);

      if (!response.ok) throw new Error("HTTP " + response.status);

      const type = (response.headers.get("content-type") || "").split(";")[0];
      const ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif"
      }[type];

      if (!ext) throw new Error("Unexpected content type: " + type);

      const filename = `shangrila-${number}.${ext}`;
      fs.writeFileSync(path.join(out, filename), Buffer.from(await response.arrayBuffer()));
      replacements.set(url, `/images/${filename}`);
      console.log("Saved public/images/" + filename);
    } catch (error) {
      console.log("Download failed:", error.message);
    }
  }

  for (const file of files) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue;

    let content = fs.readFileSync(full, "utf8");
    let changed = false;

    for (const [url, local] of replacements) {
      if (content.includes(url)) {
        content = content.split(url).join(local);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(full, content, "utf8");
      console.log("Updated", file);
    }
  }

  console.log(`Finished: downloaded ${replacements.size} of ${urls.size} unique images.`);
}

main();
