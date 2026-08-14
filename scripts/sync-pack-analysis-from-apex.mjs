/**
 * Pull live Apex configs into _pack_analysis for wiki parsers.
 *
 *   node --env-file=../pokehaven-status-bot/.env scripts/sync-pack-analysis-from-apex.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ftpMod = await import(
  pathToFileURL(
    path.resolve(__dirname, "..", "..", "pokehaven-status-bot", "scripts", "lib", "apex-ftp.mjs")
  ).href
);
const { connectFtp, joinRemote, resolveServerRoot } = ftpMod;
const PACK = path.resolve(__dirname, "..", "..", "_pack_analysis");
const CONFIG_LOCAL = path.join(PACK, "overrides", "config");
const ARCHIVE = path.resolve(
  __dirname,
  "..",
  "..",
  "_archive",
  `${new Date().toISOString().slice(0, 10)}-wiki-parse-live`
);

const DIRS = [
  "cobbledollars",
  "cobblemonraiddens",
  "cobblemon",
  "cobblemon-economy",
  "cobbreeding",
  "mega_showdown",
  "voicechat",
];

const FILES = [
  "mobsbegone-blacklist.json",
  "waystones-common.toml",
  "ftbchunks-world.snbt",
  "rctmod-server.toml",
  "hearthstonemod-common.toml",
];

async function main() {
  if (!fs.existsSync(CONFIG_LOCAL)) {
    throw new Error(`Missing pack analysis config: ${CONFIG_LOCAL}`);
  }
  fs.mkdirSync(ARCHIVE, { recursive: true });

  const { client, env } = await connectFtp();
  try {
    const root = await resolveServerRoot(client, env.remoteRoot);
    console.log(`Server root: ${root}`);
    console.log(`Updating: ${CONFIG_LOCAL}`);
    console.log(`Archive copy: ${ARCHIVE}`);

    for (const dir of DIRS) {
      const remote = joinRemote(root, `config/${dir}`);
      const local = path.join(CONFIG_LOCAL, dir);
      const arch = path.join(ARCHIVE, "config", dir);
      fs.mkdirSync(local, { recursive: true });
      fs.mkdirSync(arch, { recursive: true });
      try {
        await client.downloadToDir(local, remote);
        await client.downloadToDir(arch, remote);
        console.log(`OK  config/${dir}/`);
      } catch (err) {
        console.log(`--  config/${dir}/  (${err.message})`);
      }
    }

    for (const file of FILES) {
      const remote = joinRemote(root, `config/${file}`);
      const local = path.join(CONFIG_LOCAL, file);
      const arch = path.join(ARCHIVE, "config", file);
      fs.mkdirSync(path.dirname(arch), { recursive: true });
      try {
        await client.downloadTo(local, remote);
        await client.downloadTo(arch, remote);
        console.log(`OK  config/${file}`);
      } catch (err) {
        console.log(`--  config/${file}  (${err.message})`);
      }
    }

    // World hearthstone datapack (recipe truth)
    const hsRemote = joinRemote(root, "PokeHaven/datapacks/pokehaven-hearthstone-cobble.zip");
    const hsLocal = path.join(ARCHIVE, "PokeHaven/datapacks/pokehaven-hearthstone-cobble.zip");
    fs.mkdirSync(path.dirname(hsLocal), { recursive: true });
    try {
      await client.downloadTo(hsLocal, hsRemote);
      console.log(`OK  ${hsRemote}`);
    } catch (err) {
      console.log(`--  hearthstone datapack  (${err.message})`);
    }

    const summary = {
      pulledAt: new Date().toISOString(),
      packConfig: CONFIG_LOCAL,
      archive: ARCHIVE,
    };
    fs.writeFileSync(path.join(ARCHIVE, "summary.json"), JSON.stringify(summary, null, 2));
    console.log("\nDone.");
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
