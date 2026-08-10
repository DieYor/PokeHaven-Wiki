// One-off: find duplicate writePage/track calls for the same filename+lang across all generator scripts.
import fs from "node:fs";
import path from "node:path";

const files = [
  "build.js",
  "nl-site.js",
  "deep-pages.js",
  "expansion-pages.js",
  "minecraft-guides.js",
  "advancement-copy.js",
];

const seenEn = new Map(); // file -> [{srcFile, line}]
const seenNl = new Map();

for (const f of files) {
  const full = path.join("scripts", f);
  const text = fs.readFileSync(full, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    const wp = line.match(/writePage\(\s*"([^"]+\.html)"/);
    const tr = line.match(/\btrack\(\s*"([^"]+\.html)"/);
    if (wp) {
      const key = wp[1];
      if (!seenEn.has(key)) seenEn.set(key, []);
      seenEn.get(key).push(`${f}:${i + 1}`);
    }
    if (tr) {
      const key = tr[1];
      if (!seenNl.has(key)) seenNl.set(key, []);
      seenNl.get(key).push(`${f}:${i + 1}`);
    }
  });
}

console.log("=== writePage() duplicates (EN-ish, includes NL calls routed via writePage(...,{lang:'nl'})) ===");
for (const [k, v] of seenEn) {
  if (v.length > 1) console.log(k, "->", v.join(", "));
}
console.log("=== track() duplicates (NL helper wrapper) ===");
for (const [k, v] of seenNl) {
  if (v.length > 1) console.log(k, "->", v.join(", "));
}
