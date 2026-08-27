/** Deep Fossil Hunting / Resurrection guide (EN + NL). */

import { critical } from "./i18n.js";

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

function figure(src, caption, alt = "", opts = {}) {
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

function guideImg(name) {
  return `../assets/guides/${name}`;
}

function singleFossilRows() {
  const rows = [
    ["Helix Fossil", "cobblemon:helix_fossil", "Omanyte"],
    ["Dome Fossil", "cobblemon:dome_fossil", "Kabuto"],
    ["Old Amber", "cobblemon:old_amber_fossil", "Aerodactyl"],
    ["Root Fossil", "cobblemon:root_fossil", "Lileep"],
    ["Claw Fossil", "cobblemon:claw_fossil", "Anorith"],
    ["Skull Fossil", "cobblemon:skull_fossil", "Cranidos"],
    ["Armor Fossil", "cobblemon:armor_fossil", "Shieldon"],
    ["Cover Fossil", "cobblemon:cover_fossil", "Tirtouga"],
    ["Plume Fossil", "cobblemon:plume_fossil", "Archen"],
    ["Jaw Fossil", "cobblemon:jaw_fossil", "Tyrunt"],
    ["Sail Fossil", "cobblemon:sail_fossil", "Amaura"],
  ];
  return rows
    .map(
      ([item, id, mon]) =>
        `<tr><td><strong>${item}</strong></td><td><code>${id}</code></td><td><strong>${mon}</strong></td></tr>`
    )
    .join("\n");
}

function galarRows() {
  return [
    ["Fossilized Bird", "Fossilized Drake", "Dracozolt"],
    ["Fossilized Bird", "Fossilized Dino", "Arctozolt"],
    ["Fossilized Fish", "Fossilized Drake", "Dracovish"],
    ["Fossilized Fish", "Fossilized Dino", "Arctovish"],
  ]
    .map(
      ([a, b, mon]) =>
        `<tr><td><strong>${a}</strong></td><td><strong>${b}</strong></td><td><strong>${mon}</strong></td></tr>`
    )
    .join("\n");
}

/** NL pages live under nl/pages/ — bump guide paths one level. */
function nlImg(name) {
  return guideImg(name).replace("../assets/", "../../assets/");
}

export const FOSSILS_INFOBOX_EN = `<div class="infobox-title">Fossil hunting</div>
<table>
  <tr><th>Machines</th><td>Fossil Analyzer · Restoration Tank · Monitor</td></tr>
  <tr><th>Revive time</th><td>~10 minutes (12000 ticks)</td></tr>
  <tr><th>Slots</th><td>Up to <strong>2</strong> fossil pieces (Galar combos)</td></tr>
  <tr><th>Quests</th><td><a href="Quests.html">Fossils and TM Lab</a></td></tr>
  <tr><th>Post-game</th><td><a href="Postgame_and_Legendaries.html">Mew / Mewtwo</a></td></tr>
</table>`;

export const FOSSILS_INFOBOX_NL = `<div class="infobox-title">Fossil hunting</div>
<table>
  <tr><th>Machines</th><td>Fossil Analyzer · Restoration Tank · Monitor</td></tr>
  <tr><th>Revive-tijd</th><td>~10 minuten (12000 ticks)</td></tr>
  <tr><th>Slots</th><td>Max. <strong>2</strong> fossil-stukken (Galar-combo’s)</td></tr>
  <tr><th>Quests</th><td><a href="Quests.html">Fossils and TM Lab</a></td></tr>
  <tr><th>Post-game</th><td><a href="Postgame_and_Legendaries.html">Mew / Mewtwo</a></td></tr>
</table>`;

export function fossilsBodyEn(navbox) {
  return `
  <h2>What this page covers</h2>
  <p>Everything you need for <strong>fossil hunting and resurrection</strong> on PokeHaven EU (CobbleVerse 1.7.42): where fossils drop, which machines to build, every standard fossil → Pokémon, Galar two-piece combos, quests, PokeHaven bonuses, and the late-game Origin Fossil / Ancient DNA routes.</p>
  <ul>
    <li>There is <strong>no “DNA Synthesizer”</strong> block in this pack — revival uses Cobblemon’s <strong>Restoration Tank</strong> (also called Fossil Machine / Resurrection Machine in quests).</li>
    <li>Always check <strong>REI</strong> (<kbd>E</kbd>) for live crafts — recipes beat any screenshot.</li>
  </ul>

  ${figure(
    guideImg("fossil-machine-loop.png"),
    "<strong>Core loop.</strong> Find fossils → analyze → restore in the tank → receive a Pokémon.",
    "Fossil revival loop diagram"
  )}

  <h2>Quick start</h2>
  <ol class="steps">
    <li>Get any fossil (caves, desert/swamp worldgen, archaeology, loot, Team Rocket scientists).</li>
    <li>Craft a <strong>Fossil Analyzer</strong>, <strong>Restoration Tank</strong>, and <strong>Monitor</strong> (REI: search those names).</li>
    <li>Place them as a working fossil machine setup (quest text: “assemble a Restoration Tank”).</li>
    <li>Insert fossil(s) — Galar forms need <strong>two</strong> matching pieces.</li>
    <li>Wait ~<strong>10 minutes</strong> for resurrection, then claim the Pokémon.</li>
  </ol>
  ${critical(
    "en",
    "<strong>Protected machines:</strong> if a fossil machine belongs to another player you will see a protect toast — claim your own setup with FTB Chunks."
  )}

  <h2>Where fossils come from</h2>
  ${figure(
    guideImg("fossil-sources.png"),
    "<strong>Main sources.</strong> Desert/swamp worldgen, archaeology &amp; caves, plus Team Rocket scientist loot.",
    "Fossil drop sources diagram"
  )}
  <table class="wikitable">
    <thead><tr><th>Source</th><th>What you get</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td><strong>Desert &amp; swamp</strong> biomes</td><td>Vanilla fossil features in worldgen</td><td>Dig / explore those biomes</td></tr>
      <tr><td><strong>Archaeology</strong> (suspicious sand/gravel)</td><td>Fossils + other ruin loot</td><td>Brush; Luck “Fossil Favor” can boost related drops</td></tr>
      <tr><td><strong>Caves / chests / loot tables</strong></td><td>Standard Cobblemon fossils</td><td>Quest copy: “caves / loot”</td></tr>
      <tr><td><strong>Team Rocket scientists</strong></td><td>Fossil pool on wins</td><td>First clear can also drop <code>lumymon:fossilized_helmet</code> (Type: Null)</td></tr>
      <tr><td><strong>Legendary archaeology / fishing</strong> (RCT tables)</td><td>Extra fossil rolls</td><td>Late / specialty loot</td></tr>
      <tr><td><strong>Cobbleworkers Archeologist</strong></td><td>Archaeology-style loot</td><td>See <a href="Cobbleworkers.html">Cobbleworkers</a></td></tr>
    </tbody>
  </table>
  <p>Holding any item in the Cobblemon fossils tag auto-completes the FTB quest <strong>Obtain a fossil</strong> (<a href="Quests.html">Quests</a> → Fossils and TM Lab).</p>

  <h2>Machines &amp; settings (PokeHaven)</h2>
  <table class="wikitable">
    <thead><tr><th>Machine</th><th>Item ID</th><th>Job</th></tr></thead>
    <tbody>
      <tr><td><strong>Fossil Analyzer</strong></td><td><code>cobblemon:fossil_analyzer</code></td><td>Reads / prepares fossils for the tank</td></tr>
      <tr><td><strong>Restoration Tank</strong></td><td><code>cobblemon:restoration_tank</code></td><td>Actually resurrects the Pokémon</td></tr>
      <tr><td><strong>Monitor</strong></td><td><code>cobblemon:monitor</code></td><td>Part of the machine assembly</td></tr>
    </tbody>
  </table>
  <table class="wikitable">
    <thead><tr><th>Config</th><th>Value on PokeHaven</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><code>maxInsertedFossilItems</code></td><td><strong>2</strong></td><td>Enables Galar two-piece fossils</td></tr>
      <tr><td><code>fossilMachineResurrectionTime</code></td><td><strong>12000</strong> ticks</td><td>~10 minutes per revive</td></tr>
    </tbody>
  </table>
  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>Use REI for crafts.</strong> Search Fossil Analyzer / Restoration Tank / each fossil name — live recipes beat wiki screenshots.",
    "REI crafting reference"
  )}

  <h2>Standard fossils → Pokémon</h2>
  <p>One fossil piece → one Pokémon (Cobblemon defaults; not overridden by CobbleVerse datapack).</p>
  <table class="wikitable">
    <thead><tr><th>Fossil item</th><th>Item ID</th><th>Pokémon</th></tr></thead>
    <tbody>
${singleFossilRows()}
    </tbody>
  </table>

  <h2>Galar fossils (two pieces)</h2>
  <p>Insert <strong>both</strong> pieces into the machine (2-slot config). Wrong pairing = wrong (or no) result — match the table.</p>
  <table class="wikitable">
    <thead><tr><th>Piece A</th><th>Piece B</th><th>Pokémon</th></tr></thead>
    <tbody>
${galarRows()}
    </tbody>
  </table>
  <p>Item IDs: <code>cobblemon:fossilized_bird</code>, <code>fossilized_fish</code>, <code>fossilized_drake</code>, <code>fossilized_dino</code>.</p>
  <p>Achievement: <em>Didn’t Stop to Think</em> (Galar revive) — see <a href="Achievements.html">Achievements</a>.</p>

  <h2>Pack specials (not normal fossils)</h2>
  <table class="wikitable">
    <thead><tr><th>Inputs</th><th>Result</th><th>How you get it</th></tr></thead>
    <tbody>
      <tr><td><code>lumymon:ancient_dna</code> + <code>lumymon:cloning_catalyst</code></td><td><strong>Mewtwo</strong></td><td>Ancient DNA (Giovanni / Mew shrine) + craft catalyst (REI)</td></tr>
      <tr><td><code>lumymon:ancient_dna</code> + <code>lumymon:cloning_catalyst_shiny</code></td><td><strong>Shiny Mewtwo</strong></td><td>Same DNA path, shiny catalyst</td></tr>
      <tr><td><code>cobblemon:dome_fossil</code> + <code>dubious_disc</code> + <code>nether_star</code></td><td><strong>Genesect</strong></td><td>Pack fossil recipe override</td></tr>
      <tr><td><code>lumymon:fossilized_helmet</code></td><td><strong>Type: Null</strong></td><td>Team Rocket scientist first clear</td></tr>
      <tr><td><code>lumymon:origin_fossil</code></td><td><strong>Mew</strong> route</td><td>Craft after <a href="Blue.html">Champion Blue</a> — full steps on <a href="Postgame_and_Legendaries.html">Post-game</a></td></tr>
    </tbody>
  </table>
  ${critical(
    "en",
    "<strong>Ancient DNA:</strong> Giovanni’s <em>1st win</em> and Mew shrine chests. Origin Fossil craft (Mew) <em>uses</em> DNA; Mewtwo cloning needs DNA too — two DNA for both. Details: <a href=\"Postgame_and_Legendaries.html\">Post-game and legendaries</a>."
  )}

  <h2>Quests — Fossils and TM Lab</h2>
  <p>Open the quest book with <kbd>O</kbd>. Chapter under Trainer Systems:</p>
  <table class="wikitable">
    <thead><tr><th>Quest</th><th>What to do</th></tr></thead>
    <tbody>
      <tr><td><strong>Obtain a fossil</strong></td><td>Hold any <code>#cobblemon:fossils</code> item (auto-grants)</td></tr>
      <tr><td><strong>Resurrect a fossil</strong></td><td>Complete a revive in the Restoration Tank</td></tr>
      <tr><td><strong>Craft TM / star TM</strong></td><td>TM Lab half of the chapter — finishes the chain (star TM rewards include a Master Ball)</td></tr>
    </tbody>
  </table>

  <h2>PokeHaven bonuses</h2>
  <table class="wikitable">
    <thead><tr><th>Feature</th><th>Effect</th></tr></thead>
    <tbody>
      <tr><td><strong>Luck of the Draw — Fossil Favor</strong></td><td>On revive: bonus Rare Candy + Exp Candy M</td></tr>
      <tr><td><strong>Did-you-know tip</strong></td><td>Fossil Favor also ties into archaeology candy/fossil drop messaging</td></tr>
      <tr><td><strong>Machine protect feedback</strong></td><td>Clear toast if you interact with someone else’s fossil machine</td></tr>
    </tbody>
  </table>

  <h2>Achievements checklist</h2>
  <table class="wikitable">
    <thead><tr><th>Tab</th><th>Examples</th></tr></thead>
    <tbody>
      <tr><td>Cobblemon geological</td><td>Consult the Fossil · Life Finds a Way · Didn’t Stop to Think</td></tr>
      <tr><td>CobbleVerse post-game</td><td>Craft Origin Fossil · Obtain Ancient DNA · Revive Mewtwo · Catch Mew</td></tr>
    </tbody>
  </table>
  <p>Full lists: <a href="Achievements.html">Achievements</a>.</p>

  <h2>Common mistakes</h2>
  <table class="wikitable">
    <thead><tr><th>Mistake</th><th>Fix</th></tr></thead>
    <tbody>
      <tr class="critical-row"><td>Expecting a “DNA Synthesizer”</td><td>Use Restoration Tank + Analyzer + Monitor</td></tr>
      <tr class="critical-row"><td>Only one Galar piece inserted</td><td>Need both pieces (2 slots)</td></tr>
      <tr><td>Leaving revive unclaimed / unprotected</td><td>Claim the chunks; wait the full ~10 minutes</td></tr>
      <tr><td>Skipping REI for Origin Fossil / catalysts</td><td>Search the exact item name after Blue / Giovanni</td></tr>
      <tr><td>Using someone else’s tank</td><td>Build your own — protect toast otherwise</td></tr>
    </tbody>
  </table>

  <p class="see-also"><strong>See also:</strong> <a href="Postgame_and_Legendaries.html">Post-game and legendaries</a> · <a href="Quests.html">Quests</a> · <a href="Achievements.html">Achievements</a> · <a href="Recipe_Browser.html">Recipe browser</a> · <a href="Cobbleworkers.html">Cobbleworkers</a> · <a href="Progression.html">Progression</a></p>
  ${navbox}
  `;
}

export function fossilsBodyNl(navbox) {
  return `
  <h2>Wat deze pagina dekt</h2>
  <p>Alles over <strong>fossil hunting en resurrectie</strong> op PokeHaven EU (CobbleVerse 1.7.42): waar fossils droppen, welke machines je bouwt, elke standaard fossil → Pokémon, Galar 2-stuk combo’s, quests, PokeHaven-bonussen, en late-game Origin Fossil / Ancient DNA.</p>
  <ul>
    <li>Er is <strong>geen “DNA Synthesizer”</strong> in deze pack — revive gaat via Cobblemon’s <strong>Restoration Tank</strong> (in quests ook Fossil Machine / Resurrection Machine).</li>
    <li>Check altijd <strong>REI</strong> (<kbd>E</kbd>) voor live recepten — die winnen van screenshots.</li>
  </ul>

  ${figure(
    nlImg("fossil-machine-loop.png"),
    "<strong>Kernloop.</strong> Vind fossils → analyzer → restoration tank → Pokémon.",
    "Fossil revive-loop diagram"
  )}

  <h2>Snel starten</h2>
  <ol class="steps">
    <li>Pak een fossil (caves, desert/swamp, archaeology, loot, Team Rocket scientists).</li>
    <li>Craft <strong>Fossil Analyzer</strong>, <strong>Restoration Tank</strong> en <strong>Monitor</strong> (REI).</li>
    <li>Zet ze als werkende fossil-machine (quest: “assemble a Restoration Tank”).</li>
    <li>Doe fossil(s) erin — Galar heeft <strong>twee</strong> bijpassende stukken nodig.</li>
    <li>Wacht ~<strong>10 minuten</strong>, claim daarna je Pokémon.</li>
  </ol>
  ${critical(
    "nl",
    "<strong>Beschermde machines:</strong> hoort de fossil-machine bij iemand anders, krijg je een protect-toast — claim je eigen setup met FTB Chunks."
  )}

  <h2>Waar fossils vandaan komen</h2>
  ${figure(
    nlImg("fossil-sources.png"),
    "<strong>Belangrijkste bronnen.</strong> Desert/swamp-worldgen, archaeology &amp; caves, plus Team Rocket scientist-loot.",
    "Fossil-bronnen diagram"
  )}
  <table class="wikitable">
    <thead><tr><th>Bron</th><th>Wat je krijgt</th><th>Notitie</th></tr></thead>
    <tbody>
      <tr><td><strong>Desert &amp; swamp</strong></td><td>Vanilla fossil-features</td><td>Verken die biomes</td></tr>
      <tr><td><strong>Archaeology</strong></td><td>Fossils + ruin-loot</td><td>Brushen; Luck “Fossil Favor” helpt</td></tr>
      <tr><td><strong>Caves / chests / loot</strong></td><td>Standaard Cobblemon-fossils</td><td>Quest-tekst: “caves / loot”</td></tr>
      <tr><td><strong>Team Rocket scientists</strong></td><td>Fossil-pool bij wins</td><td>Eerste clear kan <code>lumymon:fossilized_helmet</code> (Type: Null) geven</td></tr>
      <tr><td><strong>Legendary archaeology / fishing</strong></td><td>Extra fossil-rolls</td><td>Late / specialty loot</td></tr>
      <tr><td><strong>Cobbleworkers Archeologist</strong></td><td>Archaeology-achtige loot</td><td>Zie <a href="Cobbleworkers.html">Cobbleworkers</a></td></tr>
    </tbody>
  </table>
  <p>Elk item in de Cobblemon fossils-tag in je inventaris voltooit automatisch de quest <strong>Obtain a fossil</strong> (<a href="Quests.html">Quests</a> → Fossils and TM Lab).</p>

  <h2>Machines &amp; settings (PokeHaven)</h2>
  <table class="wikitable">
    <thead><tr><th>Machine</th><th>Item-ID</th><th>Rol</th></tr></thead>
    <tbody>
      <tr><td><strong>Fossil Analyzer</strong></td><td><code>cobblemon:fossil_analyzer</code></td><td>Bereidt fossils voor de tank</td></tr>
      <tr><td><strong>Restoration Tank</strong></td><td><code>cobblemon:restoration_tank</code></td><td>Resurrecteert de Pokémon</td></tr>
      <tr><td><strong>Monitor</strong></td><td><code>cobblemon:monitor</code></td><td>Onderdeel van de setup</td></tr>
    </tbody>
  </table>
  <table class="wikitable">
    <thead><tr><th>Config</th><th>Waarde</th><th>Betekenis</th></tr></thead>
    <tbody>
      <tr><td><code>maxInsertedFossilItems</code></td><td><strong>2</strong></td><td>Galar 2-stuk fossils</td></tr>
      <tr><td><code>fossilMachineResurrectionTime</code></td><td><strong>12000</strong> ticks</td><td>~10 minuten per revive</td></tr>
    </tbody>
  </table>
  ${figure(
    nlImg("rei-crafting.png"),
    "<strong>REI voor crafts.</strong> Zoek Fossil Analyzer / Restoration Tank / fossil-namen — live recepten winnen van screenshots.",
    "REI crafting referentie"
  )}

  <h2>Standaard fossils → Pokémon</h2>
  <p>Eén fossil → één Pokémon (Cobblemon-defaults).</p>
  <table class="wikitable">
    <thead><tr><th>Fossil-item</th><th>Item-ID</th><th>Pokémon</th></tr></thead>
    <tbody>
${singleFossilRows()}
    </tbody>
  </table>

  <h2>Galar-fossils (twee stukken)</h2>
  <p>Doe <strong>beide</strong> stukken in de machine. Verkeerde pairing = verkeerd (of geen) resultaat.</p>
  <table class="wikitable">
    <thead><tr><th>Stuk A</th><th>Stuk B</th><th>Pokémon</th></tr></thead>
    <tbody>
${galarRows()}
    </tbody>
  </table>
  <p>Item-IDs: <code>cobblemon:fossilized_bird</code>, <code>fossilized_fish</code>, <code>fossilized_drake</code>, <code>fossilized_dino</code>.</p>
  <p>Achievement: <em>Didn’t Stop to Think</em> — <a href="Achievements.html">Achievements</a>.</p>

  <h2>Pack-specials</h2>
  <table class="wikitable">
    <thead><tr><th>Inputs</th><th>Resultaat</th><th>Hoe</th></tr></thead>
    <tbody>
      <tr><td><code>lumymon:ancient_dna</code> + <code>lumymon:cloning_catalyst</code></td><td><strong>Mewtwo</strong></td><td>Ancient DNA (Giovanni / Mew-shrine) + catalyst (REI)</td></tr>
      <tr><td><code>lumymon:ancient_dna</code> + <code>lumymon:cloning_catalyst_shiny</code></td><td><strong>Shiny Mewtwo</strong></td><td>Zelfde DNA, shiny catalyst</td></tr>
      <tr><td><code>dome_fossil</code> + <code>dubious_disc</code> + <code>nether_star</code></td><td><strong>Genesect</strong></td><td>Pack-override</td></tr>
      <tr><td><code>lumymon:fossilized_helmet</code></td><td><strong>Type: Null</strong></td><td>Rocket scientist first clear</td></tr>
      <tr><td><code>lumymon:origin_fossil</code></td><td><strong>Mew</strong>-route</td><td>Craft na <a href="Blue.html">Champion Blue</a> — <a href="Postgame_and_Legendaries.html">Post-game</a></td></tr>
    </tbody>
  </table>
  ${critical(
    "nl",
    "<strong>Ancient DNA:</strong> Giovanni’s <em>1e win</em> en Mew-shrine-chests. Origin Fossil (Mew) <em>verbruikt</em> DNA; Mewtwo-clonen ook — twee DNA voor beide. Details: <a href=\"Postgame_and_Legendaries.html\">Post-game</a>."
  )}

  <h2>Quests — Fossils and TM Lab</h2>
  <table class="wikitable">
    <thead><tr><th>Quest</th><th>Wat te doen</th></tr></thead>
    <tbody>
      <tr><td><strong>Obtain a fossil</strong></td><td>Houd een <code>#cobblemon:fossils</code>-item vast (auto)</td></tr>
      <tr><td><strong>Resurrect a fossil</strong></td><td>Voltooi een revive in de Restoration Tank</td></tr>
      <tr><td><strong>Craft TM / star TM</strong></td><td>TM Lab-helft van het chapter (star TM → o.a. Master Ball)</td></tr>
    </tbody>
  </table>

  <h2>PokeHaven-bonussen</h2>
  <table class="wikitable">
    <thead><tr><th>Feature</th><th>Effect</th></tr></thead>
    <tbody>
      <tr><td><strong>Luck — Fossil Favor</strong></td><td>Bij revive: bonus Rare Candy + Exp Candy M</td></tr>
      <tr><td><strong>Did-you-know tip</strong></td><td>Koppelt Fossil Favor aan archaeology-drops</td></tr>
      <tr><td><strong>Machine protect</strong></td><td>Toast bij andermans fossil-machine</td></tr>
    </tbody>
  </table>

  <h2>Achievements</h2>
  <table class="wikitable">
    <thead><tr><th>Tab</th><th>Voorbeelden</th></tr></thead>
    <tbody>
      <tr><td>Cobblemon geological</td><td>Consult the Fossil · Life Finds a Way · Didn’t Stop to Think</td></tr>
      <tr><td>CobbleVerse post-game</td><td>Origin Fossil · Ancient DNA · Revive Mewtwo · Catch Mew</td></tr>
    </tbody>
  </table>
  <p>Volledige lijsten: <a href="Achievements.html">Achievements</a>.</p>

  <h2>Veelgemaakte fouten</h2>
  <table class="wikitable">
    <thead><tr><th>Fout</th><th>Fix</th></tr></thead>
    <tbody>
      <tr class="critical-row"><td>“DNA Synthesizer” zoeken</td><td>Restoration Tank + Analyzer + Monitor</td></tr>
      <tr class="critical-row"><td>Slechts één Galar-stuk</td><td>Beide stukken (2 slots)</td></tr>
      <tr><td>Unclaimed / te vroeg weg</td><td>Claim chunks; wacht ~10 min</td></tr>
      <tr><td>REI overslaan voor Origin Fossil</td><td>Zoek de exacte itemnaam na Blue / Giovanni</td></tr>
      <tr><td>Andermans tank gebruiken</td><td>Bouw je eigen setup</td></tr>
    </tbody>
  </table>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Quests.html">Quests</a> · <a href="Achievements.html">Achievements</a> · <a href="Recipe_Browser.html">Recipe browser</a> · <a href="Cobbleworkers.html">Cobbleworkers</a> · <a href="Progression.html">Progressie</a></p>
  ${navbox}
  `;
}
