// One-off: BFS from index.html (and nl/index.html) following internal <a href> links
// to find pages that exist on disk but are unreachable by clicking through the site.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function crawl(startFile, startDir) {
  const visited = new Set();
  const queue = [{ file: startFile, dir: startDir }];
  while (queue.length) {
    const { file, dir } = queue.pop();
    const key = path.relative(root, path.join(dir, file));
    if (visited.has(key)) continue;
    visited.add(key);
    const full = path.join(dir, file);
    if (!fs.existsSync(full)) continue;
    const html = fs.readFileSync(full, "utf8");
    const hrefRe = /href="([^"]+\.html)(#[^"]*)?"/g;
    let m;
    while ((m = hrefRe.exec(html))) {
      const target = m[1];
      if (/^https?:\/\//.test(target)) continue;
      const resolved = path.normalize(path.join(dir, target));
      const relKey = path.relative(root, resolved);
      if (!visited.has(relKey)) {
        queue.push({ file: path.basename(resolved), dir: path.dirname(resolved) });
      }
    }
  }
  return visited;
}

const visitedEn = crawl("index.html", root);
const visitedNl = crawl("index.html", path.join(root, "nl"));
const allVisited = new Set([...visitedEn, ...visitedNl]);

const enFiles = fs.readdirSync(path.join(root, "pages")).filter((f) => f.endsWith(".html"));
const nlFiles = fs.readdirSync(path.join(root, "nl", "pages")).filter((f) => f.endsWith(".html"));

const unreachableEn = enFiles.filter((f) => !allVisited.has(path.join("pages", f)));
const unreachableNl = nlFiles.filter((f) => !allVisited.has(path.join("nl", "pages", f)));

console.log("Reachable EN+NL nodes from both home pages:", allVisited.size);
console.log("=== UNREACHABLE EN PAGES (exist on disk, no path from index.html) ===");
console.log(unreachableEn);
console.log("=== UNREACHABLE NL PAGES ===");
console.log(unreachableNl);
