/** Extra deep guide pages + content expansions for PokeHaven wiki */

import { DISCORD_INVITE, critical } from "./i18n.js";
import { advancementTableRows, groupTitle } from "./advancement-copy.js";
import { husbandryBodyEn } from "./pokemon-husbandry.js";
import { hearthstoneBodyEn } from "./hearthstone.js";

function altText(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/^(Figure|Figuur)\s*[—–-]\s*/i, "")
    .trim();
}

/** @param {{ large?: boolean, diagram?: boolean }} [opts] */
export function figure(src, caption, alt = "", opts = {}) {
  // Captions should read as real sentences — never "Figure — …"
  const clean = String(caption).replace(/<strong>\s*(Figure|Figuur)\s*[—–-]\s*/gi, "<strong>");
  const a = altText(alt || clean).replace(/"/g, "&quot;");
  const classes = ["figure"];
  if (opts.large || opts.diagram) classes.push("figure-large");
  if (opts.diagram) classes.push("figure-diagram");
  return `<figure class="${classes.join(" ")}">
  <a class="figure-zoom" href="${src}" data-lightbox title="Click to enlarge">
    <img src="${src}" alt="${a}" loading="lazy" />
  </a>
  <figcaption>${clean}</figcaption>
</figure>`;
}

/** Canonical screenshot path under assets/guides/ (from pages/*.html). */
export function guideImg(name) {
  return `../assets/guides/${name}`;
}

export function registerDeepPages({
  writePage,
  navboxSystems,
  navboxGyms,
  economy,
  shiny,
  xpMult,
  advancements,
  raids,
}) {
  const shopPrice = (id) =>
    (economy?.shop || []).flatMap((s) => s.items).find((i) => i.item === id)?.price;
  const adv = advancements || { count: 0, groups: {}, cobbleverse: {}, cobblemon: {} };
  const cv = adv.cobbleverse?.groups || adv.groups || {};
  const cm = adv.cobblemon?.groups || {};
  const cvCount = adv.cobbleverse?.count ?? Object.values(cv).reduce((n, a) => n + (a?.length || 0), 0);
  const cmCount = adv.cobblemon?.count ?? Object.values(cm).reduce((n, a) => n + (a?.length || 0), 0);

  function advSection(groups, groupKey) {
    const rows = advancementTableRows(groups[groupKey], "en");
    if (!rows) return "";
    return `
    <h3>${groupTitle(groupKey, "en")}</h3>
    <table class="wikitable">
      <thead><tr><th>Achievement</th><th>How</th><th>Icon item</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  writePage("Achievements.html", {
    title: "Achievements",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Achievements", href: "Achievements.html" },
    ],
    lede: `In-game you have <strong>two</strong> main Pokémon advancement tabs: <strong>CobbleVerse</strong> (${cvCount} gym / league / legendary goals) and <strong>Cobblemon</strong> (${cmCount} catching, farming, fossils…). Vanilla Minecraft tabs also exist. This page lists both Pokémon trees.`,
    infobox: `<div class="infobox-title">Advancements</div>
    <table>
      <tr><th>Open in-game</th><td>Advancements (often <kbd>L</kbd>) or Pause → Advancements</td></tr>
      <tr><th>CobbleVerse tab</th><td>${cvCount} — all-region gyms / leagues + Kanto legendaries</td></tr>
      <tr><th>Cobblemon tab</th><td>${cmCount} — balls, berries, fossils, rides…</td></tr>
      <tr><th>Post-game guide</th><td><a href="Postgame_and_Legendaries.html">Legendaries</a></td></tr>
    </table>`,
    body: `
    <h2>How to open</h2>
    <ol class="steps">
      <li>Press <kbd>L</kbd> (default Advancements key), or Pause → <strong>Advancements</strong>.</li>
      <li>Switch tabs at the top — Paginated Advancements pins <strong>CobbleVerse</strong>; the <strong>Cobblemon</strong> tab is the bigger mod tree.</li>
      <li>Use toasts as a checklist. Gym maps + level cap remain your real progression.</li>
    </ol>

    ${critical(
      "en",
      "<strong>Coverage:</strong> CobbleVerse pack advancements + PokeHaven EU Johto/Hoenn/Sinnoh toast trees, plus every Cobblemon <em>display</em> advancement (catching / farming / fossils / battle). We skip Cobblemon recipe-book unlock spam (hundreds of “craft X” ticks), vanilla Minecraft tabs, and mods with only a root stub (e.g. Mega Showdown)."
    )}

    <h2>CobbleVerse tab (${cvCount})</h2>
    <p>Pack progression: starter → Kanto → Johto → Hoenn → Sinnoh (gyms + Elite Four + Champion), then Kanto fossils / legendaries. Johto+ trees come from the <strong>PokeHaven EU</strong> datapack (toast-only — badges still drop from trainer loot). Post-game: <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a>.</p>
    ${advSection(cv, "start")}
    ${advSection(cv, "kanto_gym")}
    ${advSection(cv, "elite")}
    ${advSection(cv, "johto_gym")}
    ${advSection(cv, "johto_elite")}
    ${advSection(cv, "hoenn_gym")}
    ${advSection(cv, "hoenn_elite")}
    ${advSection(cv, "sinnoh_gym")}
    ${advSection(cv, "sinnoh_elite")}
    ${advSection(cv, "postgame_item")}
    ${advSection(cv, "legendary")}
    ${advSection(cv, "shiny")}

    <h2>Cobblemon tab (${cmCount})</h2>
    <p>Base Cobblemon mod goals (titles from the mod language file). Great for early systems: first catch, apricorns, berries, healing machine, fossils, rides.</p>
    ${advSection(cm, "root")}
    ${advSection(cm, "catching")}
    ${advSection(cm, "agriculture")}
    ${advSection(cm, "geological")}
    ${advSection(cm, "battle")}
    ${advSection(cm, "other")}

    <h2>Not listed (on purpose)</h2>
    <ul>
      <li><strong>Cobblemon recipe unlocks</strong> under <code>advancement/recipes/</code> — recipe-book ticks, not real goals.</li>
      <li><strong>Vanilla Minecraft</strong> Story / Nether / Adventure tabs.</li>
      <li><strong>Mega Showdown</strong> — only a root stub in the pack overlay.</li>
    </ul>

    <h2>What to do next</h2>
    <ul>
      <li>Early game: <a href="Brock.html">Brock</a> → <a href="Misty.html">Misty</a> → rest of <a href="Gyms_Kanto.html">Kanto</a>.</li>
      <li>After Blue / late Kanto: <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a>.</li>
      <li>Looking for biomes: <a href="Spawn_Lookup.html">Spawn lookup</a>.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Progression.html">Progression</a> · <a href="Roadmap.html">30-day roadmap</a> · <a href="Level_Cap.html">Level cap</a> · <a href="FAQ.html">FAQ</a> · <a href="Prestige_Season.html">Prestige season</a></p>
    ${navboxGyms()}
    ${navboxSystems()}
    `,
  });

  writePage("Postgame_and_Legendaries.html", {
    title: "Post-game and legendaries",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Post-game and legendaries", href: "Postgame_and_Legendaries.html" },
    ],
    lede: "After the Kanto league, CobbleVerse opens fossil / DNA routes and legendary catches. Use this with the <a href=\"Achievements.html\">Achievements</a> checklist.",
    infobox: `<div class="infobox-title">Post-game</div>
    <table>
      <tr><th>When</th><td>Late Kanto / after Champion Blue</td></tr>
      <tr><th>Mew path</th><td>Origin Fossil → catch Mew</td></tr>
      <tr><th>Mewtwo path</th><td>Ancient DNA → revive Mewtwo</td></tr>
      <tr><th>Birds</th><td>Articuno, Zapdos, Moltres</td></tr>
      <tr><th>Lookup</th><td>REI (<kbd>E</kbd>) + <a href="Spawn_Lookup.html">Spawn lookup</a></td></tr>
    </table>`,
    body: `
    <h2>When post-game feels open</h2>
    <p>Finish the Kanto gyms and league first. Beating <a href="Blue.html">Champion Blue</a> unlocks the Origin Fossil advancement branch. Ancient DNA is tied to late Kanto progress (Giovanni / inventory trigger in the pack). Keep a strong, healed team — legendaries are not early-route content.</p>

    ${critical(
      "en",
      "<strong>Respect the level cap and bring coverage.</strong> Do not start legendary hunts under-healed or with a mono-type team. See <a href=\"Level_Cap.html\">Level cap</a> and <a href=\"Catching_and_Battling.html\">Catching &amp; battling</a>."
    )}

    <h2>Origin Fossil → Mew</h2>
    <ol class="steps">
      <li>Clear Kanto through <a href="Blue.html">Blue</a> (Champion).</li>
      <li>Open inventory (<kbd>E</kbd>) and search REI for <strong>Origin Fossil</strong>.</li>
      <li>Craft the fossil with the materials the recipe shows.</li>
      <li>Follow the pack’s Mew encounter / revive flow from there — the advancement “Catch Mew” completes when you own Mew.</li>
      <li>Shiny Mew is a separate optional advancement.</li>
    </ol>
    <p class="muted">A guided version of this path also lives in FTB Quests under <strong>Fossils and TM Lab</strong> — <a href="Quests.html">Quests</a>.</p>
    <div class="callout tip">
      <div class="label">REI is truth</div>
      Exact grids can change with pack updates. Always trust the in-game recipe view over screenshots.
    </div>

    <h2>Ancient DNA → Mewtwo</h2>
    <ol class="steps">
      <li>Progress late Kanto (Giovanni and beyond as needed).</li>
      <li>Search REI for <strong>Ancient DNA</strong> and related cloning items (e.g. <strong>Cloning Catalyst</strong>).</li>
      <li>Get Ancient DNA into your inventory — that ticks the pack advancement.</li>
      <li>Use the revive / cloning flow to bring back <strong>Mewtwo</strong>.</li>
      <li>Shiny Mewtwo revive is optional.</li>
    </ol>

    <h2>Legendary birds</h2>
    <p>Articuno, Zapdos, and Moltres each have catch advancements (plus optional shinies). The pack does not give fixed overworld coordinates on this wiki.</p>
    <ol class="steps">
      <li>Search each name in <a href="Spawn_Lookup.html">Spawn lookup</a> for biomes and spawn buckets.</li>
      <li>Travel prepared: balls, heals, status tools, and a claimed base with a waystone.</li>
      <li>Catch the legendary — the advancement toasts when criteria complete.</li>
    </ol>

    <h2>Checklist vs guide</h2>
    <table class="wikitable">
      <thead><tr><th>Want…</th><th>Go to</th></tr></thead>
      <tbody>
        <tr><td>Full toast list</td><td><a href="Achievements.html">Achievements</a></td></tr>
        <tr><td>Gym teams &amp; maps</td><td><a href="Gyms_Kanto.html">Kanto gyms</a> · <a href="Gym_Maps.html">Gym maps</a></td></tr>
        <tr><td>Where a species spawns</td><td><a href="Spawn_Lookup.html">Spawn lookup</a></td></tr>
        <tr><td>Calm pacing</td><td><a href="Roadmap.html">30-day roadmap</a></td></tr>
        <tr><td>Mega / Tera / Dynamax + Johto prep</td><td><a href="Mega_and_Late_Game.html">Mega &amp; late-game</a></td></tr>
      </tbody>
    </table>

    <p class="see-also"><strong>See also:</strong> <a href="Achievements.html">Achievements</a> · <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a> · <a href="Progression.html">Progression</a> · <a href="Blue.html">Blue</a> · <a href="Giovanni.html">Giovanni</a></p>
    ${navboxGyms()}
    ${navboxSystems()}
    `,
  });

  writePage("Poke_Balls.html", {
    title: "Poké Balls",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Poké Balls", href: "Poke_Balls.html" },
    ],
    lede: "How to harvest apricorns, craft balls, and keep a steady supply so you never run dry mid-route.",
    infobox: `<div class="infobox-title">Poké Ball crafting</div>
    <table>
      <tr><th>Basic ball</th><td>4 red apricorns + copper</td></tr>
      <tr><th>Great Ball</th><td>Red + blue apricorns + iron</td></tr>
      <tr><th>Ultra Ball</th><td>Black + yellow apricorns + gold</td></tr>
      <tr><th>Lookup</th><td>Inventory (<kbd>E</kbd>) → recipe search</td></tr>
      <tr><th>Farm tip</th><td>Plant apricorn seeds at your claim</td></tr>
    </table>`,
    body: `
    <h2>Why this matters</h2>
    <p>Running out of balls on a gym trip is one of the fastest ways to stall. Crafting is cheaper than panic-buying at every mart, and it teaches the pack’s item loop early.</p>

    ${figure(
      guideImg("pokeball-craft.png"),
      "<strong>Crafting a Poké Ball.</strong> Open inventory (<kbd>E</kbd>), search the recipe list for the ball name, then place apricorns + a metal core. Exact shapes can vary by ball type — always trust the recipe view.",
      "Crafting a Poké Ball in the inventory recipe UI"
    )}

    <h2>Step-by-step: first Poké Ball</h2>
    <ol class="steps">
      <li>Find an apricorn tree (coloured fruit on a small tree).</li>
      <li>Right-click / harvest the apricorns. Keep the seeds.</li>
      <li>Get a metal core: <strong>copper</strong> for basic Poké Balls, iron for Great, gold for Ultra.</li>
      <li>Open inventory (<kbd>E</kbd>). Use the side recipe search (REI) and type <em>poke ball</em>.</li>
      <li>Click the recipe so the grid outline shows, then place the items.</li>
      <li>Craft a stack before long trips — hotbar at least one stack of balls.</li>
    </ol>

    ${figure(
      guideImg("apricorns.png"),
      "<strong>Apricorn trees.</strong> Harvest the fruit, then plant seeds near your base for a renewable supply.",
      "Apricorn tree with red apricorns"
    )}

    <h2>Ball tiers (early game)</h2>
    <table class="wikitable">
      <thead><tr><th>Ball</th><th>Core</th><th>Apricorns (typical)</th><th>When to use</th></tr></thead>
      <tbody>
        <tr><td>Poké Ball</td><td>Copper</td><td>4× red</td><td>Common early catches</td></tr>
        <tr><td>Great Ball</td><td>Iron</td><td>Red + blue mix</td><td>Stronger wilds / gym routes</td></tr>
        <tr><td>Ultra Ball</td><td>Gold</td><td>Black + yellow mix</td><td>Hard catches, later routes</td></tr>
        <tr><td>Luxury Ball</td><td>Shop / later craft</td><td>—</td><td>Friendship / expensive buys (~4000$ in default shop)</td></tr>
      </tbody>
    </table>

    <div class="callout tip">
      <div class="label">Cosmetic colours</div>
      Other apricorn colours with copper often make differently coloured balls with the <em>same</em> base catch power. Use them for style; upgrade metal when you need better odds.
    </div>

    <h2>Apricorn farm setup</h2>
    <ol class="steps">
      <li>Claim a small plot next to your house.</li>
      <li>Plant every seed colour you find.</li>
      <li>Light the area so mobs do not hassle you at night.</li>
      <li>Harvest on a loop every play session before gym runs.</li>
    </ol>

    <h2>Buying vs crafting</h2>
    <p>Default shop prices on this pack include Poké Balls around <strong>${shopPrice("cobblemon:poke_ball") ?? 400}</strong>, Great <strong>${shopPrice("cobblemon:great_ball") ?? 750}</strong>, Ultra <strong>${shopPrice("cobblemon:ultra_ball") ?? 1000}</strong>, Luxury <strong>${shopPrice("cobblemon:luxury_ball") ?? 4000}</strong> PokéDollars.
    Crafting is usually better early; shops are for emergencies. See <a href="Economy.html">Economy</a>.</p>

    ${figure(
      guideImg("rei-crafting.png"),
      "<strong>Recipe workflow.</strong> If a guide screenshot differs slightly from your client skin/UI pack, the REI search result is always the source of truth.",
      "Example crafting UI from the handbook assets"
    )}

    <h2>Common mistakes</h2>
    <table class="wikitable">
      <thead><tr><th>Mistake</th><th>Fix</th></tr></thead>
      <tbody>
        <tr><td>Guessing the grid without REI</td><td>Search the ball name every time</td></tr>
        <tr><td>No copper/iron ready</td><td>Mine a little before long routes</td></tr>
        <tr><td>Throwing Ultra Balls at everything</td><td>Save them for tough targets</td></tr>
        <tr><td>Zero balls in hotbar</td><td>Keep a stack in slot 1–3</td></tr>
      </tbody>
    </table>

    <p class="see-also"><strong>See also:</strong> <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Recipe_Browser.html">Recipe browser</a> · <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Economy.html">Economy</a> · <a href="Quests.html">Quests</a> (Ball Workshop)</p>
    ${navboxSystems()}
    `,
  });

  writePage("Healing_and_Storage.html", {
    title: "Healing and storage",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Healing and storage", href: "Healing_and_Storage.html" },
    ],
    lede: "Keep your party alive between gyms, and never lose Pokémon because your team was full.",
    body: `
    ${figure(
      "../assets/guide-pokecenter.png",
      "<strong>Pokémon Center.</strong> Heal the whole party here (including fainted members). Loot nearby chests for early meds if present.",
      "Pokémon Center interior"
    )}

    <h2>When to heal</h2>
    <table class="wikitable">
      <thead><tr><th>Situation</th><th>Best fix</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Before a gym leader</td><td>Pokémon Center</td><td>Never walk in half-dead</td></tr>
        <tr><td>Fainted mid-route</td><td>Revive / Max Revive</td><td>Keep 2+ in the bag</td></tr>
        <tr><td>Low HP, still up</td><td>Potion / Oran Berry</td><td>Berries are free early</td></tr>
        <tr><td>Status (poison/burn/para)</td><td>Status heal items</td><td>Especially for Poison/Psychic gyms</td></tr>
      </tbody>
    </table>

    ${figure(
      "../assets/pokecenter.png",
      "<strong>Center layout example.</strong> Learn the desk / healer block in your pack UI; it is your reset button after tough trainers.",
      "Example Pokémon Center"
    )}

    <h2>PC storage</h2>
    <ol class="steps">
      <li>Type <code>/pc</code> in chat, or use a PC block.</li>
      <li>Move extras out of your party (max 6 on the field team).</li>
      <li>Keep a “gym box” of coverage types ready to swap.</li>
    </ol>
    <div class="callout tip">
      <div class="label">PC tip</div>
      <code>/pc</code> works on the go — still organise boxes so you are not scrolling forever before Brock.
    </div>

    <h2>Backpack &amp; chests</h2>
    <ul>
      <li>Use your backpack for balls, food, and heals on the road — tiers, upgrades, and keys: <a href="Sophisticated_Backpacks.html">Sophisticated Backpacks</a>.</li>
      <li>Store valuables in claimed chests at home.</li>
      <li>Village / center chests are fair game to loot on PokeHaven EU; loot may refresh later.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Claims.html">Claims</a> · <a href="Brock.html">Brock</a> · <a href="Poke_Balls.html">Poké Balls</a> · <a href="Sophisticated_Backpacks.html">Backpacks</a></p>
    ${navboxSystems()}
    `,
  });

  writePage("Outfits_and_Cosmetics.html", {
    title: "Outfits and cosmetics",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Outfits and cosmetics", href: "Outfits_and_Cosmetics.html" },
    ],
    lede: "Look the part on PokeHaven EU: craftable <strong>trainer outfits</strong> for you, plus <strong>Pokémon cosmetics</strong> (costumes, scarves, Furfrou cuts).",
    infobox: `<div class="infobox-title">Looks</div>
    <table>
      <tr><th>Trainer outfits</th><td>Poke Clothing mod</td></tr>
      <tr><th>Craft key</th><td>Cloth (wool + string)</td></tr>
      <tr><th>Equip</th><td>Armor slots (hat / shirt / pants)</td></tr>
      <tr><th>Pokémon looks</th><td>Cosmetic slot / special items</td></tr>
      <tr><th>Lookup</th><td>REI search (<kbd>E</kbd>)</td></tr>
    </table>`,
    body: `
    <div class="callout tip">
      <div class="label">Cosmetics ≠ battle items</div>
      Trainer outfits and Pokémon costumes are for looks. Do not confuse them with held items like Choice Scarf (those change battles).
    </div>

    <h2>Trainer outfits (you)</h2>
    <p>CobbleVerse includes <strong>Poke Clothing</strong>: craftable hats, shirts, and pants based on trainers and teams (Ash by region, Misty, Brock, Red, Dawn, Brendan, Team Rocket / Magma / Aqua, Jessie, James, and more).</p>
    <ol class="steps">
      <li>Open inventory (<kbd>E</kbd>) and search REI for <strong>Cloth</strong>.</li>
      <li>Craft Cloth from <strong>wool + string</strong> (exact grid in REI).</li>
      <li>Search the character name (e.g. <em>Ash</em>, <em>Misty</em>, <em>Rocket</em>) for hat / shirt / pants recipes.</li>
      <li>Craft the pieces you want.</li>
      <li>Equip them in your <strong>armor slots</strong> like normal gear — they are cosmetic clothing.</li>
    </ol>
    <div class="callout tip">
      <div class="label">Full set</div>
      Mix pieces if you want, or wear a matching set. Friends on the server can see your outfit.
    </div>

    <h2>Pokémon cosmetics</h2>
    <p>Many looks use a Pokémon’s <strong>cosmetic slot</strong> (separate from the held-item slot). Open the Pokémon summary / interact menu and look for the cosmetic slot, or use the special item below.</p>

    <h3>Cosplay Pikachu</h3>
    ${critical(
      "en",
      "<strong>Cosplay Pikachu cannot evolve into Raichu.</strong> Normal Pallet Pikachu can. Pick Cosplay only if you want the costumes — not a Raichu line."
    )}
    <ul>
      <li>Starter category <strong>Cosplay</strong> gives a costume Pikachu (Belle, Libre, PhD, Pop Star, Rock Star, etc.).</li>
      <li>Change costumes with a <strong>Pika Case</strong> (search REI / loot for it).</li>
      <li>Wild costume Pikachu are also Cosplay Pikachu.</li>
    </ul>

    <h3>Furfrou</h3>
    <ol class="steps">
      <li>Put a <strong>dye</strong> in Furfrou’s cosmetic slot (the cut/style you want).</li>
      <li>Use <strong>Shears</strong> on Furfrou to apply the trim.</li>
      <li>Try different dyes for other looks — check REI / tooltips if a dye does nothing.</li>
    </ol>

    <h3>Riolu &amp; Lucario</h3>
    <ul>
      <li><strong>Riolu:</strong> Red Scarf / Green Scarf cosmetic items (give / equip as cosmetics).</li>
      <li><strong>Lucario:</strong> <strong>Lucario Costume Box</strong> — right-click to cycle costumes.</li>
    </ul>

    <h3>Other looks</h3>
    <p>Some species have pack-specific cosmetics or forms. If an item mentions “cosmetic”, “costume”, “scarf”, or “case”, try it on that species. When unsure: search the Pokémon name in REI.</p>

    <h2>Quick FAQ</h2>
    <table class="wikitable">
      <thead><tr><th>Question</th><th>Answer</th></tr></thead>
      <tbody>
        <tr><td>Do outfits give armor stats?</td><td>Treat them as cosmetics — not a substitute for real armor in dangerous biomes.</td></tr>
        <tr><td>Can I wear outfits in gyms?</td><td>Yes. Looks do not replace type coverage.</td></tr>
        <tr><td>Where is Cloth?</td><td>REI → search <em>Cloth</em> (wool + string).</td></tr>
        <tr class="critical-row"><td>My Cosplay Pikachu will not evolve</td><td class="critical-cell">Expected — pick a normal Pikachu if you want Raichu.</td></tr>
      </tbody>
    </table>

    <p class="see-also"><strong>See also:</strong> <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Pack_Differences.html">Pack differences</a> · <a href="Getting_Started.html">Getting started</a></p>
    ${navboxSystems()}
    `,
  });

  writePage("Pokemon_Husbandry.html", {
    title: "Pokémon husbandry",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Pokémon husbandry", href: "Pokemon_Husbandry.html" },
    ],
    lede: "Shear, milk, brush, and bottle your Pokémon for wool, milk, string, honey, and more — plus leather from defeating livestock Pokémon on PokeHaven EU (vanilla animals are off).",
    infobox: `<div class="infobox-title">Husbandry</div>
  <table>
    <tr><th>System</th><td>Cobblemon interactions + defeat drops</td></tr>
    <tr><th>Tools</th><td>Shears, bucket, bottle, brush, bone meal</td></tr>
    <tr><th>Wool</th><td>Mareep / Wooloo / Dubwool</td></tr>
    <tr><th>Leather</th><td>Defeat livestock Pokémon (1–3)</td></tr>
    <tr><th>Vanilla animals</th><td>Disabled on this server</td></tr>
  </table>`,
    body: husbandryBodyEn({ navboxSystems, critical }),
  });

  writePage("Riding.html", {
    title: "Riding and flying",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Riding and flying", href: "Riding.html" },
    ],
    lede: "Mount a Pokémon to cross the map faster. Flyers open the sky; land mounts still beat walking every gym route.",
    body: `
    <h2>How to ride</h2>
    <ol class="steps">
      <li>Send out a rideable Pokémon with <kbd>R</kbd>.</li>
      <li>Hold <kbd>Shift</kbd> and right-click it → choose <strong>Ride</strong>.</li>
      <li>Move with WASD + mouse look. Dismount with <kbd>Caps Lock</kbd> or sneak (<kbd>R</kbd> is throw/recall).</li>
    </ol>
    <table class="wikitable">
      <thead><tr><th>Action</th><th>Default</th></tr></thead>
      <tbody>
        <tr><td>Send out / recall</td><td><kbd>R</kbd></td></tr>
        <tr><td>Open Pokémon interact menu</td><td><kbd>Shift</kbd> + right-click</td></tr>
        <tr><td>Dismount</td><td><kbd>Caps Lock</kbd> or sneak</td></tr>
      </tbody>
    </table>
    <div class="callout tip">
      <div class="label">Stamina</div>
      On PokeHaven EU, ride stamina is unlimited — you can stay mounted for long gym hikes.
    </div>

    <h2>Early mounts</h2>
    <ul>
      <li><strong>Early Kanto:</strong> any solid land mount beats walking — birds help once evolved (Pidgeot / Fearow lines).</li>
      <li><strong>Mid game:</strong> a flyer (Charizard, larger birds, later Dragonite-type mounts) for long map hops.</li>
      <li>You do <em>not</em> need a flyer before Brock or Misty — a land mount + waystones is enough.</li>
    </ul>

    <h2>Habits that save time</h2>
    <ul>
      <li>Pair riding with a <a href="Travel.html">waystone network</a> — ride out, teleport home.</li>
      <li>Land and heal before gym fights.</li>
      <li>Keep your mount safe near your base so death doesn’t strand you far from home.</li>
    </ul>

    <h2>Common mistakes</h2>
    <ul>
      <li>Sending out a non-rideable species and wondering why Ride is missing.</li>
      <li>Recalling the mount into the PC with no waystone nearby.</li>
      <li>Crashing into terrain / lava while flying at night — light the landing zone.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Travel.html">Travel</a> · <a href="First_Hours.html">First hours</a> · <a href="Gym_Maps.html">Gym maps</a></p>
    ${navboxSystems()}
    `,
  });

  writePage("Minecraft_Basics.html", {
    title: "Minecraft basics",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft basics", href: "Minecraft_Basics.html" },
    ],
    lede: "Short course for trainers who never played vanilla Minecraft — just enough to not get stuck crafting tools or farms.",
    body: `
    <h2>Tool progression</h2>
    <pre>Wood → Stone → Iron → Diamond → Netherite</pre>
    <p>Same shapes, better materials. A <strong>stone pickaxe</strong> is the minimum to reach copper/iron reliably.</p>

    <h2>Wheat → emeralds → PokéDollars</h2>
    ${figure(
      guideImg("farm-loop.png"),
      "<strong>Farm to cash.</strong> Grow wheat, trade a Farmer villager for emeralds, sell emeralds at the Bank.",
      "Wheat farm and villager trading"
    )}
    <h3>Farm setup example</h3>
    ${figure(
      guideImg("farm-setup-example.png"),
      "<strong>Farm setup example.</strong> Water channels between crop rows — click to enlarge.",
      "Top-down wheat farm setup example",
      { large: true, diagram: true }
    )}
    <ol class="steps">
      <li>Break grass until you get seeds.</li>
      <li>Craft a hoe; till dirt within 4 blocks of water (farmland).</li>
      <li>Do not trample crops by jumping on them.</li>
      <li>Harvest → trade with a Farmer → sell emeralds at the Bank.</li>
      <li>Buy balls/heals or craft them yourself.</li>
    </ol>

    <h2>Inventory &amp; recipes</h2>
    <ul>
      <li><kbd>E</kbd> opens inventory + recipe browser.</li>
      <li>Search item names instead of memorising grids.</li>
      <li>Hotbar (bottom 9 slots) = what you can use instantly.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Economy.html">Economy</a> · <a href="Poke_Balls.html">Poké Balls</a></p>
    ${navboxSystems()}
    `,
  });

  writePage("Roadmap.html", {
    title: "30-day roadmap",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "30-day roadmap", href: "Roadmap.html" },
    ],
    lede: "A calm pace through Kanto on PokeHaven EU. Adjust if you play more or less — the order matters more than the calendar.",
    body: `
    <h2>Day 1 checklist</h2>
    <ol class="steps">
      <li>Install CobbleVerse <strong>1.7.42</strong> and join <strong>PokeHaven EU</strong>.</li>
      <li>Starter (<kbd>C</kbd>) → bed → <strong>FTB Chunks claim</strong> (bed, chests, farm, waystone).</li>
      <li>Catch 2–3 nearby; craft the <strong>Brock map</strong> (Empty Map + Brock Map Key).</li>
      <li>Beat Brock → craft <strong>Misty’s map</strong> (Cerulean Star + Shears for seagrass).</li>
    </ol>
    <p>Details: <a href="First_Hours.html">First hours</a> · <a href="Brock.html">Brock</a> · <a href="Misty.html">Misty</a>.</p>

    <table class="wikitable">
      <thead><tr><th>Phase</th><th>Goals</th><th>Done when…</th></tr></thead>
      <tbody>
        <tr><td><strong>Day 1–2</strong></td><td>Install, claim, Brock, Misty map started</td><td>Boulder Badge + Cerulean Star craft done</td></tr>
        <tr><td><strong>Week 1</strong></td><td>Misty → Surge → Erika; iron gear; apricorn farm</td><td>4 badges, stable house</td></tr>
        <tr><td><strong>Week 2</strong></td><td>Finish Kanto gyms; money loop; waystone network</td><td>8 badges</td></tr>
        <tr><td><strong>Week 3–4</strong></td><td>Elite Four + Blue; prep Johto</td><td>Kanto clear, next region open</td></tr>
        <tr><td><strong>After Blue</strong></td><td>Johto card + optional post-game / Mega prep</td><td><a href="Mega_and_Late_Game.html">Late-game checklist</a> · <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Achievements.html">Achievements</a></td></tr>
      </tbody>
    </table>
    <div class="callout tip">
      <div class="label">Healthy session</div>
      Each login: 1 progress goal (gym/map/team) + 1 comfort goal (claim/waystone/farm).
    </div>
    <p class="see-also"><strong>See also:</strong> <a href="Progression.html">Progression</a> · <a href="Gyms_Kanto.html">Kanto gyms</a> · <a href="Achievements.html">Achievements</a></p>
    ${navboxGyms()}
    `,
  });

  writePage("Common_Mistakes.html", {
    title: "Common mistakes",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Common mistakes", href: "Common_Mistakes.html" },
    ],
    lede: "Fix these once and you skip most early frustration on PokeHaven EU.",
    body: `
    ${critical(
      "en",
      "These mistakes waste the most time. Red rows below are the ones players skip past and then ask about in Discord."
    )}
    <table class="wikitable">
      <thead><tr><th>Mistake</th><th>Result</th><th>Fix</th></tr></thead>
      <tbody>
        <tr class="critical-row"><td>Wrong pack version</td><td>Cannot join</td><td>Re-import shared 1.7.42 zip from Discord <code>#how-to-join</code></td></tr>
        <tr class="critical-row"><td>Old IP from a screenshot</td><td>Cannot connect</td><td>Copy live IP from Discord <code>#how-to-join</code> only</td></tr>
        <tr class="critical-row"><td>Ignoring level cap</td><td>“XP broken”</td><td><a href="Level_Cap.html">Beat next gym</a> — cap stays on</td></tr>
        <tr class="critical-row"><td>No claim</td><td>Items stolen</td><td><a href="Claims.html">FTB Chunks</a> only</td></tr>
        <tr class="critical-row"><td>Right-click Empty Map</td><td>Cannot craft gym map</td><td>Fresh Empty Map + <a href="Gym_Maps.html">region cartography table</a></td></tr>
        <tr class="critical-row"><td>Wrong region cartography table</td><td>Map won’t craft / wrong region</td><td>Kanto table for Kanto; Johto/Hoenn/Sinnoh tables later — <a href="Gym_Maps.html">Gym maps</a></td></tr>
        <tr class="critical-row"><td>Hand-breaking seagrass</td><td>0 Cerulean Star mats</td><td>Shears — <a href="Misty.html">Misty</a></td></tr>
        <tr class="critical-row"><td>Vanilla fishing rod only</td><td>Fish items, few/no Pokémon</td><td>Cobblemon rods — <a href="Fishing.html">Fishing</a></td></tr>
        <tr class="critical-row"><td>Unclaimed pasture / eggs</td><td>Shiny project stolen</td><td>Claim breed farm — <a href="Breeding.html">Breeding</a> · <a href="Shiny.html">Shiny</a></td></tr>
        <tr><td>Need staff help</td><td>—</td><td><a href="https://pokehaven.wiki">pokehaven.wiki</a> · Discord <code>#help</code> or <code>#tickets</code></td></tr>
        <tr><td>Buying only luxury shop gear</td><td>Broke</td><td>Craft balls; sell emeralds</td></tr>
        <tr><td>Palace / shiny before gyms</td><td>Slow progress</td><td>Gyms first — <a href="Brock.html">Brock</a> · <a href="Gyms_Kanto.html">Kanto</a></td></tr>
        <tr class="critical-row"><td>Wrong Pokémon selected</td><td>Wrong mon sent out</td><td>Arrow keys then <kbd>R</kbd></td></tr>
        <tr class="critical-row"><td>Cosplay Pikachu for Raichu</td><td>Never evolves</td><td>Normal Pallet Pikachu — <a href="Outfits_and_Cosmetics.html">Outfits</a></td></tr>
        <tr><td>“Close the world” after Blue</td><td>Confusion on multiplayer</td><td>PokeHaven champion book — Trainer Association → Johto; ask Discord if structures missing</td></tr>
      </tbody>
    </table>
    <p class="see-also"><strong>See also:</strong> <a href="FAQ.html">FAQ</a> · <a href="https://pokehaven.wiki">Player wiki</a> · <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a></p>
    ${navboxSystems()}
    `,
  });

  // Expand thinner existing pages by rewriting them with deep content
  writePage("Catching_and_Battling.html", {
    title: "Catching and battling",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Catching and battling", href: "Catching_and_Battling.html" },
    ],
    lede: "A full combat primer for PokeHaven EU: catching loops, wild aggro, healing mid-fight, and late gimmicks (Mega / Z / Tera / Dynamax).",
    infobox: `<div class="infobox-title">Combat rates</div>
    <table>
      <tr><th>Shiny rate</th><td>1 / ${shiny}</td></tr>
      <tr><th>XP multiplier</th><td>${xpMult}</td></tr>
      <tr><th>Max level</th><td>100</td></tr>
      <tr><th>Ride stamina</th><td>Infinite (pack)</td></tr>
      <tr><th>Related</th><td><a href="Poke_Balls.html">Poké Balls</a></td></tr>
    </table>`,
    body: `
    <div class="callout tip">
      <div class="label">Before Brock</div>
      Catch <strong>2–3 nearby Pokémon</strong> near spawn before the long hike. A tiny team + balls on the hotbar beats walking empty-handed — see <a href="First_Hours.html">First hours</a>.
    </div>

    <h2>The catch loop</h2>
    ${figure(
      "../assets/guide-catching.png",
      "<strong>Catching.</strong> Weaken the wild Pokémon first, watch catch UI hints, then throw. Keep balls on the hotbar.",
      "Catching a wild Pokémon"
    )}
    <ol class="steps">
      <li>Send a healthy Pokémon (<kbd>R</kbd>) — check selection with arrow keys.</li>
      <li>Lower HP with weaker moves; avoid KO if you want the catch.</li>
      <li>Status (sleep/para) helps when available.</li>
      <li>Throw the best ball you can afford for the situation.</li>
      <li>If it breaks free, chip more HP and retry — or flee and heal.</li>
    </ol>

    <h2>Fight or Flight (wild aggro)</h2>
    <p>Wild Pokémon can attack you. Higher-level wilds may aggro unprovoked; failed catches can provoke.
    Hostile wilds may not be catchable until you reset the encounter — heal, reposition, re-engage.</p>
    ${critical(
      "en",
      "<strong>Do not start a gym leader at 10% HP</strong> because a wild ambush drained you. Heal at a Center first."
    )}

    <h2>Type coverage checklist</h2>
    <ul>
      <li>Never run six of the same type into a gym.</li>
      <li>Keep one “answer” for the next leader in the PC.</li>
      <li>Use gym pages for exact teams — <a href="Brock.html">Brock</a>, <a href="Misty.html">Misty</a>, then the rest of <a href="Gyms_Kanto.html">Kanto</a>.</li>
      <li>Respect the <a href="Level_Cap.html">level cap</a> — grinding past it will not stick until the next gym falls.</li>
    </ul>

    <h2>Mega / Z / Tera / Dynamax</h2>
    <p>Mega Showdown is enabled. Dynamax needs a power spot (not anywhere). Full settings + after-Blue checklist:
    <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>. Learn one gimmick at a time — badges first.</p>

    <h2>Between fights</h2>
    <ul>
      <li><a href="Healing_and_Storage.html">Healing and storage</a></li>
      <li><a href="Poke_Balls.html">Craft more balls</a> before long hikes</li>
      <li>Bank extras in <code>/pc</code></li>
    </ul>
    ${navboxSystems()}
    `,
  });

  writePage("Claims.html", {
    title: "Claims",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Claims", href: "Claims.html" },
    ],
    lede: "If it is not claimed, it is not safe. Protect beds, chests, farms, and waystones with <strong>FTB Chunks</strong> on PokeHaven EU — do this in your first minutes.",
    infobox: `<div class="infobox-title">Claims</div>
    <table>
      <tr><th>System</th><td>FTB Chunks only</td></tr>
      <tr><th>Claim Manager</th><td><kbd>U</kbd></td></tr>
      <tr><th>Chunk map</th><td><kbd>[</kbd></td></tr>
      <tr><th>Max claim chunks</th><td>500</td></tr>
      <tr><th>Max force-load</th><td>25</td></tr>
      <tr><th>Must cover</th><td>Bed, chests, farm, waystone</td></tr>
      <tr><th>Share with friends</th><td><code>/ftbteams party create</code></td></tr>
      <tr><th>Avoid</th><td>Other claim mods (OPAC removed)</td></tr>
    </table>`,
    body: `
    ${critical(
      "en",
      "<strong>On PokeHaven EU, only FTB Chunks counts.</strong> Unclaimed chests are public loot. Open Parties and Claims (OPAC) has been removed from the pack."
    )}

    ${figure(
      guideImg("claims-ftb.png"),
      "<strong>Claiming land.</strong> Paint chunks around your base so others cannot break or loot your stuff.",
      "FTB Chunks claim map over a base"
    )}

    <h2>60-second walkthrough</h2>
    <ol class="steps">
      <li>Press <kbd>U</kbd> for the Claim Manager, or <kbd>[</kbd> for the FTB Chunks map.</li>
      <li>Claim the chunks under your bed, chests, farm, and waystone.</li>
      <li>Claim a 1-chunk buffer around the build.</li>
      <li>Playing with friends? Create an <strong>FTB Team</strong> and share the claim.</li>
    </ol>

    ${figure(
      guideImg("waystone.png"),
      "<strong>Claim the waystone too.</strong> Your home teleport is useless if someone griefs the block — keep bed, chests, farm, and waystone inside the same claim.",
      "Waystone at a claimed base"
    )}

    <h2>What to include</h2>
    <ul>
      <li>Bed + respawn area</li>
      <li>Chests / backpack dump</li>
      <li>Apricorn + wheat farms</li>
      <li>Waystone</li>
      <li>Pasture / breeders later — expand the claim when you build them</li>
    </ul>

    <h2>Team up: share a claim with friends</h2>
    <p>Every player starts on their own private "player team", so claims are personal by default. To build and claim together, form a <strong>party</strong> with FTB Teams:</p>
    <ol class="steps">
      <li>Open your inventory and click the <strong>My Team</strong> icon (top-left corner) — or use chat commands below.</li>
      <li><code>/ftbteams party create &lt;name&gt;</code> — creates the party; you become the owner.</li>
      <li><code>/ftbteams party invite &lt;player&gt;</code> — sends an invite. The invited player accepts via the chat prompt, or with <code>/ftbteams party join &lt;owner&gt;</code>.</li>
      <li>Everyone in the party now shares the same claim pool — any member can claim new chunks, and they belong to the <strong>party</strong>, not just to whoever painted them.</li>
    </ol>
    <p>By default, only party members (plus any allies you add) can build and interact inside the claim (the <strong>"allies"</strong> permission). From the FTB Chunks map screen the owner/officers can open a claim to <strong>public</strong>, or lock it down to <strong>private</strong> (owner only) instead.</p>
    <p>Leave a party with <code>/ftbteams party leave</code>. Hand off ownership first with <code>/ftbteams party transfer_ownership &lt;player&gt;</code> if you want a specific member to take over — otherwise the game auto-promotes another member.</p>

    <h2>Common mistakes</h2>
    <ul>
      <li>Building first, claiming later — loot walks away.</li>
      <li>Claiming the house but not the farm or waystone.</li>
      <li>Installing another claim mod next to FTB Chunks (OPAC was removed — do not add it back).</li>
      <li>Forgetting to expand the claim when the base grows.</li>
      <li>Building together without ever forming a party — claims stay locked to whoever placed them first.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="First_Hours.html">First hours</a> · <a href="Travel.html">Travel</a> · <a href="Common_Mistakes.html">Common mistakes</a> · <a href="FAQ.html">FAQ</a></p>
    ${navboxSystems()}
    `,
  });

  writePage("Economy.html", {
    title: "Economy",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Economy", href: "Economy.html" },
    ],
    lede: "PokéDollars fund balls, heals, and convenience. Battle and capture payouts come from <strong>Cobblemon Economy</strong>; shops and the Bank use CobbleDollars prices.",
    infobox: (() => {
      const ce = economy.cobblemonEconomy || {};
      return `<div class="infobox-title">Economy</div>
    <table>
      <tr><th>Currency</th><td>PokéDollars (CobbleDollars)</td></tr>
      <tr><th>Starting balance</th><td>${ce.startingBalance ?? 1000}</td></tr>
      <tr><th>Battle reward</th><td>${ce.battleVictoryReward ?? 50}$</td></tr>
      <tr><th>Capture reward</th><td>${ce.captureReward ?? 75}$ (shiny ×${ce.shinyMultiplier ?? 5}, legendary ×${ce.legendaryMultiplier ?? 10}…)</td></tr>
      <tr><th>Raid den reward</th><td>${ce.raidDenVictoryReward ?? 100}$</td></tr>
      <tr><th>Shop sections</th><td>${economy.shop.length}</td></tr>
      <tr><th>Bank entries</th><td>${economy.bank.length}</td></tr>
    </table>`;
    })(),
    body: (() => {
      const ce = economy.cobblemonEconomy || {};
      const start = ce.startingBalance ?? 1000;
      const battle = ce.battleVictoryReward ?? 50;
      const capture = ce.captureReward ?? 75;
      const raid = ce.raidDenVictoryReward ?? 100;
      const shinyM = ce.shinyMultiplier ?? 5;
      const radM = ce.radiantMultiplier ?? 6;
      const legM = ce.legendaryMultiplier ?? 10;
      const parM = ce.paradoxMultiplier ?? 3;
      return `
    <h2>How money actually works</h2>
    <p>There are no AFK jobs. You earn by playing:</p>
    <ul>
      <li><strong>Battles</strong> — <strong>${battle}$</strong> per victory (Cobblemon Economy)</li>
      <li><strong>Captures</strong> — <strong>${capture}$</strong> base; shiny ×${shinyM}, radiant ×${radM}, legendary ×${legM}, paradox ×${parM}</li>
      <li><strong>Raid dens</strong> — <strong>${raid}$</strong> plus tier rewards on <a href="Raids.html">Raids</a></li>
      <li><strong>Bank sells</strong> — emeralds, potions, vitamins, relic coins…</li>
      <li><strong>Bounty boards</strong> — village bounty boards</li>
    </ul>
    <p>Everyone starts with <strong>${start}$</strong>. Shops and Bank prices below are the live CobbleDollars tables.</p>

    ${figure(
      guideImg("farm-loop.png"),
      "<strong>Wheat farm.</strong> Grow wheat, trade Farmers for emeralds, sell at the Bank for PokéDollars. Pair with crafting (<a href='Poke_Balls.html'>Poké Balls</a>) so you are not shop-dependent.",
      "Wheat farm economy guide"
    )}

    <h2>Farm setup example</h2>
    <p>Top-down layout: rows of farmland with water channels so every crop stays hydrated. Build this at your claim, then expand sideways as you need more wheat.</p>
    ${figure(
      guideImg("farm-setup-example.png"),
      "<strong>Farm setup example.</strong> Alternating crop rows and water — click the image to enlarge.",
      "Top-down wheat farm setup example",
      { large: true, diagram: true }
    )}

    <h2>Best early loop</h2>
    <ol class="steps">
      <li>Make a small wheat farm at your claim.</li>
      <li>Trade a Farmer villager for emeralds.</li>
      <li>Sell emeralds at the Bank (default <strong>${economy.bank.find((i) => i.item === "minecraft:emerald")?.price ?? 400}$</strong> each on this pack).</li>
      <li>Craft balls when possible; buy only what you cannot craft yet.</li>
      <li>Do gym trainers for burst income while progressing.</li>
    </ol>

    ${critical(
      "en",
      "<strong>Do not buy expensive jewellery/TMs expecting to resell.</strong> Many shop items do not sell back at the Bank. Prefer saving Relic Coins over dumping them for pocket change."
    )}

    <h2>Default shop prices</h2>
    ${economy.shop
      .map((sec) => {
        const rows = sec.items
          .map(
            (i) =>
              `<tr><td>${i.label}</td><td><code>${i.item}</code></td><td>${i.price}</td></tr>`
          )
          .join("");
        return `<h3>${sec.section}</h3><table class="wikitable"><thead><tr><th>Item</th><th>ID</th><th>Price</th></tr></thead><tbody>${rows}</tbody></table>`;
      })
      .join("")}

    <h2>Bank sell prices</h2>
    <table class="wikitable">
      <thead><tr><th>Item</th><th>ID</th><th>Sell price</th></tr></thead>
      <tbody>
        ${economy.bank
          .map(
            (i) =>
              `<tr><td>${i.label}</td><td><code>${i.item}</code></td><td>${i.price}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
    ${navboxSystems()}
    `;
    })(),
  });

  writePage("First_Hours.html", {
    title: "First hours",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "First hours", href: "First_Hours.html" },
    ],
    lede: "Opening guide: claim, first catches, Brock — then the next loop to Misty so you know what to do after badge one.",
    body: `
    ${figure(
      guideImg("hud.png"),
      "<strong>Your HUD.</strong> Left: party (selected Pokémon highlighted). Top-right: minimap + coordinates. Bottom: hotbar — keep balls, food, and your Brock map once crafted.",
      "Example HUD"
    )}

    <h2>First-hour checklist</h2>
    <ol class="steps">
      <li>Press <kbd>C</kbd> → pick a starter. Grass is the safest into Brock.</li>
      <li>Place a bed and sleep once (respawn point).</li>
      <li><strong><a href="Claims.html">Claim now</a></strong> with <strong>FTB Chunks</strong> — press <kbd>U</kbd> (Claim Manager) or <kbd>[</kbd> (map) — bed, chests, farm, waystone. Unclaimed = public loot.</li>
      <li>Activate any spawn waystone (right-click). Skim the hotbar guidebook.</li>
      <li>Catch 2–3 nearby Pokémon; keep balls and heals on your hotbar.</li>
      <li>Craft the <strong>Brock map</strong>: place <strong>Kanto Cartography Table</strong> → put <strong>Empty Map + Brock Map Key</strong> in it (do <strong>not</strong> open the Empty Map in the world) → follow the map. Full fight guide: <a href="Brock.html">Brock</a>.</li>
      <li>Remember the <a href="Level_Cap.html">level cap</a> stays on until you beat the next gym — intentional on PokeHaven EU.</li>
      <li>Stuck? Screenshot + Discord <code>#help</code>, or keep reading this wiki.</li>
    </ol>

    <h2>Controls you will use constantly</h2>
    <table class="wikitable">
      <thead><tr><th>Action</th><th>Key</th><th>Why it matters</th></tr></thead>
      <tbody>
        <tr><td>Party / starter</td><td><kbd>C</kbd></td><td>Pick starter and manage team</td></tr>
        <tr><td>Select send-out</td><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Stops “wrong Pokémon” mistakes</td></tr>
        <tr><td>Throw / recall</td><td><kbd>R</kbd></td><td>Send out the selected Pokémon</td></tr>
        <tr><td>Start battle</td><td><kbd>G</kbd></td><td>Fight or Flight — start a fight</td></tr>
        <tr><td>Quest book</td><td><kbd>O</kbd></td><td><a href="Quests.html">FTB Quests</a> — First Steps plus side chapters (Ball Workshop, Fishing Grounds, Trade Hall…). Pin a quest and it shows in a small tracker near the bottom-right HUD (by the minimap/coordinates) — no floating in-world arrow.</td></tr>
        <tr><td>Claim Manager</td><td><kbd>U</kbd></td><td>FTB Chunks claims — <a href="Claims.html">Claims</a></td></tr>
        <tr><td>Chunk map</td><td><kbd>[</kbd></td><td>FTB Chunks map</td></tr>
        <tr><td>Chat</td><td><kbd>T</kbd></td><td>Text chat</td></tr>
        <tr><td>Voice chat</td><td><kbd>V</kbd></td><td>Menu — mute <kbd>Right Alt</kbd>, group has no default key (<kbd>B</kbd> opens your Backpack)</td></tr>
        <tr><td>Dismount</td><td><kbd>Caps Lock</kbd></td><td>Get off your mount</td></tr>
        <tr><td>Ride</td><td><kbd>Shift</kbd> + right-click</td><td>See <a href="Riding.html">Riding</a></td></tr>
        <tr><td>PC</td><td><code>/pc</code></td><td><a href="Healing_and_Storage.html">Storage</a></td></tr>
      </tbody>
    </table>

    ${critical(
      "en",
      "Dragging Bulbasaur to slot 1 is not enough if another Pokémon is still <strong>selected</strong>. Highlight it with the arrow keys, then <kbd>R</kbd>."
    )}

    ${figure(
      guideImg("catching.png"),
      "<strong>First catches.</strong> Spend the first session building a tiny team near spawn before you hike to Brock. Weakened wilds + a hotbar of balls beat wandering empty-handed.",
      "Catching a wild Pokémon near spawn"
    )}

    <h2>Done with hour one?</h2>
    <ul>
      <li><strong>Yes:</strong> starter + 2–3 catches, food, bed, claim, stone tools, map on hotbar, a few crafted balls.</li>
      <li><strong>Not yet:</strong> mega base, Nether loot runs, legendary hunting, luxury shopping sprees.</li>
    </ul>

    <h2>What's next after Brock</h2>
    <ol class="steps">
      <li>Win Brock → badge → your <a href="Level_Cap.html">level cap</a> rises (check Trainer Card).</li>
      <li>Heal / restock at base. Keep your claim updated.</li>
      <li>Craft <strong>Misty’s map</strong>: REI → <strong>Cerulean Star</strong> (seagrass needs <strong>Shears</strong>) + fresh <strong>Empty Map</strong> in the <strong>Kanto Cartography Table</strong>. Do <strong>not</strong> open the Empty Map in the world first.</li>
      <li>Bring Electric/Grass coverage for Water. Cap while Misty is next is roughly the low–mid 30s — see <a href="Level_Cap.html">Level cap</a>.</li>
      <li>Follow the map, activate waystones on the road, beat Misty → then <a href="Lt._Surge.html">Lt. Surge</a>.</li>
    </ol>
    <p>Full fights: <a href="Brock.html">Brock</a> · <a href="Misty.html">Misty</a> · map system: <a href="Gym_Maps.html">Gym maps</a>.</p>

    <p class="see-also"><strong>Next:</strong> <a href="Brock.html">Brock</a> · <a href="Misty.html">Misty</a> · <a href="Gym_Maps.html">Gym maps</a> · <a href="Roadmap.html">30-day roadmap</a></p>
    `,
  });

  // ——— Raids (overrides short stub from build.js) ———
  if (raids?.tiers?.length) {
    const pct = (n) => `${Math.round(Number(n) * 100)}%`;
    const weights = (raids.common.tierWeights || []).map((w, i) => `T${i + 1}: ${w}`).join(" · ");
    const tierRows = raids.tiers
      .map(
        (t) => `<tr>
      <td><strong>T${t.tier}</strong></td>
      <td>${t.bossLevel ?? "—"}</td>
      <td>${t.maxPlayers ?? "—"}</td>
      <td>${t.ivs ?? "—"}</td>
      <td>${t.currency ?? "—"}</td>
      <td>${t.hpMultiplier ?? "—"}×</td>
      <td>${pct(t.requiredDamage ?? 0)}</td>
      <td>${pct(t.haRate ?? 0)}</td>
      <td>${t.ai ?? "—"}</td>
      <td>${t.maxClears ?? "—"}</td>
    </tr>`
      )
      .join("");
    const resetHours = Math.round((raids.common.resetTime || 0) / 3600);
    writePage("Raids.html", {
      title: "Raids",
      breadcrumbs: [
        { label: "Main Page", href: "../index.html" },
        { label: "Raids", href: "Raids.html" },
      ],
      lede: "Raid dens are crystal fights in the overworld. Bring heals, type coverage, and friends for higher tiers — wipe early and you waste time and items.",
      infobox: `<div class="infobox-title">Raid dens</div>
    <table>
      <tr><th>Where</th><td>Overworld crystals</td></tr>
      <tr><th>Spawn chance</th><td>1 / ${raids.common.spawnRate}</td></tr>
      <tr><th>Reset</th><td>~${resetHours}h game time (${raids.common.resetTime}s)</td></tr>
      <tr><th>Cycle</th><td>${raids.common.cycleMode}</td></tr>
      <tr><th>Rewards</th><td>${raids.common.rewardDistribution} (contribute)</td></tr>
      <tr><th>Retry fails</th><td>${raids.common.retryFailed ? "Yes" : "No"}</td></tr>
      <tr><th>Shard energy</th><td>${raids.common.requiredEnergy}</td></tr>
      <tr><th>Boss index</th><td><a href="Raid_Bosses.html">${raids.bosses.length} bosses</a></td></tr>
      <tr><th>Tier weights</th><td>${weights}</td></tr>
    </table>`,
      body: `
    <h2>When to raid</h2>
    <p>Start with <strong>T1–T3</strong> once you have a stable party, Revives, and spare balls. Treat dens as bonus money and rare loot — not a skip for gyms. Hold <strong>T5+</strong> until your <a href="Level_Cap.html">level cap</a> and coverage can tank a long fight.</p>
    <div class="callout tip">
      <div class="label">Check the boss first</div>
      Open <a href="Raid_Bosses.html">Raid bosses</a>, search the species, and bring answers for its moves. Six of the same mon loses more dens than a mixed team.
    </div>

    <h2>How a den works</h2>
    <ol class="steps">
      <li>Explore the overworld until you find a <strong>raid den crystal</strong>.</li>
      <li>Heal up, set a <a href="Travel.html">waystone</a> or Xaero pin nearby if you’ll return.</li>
      <li>Start the raid — keep heals ready. Parties: use <a href="Voice_Chat.html">voice chat</a>.</li>
      <li>Deal damage. Rewards use <strong>${raids.common.rewardDistribution}</strong> distribution — contribute or you may miss the cut.</li>
      <li>After clears / the timer, the den resets and can cycle boss and tier.</li>
    </ol>

    <h2>Prep checklist</h2>
    <ul>
      <li>Full team healed + Revives / healing items in hotbar</li>
      <li>Type coverage for the boss (and its STAB moves)</li>
      <li>Level-appropriate mons — don’t bring a T2 team into T6</li>
      <li>Friends for tiers with higher max players (see table)</li>
      <li>Shard energy ready (${raids.common.requiredEnergy} required)</li>
    </ul>

    <h2>Rewards &amp; damage share</h2>
    <p>Loot and payout scale with how much you help. Each tier has a <strong>minimum damage share</strong> (roughly 16–20%) — sit AFK and you can fail the reward check even if the group wins. Money in the table is the tier’s currency reward; higher tiers also hit harder (HP multiplier) and roll better IVs on the catch / rewards side.</p>
    <ul>
      <li><strong>Hidden Ability rate:</strong> ${pct(raids.tiers[0]?.haRate ?? 0.2)} on every tier</li>
      <li><strong>Max clears</strong> per den before it rotates: ${raids.tiers[0]?.maxClears ?? "—"}</li>
      <li><strong>Failed raids:</strong> can be retried (${raids.common.retryFailed ? "yes" : "no"})</li>
      <li><strong>T6–T7 AI:</strong> STRONG — expect smarter play than early dens</li>
    </ul>

    <h2>Party size</h2>
    <p>T1 is solo. T2–T3 allow small groups. From <strong>T4 upward</strong> you can bring up to <strong>four</strong> players — use that for T5–T7. Call roles in voice: someone chips for the damage threshold, someone walls, someone covers types.</p>

    <h2>Tier table</h2>
    <p>Higher <em>tier weight</em> = more common when dens roll a tier. On PokeHaven, mid tiers (especially T4) show up more than T6/T7.</p>
    <table class="wikitable">
      <thead><tr>
        <th>Tier</th><th>Boss lv</th><th>Max players</th><th>IVs</th><th>$</th><th>HP ×</th><th>Min damage</th><th>HA</th><th>AI</th><th>Max clears</th>
      </tr></thead>
      <tbody>${tierRows}</tbody>
    </table>
    <p class="muted">Tier weights: ${weights}</p>

    <h2>Finding dens again</h2>
    <ol class="steps">
      <li>Pin the crystal on <strong>Xaero’s World Map</strong> the moment you find it.</li>
      <li>Drop a named waystone nearby if the den is worth farming after reset.</li>
      <li>After ~${resetHours} hours of game time, check again — boss/tier can change.</li>
    </ol>

    <h2>Common mistakes</h2>
    <ul>
      <li>Starting T5+ under the level cap with no Revives</li>
      <li>Ignoring the damage share and getting no reward</li>
      <li>Bringing one type into a boss that walls it</li>
      <li>Not pinning the den — then losing it in the meadow forever</li>
      <li>Raiding instead of gyms when your progression is stuck on the <a href="Level_Cap.html">level cap</a></li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Raid_Bosses.html">Raid bosses</a> · <a href="Economy.html">Economy</a> · <a href="Voice_Chat.html">Voice chat</a> · <a href="Travel.html">Travel</a> · <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Healing_and_Storage.html">Healing &amp; storage</a> · <a href="Quests.html">Quests</a> (Raid Circuit)</p>
    ${navboxSystems()}
    `,
    });
  }

  writePage("Travel.html", {
    title: "Travel",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Travel", href: "Travel.html" },
    ],
    lede: "Waystones are free fast-travel on PokeHaven EU. Add a <a href=\"Hearthstone.html\">Hearthstone</a> for a 15-minute home warp, plus gym maps, Xaero pins, and a mount.",
    body: `
    ${figure(
      "../assets/waystone.png",
      "<strong>Waystone.</strong> Right-click to activate. Shift + right-click to rename. Build a network: Spawn, Home, each gym stop.",
      "Waystone teleport block"
    )}
    <h2>Hearthstone (home item)</h2>
    <p>Craftable stone that channels you home after <strong>10s</strong>, then <strong>15 min</strong> cooldown. Cobble + diamonds + ender pearl on PokeHaven — full guide: <a href="Hearthstone.html">Hearthstone</a>.</p>

    <h2>Day-one setup</h2>
    <ol class="steps">
      <li>Activate the <strong>spawn</strong> waystone as soon as you load in.</li>
      <li>Place and activate one at your <a href="Claims.html">claimed</a> base (next to bed + chests).</li>
      <li>After every gym (or long hike), activate a stone nearby — or place one if you brought extras.</li>
      <li>Rename clearly: <em>Home</em>, <em>Brock</em>, <em>Misty</em>, <em>Raid dens</em>, etc.</li>
    </ol>
    <div class="callout tip">
      <div class="label">Free network</div>
      On this server, waystones have <strong>no teleport cost</strong> and no cooldown. Use them often.
    </div>

    <h2>Waystones vs pins vs gym maps</h2>
    <table class="wikitable">
      <thead><tr><th>System</th><th>What it does</th><th>Teleports?</th></tr></thead>
      <tbody>
        <tr><td>Waystone</td><td>World block — you (and others who activate it) can warp there</td><td>Yes (free)</td></tr>
        <tr><td>Hearthstone</td><td>Item linked to your home</td><td>Yes (15 min CD)</td></tr>
        <tr><td>Xaero pin</td><td>Personal map marker</td><td>No</td></tr>
        <tr><td>Gym map</td><td>Finished map item with coordinates for a leader</td><td>No — navigation only</td></tr>
      </tbody>
    </table>

    <h2>Gym-route habit</h2>
    <ol class="steps">
      <li>Craft the leader’s map on the right cartography table — <a href="Gym_Maps.html">Gym maps</a>.</li>
      <li>Pin the coordinates in Xaero if you like a trail on the minimap.</li>
      <li>Ride or walk out (<a href="Riding.html">Riding</a>), fight, then waystone home to heal and restock.</li>
      <li>Leave a named waystone near the gym if you’ll return for rematches, shops, or friends.</li>
    </ol>

    <h2>BlueMap (browser map)</h2>
    <p>Live world overview in your browser:</p>
    <p><a href="http://88.211.214.163:8100" rel="noopener noreferrer" target="_blank"><strong>http://88.211.214.163:8100</strong></a></p>
    <p>Handy for orientation, bases, and sharing coordinates.</p>
    <div class="callout tip">
      <div class="label">What BlueMap shows</div>
      Currently BlueMap only plots <strong>online player markers</strong> — it does not show Pokémon spawns, dens, or other mobs. Use <a href="Spawn_Lookup.html">Spawn lookup</a> for species/biome data instead.
    </div>

    <h2>Other travel tools</h2>
    <ul>
      <li><strong><a href="Hearthstone.html">Hearthstone</a></strong> — portable home warp (15 min cooldown).</li>
      <li><strong>Nature’s Compass / Explorer’s Compass</strong> — find biomes or structures when maps aren’t enough.</li>
      <li><strong>Xaero’s World Map</strong> — zoom out, pin dens, mark caves, share coords in chat.</li>
      <li><strong>Bed + waystone at home</strong> — quick respawn and return.</li>
    </ul>

    <h2>Region exploration pins</h2>
    <p>Each region's <strong>Exploration</strong> quest chapter expects consistent waystone names so BlueMap and the quest book line up for everyone. See <a href="Region_Exploration.html">Region exploration</a> for the exact naming scheme per region.</p>

    <h2>Etiquette</h2>
    <ul>
      <li>Don’t break or grief someone else’s waystone network.</li>
      <li>Public / shared stones: activate them; don’t rename stones others rely on.</li>
      <li>Ask before planting a stone deep inside another player’s claim.</li>
    </ul>

    <h2>Common mistakes</h2>
    <ul>
      <li>Walking past a stone without activating it — it won’t appear in your list.</li>
      <li>Only pinning Xaero and wondering why you can’t teleport.</li>
      <li>Opening an Empty Map in the world before gym crafting — ruins that map for the cartography recipe.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Hearthstone.html">Hearthstone</a> · <a href="Riding.html">Riding</a> · <a href="Gym_Maps.html">Gym maps</a> · <a href="Claims.html">Claims</a> · <a href="First_Hours.html">First hours</a> · <a href="Region_Exploration.html">Region exploration</a></p>
    ${navboxSystems()}
    `,
  });

  writePage("Hearthstone.html", {
    title: "Hearthstone",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Hearthstone", href: "Hearthstone.html" },
    ],
    lede: "Portable home teleport on PokeHaven EU — <strong>10s</strong> channel, <strong>15 min</strong> cooldown, cobble craft recipe.",
    infobox: `<div class="infobox-title">Hearthstone</div>
    <table>
      <tr><th>Mod</th><td>HearthstoneMod</td></tr>
      <tr><th>Channel</th><td>10 seconds</td></tr>
      <tr><th>Cooldown</th><td>15 minutes</td></tr>
      <tr><th>Craft</th><td>Cobble + diamonds + ender pearl</td></tr>
      <tr><th>Cross-dimension</th><td>Yes</td></tr>
    </table>`,
    body: hearthstoneBodyEn({ navboxSystems }),
  });

  writePage("Getting_Started.html", {
    title: "Getting started",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Getting started", href: "Getting_Started.html" },
    ],
    lede: "Install the <strong>PokeHaven EU Client 1.7.42</strong>, join the server, and know the words the rest of the wiki uses.",
    body: `
    <h2>Requirements</h2>
    <ul>
      <li>Minecraft <strong>Java Edition</strong> (Microsoft account)</li>
      <li><strong>CurseForge</strong> app</li>
      <li>Our <strong>PokeHaven EU Client 1.7.42</strong> zip from Discord <code>#how-to-join</code> (CobbleVerse + PokeHaven menus/splash)</li>
    </ul>

    ${figure(
      guideImg("multiplayer-join.png"),
      "<strong>Ready to play.</strong> After import, launch to the PokeHaven-branded menu, then add <code>PokeHaven EU</code> in Multiplayer. The IP rotates — always copy it from Discord, never from old screenshots.",
      "PokeHaven client ready for multiplayer"
    )}

    <h2>Install walkthrough</h2>
    <ol class="steps">
      <li>Install CurseForge and sign in.</li>
      <li>Create Custom Profile → <strong>Import</strong> <code>PokeHaven-EU-Client-1.7.42.zip</code>.</li>
      <li>Wait until every mod finishes — do not cancel mid-download.</li>
      <li>Launch once to the main menu (PokeHaven branding), quit, launch again if packs look unfinished.</li>
      <li>Multiplayer → Add Server:<br/>
        Name: <code>PokeHaven EU</code><br/>
        Address: IP from <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a> <code>#how-to-join</code>.</li>
    </ol>

    <div class="callout tip">
      <div class="label">Join checklist</div>
      Server name: <strong>PokeHaven EU</strong>. Pack: <strong>PokeHaven EU Client 1.7.42</strong>. IP only from <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a> (it can rotate).
    </div>

    ${critical(
      "en",
      "<strong>Can't join?</strong> Almost always a pack mismatch. Re-import <strong>PokeHaven EU Client 1.7.42</strong>. Copy the IP from Discord — never from old screenshots. See <a href=\"Common_Mistakes.html\">Common mistakes</a>."
    )}

    ${figure(
      guideImg("rei-crafting.png"),
      "<strong>Learn REI on day one.</strong> Open inventory (<kbd>E</kbd>) and use the side recipe search for every craft. The wiki shows the workflow; REI shows the live grid.",
      "Recipe search open in inventory"
    )}

    <h2>Glossary</h2>
    <table class="wikitable">
      <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
      <tbody>
        <tr><td>PokeHaven EU</td><td>Our multiplayer server</td></tr>
        <tr><td>CobbleVerse</td><td>The modpack you install</td></tr>
        <tr><td>Level cap</td><td>Levels freeze until the next gym falls</td></tr>
        <tr><td>Claim</td><td>Protect land with FTB Chunks only</td></tr>
        <tr><td>Waystone</td><td>Teleport stone</td></tr>
        <tr><td>Empty Map</td><td>Fresh map for gym crafting — never open it in the world first</td></tr>
        <tr><td>Cartography table</td><td>Region table (Kanto / Johto / …) that finishes gym maps with coordinates</td></tr>
        <tr><td>Cerulean Star</td><td>Misty’s map item (seagrass needs Shears)</td></tr>
        <tr><td>PokéDollars</td><td>Server money (CobbleDollars mod) — shops &amp; bank</td></tr>
        <tr><td>Ticket</td><td>Private Discord support channel via <code>#tickets</code></td></tr>
        <tr><td>Recipe list / REI</td><td>Search crafts with inventory open (<kbd>E</kbd>)</td></tr>
        <tr><td>Outfits</td><td>Craftable trainer clothes — see <a href="Outfits_and_Cosmetics.html">Outfits and cosmetics</a></td></tr>
      </tbody>
    </table>

    <h2>Need help?</h2>
    <p><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a> — pack zip, live IP, and support. Send a screenshot + what you already tried.</p>
    <ul>
      <li><code>#help</code> — quick public questions</li>
      <li><code>#tickets</code> — private help, reports, appeals</li>
    </ul>

    <h2>What to read next</h2>
    <ol>
      <li><a href="First_Hours.html">First hours</a></li>
      <li><a href="Poke_Balls.html">Poké Balls</a> (crafting screenshots)</li>
      <li><a href="Brock.html">Brock</a> → <a href="Misty.html">Misty</a></li>
      <li><a href="Level_Cap.html">Level cap</a></li>
    </ol>
    ${navboxSystems()}
    `,
  });

  // index.html's final, live version is written later in build.js (after this
  // function returns) — that later call is the one that actually ships.
}
