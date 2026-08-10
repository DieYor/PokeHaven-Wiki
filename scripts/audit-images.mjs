// One-off: check that every <img src="..."> in generated pages resolves to a real file.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dirs = [
  { dir: path.join(root, "pages"), lang: "EN" },
  { dir: path.join(root, "nl", "pages"), lang: "NL" },
];

const missing = [];
for (const { dir, lang } of dirs) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
  for (const f of files) {
    const html = fs.readFileSync(path.join(dir, f), "utf8");
    const re = /<img[^>]+src="([^"]+)"/g;
    let m;
    while ((m = re.exec(html))) {
      const src = m[1];
      if (/^https?:\/\//.test(src)) continue;
      const resolved = path.normalize(path.join(dir, src));
      if (!fs.existsSync(resolved)) missing.push({ lang, file: f, src });
    }
  }
}
console.log("Missing images:", JSON.stringify(missing, null, 2));
console.log("Total missing:", missing.length);
