/**
 * Cobblemon held-item interactions (resource “ranching”) — Cobblemon 1.7.x / pack 1.7.42.
 * Used by EN deep-pages + NL site for Pokemon_Husbandry.html
 */

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function table(headers, rows) {
  const head = headers.map((h) => `<th>${h}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("\n");
  return `<table class="wikitable sortable">
  <thead><tr>${head}</tr></thead>
  <tbody>
${body}
  </tbody>
</table>`;
}

/** @typedef {{ pokemon: string, item: string, gets: string, note?: string }} Row */

/** @type {Record<string, Row[]>} */
export const HUSBANDRY = {
  shears: [
    { pokemon: "Mareep", item: "Shears", gets: "White Wool" },
    { pokemon: "Wooloo", item: "Shears", gets: "Wool (dye colour)" },
    { pokemon: "Dubwool", item: "Shears", gets: "Wool (dye colour)" },
    { pokemon: "Slowpoke", item: "Shears", gets: "Tasty Tail" },
  ],
  bucket: [
    { pokemon: "Miltank", item: "Bucket", gets: "Milk Bucket" },
    { pokemon: "Bouffalant (♀)", item: "Bucket", gets: "Milk Bucket" },
    { pokemon: "Skiddo (♀)", item: "Bucket", gets: "Milk Bucket" },
    { pokemon: "Gogoat (♀)", item: "Bucket", gets: "Milk Bucket" },
    { pokemon: "Slugma", item: "Bucket", gets: "Lava Bucket" },
    { pokemon: "Magcargo", item: "Bucket", gets: "Lava Bucket" },
    { pokemon: "Numel", item: "Bucket", gets: "Lava Bucket" },
    { pokemon: "Camerupt", item: "Bucket", gets: "Lava Bucket" },
    { pokemon: "Rotom (Wash)", item: "Bucket", gets: "Water Bucket" },
    { pokemon: "Rotom (Frost)", item: "Bucket", gets: "Powder Snow Bucket" },
    { pokemon: "Vanilluxe", item: "Bucket", gets: "Powder Snow Bucket" },
  ],
  bottle: [
    { pokemon: "Miltank", item: "Glass Bottle", gets: "Moomoo Milk" },
    { pokemon: "Vespiquen", item: "Glass Bottle", gets: "Honey Bottle" },
  ],
  brushUseful: [
    { pokemon: "Cottonee / Whimsicott", item: "Brush", gets: "String" },
    { pokemon: "Eldegoss", item: "Brush", gets: "String" },
    { pokemon: "Wyrdeer", item: "Brush", gets: "String" },
    { pokemon: "Tarountula / Spidops", item: "Brush", gets: "String" },
    { pokemon: "Hippopotas / Hippowdon", item: "Brush", gets: "Sand" },
    { pokemon: "Sandygast / Palossand", item: "Brush", gets: "Sand" },
    { pokemon: "Rolycoly line", item: "Brush", gets: "Coal" },
    { pokemon: "Goomy line", item: "Brush", gets: "Slime Ball" },
    { pokemon: "Sandshrew / Sandslash", item: "Brush", gets: "Armadillo Scute" },
    { pokemon: "Jangmo-o line", item: "Brush", gets: "Armadillo Scute" },
    { pokemon: "Swirlix / Slurpuff / Alcremie", item: "Brush", gets: "Sugar" },
    { pokemon: "Volcarona", item: "Brush", gets: "Blaze Powder" },
    { pokemon: "Vanillite line", item: "Brush", gets: "Snowball" },
    { pokemon: "Toedscool / Toedscruel", item: "Brush", gets: "Brown Mushroom" },
  ],
  /** Brush → Feather (Cobblemon 1.7.1). Grouped by line where useful. */
  brushFeathers: [
    { pokemon: "Pidgey / Pidgeotto / Pidgeot", item: "Brush", gets: "Feather" },
    { pokemon: "Spearow / Fearow", item: "Brush", gets: "Feather" },
    { pokemon: "Farfetch'd / Sirfetch'd", item: "Brush", gets: "Feather" },
    { pokemon: "Doduo / Dodrio", item: "Brush", gets: "Feather" },
    { pokemon: "Hoothoot / Noctowl", item: "Brush", gets: "Feather" },
    { pokemon: "Togetic / Togekiss", item: "Brush", gets: "Feather" },
    { pokemon: "Natu / Xatu", item: "Brush", gets: "Feather" },
    { pokemon: "Murkrow / Honchkrow", item: "Brush", gets: "Feather" },
    { pokemon: "Delibird", item: "Brush", gets: "Feather" },
    { pokemon: "Torchic / Combusken / Blaziken", item: "Brush", gets: "Feather" },
    { pokemon: "Taillow / Swellow", item: "Brush", gets: "Feather" },
    { pokemon: "Wingull / Pelipper", item: "Brush", gets: "Feather" },
    { pokemon: "Piplup / Prinplup / Empoleon", item: "Brush", gets: "Feather" },
    { pokemon: "Starly / Staravia / Staraptor", item: "Brush", gets: "Feather" },
    { pokemon: "Chatot", item: "Brush", gets: "Feather" },
    { pokemon: "Pidove / Tranquill / Unfezant", item: "Brush", gets: "Feather" },
    { pokemon: "Archen / Archeops", item: "Brush", gets: "Feather" },
    { pokemon: "Ducklett / Swanna", item: "Brush", gets: "Feather" },
    { pokemon: "Rufflet / Braviary", item: "Brush", gets: "Feather" },
    { pokemon: "Vullaby / Mandibuzz", item: "Brush", gets: "Feather" },
    { pokemon: "Fletchling / Fletchinder / Talonflame", item: "Brush", gets: "Feather" },
    { pokemon: "Hawlucha", item: "Brush", gets: "Feather" },
    { pokemon: "Rowlet / Dartrix / Decidueye", item: "Brush", gets: "Feather" },
    { pokemon: "Pikipek / Trumbeak / Toucannon", item: "Brush", gets: "Feather" },
    { pokemon: "Oricorio", item: "Brush", gets: "Feather" },
    { pokemon: "Rookidee / Corvisquire / Corviknight", item: "Brush", gets: "Feather" },
    { pokemon: "Cramorant", item: "Brush", gets: "Feather" },
    { pokemon: "Eiscue", item: "Brush", gets: "Feather" },
    { pokemon: "Quaxly / Quaxwell / Quaquaval", item: "Brush", gets: "Feather" },
    { pokemon: "Squawkabilly", item: "Brush", gets: "Feather" },
    { pokemon: "Wattrel / Kilowattrel", item: "Brush", gets: "Feather" },
    { pokemon: "Bombirdier", item: "Brush", gets: "Feather" },
    { pokemon: "Flamigo", item: "Brush", gets: "Feather" },
    { pokemon: "Articuno / Zapdos", item: "Brush", gets: "Feather" },
    { pokemon: "Cresselia", item: "Brush", gets: "Feather" },
    { pokemon: "Fezandipiti", item: "Brush", gets: "Feather" },
  ],
  boneMeal: [
    { pokemon: "Exeggutor", item: "Bone Meal", gets: "Jungle Sapling" },
    { pokemon: "Tangela / Tangrowth", item: "Bone Meal", gets: "Vines" },
    { pokemon: "Hoppip line", item: "Bone Meal", gets: "Dandelion" },
    { pokemon: "Sunflora", item: "Bone Meal", gets: "Sunflower" },
    { pokemon: "Lotad line", item: "Bone Meal", gets: "Lily Pad" },
    { pokemon: "Roselia / Roserade", item: "Bone Meal", gets: "Rose Bush" },
    { pokemon: "Cacnea / Cacturne", item: "Bone Meal", gets: "Cactus" },
    { pokemon: "Grotle", item: "Bone Meal", gets: "Sweet Berries" },
    { pokemon: "Snover", item: "Bone Meal", gets: "Sweet Berries" },
    { pokemon: "Abomasnow", item: "Bone Meal", gets: "Spruce Sapling" },
    { pokemon: "Petilil", item: "Bone Meal", gets: "Revival Herb" },
    { pokemon: "Trevenant", item: "Bone Meal", gets: "Dark Oak Sapling" },
    { pokemon: "Dhelmise", item: "Bone Meal", gets: "Kelp" },
  ],
};

const NL_ITEM = {
  Shears: "Schaar",
  Bucket: "Emmer",
  "Glass Bottle": "Glazen flesje",
  Brush: "Borstel",
  "Bone Meal": "Beendermeel",
  "White Wool": "Witte wol",
  "Wool (dye colour)": "Wol (kleur van dye)",
  "Tasty Tail": "Tasty Tail",
  "Milk Bucket": "Melkemmer",
  "Lava Bucket": "Lava-emmer",
  "Water Bucket": "Wateremmer",
  "Powder Snow Bucket": "Poedersneeuw-emmer",
  "Moomoo Milk": "Moomoo Milk",
  "Honey Bottle": "Honingflesje",
  String: "Touw (string)",
  Sand: "Zand",
  Coal: "Steenkool",
  "Slime Ball": "Slijmbal",
  "Armadillo Scute": "Armadillo-schild",
  Sugar: "Suiker",
  "Blaze Powder": "Blaze powder",
  Snowball: "Sneeuwbal",
  "Brown Mushroom": "Bruine mushroom",
  Feather: "Veer (feather)",
  "Jungle Sapling": "Jungle-sapling",
  Vines: "Ranken (vines)",
  Dandelion: "Paardenbloem",
  Sunflower: "Zonnebloem",
  "Lily Pad": "Waterlelie",
  "Rose Bush": "Rozenstruik",
  Cactus: "Cactus",
  "Sweet Berries": "Sweet berries",
  "Spruce Sapling": "Spar-sapling",
  "Revival Herb": "Revival Herb",
  "Dark Oak Sapling": "Dark oak-sapling",
  Kelp: "Kelp",
};

function rowsHtml(list, lang) {
  return list.map((r) => {
    const item = lang === "nl" ? NL_ITEM[r.item] || r.item : r.item;
    const gets = lang === "nl" ? NL_ITEM[r.gets] || r.gets : r.gets;
    return [esc(r.pokemon), esc(item), esc(gets)];
  });
}

export function husbandryTables(lang) {
  const H =
    lang === "nl"
      ? ["Pokémon", "Tool / item", "Je krijgt"]
      : ["Pokémon", "Hold this", "You get"];
  const shearTitle = lang === "nl" ? "Schaar" : "Shears";
  const bucketTitle = lang === "nl" ? "Emmer" : "Bucket";
  const bottleTitle = lang === "nl" ? "Flesje" : "Glass bottle";
  const featherTitle =
    lang === "nl" ? "Borstel → veren (feathers)" : "Brush → feathers";
  const brushTitle =
    lang === "nl" ? "Borstel — andere resources" : "Brush — other resources";
  const boneTitle = lang === "nl" ? "Beendermeel" : "Bone meal";

  return `
  <h3 id="shears">${shearTitle}</h3>
  ${table(H, rowsHtml(HUSBANDRY.shears, lang))}
  <h3 id="bucket">${bucketTitle}</h3>
  ${table(H, rowsHtml(HUSBANDRY.bucket, lang))}
  <h3 id="bottle">${bottleTitle}</h3>
  ${table(H, rowsHtml(HUSBANDRY.bottle, lang))}
  <h3 id="feathers">${featherTitle}</h3>
  <p>${
    lang === "nl"
      ? "Geen één “veren-Pokémon”: bijna alle <strong>bird-lines</strong> geven veren met een <strong>borstel</strong>. Vroeg het makkelijkst: Pidgey-, Spearow-, Starly- of Fletchling-line."
      : "There isn’t a single “feather Pokémon”: almost every <strong>bird line</strong> gives feathers with a <strong>brush</strong>. Easiest early: Pidgey, Spearow, Starly, or Fletchling lines."
  }</p>
  ${table(H, rowsHtml(HUSBANDRY.brushFeathers, lang))}
  <h3 id="brush">${brushTitle}</h3>
  <p>${
    lang === "nl"
      ? "Zelfde tool (borstel), andere drops — string, zand, kool, suiker, enz."
      : "Same tool (brush), different drops — string, sand, coal, sugar, and more."
  }</p>
  ${table(H, rowsHtml(HUSBANDRY.brushUseful, lang))}
  <h3 id="bonemeal">${boneTitle}</h3>
  ${table(H, rowsHtml(HUSBANDRY.boneMeal, lang))}
`;
}

export function husbandryBodyEn({ navboxSystems, critical }) {
  return `
  <div class="callout warn">
    <div class="label">PokeHaven EU</div>
    Vanilla <strong>sheep, cows, spiders</strong> and most other animals are disabled (MobsBeGone).
    Beds, milk, string, and similar materials come from <strong>Pokémon interactions</strong> (or structures / trading) — not from classic animal farms.
  </div>

  <h2>How harvesting works</h2>
  <ol class="steps">
    <li>Catch a species from the tables below.</li>
    <li>Send it out (<kbd>R</kbd>).</li>
    <li>Hold the required tool/item in your hand.</li>
    <li><strong>Right-click</strong> the Pokémon (don’t open the Shift-menu unless you need Ride / held items).</li>
    <li>Wait for the <strong>cooldown</strong> before harvesting the same Pokémon again.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Pasture ranch</div>
    Park harvest Pokémon in a claimed <strong>pasture</strong> near your base (same block as breeding). Send one out, harvest, recall — safer than leaving them roaming unclaimed land.
  </div>

  <h2>Quick answers</h2>
  <table class="wikitable">
    <thead><tr><th>I need…</th><th>Do this</th></tr></thead>
    <tbody>
      <tr><td><strong>Wool / bed</strong></td><td>Shears on <strong>Mareep</strong>, <strong>Wooloo</strong>, or <strong>Dubwool</strong>. Dye Wooloo/Dubwool for coloured wool.</td></tr>
      <tr><td><strong>Leather</strong></td><td><strong>Defeat</strong> livestock-style Pokémon (not milking). On PokeHaven they drop <strong>1–3 leather</strong> — e.g. Miltank, Tauros, Bouffalant, Mudbray/Mudsdale, Ponyta/Rapidash, Skiddo/Gogoat, Girafarig/Farigiraf, Stantler/Wyrdeer, Deerling/Sawsbuck, Blitzle/Zebstrika, Numel/Camerupt. Keep one for milk; farm extras / wild for leather. See <a href="#leather">Leather</a>.</td></tr>
      <tr><td><strong>Feathers</strong></td><td>Brush almost any bird line — see <a href="#feathers">feathers table</a>. Early: Pidgey / Spearow / Starly / Fletchling.</td></tr>
      <tr><td><strong>String</strong></td><td>Brush <strong>Cottonee / Whimsicott</strong>, <strong>Eldegoss</strong>, <strong>Tarountula / Spidops</strong>, or <strong>Wyrdeer</strong> (spiders are off).</td></tr>
      <tr><td><strong>Milk</strong></td><td>Empty bucket on <strong>Miltank</strong> (or female Skiddo / Gogoat / Bouffalant).</td></tr>
      <tr><td><strong>Moomoo Milk</strong></td><td>Glass bottle on <strong>Miltank</strong> — clears stat changes in battle; also works in milk recipes.</td></tr>
      <tr><td><strong>Honey</strong></td><td>Glass bottle on <strong>Vespiquen</strong> (also used for Poké Snacks / campfire pot).</td></tr>
      <tr><td><strong>Lava / water bucket</strong></td><td>Empty bucket on Slugma/Magcargo/Numel/Camerupt (lava) or Wash Rotom (water).</td></tr>
    </tbody>
  </table>

  <h2 id="leather">Leather</h2>
  <p>There are <strong>no cows</strong> here. Leather comes from <strong>Pokémon defeat drops</strong>, not from pasture right-clicks.</p>
  <ul>
    <li><strong>Your</strong> Miltank / goats stay for <strong>milk</strong> — milking does not give leather.</li>
    <li><strong>Defeat</strong> wild (or spare) livestock Pokémon: they drop <strong>1–3 leather</strong> on PokeHaven EU.</li>
    <li>Good early targets: grassland <strong>Miltank</strong> / <strong>Tauros</strong> / <strong>Bouffalant</strong>; also horses, deer lines, Mudbray line, goats, and camels listed above.</li>
  </ul>

  <h2>Full interaction lists</h2>
  <p>Source: Cobblemon 1.7.1 interaction table. Cooldowns apply; some lines are ♀-only for milking.</p>
  ${husbandryTables("en")}

  <h2>Feathers &amp; cosmetics</h2>
  <ul>
    <li>Full list: <a href="#feathers">Brush → feathers</a> above.</li>
    <li><strong>Furfrou:</strong> shears + dye in the cosmetic slot change its form (looks), not a wool farm.</li>
  </ul>

  <h2>Ranch tips</h2>
  <ul>
    <li><strong>Claim</strong> the pasture — see <a href="Claims.html">Claims</a>.</li>
    <li>Keep a stack of shears, brushes, empty buckets, and glass bottles in a chest by the pen.</li>
    <li>Breed extras with <a href="Breeding.html">Breeding</a> if you want a dedicated wool/milk line.</li>
    <li>Crop farms still matter for money — <a href="Farming_and_Food.html">Farming &amp; food</a>.</li>
  </ul>

  ${critical(
    "en",
    "<strong>Looking for sheep?</strong> They won’t spawn here. Catch Mareep or Wooloo and use shears instead."
  )}

  <h2>Common mistakes</h2>
  <ul>
    <li>Right-clicking while sneaking opens the interact menu — use a normal right-click with the tool held.</li>
    <li>Expecting cow milk / spider string from vanilla mobs — those animals are blacklisted.</li>
    <li>Expecting leather from milking Miltank — milk is milk; leather is a <strong>defeat drop</strong>.</li>
    <li>Harvesting legendary brush targets (e.g. Articuno feathers) as a “farm” — catchables exist, but ranch commons are faster.</li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="Farming_and_Food.html">Farming &amp; food</a> · <a href="Breeding.html">Breeding</a> · <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Outfits_and_Cosmetics.html">Outfits</a> · <a href="Pack_Differences.html">Pack differences</a></p>
  ${navboxSystems()}
  `;
}

export function husbandryBodyNl({ navboxCore, critical }) {
  return `
  <div class="callout warn">
    <div class="label">PokeHaven EU</div>
    Vanilla <strong>schapen, koeien, spinnen</strong> en de meeste andere dieren staan uit (MobsBeGone).
    Wol, melk, string en soortgelijke spullen komen van <strong>Pokémon-interacties</strong> (of structures / trades) — niet van klassieke dierenfarms.
  </div>

  <h2>Hoe harvesten werkt</h2>
  <ol class="steps">
    <li>Vang een species uit de tabellen hieronder.</li>
    <li>Gooi ’m uit (<kbd>R</kbd>).</li>
    <li>Houd het juiste item/tool in je hand.</li>
    <li><strong>Rechtsklik</strong> op de Pokémon (niet Shift-menu, tenzij je Ride / held items nodig hebt).</li>
    <li>Wacht op de <strong>cooldown</strong> voor je dezelfde Pokémon opnieuw harvest.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Pasture-ranch</div>
    Zet harvest-Pokémon in een <strong>geclaimde pasture</strong> bij je base (zelfde blok als broeden). Uitgooien → harvest → recall — veiliger dan los laten lopen.
  </div>

  <h2>Snel antwoorden</h2>
  <table class="wikitable">
    <thead><tr><th>Ik zoek…</th><th>Doe dit</th></tr></thead>
    <tbody>
      <tr><td><strong>Wol / bed</strong></td><td>Schaar op <strong>Mareep</strong>, <strong>Wooloo</strong> of <strong>Dubwool</strong>. Dye Wooloo/Dubwool voor gekleurde wol.</td></tr>
      <tr><td><strong>Leer</strong></td><td><strong>Verslaan</strong> van vee-achtige Pokémon (niet melken). Op PokeHaven droppen ze <strong>1–3 leer</strong> — o.a. Miltank, Tauros, Bouffalant, Mudbray/Mudsdale, Ponyta/Rapidash, Skiddo/Gogoat, Girafarig/Farigiraf, Stantler/Wyrdeer, Deerling/Sawsbuck, Blitzle/Zebstrika, Numel/Camerupt. Hou er één voor melk; farm wild/extras voor leer. Zie <a href="#leather">Leer</a>.</td></tr>
      <tr><td><strong>Veren</strong></td><td>Borstel bijna elke bird-line — zie <a href="#feathers">veren-tabel</a>. Vroeg: Pidgey / Spearow / Starly / Fletchling.</td></tr>
      <tr><td><strong>String</strong></td><td>Borstel <strong>Cottonee / Whimsicott</strong>, <strong>Eldegoss</strong>, <strong>Tarountula / Spidops</strong> of <strong>Wyrdeer</strong> (spinnen staan uit).</td></tr>
      <tr><td><strong>Melk</strong></td><td>Lege emmer op <strong>Miltank</strong> (of ♀ Skiddo / Gogoat / Bouffalant).</td></tr>
      <tr><td><strong>Moomoo Milk</strong></td><td>Glazen flesje op <strong>Miltank</strong> — wist stat-changes in battle; werkt ook in melk-recepten.</td></tr>
      <tr><td><strong>Honing</strong></td><td>Glazen flesje op <strong>Vespiquen</strong> (o.a. voor Poké Snacks / campfire pot).</td></tr>
      <tr><td><strong>Lava- / wateremmer</strong></td><td>Lege emmer op Slugma/Magcargo/Numel/Camerupt (lava) of Wash Rotom (water).</td></tr>
    </tbody>
  </table>

  <h2 id="leather">Leer</h2>
  <p>Er zijn <strong>geen koeien</strong>. Leer komt van <strong>drops bij verslaan</strong>, niet van rechtsklikken in de pasture.</p>
  <ul>
    <li><strong>Jouw</strong> Miltank / geiten blijven voor <strong>melk</strong> — melken geeft geen leer.</li>
    <li><strong>Verslaan</strong> van wild (of overbodige) vee-Pokémon: op PokeHaven EU droppen ze <strong>1–3 leer</strong>.</li>
    <li>Vroege targets: grasslands <strong>Miltank</strong> / <strong>Tauros</strong> / <strong>Bouffalant</strong>; ook paarden-, hert-, Mudbray-, geiten- en kameel-lijnen hierboven.</li>
  </ul>

  <h2>Volledige interactie-lijsten</h2>
  <p>Bron: Cobblemon 1.7.1 interactie-tabel. Er geldt een cooldown; melk is soms alleen ♀.</p>
  ${husbandryTables("nl")}

  <h2>Veren &amp; cosmetics</h2>
  <ul>
    <li>Volledige lijst: <a href="#feathers">Borstel → veren</a> hierboven.</li>
    <li><strong>Furfrou:</strong> schaar + dye in de cosmetic slot verandert de look — geen wol-farm.</li>
  </ul>

  <h2>Ranch-tips</h2>
  <ul>
    <li><strong>Claim</strong> de pasture — zie <a href="Claims.html">Claims</a>.</li>
    <li>Chest naast de pen: scharen, borstels, lege emmers, glazen flesjes.</li>
    <li>Extra’s broeden via <a href="Breeding.html">Broeden</a> als je een vaste wol-/melk-line wilt.</li>
    <li>Crop-farms blijven belangrijk voor geld — <a href="Farming_and_Food.html">Farms &amp; eten</a>.</li>
  </ul>

  ${critical(
    "nl",
    "<strong>Schapen zoeken?</strong> Die spawnnen hier niet. Vang Mareep of Wooloo en gebruik een schaar."
  )}

  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>Rechtsklikken terwijl je sneakt opent het interact-menu — gewone rechtsklik met tool in de hand.</li>
    <li>Melk/string van vanilla koeien/spinnen verwachten — die dieren staan op de blacklist.</li>
    <li>Leer verwachten van melken — melk is melk; leer is een <strong>drop bij verslaan</strong>.</li>
    <li>Legendaries borstelen als “farm” — commons uit de tabellen zijn sneller.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Farming_and_Food.html">Farms &amp; eten</a> · <a href="Breeding.html">Broeden</a> · <a href="Essential_Recipes.html">Essentiële recepten</a> · <a href="Outfits_and_Cosmetics.html">Outfits</a> · <a href="Pack_Differences.html">Pack-verschillen</a></p>
  ${navboxCore()}
  `;
}
