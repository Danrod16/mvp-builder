const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("dist/index.html is missing. Run eleventy before syncing GitHub Pages output.");
  process.exit(1);
}

function copyFile(rel) {
  const from = path.join(dist, rel);
  const to = path.join(root, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(rel) {
  const from = path.join(dist, rel);
  const to = path.join(root, rel);
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

for (const file of ["index.html", "404.html", "sitemap.xml"]) copyFile(file);
for (const dir of [
  "css",
  "js",
  "assets",
  "blog",
  "work",
  "ai-automation-for-small-business",
  "ai-agents-explained"
]) {
  copyDir(dir);
}

console.log("Synced Eleventy output to the GitHub Pages root.");
