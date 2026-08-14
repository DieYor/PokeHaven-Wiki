/**
 * Pull live Apex datapacks + FTB Quests into _pack_analysis / archive.
 *
 *   node --env-file=../pokehaven-status-bot/.env scripts/sync-datapacks-quests-from-apex.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ftpMod = await import(
  pathToFileURL(
    path.resolve(__dirname, "..", "..", "pokehaven-status-bot", "scripts", "lib", "apex-ftp.mjs")
  ).href
);
const { connectFtp, joinRemote, resolveServerRoot, listEntries } = ftpMod;

const PACK = path.resolve(__dirname, "..", "..", "_pack_analysis");
const DP_PEEK = path.join(PACK, "_dp_peek");
const stamp = new Date().toISOString().slice(0, 10);
const ARCHIVE = path.resolve(__dirname, "..", "..", "_archive", `${stamp}-wiki-datapacks-quests`);

const DATAPACK_ZIPS = [
  {
    remote: "datapacks/COBBLEVERSE-DP-v21-CF-Apex.zip",
    extractAs: "COBBLEVERSE-DP-v21-CF",
  },
  {
    remote: "datapacks/COBBLEVERSE-RCT-DP-v20.zip",
    extractAs: "COBBLEVERSE-RCT-DP-v20",
  },
  {
    remote: "datapacks/COBBLEVERSE-Loot-DP-v11.zip",
    extractAs: "COBBLEVERSE-Loot-DP-v11",
  },
];

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function extractZip(zipPath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  // Prefer Expand-Archive (Windows); fall back to tar (Win10+)
  try {
    execFileSync(
      "powershell.exe",
      ["-NoProfile", "-Command", `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}' -Force`],
      { stdio: "inherit" }
    );
    return;
  } catch {
    /* try tar */
  }
  execFileSync("tar", ["-xf", zipPath, "-C", destDir], { stdio: "inherit" });
}

/** If zip contains a single top-level folder, return that path; else destDir. */
function unwrapSingleRoot(destDir) {
  const kids = fs.readdirSync(destDir).filter((n) => !n.startsWith("."));
  if (kids.length === 1) {
    const only = path.join(destDir, kids[0]);
    if (fs.statSync(only).isDirectory()) return only;
  }
  return destDir;
}

function countFtbQuests(questsDir) {
  const chaptersDir = path.join(questsDir, "chapters");
  if (!fs.existsSync(chaptersDir)) {
    return { chapters: 0, quests: 0, files: [] };
  }
  const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".snbt"));
  let quests = 0;
  for (const f of files) {
    const text = fs.readFileSync(path.join(chaptersDir, f), "utf8");
    // Quest objects: three tabs before id: "16-hex" (chapter=1, reward/task=4+)
    const matches = text.match(/^\t\t\tid: "[0-9A-Fa-f]{16}"/gm) || [];
    quests += matches.length;
  }
  return { chapters: files.length, quests, files };
}

async function main() {
  fs.mkdirSync(ARCHIVE, { recursive: true });
  fs.mkdirSync(DP_PEEK, { recursive: true });

  const { client, env } = await connectFtp();
  try {
    const root = await resolveServerRoot(client, env.remoteRoot);
    console.log(`Server root: ${root}`);
    console.log(`Archive: ${ARCHIVE}`);
    console.log(`_dp_peek: ${DP_PEEK}\n`);

    const listing = await listEntries(client, joinRemote(root, "datapacks"));
    if (listing) {
      console.log("Live datapacks/:");
      for (const e of listing) console.log(`  ${e.isDir ? "[dir]" : "[file]"} ${e.name}`);
      console.log("");
    }

    for (const pack of DATAPACK_ZIPS) {
      const remote = joinRemote(root, pack.remote);
      const zipLocal = path.join(ARCHIVE, "datapacks", path.basename(pack.remote));
      fs.mkdirSync(path.dirname(zipLocal), { recursive: true });
      console.log(`Downloading ${pack.remote}…`);
      await client.downloadTo(zipLocal, remote);
      console.log(`OK  ${zipLocal} (${(fs.statSync(zipLocal).size / 1024 / 1024).toFixed(2)} MB)`);

      const extractTmp = path.join(ARCHIVE, "extract-tmp", pack.extractAs);
      rmrf(extractTmp);
      extractZip(zipLocal, extractTmp);
      const contentRoot = unwrapSingleRoot(extractTmp);

      const target = path.join(DP_PEEK, pack.extractAs);
      rmrf(target);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.cpSync(contentRoot, target, { recursive: true });
      console.log(`OK  extracted → _dp_peek/${pack.extractAs}\n`);
    }

    // FTB Quests (config, not world save)
    const questsRemote = joinRemote(root, "config/ftbquests/quests");
    const questsLocal = path.join(ARCHIVE, "config/ftbquests/quests");
    rmrf(questsLocal);
    fs.mkdirSync(questsLocal, { recursive: true });
    console.log("Downloading config/ftbquests/quests/…");
    await client.downloadToDir(questsLocal, questsRemote);
    console.log(`OK  ${questsLocal}`);

    const counts = countFtbQuests(questsLocal);
    const summary = {
      pulledAt: new Date().toISOString(),
      datapacks: DATAPACK_ZIPS.map((p) => p.remote),
      dpPeek: DP_PEEK,
      ftbQuests: {
        path: questsLocal,
        chapters: counts.chapters,
        quests: counts.quests,
        chapterFiles: counts.files,
      },
    };
    fs.writeFileSync(path.join(ARCHIVE, "summary.json"), JSON.stringify(summary, null, 2));
    console.log("\n=== FTB Quests counts ===");
    console.log(`Chapters: ${counts.chapters}`);
    console.log(`Quests:   ${counts.quests}`);
    console.log("\nDone.");
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
