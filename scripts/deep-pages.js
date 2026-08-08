/** Extra deep guide pages + content expansions for PokeHaven wiki */

import { DISCORD_INVITE, critical } from "./i18n.js";
import { advancementTableRows, groupTitle } from "./advancement-copy.js";

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
}) {
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

    <p class="see-also"><strong>See also:</strong> <a href="Progression.html">Progression</a> · <a href="Roadmap.html">30-day roadmap</a> · <a href="Level_Cap.html">Level cap</a> · <a href="FAQ.html">FAQ</a></p>
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
      <li>Search each name in <a href="Spawn_Lookup.html">Spawn lookup</a> for biomes / buckets from pack data.</li>
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
      </tbody>
    </table>

    <p class="see-also"><strong>See also:</strong> <a href="Achievements.html">Achievements</a> · <a href="Progression.html">Progression</a> · <a href="Blue.html">Blue</a> · <a href="Giovanni.html">Giovanni</a></p>
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
    <p>Default shop prices on this pack include Poké Balls around <strong>400</strong>, Great <strong>750</strong>, Ultra <strong>1000</strong>, Luxury <strong>4000</strong> PokéDollars.
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

    <p class="see-also"><strong>See also:</strong> <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Recipe_Browser.html">Recipe browser</a> · <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Economy.html">Economy</a></p>
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
      <li>Use your backpack for balls, food, and heals on the road.</li>
      <li>Store valuables in claimed chests at home.</li>
      <li>Village / center chests are fair game to loot on PokeHaven EU; loot may refresh later.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Claims.html">Claims</a> · <a href="Brock.html">Brock</a> · <a href="Poke_Balls.html">Poké Balls</a></p>
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

  writePage("Riding.html", {
    title: "Riding and flying",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Riding and flying", href: "Riding.html" },
    ],
    lede: "Mount Pokémon to cross the map faster. Flying types can take you airborne; land mounts still save huge walk time.",
    body: `
    <h2>How to ride</h2>
    <ol class="steps">
      <li>Send out a rideable Pokémon with <kbd>R</kbd>.</li>
      <li>Hold <kbd>Shift</kbd> and right-click it → choose <strong>Ride</strong>.</li>
      <li>Move with WASD + mouse. Dismount with <kbd>R</kbd> or sneak.</li>
    </ol>
    <div class="callout tip">
      <div class="label">Stamina</div>
      This pack config uses infinite ride stamina — explore freely without dismounting every minute.
    </div>

    <h2>Early mounts</h2>
    <ul>
      <li>Bird lines such as Pidgeot / Fearow once evolved</li>
      <li>Later: Charizard, Dragonite, and other flyers</li>
      <li>Land mounts are fine for Brock/Misty routes if you lack flyers</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Travel.html">Travel</a> · <a href="First_Hours.html">First hours</a></p>
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
    <table class="wikitable">
      <thead><tr><th>Phase</th><th>Goals</th><th>Done when…</th></tr></thead>
      <tbody>
        <tr><td><strong>Day 1–2</strong></td><td>Install, starter, bed, claim, Brock</td><td>Boulder Badge + Misty map started</td></tr>
        <tr><td><strong>Week 1</strong></td><td>Misty → Surge → Erika; iron gear; apricorn farm</td><td>4 badges, stable house</td></tr>
        <tr><td><strong>Week 2</strong></td><td>Finish Kanto gyms; money loop; waystone network</td><td>8 badges</td></tr>
        <tr><td><strong>Week 3–4</strong></td><td>Elite Four + Blue; prep Johto</td><td>Kanto clear, next region open</td></tr>
        <tr><td><strong>After Blue</strong></td><td>Optional post-game: fossils, birds, Mewtwo</td><td><a href="Postgame_and_Legendaries.html">Post-game guide</a> + <a href="Achievements.html">Achievements</a></td></tr>
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
        <tr class="critical-row"><td>No claim / wrong claim mod</td><td>Items stolen</td><td><a href="Claims.html">FTB Chunks</a> only (not Open Parties)</td></tr>
        <tr class="critical-row"><td>Right-click Empty Map</td><td>Cannot craft gym map</td><td>Fresh Empty Map + <a href="Gym_Maps.html">region cartography table</a></td></tr>
        <tr class="critical-row"><td>Wrong region cartography table</td><td>Map won’t craft / wrong region</td><td>Kanto table for Kanto; Johto/Hoenn/Sinnoh tables later — <a href="Gym_Maps.html">Gym maps</a></td></tr>
        <tr class="critical-row"><td>Hand-breaking seagrass</td><td>0 Cerulean Star mats</td><td>Shears — <a href="Misty.html">Misty</a></td></tr>
        <tr class="critical-row"><td>Vanilla fishing rod only</td><td>Fish items, few/no Pokémon</td><td>Cobblemon rods — <a href="Fishing.html">Fishing</a></td></tr>
        <tr class="critical-row"><td>Unclaimed pasture / eggs</td><td>Shiny project stolen</td><td>Claim breed farm — <a href="Breeding.html">Breeding</a> · <a href="Shiny.html">Shiny</a></td></tr>
        <tr><td>Never open the wiki</td><td>Repeat Discord tickets</td><td><a href="https://pokehaven.wiki">pokehaven.wiki</a> (EN/NL) · Discord <code>#pokehaven-wiki</code></td></tr>
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
    <p>Mega Showdown is enabled: Mega Evolution, Z-Moves, Terastallization, and Dynamax are part of the pack.
    Dynamax usually needs a power spot. Learn one gimmick at a time — gym badges matter more than shiny Dynamax flexes in week one.</p>

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
      <tr><th>Open map</th><td>Esc → Options → Controls → search <em>FTB</em> / <em>Chunks</em></td></tr>
      <tr><th>Must cover</th><td>Bed, chests, farm, waystone</td></tr>
      <tr><th>Avoid</th><td>Open Parties and Claims on the same base</td></tr>
    </table>`,
    body: `
    ${critical(
      "en",
      "<strong>Claim before you leave valuables.</strong> Unclaimed chests are public loot. Use <strong>FTB Chunks only</strong> — the pack also has Open Parties and Claims; mixing both on one base gets messy."
    )}

    ${figure(
      guideImg("claims-ftb.png"),
      "<strong>Claiming land.</strong> Paint chunks around your base so others cannot break or loot your stuff.",
      "FTB Chunks claim map over a base"
    )}

    <h2>60-second walkthrough</h2>
    <ol class="steps">
      <li>Esc → Options → Controls → search <em>FTB</em> or <em>Chunks</em> → bind / open the claim map.</li>
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

    <h2>Common mistakes</h2>
    <ul>
      <li>Building first, claiming later — loot walks away.</li>
      <li>Claiming the house but not the farm or waystone.</li>
      <li>Using Open Parties and Claims instead of (or on top of) FTB Chunks.</li>
      <li>Forgetting to expand the claim when the base grows.</li>
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
    lede: "PokéDollars fund balls, heals, and convenience. On this pack you earn from battles at <strong>×" +
      String(economy.incomeMultiplier) +
      "</strong> — so smart selling matters.",
    infobox: `<div class="infobox-title">Economy</div>
    <table>
      <tr><th>Currency</th><td>PokéDollars</td></tr>
      <tr><th>Income multiplier</th><td>${economy.incomeMultiplier}</td></tr>
      <tr><th>Wild payouts</th><td>${economy.earnFromWild ? "Yes" : "No"}</td></tr>
      <tr><th>Trainer payouts</th><td>${economy.earnFromNpc ? "Yes" : "No"}</td></tr>
      <tr><th>Shop sections</th><td>${economy.shop.length}</td></tr>
      <tr><th>Bank entries</th><td>${economy.bank.length}</td></tr>
    </table>`,
    body: `
    <h2>How money actually works</h2>
    <p>There are no AFK jobs. You earn by playing: wild fights, trainers/gyms, bounty boards, and selling items at the Bank.</p>

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
      <li>Sell emeralds at the Bank (default <strong>400$</strong> each on this pack).</li>
      <li>Craft balls when possible; buy only what you cannot craft yet.</li>
      <li>Do gym trainers for burst income while progressing.</li>
    </ol>

    ${critical(
      "en",
      "<strong>Do not buy expensive jewellery/TMs expecting to resell.</strong> Many shop items do not sell back at the Bank. Prefer saving Relic Coins over dumping them for pocket change."
    )}

    <h2>Income sources</h2>
    <table class="wikitable">
      <thead><tr><th>Source</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Wild battles</td><td>Steady while exploring (pack multiplier applied)</td></tr>
        <tr><td>Trainers / gyms</td><td>Better payouts; doubles as progression</td></tr>
        <tr><td>Bank sells</td><td>Emeralds, potions, vitamins, relic coins…</td></tr>
        <tr><td>Bountiful boards</td><td>Village bounty boards</td></tr>
        <tr><td>Raids</td><td>Tier cash rewards — see <a href="Raids.html">Raids</a></td></tr>
      </tbody>
    </table>

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
    `,
  });

  writePage("First_Hours.html", {
    title: "First hours",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "First hours", href: "First_Hours.html" },
    ],
    lede: "A dense opening guide: from character load-in to a claimed base, a tiny team, and the road toward Brock.",
    body: `
    ${figure(
      guideImg("hud.png"),
      "<strong>Your HUD.</strong> Left: party (selected Pokémon highlighted). Top-right: minimap + coordinates. Bottom: hotbar — keep balls, food, and your Brock map once crafted.",
      "Example HUD"
    )}

    <h2>Minute-by-minute checklist</h2>
    <ol class="steps">
      <li>Press <kbd>C</kbd> → pick a starter. Grass is the safest into Brock.</li>
      <li>Open <kbd>E</kbd> and verify starter kit: guide book, Brock map kit (cartography table + key + Empty Map), balls, berries, Trainer Card, backpack.</li>
      <li>Place a bed and sleep once (respawn point).</li>
      <li>Activate any spawn waystone (right-click).</li>
      <li>Skim the guide book, then go catch 2–3 nearby Pokémon.</li>
      <li><a href="Claims.html">Claim</a> your bed/chests before you explore far.</li>
      <li>Start an apricorn corner + tiny wheat patch (<a href="Poke_Balls.html">Poké Balls</a>, <a href="Economy.html">Economy</a>).</li>
      <li>When you have a 4–6 team and heals, open the <a href="Brock.html">Brock</a> guide.</li>
    </ol>

    <h2>Controls you will use constantly</h2>
    <table class="wikitable">
      <thead><tr><th>Action</th><th>Key</th><th>Why it matters</th></tr></thead>
      <tbody>
        <tr><td>Party / starter</td><td><kbd>C</kbd></td><td>Pick starter and manage team</td></tr>
        <tr><td>Select send-out</td><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Stops “wrong Pokémon” mistakes</td></tr>
        <tr><td>Send / recall</td><td><kbd>R</kbd></td><td>Starts battles</td></tr>
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

    <p class="see-also"><strong>Next:</strong> <a href="Brock.html">Brock</a> · <a href="Gym_Maps.html">Gym maps</a> · <a href="Roadmap.html">30-day roadmap</a></p>
    `,
  });

  writePage("Travel.html", {
    title: "Travel",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Travel", href: "Travel.html" },
    ],
    lede: "Waystones are free fast-travel on this pack. Combine them with gym maps and Xaero pins so you never re-walk the same 2000 blocks.",
    body: `
    ${figure(
      "../assets/waystone.png",
      "<strong>Waystone.</strong> Right-click to activate. Shift + right-click to rename. Build a network: Spawn, Home, each gym town.",
      "Waystone teleport block"
    )}
    <h2>Setup walkthrough</h2>
    <ol class="steps">
      <li>Activate the spawn waystone on day one.</li>
      <li>Place / activate one at your claimed base.</li>
      <li>After every gym, activate a stone nearby (or place one if you carried extras).</li>
      <li>Rename clearly: <em>Home</em>, <em>Brock</em>, <em>Misty</em>, etc.</li>
    </ol>
    <h2>Waystones vs pins vs gym maps</h2>
    <table class="wikitable">
      <thead><tr><th>System</th><th>Others see it?</th><th>Teleports?</th></tr></thead>
      <tbody>
        <tr><td>Waystone</td><td>World block — others must activate too</td><td>Yes</td></tr>
        <tr><td>Xaero pin</td><td>Usually only you</td><td>No</td></tr>
        <tr><td>Gym map</td><td>Your item</td><td>No — navigation only</td></tr>
      </tbody>
    </table>
    <p>Also useful: Nature’s Compass, Explorer’s Compass, <a href="Riding.html">Riding</a>.</p>
    ${navboxSystems()}
    `,
  });

  writePage("Getting_Started.html", {
    title: "Getting started",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Getting started", href: "Getting_Started.html" },
    ],
    lede: "Install CobbleVerse <strong>1.7.42</strong>, join <strong>PokeHaven EU</strong>, and know the words the rest of the wiki uses.",
    body: `
    <h2>Requirements</h2>
    <ul>
      <li>Minecraft <strong>Java Edition</strong> (Microsoft account)</li>
      <li><strong>CurseForge</strong> app</li>
      <li>Our shared pack zip — <strong>exactly 1.7.42</strong>, same as the server</li>
    </ul>

    ${figure(
      guideImg("multiplayer-join.png"),
      "<strong>Ready to play.</strong> After import, launch to the menu, then add <code>PokeHaven EU</code> in Multiplayer. The IP rotates — always copy it from Discord, never from old screenshots.",
      "CobbleVerse client ready for multiplayer"
    )}

    <h2>Install walkthrough</h2>
    <ol class="steps">
      <li>Install CurseForge and sign in.</li>
      <li>Create Custom Profile → <strong>Import</strong> the shared pack zip.</li>
      <li>Wait until every mod finishes — do not cancel mid-download.</li>
      <li>Launch once to the main menu, quit, launch again (helps resource packs settle).</li>
      <li>Multiplayer → Add Server:<br/>
        Name: <code>PokeHaven EU</code><br/>
        Address: IP from <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a> <code>#how-to-join</code>.</li>
    </ol>

    <div class="callout tip">
      <div class="label">Join checklist</div>
      Server name: <strong>PokeHaven EU</strong>. Pack: <strong>1.7.42</strong>. IP only from <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a> (it can rotate).
    </div>

    ${critical(
      "en",
      "<strong>Can't join?</strong> Almost always a pack mismatch. Re-import CobbleVerse <strong>1.7.42</strong>. Copy the IP from Discord — never from old screenshots. See <a href=\"Common_Mistakes.html\">Common mistakes</a>."
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
        <tr><td>Claim</td><td>Protect land with FTB Chunks</td></tr>
        <tr><td>Waystone</td><td>Teleport stone</td></tr>
        <tr><td>Recipe list / REI</td><td>Search crafts with inventory open (<kbd>E</kbd>)</td></tr>
        <tr><td>Outfits</td><td>Craftable trainer clothes — see <a href="Outfits_and_Cosmetics.html">Outfits and cosmetics</a></td></tr>
      </tbody>
    </table>

    <h2>Need help?</h2>
    <p><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a> — pack zip, live IP, and support. Send a screenshot + what you already tried.</p>

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

  // Enrich main page hub with new deep guides
  writePage("index.html", {
    title: "PokeHaven EU Wiki",
    searchIndexTitle: "Main Page",
    breadcrumbs: [{ label: "Main Page", href: "index.html" }],
    lede: "The deep player wiki for <strong>PokeHaven EU</strong> — CobbleVerse 1.7.42 guides with walkthroughs, tables, and screenshots.",
    body: `
  <section class="hero" style="min-height:auto;border:1px solid var(--line);border-radius:12px;margin-bottom:1.5rem;">
    <img class="hero-img" src="assets/wiki-wallpaper.png" alt="" />
    <div class="hero-inner" style="padding:2.5rem 1.5rem;">
      <div class="chips" style="margin-bottom:0.75rem;">
        <span class="chip"><strong>PokeHaven EU</strong></span>
        <span class="chip">CobbleVerse 1.7.42</span>
        <span class="chip">Deep player guides</span>
      </div>
      <h2 style="font-family:var(--font-display);font-size:clamp(2rem,5vw,3.2rem);margin:0 0 0.5rem;border:0;padding:0;">Train. Craft. Progress.</h2>
      <p class="hero-lead">OSRS-wiki structure, CobbleVerse style — long guides with screenshots, not bare stub pages.</p>
    </div>
  </section>

  <h2>Start here</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Getting_Started.html"><h3>Getting started</h3><p>Install the pack and join the server.</p></a>
    <a class="hub-card" href="pages/First_Hours.html"><h3>First hours</h3><p>Full opening checklist with HUD screenshots.</p></a>
    <a class="hub-card" href="pages/Poke_Balls.html"><h3>Poké Balls</h3><p>Apricorns, crafting screenshots, farm setup.</p></a>
    <a class="hub-card" href="pages/Brock.html"><h3>Brock guide</h3><p>Map legend, prep, full team from pack data.</p></a>
  </div>

  <h2>Deep guides</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Catching_and_Battling.html"><h3>Catching &amp; battling</h3><p>Catch loop, aggro, gimmicks.</p></a>
    <a class="hub-card" href="pages/Healing_and_Storage.html"><h3>Healing &amp; storage</h3><p>Centers, Revives, PC.</p></a>
    <a class="hub-card" href="pages/Economy.html"><h3>Economy</h3><p>Farm loop, shop &amp; bank tables.</p></a>
    <a class="hub-card" href="pages/Claims.html"><h3>Claims</h3><p>FTB Chunks walkthrough + screenshot.</p></a>
    <a class="hub-card" href="pages/Gyms_Kanto.html"><h3>Kanto gyms</h3><p>All leaders + league pages.</p></a>
    <a class="hub-card" href="pages/Raids.html"><h3>Raids</h3><p>Tiers, resets, rewards.</p></a>
    <a class="hub-card" href="pages/Travel.html"><h3>Travel</h3><p>Waystones and map tools.</p></a>
    <a class="hub-card" href="pages/Minecraft_Basics.html"><h3>Minecraft basics</h3><p>Tools, farms, inventory for newcomers.</p></a>
  </div>

  <h2>Planning &amp; help</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Roadmap.html"><h3>30-day roadmap</h3><p>Calm Kanto pace.</p></a>
    <a class="hub-card" href="pages/Common_Mistakes.html"><h3>Common mistakes</h3><p>Fix these once.</p></a>
    <a class="hub-card" href="pages/FAQ.html"><h3>FAQ</h3><p>Join issues, level cap, maps.</p></a>
    <a class="hub-card" href="pages/Spawn_Lookup.html"><h3>Spawn lookup</h3><p>Search pack spawn data.</p></a>
  </div>

  <h2>Databases</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Trainer_Index.html"><h3>Trainer index</h3><p>Named trainers from RCT data.</p></a>
    <a class="hub-card" href="pages/Raid_Bosses.html"><h3>Raid bosses</h3><p>Boss file index.</p></a>
    <a class="hub-card" href="pages/Breeding.html"><h3>Breeding</h3><p>Pasture timing notes.</p></a>
    <a class="hub-card" href="pages/Voice_Chat.html"><h3>Voice chat</h3><p>Distances and groups.</p></a>
  </div>

  <div class="callout tip">
    <div class="label">About screenshots</div>
    Guide images are illustrative CobbleVerse-style references (UI packs/skins can differ slightly).
    For exact crafts, always use the in-game recipe search (<kbd>E</kbd>).
  </div>
  `,
  });
}
