/** Full gym-map catalog + how maps are made (player + staff reference). */

const CATALOG = {
  Kanto: {
    table: "Kanto Cartography Table",
    tableId: "lumymon:kanto_cartography_table",
    unlock: "Always (starter world)",
    rows: [
      ["Brock", "cobbleverse:brock", "Onyx Stone", "lumymon:onyx_stone", "overworld"],
      ["Misty", "cobbleverse:misty", "Cerulean Star", "lumymon:cerulean_star", "overworld"],
      ["Lt. Surge", "cobbleverse:ltsurge", "Lieutenant Medal", "lumymon:lieutenant_medal", "overworld"],
      ["Erika", "cobbleverse:erika", "Nature Fan", "lumymon:nature_fan", "overworld"],
      ["Koga", "cobbleverse:koga", "Ninja Poison", "lumymon:ninja_poison", "overworld"],
      ["Sabrina", "cobbleverse:sabrina", "Hypnotic Whip", "lumymon:hypnotic_whip", "overworld"],
      ["Blaine", "cobbleverse:blaine", "Cinnabar Glasses", "lumymon:cinnabar_glasses", "nether"],
      ["Giovanni", "cobbleverse:giovanni", "Boss Ring", "lumymon:boss_ring", "overworld"],
      ["Blue (league)", "cobbleverse:kanto_league", "Rival Sling", "lumymon:rival_sling", "overworld"],
    ],
  },
  Johto: {
    table: "Johto Cartography Table",
    tableId: "lumymon:johto_cartography_table",
    unlock: "After first Blue + enable COBBLEVERSE-Johto-DP + 1 server restart",
    rows: [
      ["Valerio", "cobbleverse:valerio", "Raptor Bracer", "lumymon:raptor_bracer", "overworld"],
      ["Raffaello", "cobbleverse:raffaello", "Magnifying Glass", "lumymon:magnifying_glass", "overworld"],
      ["Chiara", "cobbleverse:chiara", "Sweet Milk", "lumymon:sweet_milk", "overworld"],
      ["Angelo", "cobbleverse:angelo", "Spirit Scarf", "lumymon:spirit_scarf", "overworld"],
      ["Furio", "cobbleverse:furio", "Heavy Dumbbell", "lumymon:heavy_dumbbell", "overworld"],
      ["Jasmine", "cobbleverse:jasmine", "Secret Medicine", "lumymon:secret_medicine", "overworld"],
      ["Alfredo", "cobbleverse:alfredo", "Winter Staff", "lumymon:winter_staff", "overworld"],
      ["Sandra", "cobbleverse:sandra", "Pearl Choker", "lumymon:pearl_choker", "nether"],
      ["Lance (league)", "cobbleverse:johto_league", "Master Cape", "lumymon:master_cape", "overworld"],
    ],
  },
  Hoenn: {
    table: "Hoenn Cartography Table",
    tableId: "lumymon:hoenn_cartography_table",
    unlock: "After first Lance + enable COBBLEVERSE-Hoenn-DP + 1 server restart",
    rows: [
      ["Petra", "cobbleverse:petra", "Rock Tome", "lumymon:rock_tome", "overworld"],
      ["Rudi", "cobbleverse:rudi", "Fighting Glove", "lumymon:fighting_glove", "overworld"],
      ["Walter", "cobbleverse:walter", "Electric Connector", "lumymon:electric_connector", "overworld"],
      ["Fiammetta", "cobbleverse:fiammetta", "Fire Lighter", "lumymon:fire_lighter", "overworld"],
      ["Norman", "cobbleverse:norman", "Normal Tablet", "lumymon:normal_tablet", "overworld"],
      ["Alice", "cobbleverse:alice", "Flying Feather", "lumymon:flying_feather", "overworld"],
      ["Tell", "cobbleverse:tell", "Psychic Medallion", "lumymon:psychic_medallion", "overworld"],
      ["Adriano", "cobbleverse:adriano", "Water Rod", "lumymon:water_rod", "overworld"],
      ["Rocco (league)", "cobbleverse:hoenn_league", "Steel Hat", "lumymon:steel_hat", "overworld"],
    ],
  },
  Sinnoh: {
    table: "Sinnoh Cartography Table",
    tableId: "lumymon:sinnoh_cartography_table",
    unlock: "After first Rocco + enable COBBLEVERSE-Sinnoh-DP + 1 server restart",
    rows: [
      ["Pedro", "cobbleverse:pedro", "Rock Casque", "lumymon:rock_casque", "overworld"],
      ["Gardenia", "cobbleverse:gardenia", "Grass Aroma", "lumymon:grass_aroma", "overworld"],
      ["Marzia", "cobbleverse:marzia", "Fighting Bandage", "lumymon:fighting_bandage", "overworld"],
      ["Omar", "cobbleverse:omar", "Water Mask", "lumymon:water_mask", "overworld"],
      ["Fannie", "cobbleverse:fannie", "Ghost Pendant", "lumymon:ghost_pendant", "overworld"],
      ["Ferruccio", "cobbleverse:ferruccio", "Steel Spade", "lumymon:steel_spade", "overworld"],
      ["Bianca", "cobbleverse:bianca", "Ice Ribbon", "lumymon:ice_ribbon", "overworld"],
      ["Corrado", "cobbleverse:corrado", "Electric Fuse", "lumymon:electric_fuse", "overworld"],
      ["Camilla (league)", "cobbleverse:sinnoh_league", "Draconic Fin", "lumymon:draconic_fin", "overworld"],
    ],
  },
};

function catalogTable(lang, regionName, meta) {
  const hLeader = lang === "nl" ? "Leader" : "Leader";
  const hStruct = lang === "nl" ? "Structure-ID" : "Structure ID";
  const hItem = lang === "nl" ? "Special item" : "Special item";
  const hItemId = lang === "nl" ? "Item-ID" : "Item ID";
  const hDim = lang === "nl" ? "Dimensie" : "Dimension";
  const rows = meta.rows
    .map(
      ([leader, struct, item, itemId, dim]) =>
        `<tr><td><strong>${leader}</strong></td><td><code>${struct}</code></td><td>${item}</td><td><code>${itemId}</code></td><td>${dim}</td></tr>`
    )
    .join("\n");
  return `<h3>${regionName}</h3>
  <p><strong>${lang === "nl" ? "Tafel" : "Table"}:</strong> ${meta.table} (<code>${meta.tableId}</code>)<br/>
  <strong>${lang === "nl" ? "Unlock" : "Unlock"}:</strong> ${meta.unlock}</p>
  <table class="wikitable">
    <thead><tr><th>${hLeader}</th><th>${hStruct}</th><th>${hItem}</th><th>${hItemId}</th><th>${hDim}</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>`;
}

/** Wiki page href for a catalog leader label. */
function leaderPageHref(leaderLabel) {
  const special = {
    "Lt. Surge": "Lt._Surge.html",
    "Blue (league)": "Blue.html",
    "Lance (league)": "Johto_Lance.html",
    "Rocco (league)": "Rocco.html",
    "Camilla (league)": "Camilla.html",
  };
  if (special[leaderLabel]) return special[leaderLabel];
  const base = leaderLabel.replace(/ \(league\)$/, "");
  return `${base.replace(/\s+/g, "_")}.html`;
}

const PLAYER_UNLOCK = {
  en: {
    Kanto: "Always available (starter world). Use the <strong>Kanto Cartography Table</strong>.",
    Johto:
      "After <a href=\"Blue.html\">Champion Blue</a> → Trainer Association → <strong>Johto Trainer Card</strong>. Craft the <strong>Johto Cartography Table</strong> (REI). If gyms are missing after your first unlock, staff may need <strong>1 server restart</strong>.",
    Hoenn:
      "After <a href=\"Johto_Lance.html\">Lance</a> → <strong>Hoenn Trainer Card</strong>. Craft the <strong>Hoenn Cartography Table</strong>. First unlock may need <strong>1 server restart</strong>.",
    Sinnoh:
      "After <a href=\"Rocco.html\">Rocco</a> → <strong>Sinnoh Trainer Card</strong>. Craft the <strong>Sinnoh Cartography Table</strong>. First unlock may need <strong>1 server restart</strong>.",
  },
  nl: {
    Kanto: "Altijd beschikbaar (starterwereld). Gebruik de <strong>Kanto Cartography Table</strong>.",
    Johto:
      "Na <a href=\"Blue.html\">Champion Blue</a> → Trainer Association → <strong>Johto Trainer Card</strong>. Craft de <strong>Johto Cartography Table</strong> (REI). Ontbreken gyms na je eerste unlock? Staff kan <strong>1× herstarten</strong>.",
    Hoenn:
      "Na <a href=\"Johto_Lance.html\">Lance</a> → <strong>Hoenn Trainer Card</strong>. Craft de <strong>Hoenn Cartography Table</strong>. Eerste unlock kan <strong>1× herstart</strong> nodig hebben.",
    Sinnoh:
      "Na <a href=\"Rocco.html\">Rocco</a> → <strong>Sinnoh Trainer Card</strong>. Craft de <strong>Sinnoh Cartography Table</strong>. Eerste unlock kan <strong>1× herstart</strong> nodig hebben.",
  },
};

const REGION_HUB = {
  Kanto: "Gyms_Kanto.html",
  Johto: "Gyms_Johto.html",
  Hoenn: "Gyms_Hoenn.html",
  Sinnoh: "Gyms_Sinnoh.html",
};

/**
 * Player-facing per-region map lists for Gym_Maps.html (EN/NL).
 * Leader + special item (+ note for Nether). Structure IDs live on Gym_Maps_Reference.
 */
export function gymMapsPlayerRegions(lang) {
  const nl = lang === "nl";
  const hLeader = "Leader";
  const hItem = nl ? "Special item (REI)" : "Special item (REI)";
  const hNote = nl ? "Notitie" : "Note";
  const overview = nl ? "Regio-overzicht" : "Region overview";
  const dimNote = (dim) =>
    dim === "nether"
      ? nl
        ? "Zoekt in de <strong>Nether</strong>"
        : "Searches the <strong>Nether</strong>"
      : "—";

  return ["Kanto", "Johto", "Hoenn", "Sinnoh"]
    .map((region) => {
      const meta = CATALOG[region];
      const rows = meta.rows
        .map(([leader, , item, , dim]) => {
          const href = leaderPageHref(leader);
          return `<tr><td><a href="${href}"><strong>${leader}</strong></a></td><td>${item}</td><td>${dimNote(dim)}</td></tr>`;
        })
        .join("\n");
      return `<h2>${region}</h2>
  <p>${PLAYER_UNLOCK[lang][region]}</p>
  <p>${overview}: <a href="${REGION_HUB[region]}">${region}</a> · ${nl ? "Tafel" : "Table"}: <strong>${meta.table}</strong></p>
  <table class="wikitable">
    <thead><tr><th>${hLeader}</th><th>${hItem}</th><th>${hNote}</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>`;
    })
    .join("\n\n");
}

export function gymMapsReferenceBodyEn(navbox) {
  return `
  <h2>What a gym map is</h2>
  <p>A finished gym map is a vanilla-style filled map with LumyMon components that point at a CobbleVerse <strong>structure</strong> (gym / league building). It is <em>not</em> a fixed X/Z bookmark baked into the pack — the cartography table finds a structure instance in <em>your</em> world, then writes marker + coordinates onto the map.</p>
  <ol class="steps">
    <li>Craft the leader’s <strong>special item</strong> (REI). That item carries <code>lumymon:structure_name</code> (and usually <code>lumymon:dimension_id</code> / map decoration).</li>
    <li>Put a fresh <strong>Empty Map</strong> + that item into the matching <strong>region cartography table</strong>.</li>
    <li>LumyMon localizes the structure and outputs a finished map you can hover for coordinates.</li>
  </ol>
  <div class="callout critical" role="note">
    <div class="label">Important</div>
    <p class="critical-text"><strong>Never open an Empty Map in the world first.</strong> That converts it into a useless filled map for gym crafting. Always use a fresh Empty Map in the table. Player walkthrough: <a href="Gym_Maps.html">Gym maps</a>.</p>
  </div>

  <h2>How maps are “made” (tech)</h2>
  <table class="wikitable">
    <thead><tr><th>Layer</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td>CobbleVerse worldgen</td><td>Defines structures like <code>cobbleverse:misty</code> / <code>cobbleverse:valerio</code> (region DPs gate Johto+).</td></tr>
      <tr><td>LumyMon recipes</td><td>Special items with NBT/components binding item → structure ID.</td></tr>
      <tr><td>Region cartography table</td><td>Block entity that consumes Empty Map + key item and writes the exploration map.</td></tr>
      <tr><td>Map Guide villager</td><td>Trades finished maps for that region when the matching table is placed next to an unemployed villager.</td></tr>
      <tr><td>PokeHaven Core</td><td><code>GymMapCatalog</code> lists leaders for staff grants; <code>GymMapGrant</code> calls LumyMon’s finalize logic (same as the table). Admin UI → Maps tab.</td></tr>
    </tbody>
  </table>
  <p>Staff grant keys match the catalog short id (e.g. <code>misty</code>, <code>valerio</code>, <code>blaine</code>) → structure <code>cobbleverse:&lt;key&gt;</code>. Blaine maps search the <strong>Nether</strong>.</p>

  <h2>Region unlock vs wild spawns</h2>
  <p>Wild Pokémon from Johto/Hoenn/Sinnoh can appear earlier from the main pack. <strong>Gym structures and region cartography content</strong> unlock with champion + datapack:</p>
  <table class="wikitable">
    <thead><tr><th>First champion</th><th>Datapack</th><th>Then</th></tr></thead>
    <tbody>
      <tr><td>Blue</td><td><code>COBBLEVERSE-Johto-DP.zip</code></td><td>1× server restart</td></tr>
      <tr><td>Lance</td><td><code>COBBLEVERSE-Hoenn-DP.zip</code></td><td>1× server restart</td></tr>
      <tr><td>Rocco</td><td><code>COBBLEVERSE-Sinnoh-DP.zip</code></td><td>1× server restart</td></tr>
    </tbody>
  </table>
  <p>Zips live under Apex <code>datapacks/extra/</code> until enabled. Old Kanto gyms stay after later unlocks.</p>

  <h2>Full catalog</h2>
  <p>Special-item display names follow LumyMon / REI. Craft recipes: search the item or leader in REI (<kbd>E</kbd>). Tell’s item binds to structure id <code>cobbleverse:tell</code> (recipe file may say <code>tell_pat</code>).</p>
  ${catalogTable("en", "Kanto", CATALOG.Kanto)}
  ${catalogTable("en", "Johto", CATALOG.Johto)}
  ${catalogTable("en", "Hoenn", CATALOG.Hoenn)}
  ${catalogTable("en", "Sinnoh", CATALOG.Sinnoh)}

  <h2>Player methods (summary)</h2>
  <ol class="steps">
    <li><strong>Craft:</strong> special item + Empty Map on the region table.</li>
    <li><strong>Map Guide:</strong> place that region’s cartography table next to an unemployed villager → trade maps.</li>
    <li><strong>Starter:</strong> Brock kit already includes table + Brock key + Empty Map.</li>
  </ol>

  <h2>Staff notes (PokeHaven)</h2>
  <ul>
    <li>Admin panel → <strong>Maps</strong>: grant a leader map to self / player / online (uses <code>GymMapGrant</code>).</li>
    <li>If grant fails with “structure not found”, the structure may not exist in loaded chunks yet — explore / generate more of that dimension, or the region DP is not loaded (restart after champion unlock).</li>
    <li>Map Guide trades: <code>/pha</code> map-guide refresh exists for trade-pool revisions after datapack edits.</li>
    <li>PokeHaven blocks opening Empty Maps that are only <em>named</em> like gym maps but still empty (<code>GymMapUseGuard</code>).</li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="Gym_Maps.html">Gym maps (how-to)</a> · <a href="Gyms_Kanto.html">Kanto</a> · <a href="Gyms_Johto.html">Johto</a> · <a href="Gyms_Hoenn.html">Hoenn</a> · <a href="Gyms_Sinnoh.html">Sinnoh</a> · <a href="Progression.html">Progression</a></p>
  ${navbox}
  `;
}

export function gymMapsReferenceBodyNl(navbox) {
  return `
  <h2>Wat een gym-map is</h2>
  <p>Een afgewerkte gym-map is een filled map met LumyMon-componenten die naar een CobbleVerse-<strong>structure</strong> wijzen (gym / league). Het is <em>geen</em> vaste X/Z uit de pack — de cartography-tafel zoekt een structure in <em>jouw</em> wereld en schrijft marker + coördinaten op de map.</p>
  <ol class="steps">
    <li>Craft het <strong>special item</strong> van de leader (REI). Dat item draagt <code>lumymon:structure_name</code> (en meestal dimensie / map-decoratie).</li>
    <li>Doe een verse <strong>Empty Map</strong> + dat item in de juiste <strong>regio-cartography-tafel</strong>.</li>
    <li>LumyMon lokaliseert de structure en geeft een afgewerkte map (hover = coördinaten).</li>
  </ol>
  <div class="callout critical" role="note">
    <div class="label">Belangrijk</div>
    <p class="critical-text"><strong>Open een Empty Map nooit eerst in de wereld.</strong> Dan is hij onbruikbaar voor gym-crafts. Spelersgids: <a href="Gym_Maps.html">Gym-maps</a>.</p>
  </div>

  <h2>Hoe maps “gemaakt” worden (technisch)</h2>
  <table class="wikitable">
    <thead><tr><th>Laag</th><th>Rol</th></tr></thead>
    <tbody>
      <tr><td>CobbleVerse worldgen</td><td>Structures zoals <code>cobbleverse:misty</code> / <code>cobbleverse:valerio</code> (Johto+ via regio-DP).</td></tr>
      <tr><td>LumyMon-recepten</td><td>Special items met components: item → structure-ID.</td></tr>
      <tr><td>Regio-cartography-tafel</td><td>Block entity: Empty Map + key → exploration map.</td></tr>
      <tr><td>Map Guide-villager</td><td>Trades afgewerkte maps als de matching tafel naast een unemployed villager staat.</td></tr>
      <tr><td>PokeHaven Core</td><td><code>GymMapCatalog</code> + <code>GymMapGrant</code> (zelfde LumyMon-finalize als de tafel). Admin UI → Maps.</td></tr>
    </tbody>
  </table>
  <p>Staff-grant keys = korte id (<code>misty</code>, <code>valerio</code>, <code>blaine</code>) → <code>cobbleverse:&lt;key&gt;</code>. Blaine zoekt in de <strong>Nether</strong>.</p>

  <h2>Regio-unlock vs wild spawns</h2>
  <p>Wilde Pokémon uit latere regio’s kunnen eerder al spawnen. <strong>Gym-structures + regio-cartography</strong> unlocken pas met champion + datapack:</p>
  <table class="wikitable">
    <thead><tr><th>Eerste champion</th><th>Datapack</th><th>Daarna</th></tr></thead>
    <tbody>
      <tr><td>Blue</td><td><code>COBBLEVERSE-Johto-DP.zip</code></td><td>1× server restart</td></tr>
      <tr><td>Lance</td><td><code>COBBLEVERSE-Hoenn-DP.zip</code></td><td>1× server restart</td></tr>
      <tr><td>Rocco</td><td><code>COBBLEVERSE-Sinnoh-DP.zip</code></td><td>1× server restart</td></tr>
    </tbody>
  </table>
  <p>Zips staan onder Apex <code>datapacks/extra/</code> tot enable. Oude Kanto-gyms blijven bestaan.</p>

  <h2>Volledige catalogus</h2>
  <p>Itemnamen volgen LumyMon / REI. Recepten: zoek item of leader in REI (<kbd>E</kbd>). Tell bindt op <code>cobbleverse:tell</code> (receptbestand kan <code>tell_pat</code> zeggen).</p>
  ${catalogTable("nl", "Kanto", CATALOG.Kanto)}
  ${catalogTable("nl", "Johto", CATALOG.Johto)}
  ${catalogTable("nl", "Hoenn", CATALOG.Hoenn)}
  ${catalogTable("nl", "Sinnoh", CATALOG.Sinnoh)}

  <h2>Spelersmethodes (kort)</h2>
  <ol class="steps">
    <li><strong>Craft:</strong> special item + Empty Map op de regio-tafel.</li>
    <li><strong>Map Guide:</strong> regio-tafel naast unemployed villager → traden.</li>
    <li><strong>Starter:</strong> Brock-kit = tafel + Brock-key + Empty Map.</li>
  </ol>

  <h2>Staff-notities (PokeHaven)</h2>
  <ul>
    <li>Admin-panel → <strong>Maps</strong>: map geven aan jezelf / speler / online (<code>GymMapGrant</code>).</li>
    <li>Grant faalt met “structure not found”? Structure zit nog niet in geladen chunks, of regio-DP is niet geladen (restart na champion-unlock).</li>
    <li>Map Guide-trades: refresh via <code>/pha</code> na datapack-wijzigingen aan trade-pools.</li>
    <li>PokeHaven blokkeert het openen van Empty Maps die alleen <em>ogen</em> als gym-map (<code>GymMapUseGuard</code>).</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Gym_Maps.html">Gym-maps (how-to)</a> · <a href="Gyms_Kanto.html">Kanto</a> · <a href="Gyms_Johto.html">Johto</a> · <a href="Gyms_Hoenn.html">Hoenn</a> · <a href="Gyms_Sinnoh.html">Sinnoh</a> · <a href="Progression.html">Progressie</a></p>
  ${navbox}
  `;
}

export const GYM_MAPS_REFERENCE_INFOBOX_EN = `<div class="infobox-title">Gym map reference</div>
  <table>
    <tr><th>Maps</th><td>36 (8 gyms + league × 4 regions)</td></tr>
    <tr><th>Engine</th><td>LumyMon cartography</td></tr>
    <tr><th>How-to</th><td><a href="Gym_Maps.html">Gym maps</a></td></tr>
    <tr><th>Staff</th><td>Admin → Maps</td></tr>
  </table>`;

/** RCT / LumyVerse spawn item — not a cartography key for Elite Four rooms. */
export function isEliteFour(g) {
  return g?.badge === "Elite Four";
}

export function leagueCartographyItem(region) {
  switch (region) {
    case "kanto":
      return "Rival Sling";
    case "johto":
      return "Master Cape";
    case "hoenn":
      return "Steel Hat";
    case "sinnoh":
      return "Draconic Fin";
    default:
      return "";
  }
}

/** Item you put with an Empty Map on the region cartography table. */
export function mapItemLabel(g) {
  if (!g) return "—";
  if (g.slug === "Brock") return "Brock Map Key";
  if (isEliteFour(g)) return leagueCartographyItem(g.region);
  return g.specialItem || "—";
}

/** Overview tables: E4 share one tower map, they do not have unique keys. */
export function mapItemTableLabel(g) {
  if (isEliteFour(g)) {
    const item = leagueCartographyItem(g.region);
    return `${item} (league tower)`;
  }
  return mapItemLabel(g);
}

export function teamLvRange(g) {
  const lv = (g?.team || []).map((m) => Number(m.level) || 0).filter((n) => n > 0);
  if (!lv.length) return "—";
  return `${Math.min(...lv)}–${Math.max(...lv)}`;
}

export function mapCraftSectionHtml(g, { lang, esc, figure, guideImg, critical, cartTable }) {
  const nl = lang === "nl";
  const item = mapItemLabel(g);
  const table = cartTable || "Cartography Table";
  const img = figure(
    guideImg("cartography-maps.png"),
    nl
      ? `<strong>${esc(table)}.</strong> Empty Map + cartography-item → afgewerkte map met coördinaten.`
      : `<strong>${esc(table)}.</strong> Empty Map + cartography item → finished map with coordinates.`,
    "Cartography / map crafting"
  );
  const warn = critical(
    nl ? "nl" : "en",
    nl
      ? "<strong>Open de Empty Map niet eerst in de wereld</strong> — gebruik de juiste regio-cartography-tafel."
      : "<strong>Do not open the Empty Map in the world first</strong> — that ruins it for gym crafting. Use the correct region cartography table."
  );

  if (isEliteFour(g)) {
    const spawn = g.specialItem || "—";
    if (nl) {
      return `<h3>Craft de map</h3>
  ${img}
  <p>Elite Four-members hebben <strong>geen eigen gym-map</strong>. Craft <strong>${esc(item)}</strong> (REI) + verse Empty Map op de <strong>${esc(table)}</strong> — die map wijst naar de <em>league-tower</em>, daarna loop je de kamers af.</p>
  <p class="muted"><strong>${esc(spawn)}</strong> is het RCT-signature-item (trainer-spawner), geen cartography-key.</p>
  ${warn}`;
    }
    return `<h3>Craft the map</h3>
    ${img}
    <p>Elite Four members do <strong>not</strong> have their own gym map. Craft <strong>${esc(item)}</strong> (REI) + a fresh Empty Map on the <strong>${esc(table)}</strong> — that map finds the <em>league tower</em>; then walk the rooms.</p>
    <p class="muted"><strong>${esc(spawn)}</strong> is the RCT signature / spawner item, not a cartography key.</p>
    ${warn}`;
  }

  if (nl) {
    return `<h3>Craft de map</h3>
  ${img}
  <ol class="steps">
    <li>Zoek <strong>${esc(g.name)}</strong> in REI en craft <strong>${esc(item)}</strong>.</li>
    <li>Craft een verse <strong>Empty Map</strong>.</li>
    <li>Combineer Empty Map + ${esc(item)} in de <strong>${esc(table)}</strong> (of Map Guide-villager).</li>
    <li>Hover voor coördinaten. Details: <a href="Gym_Maps.html">Gym-maps</a>.</li>
  </ol>
  ${warn}`;
  }
  return `<h3>Craft the map</h3>
    ${img}
    <ol class="steps">
      <li>Search <strong>${esc(g.name)}</strong> in REI and craft <strong>${esc(item)}</strong>.</li>
      <li>Craft a fresh <strong>Empty Map</strong>.</li>
      <li>Combine Empty Map + ${esc(item)} in the <strong>${esc(table)}</strong> (or trade a Map Guide villager).</li>
      <li>Hover the finished map for coordinates. Details: <a href="Gym_Maps.html">Gym maps</a>.</li>
    </ol>
    ${warn}`;
}

export const GYM_MAPS_REFERENCE_INFOBOX_NL = `<div class="infobox-title">Gym-map referentie</div>
  <table>
    <tr><th>Maps</th><td>36 (8 gyms + league × 4 regio’s)</td></tr>
    <tr><th>Engine</th><td>LumyMon cartography</td></tr>
    <tr><th>How-to</th><td><a href="Gym_Maps.html">Gym-maps</a></td></tr>
    <tr><th>Staff</th><td>Admin → Maps</td></tr>
  </table>`;
