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

const SITE_URL = "https://pokehaven.wiki";

/** Absolute canonical URL for a page, used for canonical link, hreflang, and OG/Twitter tags. */
function canonicalUrl(lang, file) {
  const isIndex = file === "index.html";
  if (lang === "nl") {
    return isIndex ? `${SITE_URL}/nl/index.html` : `${SITE_URL}/nl/pages/${file}`;
  }
  return isIndex ? `${SITE_URL}/index.html` : `${SITE_URL}/pages/${file}`;
}

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
    .map(([label, target]) => {
      const external = /^https?:\/\//i.test(target);
      if (external) {
        return `<a href="${esc(target)}" rel="noopener noreferrer" target="_blank">${esc(label)}</a>`;
      }
      const href =
        file === "index.html" ? `${pagePrefix}pages/${target}` : target;
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

  const pageTitle =
    title === "PokeHaven EU Wiki" ? "PokeHaven EU Wiki" : `${title} — PokeHaven EU Wiki`;
  // Strip tags AND decode entities before esc() re-encodes — lede/title source strings
  // sometimes embed already-escaped HTML (e.g. "Rules &amp; commands" inside an <a> tag),
  // so without decoding first, esc() would double-encode into "&amp;amp;".
  const description = (lede || title)
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const canonicalEn = canonicalUrl("en", file);
  const canonicalNl = canonicalUrl("nl", file);
  const canonicalSelf = lang === "nl" ? canonicalNl : canonicalEn;
  const ogImage = `${SITE_URL}/assets/wiki-wallpaper.png`;

  return `<!DOCTYPE html>
<html lang="${ui.htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${canonicalSelf}" />
  <link rel="alternate" hreflang="en" href="${canonicalEn}" />
  <link rel="alternate" hreflang="nl" href="${canonicalNl}" />
  <link rel="alternate" hreflang="x-default" href="${canonicalEn}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(pageTitle)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${canonicalSelf}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:locale" content="${lang === "nl" ? "nl_NL" : "en_US"}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(pageTitle)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
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
  const hoennGyms = (trainers.hoennLeaders || [])
    .filter((g) => g.order <= 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  const hoennLeague = (trainers.hoennLeaders || [])
    .filter((g) => g.order > 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  const sinnohGyms = (trainers.sinnohLeaders || [])
    .filter((g) => g.order <= 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  const sinnohLeague = (trainers.sinnohLeaders || [])
    .filter((g) => g.order > 8)
    .map((g) => `<a href="${g.slug}.html">${esc(g.name)}</a>`)
    .join("");
  return `<div class="navbox">
    <div class="navbox-title">Gym challenge</div>
    <div class="navbox-row"><div class="navbox-label">Kanto</div><div class="navbox-links">${kantoGyms}</div></div>
    <div class="navbox-row"><div class="navbox-label">Kanto league</div><div class="navbox-links">${kantoLeague}</div></div>
    <div class="navbox-row"><div class="navbox-label">Johto</div><div class="navbox-links">${johtoGyms}</div></div>
    <div class="navbox-row"><div class="navbox-label">Johto league</div><div class="navbox-links">${johtoLeague}</div></div>
    <div class="navbox-row"><div class="navbox-label">Hoenn</div><div class="navbox-links">${hoennGyms}</div></div>
    <div class="navbox-row"><div class="navbox-label">Hoenn league</div><div class="navbox-links">${hoennLeague}</div></div>
    <div class="navbox-row"><div class="navbox-label">Sinnoh</div><div class="navbox-links">${sinnohGyms}</div></div>
    <div class="navbox-row"><div class="navbox-label">Sinnoh league</div><div class="navbox-links">${sinnohLeague}</div></div>
    <div class="navbox-row"><div class="navbox-label">Regions</div><div class="navbox-links">
      <a href="Gyms_Kanto.html">Kanto</a>
      <a href="Gyms_Johto.html">Johto</a>
      <a href="Gyms_Hoenn.html">Hoenn</a>
      <a href="Gyms_Sinnoh.html">Sinnoh</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">Guides</div><div class="navbox-links">
      <a href="Quests.html">Quests</a>
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
      <a href="Quests.html">Quests</a>
      <a href="Healing_and_Storage.html">Healing</a>
      <a href="Breeding.html">Breeding</a>
      <a href="Shiny.html">Shiny hunting</a>
      <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>
      <a href="Fishing.html">Fishing</a>
      <a href="Cobbleworkers.html">Cobbleworkers</a>
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
      <a href="Rules_and_Commands.html">Rules &amp; commands</a>
      <a href="Pack_Differences.html">Pack differences</a>
      <a href="Roadmap.html">30-day roadmap</a>
      <a href="Achievements.html">Achievements</a>
      <a href="Postgame_and_Legendaries.html">Post-game</a>
      <a href="Common_Mistakes.html">Common mistakes</a>
      <a href="Donations.html">Donations</a>
      <a href="Discord_Commands.html">Discord commands</a>
      <a href="FAQ.html">FAQ</a>
      <a href="Recipe_Browser.html">Recipe browser</a>
      <a href="Trainer_Index.html">Trainer index</a>
      <a href="Raid_Bosses.html">Raid bosses</a>
      <a href="Spawn_Lookup.html">Spawn lookup</a>
      <a href="Region_Exploration.html">Region exploration</a>
      <a href="Prestige_Season.html">Prestige season</a>
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
  "Quests.html":
    "ftb quests quest book o first steps settling gym league breeding raid pokedex legend trail",
  "Getting_Started.html": "join install curseforge discord ip pack 1.7.42 ticket empty map cerulean",
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
  "Cobbleworkers.html":
    "cobbleworkers pasture worker pokemon job crop berry apricorn farm automate harvest furnace cauldron",
  "Raids.html": "raid den crystal boss tier damage share hidden ability waystone",
  "FAQ.html":
    "help problem question join discord tickets donate bluemap misty ftb chunks open parties",
  "Brock.html": "first gym rock boulder badge",
  "Misty.html": "second gym water cascade cerulean star seagrass",
  "Travel.html": "waystone teleport travel fast travel bluemap browser map",
  "Gym_Maps.html":
    "map cartography empty map brock map key misty cerulean star coordinates johto hoenn sinnoh valerio petra pedro",
  "Rules_and_Commands.html":
    "rules commands /pc claim grief cheat discord voice chat respect staff",
  "Farming_and_Food.html": "wheat farm food hunger emerald farmer",
  "Achievements.html":
    "achievement advancement toast checklist kanto mew mewtwo articuno zapdos moltres L key cobblemon berry apricorn fossil vivillon shiny catch",
  "Postgame_and_Legendaries.html":
    "post-game postgame legendary mythical mew mewtwo articuno zapdos moltres origin fossil ancient dna cloning",
  "Gyms_Johto.html":
    "johto valerio raffaello chiara angelo furio jasmine alfredo sandra pino karen lance zephyr hive",
  "Gyms_Hoenn.html":
    "hoenn petra rudi walter fiammetta norman alice tell adriano fosco ester frida drake rocco gym maps cartography overview stone knuckle dynamo heat balance feather mind rain badge",
  "Gyms_Sinnoh.html":
    "sinnoh pedro gardenia marzia omar fannie ferruccio bianca corrado aaron terrie vulcano luciano camilla rocco gym maps cartography overview coal forest cobble fen relic mine icicle beacon badge",
  "Valerio.html": "johto first gym flying zephyr raptor bracer",
  "Petra.html": "hoenn first gym rock stone badge rocky mountains rock tome",
  "Rudi.html": "hoenn gym fighting knuckle badge yosemite cliffs fighting glove",
  "Walter.html": "hoenn gym electric dynamo badge arid highlands electric connector",
  "Fiammetta.html": "hoenn gym fire heat badge forested highlands fire lighter",
  "Norman.html": "hoenn gym normal balance badge brushland normal tablet",
  "Alice.html": "hoenn gym flying feather badge moonlight grove flying feather item",
  "Tell.html": "hoenn gym psychic mind badge amethyst rainforest psychic medallion",
  "Adriano.html": "hoenn gym water rain badge cold ocean water rod",
  "Fosco.html": "hoenn elite four dark fosco dark bass steppe",
  "Ester.html": "hoenn elite four ghost ester ghost bloom steppe",
  "Frida.html": "hoenn elite four ice frida ice necklace steppe",
  "Drake.html": "hoenn elite four dragon drake dragon cap steppe",
  "Rocco.html": "hoenn champion rocco mixed steel hat steppe kyogre groudon",
  "Pedro.html": "sinnoh first gym rock coal badge volcanic peaks rock casque",
  "Gardenia.html": "sinnoh gym grass forest badge blooming valley grass aroma",
  "Marzia.html": "sinnoh gym fighting cobble badge lush desert fighting bandage",
  "Omar.html": "sinnoh gym water fen badge beach water mask",
  "Fannie.html": "sinnoh gym ghost relic badge lavender valley ghost pendant",
  "Ferruccio.html": "sinnoh gym steel mine badge volcanic crater steel spade",
  "Bianca.html": "sinnoh gym ice icicle badge glacial chasm ice ribbon",
  "Corrado.html": "sinnoh gym electric beacon badge shrubland electric fuse",
  "Aaron.html": "sinnoh elite four bug aaron bug net desert oasis",
  "Terrie.html": "sinnoh elite four ground terrie ground shawl desert oasis",
  "Vulcano.html": "sinnoh elite four fire vulcano fire flint desert oasis",
  "Luciano.html": "sinnoh elite four psychic luciano psychic volume desert oasis",
  "Camilla.html": "sinnoh champion camilla mixed draconic fin desert oasis",
  "Donations.html":
    "donate donation paypal tier supporter patron benefactor cosmetic prefix role shiny hour no pay to win",
  "Discord_Commands.html":
    "discord slash command link donate check tiers add set list bot",
  "Region_Exploration.html":
    "exploration chapter waystone pin naming bluemap hub landmark travel farm raid den",
  "Prestige_Season.html":
    "prestige ladder season leaderboard dex race shiny race raid race reset wipe champion 1025 gotta catch em all",
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

// index.html, Getting_Started.html, and First_Hours.html are written later
// (index.html near the bottom of this file; Getting_Started.html and First_Hours.html
// in deep-pages.js) — those later calls are the ones that actually ship.

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
const hoennCapLadderRows = capLadderRows(trainers.hoennLeaders);
const sinnohCapLadderRows = capLadderRows(trainers.sinnohLeaders);

function mapItemLabel(g) {
  if (g.slug === "Brock") return "Brock Map Key";
  return g.specialItem;
}

function cartographyTableFor(g) {
  if (g.region === "johto") return "Johto Cartography Table";
  if (g.region === "hoenn") return "Hoenn Cartography Table";
  if (g.region === "sinnoh") return "Sinnoh Cartography Table";
  return "Kanto Cartography Table";
}

function seriesLeaders(g) {
  if (g.region === "johto") return trainers.johtoLeaders || [];
  if (g.region === "hoenn") return trainers.hoennLeaders || [];
  if (g.region === "sinnoh") return trainers.sinnohLeaders || [];
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
    : g.region === "kanto"
      ? `<a href="Gyms_Johto.html">Johto</a>`
      : g.region === "johto"
        ? `<a href="Gyms_Hoenn.html">Hoenn</a>`
        : g.region === "hoenn"
          ? `<a href="Gyms_Sinnoh.html">Sinnoh</a>`
          : `<a href="Postgame_and_Legendaries.html">Post-game</a>`;

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
      <li>Clear gym trainers if you need XP or PokéDollars.</li>
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
      <li>Optional: beat gym trainers for XP + PokéDollars.</li>
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
    <ul>
      <li><strong>Electric and Grass</strong> answer Water — bring at least one of each if you can.</li>
      <li>Status and chip damage help; don’t walk in at half HP.</li>
      <li>Level band while Misty is next is roughly the low–mid 30s — see <a href="Level_Cap.html">Level cap</a>.</li>
    </ul>
    <ol class="steps">
      <li>Travel with heals; activate waystones on the way.</li>
      <li>Clear gym trainers if you need XP or PokéDollars.</li>
      <li>Full heal at the gym entrance, then challenge Misty.</li>
      <li>Win → next up: ${nextLink}.</li>
    </ol>`;
  }

  // Deep template for remaining Kanto gyms + Elite Four + Blue
  const extras = {
    "Lt._Surge": {
      title: "Walkthrough — Misty to Lt. Surge",
      coverage: "Ground answers Electric best. Bulky Waters can help if they survive the first hit.",
      travel: "Savanna Plateau tip — bring food for a longer hike.",
      gotcha: "Paralysis and speed snowball. Pack status cures and a Ground pivot.",
    },
    Erika: {
      title: "Walkthrough — Surge to Erika",
      coverage: "Fire, Flying, Ice, and Poison pressure Grass.",
      travel: "Flower Forest tip — claim a rest stop near the gym.",
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
      travel: "Cherry Grove tip — claim a rest stop near the gym.",
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
    // Hoenn
    Petra: {
      title: "Walkthrough — Unlock Hoenn to Petra",
      coverage: "Water, Grass, Fighting, and Ground answer Rock hard.",
      travel: "Rocky Mountains tip — bring blocks/scaffolding for the climb and a waystone at the base.",
      gotcha: "Onix and Nosepass can wall physical attackers. Watch Thunder Punch / Flamethrower coverage on her Geodude.",
      unlockHtml: `<h3>Unlock Hoenn first</h3>
    <ol class="steps">
      <li>Beat Johto Champion <a href="Johto_Lance.html">Lance</a>.</li>
      <li>Follow the champion book: Trainer Association → <strong>Hoenn Trainer Card</strong> (your level cap resets for Hoenn).</li>
      <li>Craft the <strong>Hoenn Cartography Table</strong> — see <a href="Gym_Maps.html">Gym maps</a>.</li>
    </ol>`,
    },
    Rudi: {
      title: "Walkthrough — Petra to Rudi",
      coverage: "Flying, Psychic, and Fairy answer Fighting.",
      travel: "Yosemite Cliffs tip — this is a vertical map; bring blocks or a Flying mount for the ledges.",
      gotcha: "Fighting hits Normal/Rock/Ice/Steel/Dark hard. Don’t walk in with a mono-Rock team from Petra’s fight.",
    },
    Walter: {
      title: "Walkthrough — Rudi to Walter",
      coverage: "Ground shuts Electric down completely; Grass also resists.",
      travel: "Arid Highlands tip — dry biome, bring extra water and food.",
      gotcha: "Paralysis chip adds up fast. A Ground-type sweeper makes this an easy fight.",
    },
    Fiammetta: {
      title: "Walkthrough — Walter to Fiammetta",
      coverage: "Water, Ground, and Rock are reliable into Fire.",
      travel: "Forested Highlands tip — watch fire spread if you're building anything flammable nearby.",
      gotcha: "Don’t bring a team still mono-Grass from earlier gyms; add a Water or Rock answer.",
    },
    Norman: {
      title: "Walkthrough — Fiammetta to Norman",
      coverage: "Fighting is the cleanest answer to Normal; Ghost immunities help too.",
      travel: "Brushland tip — flat open terrain, easy travel but exposed to wild spawns.",
      gotcha: "Bulky Normal-types can stall. Bring a Fighting-type or status support.",
    },
    Alice: {
      title: "Walkthrough — Norman to Alice",
      coverage: "Electric, Rock, and Ice punish Flying hard.",
      travel: "Moonlight Grove tip — a dim biome; bring light sources and food.",
      gotcha: "Altaria and Skarmory can tank hits. Electric and Rock coverage ends this fast.",
    },
    Tell: {
      title: "Walkthrough — Alice to Tell",
      coverage: "Dark, Bug, and Ghost pressure Psychic.",
      travel: "Amethyst Rainforest tip — dense biome, bring shears/an axe and claim a rest stop.",
      gotcha: "Solrock, Lunatone, and Gardevoir hit hard on the special side. Dark-types ignore his Psychic STAB entirely.",
    },
    Adriano: {
      title: "Walkthrough — Tell to Adriano",
      coverage: "Electric and Grass answer Water. Adriano closes out the Hoenn gym line.",
      travel: "Cold Ocean tip — bring a boat or Water-capable mount, and cold-weather food.",
      gotcha: "Last Hoenn gym before the Elite Four — full heal and restock before the league gauntlet.",
    },
    Fosco: {
      title: "Walkthrough — Adriano to Hoenn Elite Four (Fosco)",
      coverage: "Fighting, Bug, and Fairy pressure Dark.",
      travel: "Steppe biome — the Hoenn league grounds sit in open plains, not The End like Kanto/Johto.",
      gotcha: "Full heal before every Hoenn Elite Four room. Fosco opens the gauntlet.",
      league: true,
    },
    Ester: {
      title: "Walkthrough — Fosco to Ester",
      coverage: "Dark and Ghost pressure Ghost back; watch immunities both ways.",
      travel: "Same Steppe league grounds — restock between rooms.",
      gotcha: "Status and Ghost-type tricks can stall. Keep a clean answer ready.",
      league: true,
    },
    Frida: {
      title: "Walkthrough — Ester to Frida",
      coverage: "Fire, Fighting, Rock, and Steel help into Ice.",
      travel: "Third Hoenn Elite room — heal fully after Ester.",
      gotcha: "Ice walls can stall a slow team. Don’t underlevel into this room.",
      league: true,
    },
    Drake: {
      title: "Walkthrough — Frida to Drake",
      coverage: "Ice and Fairy punish Dragon hardest.",
      travel: "Fourth Elite room — last wall before Champion Rocco.",
      gotcha: "Dragon spam punishes thin teams. Bring Ice coverage and multiple win conditions.",
      league: true,
    },
    Rocco: {
      title: "Walkthrough — Drake to Champion Rocco",
      coverage: "Mixed champion team (weather-setters + box legendaries) — pack answers for several types, not one gimmick.",
      travel: "Top of the Hoenn league grounds. Full restore team + items.",
      gotcha: "Weather-setters and box legendaries headline his team. After Rocco: Sinnoh unlock on your Trainer Card.",
      league: true,
      champion: true,
    },
    // Sinnoh
    Pedro: {
      title: "Walkthrough — Unlock Sinnoh to Pedro",
      coverage: "Water, Grass, Fighting, and Ground answer Rock.",
      travel: "Volcanic Peaks tip — fire-resist gear helps near the vents.",
      gotcha: "Standard Rock lead. Don’t walk in with only Fire/Flying/Bug.",
      unlockHtml: `<h3>Unlock Sinnoh first</h3>
    <ol class="steps">
      <li>Beat Hoenn Champion <a href="Rocco.html">Rocco</a>.</li>
      <li>Follow the champion book: Trainer Association → <strong>Sinnoh Trainer Card</strong> (your level cap resets for Sinnoh).</li>
      <li>Craft the <strong>Sinnoh Cartography Table</strong> — see <a href="Gym_Maps.html">Gym maps</a>.</li>
    </ol>`,
    },
    Gardenia: {
      title: "Walkthrough — Pedro to Gardenia",
      coverage: "Fire, Flying, Ice, Bug, and Poison pressure Grass.",
      travel: "Blooming Valley tip — claim a rest stop near the gym.",
      gotcha: "Sleep Powder / Stun Spore can stall. Bring cleansers.",
    },
    Marzia: {
      title: "Walkthrough — Gardenia to Marzia",
      coverage: "Flying, Psychic, and Fairy answer Fighting.",
      travel: "Lush Desert tip — an odd mixed biome, bring water and shade.",
      gotcha: "Fighting punishes Normal/Rock/Ice/Steel/Dark. Keep a Flying or Psychic pivot.",
    },
    Omar: {
      title: "Walkthrough — Marzia to Omar",
      coverage: "Electric and Grass answer Water.",
      travel: "Beach tip — easy travel, but watch wild Water spawns nearby.",
      gotcha: "Rain-setters can boost his team’s power. Electric sweepers end this quickly.",
    },
    Fannie: {
      title: "Walkthrough — Omar to Fannie",
      coverage: "Dark and Ghost pressure Ghost; watch immunities.",
      travel: "Lavender Valley tip — moody biome, bring light and a full team.",
      gotcha: "Status and Ghost-type tricks (Destiny Bond, Will-O-Wisp) can flip a fight late.",
    },
    Ferruccio: {
      title: "Walkthrough — Fannie to Ferruccio",
      coverage: "Fire, Fighting, and Ground crack Steel.",
      travel: "Volcanic Crater tip — fire-resist gear before you get close.",
      gotcha: "Skarmory / Steelix / Aggron wall physical attackers. Bring special or Fighting coverage.",
    },
    Bianca: {
      title: "Walkthrough — Ferruccio to Bianca",
      coverage: "Fire, Fighting, Rock, and Steel help into Ice.",
      travel: "Glacial Chasm tip — cold-weather food and gear, this hike is long.",
      gotcha: "Weavile / Mamoswine hit hard on the physical side; don’t walk in underleveled.",
    },
    Corrado: {
      title: "Walkthrough — Bianca to Corrado",
      coverage: "Ground shuts Electric down completely.",
      travel: "Shrubland tip — last Sinnoh gym before the Elite Four, restock fully.",
      gotcha: "Paralysis chip snowballs. A Ground-type sweeper trivializes this fight.",
    },
    Aaron: {
      title: "Walkthrough — Corrado to Sinnoh Elite Four (Aaron)",
      coverage: "Fire, Flying, and Rock pressure Bug.",
      travel: "Desert Oasis — the Sinnoh league grounds, not The End like Kanto/Johto.",
      gotcha: "Full heal before every Sinnoh Elite Four room. Aaron opens the gauntlet.",
      league: true,
    },
    Terrie: {
      title: "Walkthrough — Aaron to Terrie",
      coverage: "Water, Grass, and Ice answer Ground.",
      travel: "Same Desert Oasis league grounds — restock after Aaron.",
      gotcha: "Ground ignores Electric entirely. Bring a Water or Grass answer instead.",
      league: true,
    },
    Vulcano: {
      title: "Walkthrough — Terrie to Vulcano",
      coverage: "Water, Ground, and Rock are reliable into Fire.",
      travel: "Third Sinnoh Elite room — heal fully after Terrie.",
      gotcha: "Don’t walk in with a Grass-heavy team; add a Water or Rock pivot.",
      league: true,
    },
    Luciano: {
      title: "Walkthrough — Vulcano to Luciano",
      coverage: "Dark, Bug, and Ghost pressure Psychic.",
      travel: "Fourth Elite room — last wall before Champion Camilla.",
      gotcha: "Dark-types ignore his Psychic STAB entirely. Keep one on the team.",
      league: true,
    },
    Camilla: {
      title: "Walkthrough — Luciano to Champion Camilla",
      coverage: "Mixed champion team — pack answers for several types, not one gimmick.",
      travel: "Top of the Sinnoh league grounds. Full restore team + items.",
      gotcha: "The final champion of the current gym line — after Camilla, check Post-game and legendaries for what’s next.",
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
    ? g.region === "kanto"
      ? `Win → Kanto Champion. Next: Johto via Trainer Association (cap resets for <em>you</em>). Details: <a href="Progression.html">Progression</a> · <a href="Gyms_Johto.html">Johto</a>.`
      : g.region === "johto"
        ? `Win → Johto Champion. Next region: <a href="Gyms_Hoenn.html">Hoenn</a> (follow Trainer Card / pack unlocks). Details: <a href="Progression.html">Progression</a>.`
        : g.region === "hoenn"
          ? `Win → Hoenn Champion. Next region: <a href="Gyms_Sinnoh.html">Sinnoh</a> (follow Trainer Card / pack unlocks). Details: <a href="Progression.html">Progression</a>.`
          : `Win → Sinnoh Champion — you’ve cleared every region! Check <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a> for what’s next.`
    : `Win → level cap rises → next: ${nextLink}.`;

  return `<h2>${extras.title}</h2>
    ${extras.unlockHtml || ""}
    <h3>Prepare</h3>
    <p>${esc(g.tips)}</p>
    <ul>
      <li><strong>Coverage:</strong> ${extras.coverage}</li>
      <li>Leader party levels: about <strong>${lvMin}–${lvMax}</strong></li>
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
          : "<li>Clear gym trainers if you need XP or PokéDollars.</li>"
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
  <p>While a leader is your next target, your cap is roughly that leader’s strongest Pokémon level <strong>+ 5</strong>. Numbers below are a guide — confirm with your Trainer Card in-game.</p>
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

  <h2>Hoenn ladder (approx)</h2>
  <p>Same rule after the Hoenn Trainer Card. Overview: <a href="Gyms_Hoenn.html">Hoenn gyms</a>.</p>
  <table class="wikitable">
    <thead><tr><th>Next target</th><th>Badge / role</th><th>Type</th><th>Team max lv</th><th>Approx cap</th></tr></thead>
    <tbody>${hoennCapLadderRows}</tbody>
  </table>

  <h2>Sinnoh ladder (approx)</h2>
  <p>Same rule after the Sinnoh Trainer Card — the last region in the current gym line. Overview: <a href="Gyms_Sinnoh.html">Sinnoh gyms</a>.</p>
  <table class="wikitable">
    <thead><tr><th>Next target</th><th>Badge / role</th><th>Type</th><th>Team max lv</th><th>Approx cap</th></tr></thead>
    <tbody>${sinnohCapLadderRows}</tbody>
  </table>

  <h2>XP looks broken?</h2>
  <ol class="steps">
    <li>Open your <strong>Trainer Card</strong> and see which gym is next.</li>
    <li>Get that gym’s map (<a href="Gym_Maps.html">Gym maps</a>).</li>
    <li>Improve coverage and heals — do not only grind the same route.</li>
    <li>Beat the leader; the cap rises and XP sticks again.</li>
  </ol>

  <p class="see-also"><strong>See also:</strong> <a href="Progression.html">Progression</a> · <a href="Gyms_Kanto.html">Kanto gyms</a> · <a href="Gyms_Johto.html">Johto gyms</a> · <a href="Gyms_Hoenn.html">Hoenn gyms</a> · <a href="Gyms_Sinnoh.html">Sinnoh gyms</a> · <a href="FAQ.html">FAQ</a></p>
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
    lede: "Checklist for the Kanto challenge on CobbleVerse / PokeHaven EU. Open a leader page for full teams and prep tips.",
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
    lede: `${esc(g.name)} — ${esc(g.type)} specialist on PokeHaven EU.`,
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
    ["Kanto ladder", "Brock → Misty → …"],
    ["Region openers", "Valerio · Petra · Pedro"],
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

  <h2>Misty (second gym)</h2>
  <p>After Brock, craft <strong>Misty’s map</strong> the same way — you just need the special item first:</p>
  <ol class="steps">
    <li>Craft a <strong>Cerulean Star</strong> (REI: Misty / Cerulean). <strong>Seagrass only drops with Shears.</strong></li>
    <li>Craft a fresh <strong>Empty Map</strong> (do not open it in the world).</li>
    <li>Combine Empty Map + Cerulean Star in the <strong>Kanto Cartography Table</strong>.</li>
    <li>Hover for coordinates, then travel. Full fight guide: <a href="Misty.html">Misty</a>.</li>
  </ol>
  <p>Next after Misty: <a href="Lt._Surge.html">Lt. Surge</a>.</p>

  <h2>Later regions (Johto / Hoenn / Sinnoh)</h2>
  <p>After each league, craft that region’s cartography table (REI: <em>Johto</em> / <em>Hoenn</em> / <em>Sinnoh</em> + <em>cartography</em>). <strong>Region openers</strong> (first gym of that region):</p>
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
    <li>Search the leader’s name in REI (e.g. Misty → Cerulean Star, then later Valerio, Petra, Pedro…).</li>
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
  <p class="see-also"><strong>See also:</strong> <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Villages_and_Trading.html">Villages &amp; trading</a> · <a href="Brock.html">Brock</a> · <a href="Misty.html">Misty</a> · <a href="Progression.html">Progression</a></p>
  ${navboxGyms()}
  `,
});

// Economy.html, Raids.html, and Catching_and_Battling.html are written later
// in deep-pages.js — those later calls are the ones that actually ship.

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
    <li>Some form features (region forms, Magikarp patterns, etc.) can inherit — still verify in-game.</li>
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

  <h2>Shiny Hour (donation event)</h2>
  <p>Sometimes the community funds a <strong>Shiny Hour</strong>: for <strong>60 minutes</strong>, wild shiny odds are <strong>2×</strong> for <strong>everyone</strong> online (1/${shiny} → 1/${Math.round(shiny / 2)}). It is a server-wide event — not a personal donor boost.</p>
  <ul>
    <li>Fund via PayPal (note <code>Shiny Hour</code> + Discord name) — see Discord announcements / donations.</li>
    <li>Only <strong>new</strong> wild / fishing spawns use the boosted rate.</li>
    <li>Breeding Masuda / crystal methods still apply on top of the wild base.</li>
  </ul>

  <h2>Breeding shiny methods (CobBreeding)</h2>
  <p>Egg shiny rolls can use method multipliers from CobBreeding. Treat these as <strong>multipliers on the shiny check</strong> when that method applies — still rare, not “guaranteed soon”.</p>
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
  title: "Mega & late-game",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Mega & late-game", href: "Mega_and_Late_Game.html" },
  ],
  lede: "What Mega Showdown allows on PokeHaven EU, and a practical checklist after Kanto — before you dive into Johto, raids, or legendaries.",
  infobox: infoboxHtml("Mega Showdown (pack)", [
    ["Mega Evolution", rates.mega?.mega ? "On" : "Off"],
    ["Z-Moves", rates.mega?.zMoves ? "On" : "Off"],
    ["Terastallization", rates.mega?.teralization ? "On" : "Off"],
    ["Dynamax", rates.mega?.dynamax ? "On (power spots)" : "Off"],
    ["Multiple Megas", rates.mega?.multipleMegas ? "Allowed" : "One at a time"],
    ["Dynamax anywhere?", rates.mega?.dynamaxAnywhere ? "Yes" : "No"],
    ["Power spot range", `${rates.mega?.powerSpotRange ?? 32} blocks`],
    ["Tera shards to Tera", String(rates.mega?.teraShardRequired ?? 50)],
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
    <li>Enabled. Pack requires <strong>${rates.mega?.teraShardRequired ?? 50} Tera Shards</strong> of the matching type to Terastallize (config <code>teraShardRequired</code>).</li>
    <li>Shard drop rates in config: common Tera shards <strong>${rates.mega?.teraShardDropRate ?? 10}</strong>, Stellar shards <strong>${rates.mega?.stellarShardDropRate ?? 1}</strong> (relative drop weighting — farm via the mod’s shard sources / REI).</li>
    <li>Cobblemon also sets a wild <strong>tera type rate</strong> of <strong>${rates.cobblemon?.teraTypeRate ?? 20}</strong> on this pack — Tera’d wilds can appear; don’t confuse that with your own Tera Orb progress.</li>
  </ul>

  <h2>Dynamax</h2>
  <ul>
    <li>Enabled, but <strong>not anywhere</strong> — you need a <strong>power spot</strong> within about <strong>${rates.mega?.powerSpotRange ?? 32} blocks</strong>.</li>
    <li>Cobblemon max Dynamax level on this pack: <strong>${rates.cobblemon?.maxDynamaxLevel ?? 10}</strong>.</li>
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

writePage("Cobbleworkers.html", {
  title: "Cobbleworkers",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Cobbleworkers", href: "Cobbleworkers.html" },
  ],
  lede: "Put Pokémon in a <strong>Pasture</strong> and they work nearby — harvest crops, fill cauldrons, fuel furnaces, and more. This is automation, <em>not</em> a salary job.",
  infobox: infoboxHtml("Cobbleworkers", [
    ["Mod", "Cobbleworkers (in the pack)"],
    ["Block", "Pasture"],
    ["Work area (PokeHaven)", "Radius 8 · height ±5"],
    ["Pays PokéDollars?", "No"],
    ["Official docs", '<a href="https://docs.accieo.com/cobbleworkers/" rel="noopener noreferrer" target="_blank">docs.accieo.com</a>'],
  ]),
  body: `
  <h2>What it is</h2>
  <p><strong>Cobbleworkers</strong> turns the Cobblemon <strong>Pasture</strong> into a utility block. Eligible Pokémon assigned to that pasture automatically claim jobs in range (crops, berries, apricorns, furnaces, cauldrons, …) and deposit loot into nearby inventories when they can.</p>
  ${critical(
    "en",
    "<strong>Not Jobs Reborn.</strong> Workers do not earn PokéDollars. For money see <a href=\"Economy.html\">Economy</a>. Workers give resources and automation."
  )}

  <h2>Quick start</h2>
  <ol class="steps">
    <li>Craft / place a <strong>Pasture</strong> (REI: <em>pasture</em>) inside your <a href="Claims.html">FTB claim</a>.</li>
    <li>Assign Pokémon to the pasture (same block used for breeding).</li>
    <li>Build the matching farm within <strong>8 blocks</strong> horizontally and <strong>~5 blocks</strong> up/down of the pasture (PokeHaven defaults).</li>
    <li>Leave a chest / inventory near the pasture — workers deposit to the closest valid inventory.</li>
    <li>Match <strong>type / species / move / ability</strong> to the job (table below). Wrong type = they idle.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Pathing tip</div>
    Pokémon use normal Minecraft pathfinding. Keep floors clear, avoid 1-block gaps and awkward fences, or they abandon targets after ~30s (navigation timeout).
  </div>

  <h2>PokeHaven area settings</h2>
  <p>From the pack config (<code>cobbleworkers.json</code>):</p>
  <table class="wikitable">
    <thead><tr><th>Setting</th><th>Value</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><code>areaScanRadius</code></td><td>8</td><td>Horizontal work radius from the pasture</td></tr>
      <tr><td><code>areaScanHeight</code></td><td>5</td><td>Blocks up/down scanned</td></tr>
      <tr><td><code>areaScanCooldown</code></td><td>45s</td><td>Pause between full area scans</td></tr>
      <tr><td><code>navigationTimeout</code></td><td>30s</td><td>Give up reaching a target</td></tr>
      <tr><td><code>depositTimeout</code></td><td>65s</td><td>Give up depositing → drop items</td></tr>
    </tbody>
  </table>

  <h2>Jobs (who does what)</h2>
  <p>Most jobs need a <strong>type</strong>. Some need a specific species, move, or ability. Full details: <a href="https://docs.accieo.com/cobbleworkers/" rel="noopener noreferrer" target="_blank">Accieo docs</a>.</p>
  <table class="wikitable">
    <thead><tr><th>Job</th><th>Requirement</th><th>Does</th></tr></thead>
    <tbody>
      <tr><td>Crop harvester</td><td>Type <strong>Grass</strong></td><td>Harvests mature crops</td></tr>
      <tr><td>Crop irrigator</td><td>Type <strong>Water</strong></td><td>Waters farmland</td></tr>
      <tr><td>Berry harvester</td><td>Type <strong>Grass</strong></td><td>Harvests mature berries</td></tr>
      <tr><td>Mint harvester</td><td>Type <strong>Fairy</strong></td><td>Harvests mature mints</td></tr>
      <tr><td>Apricorn harvester</td><td>Type <strong>Bug</strong></td><td>Harvests mature apricorns</td></tr>
      <tr><td>Nether wart harvester</td><td>Type <strong>Ghost</strong></td><td>Harvests mature nether wart</td></tr>
      <tr><td>Amethyst harvester</td><td>Type <strong>Rock</strong></td><td>Harvests mature amethyst clusters</td></tr>
      <tr><td>Tumblestone harvester</td><td>Type <strong>Steel</strong></td><td>Harvests mature tumblestone</td></tr>
      <tr><td>Honey collector</td><td><strong>Combee</strong> / <strong>Vespiquen</strong></td><td>Collects honeycombs from beehives</td></tr>
      <tr><td>Water generator</td><td>Type <strong>Water</strong></td><td>Fills empty cauldrons with water</td></tr>
      <tr><td>Lava generator</td><td>Type <strong>Fire</strong></td><td>Fills empty cauldrons with lava</td></tr>
      <tr><td>Snow generator</td><td>Type <strong>Ice</strong></td><td>Fills empty cauldrons with snow</td></tr>
      <tr><td>Fuel generator</td><td>Type <strong>Fire</strong></td><td>Adds burn ticks to furnaces</td></tr>
      <tr><td>Brewing stand fuel</td><td>Type <strong>Dragon</strong></td><td>Adds blaze powder to brewing stands</td></tr>
      <tr><td>Fishing (worker)</td><td>Type <strong>Water</strong></td><td>Generates fishing loot near the pasture</td></tr>
      <tr><td>Fire extinguisher</td><td>Type <strong>Water</strong></td><td>Puts out fire blocks</td></tr>
      <tr><td>Fletcher</td><td>Type <strong>Poison</strong></td><td>Coats arrows with poison</td></tr>
      <tr><td>Ground item gatherer</td><td>Type <strong>Psychic</strong></td><td>Picks up ground items into chests</td></tr>
      <tr><td>Archeologist</td><td>Type <strong>Ground</strong></td><td>Generates archaeology loot near dirt/gravel/mud</td></tr>
      <tr><td>Healer</td><td>Happiny / Chansey / Blissey, or Wish / Soft-Boiled / Moonlight / Recover / Roost / Heal Bell / …</td><td>Heals hurt players nearby</td></tr>
      <tr><td>Rain dancer</td><td><strong>Slowpoke</strong></td><td>Sets weather to rain</td></tr>
      <tr><td>Dive looter</td><td>Knows move <strong>Dive</strong> (+ swimming)</td><td>Generates treasure loot in water</td></tr>
      <tr><td>Pickup looter</td><td>Ability <strong>Pickup</strong></td><td>Generates generic Cobblemon loot</td></tr>
    </tbody>
  </table>

  <h2>Good early setups</h2>
  <ul>
    <li><strong>Food loop:</strong> Grass crop harvester + Water irrigator + chest → wheat/carrots for you and villagers — pairs with <a href="Farming_and_Food.html">Farming &amp; food</a>.</li>
    <li><strong>Ball materials:</strong> Bug apricorn harvester next to apricorn trees → <a href="Poke_Balls.html">Poké Balls</a>.</li>
    <li><strong>Berry farm:</strong> Grass berry harvesters for held items / healing berries.</li>
    <li><strong>Smelting:</strong> Fire fuel generators next to furnace rows (furnaces with items get priority).</li>
  </ul>

  <h2>Breeding vs workers</h2>
  <p>The same <strong>Pasture</strong> block is used for <a href="Breeding.html">breeding</a> and Cobbleworkers. A busy shiny project and a dense crop farm on one pasture can fight for attention. Split pastures when both matter: one for eggs, one for jobs.</p>
  ${critical(
    "en",
    "<strong>Always claim the pasture chunks.</strong> Unclaimed eggs / worker loot are easy grief targets — see <a href=\"Claims.html\">Claims</a> and <a href=\"Common_Mistakes.html\">Common mistakes</a>."
  )}

  <h2>Troubleshooting</h2>
  <table class="wikitable">
    <thead><tr><th>Symptom</th><th>Try</th></tr></thead>
    <tbody>
      <tr><td>Pokémon just stand around</td><td>Wrong type for the job; nothing mature/eligible in the 8-block radius; pasture assignment missing</td></tr>
      <tr><td>They walk then give up</td><td>Clear pathing; lower fences; bring targets closer to the pasture</td></tr>
      <tr><td>Items on the ground</td><td>Chest full / wrong inventory — add storage closer to the pasture (deposit timeout ~65s)</td></tr>
      <tr><td>Only close crops get done</td><td>Normal — closer blocks are prioritized; thin the farm or add a second pasture</td></tr>
      <tr><td>Expecting PokéDollars</td><td>Workers do not pay — use battles / bank / bounties (<a href="Economy.html">Economy</a>)</td></tr>
    </tbody>
  </table>

  <p class="see-also"><strong>See also:</strong> <a href="Farming_and_Food.html">Farming &amp; food</a> · <a href="Breeding.html">Breeding</a> · <a href="Poke_Balls.html">Poké Balls</a> · <a href="Claims.html">Claims</a> · <a href="Economy.html">Economy</a> · <a href="https://docs.accieo.com/cobbleworkers/" rel="noopener noreferrer" target="_blank">Official Cobbleworkers docs</a></p>
  ${navboxSystems()}
  `,
});

// Claims.html is written later in deep-pages.js — that later call is the one that actually ships.

writePage("Quests.html", {
  title: "Quests",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Quests", href: "Quests.html" },
  ],
  lede: "PokeHaven EU ships a full <strong>FTB Quests</strong> book — guided First Steps, every gym through Sinnoh, plus crafting, breeding, raids, Pokédex, and legend goals. Open it with <kbd>O</kbd>.",
  infobox: `<div class="infobox-title">Quest book</div>
  <table>
    <tr><th>Open</th><td><kbd>O</kbd> (FTB Quests)</td></tr>
    <tr><th>Chapters</th><td>36</td></tr>
    <tr><th>Quests</th><td>296</td></tr>
    <tr><th>Languages</th><td>English + Nederlands in-game</td></tr>
    <tr><th>Progress</th><td>Server-tracked — safe to reconnect</td></tr>
    <tr><th>Related</th><td><a href="Achievements.html">Advancements</a> · <a href="Progression.html">Progression</a></td></tr>
  </table>`,
  body: `
  ${critical(
    "en",
    "<strong>First Steps IDs never change.</strong> If you already finished starter → catch → claim → Brock, that progress stays. New chapters unlock beside it — they do not wipe the tree."
  )}

  <h2>How to use the book</h2>
  <ol class="steps">
    <li>Press <kbd>O</kbd> to open the quest book (rebind under Esc → Options → Controls → FTB Quests).</li>
    <li>Start in <strong>First Steps</strong> — most tasks auto-complete; the claim quest needs the green check after you claimed.</li>
    <li>After Brock, <strong>Kanto Gyms</strong> unlocks with Misty. Follow gym maps as usual.</li>
    <li>Side chapters (Settling In, Trainer Craft, …) stay available so you can mix base-building with the league path.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Pinned quests</div>
    Click the pin icon on a quest in the book to track it — it appears in a small tracker near the <strong>bottom-right of your HUD</strong>, next to the minimap/coordinates. There is no floating 3D arrow in the world; the pinned tracker is the closest thing to it.
  </div>

  <h2>Chapter map</h2>
  <p>About <strong>36 chapters / 296 quests</strong>. Side Paths never block gym progress.</p>
  <table class="wikitable">
    <thead><tr><th>Group</th><th>Chapters</th><th>What they cover</th></tr></thead>
    <tbody>
      <tr><td>PokeHaven</td><td>First Steps · Settling In</td><td>Starter, catch, claim, Brock — then waystone / heal basics</td></tr>
      <tr><td>Side Paths</td><td>Economy Loop · Travel Network · Village Loot · Fishing Grounds · Community Desk · Ball Workshop</td><td>Money loop, waystones/BlueMap, villages, Poké Rod / bait / Master Rod, apricorns → ball crafting, wiki/Discord/keys</td></tr>
      <tr><td>Server Life</td><td>Base Ops · Market Floor · Crew Desk</td><td>Claims/storage, shops/trading, party play and helping newer players</td></tr>
      <tr><td>Kanto</td><td>Kanto Gyms · Indigo Plateau · Kanto Exploration · Kanto Region Kit</td><td>Brock → Blue, BlueMap/exploration, type coverage kit</td></tr>
      <tr><td>Johto / Hoenn / Sinnoh</td><td>Gyms · League · Exploration · Region Kit each</td><td>Full regional ladders + exploration + prep kits</td></tr>
      <tr><td>Trainer Systems</td><td>Trainer Craft · Breeding Lab · Raid Circuit · Pokedex Drive · Trade Hall · Fossils and TM Lab</td><td>Crafting/evolution, breeding, raids, Pokédex (with regional milestones), player trading + trade-evolution, fossil revival + TM crafting</td></tr>
      <tr><td>Endgame</td><td>Legend Trail · Postgame Ascent · Prestige Ladder</td><td>Birds / Mewtwo / Mew, shinies, mega checklist, all-leagues capstone, long-term dex/shiny/raid goals</td></tr>
    </tbody>
  </table>

  <h2>How quests relate to the rest of the game</h2>
  <ul>
    <li><strong>Gym maps &amp; level cap</strong> still decide where you can fight — quests track the same path, they do not replace maps. See <a href="Gym_Maps.html">Gym maps</a> · <a href="Level_Cap.html">Level cap</a>.</li>
    <li><strong>Advancements</strong> (<kbd>L</kbd>) are a separate toast checklist. Use both if you like; neither is required to play. <a href="Achievements.html">Achievements</a>.</li>
    <li><strong>Rewards</strong> are helpful items (balls, heals, materials) — not pay-to-win ranks.</li>
  </ul>

  <h2>Common questions</h2>
  <ul>
    <li><strong>Book won’t open?</strong> Check Controls for “Quests” / FTB Quests — default is <kbd>O</kbd>.</li>
    <li><strong>Claim quest stuck?</strong> Claim with <kbd>U</kbd>, then click the green check on the quest. Guide: <a href="Claims.html">Claims</a>.</li>
    <li><strong>Misty locked?</strong> Finish Defeat Brock in First Steps first.</li>
    <li><strong>Lost progress after update?</strong> First Steps IDs are frozen on purpose. If something else looks wrong, Discord <code>#tickets</code> with a screenshot of the book.</li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="First_Hours.html">First hours</a> · <a href="Progression.html">Progression</a> · <a href="Brock.html">Brock</a> · <a href="Misty.html">Misty</a> · <a href="Achievements.html">Achievements</a> · <a href="Region_Exploration.html">Region exploration</a> · <a href="Prestige_Season.html">Prestige season</a></p>
  ${navboxSystems()}
  `,
});

// Travel.html is written in deep-pages.js (full guide).

writePage("Region_Exploration.html", {
  title: "Region exploration",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Quests", href: "Quests.html" },
    { label: "Region exploration", href: "Region_Exploration.html" },
  ],
  lede: "Each league has an <strong>Exploration</strong> chapter. Pins use a fixed naming scheme so BlueMap, waystones, and the quest book all match.",
  infobox: `<div class="infobox-title">Atlas</div>
  <table>
    <tr><th>Tool</th><td><a href="http://88.211.214.163:8100" rel="noopener noreferrer" target="_blank">BlueMap</a></td></tr>
    <tr><th>Maps</th><td><a href="Gym_Maps.html">Gym maps</a></td></tr>
    <tr><th>Travel</th><td><a href="Travel.html">Waystones</a></td></tr>
  </table>`,
  body: `
  <h2>Pin naming (use exactly)</h2>
  <p>Activate a waystone, then rename it. Staff and other players should recognize these names on BlueMap / shared lists.</p>
  <table class="wikitable">
    <thead><tr><th>Region</th><th>First gym pin</th><th>Hub / camp</th><th>Landmark pin</th><th>Second travel pin</th></tr></thead>
    <tbody>
      <tr><td>Kanto</td><td><code>Kanto-Misty</code></td><td><code>Kanto-Hub</code></td><td><code>Kanto-Indigo</code></td><td><code>Kanto-Raid</code> or <code>Kanto-Farm</code></td></tr>
      <tr><td>Johto</td><td><code>Johto-Valerio</code></td><td><code>Johto-Hub</code></td><td><code>Johto-League</code></td><td><code>Johto-Raid</code> or <code>Johto-Farm</code></td></tr>
      <tr><td>Hoenn</td><td><code>Hoenn-Petra</code></td><td><code>Hoenn-Hub</code></td><td><code>Hoenn-League</code></td><td><code>Hoenn-Raid</code> or <code>Hoenn-Farm</code></td></tr>
      <tr><td>Sinnoh</td><td><code>Sinnoh-Pedro</code></td><td><code>Sinnoh-Hub</code></td><td><code>Sinnoh-League</code></td><td><code>Sinnoh-Raid</code> or <code>Sinnoh-Farm</code></td></tr>
    </tbody>
  </table>

  <h2>Per-region checklist</h2>
  <ol class="steps">
    <li>Open <a href="http://88.211.214.163:8100" rel="noopener noreferrer" target="_blank">BlueMap</a> and find the region before you wander.</li>
    <li>Craft the <strong>first gym map</strong> on that region's cartography table (<a href="Gym_Maps.html">how</a>). Never open Empty Maps in the world.</li>
    <li>Place/activate <code>{Region}-{FirstLeader}</code> at the gym approach.</li>
    <li>Walk until the first-leader road is obvious (Kanto → <a href="Misty.html">Misty</a>, Johto → <a href="Valerio.html">Valerio</a>, Hoenn → <a href="Petra.html">Petra</a>, Sinnoh → <a href="Pedro.html">Pedro</a>).</li>
    <li>Catch the typed wild listed in the quest, then pin the <strong>landmark</strong> (Indigo / League approach).</li>
    <li>Add a second pin for raid dens or a farm loop.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Coordinates</div>
    Finished gym maps show X/Z when you hover them. World seeds can change those numbers — trust the crafted map + BlueMap over old screenshots.
  </div>

  <p class="see-also"><strong>See also:</strong> <a href="Quests.html">Quests</a> · <a href="Travel.html">Travel</a> · <a href="Gyms_Kanto.html">Kanto gyms</a></p>
  ${navboxSystems()}
  `,
});

writePage("Prestige_Season.html", {
  title: "Prestige season",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Quests", href: "Quests.html" },
    { label: "Prestige season", href: "Prestige_Season.html" },
  ],
  lede: "After Sinnoh Champion, the <strong>Prestige Ladder</strong> is the long-term chase — including <em>Gotta Catch 'Em All</em> (1025 registered). Seasons are community races, not a wipe of your league badges.",
  infobox: `<div class="infobox-title">Prestige</div>
  <table>
    <tr><th>Unlock</th><td>Sinnoh Champion</td></tr>
    <tr><th>Crown</th><td>1025 registered</td></tr>
    <tr><th>Capstone</th><td>PokeHaven Prestige Champion</td></tr>
    <tr><th>Board</th><td>Discord announcements</td></tr>
  </table>`,
  body: `
  <h2>What counts</h2>
  <ul>
    <li><strong>Pokédex registers</strong> — milestones at 400 / 500 / 600 / 700 / 800 / 851 / <strong>1025</strong></li>
    <li><strong>Volume goals</strong> — 5 shinies, 50 raid wins, 50 eggs hatched, 500 catches</li>
    <li><strong>Capstone</strong> — finish the ladder for <em>PokeHaven Prestige Champion</em></li>
  </ul>

  <h2>Season leaderboard</h2>
  <p>Staff post season dates in Discord. During a season we track (a screenshot of your Prestige Ladder / Pokédex is enough):</p>
  <ol class="steps">
    <li><strong>Dex race</strong> — highest registered count (and first to 1025)</li>
    <li><strong>Shiny race</strong> — first to the Prestige shiny milestone</li>
    <li><strong>Raid race</strong> — first to 50 raid wins on the ladder</li>
  </ol>
  <p>Submit proof in the Discord channel staff announce for that season. No pay-to-win ranks — bragging rights and community shout-outs only.</p>

  <h2>Season reset (what it means)</h2>
  ${critical(
    "en",
    "<strong>We do not wipe gym badges, First Steps, or league progress for a season.</strong> A “reset” is a new scoring window on Discord — your quest book keeps what you earned."
  )}
  <ul>
    <li><strong>Soft season (default)</strong> — new start date; leaderboard scores from zero; quest completions stay.</li>
    <li><strong>Hard prestige wipe (rare)</strong> — only with a full world backup and Discord notice. Staff would only reset Prestige Ladder quest progress if FTB tools allow a safe per-chapter reset. Never done casually.</li>
  </ul>

  <h2>Staff scoreboard (optional)</h2>
  <p>If a season uses in-game scoreboards, staff may create dummy objectives such as <code>ph_dex</code> / <code>ph_shiny</code> and update them from verified screenshots. Players do not need commands for soft seasons.</p>

  <p class="see-also"><strong>See also:</strong> <a href="Quests.html">Quests</a> · <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Achievements.html">Achievements</a></p>
  ${navboxSystems()}
  `,
});

writePage("Rules_and_Commands.html", {
  title: "Rules & commands",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Rules & commands", href: "Rules_and_Commands.html" },
  ],
  lede: "Play fair, be cool, and keep PokeHaven fun. Same rules as Discord <code>#rules</code> — plus the chat commands and keys you’ll use every day.",
  body: `
  <div class="callout tip">
    <div class="label">Agreement</div>
    By joining the Minecraft server or staying in the
    <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a>,
    you agree to these rules.
  </div>

  <h2>Server rules</h2>
  <ol class="steps">
    <li><strong>Respect</strong> — Be kind. No harassment, hate speech, discrimination, or toxic drama. Disagreeing is fine; being a jerk is not.</li>
    <li><strong>No cheating</strong> — No x-ray, dupes, hacked clients, macros for unfair gain, or exploits. Found a bug? Report it in Discord <code>#bug-reports</code> — don’t abuse it.</li>
    <li><strong>Claims &amp; builds</strong> — No griefing, stealing, or wrecking other players’ bases. Claim with <strong>FTB Chunks</strong> — unclaimed land is not protected. Details: <a href="Claims.html">Claims</a>.</li>
    <li><strong>No spam / ads</strong> — No spam, mass pings, scam links, or advertising other servers / Discords. Self-promo only if staff approves it.</li>
    <li><strong>Chat</strong> — <strong>English</strong> is the main language in public channels (EU server). Keep it SFW. Keep names, nicknames, and profile pictures appropriate.</li>
    <li><strong>Voice chat</strong> — Push-to-talk preferred. No earrape, blasting soundboards, or screaming for no reason. Setup: <a href="Voice_Chat.html">Voice chat</a>.</li>
    <li><strong>Asking for help</strong> — Quick public questions → Discord <code>#help</code>. Private / reports / longer staff help → <code>#tickets</code>. Always include a screenshot + what you already tried.</li>
    <li><strong>Donations</strong> — Optional. They keep the server online. <strong>Cosmetic only, no pay-to-win</strong> — donors get a Discord role and an optional in-game chat prefix, never a gameplay advantage. Details: <a href="Donations.html">Donations</a>.</li>
    <li><strong>Staff decisions</strong> — Staff may warn, mute, kick, or ban when needed. Don’t argue moderation in public — use a ticket if needed.</li>
  </ol>

  <h2>Useful chat commands</h2>
  <p>Type <code>/</code> in chat to see what your client offers. These are the ones most trainers need on PokeHaven EU:</p>
  <table class="wikitable">
    <thead><tr><th>Command</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td><code>/pc</code></td><td>Open Pokémon PC storage anywhere — <a href="Healing_and_Storage.html">Healing &amp; storage</a></td></tr>
    </tbody>
  </table>
  <div class="callout tip">
    <div class="label">Money &amp; shops</div>
    PokéDollars use in-world shops and the Bank — there isn’t a separate “must-learn” money command for day-to-day play.
    See <a href="Economy.html">Economy</a>.
  </div>

  <h2>Keys you’ll use constantly</h2>
  <p>PokeHaven EU Client defaults (conflict-free). Rebind under Esc → Options → Controls.</p>
  <table class="wikitable">
    <thead><tr><th>Action</th><th>Default</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Party / starter</td><td><kbd>C</kbd></td><td>Pick starter and manage team</td></tr>
      <tr><td>Select party slot</td><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Which Pokémon you throw</td></tr>
      <tr><td>Throw / recall</td><td><kbd>R</kbd></td><td>Send out the selected Pokémon</td></tr>
      <tr><td>Start battle</td><td><kbd>G</kbd></td><td>Fight or Flight</td></tr>
      <tr><td>Quest book</td><td><kbd>O</kbd></td><td>FTB Quests</td></tr>
      <tr><td>Claim Manager</td><td><kbd>U</kbd></td><td><a href="Claims.html">Claims</a></td></tr>
      <tr><td>Chunk map</td><td><kbd>M</kbd></td><td>FTB Chunks map</td></tr>
      <tr><td>Chat</td><td><kbd>T</kbd></td><td>Text chat</td></tr>
      <tr><td>Voice chat</td><td><kbd>V</kbd></td><td>Mute <kbd>K</kbd> · group has no default key (set one yourself; <kbd>B</kbd> opens your Backpack) — <a href="Voice_Chat.html">Voice chat</a></td></tr>
      <tr><td>Dismount</td><td><kbd>X</kbd></td><td>Get off your mount</td></tr>
      <tr><td>Recipe viewer (REI)</td><td><kbd>E</kbd></td><td>Live crafts — <a href="Essential_Recipes.html">Essential recipes</a></td></tr>
      <tr><td>Ride</td><td><kbd>Shift</kbd> + right-click</td><td><a href="Riding.html">Riding</a></td></tr>
    </tbody>
  </table>

  <h2>Where to find things</h2>
  <ul>
    <li><strong>Wiki:</strong> <a href="https://pokehaven.wiki">pokehaven.wiki</a> (EN) · <a href="https://pokehaven.wiki/nl/">NL</a></li>
    <li><strong>Discord:</strong> IP, pack zip, help — <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">join here</a></li>
    <li><strong>First hours:</strong> <a href="Getting_Started.html">Getting started</a> · <a href="First_Hours.html">First hours</a> · <a href="FAQ.html">FAQ</a></li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="Common_Mistakes.html">Common mistakes</a> · <a href="Claims.html">Claims</a> · <a href="Voice_Chat.html">Voice chat</a> · <a href="Donations.html">Donations</a></p>
  ${navboxSystems()}
  `,
});

writePage("Donations.html", {
  title: "Donations",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Donations", href: "Donations.html" },
  ],
  lede: "Optional, cosmetic-only support for PokeHaven EU — via PayPal. No pay-to-win, ever. Here is exactly what donating does and how to check your status.",
  infobox: infoboxHtml("Donations (cosmetic)", [
    ["Payment", "PayPal"],
    ["Tracking", "Lifetime total (never resets)"],
    ["Tiers", "3 — Supporter, Patron, Benefactor"],
    ["Grants", "Discord role + optional in-game chat prefix"],
    ["Gameplay effect", "None — cosmetic only"],
    ["Check status", "<code>/donate check</code>"],
  ]),
  body: `
  <div class="callout tip">
    <div class="label">Cosmetic only</div>
    Donating on PokeHaven EU never buys power. Every tier is <strong>purely cosmetic</strong> — a Discord role and an optional in-game chat prefix. No extra catches, no better odds, no claim size boosts, no shortcuts around the <a href="Level_Cap.html">level cap</a>.
  </div>

  <h2>Why donate?</h2>
  <p>Donations are completely optional and help keep the server online and upgraded. Some donations also fund community events — for example, <strong>€10</strong> can fund a server-wide <strong>Shiny Hour</strong> (wild shiny odds doubled from 1/${shiny} to 1/${Math.round(shiny / 2)} for 60 minutes, benefiting every player online, not just the donor).</p>

  <h2>How it works</h2>
  <ol class="steps">
    <li><strong>Link your account first</strong> so the bot knows your Minecraft name for the in-game prefix: run <code>/link minecraft:YourExactName</code> in Discord.</li>
    <li><strong>Donate with PayPal.</strong> The current donate link is posted (and pinned) in Discord <code>#donations</code> — it is not published here so it never goes stale.</li>
    <li><strong>Put your Discord name in the PayPal note</strong> (add <code>Shiny Hour</code> too if that's what you're funding).</li>
    <li><strong>Staff logs the payment</strong> with <code>/donate add</code>. The bot updates your lifetime total, assigns your Discord role, and (where configured) syncs your in-game chat prefix.</li>
  </ol>

  <h2>Lifetime tiers</h2>
  <p>Tiers are based on your <strong>lifetime total</strong>, not a single payment — donations stack toward the next tier and never expire.</p>
  <table class="wikitable">
    <thead><tr><th>Lifetime total</th><th>Discord role</th><th>In-game chat prefix</th></tr></thead>
    <tbody>
      <tr><td>€10+</td><td>Supporter</td><td><span style="color:#2dd4bf"><strong>[Supporter]</strong></span> (aqua)</td></tr>
      <tr><td>€50+</td><td>Patron</td><td><span style="color:#d4a017"><strong>[Patron]</strong></span> (gold)</td></tr>
      <tr><td>€100+</td><td>Benefactor</td><td><span style="color:#c084fc"><strong>[Benefactor]</strong></span> (light purple)</td></tr>
    </tbody>
  </table>
  <p>Chat prefixes are opt-in — pick your visible tag in-game with the <strong>PokeHaven Prefix</strong> mod (<code>/prefix</code>) once your Discord role is assigned.</p>

  <h2>Checking your status</h2>
  <table class="wikitable">
    <thead><tr><th>Command</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td><code>/donate check</code></td><td>Shows your own lifetime donation total, current tier, and linked Minecraft name</td></tr>
      <tr><td><code>/donate tiers</code></td><td>Lists the cosmetic donation tiers shown above</td></tr>
      <tr><td><code>/link minecraft:YourName</code></td><td>Links your Discord account to your Minecraft username (do this first)</td></tr>
    </tbody>
  </table>

  <h2>Common questions</h2>
  <ul>
    <li><strong>Does donating give any gameplay advantage?</strong> No — see the callout above. It's role + chat prefix only.</li>
    <li><strong>Do tiers ever downgrade?</strong> No, your lifetime total only goes up as you donate more.</li>
    <li><strong>Where's the actual donate link?</strong> Discord <code>#donations</code> — kept there so it can't go stale on the wiki.</li>
    <li><strong>I donated but don't have my role yet?</strong> Make sure you put your Discord name in the PayPal note and ask in Discord <code>#tickets</code> if staff hasn't logged it yet.</li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="Rules_and_Commands.html">Rules &amp; commands</a> · <a href="Discord_Commands.html">Discord commands</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxSystems()}
  `,
});

writePage("Discord_Commands.html", {
  title: "Discord commands",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Discord commands", href: "Discord_Commands.html" },
  ],
  lede: "Every player-facing slash command the PokeHaven EU Discord bot offers — account linking and donation status. (Looking for in-game commands like <code>/pc</code>? See <a href=\"Rules_and_Commands.html\">Rules &amp; commands</a>.)",
  infobox: infoboxHtml("Discord bot commands", [
    ["Where", "Any channel in the PokeHaven EU Discord"],
    ["Account link", "<code>/link</code>"],
    ["Donation status", "<code>/donate check</code>, <code>/donate tiers</code>"],
    ["Staff only", "<code>/donate add</code>, <code>/donate set</code>, <code>/donate link</code>, <code>/donate list</code>"],
  ]),
  body: `
  <div class="callout tip">
    <div class="label">Discord, not in-game</div>
    These are <strong>slash commands typed in Discord</strong> (start with <kbd>/</kbd> in any channel the bot can see) — not Minecraft chat commands. For in-game commands like <code>/pc</code>, see <a href="Rules_and_Commands.html">Rules &amp; commands</a>.
  </div>

  <h2>Account linking</h2>
  <table class="wikitable">
    <thead><tr><th>Command</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td><code>/link minecraft:YourExactName</code></td><td>Links your Discord account to your Minecraft username (case-sensitive, 3–16 characters). Do this first — it's how the bot knows who to credit for donations and chat prefixes.</td></tr>
    </tbody>
  </table>

  <h2>Donations</h2>
  <p>Full context on tiers and how donating works: <a href="Donations.html">Donations</a>.</p>
  <table class="wikitable">
    <thead><tr><th>Command</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td><code>/donate check</code></td><td>Shows your own lifetime donation total, current cosmetic tier, and linked Minecraft name.</td></tr>
      <tr><td><code>/donate tiers</code></td><td>Lists the cosmetic donation tiers (Supporter / Patron / Benefactor) and what each grants.</td></tr>
    </tbody>
  </table>

  <h2>Staff-only commands</h2>
  <p>These require staff permissions — listed here for transparency, not something regular players can run.</p>
  <table class="wikitable">
    <thead><tr><th>Command</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td><code>/donate add</code></td><td>Logs a new donation against a user's lifetime total (amount + optional Minecraft IGN / note).</td></tr>
      <tr><td><code>/donate set</code></td><td>Corrects a user's lifetime total directly.</td></tr>
      <tr><td><code>/donate link</code></td><td>Links a Discord user to a Minecraft IGN on their behalf.</td></tr>
      <tr><td><code>/donate list</code></td><td>Shows the top lifetime donors.</td></tr>
    </tbody>
  </table>

  <p class="see-also"><strong>See also:</strong> <a href="Donations.html">Donations</a> · <a href="Rules_and_Commands.html">Rules &amp; commands</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxSystems()}
  `,
});

writePage("Voice_Chat.html", {
  title: "Voice chat",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Voice chat", href: "Voice_Chat.html" },
  ],
  lede: "Simple Voice Chat is built into the pack. Nearby talk works in-game — Discord is optional for lobby chat and announcements.",
  infobox: infoboxHtml("Voice", [
    ["Hear distance", "~48 blocks"],
    ["Whisper", "~24 blocks"],
    ["Groups", "Enabled"],
    ["Forced VC", "No"],
  ]),
  body: `
  <h2>First join</h2>
  <ol class="steps">
    <li>Join PokeHaven EU and allow the mic / voice-chat prompt if Windows or the game asks.</li>
    <li>Open <strong>Esc → Options → Controls → Simple Voice Chat</strong> and set <strong>Push to talk</strong> (nicest in groups).</li>
    <li>PokeHaven EU defaults: voice menu <kbd>V</kbd>, mute <kbd>K</kbd>. Group has <strong>no default key</strong> — <kbd>B</kbd> is reserved for your Backpack, so bind group to whatever's free for you.</li>
    <li>Pick the correct input device if nobody can hear you.</li>
    <li>Test with a friend nearby — you should hear each other within the hear distance.</li>
  </ol>

  <h2>How it works here</h2>
  <ul>
    <li><strong>Proximity chat</strong> — people near you hear you; walk away and the volume fades.</li>
    <li><strong>Whisper</strong> — shorter range for quieter talk (~24 blocks).</li>
    <li><strong>Groups</strong> — useful for raid parties, gym runs, or building crews so you stay linked while exploring.</li>
    <li>Voice is <strong>not forced</strong> — mute or stay in text if you prefer.</li>
  </ul>

  <h2>Discord vs in-game voice</h2>
  <table class="wikitable">
    <thead><tr><th>Use</th><th>Best tool</th></tr></thead>
    <tbody>
      <tr><td>Talk while exploring / raiding next to someone</td><td>In-game Simple Voice Chat</td></tr>
      <tr><td>Server news, IP, rules, LFG posts</td><td><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a></td></tr>
      <tr><td>Long AFK voice while not near each other</td><td>Discord (or a VC group if you set one up)</td></tr>
    </tbody>
  </table>

  <h2>Troubleshooting</h2>
  <ul>
    <li><strong>No one hears you:</strong> wrong mic device, muted key held wrong, or OS privacy blocked Minecraft.</li>
    <li><strong>You hear nothing:</strong> output device, game volume, or you’re out of range / not in the same group.</li>
    <li><strong>Echo / feedback:</strong> use headphones; push-to-talk beats open mic near others.</li>
    <li>Caves and buildings can sound more “real” if Sound Physics is on — that’s normal, not a bug.</li>
  </ul>

  <h2>Etiquette</h2>
  <ul>
    <li>Push-to-talk when you’re near a crowd or raid.</li>
    <li>Don’t blast music into open mic.</li>
    <li>Respect mutes — if someone deafens or leaves voice, don’t nag in chat.</li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="Raids.html">Raids</a> · <a href="Getting_Started.html">Getting started</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxSystems()}
  `,
});

// Phase 2 databases
writePage("Trainer_Index.html", {
  title: "Trainer index",
  breadcrumbs: [
    { label: "Main Page", href: "../index.html" },
    { label: "Trainer index", href: "Trainer_Index.html" },
  ],
  lede: `Searchable list of <strong>${trainers.all.length}</strong> named trainers on PokeHaven EU.`,
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
        const hit = [
          ...trainers.kantoLeaders,
          ...(trainers.johtoLeaders || []),
          ...(trainers.hoennLeaders || []),
          ...(trainers.sinnohLeaders || []),
        ].find((k) => k.id === t.id);
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
  lede: `Searchable index of ${raids.bosses.length} raid bosses — species, tier, and moves. How dens work: <a href="Raids.html">Raids</a>.`,
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
  raids,
});

registerMinecraftGuides({
  writePage,
  navboxMinecraft,
  navboxSystems,
  shiny,
  xpMult,
  economy,
  raids,
});

registerExpansionPages({
  writePage,
  navboxSystems,
  navboxMinecraft,
  recipesMeta,
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
    lede: "Checklist for the Johto challenge on CobbleVerse / PokeHaven EU after <a href=\"Blue.html\">Champion Blue</a>. Open a leader page for full teams and prep tips.",
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

  // Hoenn gym hub + individual deep guides (same depth as Kanto/Johto)
  {
    const hoenn = trainers.hoennLeaders || [];
    const rows = hoenn
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
    writePage("Gyms_Hoenn.html", {
      title: "Hoenn gyms",
      breadcrumbs: [
        { label: "Main Page", href: "../index.html" },
        { label: "Hoenn gyms", href: "Gyms_Hoenn.html" },
      ],
      lede: "Checklist for the Hoenn challenge on CobbleVerse / PokeHaven EU after the Johto Champion. Open a leader page for full teams and prep tips.",
      body: `
    <h2>Unlock</h2>
    <ol class="steps">
      <li>Beat Johto Champion <a href="Johto_Lance.html">Lance</a>.</li>
      <li>Follow the champion book: Trainer Association → <strong>Hoenn Trainer Card</strong>.</li>
      <li>Craft maps on the <strong>Hoenn Cartography Table</strong> — not the Kanto/Johto tables. See <a href="Gym_Maps.html">Gym maps</a>.</li>
      <li>Start with <a href="Petra.html">Petra</a> (Stone Badge).</li>
    </ol>
    <h2>Gym leaders &amp; league</h2>
    <table class="wikitable">
      <thead><tr><th>Trainer</th><th>Type</th><th>Badge / role</th><th>Biome / place</th><th>Map item</th><th>Team lv</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="callout tip">
      <div class="label">Elite Four location</div>
      Unlike Kanto/Johto, the Hoenn Elite Four and Champion Rocco are fought on real Steppe biome league grounds, not in The End.
    </div>
    <p>Track badges in Advancements too — <a href="Achievements.html">Achievements</a>. After Hoenn Champion: <a href="Gyms_Sinnoh.html">Sinnoh</a>.</p>
    ${navboxGyms()}
    `,
    });
  }

  // Sinnoh gym hub + individual deep guides (same depth as Kanto/Johto)
  {
    const sinnoh = trainers.sinnohLeaders || [];
    const rows = sinnoh
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
    writePage("Gyms_Sinnoh.html", {
      title: "Sinnoh gyms",
      breadcrumbs: [
        { label: "Main Page", href: "../index.html" },
        { label: "Sinnoh gyms", href: "Gyms_Sinnoh.html" },
      ],
      lede: "Checklist for the Sinnoh challenge on CobbleVerse / PokeHaven EU after Hoenn Champion Rocco. Open a leader page for full teams and prep tips.",
      body: `
    <h2>Unlock</h2>
    <ol class="steps">
      <li>Beat Hoenn Champion <a href="Rocco.html">Rocco</a>.</li>
      <li>Follow the champion book: Trainer Association → <strong>Sinnoh Trainer Card</strong>.</li>
      <li>Craft maps on the <strong>Sinnoh Cartography Table</strong> — not the Kanto/Johto/Hoenn tables. See <a href="Gym_Maps.html">Gym maps</a>.</li>
      <li>Start with <a href="Pedro.html">Pedro</a> (Coal Badge).</li>
    </ol>
    <h2>Gym leaders &amp; league</h2>
    <table class="wikitable">
      <thead><tr><th>Trainer</th><th>Type</th><th>Badge / role</th><th>Biome / place</th><th>Map item</th><th>Team lv</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="callout tip">
      <div class="label">Elite Four location</div>
      The Sinnoh Elite Four and Champion Camilla are fought on real Desert Oasis league grounds, not in The End.
    </div>
    <p>Track badges in Advancements too — <a href="Achievements.html">Achievements</a>. Sinnoh is the last region in the current gym line — see <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a> for what's next.</p>
    ${navboxGyms()}
    `,
    });
  }

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
      lede: `${esc(displayName)} — ${esc(g.type)} specialist on PokeHaven EU.`,
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

  // Individual Hoenn gym pages (same depth as Kanto/Johto)
  for (const g of trainers.hoennLeaders || []) {
    const maxLv = teamMaxLevel(g);
    const minLv = Math.min(...g.team.map((m) => Number(m.level) || 99));
    writePage(`${g.slug}.html`, {
      title: g.name,
      breadcrumbs: [
        { label: "Main Page", href: "../index.html" },
        { label: "Hoenn gyms", href: "Gyms_Hoenn.html" },
        { label: g.name, href: `${g.slug}.html` },
      ],
      lede: `${esc(g.name)} — ${esc(g.type)} specialist on PokeHaven EU.`,
      infobox: infoboxHtml(g.name, [
        ["Region", "Hoenn"],
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

  // Individual Sinnoh gym pages (same depth as Kanto/Johto)
  for (const g of trainers.sinnohLeaders || []) {
    const maxLv = teamMaxLevel(g);
    const minLv = Math.min(...g.team.map((m) => Number(m.level) || 99));
    writePage(`${g.slug}.html`, {
      title: g.name,
      breadcrumbs: [
        { label: "Main Page", href: "../index.html" },
        { label: "Sinnoh gyms", href: "Gyms_Sinnoh.html" },
        { label: g.name, href: `${g.slug}.html` },
      ],
      lede: `${esc(g.name)} — ${esc(g.type)} specialist on PokeHaven EU.`,
      infobox: infoboxHtml(g.name, [
        ["Region", "Sinnoh"],
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

  <nav class="hub-jump chips" aria-label="Browse sections">
    <a class="chip" href="#start"><strong>Start</strong></a>
    <a class="chip" href="#path"><strong>Your path</strong></a>
    <a class="chip" href="#gyms"><strong>Gyms</strong></a>
    <a class="chip" href="#craft"><strong>Recipes</strong></a>
    <a class="chip" href="#systems"><strong>Systems</strong></a>
    <a class="chip" href="#data"><strong>Data</strong></a>
  </nav>

  <h2 id="start">New players</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Getting_Started.html"><h3>Getting started</h3><p>Install 1.7.42 and join.</p></a>
    <a class="hub-card" href="pages/First_Hours.html"><h3>First hours</h3><p>Claim, Brock, then the Misty loop.</p></a>
    <a class="hub-card" href="pages/Brock.html"><h3>Brock</h3><p>First gym deep guide.</p></a>
    <a class="hub-card" href="pages/Essential_Recipes.html"><h3>Essential recipes</h3><p>Balls, maps, tools, REI.</p></a>
    <a class="hub-card" href="pages/FAQ.html"><h3>FAQ</h3><p>Join issues &amp; common fixes.</p></a>
  </div>

  <h2 id="path">Your path</h2>
  <div class="hub-grid">
    <a class="hub-card hub-card-spotlight" href="pages/Quests.html"><h3>Quests</h3><p>Press O — First Steps through Sinnoh.</p></a>
    <a class="hub-card" href="pages/Level_Cap.html"><h3>Level cap</h3><p>Why XP freezes — and the ladder.</p></a>
    <a class="hub-card" href="pages/Progression.html"><h3>Progression</h3><p>Regions &amp; the gym loop.</p></a>
    <a class="hub-card" href="pages/Gym_Maps.html"><h3>Gym maps</h3><p>Cartography &amp; coordinates.</p></a>
    <a class="hub-card" href="pages/Achievements.html"><h3>Achievements</h3><p>Pack advancement checklist.</p></a>
  </div>

  <h2 id="gyms">Gyms &amp; regions</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Gyms_Kanto.html"><h3>Kanto</h3><p>All 8 leaders + Elite Four.</p></a>
    <a class="hub-card" href="pages/Gyms_Johto.html"><h3>Johto</h3><p>Valerio → Lance — deep guides.</p></a>
    <a class="hub-card" href="pages/Gyms_Hoenn.html"><h3>Hoenn</h3><p>Petra → Rocco — deep guides.</p></a>
    <a class="hub-card" href="pages/Gyms_Sinnoh.html"><h3>Sinnoh</h3><p>Pedro → Camilla — deep guides.</p></a>
    <a class="hub-card" href="pages/Blue.html"><h3>Champion Blue</h3><p>End of Kanto — then Johto.</p></a>
    <a class="hub-card" href="pages/Postgame_and_Legendaries.html"><h3>Post-game</h3><p>Mew, birds, Mewtwo.</p></a>
    <a class="hub-card" href="pages/Mega_and_Late_Game.html"><h3>Mega &amp; late-game</h3><p>Gimmicks + after-Blue checklist.</p></a>
  </div>

  <h2 id="craft">Minecraft &amp; recipes</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Minecraft_Hub.html"><h3>Minecraft hub</h3><p>Survival guides in one place.</p></a>
    <a class="hub-card" href="pages/Poke_Balls.html"><h3>Poké Balls</h3><p>Apricorns + crafting screenshots.</p></a>
    <a class="hub-card" href="pages/Recipe_Browser.html"><h3>Recipe browser</h3><p>${recipesMeta.count} datapack crafts.</p></a>
    <a class="hub-card" href="pages/Economy.html"><h3>Economy</h3><p>Shop &amp; bank prices.</p></a>
  </div>

  <h2 id="systems">Systems</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Catching_and_Battling.html"><h3>Catching &amp; battling</h3><p>Combat primer.</p></a>
    <a class="hub-card" href="pages/Raids.html"><h3>Raids</h3><p>Dens and tiers.</p></a>
    <a class="hub-card" href="pages/Claims.html"><h3>Claims</h3><p>FTB Chunks.</p></a>
    <a class="hub-card" href="pages/Travel.html"><h3>Travel</h3><p>Waystones, maps, and BlueMap.</p></a>
    <a class="hub-card" href="pages/Breeding.html"><h3>Breeding</h3><p>Pasture, eggs, Ditto rules.</p></a>
    <a class="hub-card" href="pages/Shiny.html"><h3>Shiny hunting</h3><p>Rates, Masuda, crystals.</p></a>
    <a class="hub-card" href="pages/Fishing.html"><h3>Fishing</h3><p>Cobblemon rods &amp; water catches.</p></a>
    <a class="hub-card" href="pages/Cobbleworkers.html"><h3>Cobbleworkers</h3><p>Pasture jobs — crops, berries, furnaces.</p></a>
    <a class="hub-card" href="pages/Outfits_and_Cosmetics.html"><h3>Outfits &amp; cosmetics</h3><p>Trainer clothes &amp; Pokémon looks.</p></a>
    <a class="hub-card" href="pages/Common_Mistakes.html"><h3>Common mistakes</h3><p>Fix these once.</p></a>
    <a class="hub-card" href="pages/Rules_and_Commands.html"><h3>Rules &amp; commands</h3><p>Server rules, /pc, keybinds.</p></a>
    <a class="hub-card" href="pages/Donations.html"><h3>Donations</h3><p>Cosmetic tiers, no pay-to-win.</p></a>
  </div>

  <h2 id="data">Databases</h2>
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
    "<strong>Joining.</strong> Server list name is <code>PokeHaven EU</code>. Install <strong>PokeHaven EU Client 1.7.42</strong> (CobbleVerse + our UI). Copy the IP from Discord — it can rotate.",
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
    "<strong>Wrong pack version is the usual cause.</strong> Re-import <strong>PokeHaven EU Client 1.7.42</strong> from Discord/Drive. See <a href=\"Getting_Started.html\">Getting started</a>."
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

  <h2>Where is Misty?</h2>
  <p>After Brock, craft her map: <strong>Cerulean Star</strong> (seagrass needs <strong>Shears</strong>) + fresh Empty Map on the Kanto Cartography Table. Guides: <a href="Misty.html">Misty</a> · <a href="Gym_Maps.html">Gym maps</a>.</p>

  <h2>Do I claim with Open Parties?</h2>
  <p><strong>No.</strong> On PokeHaven EU use <strong>FTB Chunks only</strong>. Open Parties and Claims (OPAC) has been <strong>removed</strong> from the pack so there is only one claims system. See <a href="Claims.html">Claims</a>.</p>

  <h2>Is there a browser map?</h2>
  <p>Yes — <strong>BlueMap</strong>: <a href="http://88.211.214.163:8100" rel="noopener noreferrer" target="_blank">http://88.211.214.163:8100</a>. It currently shows <strong>online player markers only</strong> — it does not show Pokémon or mob locations. More travel tools: <a href="Travel.html">Travel</a>.</p>

  <h2>Can I donate?</h2>
  <p>Yes, optionally — donations help keep the server online / upgraded. They're <strong>cosmetic only</strong>: tiers grant a Discord role (Supporter / Patron / Benefactor) and an optional in-game chat prefix — <strong>never a gameplay advantage</strong>. Full breakdown: <a href="Donations.html">Donations</a>. Links live in Discord <code>#donations</code>.</p>

  <h2>How do I craft Poké Balls?</h2>
  <p>Full screenshot guide: <a href="Poke_Balls.html">Poké Balls</a>. More crafts: <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Recipe_Browser.html">Recipe browser</a>.</p>

  <h2>Where are normal Minecraft tips?</h2>
  <p><a href="Minecraft_Hub.html">Minecraft survival hub</a> — mining, farming, Nether, villages, death, and <a href="Pack_Differences.html">what this pack changes</a>.</p>

  <h2>Is there a quest arrow?</h2>
  <p>No floating arrow on the world. Open the <strong>quest book</strong> with <kbd>O</kbd> (<a href="Quests.html">Quests</a>) for First Steps → Sinnoh and side goals. If you <strong>pin</strong> a quest from inside the book, it shows up in a small tracker near the <strong>bottom-right of your HUD</strong> (next to the minimap/coordinates) — that tracker is the closest thing to a quest arrow, there is still no floating 3D arrow in the world. Still use <a href="Gym_Maps.html">gym maps</a>, the <a href="Level_Cap.html">level cap</a>, and Advancements (<a href="Achievements.html">Achievements</a> — often <kbd>L</kbd>). Post-league: <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a>.</p>

  <h2>Can I loot villages?</h2>
  <p>Yes. Center/house chests are fair game. On PokeHaven EU, emptied loot may refresh later.</p>

  <h2>Voice chat key?</h2>
  <p><kbd>V</kbd> opens voice chat, <kbd>K</kbd> mutes. Group has no default key — <kbd>B</kbd> opens your Backpack instead, so pick a free key for group under Controls. See <a href="Voice_Chat.html">Voice chat</a>.</p>

  <h2>Where is the player wiki?</h2>
  <p><strong><a href="https://pokehaven.wiki">pokehaven.wiki</a></strong> — English + Nederlands (flags on the site). Also pinned in Discord <code>#pokehaven-wiki</code>. Start with Getting started, Claims, Gym maps, Brock.</p>

  <h2>Where do I ask for help?</h2>
  <p><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a> — send a screenshot + what you already tried. IP and pack links live in <code>#how-to-join</code>.</p>
  <ul>
    <li><code>#help</code> — quick public questions other players can answer too</li>
    <li><code>#tickets</code> — private help, reports, appeals, longer staff issues</li>
  </ul>
  <p>Prefer commands? The bot also answers to slash commands like <code>/link</code> and <code>/donate check</code> — full list: <a href="Discord_Commands.html">Discord commands</a>.</p>

  <h2>Can I turn off the level cap?</h2>
  ${critical(
    "en",
    "<strong>No — not on PokeHaven EU.</strong> Beat the next gym. See <a href=\"Level_Cap.html\">Level cap</a>."
  )}

  <h2>Why aren’t Pokémon biting my fishing rod?</h2>
  <p>Use a <strong>Cobblemon</strong> rod (Poke Rod / Lure Rod / …), not only a vanilla Minecraft rod. Guide: <a href="Fishing.html">Fishing</a>.</p>

  <h2>How do shiny odds work?</h2>
  <p>Wild base rate is <strong>1 / ${shiny}</strong>. Breeding can use Masuda / crystal methods. Full page: <a href="Shiny.html">Shiny hunting</a> · <a href="Breeding.html">Breeding</a>.</p>

  <h2>I beat Blue — do I restart the server?</h2>
  <p><strong>No.</strong> On PokeHaven, follow the champion book: Trainer Association → Johto Trainer Card (your cap resets; others unaffected). If Johto structures are missing, ask in Discord — staff may need <em>one</em> restart. Checklist: <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a> · <a href="Progression.html">Progression</a> · <a href="Blue.html">Blue</a>.</p>

  <h2>How do outfits / costumes work?</h2>
  <p>Craft trainer clothes with Cloth (wool + string), equip in armor slots. Pokémon looks use cosmetic slots / special items (Pika Case, Furfrou + dye + Shears, Lucario Costume Box). Full guide: <a href="Outfits_and_Cosmetics.html">Outfits and cosmetics</a>.</p>
  ${critical(
    "en",
    "<strong>Cosplay Pikachu cannot evolve into Raichu.</strong> Use a normal Pallet Pikachu if you want Raichu."
  )}

  <p class="see-also"><strong>See also:</strong> <a href="Common_Mistakes.html">Common mistakes</a> · <a href="Donations.html">Donations</a> · <a href="https://pokehaven.wiki">Wiki home</a> · <a href="Roadmap.html">30-day roadmap</a></p>
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
  economy,
  shiny,
  xpMult,
  rates,
});

fs.writeFileSync(path.join(DATA, "search-index.json"), JSON.stringify(searchIndex, null, 2));
fs.writeFileSync(path.join(DATA, "search-index-nl.json"), JSON.stringify(searchIndexNl, null, 2));

// ---------- sitemap.xml (auto-generated from every EN + NL page written above) ----------
function sitemapUrl(lang, href) {
  const file = href === "index.html" ? "index.html" : href.split("/").pop();
  return canonicalUrl(lang, file);
}
const sitemapUrls = [
  ...searchIndex.map((e) => sitemapUrl("en", e.href)),
  ...searchIndexNl.map((e) => sitemapUrl("nl", e.href)),
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemapXml);

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
cd d:\\COBBLEVERSE\\PokeHaven-Wiki
npx --yes serve .
\`\`\`

## Rebuild from pack data
Requires extract at \`d:\\COBBLEVERSE\\_pack_analysis\` (with \`_dp_peek\` datapacks).

\`\`\`powershell
cd d:\\COBBLEVERSE\\PokeHaven-Wiki
npm run build
\`\`\`

Parsers: \`scripts/parse-pack.js\` + \`scripts/parse-recipes.js\`.
`
);

console.log(
  `Wrote wiki with ${searchIndex.length} EN + ${searchIndexNl.length} NL searchable pages.`
);
