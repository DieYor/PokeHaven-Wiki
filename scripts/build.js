import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { registerDeepPages, figure, guideImg } from "./deep-pages.js";
import { registerMinecraftGuides } from "./minecraft-guides.js";
import { registerExpansionPages } from "./expansion-pages.js";
import { UI, DISCORD_INVITE, altLangHref, relPrefixFor, critical } from "./i18n.js";
import { registerDutchSite } from "./nl-site.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PAGES = path.join(ROOT, "pages");
const DATA = path.join(ROOT, "data");

execSync("node scripts/parse-pack.js", { cwd: ROOT, stdio: "inherit" });
execSync("node scripts/parse-recipes.js", { cwd: ROOT, stdio: "inherit" });

const economy = JSON.parse(fs.readFileSync(path.join(DATA, "economy.json"), "utf8"));
const raids = JSON.parse(fs.readFileSync(path.join(DATA, "raids.json"), "utf8"));
const trainers = JSON.parse(fs.readFileSync(path.join(DATA, "trainers.json"), "utf8"));
const spawns = JSON.parse(fs.readFileSync(path.join(DATA, "spawns.json"), "utf8"));
const rates = JSON.parse(fs.readFileSync(path.join(DATA, "rates.json"), "utf8"));
const recipesMeta = JSON.parse(fs.readFileSync(path.join(DATA, "recipes-meta.json"), "utf8"));
const advancements = JSON.parse(fs.readFileSync(path.join(DATA, "advancements.json"), "utf8"));

fs.mkdirSync(PAGES, { recursive: true });
fs.mkdirSync(path.join(ROOT, "nl", "pages"), { recursive: true });

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout({
  title,
  file,
  lang = "en",
  breadcrumbs,
  body,
  infobox = "",
  lede = "",
  searchIndexTitle,
  hideToc = false,
  isHub = false,
  hideTitle = false,
}) {
  const ui = UI[lang] || UI.en;
  const assetPrefix = relPrefixFor(lang, file);
  const pagePrefix = file === "index.html" ? "" : "../";
  const crumbs = breadcrumbs || [];
  const crumb = crumbs.length
    ? `<div class="breadcrumbs">${crumbs
        .map((c, i) =>
          i === crumbs.length - 1
            ? `<span>${esc(c.label)}</span>`
            : `<a href="${c.href}">${esc(c.label)}</a>`
        )
        .join(" <span aria-hidden=\"true\">/</span> ")}</div>`
    : "";

  const navHtml = ui.nav
    .map(([label, pageFile]) => {
      const href =
        file === "index.html" ? `${pagePrefix}pages/${pageFile}` : pageFile;
      return `<a href="${href}">${esc(label)}</a>`;
    })
    .join("\n");

  const tocHtml = hideToc
    ? ""
    : `<div class="toc-box" id="toc"><h2>${esc(ui.contents)}</h2><ol></ol></div>`;

  const titleHtml = hideTitle
    ? ""
    : `<h1 class="article-title">${esc(title)}</h1>`;

  const switchToEn = lang === "en" ? "#" : altLangHref("nl", file);
  const switchToNl = lang === "nl" ? "#" : altLangHref("en", file);

  const langSwitch = `<div class="lang-switch" role="navigation" aria-label="Language">
    <a class="lang-btn ${lang === "en" ? "active" : ""}" href="${switchToEn}" hreflang="en" title="${esc(UI.en.langEn)}" ${lang === "en" ? 'aria-current="true"' : ""}><img class="flag-img" src="${assetPrefix}assets/flags/gb.svg" width="20" height="14" alt="" /><span class="lang-code">EN</span></a>
    <a class="lang-btn ${lang === "nl" ? "active" : ""}" href="${switchToNl}" hreflang="nl" title="${esc(UI.nl.langNl)}" ${lang === "nl" ? 'aria-current="true"' : ""}><img class="flag-img" src="${assetPrefix}assets/flags/nl.svg" width="20" height="14" alt="" /><span class="lang-code">NL</span></a>
  </div>`;

  const searchIndexFile =
    lang === "nl" ? "data/search-index-nl.json" : "data/search-index.json";

  return `<!DOCTYPE html>
<html lang="${ui.htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title === "PokeHaven EU Wiki" ? "PokeHaven EU Wiki" : `${esc(title)} — PokeHaven EU Wiki`}</title>
  <meta name="description" content="${esc((lede || title).replace(/<[^>]+>/g, ""))}" />
  <link rel="alternate" hreflang="en" href="${lang === "en" ? (file === "index.html" ? "index.html" : `pages/${file}`) : switchToEn}" />
  <link rel="alternate" hreflang="nl" href="${lang === "nl" ? (file === "index.html" ? "index.html" : file) : switchToNl}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="icon" href="${assetPrefix}assets/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="${assetPrefix}assets/favicon.svg" />
  <link rel="stylesheet" href="${assetPrefix}css/wiki.css" />
</head>
<body class="${isHub ? "is-hub" : "is-article"}">
  <div class="world-bg" aria-hidden="true">
    <img src="${assetPrefix}assets/wiki-wallpaper.png" alt="" />
  </div>
  <div class="world-vignette" aria-hidden="true"></div>
  <header class="site-header">
    <div class="site-header-inner">
      <a class="site-logo" href="${pagePrefix}index.html">PokeHaven <span>Wiki</span></a>
      <nav class="site-nav">${navHtml}</nav>
      ${langSwitch}
      <div class="search-wrap">
        <input id="wiki-search" type="search" placeholder="${esc(ui.searchPlaceholder)}" autocomplete="off" />
        <div id="wiki-search-results" class="search-results"></div>
      </div>
    </div>
  </header>
  <main class="page">
    ${crumb}
    <div class="article-layout ${infobox ? "" : "no-infobox"}">
      <article class="article" data-page-title="${esc(searchIndexTitle || title)}" ${hideToc ? 'data-hide-toc="true"' : ""}>
        ${titleHtml}
        ${lede ? `<p class="article-lede">${lede}</p>` : ""}
        ${tocHtml}
        ${body}
      </article>
      ${infobox ? `<aside class="infobox">${infobox}</aside>` : ""}
    </div>
  </main>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <p>${esc(ui.footerMain)}</p>
      <p class="footer-links"><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">${esc(ui.footerDiscord)}</a> · ${esc(ui.footerIpNote)}</p>
      <p class="muted">${esc(ui.footerNote)}</p>
      <p class="muted footer-stamp">${esc(ui.footerStamp)}</p>
    </div>
  </footer>
  <script>window.WIKI_PREFIX=${JSON.stringify(assetPrefix)};window.WIKI_PAGE_PREFIX=${JSON.stringify(pagePrefix)};window.WIKI_SEARCH_INDEX=${JSON.stringify(assetPrefix + searchIndexFile)};window.WIKI_LANG=${JSON.stringify(lang)};</script>
  <script src="${assetPrefix}js/toc.js"></script>
  <script src="${assetPrefix}js/search-data-${lang}.js"></script>
  <script src="${assetPrefix}js/search.js"></script>
  <script src="${assetPrefix}js/lightbox.js"></script>
  <script src="${assetPrefix}js/motion.js"></script>
</body>
</html>`;
}

function infoboxHtml(title, rows) {
  const tr = rows
    .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${v}</td></tr>`)
    .join("");
  return `<div class="infobox-title">${esc(title)}</div><table>${tr}</table>`;
}

function navboxGyms() {
  const kantoGyms = trainers.kantoLeaders
    .filter((g) => g.order <= 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  const kantoLeague = trainers.kantoLeaders
    .filter((g) => g.order > 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  const johtoGyms = (trainers.johtoLeaders || [])
    .filter((g) => g.order <= 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  const johtoLeague = (trainers.johtoLeaders || [])
    .filter((g) => g.order > 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  return `<div class="navbox">
    <div class="navbox-title">Gym challenge</div>
    <div class="navbox-row"><div class="navbox-label">Kanto</div><div class="navbox-links">${kantoGyms}</div></div>
    <div class="navbox-row"><div class="navbox-label">Kanto league</div><div class="navbox-links">${kantoLeague}</div></div>
    <div class="navbox-row"><div class="navbox-label">Johto</div><div class="navbox-links">${johtoGyms}</div></div>
    <div class="navbox-row"><div class="navbox-label">Johto league</div><div class="navbox-links">${johtoLeague}</div></div>
    <div class="navbox-row"><div class="navbox-label">Regions</div><div class="navbox-links">
      <a href="Gyms_Kanto.html">Kanto</a>
      <a href="Gyms_Johto.html">Johto</a>
      <a href="Gyms_Hoenn.html">Hoenn</a>
      <a href="Gyms_Sinnoh.html">Sinnoh</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">Guides</div><div class="navbox-links">
      <a href="Progression.html">Progression</a>
      <a href="Level_Cap.html">Level cap</a>
      <a href="Gym_Maps.html">Gym maps</a>
      <a href="Achievements.html">Achievements</a>
      <a href="Postgame_and_Legendaries.html">Post-game</a>
      <a href="Essential_Recipes.html">Essential recipes</a>
    </div></div>
  </div>`;
}

function navboxSystems() {
  return `<div class="navbox">
    <div class="navbox-title">PokeHaven systems</div>
    <div class="navbox-row"><div class="navbox-label">Core</div><div class="navbox-links">
      <a href="Economy.html">Economy</a>
      <a href="Raids.html">Raids</a>
      <a href="Catching_and_Battling.html">Catching &amp; battling</a>
      <a href="Poke_Balls.html">Poké Balls</a>
      <a href="Essential_Recipes.html">Essential recipes</a>
      <a href="Healing_and_Storage.html">Healing</a>
      <a href="Breeding.html">Breeding</a>
      <a href="Shiny.html">Shiny hunting</a>
      <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>
      <a href="Fishing.html">Fishing</a>
      <a href="Outfits_and_Cosmetics.html">Outfits &amp; cosmetics</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">World</div><div class="navbox-links">
      <a href="Claims.html">Claims</a>
      <a href="Travel.html">Travel</a>
      <a href="Riding.html">Riding</a>
      <a href="Voice_Chat.html">Voice chat</a>
      <a href="Minecraft_Hub.html">Minecraft hub</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">Help</div><div class="navbox-links">
      <a href="Pack_Differences.html">Pack differences</a>
      <a href="Roadmap.html">30-day roadmap</a>
      <a href="Achievements.html">Achievements</a>
      <a href="Postgame_and_Legendaries.html">Post-game</a>
      <a href="Common_Mistakes.html">Common mistakes</a>
      <a href="FAQ.html">FAQ</a>
      <a href="Recipe_Browser.html">Recipe browser</a>
      <a href="Trainer_Index.html">Trainer index</a>
      <a href="Raid_Bosses.html">Raid bosses</a>
      <a href="Spawn_Lookup.html">Spawn lookup</a>
    </div></div>
  </div>`;
}

function navboxMinecraft() {
  return `<div class="navbox">
    <div class="navbox-title">Minecraft on PokeHaven</div>
    <div class="navbox-row"><div class="navbox-label">Guides</div><div class="navbox-links">
      <a href="Minecraft_Hub.html">Hub</a>
      <a href="Tools_and_Mining.html">Tools &amp; mining</a>
      <a href="Farming_and_Food.html">Farming</a>
      <a href="Combat_and_Death.html">Combat &amp; death</a>
      <a href="Nether_Guide.html">Nether</a>
      <a href="Villages_and_Trading.html">Villages</a>
      <a href="Building_and_Storage.html">Building</a>
      <a href="Dimensions_and_World.html">Dimensions</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">Recipes</div><div class="navbox-links">
      <a href="Essential_Recipes.html">Essentials</a>
      <a href="Recipe_Browser.html">Browser (${recipesMeta.count})</a>
      <a href="Poke_Balls.html">Poké Balls</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">Pack</div><div class="navbox-links">
      <a href="Pack_Differences.html">Differences</a>
      <a href="Minecraft_Basics.html">Basics</a>
    </div></div>
  </div>`;
}

function teamTable(team) {
  const rows = team
    .map(
      (m) => `<tr>
      <td>${m.slot}</td>
      <td><strong>${esc(itemNice(m.species))}</strong></td>
      <td>${esc(m.level)}</td>
      <td>${esc(m.ability)}</td>
      <td>${esc(m.nature)}</td>
      <td>${esc(m.heldItem)}</td>
      <td>${m.moves.map((mv) => esc(itemNice(mv))).join(", ")}</td>
    </tr>`
    )
    .join("");
  return `<table class="wikitable">
    <thead><tr><th>#</th><th>Pokémon</th><th>Lv</th><th>Ability</th><th>Nature</th><th>Item</th><th>Moves</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function itemNice(s) {
  return String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const searchIndex = [];
const searchIndexNl = [];

/** Extra search keywords by page file (matched on title/blurb/keywords). */
const SEARCH_KEYWORDS = {
  "Outfits_and_Cosmetics.html":
    "outfit clothing clothes cloth costume cosplay pika case furfrou scarf lucario dress fashion poke clothing",
  "Level_Cap.html": "xp experience level cap stuck freeze trainer card overlevel",
  "Claims.html": "claim ftb chunks protect grief chest land party",
  "Gym_Maps.html":
    "map cartography empty map brock map key coordinates johto hoenn sinnoh valerio petra pedro",
  "Getting_Started.html": "join install curseforge discord ip pack 1.7.42",
  "Economy.html": "money pokédollars pokedollars bank emerald shop wheat farm",
  "Voice_Chat.html": "mic voice chat simple voice talk",
  "Poke_Balls.html": "pokeball apricorn craft ball great ultra",
  "Breeding.html": "egg pasture breed shiny masuda ditto cobbreeding hatch",
  "Shiny.html":
    "shiny hunting masuda crystal charm rate 2048 breed wild cobblecuisine",
  "Mega_and_Late_Game.html":
    "mega evolution z-move tera dynamax power spot late game checklist johto after blue keystone megastone gimmick",
  "Fishing.html":
    "fishing rod poke rod lure bait water fish tentacool magikarp spawn lookup",
  "Raids.html": "raid den crystal boss tier",
  "FAQ.html": "help problem question join discord",
  "Brock.html": "first gym rock boulder badge",
  "Misty.html": "second gym water cascade cerulean star seagrass",
  "Travel.html": "waystone teleport travel fast travel",
  "Farming_and_Food.html": "wheat farm food hunger emerald farmer",
  "Achievements.html":
    "achievement advancement toast checklist kanto mew mewtwo articuno zapdos moltres L key cobblemon berry apricorn fossil vivillon shiny catch",
  "Postgame_and_Legendaries.html":
    "post-game postgame legendary mythical mew mewtwo articuno zapdos moltres origin fossil ancient dna cloning",
  "Gyms_Johto.html":
    "johto valerio raffaello chiara angelo furio jasmine alfredo sandra pino karen lance zephyr hive",
  "Valerio.html": "johto first gym flying zephyr raptor bracer",
};

function writePage(file, opts = {}) {
  const lang = opts.lang || "en";
  const isRoot = file === "index.html";
  const outPath =
    lang === "nl"
      ? isRoot
        ? path.join(ROOT, "nl", file)
        : path.join(ROOT, "nl", "pages", file)
      : isRoot
        ? path.join(ROOT, file)
        : path.join(PAGES, file);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const html = layout({
    ...opts,
    file,
    lang,
    hideToc: opts.hideToc ?? isRoot,
    isHub: opts.isHub ?? isRoot,
    hideTitle: opts.hideTitle ?? false,
  });
  fs.writeFileSync(outPath, html);
  const href = isRoot ? "index.html" : `pages/${file}`;
  const entry = {
    title: opts.searchIndexTitle || opts.title,
    href,
    blurb: (opts.lede || "").replace(/<[^>]+>/g, "").slice(0, 160),
    keywords: SEARCH_KEYWORDS[file] || "",
  };
  const index = lang === "nl" ? searchIndexNl : searchIndex;
  const idx = index.findIndex((p) => p.href === href);
  if (idx >= 0) index[idx] = entry;
  else index.push(entry);
}

// ---------- Main page ----------
writePage("index.html", {
  title: "PokeHaven EU Wiki",
  searchIndexTitle: "Main Page",
  breadcrumbs: [{ label: "Main Page", href: "index.html" }],
  lede: "The player wiki for <strong>PokeHaven EU</strong> — our CobbleVerse 1.7.42 adventure server. Guides, systems, and pack data in one place.",
  body: `
  <section class="hero" style="min-height:auto;border:1px solid var(--line);border-radius:12px;margin-bottom:1.5rem;">
    <img class="hero-img" src="assets/wiki-wallpaper.png" alt="" />
    <div class="hero-inner" style="padding:2.5rem 1.5rem;">
      <div class="chips" style="margin-bottom:0.75rem;">
        <span class="chip"><strong>PokeHaven EU</strong></span>
        <span class="chip">CobbleVerse 1.7.42</span>
        <span class="chip">OSRS-style player wiki</span>
      </div>
      <h2 style="font-family:var(--font-display);font-size:clamp(2rem,5vw,3.2rem);margin:0 0 0.5rem;border:0;padding:0;">Train. Battle. Progress.</h2>
      <p class="hero-lead">Clear guides for new trainers — gyms, money, raids, claims — written for humans, not wiki jargon.</p>
    </div>
  </section>

  <h2>For new players</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Getting_Started.html"><h3>Getting started</h3><p>Install the pack and join PokeHaven EU.</p></a>
    <a class="hub-card" href="pages/First_Hours.html"><h3>First hours</h3><p>Starter, bed, claim, first catches — in order.</p></a>
    <a class="hub-card" href="pages/Progression.html"><h3>Progression</h3><p>Gyms, level cap, and unlocking regions.</p></a>
    <a class="hub-card" href="pages/Brock.html"><h3>Brock guide</h3><p>Your first gym: map legend, team tips, full roster.</p></a>
  </div>

  <h2>Guides</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Gyms_Kanto.html"><h3>Kanto gyms</h3><p>All eight leaders + Elite Four overview.</p></a>
    <a class="hub-card" href="pages/Economy.html"><h3>Economy</h3><p>Shop prices, bank sells, how to earn PokéDollars.</p></a>
    <a class="hub-card" href="pages/Raids.html"><h3>Raids</h3><p>Den tiers, rewards, and rules.</p></a>
    <a class="hub-card" href="pages/Catching_and_Battling.html"><h3>Catching &amp; battling</h3><p>Shiny rate, combat gimmicks, wild aggro.</p></a>
  </div>

  <h2>Systems</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Claims.html"><h3>Claims</h3><p>Protect your base with FTB Chunks.</p></a>
    <a class="hub-card" href="pages/Travel.html"><h3>Travel</h3><p>Waystones and map tools.</p></a>
    <a class="hub-card" href="pages/Voice_Chat.html"><h3>Voice chat</h3><p>Distances and groups.</p></a>
    <a class="hub-card" href="pages/Breeding.html"><h3>Breeding</h3><p>Timers and shiny methods.</p></a>
    <a class="hub-card" href="pages/Fishing.html"><h3>Fishing</h3><p>Cobblemon rods, bait, and water catches.</p></a>
  </div>

  <h2>Databases</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Trainer_Index.html"><h3>Trainer index</h3><p>${trainers.all.length} named trainers from the pack.</p></a>
    <a class="hub-card" href="pages/Raid_Bosses.html"><h3>Raid bosses</h3><p>${raids.bosses.length} boss entries from datapacks.</p></a>
    <a class="hub-card" href="pages/Spawn_Lookup.html"><h3>Spawn lookup</h3><p>Search ${spawns.length} spawn rows by Pokémon or biome.</p></a>
    <a class="hub-card" href="pages/FAQ.html"><h3>FAQ</h3><p>Level cap, join issues, common mistakes.</p></a>
  </div>

  <div class="callout tip">
    <div class="label">Server vs pack</div>
    <strong>PokeHaven EU</strong> is our multiplayer server.
    <strong>CobbleVerse 1.7.42</strong> is the modpack you install.
    Numbers on this wiki come from that pack export.
  </div>
  `,
});

// ---------- Getting started ----------
writePage("Getting_Started.html", {
  title: "Getting started",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Getting started", href: "Getting_Started.html" },
  ],
  lede: "How to install CobbleVerse 1.7.42 and join <strong>PokeHaven EU</strong>.",
  body: `
  <h2>Requirements</h2>
  <ul>
    <li>Minecraft <strong>Java Edition</strong> (Microsoft account)</li>
    <li><strong>CurseForge</strong> app</li>
    <li>Our shared pack zip — <strong>same version as the server</strong> (1.7.42)</li>
  </ul>

  <h2>Install steps</h2>
  <ol class="steps">
    <li>Install CurseForge and sign in.</li>
    <li>Create Custom Profile → <strong>Import</strong> our pack zip.</li>
    <li>Wait for every mod/resource to finish downloading.</li>
    <li>Launch once to the main menu, quit, launch again (helps resource packs settle).</li>
    <li>Multiplayer → <strong>Add Server</strong>:<br/>
      Server Name: <code>PokeHaven EU</code><br/>
      Server Address: the IP from Discord <code>#how-to-join</code> / announcements.</li>
  </ol>

  ${critical(
    "en",
    "<strong>Can't join?</strong> Almost always a pack version mismatch. Re-import the shared CobbleVerse <strong>1.7.42</strong> zip. Copy the IP from Discord — never from old screenshots."
  )}

  <h2>Important words</h2>
  <table class="wikitable">
    <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td>Level cap</td><td>Your Pokémon stop gaining levels until you beat the next gym leader. Not a bug.</td></tr>
      <tr><td>Claim</td><td>Mark land as yours so others cannot break or steal.</td></tr>
      <tr><td>Waystone</td><td>Teleport stone — right-click to activate, then travel between activated stones.</td></tr>
      <tr><td>Recipe list</td><td>With inventory open (<kbd>E</kbd>), use the side search to look up crafts (REI).</td></tr>
    </tbody>
  </table>

  <h2>Next</h2>
  <ul>
    <li><a href="First_Hours.html">First hours</a></li>
    <li><a href="Progression.html">Progression</a></li>
  </ul>
  ${navboxSystems().replace(/href="/g, 'href="')}
  `,
});

writePage("First_Hours.html", {
  title: "First hours",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "First hours", href: "First_Hours.html" },
  ],
  lede: "Do these in order. Skipping steps is how people lose items or get stuck.",
  body: `
  <figure class="figure">
    <img src="../assets/hud.png" alt="Example HUD with party and minimap" />
    <figcaption><strong>HUD.</strong> Left: party. Top-right: minimap + coordinates. Bottom: hotbar with starter gear.</figcaption>
  </figure>

  <h2>Checklist</h2>
  <ol class="steps">
    <li>Press <kbd>C</kbd> and pick a starter. Grass (Bulbasaur line) is easiest into Brock.</li>
    <li>Open inventory (<kbd>E</kbd>) and confirm: guide book, Brock map kit (cartography table + key + Empty Map), Poké Balls, berries, Trainer Card.</li>
    <li>Place a bed and sleep once — that is your respawn.</li>
    <li>If spawn has a waystone, right-click it to unlock teleport later.</li>
    <li>Skim the guide book.</li>
    <li>Spend 15–30 minutes catching nearby Pokémon for a tiny team.</li>
    <li>Claim land around your bed and chests (<a href="Claims.html">Claims</a>) before you leave valuables out.</li>
  </ol>

  <h2>Useful keys</h2>
  <table class="wikitable">
    <thead><tr><th>Action</th><th>Key</th></tr></thead>
    <tbody>
      <tr><td>Open party / starter</td><td><kbd>C</kbd></td></tr>
      <tr><td>Select which Pokémon to send</td><td><kbd>↑</kbd> <kbd>↓</kbd></td></tr>
      <tr><td>Send out / recall</td><td><kbd>R</kbd></td></tr>
      <tr><td>Ride</td><td><kbd>Shift</kbd> + right-click → Ride</td></tr>
      <tr><td>PC storage</td><td><code>/pc</code> or a PC block</td></tr>
    </tbody>
  </table>

  ${critical(
    "en",
    "Moving Bulbasaur to slot 1 does nothing if another Pokémon is still <strong>selected</strong>. Arrow-key until the right one is highlighted, then <kbd>R</kbd>."
  )}

  <h2>After hour one</h2>
  <ul>
    <li><strong>Good:</strong> starter + 2–3 catches, food, bed, claim, stone tools, Brock gym map on hotbar.</li>
    <li><strong>Not yet:</strong> palace building, Nether deep dives, legendary hunts, blowing money on luxury shop junk.</li>
  </ul>
  <p class="see-also"><strong>See also:</strong> <a href="Brock.html">Brock</a> · <a href="Gym_Maps.html">Gym maps</a></p>
  `,
});

const shiny = rates.cobblemon?.shinyRate ?? 2048;
const xpMult = rates.cobblemon?.experienceMultiplier ?? 2;

function teamMaxLevel(g) {
  return Math.max(...(g.team || []).map((m) => Number(m.level) || 0), 0);
}

/** Approx cap while this leader is your next target (strongest party mon + relativeLevelCap 5). */
function approxCapWhileNext(g) {
  return teamMaxLevel(g) + 5;
}

function capLadderRows(leaders) {
  return (leaders || [])
    .map((g) => {
      const maxLv = teamMaxLevel(g);
      return `<tr>
      <td><a href="${g.slug}.html">${esc(g.name)}</a></td>
      <td>${esc(g.badge)}</td>
      <td>${esc(g.type)}</td>
      <td>${maxLv}</td>
      <td>~${approxCapWhileNext(g)}</td>
    </tr>`;
    })
    .join("");
}

const kantoCapLadderRows = capLadderRows(trainers.kantoLeaders);
const johtoCapLadderRows = capLadderRows(trainers.johtoLeaders);

function mapItemLabel(g) {
  if (g.slug === "Brock") return "Brock Map Key";
  return g.specialItem;
}

function cartographyTableFor(g) {
  return g.region === "johto" ? "Johto Cartography Table" : "Kanto Cartography Table";
}

function seriesLeaders(g) {
  if (g.region === "johto") return trainers.johtoLeaders || [];
  return trainers.kantoLeaders || [];
}

function nextLeaderAfter(g) {
  const sorted = [...seriesLeaders(g)].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((x) => x.slug === g.slug);
  return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
}

function gymGuideBody(g) {
  const mapItem = mapItemLabel(g);
  const cartTable = cartographyTableFor(g);
  const next = nextLeaderAfter(g);
  const nextLink = next
    ? `<a href="${next.slug}.html">${esc(next.name)}</a>`
    : g.region === "johto"
      ? `<a href="Gyms_Hoenn.html">Hoenn</a>`
      : `<a href="Gyms_Johto.html">Johto</a>`;

  if (g.slug === "Valerio") {
    return `<h2>Walkthrough — Blue to Valerio</h2>
    <h3>Unlock Johto first</h3>
    <ol class="steps">
      <li>Beat <a href="Blue.html">Champion Blue</a>.</li>
      <li>Follow the champion book: Trainer Association → <strong>Johto Trainer Card</strong> (your level cap resets for Johto).</li>
      <li>If Johto structures are missing, ask in Discord — staff may restart once. See <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>.</li>
    </ol>
    <h3>Prepare</h3>
    <ul>
      <li>Electric, Rock, and Ice coverage for Flying</li>
      <li>~${approxCapWhileNext(g)} level band while Valerio is next — <a href="Level_Cap.html">Level cap</a></li>
      <li>Heals, spare balls, claimed base / waystone</li>
      <li>Location tip: <strong>${esc(g.biome)}</strong></li>
    </ul>
    <h3>Craft Valerio’s map</h3>
    ${figure(
      guideImg("cartography-maps.png"),
      "<strong>Johto Cartography Table.</strong> Empty Map + Raptor Bracer → finished map with coordinates.",
      "Cartography / map crafting"
    )}
    <ol class="steps">
      <li>Search REI for <strong>Raptor Bracer</strong> / Valerio and craft it.</li>
      <li>Craft a fresh <strong>Empty Map</strong>.</li>
      <li>Combine Empty Map + Raptor Bracer on the <strong>Johto Cartography Table</strong> (not the Kanto table).</li>
      <li>Hover the finished map for coordinates — <a href="Gym_Maps.html">Gym maps</a>.</li>
    </ol>
    ${critical(
      "en",
      "<strong>Wrong region table = wasted Empty Map.</strong> Johto keys go on the Johto Cartography Table. Never open the Empty Map in the world first."
    )}
    <h3>Fight tips</h3>
    <p>${esc(g.tips)}</p>
    <ol class="steps">
      <li>Travel with heals; activate waystones on the route.</li>
      <li>Clear gym trainers if you need XP or CobbleDollars.</li>
      <li>Heal, then challenge <strong>Valerio</strong>.</li>
      <li>Win → next: ${nextLink}.</li>
    </ol>`;
  }

  if (g.slug === "Brock") {
    return `<h2>Walkthrough — spawn to Brock</h2>
    ${figure(
      guideImg("brock-gym.png"),
      "<strong>Brock’s gym.</strong> Look for a clear gym building in Plains — not a random village house.",
      "Example gym building"
    )}
    <h3>Prepare</h3>
    <ul>
      <li>Team of 4–6 with type variety</li>
      <li>Prefer Grass/Water into Rock</li>
      <li>Food, Oran Berries, spare Poké Balls</li>
      <li>Stone/iron pick for the trip</li>
    </ul>
    ${figure(
      guideImg("hud.png"),
      "<strong>Travel HUD.</strong> Keep your Brock gym map on the hotbar and heal before you enter.",
      "HUD while travelling to the first gym"
    )}
    <h3>Craft Brock’s map (coordinates)</h3>
    <ol class="steps">
      <li>Your starter kit includes a <strong>Kanto Cartography Table</strong>, <strong>Brock Map Key</strong>, and <strong>Empty Map</strong>.</li>
      <li>Place the table. Put Empty Map + Brock Map Key in it.</li>
      <li>Take the finished map — that one has the marker and the exact coordinates.</li>
    </ol>
    ${critical(
      "en",
      "<strong>Do not open / right-click the Empty Map in the world first.</strong> That ruins it for gym crafting. Use a fresh Empty Map in the Kanto Cartography Table."
    )}
    <div class="callout tip">
      <div class="label">Map looks empty?</div>
      Walk the indicated direction anyway. Waystones only teleport to stones <em>you</em> activated.
    </div>
    <h3>Inside the gym</h3>
    <ol class="steps">
      <li>Heal before the leader.</li>
      <li>Optional: beat gym trainers for XP + CobbleDollars.</li>
      <li>Win → badge → level cap rises.</li>
      <li>Craft Misty’s map next (<a href="Misty.html">Misty</a> · <a href="Gym_Maps.html">Gym maps</a>).</li>
    </ol>`;
  }

  if (g.slug === "Misty") {
    return `<h2>Walkthrough — Brock to Misty</h2>
    <h3>Prepare</h3>
    <ul>
      <li>Electric and Grass coverage for Water</li>
      <li>Heals, spare balls, and a claimed base to return to</li>
      <li>~${approxCapWhileNext(g)} level band while Misty is next (see <a href="Level_Cap.html">Level cap</a>)</li>
    </ul>
    <h3>Craft Misty’s map</h3>
    ${figure(
      guideImg("cartography-maps.png"),
      "<strong>Cartography table.</strong> Empty Map + special item → finished gym map with coordinates.",
      "Cartography / map crafting"
    )}
    <ol class="steps">
      <li>Craft a <strong>Cerulean Star</strong> (search Misty / Cerulean in REI).</li>
      <li>Craft a fresh <strong>Empty Map</strong>.</li>
      <li>Combine Empty Map + Cerulean Star in the <strong>Kanto Cartography Table</strong>.</li>
      <li>Hover the finished map for coordinates, then travel.</li>
    </ol>
    ${critical(
      "en",
      "<strong>Seagrass only drops with Shears.</strong> Bare hands give nothing. Also: never open the Empty Map in the world before crafting."
    )}
    <h3>Fight tips</h3>
    <p>${esc(g.tips)}</p>
    <ol class="steps">
      <li>Travel with heals; activate waystones on the way.</li>
      <li>Clear gym trainers if you need XP or money.</li>
      <li>Heal, then challenge Misty.</li>
      <li>Win → next up: ${nextLink}.</li>
    </ol>`;
  }

  // Deep template for remaining Kanto gyms + Elite Four + Blue
  const extras = {
    "Lt._Surge": {
      title: "Walkthrough — Misty to Lt. Surge",
      coverage: "Ground answers Electric best. Bulky Waters can help if they survive the first hit.",
      travel: "Savanna Plateau tip from pack data — bring food for a longer hike.",
      gotcha: "Paralysis and speed snowball. Pack status cures and a Ground pivot.",
    },
    Erika: {
      title: "Walkthrough — Surge to Erika",
      coverage: "Fire, Flying, Ice, and Poison pressure Grass.",
      travel: "Flower Forest tip — pretty biome, still claim a rest stop.",
      gotcha: "Status (sleep/powder) can stall. Bring cleansers and don’t underlevel into her ceiling.",
    },
    Koga: {
      title: "Walkthrough — Erika to Koga",
      coverage: "Psychic and Ground help into Poison. Fast removers beat stall.",
      travel: "Swamp tip — boots, food, and a waystone on the path.",
      gotcha: "Poison / bad poison chip. Stock Antidotes / Pecha and don’t AFK mid-fight.",
    },
    Sabrina: {
      title: "Walkthrough — Koga to Sabrina",
      coverage: "Dark, Bug, and Ghost pressure Psychic.",
      travel: "Dark Forest tip — light sources and a claimed retreat.",
      gotcha: "Confusion and setup can run away. Keep a revenge killer ready.",
    },
    Blaine: {
      title: "Walkthrough — Sabrina to Blaine",
      coverage: "Water and Ground are reliable into Fire.",
      travel: "Crimson Forest / Nether-adjacent tip — fire resist gear helps the trip.",
      gotcha: "Hot biomes kill unprepared travellers. Waystones + food before the gym fight.",
    },
    Giovanni: {
      title: "Walkthrough — Blaine to Giovanni",
      coverage: "Water, Grass, and Ice hit Ground hard.",
      travel: "Deep Dark tip — go geared; this is not a casual spawn stroll.",
      gotcha: "Deep Dark is lethal. Scout carefully, then fight Giovanni at full health.",
    },
    Lorelei: {
      title: "Walkthrough — Giovanni to Elite Four (Lorelei)",
      coverage: "Fire, Fighting, Rock, and Steel help into Ice.",
      travel: "Elite Four Tower (The End) — finish Kanto gyms first; bring stacks of heals.",
      gotcha: "Full heal between Elite rooms. Do not walk into Bruno with a half-dead party.",
      league: true,
    },
    Bruno: {
      title: "Walkthrough — Lorelei to Bruno",
      coverage: "Flying, Psychic, and Fairy answer Fighting.",
      travel: "Same Elite Four Tower — restock before you enter his room.",
      gotcha: "Fighting hits Normal/Rock/Ice/Steel hard. Keep a Flying/Psychic pivot.",
      league: true,
    },
    Agatha: {
      title: "Walkthrough — Bruno to Agatha",
      coverage: "Dark and Ghost pressure Ghost. Watch immunities.",
      travel: "Tower room three — heal fully after Bruno.",
      gotcha: "Status and Ghost tricks. Don’t sweep with a single Dark type if she has answers.",
      league: true,
    },
    Lance: {
      title: "Walkthrough — Agatha to Lance",
      coverage: "Ice and Dragon matter most; Fairy also helps into Dragon.",
      travel: "Fourth Elite room — this is a late-Kanto wall.",
      gotcha: "Dragon spam punishes thin teams. Bring Ice coverage and multiple win conditions.",
      league: true,
    },
    Blue: {
      title: "Walkthrough — Lance to Champion Blue",
      coverage: "Mixed champion — pack answers for several types, not one gimmick.",
      travel: "Top of the Elite Four Tower. Full restore team + items.",
      gotcha: "After Blue on PokeHaven: Johto unlock + Trainer Association card swap. Soft Discord note if structures are missing (staff may restart once). See your champion book.",
      league: true,
      champion: true,
    },
    // Johto (Valerio has a dedicated branch above)
    Raffaello: {
      title: "Walkthrough — Valerio to Raffaello",
      coverage: "Fire, Flying, and Rock pressure Bug.",
      travel: "Sparse Jungle tip — cut a path, keep a waystone, watch for higher wild levels.",
      gotcha: "Heracross / Scyther can outspeed soft teams. Bring Rock or Fire that can take a hit.",
    },
    Chiara: {
      title: "Walkthrough — Raffaello to Chiara",
      coverage: "Fighting answers Normal; Ghost immunities help vs Normal moves.",
      travel: "Cherry Grove tip — pretty biome, still claim a rest stop.",
      gotcha: "Miltank-style stall. Pack status and a Fighting pivot; don’t stall yourself out of heals.",
    },
    Angelo: {
      title: "Walkthrough — Chiara to Angelo",
      coverage: "Dark and Ghost pressure Ghost. Watch immunities both ways.",
      travel: "Lush Cave tip — torches, food, and an escape waystone.",
      gotcha: "Cave travel + Ghost status. Enter the leader at full HP with Dark/Ghost answers ready.",
    },
    Furio: {
      title: "Walkthrough — Angelo to Furio",
      coverage: "Flying, Psychic, and Fairy answer Fighting.",
      travel: "Desert tip — water, food, and shade. Don’t start the gym dehydrated.",
      gotcha: "Fighting punishes Normal/Rock/Ice/Steel. Keep a Flying or Psychic revenge killer.",
    },
    Jasmine: {
      title: "Walkthrough — Furio to Jasmine",
      coverage: "Fire, Fighting, and Ground crack Steel.",
      travel: "Taiga tip — longer hike; restock balls and Revives.",
      gotcha: "Magnezone / Metagross punish pure Water. Bring Ground or Fire that isn’t weak to Steel moves.",
    },
    Alfredo: {
      title: "Walkthrough — Jasmine to Alfredo",
      coverage: "Fire, Fighting, Rock, and Steel help into Ice.",
      travel: "Ice Spikes tip — cold weather gear / food and a retreat stone.",
      gotcha: "Ice walls stall. Don’t walk in underleveled into the ~65 band.",
    },
    Sandra: {
      title: "Walkthrough — Alfredo to Sandra",
      coverage: "Ice and Fairy punish Dragon; Rock/Electric help into some fliers.",
      travel: "Soul Sand Valley (Nether) tip — fire resist, Nether waystone, then the gym.",
      gotcha: "Nether prep first, gym second. Half a party of Dragons will bounce off her Dragon core.",
    },
    Pino: {
      title: "Walkthrough — Sandra to Johto Elite Four (Pino)",
      coverage: "Dark, Bug, and Ghost pressure Psychic.",
      travel: "Elite Four Tower (The End) — finish all eight Johto gyms; bring stacks of heals.",
      gotcha: "Full heal between Elite rooms. Do not walk into Johto Koga half-dead.",
      league: true,
    },
    Johto_Koga: {
      title: "Walkthrough — Pino to Johto Koga",
      coverage: "Psychic and Ground help into Poison. Fast removers beat stall.",
      travel: "Same End tower — restock after Pino.",
      gotcha: "Different team than Kanto Koga (Naganadel line, etc.). Check the team table below.",
      league: true,
    },
    Johto_Bruno: {
      title: "Walkthrough — Johto Koga to Johto Bruno",
      coverage: "Flying, Psychic, and Fairy answer Fighting.",
      travel: "Tower room three — full heal after Johto Koga.",
      gotcha: "Not Kanto Bruno’s roster. Lucario / Hitmon pressure different pivots.",
      league: true,
    },
    Karen: {
      title: "Walkthrough — Johto Bruno to Karen",
      coverage: "Fighting, Bug, and Fairy pressure Dark.",
      travel: "Fourth Elite room — late Johto wall.",
      gotcha: "Weavile / Houndoom speed. Don’t rely on a single Psychic into Dark.",
      league: true,
    },
    Johto_Lance: {
      title: "Walkthrough — Karen to Champion Lance (Johto)",
      coverage: "Ice and Fairy matter most; have a plan for Lugia.",
      travel: "Top of the Johto Elite Four Tower. Full restore + items.",
      gotcha: "Lugia ace + Dragon core. Multiple win conditions beat one Ice type. After win: Hoenn unlock path on your Trainer Card.",
      league: true,
      champion: true,
    },
  }[g.slug] || {
    title: `Walkthrough — ${esc(g.name)}`,
    coverage: esc(g.tips),
    travel: `Location tip: ${esc(g.biome)}.`,
    gotcha: "Heal before the leader. Respect the level cap.",
  };

  const lvMin =
    teamMaxLevel(g) > 0
      ? Math.min(...g.team.map((m) => Number(m.level) || 99))
      : "—";
  const lvMax = teamMaxLevel(g) > 0 ? teamMaxLevel(g) : "—";
  const afterWin = extras.champion
    ? g.region === "johto"
      ? `Win → Johto Champion. Next region: <a href="Gyms_Hoenn.html">Hoenn</a> (follow Trainer Card / pack unlocks). Details: <a href="Progression.html">Progression</a>.`
      : `Win → Kanto Champion. Next: Johto via Trainer Association (cap resets for <em>you</em>). Details: <a href="Progression.html">Progression</a> · <a href="Gyms_Johto.html">Johto</a>.`
    : `Win → level cap rises → next: ${nextLink}.`;

  return `<h2>${extras.title}</h2>
    <h3>Prepare</h3>
    <p>${esc(g.tips)}</p>
    <ul>
      <li><strong>Coverage:</strong> ${extras.coverage}</li>
      <li>Leader party levels (pack data): about <strong>${lvMin}–${lvMax}</strong></li>
      <li>Approx cap while this fight is next: <strong>~${approxCapWhileNext(g)}</strong> — <a href="Level_Cap.html">Level cap</a></li>
      <li>Heals, status cures, spare balls, claimed base / waystone to retreat to</li>
      <li>${extras.travel}</li>
    </ul>
    <h3>Craft the map</h3>
    ${figure(
      guideImg("cartography-maps.png"),
      `<strong>${esc(cartTable)}.</strong> Empty Map + special item → finished map with coordinates.`,
      "Cartography / map crafting"
    )}
    <ol class="steps">
      <li>Search <strong>${esc(g.name)}</strong> in REI and craft <strong>${esc(mapItem)}</strong>.</li>
      <li>Craft a fresh <strong>Empty Map</strong>.</li>
      <li>Combine Empty Map + ${esc(mapItem)} in the <strong>${esc(cartTable)}</strong> (or trade a Map Guide villager).</li>
      <li>Hover the finished map for coordinates. Details: <a href="Gym_Maps.html">Gym maps</a>.</li>
    </ol>
    ${critical(
      "en",
      "<strong>Do not open the Empty Map in the world first</strong> — that ruins it for gym crafting. Use the correct region cartography table."
    )}
    <h3>Fight tips</h3>
    <p>${extras.gotcha}</p>
    <ol class="steps">
      <li>Travel with heals; activate waystones on the route.</li>
      ${
        extras.league
          ? "<li>Elite Four / Champion: <strong>full heal between rooms</strong>.</li>"
          : "<li>Clear gym trainers if you need XP or CobbleDollars.</li>"
      }
      <li>Heal, then challenge <strong>${esc(g.name)}</strong>.</li>
      <li>${afterWin}</li>
    </ol>`;
}

writePage("Progression.html", {
  title: "Progression",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Progression", href: "Progression.html" },
  ],
  lede: "The main route is the gym challenge. The level cap forces you forward instead of grinding forever at spawn.",
  body: `
  <h2>The loop</h2>
  <pre>Catch / train → Get gym map → Find gym → Heal → Beat leader
→ Level cap rises → Next map → Improve team → Repeat
→ Elite Four + Champion → Next region
→ Post-game fossils / legendaries (optional)</pre>

  <h2>Achievements &amp; post-game</h2>
  <p>CobbleVerse also tracks pack <a href="Achievements.html">achievements</a> (Advancements screen, often <kbd>L</kbd>). After Blue, see <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a> for Mew, birds, and Mewtwo.</p>

  <h2>Regions</h2>
  <table class="wikitable">
    <thead><tr><th>Region</th><th>When</th><th>Focus</th></tr></thead>
    <tbody>
      <tr><td>Kanto</td><td>Immediately</td><td>8 gyms + Elite Four + Blue</td></tr>
      <tr><td>Johto</td><td>After Kanto</td><td>New gyms and biomes</td></tr>
      <tr><td>Hoenn</td><td>After Johto Champion</td><td>Next step</td></tr>
      <tr><td>Sinnoh</td><td>After Hoenn Champion</td><td>Late game</td></tr>
    </tbody>
  </table>

  <h2>Level cap on PokeHaven</h2>
  <p>Your Pokémon stop gaining levels until you beat the <strong>next</strong> required gym / league fight. Full ladder: <a href="Level_Cap.html">Level cap</a>.</p>
  ${critical(
    "en",
    "<strong>Players cannot turn the level cap off on PokeHaven EU.</strong> Beat the <strong>next gym</strong> — grinding the same route will not raise the cap."
  )}

  <h2>Trainer Card</h2>
  <p>Keep a Trainer Card on you (starter kit / shop). Check it for badge and series progress when XP seems “broken”.</p>

  <p class="see-also"><strong>See also:</strong> <a href="Gyms_Kanto.html">Kanto gyms</a> · <a href="Gym_Maps.html">Gym maps</a> · <a href="Achievements.html">Achievements</a> · <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Brock.html">Brock</a></p>
  ${navboxGyms()}
  `,
});

writePage("Level_Cap.html", {
  title: "Level cap",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Level cap", href: "Level_Cap.html" },
  ],
  lede: "Your Pokémon stop leveling until you defeat the next gym leader. On PokeHaven EU this stays on — it is intentional progression.",
  infobox: infoboxHtml("Level cap", [
    ["Starts at", "~20 (Kanto series)"],
    ["Raises when", "You beat the next gym / league fight"],
    ["How calculated", "Strongest mon on next target + 5"],
    ["Over-leveling", "Blocked on PokeHaven EU"],
    ["Check progress", "Trainer Card"],
  ]),
  body: `
  <h2>Why it exists</h2>
  <p>Without a cap, people overlevel at spawn and skip the adventure. The cap pushes you through gyms and keeps fights fair.</p>

  ${critical(
    "en",
    "<strong>Players cannot disable the level cap here.</strong> Beat gyms to raise it. If XP “stops”, you are at the cap — not broken."
  )}

  <h2>Kanto ladder (approx)</h2>
  <p>While a leader is your next target, your cap is roughly that leader’s strongest Pokémon level <strong>+ 5</strong>. Numbers below are from pack team data — use them as a guide, then confirm with your Trainer Card.</p>
  <table class="wikitable">
    <thead><tr><th>Next target</th><th>Badge / role</th><th>Type</th><th>Team max lv</th><th>Approx cap</th></tr></thead>
    <tbody>${kantoCapLadderRows}</tbody>
  </table>

  <h2>Johto ladder (approx)</h2>
  <p>After the Johto Trainer Card, the same +5 rule applies to Johto leaders. Deep guides: <a href="Gyms_Johto.html">Johto gyms</a>.</p>
  <table class="wikitable">
    <thead><tr><th>Next target</th><th>Badge / role</th><th>Type</th><th>Team max lv</th><th>Approx cap</th></tr></thead>
    <tbody>${johtoCapLadderRows}</tbody>
  </table>

  <h2>XP looks broken?</h2>
  <ol class="steps">
    <li>Open your <strong>Trainer Card</strong> and see which gym is next.</li>
    <li>Get that gym’s map (<a href="Gym_Maps.html">Gym maps</a>).</li>
    <li>Improve coverage and heals — do not only grind the same route.</li>
    <li>Beat the leader; the cap rises and XP sticks again.</li>
  </ol>

  <p class="see-also"><strong>See also:</strong> <a href="Progression.html">Progression</a> · <a href="Gyms_Kanto.html">Kanto gyms</a> · <a href="Gyms_Johto.html">Johto gyms</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxGyms()}
  `,
});

// Gym overview
{
  const rows = trainers.kantoLeaders
    .map(
      (g) => `<tr>
      <td><a href="${g.slug}.html">${esc(g.name)}</a></td>
      <td>${esc(g.type)}</td>
      <td>${esc(g.badge)}</td>
      <td>${esc(g.biome)}</td>
      <td>${esc(mapItemLabel(g))}</td>
      <td>${g.team?.[0]?.level ?? "—"}–${g.team?.[g.team.length - 1]?.level ?? "—"}</td>
    </tr>`
    )
    .join("");
  writePage("Gyms_Kanto.html", {
    title: "Kanto gyms",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Kanto gyms", href: "Gyms_Kanto.html" },
    ],
    lede: "Checklist for the Kanto challenge on CobbleVerse / PokeHaven EU. Open a leader page for full teams from pack data.",
    body: `
    <h2>Gym leaders &amp; league</h2>
    <table class="wikitable">
      <thead><tr><th>Trainer</th><th>Type</th><th>Badge / role</th><th>Biome / place</th><th>Map item</th><th>Team lv</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="callout tip">
      <div class="label">Maps</div>
      Craft every gym map with a special item + Empty Map on the Kanto Cartography Table (starter kit has Brock’s key).
      Deep guides: <a href="Brock.html">Brock</a> · <a href="Misty.html">Misty</a> · <a href="Gym_Maps.html">Gym maps</a>.
    </div>
    <p>Track badges in the Advancements screen too — full list: <a href="Achievements.html">Achievements</a>. After the league: <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a>.</p>
    ${navboxGyms()}
    `,
  });
}

// Individual gym pages
for (const g of trainers.kantoLeaders) {
  const maxLv = teamMaxLevel(g);
  const minLv = Math.min(...g.team.map((m) => Number(m.level) || 99));
  writePage(`${g.slug}.html`, {
    title: g.name,
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Kanto gyms", href: "Gyms_Kanto.html" },
      { label: g.name, href: `${g.slug}.html` },
    ],
    lede: `${esc(g.name)} — ${esc(g.type)} specialist. Team data from the CobbleVerse RCT datapack used on PokeHaven EU.`,
    infobox: infoboxHtml(g.name, [
      ["Role", g.order <= 8 ? "Gym Leader" : g.order === 13 ? "Champion" : "Elite Four"],
      ["Type focus", esc(g.type)],
      ["Badge / title", esc(g.badge)],
      ["Location tip", esc(g.biome)],
      ["Map item", esc(mapItemLabel(g))],
      ["Approx cap (while next)", `~${approxCapWhileNext(g)}`],
      ["Team levels", `${minLv}–${maxLv}`],
      ["Party size", String(g.team.length)],
      ["Bag items", g.bag.length ? esc(g.bag.join(", ")) : "—"],
    ]),
    body: `
    ${gymGuideBody(g)}

    <h2>Team</h2>
    ${teamTable(g.team)}
    ${navboxGyms()}
    `,
  });
}

writePage("Gym_Maps.html", {
  title: "Gym maps",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Gym maps", href: "Gym_Maps.html" },
  ],
  lede: "How to find gyms on PokeHaven EU — each region has its own cartography table. Craft a finished map for a marker and coordinates.",
  infobox: infoboxHtml("Gym maps", [
    ["Kanto table", "Kanto Cartography Table"],
    ["Johto table", "Johto Cartography Table"],
    ["Hoenn table", "Hoenn Cartography Table"],
    ["Sinnoh table", "Sinnoh Cartography Table"],
    ["First leaders", "Brock → Valerio → Petra → Pedro"],
  ]),
  body: `
  <h2>Brock (first gym — free kit)</h2>
  <p>Your starter kit includes a <strong>Kanto Cartography Table</strong>, <strong>Brock Map Key</strong>, and <strong>Empty Map</strong>. Place the table, put Empty Map + Brock Map Key in it, and take the finished map (marker + coordinates). Full walkthrough: <a href="Brock.html">Brock</a>.</p>
  ${critical(
    "en",
    "<strong>Never open / right-click an Empty Map in the world before gym crafting.</strong> That ruins it. Always use a fresh Empty Map in the matching region cartography table."
  )}

  ${figure(
    guideImg("cartography-maps.png"),
    "<strong>Gym map crafting.</strong> Empty Map + special item on the correct region cartography table. Never open an Empty Map in the world before crafting.",
    "Cartography / map crafting context"
  )}

  <h2>Later regions (Johto / Hoenn / Sinnoh)</h2>
  <p>After each league, craft that region’s cartography table (REI: <em>Johto</em> / <em>Hoenn</em> / <em>Sinnoh</em> + <em>cartography</em>). First gym leaders:</p>
  <table class="wikitable">
    <thead><tr><th>Region</th><th>When</th><th>First gym</th><th>Table</th></tr></thead>
    <tbody>
      <tr><td>Johto</td><td>After Blue + Johto Trainer Card</td><td><strong>Valerio</strong></td><td>Johto Cartography Table</td></tr>
      <tr><td>Hoenn</td><td>After Lance + Hoenn card</td><td><strong>Petra</strong></td><td>Hoenn Cartography Table</td></tr>
      <tr><td>Sinnoh</td><td>After Rocco + Sinnoh card</td><td><strong>Pedro</strong></td><td>Sinnoh Cartography Table</td></tr>
    </tbody>
  </table>
  <ol class="steps">
    <li>Swap your Trainer Card at the Trainer Association for the new region (resets <em>your</em> level cap — others unaffected).</li>
    <li>Check the Trainer Card for a spawn tip, <em>or</em> craft the map (below).</li>
    <li>If structures are missing after the first champion of a region, ask Discord — staff may need one server restart.</li>
  </ol>
  <p>Region overviews: <a href="Gyms_Johto.html">Johto</a> · <a href="Gyms_Hoenn.html">Hoenn</a> · <a href="Gyms_Sinnoh.html">Sinnoh</a>.</p>

  <h2>Method 1 — Map Guide villager</h2>
  <ol class="steps">
    <li>Craft and place the <strong>matching region</strong> cartography table (REI).</li>
    <li>Put it next to an unemployed villager.</li>
    <li>They become a Map Guide and can trade gym maps for that region.</li>
  </ol>

  <h2>Method 2 — Empty Map + special item</h2>
  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>Look up the special item in REI.</strong> Search the leader’s name, craft the required item, then combine with a fresh Empty Map on the <em>correct</em> region table.",
    "REI used to look up gym map ingredients"
  )}
  <ol class="steps">
    <li>Search the leader’s name in REI (e.g. Valerio, Petra, Pedro, Misty…).</li>
    <li>Craft that special map item.</li>
    <li>Craft a fresh <strong>Empty Map</strong>.</li>
    <li>Combine Empty Map + item in the <strong>region</strong> cartography table (Kanto table for Kanto leaders, Johto table for Johto, etc.).</li>
    <li>On the finished map, hover (+ <kbd>Shift</kbd> if needed) for details/coordinates.</li>
  </ol>

  ${critical(
    "en",
    "<strong>Seagrass for Cerulean Star (Misty) only drops with Shears.</strong> Bare hands give nothing."
  )}

  <div class="callout tip">
    <div class="label">Map looks empty?</div>
    Walk the indicated direction anyway. If nothing shows up after a long hike, move a few thousand blocks and try again.
  </div>
  <p class="see-also"><strong>See also:</strong> <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Villages_and_Trading.html">Villages &amp; trading</a> · <a href="Brock.html">Brock</a> · <a href="Progression.html">Progression</a></p>
  ${navboxGyms()}
  `,
});

// Economy
{
  const shopHtml = economy.shop
    .map((sec) => {
      const rows = sec.items
        .map((i) => `<tr><td>${esc(i.label)}</td><td><code>${esc(i.item)}</code></td><td>${i.price}</td></tr>`)
        .join("");
      return `<h3>${esc(sec.section)}</h3>
      <table class="wikitable"><thead><tr><th>Item</th><th>ID</th><th>Price</th></tr></thead><tbody>${rows}</tbody></table>`;
    })
    .join("");

  const bankRows = economy.bank
    .slice(0, 80)
    .map((i) => `<tr><td>${esc(i.label)}</td><td><code>${esc(i.item)}</code></td><td>${i.price}</td></tr>`)
    .join("");

  writePage("Economy.html", {
    title: "Economy",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Economy", href: "Economy.html" },
    ],
    lede: "PokéDollars come from battling, selling, and bounties — not AFK jobs.",
    infobox: infoboxHtml("Economy", [
      ["Currency", "PokéDollars"],
      ["Income multiplier", String(economy.incomeMultiplier)],
      ["Wild payouts", economy.earnFromWild ? "Yes" : "No"],
      ["NPC trainer payouts", economy.earnFromNpc ? "Yes" : "No"],
      ["Shop sections", String(economy.shop.length)],
      ["Bank sell entries", String(economy.bank.length)],
    ]),
    body: `
    <h2>How to earn</h2>
    <table class="wikitable">
      <thead><tr><th>Source</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Wild battles</td><td>Steady income while exploring (×${esc(economy.incomeMultiplier)} on this pack)</td></tr>
        <tr><td>Trainers / gyms</td><td>Better payouts for stronger fights</td></tr>
        <tr><td>Bank (sell items)</td><td>Emeralds, potions, vitamins, relic coins…</td></tr>
        <tr><td>Bountiful boards</td><td>Village bounty boards</td></tr>
      </tbody>
    </table>

    <div class="callout tip">
      <div class="label">Early money loop</div>
      Farm wheat → trade farmers for emeralds → sell emeralds at the Bank → buy balls/heals.
      Shopping Centers are usually cheaper than panic-buying on the road.
    </div>

    <h2>Default shop prices</h2>
    ${shopHtml || "<p class='muted'>No shop data found.</p>"}

    <h2>Bank sell prices</h2>
    <table class="wikitable">
      <thead><tr><th>Item</th><th>ID</th><th>Sell price</th></tr></thead>
      <tbody>${bankRows || "<tr><td colspan='3'>No bank rows parsed — check bank.json shape.</td></tr>"}</tbody>
    </table>
    ${economy.bank.length > 80 ? `<p class="muted">Showing 80 of ${economy.bank.length} entries (full list in <code>data/economy.json</code>).</p>` : ""}
    ${navboxSystems()}
    `,
  });
}

// Raids
{
  const tierRows = raids.tiers
    .map(
      (t) => `<tr>
      <td>T${t.tier}</td>
      <td>${esc(t.bossLevel ?? "—")}</td>
      <td>${esc(t.maxPlayers ?? "—")}</td>
      <td>${esc(t.ivs ?? "—")}</td>
      <td>${esc(t.currency ?? "—")}</td>
      <td>${esc(t.hpMultiplier ?? "—")}</td>
      <td>${esc(t.maxClears ?? "—")}</td>
    </tr>`
    )
    .join("");
  const weights = raids.common.tierWeights.map((w, i) => `T${i + 1}: ${w}`).join(" · ");

  writePage("Raids.html", {
    title: "Raids",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Raids", href: "Raids.html" },
    ],
    lede: "Raid dens are crystal fights in the overworld. Bring friends, heals, and type coverage — higher tiers hit harder and pay better.",
    infobox: infoboxHtml("Raid dens", [
      ["Spawn chance", `1 / ${raids.common.spawnRate} (overworld)`],
      ["Reset time", `${raids.common.resetTime}s (${raids.common.resetMode})`],
      ["Cycle mode", esc(raids.common.cycleMode)],
      ["Rewards", esc(raids.common.rewardDistribution)],
      ["Retry fails", raids.common.retryFailed ? "Yes" : "No"],
      ["Shard energy", String(raids.common.requiredEnergy)],
      ["Tier weights", esc(weights)],
    ]),
    body: `
    <h2>When to raid</h2>
    <p>Do early dens when you have a stable party and spare balls. Skip high tiers until your level cap and coverage are ready — wipe = wasted time and items.</p>

    <h2>How a den works</h2>
    <ol class="steps">
      <li>Find a raid den crystal in the overworld.</li>
      <li>Start the raid with heals ready (voice chat helps for parties — <a href="Voice_Chat.html">Voice chat</a>).</li>
      <li>Deal damage — rewards use <strong>${esc(raids.common.rewardDistribution)}</strong> distribution, so contribute.</li>
      <li>Dens reset after the timer and can cycle boss/tier.</li>
    </ol>

    <div class="callout tip">
      <div class="label">Party tip</div>
      Bring type answers for the boss, not six of the same mon. Check <a href="Raid_Bosses.html">Raid bosses</a> before you commit.
    </div>

    <h2>Tier table</h2>
    <table class="wikitable">
      <thead><tr><th>Tier</th><th>Boss lv</th><th>Max players</th><th>IVs</th><th>$ reward</th><th>HP ×</th><th>Max clears</th></tr></thead>
      <tbody>${tierRows}</tbody>
    </table>

    <p>Full boss list: <a href="Raid_Bosses.html">Raid bosses</a>.</p>
    ${navboxSystems()}
    `,
  });
}

writePage("Catching_and_Battling.html", {
  title: "Catching and battling",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Catching and battling", href: "Catching_and_Battling.html" },
  ],
  lede: "Core combat rules from the CobbleVerse pack config used on PokeHaven EU.",
  infobox: infoboxHtml("Combat rates", [
    ["Shiny rate", `1 / ${shiny}`],
    ["XP multiplier", String(xpMult)],
    ["Max Pokémon level", String(rates.cobblemon?.maxPokemonLevel ?? 100)],
    ["Infinite ride stamina", String(rates.cobblemon?.infiniteRideStamina ?? true)],
  ]),
  body: `
  <h2>Catching basics</h2>
  <ul>
    <li>Craft balls from apricorns + metal cores (check REI for exact recipes).</li>
    <li>Weaken wild Pokémon before throwing.</li>
    <li>Catch-rate UI mods in the pack show helpful odds.</li>
    <li>Wild shiny rate is <strong>1 / ${shiny}</strong> — methods and breeding: <a href="Shiny.html">Shiny hunting</a>.</li>
  </ul>

  <h2>Fight or Flight</h2>
  <p>Wild Pokémon can aggro. Higher-level wilds may attack unprovoked; failed catches can provoke. Aggressive wilds may not be catchable while hostile — back off, heal, re-engage carefully.</p>

  <h2>Mega / Z / Tera / Dynamax</h2>
  <p>Mega Showdown is enabled. Full pack settings + a late-Kanto / Johto checklist: <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>.</p>

  <h2>Healing &amp; PC</h2>
  <ul>
    <li>Pokémon Centers heal the whole party.</li>
    <li><code>/pc</code> opens storage (also remote PC features via LumyMon where enabled).</li>
    <li>Keep Revives for gym runs.</li>
  </ul>
  ${navboxSystems()}
  `,
});

writePage("Breeding.html", {
  title: "Breeding",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Breeding", href: "Breeding.html" },
  ],
  lede: "Breed with CobBreeding pastures on PokeHaven EU. Eggs take minutes — claim your farm, then AFK with a plan.",
  infobox: infoboxHtml("Breeding", [
    [
      "Egg wait",
      `${Math.round((rates.breeding?.minBreedingTimeInTicks ?? 8400) / 20 / 60)}–${Math.round((rates.breeding?.maxBreedingTimeInTicks ?? 18000) / 20 / 60)} min`,
    ],
    ["Hidden Abilities", rates.breeding?.hiddenAbilitiesEnabled ? "Enabled" : "Off"],
    ["Ditto × Ditto legendaries", rates.breeding?.dittoAndDittoAllowLegendary ? "Allowed" : "Blocked"],
    ["Pasture slots", String(rates.breeding?.pastureInventorySize ?? 3)],
    ["Shiny methods", "See Shiny hunting"],
  ]),
  body: `
  <h2>Setup</h2>
  <ol class="steps">
    <li>Claim the land with <a href="Claims.html">FTB Chunks</a> so nobody loots parents or eggs.</li>
    <li>Place a <strong>pasture</strong> block (CobBreeding / pack pasture — search REI for “pasture”).</li>
    <li>Build a small pen near your bed and waystone.</li>
    <li>Put a compatible pair (same egg group, or <strong>Ditto + parent</strong>) in range of the pasture.</li>
    <li>Wait for eggs — pack config is about <strong>${Math.round((rates.breeding?.minBreedingTimeInTicks ?? 8400) / 20 / 60)}–${Math.round((rates.breeding?.maxBreedingTimeInTicks ?? 18000) / 20 / 60)} minutes</strong> per breeding window (not instant).</li>
  </ol>

  <h2>Rules that matter on PokeHaven</h2>
  <ul>
    <li><strong>Hidden Abilities</strong> can pass when the pack allows it (enabled in CobBreeding).</li>
    <li><strong>Ditto + Ditto</strong> does <em>not</em> roll random legendary / paradox / ultra beast eggs here (blocked in config).</li>
    <li>Hoppers can pull from pasture blocks (automation is allowed by pack settings).</li>
    <li>Some form features (region forms, Magikarp patterns, etc.) are marked inheritable in pack data — still verify in-game.</li>
  </ul>

  <h2>What to breed for</h2>
  <ul>
    <li><strong>Early game:</strong> catch coverage first. Don’t stall Kanto badges for a shiny project.</li>
    <li><strong>Mid game:</strong> breed for better natures / usable IVs once you have a Ditto and a balls farm.</li>
    <li><strong>Shiny projects:</strong> use Masuda-style + crystal methods — full odds page: <a href="Shiny.html">Shiny hunting</a>.</li>
  </ul>

  ${critical(
    "en",
    "<strong>Claim the pasture.</strong> Unclaimed eggs and parents are free loot for anyone."
  )}

  <div class="callout tip">
    <div class="label">Practical tip</div>
    Hatch near a Poké Center / PC. Keep the level cap in mind — bred Pokémon still respect PokeHaven’s cap when you train them.
  </div>

  <p class="see-also"><strong>See also:</strong> <a href="Shiny.html">Shiny hunting</a> · <a href="Claims.html">Claims</a> · <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Level_Cap.html">Level cap</a></p>
  ${navboxSystems()}
  `,
});

writePage("Shiny.html", {
  title: "Shiny hunting",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Shiny hunting", href: "Shiny.html" },
  ],
  lede: "How shiny odds work on PokeHaven EU / CobbleVerse — wild catches vs breeding methods from pack config.",
  infobox: infoboxHtml("Shiny odds", [
    ["Base wild rate", `1 / ${shiny}`],
    ["Masuda method", `×${rates.breeding?.shinyMethod?.masuda ?? 2} (breeding)`],
    ["Crystal method", `×${rates.breeding?.shinyMethod?.crystal ?? 2} (breeding)`],
    ["Always method", `×${rates.breeding?.shinyMethod?.always ?? 8} (breeding)`],
    ["Notice particles", `${rates.cobblemon?.shinyNoticeParticlesDistance ?? 48} blocks`],
  ]),
  body: `
  <h2>Base rate</h2>
  <p>Wild shiny rate from Cobblemon config on this pack: <strong>1 / ${shiny}</strong>. That is the default you should assume when you see a sparkle in the wild or while fishing.</p>
  <p>Shiny notice particles show within about <strong>${rates.cobblemon?.shinyNoticeParticlesDistance ?? 48} blocks</strong>.</p>

  <h2>Breeding shiny methods (CobBreeding)</h2>
  <p>Egg shiny rolls can use method multipliers from the pack’s CobBreeding config. Treat these as <strong>multipliers on the shiny check</strong> when that method applies — still rare, not “guaranteed soon”.</p>
  <table class="wikitable">
    <thead><tr><th>Method</th><th>Multiplier</th><th>Rough guide (if applied alone to 1/${shiny})</th></tr></thead>
    <tbody>
      <tr><td><strong>Masuda</strong> (different-language / Masuda-style parents)</td><td>×${rates.breeding?.shinyMethod?.masuda ?? 2}</td><td>~1 / ${Math.round(shiny / (rates.breeding?.shinyMethod?.masuda ?? 2))}</td></tr>
      <tr><td><strong>Crystal</strong></td><td>×${rates.breeding?.shinyMethod?.crystal ?? 2}</td><td>~1 / ${Math.round(shiny / (rates.breeding?.shinyMethod?.crystal ?? 2))}</td></tr>
      <tr><td><strong>Always</strong> (strongest configured method)</td><td>×${rates.breeding?.shinyMethod?.always ?? 8}</td><td>~1 / ${Math.round(shiny / (rates.breeding?.shinyMethod?.always ?? 8))}</td></tr>
    </tbody>
  </table>
  ${critical(
    "en",
    "<strong>Do not assume every multiplier stacks forever.</strong> Use REI / item tooltips / CobBreeding docs in-game for how Masuda vs crystal vs “always” combine on your pair. The table above is the pack’s configured multipliers."
  )}

  <h2>Practical hunting loops</h2>
  <ol class="steps">
    <li><strong>Wild / fishing:</strong> good biomes + balls farm. Expect long hunts at 1/${shiny}. See <a href="Fishing.html">Fishing</a> and <a href="Spawn_Lookup.html">Spawn lookup</a>.</li>
    <li><strong>Breeding:</strong> claimed pasture, Ditto + target (or compatible pair), apply Masuda-style parents when you can. Egg timing ~${Math.round((rates.breeding?.minBreedingTimeInTicks ?? 8400) / 20 / 60)}–${Math.round((rates.breeding?.maxBreedingTimeInTicks ?? 18000) / 20 / 60)} min — <a href="Breeding.html">Breeding</a>.</li>
    <li><strong>Food / cuisine buffs:</strong> CobbleCuisine can offer temporary shiny-related boosts — check food tooltips; don’t build your whole plan on a short buff.</li>
    <li><strong>Gym progress first:</strong> a shiny does not raise the level cap. Keep badges moving.</li>
  </ol>

  <h2>What won’t help (myths)</h2>
  <ul>
    <li>Standing in a “lucky” chunk without the right spawn / method.</li>
    <li>Expecting Ditto × Ditto to farm legendaries here — blocked in breeding config.</li>
    <li>Ignoring claims — someone else can steal your shiny egg project.</li>
  </ul>

  <div class="callout tip">
    <div class="label">PokeHaven note</div>
    Shiny hunting is optional content. For server progress, badges and a claimed base matter more than sparkles.
  </div>

  <p class="see-also"><strong>See also:</strong> <a href="Breeding.html">Breeding</a> · <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Fishing.html">Fishing</a> · <a href="Claims.html">Claims</a></p>
  ${navboxSystems()}
  `,
});

writePage("Mega_and_Late_Game.html", {
  title: "Mega &amp; late-game",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Mega &amp; late-game", href: "Mega_and_Late_Game.html" },
  ],
  lede: "What Mega Showdown allows on PokeHaven EU, and a practical checklist after Kanto — before you dive into Johto, raids, or legendaries.",
  infobox: infoboxHtml("Mega Showdown (pack)", [
    ["Mega Evolution", "On"],
    ["Z-Moves", "On"],
    ["Terastallization", "On"],
    ["Dynamax", "On (power spots)"],
    ["Multiple Megas", "Allowed"],
    ["Dynamax anywhere?", "No"],
    ["Power spot range", "32 blocks"],
    ["Tera shards to Tera", "50"],
  ]),
  body: `
  <h2>Priority on PokeHaven</h2>
  <ol class="steps">
    <li><strong>Badges &amp; level cap</strong> — gyms unlock levels; gimmicks do not. See <a href="Level_Cap.html">Level cap</a>.</li>
    <li><strong>Claim + heals + balls</strong> — base safety and supplies beat a flashy Mega with an empty hotbar. <a href="Claims.html">Claims</a> · <a href="Poke_Balls.html">Poké Balls</a>.</li>
    <li><strong>Learn one gimmick</strong> — Mega <em>or</em> Tera <em>or</em> Dynamax for hard fights; don’t stall Kanto collecting every stone.</li>
    <li><strong>After Blue</strong> — Johto Trainer Card (champion book), then optional post-game. <a href="Blue.html">Blue</a> · <a href="Progression.html">Progression</a>.</li>
  </ol>
  ${critical(
    "en",
    "<strong>Week-one rule:</strong> badges matter more than Mega / Dynamax flexes. Finish the next gym before you AFK for stones."
  )}

  <h2>Mega Evolution</h2>
  <ul>
    <li>Enabled. <strong>Multiple Megas</strong> are allowed in this pack’s Mega Showdown config.</li>
    <li>Outside-battle Mega is enabled (<code>outSideMega</code>) — useful for travel / showcases; battle use still needs the right held stone + Key Stone flow the mod expects.</li>
    <li>Search REI (<kbd>E</kbd>) for <em>mega</em>, <em>ite</em>, or the species name + stone. Raid dens can feature Mega bosses — <a href="Raid_Bosses.html">Raid bosses</a>.</li>
    <li>Exact Key Stone / bracelet recipes change with mod updates — trust in-game recipes over wiki screenshots.</li>
  </ul>

  <h2>Z-Moves</h2>
  <ul>
    <li>Enabled. You need the matching Z-Crystal / Z-Ring style items from Mega Showdown (REI: <em>z</em> / crystal names).</li>
    <li>One strong Z-Move can swing a gym or raid turn — still bring type coverage for the rest of the fight.</li>
  </ul>

  <h2>Terastallization</h2>
  <ul>
    <li>Enabled. Pack requires <strong>50 Tera Shards</strong> of the matching type to Terastallize (config <code>teraShardRequired</code>).</li>
    <li>Shard drop rates in config: common Tera shards <strong>10</strong>, Stellar shards <strong>1</strong> (relative drop weighting — farm via the mod’s shard sources / REI).</li>
    <li>Cobblemon also sets a wild <strong>tera type rate</strong> of <strong>20</strong> on this pack — Tera’d wilds can appear; don’t confuse that with your own Tera Orb progress.</li>
  </ul>

  <h2>Dynamax</h2>
  <ul>
    <li>Enabled, but <strong>not anywhere</strong> — you need a <strong>power spot</strong> within about <strong>32 blocks</strong>.</li>
    <li>Cobblemon max Dynamax level on this pack: <strong>10</strong>.</li>
    <li>Scale factor is large in config — watch space and friendly fire in crowded dens.</li>
    <li>Related craft in datapack recipes: <strong>Star Core</strong> (uses a Wishing Star + gems) — check REI for the grid.</li>
  </ul>

  <h2>Late-game checklist (after late Kanto / Blue)</h2>
  <table class="wikitable">
    <thead><tr><th>Done?</th><th>Task</th><th>Why</th></tr></thead>
    <tbody>
      <tr><td>☐</td><td>Beat <a href="Blue.html">Champion Blue</a></td><td>Kanto clear; Johto path opens on PokeHaven</td></tr>
      <tr><td>☐</td><td>Follow champion book → Trainer Association → <strong>Johto Trainer Card</strong></td><td>Your level cap resets for Johto; others unaffected</td></tr>
      <tr><td>☐</td><td>Craft <strong>Johto</strong> maps on the <strong>Johto Cartography Table</strong></td><td>Wrong region table = wasted Empty Maps — <a href="Gym_Maps.html">Gym maps</a></td></tr>
      <tr><td>☐</td><td>Heal party + restock balls / Revives</td><td>Johto leaders hit harder than early Kanto</td></tr>
      <tr><td>☐</td><td>Re-check <a href="Claims.html">FTB claim</a> (base, pasture, waystone)</td><td>Late-game loot is worth stealing</td></tr>
      <tr><td>☐</td><td>Pick <em>one</em> gimmick to learn (Mega / Tera / Dynamax)</td><td>Avoid inventory clutter and decision paralysis</td></tr>
      <tr><td>☐</td><td>Optional: <a href="Postgame_and_Legendaries.html">Mew / birds / Mewtwo</a></td><td>Parallel track — not required for Johto gyms</td></tr>
      <tr><td>☐</td><td>Optional: higher-tier <a href="Raids.html">raids</a> with friends</td><td>Mega raid bosses + shard/loot loops</td></tr>
      <tr><td>☐</td><td>Optional: <a href="Shiny.html">shiny</a> / <a href="Breeding.html">breeding</a> projects</td><td>Fun side content; claim the pasture</td></tr>
    </tbody>
  </table>

  <div class="callout tip">
    <div class="label">If Johto structures are missing</div>
    Ask in Discord — staff may need <em>one</em> server restart. Do <strong>not</strong> “close the world” like single-player CobbleVerse text sometimes implies. See <a href="FAQ.html">FAQ</a>.
  </div>

  <h2>What this page is not</h2>
  <ul>
    <li>A full list of every Mega stone location (use REI + raids + exploration).</li>
    <li>A replacement for gym walkthroughs — start <a href="Gyms_Johto.html">Johto</a> when the checklist above is green.</li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Progression.html">Progression</a> · <a href="Gyms_Johto.html">Johto</a> · <a href="Raids.html">Raids</a></p>
  ${navboxSystems()}
  `,
});

writePage("Fishing.html", {
  title: "Fishing",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Fishing", href: "Fishing.html" },
  ],
  lede: "On CobbleVerse / PokeHaven EU you can fish up <strong>Pokémon</strong> — not only vanilla fish. Use Cobblemon rods in the right water biome.",
  infobox: infoboxHtml("Fishing", [
    ["Goal", "Catch water Pokémon via rod"],
    ["Tools", "Cobblemon rods (REI: “rod”)"],
    ["Data", `${spawns.filter((s) => s.position === "fishing").length} fishing spawn rows`],
    ["Party required?", "No (PokeHaven config)"],
  ]),
  body: `
  <h2>Why fish?</h2>
  <p>This pack has <strong>${spawns.filter((s) => s.position === "fishing").length} fishing spawn rows</strong>. Many Water types (and some ultra-rares) show up on the rod that you rarely meet on land. Use it for Misty coverage, ocean hunts, and shiny side projects — not only AFK fluff.</p>

  <h2>How to start</h2>
  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>Craft the rod in REI.</strong> Open inventory (<kbd>E</kbd>), search <em>Poke Rod</em> or <em>rod</em>, and craft a Cobblemon rod — not only the vanilla Minecraft fishing rod.",
    "REI recipe browser used to craft a Cobblemon fishing rod"
  )}
  <ol class="steps">
    <li>Search REI for <strong>Poke Rod</strong> / <strong>rod</strong> and craft a Cobblemon rod (Poke → Great → Ultra → Master, or themed rods like Lure / Net / Dive).</li>
    <li>Stand next to water that matches the biome you want (river / lake vs ocean / coast).</li>
    <li>Cast, wait for the bite bobber, reel in — a wild Pokémon encounter can start instead of a fish item.</li>
    <li>Catch with balls as usual. Keep a claimed dock if you AFK.</li>
  </ol>
  ${figure(
    guideImg("catching.png"),
    "<strong>After the bite.</strong> A fishing encounter is still a normal catch fight — weaken, then throw. Keep balls on the hotbar.",
    "Catching a wild Pokémon after a fishing encounter"
  )}

  ${critical(
    "en",
    "<strong>Use Cobblemon rods for Pokémon.</strong> If you only get sticks and pufferfish, you are probably on a vanilla rod or the wrong water/biome."
  )}

  <h2>Rods, lure level &amp; bait</h2>
  <ul>
    <li><strong>Rod tiers</strong> raise <em>lure level</em>. Higher lure unlocks rows that require <code>minLureLevel</code> 1–3+.</li>
    <li>Themed rods (Net, Dive, Friend, Lure, …) craft via REI; chests can drop damaged rods.</li>
    <li><strong>Bait</strong> — attach / use when the tooltip allows. REI search: <em>bait</em>.</li>
    <li>You do <strong>not</strong> need a Pokémon in your party to fish on PokeHaven EU.</li>
  </ul>

  <h2>Where to cast</h2>
  <ul>
    <li><strong>Freshwater</strong> (~${spawns.filter((s) => s.position === "fishing" && (s.biomes || []).some((b) => /freshwater/i.test(b))).length} tagged rows) — rivers / lakes: Psyduck, Goldeen, Squirtle (ultra-rare), …</li>
    <li><strong>Ocean / coast</strong> (~${spawns.filter((s) => s.position === "fishing" && (s.biomes || []).some((b) => /ocean|coast/i.test(b))).length} tagged rows) — Tentacool, Horsea, Staryu, Chinchou, Lapras, Relicanth, …</li>
    <li>Some species also have <em>submerged</em> / <em>surface</em> rows (swim/boat). Context <code>fishing</code> is rod-only.</li>
    <li>Move biomes if you only see the same commons — the pool is tag-driven.</li>
  </ul>

  <h2>Pack examples (fishing context)</h2>
  <p>Sample rows from CobbleVerse spawn data on this wiki. Weights are relative within the pool — not a guarantee “next cast”.</p>
  <table class="wikitable">
    <thead><tr><th>Pokémon</th><th>Bucket</th><th>Levels</th><th>Typical biomes (tags)</th><th>Lookup</th></tr></thead>
    <tbody>
      <tr><td>Magikarp</td><td>common</td><td>1–20</td><td><code>is_overworld</code> (+ Aether)</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=magikarp">open</a></td></tr>
      <tr><td>Psyduck</td><td>common</td><td>7–32</td><td><code>is_freshwater</code>, forest, grassland, …</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=psyduck">open</a></td></tr>
      <tr><td>Goldeen</td><td>common</td><td>7–32</td><td>many freshwater / temperate tags</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=goldeen">open</a></td></tr>
      <tr><td>Tentacool</td><td>common</td><td>9–29</td><td><code>is_ocean</code> / overworld</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=tentacool">open</a></td></tr>
      <tr><td>Staryu</td><td>common–uncommon</td><td>9–34</td><td>coast, ocean, tropical island</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=staryu">open</a></td></tr>
      <tr><td>Squirtle</td><td>ultra-rare</td><td>5–31</td><td>freshwater + hills / jungle / temperate / tropical</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=squirtle">open</a></td></tr>
      <tr><td>Lapras</td><td>common–ultra-rare</td><td>29–54</td><td>frozen ocean / ocean (higher levels)</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=lapras">open</a></td></tr>
      <tr><td>Relicanth</td><td>common–rare</td><td>24–49</td><td>deep ocean / ocean</td><td><a href="Spawn_Lookup.html?ctx=fishing&amp;q=relicanth">open</a></td></tr>
    </tbody>
  </table>

  <h2>Spawn lookup — worked examples</h2>
  <ol class="steps">
    <li>Open <a href="Spawn_Lookup.html?ctx=fishing">Spawn lookup with Context = fishing</a>.</li>
    <li>Type a species in <strong>Pokémon name</strong> (example: <a href="Spawn_Lookup.html?ctx=fishing&amp;q=tentacool">tentacool</a>).</li>
    <li>Or filter biomes: <a href="Spawn_Lookup.html?ctx=fishing&amp;biome=freshwater">fishing + freshwater</a> · <a href="Spawn_Lookup.html?ctx=fishing&amp;biome=ocean">fishing + ocean</a>.</li>
    <li>Combine both when hunting a rare: <a href="Spawn_Lookup.html?ctx=fishing&amp;q=squirtle&amp;biome=freshwater">squirtle + freshwater</a>.</li>
    <li>Read <strong>Bucket</strong> + <strong>Level</strong> — ultra-rare + high level means bring Ultra Balls and respect the <a href="Level_Cap.html">level cap</a>.</li>
  </ol>

  <h2>Quick fixes</h2>
  <table class="wikitable">
    <thead><tr><th>Symptom</th><th>Try</th></tr></thead>
    <tbody>
      <tr><td>Only vanilla fish / junk</td><td>Switch to a Cobblemon rod (REI: Poke Rod)</td></tr>
      <tr><td>Same commons forever</td><td>Change biome (river ↔ ocean); check lookup tags</td></tr>
      <tr><td>Want Misty Water types</td><td>Freshwater dock + Psyduck / Goldeen loop — <a href="Misty.html">Misty</a></td></tr>
      <tr><td>AFK dock griefed</td><td><a href="Claims.html">FTB Chunks</a> around the pier</td></tr>
    </tbody>
  </table>

  <div class="callout tip">
    <div class="label">Gym tip</div>
    Fishing is great for Water coverage before Misty / later oceans, but the level cap still applies — do not overlevel while grinding bites.
  </div>

  <p class="see-also"><strong>See also:</strong> <a href="Spawn_Lookup.html?ctx=fishing">Spawn lookup (fishing)</a> · <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Shiny.html">Shiny hunting</a> · <a href="Claims.html">Claims</a></p>
  ${navboxSystems()}
  `,
});

writePage("Claims.html", {
  title: "Claims",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Claims", href: "Claims.html" },
  ],
  lede: "Protect chests, farms, and waystones. On PokeHaven EU, use <strong>FTB Chunks</strong>.",
  body: `
  <h2>How to claim</h2>
  <ol class="steps">
    <li>Open the FTB Chunks map (keybind under Esc → Options → Controls — search “FTB” / “Chunks”).</li>
    <li>Claim chunks around your bed, chests, farm, and waystone.</li>
    <li>Claim a buffer — not only the exact footprint of your house.</li>
    <li>Playing together? Create an FTB Team so you share access.</li>
  </ol>
  ${critical(
    "en",
    "<strong>Stick to FTB Chunks only.</strong> The pack also ships another claims mod — do not mix both on the same base."
  )}
  <p>Pack configs allow large claim budgets (hundreds of chunks). Still claim only what you use.</p>
  ${navboxSystems()}
  `,
});

writePage("Travel.html", {
  title: "Travel",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Travel", href: "Travel.html" },
  ],
  lede: "Waystones are free fast-travel hubs on this pack config (no cost / cooldown).",
  body: `
  <figure class="figure">
    <img src="../assets/waystone.png" alt="Waystone" />
    <figcaption>Right-click to activate. Shift + right-click to rename. Build a network: Spawn, Home, Gyms, Towns.</figcaption>
  </figure>
  <h2>Waystones vs map pins</h2>
  <table class="wikitable">
    <thead><tr><th>System</th><th>Others see it?</th><th>Teleports?</th></tr></thead>
    <tbody>
      <tr><td>Waystone</td><td>Shared if public / server stones</td><td>Yes, once activated</td></tr>
      <tr><td>Xaero map pin</td><td>Usually only you</td><td>No — marker only</td></tr>
      <tr><td>Gym map</td><td>Item in your inventory</td><td>No — navigation aid</td></tr>
    </tbody>
  </table>
  <p>Also useful: Nature’s Compass, Explorer’s Compass, Xaero’s World Map.</p>
  ${navboxSystems()}
  `,
});

writePage("Voice_Chat.html", {
  title: "Voice chat",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Voice chat", href: "Voice_Chat.html" },
  ],
  lede: "Simple Voice Chat is included. You do not need Discord for nearby talk.",
  infobox: infoboxHtml("Voice", [
    ["Hear distance", "~48 blocks (pack default)"],
    ["Whisper", "~24 blocks"],
    ["Groups", "Enabled"],
    ["Forced VC", "No"],
  ]),
  body: `
  <h2>Tips</h2>
  <ul>
    <li>Allow the voice chat permission / open the keybind menu on first join.</li>
    <li>Use groups for raid parties or building crews.</li>
    <li>Sound Physics can make caves / buildings sound more realistic.</li>
  </ul>
  ${navboxSystems()}
  `,
});

writePage("FAQ.html", {
  title: "FAQ",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "FAQ", href: "FAQ.html" },
  ],
  lede: "Quick answers to problems every new PokeHaven trainer hits.",
  body: `
  <h2>Why did my Pokémon stop leveling?</h2>
  <p><a href="Level_Cap.html">Level cap</a>. Beat the next gym.</p>

  <h2>I can't join the server</h2>
  <p>Wrong pack version. Re-import the shared 1.7.42 zip from Discord/Drive.</p>

  <h2>Textures look broken</h2>
  <p>Fully reload resource packs / restart the client. FancyMenu tip: hold <kbd>T</kbd> briefly if prompted for pack issues.</p>

  <h2>My Empty Map became useless</h2>
  <p>You probably right-clicked it in the world. Craft a new Empty Map and combine it in the cartography table — see <a href="Gym_Maps.html">Gym maps</a>.</p>

  <h2>Someone opened my chests</h2>
  <p>Claim with <a href="Claims.html">FTB Chunks</a> immediately.</p>

  <h2>Where is Brock?</h2>
  <p>Craft Brock’s map with the starter Cartography Table + Brock Map Key + Empty Map. See <a href="Brock.html">Brock</a>.</p>
  `,
});

// Phase 2 databases
writePage("Trainer_Index.html", {
  title: "Trainer index",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Trainer index", href: "Trainer_Index.html" },
  ],
  lede: `Searchable list of <strong>${trainers.all.length}</strong> named trainers from the RCT datapack.`,
  body: `
  <div class="filter-bar">
    <input id="trainer-filter" type="search" placeholder="Filter by name or id…" style="min-width:220px;flex:1" />
    <select id="trainer-region">
      <option value="">All regions</option>
      <option value="kanto">Kanto</option>
      <option value="johto">Johto</option>
      <option value="hoenn">Hoenn</option>
      <option value="sinnoh">Sinnoh</option>
      <option value="team">Teams</option>
      <option value="other">Other</option>
    </select>
  </div>
  <div id="trainer-results"></div>
  <script>
  const TRAINERS = ${JSON.stringify(
    trainers.all.map((t) => ({
      id: t.id,
      name: t.name,
      region: t.region,
      size: t.team.length,
      levels: t.team.map((m) => m.level).join(", "),
      href: (() => {
        const hit = [...trainers.kantoLeaders, ...(trainers.johtoLeaders || [])].find(
          (k) => k.id === t.id
        );
        return hit ? hit.slug + ".html" : null;
      })(),
    }))
  )};
  function renderTrainers() {
    const q = document.getElementById('trainer-filter').value.toLowerCase();
    const r = document.getElementById('trainer-region').value;
    const rows = TRAINERS.filter(t => (!r || t.region===r) && (!q || t.name.toLowerCase().includes(q) || t.id.includes(q)))
      .slice(0, 300)
      .map(t => '<tr><td>'+(t.href?'<a href="'+t.href+'">'+t.name+'</a>':t.name)+'</td><td><code>'+t.id+'</code></td><td>'+t.region+'</td><td>'+t.size+'</td><td>'+t.levels+'</td></tr>')
      .join('');
    document.getElementById('trainer-results').innerHTML = '<table class="wikitable"><thead><tr><th>Name</th><th>ID</th><th>Region</th><th>Party</th><th>Levels</th></tr></thead><tbody>'+rows+'</tbody></table>';
  }
  document.getElementById('trainer-filter').addEventListener('input', renderTrainers);
  document.getElementById('trainer-region').addEventListener('change', renderTrainers);
  renderTrainers();
  </script>
  ${navboxSystems()}
  `,
});

writePage("Raid_Bosses.html", {
  title: "Raid bosses",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Raid bosses", href: "Raid_Bosses.html" },
  ],
  lede: `Boss entries from <code>cobblemonraiddens</code> datapack (${raids.bosses.length} files).`,
  body: `
  <div class="filter-bar">
    <input id="raid-filter" type="search" placeholder="Filter bosses…" style="min-width:220px;flex:1" />
  </div>
  <div id="raid-results"></div>
  <script>
  const BOSSES = ${JSON.stringify(raids.bosses)};
  function renderRaids() {
    const q = document.getElementById('raid-filter').value.toLowerCase();
    const rows = BOSSES.filter(b => !q || b.label.toLowerCase().includes(q) || b.id.includes(q))
      .map(b => '<tr><td>'+b.label+'</td><td><code>'+b.id+'</code></td><td>'+(b.pokemon||'—')+'</td><td>'+(b.tier??'—')+'</td></tr>')
      .join('');
    document.getElementById('raid-results').innerHTML = '<table class="wikitable"><thead><tr><th>Name</th><th>ID</th><th>Pokémon</th><th>Tier</th></tr></thead><tbody>'+rows+'</tbody></table>';
  }
  document.getElementById('raid-filter').addEventListener('input', renderRaids);
  renderRaids();
  </script>
  <p><a href="Raids.html">← Raid rules &amp; tiers</a></p>
  ${navboxSystems()}
  `,
});

// Compact spawn dataset for browser (limit fields)
const spawnLite = spawns.map((s) => ({
  p: s.pokemon,
  b: s.bucket,
  l: String(s.level),
  w: s.weight,
  m: (s.biomes || []).join(", "),
  t: s.position,
}));
fs.writeFileSync(path.join(DATA, "spawns-lite.json"), JSON.stringify(spawnLite));

writePage("Spawn_Lookup.html", {
  title: "Spawn lookup",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Spawn lookup", href: "Spawn_Lookup.html" },
  ],
  lede: `Search CobbleVerse world spawn pool rows (${spawns.length}). Biome tags are pack tags (e.g. <code>#cobblemon:is_forest</code>). Use Context = <code>fishing</code> for rod encounters — see <a href="Fishing.html">Fishing</a>.`,
  body: `
  <div class="filter-bar">
    <input id="spawn-q" type="search" placeholder="Pokémon name…" style="min-width:180px;flex:1" />
    <input id="spawn-biome" type="search" placeholder="Biome contains…" style="min-width:180px;flex:1" />
    <select id="spawn-bucket">
      <option value="">All buckets</option>
      <option>common</option>
      <option>uncommon</option>
      <option>rare</option>
      <option>ultra-rare</option>
    </select>
    <select id="spawn-ctx">
      <option value="">All contexts</option>
      <option value="fishing">fishing</option>
      <option value="grounded">grounded</option>
      <option value="submerged">submerged</option>
      <option value="surface">surface</option>
      <option value="seafloor">seafloor</option>
    </select>
  </div>
  <p class="muted">Showing up to 200 matches. Full dataset: <code>data/spawns.json</code>.</p>
  <div id="spawn-results"></div>
  <script type="module">
  const res = await fetch('../data/spawns-lite.json');
  const SPAWNS = await res.json();
  const params = new URLSearchParams(location.search);
  if (params.get('ctx')) document.getElementById('spawn-ctx').value = params.get('ctx');
  if (params.get('q')) document.getElementById('spawn-q').value = params.get('q');
  if (params.get('biome')) document.getElementById('spawn-biome').value = params.get('biome');
  if (params.get('bucket')) document.getElementById('spawn-bucket').value = params.get('bucket');
  function render() {
    const q = document.getElementById('spawn-q').value.toLowerCase();
    const biome = document.getElementById('spawn-biome').value.toLowerCase();
    const bucket = document.getElementById('spawn-bucket').value;
    const ctx = document.getElementById('spawn-ctx').value;
    const rows = SPAWNS.filter(s =>
      (!q || String(s.p).toLowerCase().includes(q)) &&
      (!biome || String(s.m).toLowerCase().includes(biome)) &&
      (!bucket || s.b === bucket) &&
      (!ctx || s.t === ctx)
    ).slice(0, 200).map(s =>
      '<tr><td>'+s.p+'</td><td>'+s.b+'</td><td>'+s.l+'</td><td>'+(s.w??'—')+'</td><td>'+s.t+'</td><td style="font-size:0.85em">'+s.m+'</td></tr>'
    ).join('');
    document.getElementById('spawn-results').innerHTML =
      '<table class="wikitable"><thead><tr><th>Pokémon</th><th>Bucket</th><th>Level</th><th>Weight</th><th>Context</th><th>Biomes</th></tr></thead><tbody>'+
      (rows || '<tr><td colspan="6">No matches</td></tr>') + '</tbody></table>';
  }
  for (const id of ['spawn-q','spawn-biome','spawn-bucket','spawn-ctx']) {
    document.getElementById(id).addEventListener('input', render);
    document.getElementById(id).addEventListener('change', render);
  }
  render();
  </script>
  ${navboxSystems()}
  `,
});

registerDeepPages({
  writePage,
  navboxSystems,
  navboxGyms,
  economy,
  shiny,
  xpMult,
  advancements,
});

registerMinecraftGuides({
  writePage,
  navboxMinecraft,
  navboxSystems,
});

registerExpansionPages({
  writePage,
  navboxSystems,
  navboxMinecraft,
  navboxGyms,
  recipesMeta,
  trainers,
});

// Johto gym hub + individual deep guides (same depth as Kanto)
{
  const johto = trainers.johtoLeaders || [];
  const rows = johto
    .map(
      (g) => `<tr>
      <td><a href="${g.slug}.html">${esc(g.name)}</a></td>
      <td>${esc(g.type)}</td>
      <td>${esc(g.badge)}</td>
      <td>${esc(g.biome)}</td>
      <td>${esc(mapItemLabel(g))}</td>
      <td>${g.team?.[0]?.level ?? "—"}–${g.team?.[g.team.length - 1]?.level ?? "—"}</td>
    </tr>`
    )
    .join("");
  writePage("Gyms_Johto.html", {
    title: "Johto gyms",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Johto gyms", href: "Gyms_Johto.html" },
    ],
    lede: "Checklist for the Johto challenge on CobbleVerse / PokeHaven EU after <a href=\"Blue.html\">Champion Blue</a>. Open a leader page for full teams from pack data.",
    body: `
    <h2>Unlock</h2>
    <ol class="steps">
      <li>Beat <a href="Blue.html">Blue</a> and follow the champion book → Trainer Association → <strong>Johto Trainer Card</strong>.</li>
      <li>Craft maps on the <strong>Johto Cartography Table</strong> — not the Kanto table. See <a href="Gym_Maps.html">Gym maps</a>.</li>
      <li>Start with <a href="Valerio.html">Valerio</a> (Zephyr Badge). Late-game checklist: <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>.</li>
    </ol>
    <h2>Gym leaders &amp; league</h2>
    <table class="wikitable">
      <thead><tr><th>Trainer</th><th>Type</th><th>Badge / role</th><th>Biome / place</th><th>Map item</th><th>Team lv</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="callout tip">
      <div class="label">Name collisions</div>
      Johto’s Elite Four includes trainers also named Koga / Bruno / Lance. Their pages are <a href="Johto_Koga.html">Johto Koga</a>, <a href="Johto_Bruno.html">Johto Bruno</a>, and <a href="Johto_Lance.html">Johto Lance</a> — separate from the Kanto pages.
    </div>
    <p>Track badges in Advancements too — <a href="Achievements.html">Achievements</a>. After Johto Champion: <a href="Gyms_Hoenn.html">Hoenn</a>.</p>
    ${navboxGyms()}
    `,
  });

  for (const g of johto) {
    const maxLv = teamMaxLevel(g);
    const minLv = Math.min(...g.team.map((m) => Number(m.level) || 99));
    const displayName =
      g.slug === "Johto_Koga"
        ? "Koga (Johto)"
        : g.slug === "Johto_Bruno"
          ? "Bruno (Johto)"
          : g.slug === "Johto_Lance"
            ? "Lance (Johto Champion)"
            : g.name;
    writePage(`${g.slug}.html`, {
      title: displayName,
      searchIndexTitle: displayName,
      breadcrumbs: [
        { label: "Main Page", href: "../index.html" },
        { label: "Johto gyms", href: "Gyms_Johto.html" },
        { label: displayName, href: `${g.slug}.html` },
      ],
      lede: `${esc(displayName)} — ${esc(g.type)} specialist. Team data from the CobbleVerse RCT datapack used on PokeHaven EU.`,
      infobox: infoboxHtml(displayName, [
        ["Region", "Johto"],
        ["Role", g.order <= 8 ? "Gym Leader" : g.order === 13 ? "Champion" : "Elite Four"],
        ["Type focus", esc(g.type)],
        ["Badge / title", esc(g.badge)],
        ["Location tip", esc(g.biome)],
        ["Map item", esc(mapItemLabel(g))],
        ["Approx cap (while next)", `~${approxCapWhileNext(g)}`],
        ["Team levels", `${minLv}–${maxLv}`],
        ["Party size", String(g.team.length)],
        ["Bag items", g.bag.length ? esc(g.bag.join(", ")) : "—"],
      ]),
      body: `
    ${gymGuideBody(g)}

    <h2>Team</h2>
    ${teamTable(g.team)}
    ${navboxGyms()}
    `,
    });
  }
}

// Final Main Page IA (all-in-one)
writePage("index.html", {
  title: "PokeHaven EU Wiki",
  searchIndexTitle: "Main Page",
  hideToc: true,
  isHub: true,
  hideTitle: true,
  breadcrumbs: [],
  lede: "",
  body: `
  <section class="landing-hero">
    <div class="chips" style="margin-bottom:0.85rem;">
      <span class="chip"><strong>PokeHaven EU</strong></span>
      <span class="chip">CobbleVerse 1.7.42</span>
    </div>
    <h1 class="landing-brand">PokeHaven EU</h1>
    <p class="landing-lead">Player wiki for our CobbleVerse server — join, gyms, recipes, and survival.</p>
    <div class="join-cta">
      <div class="join-cta-main">
        <span class="join-label">Join the server</span>
        <strong class="join-name">PokeHaven EU</strong>
        <span class="join-meta">Pack <strong>1.7.42</strong> · IP from Discord only</span>
      </div>
      <div class="join-cta-actions">
        <a class="join-btn" href="pages/Getting_Started.html">How to join</a>
        <a class="join-btn-discord" href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a>
      </div>
    </div>
  </section>

  <h2>New players</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Getting_Started.html"><h3>Getting started</h3><p>Install 1.7.42 and join.</p></a>
    <a class="hub-card" href="pages/First_Hours.html"><h3>First hours</h3><p>Checklist with HUD screenshots.</p></a>
    <a class="hub-card" href="pages/Brock.html"><h3>Brock</h3><p>First gym deep guide.</p></a>
    <a class="hub-card" href="pages/Level_Cap.html"><h3>Level cap</h3><p>Why XP freezes — and the ladder.</p></a>
    <a class="hub-card" href="pages/Essential_Recipes.html"><h3>Essential recipes</h3><p>Balls, maps, tools, REI.</p></a>
    <a class="hub-card" href="pages/FAQ.html"><h3>FAQ</h3><p>Join issues &amp; common fixes.</p></a>
  </div>

  <h2>Gyms &amp; progression</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Gyms_Kanto.html"><h3>Kanto</h3><p>All 8 leaders + Elite Four.</p></a>
    <a class="hub-card" href="pages/Gyms_Johto.html"><h3>Johto</h3><p>Valerio → Lance — deep guides.</p></a>
    <a class="hub-card" href="pages/Misty.html"><h3>Misty</h3><p>Second gym deep guide.</p></a>
    <a class="hub-card" href="pages/Valerio.html"><h3>Valerio</h3><p>First Johto gym — Flying.</p></a>
    <a class="hub-card" href="pages/Gym_Maps.html"><h3>Gym maps</h3><p>Cartography &amp; coordinates.</p></a>
    <a class="hub-card" href="pages/Blue.html"><h3>Champion Blue</h3><p>End of Kanto — then Johto.</p></a>
    <a class="hub-card" href="pages/Progression.html"><h3>Progression</h3><p>Regions &amp; the gym loop.</p></a>
    <a class="hub-card" href="pages/Achievements.html"><h3>Achievements</h3><p>Pack advancement checklist.</p></a>
    <a class="hub-card" href="pages/Postgame_and_Legendaries.html"><h3>Post-game</h3><p>Mew, birds, Mewtwo.</p></a>
    <a class="hub-card" href="pages/Mega_and_Late_Game.html"><h3>Mega &amp; late-game</h3><p>Gimmicks + after-Blue checklist.</p></a>
  </div>

  <h2>Minecraft &amp; recipes</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Minecraft_Hub.html"><h3>Minecraft hub</h3><p>Survival guides in one place.</p></a>
    <a class="hub-card" href="pages/Poke_Balls.html"><h3>Poké Balls</h3><p>Apricorns + crafting screenshots.</p></a>
    <a class="hub-card" href="pages/Recipe_Browser.html"><h3>Recipe browser</h3><p>${recipesMeta.count} datapack crafts.</p></a>
    <a class="hub-card" href="pages/Economy.html"><h3>Economy</h3><p>Shop &amp; bank prices.</p></a>
  </div>

  <h2>Systems</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Catching_and_Battling.html"><h3>Catching &amp; battling</h3><p>Combat primer.</p></a>
    <a class="hub-card" href="pages/Raids.html"><h3>Raids</h3><p>Dens and tiers.</p></a>
    <a class="hub-card" href="pages/Claims.html"><h3>Claims</h3><p>FTB Chunks.</p></a>
    <a class="hub-card" href="pages/Travel.html"><h3>Travel</h3><p>Waystones.</p></a>
    <a class="hub-card" href="pages/Breeding.html"><h3>Breeding</h3><p>Pasture, eggs, Ditto rules.</p></a>
    <a class="hub-card" href="pages/Shiny.html"><h3>Shiny hunting</h3><p>Rates, Masuda, crystals.</p></a>
    <a class="hub-card" href="pages/Fishing.html"><h3>Fishing</h3><p>Cobblemon rods &amp; water catches.</p></a>
    <a class="hub-card" href="pages/Outfits_and_Cosmetics.html"><h3>Outfits &amp; cosmetics</h3><p>Trainer clothes &amp; Pokémon looks.</p></a>
    <a class="hub-card" href="pages/Common_Mistakes.html"><h3>Common mistakes</h3><p>Fix these once.</p></a>
  </div>

  <h2>Databases</h2>
  <div class="hub-grid hub-grid-compact">
    <a class="hub-card" href="pages/Trainer_Index.html"><h3>Trainer index</h3><p>${trainers.all.length} trainers.</p></a>
    <a class="hub-card" href="pages/Raid_Bosses.html"><h3>Raid bosses</h3><p>${raids.bosses.length} bosses.</p></a>
    <a class="hub-card" href="pages/Spawn_Lookup.html"><h3>Spawn lookup</h3><p>${spawns.length} spawn rows.</p></a>
  </div>
  `,
});

writePage("FAQ.html", {
  title: "FAQ",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "FAQ", href: "FAQ.html" },
  ],
  lede: "Expanded answers for the problems every new PokeHaven trainer hits.",
  body: `
  ${figure(
    guideImg("multiplayer-join.png"),
    "<strong>Joining.</strong> Server list name is <code>PokeHaven EU</code>. Pack must be CobbleVerse <strong>1.7.42</strong>. Copy the IP from Discord — it can rotate.",
    "Client ready to join multiplayer"
  )}

  <h2>What is the server called?</h2>
  <p><strong>PokeHaven EU</strong> is the label you type in Multiplayer → Add Server. The coloured MOTD under it comes from the server.</p>

  <h2>Why did my Pokémon stop leveling?</h2>
  ${critical(
    "en",
    "<strong>Level cap — not a bug.</strong> Beat the next gym. Check your Trainer Card. See <a href=\"Level_Cap.html\">Level cap</a>."
  )}

  <h2>I can't join the server</h2>
  ${critical(
    "en",
    "<strong>Wrong pack version is the usual cause.</strong> Re-import the shared CobbleVerse <strong>1.7.42</strong> zip from Discord/Drive. See <a href=\"Getting_Started.html\">Getting started</a>."
  )}

  <h2>Textures look broken</h2>
  <p>Fully restart the client after import. If FancyMenu prompts about resources, follow it (sometimes hold <kbd>T</kbd>). Re-download the pack if files were interrupted.</p>

  <h2>My Empty Map became useless</h2>
  ${critical(
    "en",
    "<strong>You right-clicked it in the world.</strong> Craft a new Empty Map and combine it on the Kanto Cartography Table — <a href=\"Gym_Maps.html\">Gym maps</a>."
  )}

  ${figure(
    guideImg("claims-ftb.png"),
    "<strong>Claim before you leave valuables.</strong> If someone opened your chests, paint FTB Chunks around bed, storage, farm, and waystone. See <a href='Claims.html'>Claims</a>.",
    "FTB Chunks claim map"
  )}

  <h2>Seagrass drops nothing</h2>
  ${critical(
    "en",
    "<strong>Use Shears.</strong> Hand-breaking seagrass yields zero in Java Edition."
  )}

  <h2>Someone opened my chests</h2>
  <p>Claim with <a href="Claims.html">FTB Chunks</a> immediately.</p>

  <h2>Where is Brock?</h2>
  <p>Craft Brock’s map with the starter Cartography Table + Brock Map Key + Empty Map. Walkthrough: <a href="Brock.html">Brock</a>.</p>

  <h2>How do I craft Poké Balls?</h2>
  <p>Full screenshot guide: <a href="Poke_Balls.html">Poké Balls</a>. More crafts: <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Recipe_Browser.html">Recipe browser</a>.</p>

  <h2>Where are normal Minecraft tips?</h2>
  <p><a href="Minecraft_Hub.html">Minecraft survival hub</a> — mining, farming, Nether, villages, death, and <a href="Pack_Differences.html">what this pack changes</a>.</p>

  <h2>Is there a quest arrow?</h2>
  <p>No single quest arrow. Use <a href="Gym_Maps.html">gym maps</a>, the <a href="Level_Cap.html">level cap</a>, and the Advancements checklist (<a href="Achievements.html">Achievements</a> — often <kbd>L</kbd>). Post-league goals: <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a>.</p>

  <h2>Can I loot villages?</h2>
  <p>Yes. Center/house chests are fair game. On PokeHaven EU, emptied loot may refresh later.</p>

  <h2>Voice chat key?</h2>
  <p>Esc → Options → Controls → Simple Voice Chat. Push-to-talk is nicest in groups. See <a href="Voice_Chat.html">Voice chat</a>.</p>

  <h2>Where is the player wiki?</h2>
  <p><strong><a href="https://pokehaven.wiki">pokehaven.wiki</a></strong> — English + Nederlands (flags on the site). Also pinned in Discord <code>#pokehaven-wiki</code>. Start with Getting started, Claims, Gym maps, Brock.</p>

  <h2>Where do I ask for help?</h2>
  <p><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a> — send a screenshot + what you already tried. IP and pack links live in <code>#how-to-join</code>.</p>

  <h2>Can I turn off the level cap?</h2>
  ${critical(
    "en",
    "<strong>No — not on PokeHaven EU.</strong> Beat the next gym. See <a href=\"Level_Cap.html\">Level cap</a>."
  )}

  <h2>Why aren’t Pokémon biting my fishing rod?</h2>
  <p>Use a <strong>Cobblemon</strong> rod (Poke Rod / Lure Rod / …), not only a vanilla Minecraft rod. Guide: <a href="Fishing.html">Fishing</a>.</p>

  <h2>How do shiny odds work?</h2>
  <p>Wild base rate is <strong>1 / 2048</strong>. Breeding can use Masuda / crystal methods. Full page: <a href="Shiny.html">Shiny hunting</a> · <a href="Breeding.html">Breeding</a>.</p>

  <h2>I beat Blue — do I restart the server?</h2>
  <p><strong>No.</strong> On PokeHaven, follow the champion book: Trainer Association → Johto Trainer Card (your cap resets; others unaffected). If Johto structures are missing, ask in Discord — staff may need <em>one</em> restart. Checklist: <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a> · <a href="Progression.html">Progression</a> · <a href="Blue.html">Blue</a>.</p>

  <h2>How do outfits / costumes work?</h2>
  <p>Craft trainer clothes with Cloth (wool + string), equip in armor slots. Pokémon looks use cosmetic slots / special items (Pika Case, Furfrou + dye + Shears, Lucario Costume Box). Full guide: <a href="Outfits_and_Cosmetics.html">Outfits and cosmetics</a>.</p>
  ${critical(
    "en",
    "<strong>Cosplay Pikachu cannot evolve into Raichu.</strong> Use a normal Pallet Pikachu if you want Raichu."
  )}

  <p class="see-also"><strong>See also:</strong> <a href="Common_Mistakes.html">Common mistakes</a> · <a href="https://pokehaven.wiki">Wiki home</a> · <a href="Roadmap.html">30-day roadmap</a></p>
  `,
});

registerDutchSite({
  writePage,
  recipesMeta,
  trainers,
  raids,
  spawns,
  advancements,
  searchIndex,
  searchIndexNl,
});

fs.writeFileSync(path.join(DATA, "search-index.json"), JSON.stringify(searchIndex, null, 2));
fs.writeFileSync(path.join(DATA, "search-index-nl.json"), JSON.stringify(searchIndexNl, null, 2));

// Embeddable indexes — work with file:// (fetch of JSON often fails locally)
fs.mkdirSync(path.join(ROOT, "js"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "js", "search-data-en.js"),
  `window.WIKI_SEARCH_DATA=${JSON.stringify(searchIndex)};\n`
);
fs.writeFileSync(
  path.join(ROOT, "js", "search-data-nl.js"),
  `window.WIKI_SEARCH_DATA=${JSON.stringify(searchIndexNl)};\n`
);

fs.writeFileSync(
  path.join(ROOT, "js", "toc.js"),
  `document.addEventListener('DOMContentLoaded', () => {
  const article = document.querySelector('.article');
  const toc = document.getElementById('toc');
  const tocOl = toc && toc.querySelector('ol');
  if (!article || !toc || !tocOl) return;
  if (article.dataset.hideToc === 'true') { toc.remove(); return; }

  // Only real article section headings — skip hub cards, heroes, nested widgets
  const heads = [...article.querySelectorAll('h2')].filter((h) => {
    if (h.closest('.toc-box, .hub-card, .hero, .navbox, .infobox, .figure')) return false;
    if (h.classList.contains('article-title')) return false;
    return true;
  });

  if (heads.length < 2) { toc.remove(); return; }

  heads.forEach((h, i) => {
    if (!h.id) {
      h.id = 'sec-' + i + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocOl.appendChild(li);
  });
});
`
);

fs.writeFileSync(
  path.join(ROOT, "js", "search.js"),
  `function scoreEntry(entry, tokens) {
  const title = (entry.title || '').toLowerCase();
  const blurb = (entry.blurb || '').toLowerCase();
  const keys = (entry.keywords || '').toLowerCase();
  const hay = title + ' ' + blurb + ' ' + keys;
  let score = 0;
  for (const t of tokens) {
    if (!hay.includes(t)) return -1;
    if (title === t) score += 50;
    else if (title.includes(t)) score += 20;
    else if (keys.split(/\\s+/).includes(t)) score += 12;
    else if (blurb.includes(t)) score += 6;
    else score += 3;
  }
  return score;
}

async function loadSearchIndex() {
  if (Array.isArray(window.WIKI_SEARCH_DATA) && window.WIKI_SEARCH_DATA.length) {
    return window.WIKI_SEARCH_DATA;
  }
  const indexUrl = window.WIKI_SEARCH_INDEX || ((window.WIKI_PREFIX || '') + 'data/search-index.json');
  try {
    const res = await fetch(indexUrl);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('Wiki search index failed to load', e);
    return [];
  }
}

async function initSearch() {
  const input = document.getElementById('wiki-search');
  const box = document.getElementById('wiki-search-results');
  if (!input || !box) return;
  const pagePrefix = window.WIKI_PAGE_PREFIX ?? '';
  const index = await loadSearchIndex();

  function render(q) {
    const query = q.trim().toLowerCase();
    if (!query) { box.classList.remove('open'); box.innerHTML = ''; return; }
    if (!index.length) {
      box.innerHTML = '<div class="search-empty">Search index not loaded — hard-refresh the page.</div>';
      box.classList.add('open');
      return;
    }
    const tokens = query.split(/\\s+/).filter(Boolean);
    const hits = index
      .map((p) => ({ p, s: scoreEntry(p, tokens) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s || a.p.title.localeCompare(b.p.title))
      .slice(0, 12)
      .map((x) => x.p);
    box.innerHTML = hits.length
      ? hits.map((h) =>
          '<a href="' + pagePrefix + h.href + '"><strong>' + h.title + '</strong><span class="meta">' +
          (h.blurb || '') + '</span></a>'
        ).join('')
      : '<div class="search-empty">No results</div>';
    box.classList.add('open');
  }

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('focus', () => { if (input.value) render(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
  });
  document.addEventListener('click', (e) => {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove('open');
  });
}
document.addEventListener('DOMContentLoaded', initSearch);
`
);

fs.writeFileSync(
  path.join(ROOT, "README.md"),
  `# PokeHaven EU Wiki

All-in-one static player wiki (OSRS-wiki style, CobbleVerse look) for **PokeHaven EU** / CobbleVerse 1.7.42.

Includes gym guides, Minecraft survival pages, essential crafts, and a datapack **recipe browser**.

English at the site root; Dutch at \`nl/\`. Use the 🇬🇧 / 🇳🇱 flags in the header to switch.

## Open locally
Open \`index.html\` (EN) or \`nl/index.html\` (NL) in a browser.  
Search works offline (embedded \`js/search-data-*.js\`).

For Recipe Browser / Spawn Lookup, serve the folder:

\`\`\`powershell
cd d:\\COBBLEVERSE\\wiki
npx --yes serve .
\`\`\`

## Rebuild from pack data
Requires extract at \`d:\\COBBLEVERSE\\_pack_analysis\` (with \`_dp_peek\` datapacks).

\`\`\`powershell
cd d:\\COBBLEVERSE\\wiki
npm run build
\`\`\`

Parsers: \`scripts/parse-pack.js\` + \`scripts/parse-recipes.js\`.
`
);

console.log(
  `Wrote wiki with ${searchIndex.length} EN + ${searchIndexNl.length} NL searchable pages.`
);
