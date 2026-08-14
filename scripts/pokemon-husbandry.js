/**
 * Cobblemon held-item interactions (resource “ranching”) — Cobblemon 1.7.1 wiki.
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
  const brushTitle =
    lang === "nl" ? "Borstel — nuttige resources" : "Brush — useful resources";
  const boneTitle = lang === "nl" ? "Beendermeel" : "Bone meal";

  return `
  <h3 id="shears">${shearTitle}</h3>
  ${table(H, rowsHtml(HUSBANDRY.shears, lang))}
  <h3 id="bucket">${bucketTitle}</h3>
  ${table(H, rowsHtml(HUSBANDRY.bucket, lang))}
  <h3 id="bottle">${bottleTitle}</h3>
  ${table(H, rowsHtml(HUSBANDRY.bottle, lang))}
  <h3 id="brush">${brushTitle}</h3>
  <p class="${lang === "nl" ? "" : ""}">${
    lang === "nl"
      ? "Veel bird-lines geven ook <strong>veren</strong> met een borstel — handig, maar hieronder staan de resources die je meestal echt zoekt."
      : "Many bird lines also give <strong>feathers</strong> with a brush — useful, but the table below focuses on resources players usually farm on purpose."
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
      <tr><td><strong>String</strong></td><td>Brush <strong>Cottonee / Whimsicott</strong>, <strong>Eldegoss</strong>, <strong>Tarountula / Spidops</strong>, or <strong>Wyrdeer</strong> (spiders are off).</td></tr>
      <tr><td><strong>Milk</strong></td><td>Empty bucket on <strong>Miltank</strong> (or female Skiddo / Gogoat / Bouffalant).</td></tr>
      <tr><td><strong>Moomoo Milk</strong></td><td>Glass bottle on <strong>Miltank</strong> — clears stat changes in battle; also works in milk recipes.</td></tr>
      <tr><td><strong>Honey</strong></td><td>Glass bottle on <strong>Vespiquen</strong> (also used for Poké Snacks / campfire pot).</td></tr>
      <tr><td><strong>Lava / water bucket</strong></td><td>Empty bucket on Slugma/Magcargo/Numel/Camerupt (lava) or Wash Rotom (water).</td></tr>
    </tbody>
  </table>

  <h2>Full interaction lists</h2>
  <p>Source: Cobblemon 1.7.1 interaction table. Cooldowns apply; some lines are ♀-only for milking.</p>
  ${husbandryTables("en")}

  <h2>Feathers &amp; cosmetics</h2>
  <ul>
    <li>Most bird Pokémon give <strong>feathers</strong> when brushed (Pidgey line, Starly line, Rookidee line, …).</li>
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
      <tr><td><strong>String</strong></td><td>Borstel <strong>Cottonee / Whimsicott</strong>, <strong>Eldegoss</strong>, <strong>Tarountula / Spidops</strong> of <strong>Wyrdeer</strong> (spinnen staan uit).</td></tr>
      <tr><td><strong>Melk</strong></td><td>Lege emmer op <strong>Miltank</strong> (of ♀ Skiddo / Gogoat / Bouffalant).</td></tr>
      <tr><td><strong>Moomoo Milk</strong></td><td>Glazen flesje op <strong>Miltank</strong> — wist stat-changes in battle; werkt ook in melk-recepten.</td></tr>
      <tr><td><strong>Honing</strong></td><td>Glazen flesje op <strong>Vespiquen</strong> (o.a. voor Poké Snacks / campfire pot).</td></tr>
      <tr><td><strong>Lava- / wateremmer</strong></td><td>Lege emmer op Slugma/Magcargo/Numel/Camerupt (lava) of Wash Rotom (water).</td></tr>
    </tbody>
  </table>

  <h2>Volledige interactie-lijsten</h2>
  <p>Bron: Cobblemon 1.7.1 interactie-tabel. Er geldt een cooldown; melk is soms alleen ♀.</p>
  ${husbandryTables("nl")}

  <h2>Veren &amp; cosmetics</h2>
  <ul>
    <li>De meeste bird-Pokémon geven <strong>veren</strong> met een borstel (Pidgey-line, Starly-line, Rookidee-line, …).</li>
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
    <li>Legendaries borstelen als “farm” — commons uit de tabellen zijn sneller.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Farming_and_Food.html">Farms &amp; eten</a> · <a href="Breeding.html">Broeden</a> · <a href="Essential_Recipes.html">Essentiële recepten</a> · <a href="Outfits_and_Cosmetics.html">Outfits</a> · <a href="Pack_Differences.html">Pack-verschillen</a></p>
  ${navboxCore()}
  `;
}
