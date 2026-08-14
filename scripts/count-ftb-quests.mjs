import fs from "node:fs";
import path from "node:path";

const questsDir =
  process.argv[2] ||
  path.resolve("D:/COBBLEVERSE/_archive/2026-08-14-wiki-datapacks-quests/config/ftbquests/quests");
const chaptersDir = path.join(questsDir, "chapters");
const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".snbt"));

let quests = 0;
const per = [];
for (const f of files) {
  const text = fs.readFileSync(path.join(chaptersDir, f), "utf8");
  // Quest objects: three tabs before id: "16-hex" (chapter=1, reward/task=4+)
  const ids = text.match(/^\t\t\tid: "[0-9A-Fa-f]{16}"/gm) || [];
  quests += ids.length;
  per.push({ file: f.replace(/\.snbt$/, ""), quests: ids.length });
}
per.sort((a, b) => b.quests - a.quests);
console.log(JSON.stringify({ chapters: files.length, quests, per }, null, 2));
