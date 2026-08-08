/**
 * Dutch (NL) wiki pages — hub + core guides, with stubs for the rest.
 */

import { figure } from "./deep-pages.js";
import { DISCORD_INVITE, critical } from "./i18n.js";
import { advancementTableRows, groupTitle } from "./advancement-copy.js";

/** Screenshots from nl/pages/*.html → repo assets/guides/ */
function guideImg(name) {
  return `../../assets/guides/${name}`;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function itemNice(s) {
  return String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

function crumbs(...parts) {
  const items = [{ label: "Hoofdpagina", href: "../index.html" }];
  for (const p of parts) items.push(p);
  return items;
}

function navboxCore() {
  return `<div class="navbox">
    <div class="navbox-title">PokeHaven systemen</div>
    <div class="navbox-row"><div class="navbox-label">Kern</div><div class="navbox-links">
      <a href="Economy.html">Economie</a>
      <a href="Raids.html">Raids</a>
      <a href="Catching_and_Battling.html">Vangen &amp; vechten</a>
      <a href="Poke_Balls.html">Poké Balls</a>
      <a href="Essential_Recipes.html">Essentiële recepten</a>
      <a href="Healing_and_Storage.html">Genezen</a>
      <a href="Breeding.html">Broeden</a>
      <a href="Fishing.html">Vissen</a>
      <a href="Outfits_and_Cosmetics.html">Outfits &amp; cosmetics</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">Wereld</div><div class="navbox-links">
      <a href="Claims.html">Claims</a>
      <a href="Travel.html">Reizen</a>
      <a href="Riding.html">Rijden</a>
      <a href="Voice_Chat.html">Voice chat</a>
      <a href="Minecraft_Hub.html">Minecraft-hub</a>
    </div></div>
    <div class="navbox-row"><div class="navbox-label">Hulp</div><div class="navbox-links">
      <a href="Pack_Differences.html">Pack-verschillen</a>
      <a href="Roadmap.html">30-dagen roadmap</a>
      <a href="Achievements.html">Achievements</a>
      <a href="Postgame_and_Legendaries.html">Post-game</a>
      <a href="Common_Mistakes.html">Veelgemaakte fouten</a>
      <a href="FAQ.html">FAQ</a>
      <a href="Recipe_Browser.html">Receptenbrowser</a>
      <a href="Trainer_Index.html">Trainer-index</a>
      <a href="Raid_Bosses.html">Raid-bosses</a>
      <a href="Spawn_Lookup.html">Spawn-lookup</a>
    </div></div>
  </div>`;
}

export function registerDutchSite({
  writePage,
  recipesMeta,
  trainers,
  raids,
  spawns,
  advancements,
  searchIndex,
  searchIndexNl,
}) {
  const nl = (file, opts) => writePage(file, { ...opts, lang: "nl" });
  const written = new Set();
  const track = (file, opts) => {
    nl(file, opts);
    written.add(file);
  };

  track("index.html", {
    title: "PokeHaven EU Wiki",
    searchIndexTitle: "Hoofdpagina",
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
      <span class="chip">Nederlands</span>
    </div>
    <h1 class="landing-brand">PokeHaven EU</h1>
    <p class="landing-lead">Spelerswiki voor onze CobbleVerse-server — joinen, gyms, recepten en survival.</p>
    <div class="join-cta">
      <div class="join-cta-main">
        <span class="join-label">Join de server</span>
        <strong class="join-name">PokeHaven EU</strong>
        <span class="join-meta">Pack <strong>1.7.42</strong> · IP alleen via Discord</span>
      </div>
      <div class="join-cta-actions">
        <a class="join-btn" href="pages/Getting_Started.html">Hoe te joinen</a>
        <a class="join-btn-discord" href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a>
      </div>
    </div>
  </section>

  <h2>Nieuwe spelers</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Getting_Started.html"><h3>Aan de slag</h3><p>Installeer 1.7.42 en join.</p></a>
    <a class="hub-card" href="pages/First_Hours.html"><h3>Eerste uren</h3><p>Checklist met HUD-screenshots.</p></a>
    <a class="hub-card" href="pages/Brock.html"><h3>Brock</h3><p>Eerste gym, diepe gids.</p></a>
    <a class="hub-card" href="pages/Level_Cap.html"><h3>Level cap</h3><p>Waarom XP stopt — en de ladder.</p></a>
    <a class="hub-card" href="pages/Essential_Recipes.html"><h3>Essentiële recepten</h3><p>Balls, maps, tools, REI.</p></a>
    <a class="hub-card" href="pages/FAQ.html"><h3>FAQ</h3><p>Join-problemen &amp; fixes.</p></a>
  </div>

  <h2>Gyms &amp; progressie</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Gyms_Kanto.html"><h3>Kanto</h3><p>Alle 8 leaders + Elite Four.</p></a>
    <a class="hub-card" href="pages/Misty.html"><h3>Misty</h3><p>Tweede gym, diepe gids.</p></a>
    <a class="hub-card" href="pages/Gym_Maps.html"><h3>Gym-maps</h3><p>Cartography &amp; coördinaten.</p></a>
    <a class="hub-card" href="pages/Progression.html"><h3>Progressie</h3><p>Regio’s &amp; gym-loop.</p></a>
    <a class="hub-card" href="pages/Achievements.html"><h3>Achievements</h3><p>Pack advancement-checklist.</p></a>
    <a class="hub-card" href="pages/Postgame_and_Legendaries.html"><h3>Post-game</h3><p>Mew, birds, Mewtwo.</p></a>
  </div>

  <h2>Minecraft &amp; recepten</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Minecraft_Hub.html"><h3>Minecraft-hub</h3><p>Survival-gidsen op één plek.</p></a>
    <a class="hub-card" href="pages/Poke_Balls.html"><h3>Poké Balls</h3><p>Apricorns + screenshots.</p></a>
    <a class="hub-card" href="pages/Recipe_Browser.html"><h3>Receptenbrowser</h3><p>${recipesMeta.count} datapack-crafts.</p></a>
    <a class="hub-card" href="pages/Economy.html"><h3>Economie</h3><p>Shop- &amp; bankprijzen.</p></a>
  </div>

  <h2>Systemen</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Catching_and_Battling.html"><h3>Vangen &amp; vechten</h3><p>Combat-primer.</p></a>
    <a class="hub-card" href="pages/Raids.html"><h3>Raids</h3><p>Dens en tiers.</p></a>
    <a class="hub-card" href="pages/Claims.html"><h3>Claims</h3><p>FTB Chunks.</p></a>
    <a class="hub-card" href="pages/Travel.html"><h3>Reizen</h3><p>Waystones.</p></a>
    <a class="hub-card" href="pages/Breeding.html"><h3>Broeden</h3><p>Pasture-setup.</p></a>
    <a class="hub-card" href="pages/Fishing.html"><h3>Vissen</h3><p>Cobblemon-hengels en water-catches.</p></a>
    <a class="hub-card" href="pages/Outfits_and_Cosmetics.html"><h3>Outfits &amp; cosmetics</h3><p>Trainerkleding &amp; Pokémon-looks.</p></a>
    <a class="hub-card" href="pages/Common_Mistakes.html"><h3>Veelgemaakte fouten</h3><p>Één keer maken.</p></a>
  </div>

  <h2>Databases</h2>
  <div class="hub-grid hub-grid-compact">
    <a class="hub-card" href="pages/Trainer_Index.html"><h3>Trainer-index</h3><p>${trainers.all.length} trainers.</p></a>
    <a class="hub-card" href="pages/Raid_Bosses.html"><h3>Raid-bosses</h3><p>${raids.bosses.length} bosses.</p></a>
    <a class="hub-card" href="pages/Spawn_Lookup.html"><h3>Spawn-lookup</h3><p>${spawns.length} spawn-rijen.</p></a>
  </div>
  `,
  });

  track("Getting_Started.html", {
    title: "Aan de slag",
    searchIndexTitle: "Aan de slag",
    breadcrumbs: crumbs({ label: "Aan de slag", href: "Getting_Started.html" }),
    lede: "Installeer CobbleVerse <strong>1.7.42</strong>, join <strong>PokeHaven EU</strong>, en ken de woorden die de rest van de wiki gebruikt.",
    body: `
  <h2>Wat je nodig hebt</h2>
  <ul>
    <li>Minecraft <strong>Java Edition</strong> (Microsoft-account)</li>
    <li><strong>CurseForge</strong>-app</li>
    <li>Onze gedeelde pack-zip — <strong>exact 1.7.42</strong>, gelijk aan de server</li>
  </ul>

  ${figure(
    guideImg("multiplayer-join.png"),
    "<strong>Klaar om te spelen.</strong> Na import: naar het menu, daarna <code>PokeHaven EU</code> toevoegen in Multiplayer. Het IP wisselt — kopieer het altijd uit Discord, nooit uit oude screenshots.",
    "CobbleVerse-client klaar voor multiplayer"
  )}

  <h2>Installatie</h2>
  <ol class="steps">
    <li>Installeer CurseForge en log in.</li>
    <li>Custom Profile → <strong>Import</strong> de gedeelde pack-zip.</li>
    <li>Wacht tot elke mod klaar is — niet afbreken.</li>
    <li>Start één keer tot het hoofdmenu, sluit af, start opnieuw (resource packs settelen).</li>
    <li>Multiplayer → Add Server:<br/>
      Naam: <code>PokeHaven EU</code><br/>
      Adres: IP uit <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a> <code>#how-to-join</code>.</li>
  </ol>

  <div class="callout tip">
    <div class="label">Join-checklist</div>
    Servernaam: <strong>PokeHaven EU</strong>. Pack: <strong>1.7.42</strong>. IP alleen via <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a> (kan roteren).
  </div>

  ${critical(
    "nl",
    "<strong>Kun je niet joinen?</strong> Bijna altijd een pack-mismatch. Importeer opnieuw CobbleVerse <strong>1.7.42</strong>. IP alleen uit Discord — nooit uit oude screenshots."
  )}

  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>Leer REI op dag één.</strong> Open inventaris (<kbd>E</kbd>) en zoek elk recept in de zijbalk. De wiki toont de workflow; REI toont het live grid.",
    "Receptzoeken in inventaris"
  )}

  <h2>Woordenlijst</h2>
  <table class="wikitable">
    <thead><tr><th>Term</th><th>Betekenis</th></tr></thead>
    <tbody>
      <tr><td>PokeHaven EU</td><td>Onze multiplayer-server</td></tr>
      <tr><td>CobbleVerse</td><td>De modpack die je installeert</td></tr>
      <tr><td>Level cap</td><td>Levels bevriezen tot de volgende gym valt</td></tr>
      <tr><td>Claim</td><td>Land beschermen met FTB Chunks</td></tr>
      <tr><td>Waystone</td><td>Teleport-steen</td></tr>
      <tr><td>REI</td><td>Recepten zoeken met inventaris open (<kbd>E</kbd>)</td></tr>
    </tbody>
  </table>

  <h2>Hulp nodig?</h2>
  <p><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a> — pack-zip, live IP en support. Stuur screenshot + wat je al probeerde.</p>

  <h2>Wat nu lezen</h2>
  <ol>
    <li><a href="First_Hours.html">Eerste uren</a></li>
    <li><a href="Poke_Balls.html">Poké Balls</a></li>
    <li><a href="Brock.html">Brock</a> → <a href="Misty.html">Misty</a></li>
    <li><a href="Level_Cap.html">Level cap</a></li>
  </ol>
  ${navboxCore()}
  `,
  });

  track("First_Hours.html", {
    title: "Eerste uren",
    breadcrumbs: crumbs({ label: "Eerste uren", href: "First_Hours.html" }),
    lede: "Dichte openingsgids: van inloggen tot geclaimde basis, klein team, en de weg naar Brock.",
    body: `
  ${figure(
    guideImg("hud.png"),
    "<strong>Je HUD.</strong> Links: party. Rechtsboven: minimap + coördinaten. Onder: hotbar — houd balls, eten en je Brock-gymmap hier.",
    "Voorbeeld-HUD"
  )}

  <h2>Minuut-voor-minuut checklist</h2>
  <ol class="steps">
    <li>Druk <kbd>C</kbd> → kies starter. Gras is het veiligst tegen Brock.</li>
    <li>Open <kbd>E</kbd> en check starterkit: guide book, Brock-mapkit (cartography table + key + Empty Map), balls, berries, Trainer Card.</li>
    <li>Plaats een bed en slaap één keer (respawn).</li>
    <li>Activeer eventuele spawn-waystone (rechtermuisklik).</li>
    <li>Lees kort het guide book, vang daarna 2–3 Pokémon in de buurt.</li>
    <li><a href="Claims.html">Claim</a> bed/chests vóór je ver weg gaat.</li>
    <li>Start een apricorn-hoekje + klein wheat-veld (<a href="Poke_Balls.html">Poké Balls</a>, <a href="Economy.html">Economie</a>).</li>
    <li>Met team 4–6 en heals: open de <a href="Brock.html">Brock</a>-gids.</li>
  </ol>

  <h2>Controls die je constant gebruikt</h2>
  <table class="wikitable">
    <thead><tr><th>Actie</th><th>Toets</th><th>Waarom</th></tr></thead>
    <tbody>
      <tr><td>Party / starter</td><td><kbd>C</kbd></td><td>Starter kiezen en team beheren</td></tr>
      <tr><td>Selecteer send-out</td><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Voorkomt verkeerde Pokémon</td></tr>
      <tr><td>Send / recall</td><td><kbd>R</kbd></td><td>Start gevechten</td></tr>
      <tr><td>Ride</td><td><kbd>Shift</kbd> + rechtermuisklik</td><td>Zie <a href="Riding.html">Rijden</a></td></tr>
      <tr><td>PC</td><td><code>/pc</code></td><td><a href="Healing_and_Storage.html">Opslag</a></td></tr>
    </tbody>
  </table>

  ${critical(
    "nl",
    "Bulbasaur naar slot 1 slepen is niet genoeg als een andere Pokémon nog <strong>geselecteerd</strong> is. Highlight eerst met de pijltjes, dan <kbd>R</kbd>."
  )}

  ${figure(
    guideImg("catching.png"),
    "<strong>Eerste vangsten.</strong> Bouw eerst een klein team bij spawn vóór je naar Brock wandelt. Verzwakte wilds + een hotbar balls winnen van leeg lopen.",
    "Wild Pokémon vangen bij spawn"
  )}

  <h2>Klaar met uur één?</h2>
  <ul>
    <li><strong>Ja:</strong> starter + 2–3 catches, eten, bed, claim, stenen tools, map op hotbar, paar crafted balls.</li>
    <li><strong>Nog niet:</strong> mega-base, Nether-loot runs, legendary hunts, luxury shopping.</li>
  </ul>
  <p class="see-also"><strong>Volgende:</strong> <a href="Brock.html">Brock</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Roadmap.html">30-dagen roadmap</a></p>
  ${navboxCore()}
  `,
  });

  track("Pack_Differences.html", {
    title: "Pack-verschillen",
    breadcrumbs: crumbs({ label: "Pack-verschillen", href: "Pack_Differences.html" }),
    lede: "Wat CobbleVerse / PokeHaven anders doet dan vanilla Minecraft of “gewone” Cobblemon.",
    body: `
  <h2>Belangrijke wijzigingen</h2>
  <ul>
    <li><strong>No Hunger</strong> (pack-setting) — eten is minder kritiek; survival blijft wel gevaarlijk.</li>
    <li><strong>Geen Ender Dragon-einddoel</strong> als hoofdprogressie — gyms &amp; league sturen het tempo.</li>
    <li><strong>Level cap</strong> gekoppeld aan gym-progressie — zie <a href="Level_Cap.html">Level cap</a>.</li>
    <li>Economie/income kan afwijken (o.a. multipliers) — <a href="Economy.html">Economie</a>.</li>
    <li>Waystones, claims, voice chat en raids horen bij de serverervaring.</li>
  </ul>
  <h2>Wat hetzelfde blijft</h2>
  <p>Mining, Nether-portals, dorpen, redstone-basics — zie de <a href="Minecraft_Hub.html">Minecraft-hub</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Progression.html", {
    title: "Progressie",
    breadcrumbs: crumbs({ label: "Progressie", href: "Progression.html" }),
    lede: "De hoofdroute is de gym-challenge. De level cap duwt je vooruit i.p.v. eindeloos grinden bij spawn.",
    body: `
  <h2>De lus</h2>
  <pre>Vangen / trainen → Gym-map → Gym vinden → Healen → Leader verslaan
→ Level cap stijgt → Volgende map → Team verbeteren → Herhaal
→ Elite Four + Champion → Volgende regio
→ Post-game fossils / legendaries (optioneel)</pre>
  <h2>Achievements &amp; post-game</h2>
  <p>CobbleVerse trackt pack-<a href="Achievements.html">achievements</a> (Advancements-scherm, vaak <kbd>L</kbd>). Na Blue: <a href="Postgame_and_Legendaries.html">Post-game en legendaries</a> voor Mew, birds en Mewtwo.</p>
  <h2>Regio’s</h2>
  <table class="wikitable">
    <thead><tr><th>Regio</th><th>Wanneer</th><th>Focus</th></tr></thead>
    <tbody>
      <tr><td>Kanto</td><td>Meteen</td><td>8 gyms + Elite Four + Blue</td></tr>
      <tr><td>Johto</td><td>Na Kanto</td><td>Nieuwe gyms en biomes</td></tr>
      <tr><td>Hoenn</td><td>Na Johto Champion</td><td>Volgende stap</td></tr>
      <tr><td>Sinnoh</td><td>Na Hoenn Champion</td><td>Late game</td></tr>
    </tbody>
  </table>
  <h2>Level cap op PokeHaven</h2>
  <p>Je Pokémon stoppen met levelen tot je de <strong>volgende</strong> gym / league-fight verslaat. Ladder: <a href="Level_Cap.html">Level cap</a>.</p>
  ${critical(
    "nl",
    "<strong>Spelers kunnen de level cap op PokeHaven EU niet uitzetten.</strong> Versla de <strong>volgende gym</strong> — dezelfde route grinden verhoogt de cap niet."
  )}
  <p class="see-also"><strong>Zie ook:</strong> <a href="Gyms_Kanto.html">Kanto-gyms</a> · <a href="Achievements.html">Achievements</a> · <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Brock.html">Brock</a></p>
  ${navboxCore()}
  `,
  });

  {
    const ladderRows = trainers.kantoLeaders
      .map((g) => {
        const maxLv = Math.max(...(g.team || []).map((m) => Number(m.level) || 0), 0);
        return `<tr>
      <td><a href="${g.slug}.html">${esc(g.name)}</a></td>
      <td>${esc(g.badge)}</td>
      <td>${esc(g.type)}</td>
      <td>${maxLv}</td>
      <td>~${maxLv + 5}</td>
    </tr>`;
      })
      .join("");
    track("Level_Cap.html", {
      title: "Level cap",
      breadcrumbs: crumbs({ label: "Level cap", href: "Level_Cap.html" }),
      lede: "Je Pokémon stoppen met levelen tot je de volgende gym verslaat. Op PokeHaven EU blijft dit aan — bewust.",
      body: `
  <h2>Waarom</h2>
  <p>Zonder cap overlevelen mensen bij spawn en slaan ze het avontuur over. De cap houdt fights eerlijk.</p>
  ${critical(
    "nl",
    "<strong>Spelers kunnen de level cap hier niet uitzetten.</strong> Versla gyms om hem te verhogen. Als XP “stopt”, zit je aan de cap — het is niet kapot."
  )}
  <h2>Kanto-ladder (ongeveer)</h2>
  <p>Terwijl een leader je volgende doel is, is je cap ongeveer diens sterkste Pokémon-level <strong>+ 5</strong>. Bevestig met je Trainer Card.</p>
  <table class="wikitable">
    <thead><tr><th>Volgend doel</th><th>Badge / rol</th><th>Type</th><th>Team max lv</th><th>Approx cap</th></tr></thead>
    <tbody>${ladderRows}</tbody>
  </table>
  <h2>XP lijkt kapot?</h2>
  <ol class="steps">
    <li>Open je <strong>Trainer Card</strong> en zie welke gym volgt.</li>
    <li>Haal die gym-map (<a href="Gym_Maps.html">Gym-maps</a>).</li>
    <li>Verbeter coverage en heals — niet alleen dezelfde route grinden.</li>
    <li>Versla de leader; daarna plakt XP weer.</li>
  </ol>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Progression.html">Progressie</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxCore()}
  `,
    });
  }

  track("Economy.html", {
    title: "Economie",
    breadcrumbs: crumbs({ label: "Economie", href: "Economy.html" }),
    lede: "Shops, bank en hoe je op PokeHaven EU aan geld komt zonder de server leeg te zuigen.",
    body: `
  <h2>Basisloop</h2>
  <p>Vroege inkomsten komen vaak uit farming, trading en pack-shops. Income kan lager liggen dan “singleplayer-defaults” — speel daar omheen met farms en slimme trades.</p>
  ${figure(
    guideImg("farm-loop.png"),
    "<strong>Wheat-farm.</strong> Kweek wheat, trade Farmers voor emeralds, verkoop bij de Bank voor PokéDollars.",
    "Wheat-farm economiegids"
  )}
  <h2>Farm setup voorbeeld</h2>
  <p>Top-down layout met waterkanalen zodat elk crop nat blijft. Klik de afbeelding om te vergroten.</p>
  ${figure(
    guideImg("farm-setup-example.png"),
    "<strong>Farm setup voorbeeld.</strong> Wisselende crop-rijen en water — bouw dit bij je claim.",
    "Top-down wheat farm setup",
    { large: true, diagram: true }
  )}
  <h2>Shop &amp; bank</h2>
  <p>Prijslijsten staan in de Engelse economie-pagina met tabellen uit pack-data. Gebruik de vlag om te wisselen, of open <a href="../../pages/Economy.html">Economie (EN, met tabellen)</a> naast deze uitleg.</p>
  <h2>Tips</h2>
  <ul>
    <li>Investeer vroeg in food/crop-farms — zie <a href="Farming_and_Food.html">Farms &amp; eten</a>.</li>
    <li>Koop niet alles; craft Poké Balls zelf (<a href="Poke_Balls.html">gids</a>).</li>
    <li>Claim je farms zodat niemand meepikt.</li>
  </ul>
  ${navboxCore()}
  `,
  });

  track("Raids.html", {
    title: "Raids",
    breadcrumbs: crumbs({ label: "Raids", href: "Raids.html" }),
    lede: "Raid-dens zijn crystal-fights in de overworld. Neem vrienden, heals en type-coverage mee.",
    body: `
  <h2>Wanneer raiden</h2>
  <p>Doe vroege dens als je een stabiel team en spare balls hebt. Sla hoge tiers over tot je level cap en coverage klaar zijn.</p>
  <h2>Hoe een den werkt</h2>
  <ol class="steps">
    <li>Vind een raid-den crystal in de overworld.</li>
    <li>Start met heals klaar (voice chat helpt — <a href="Voice_Chat.html">Voice chat</a>).</li>
    <li>Doe schade — beloningen hangen vaak af van bijdrage.</li>
    <li>Dens resetten na een timer en kunnen boss/tier wisselen.</li>
  </ol>
  <p>Boss-index: <a href="Raid_Bosses.html">Raid-bosses</a> (${raids.bosses.length}). Tier-tabel: <a href="../../pages/Raids.html">Raids (EN, met tabellen)</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Catching_and_Battling.html", {
    title: "Vangen &amp; vechten",
    breadcrumbs: crumbs({ label: "Vangen &amp; vechten", href: "Catching_and_Battling.html" }),
    lede: "De kernlus op PokeHaven: verzwakken, vangen, genezen, doorpakken — met respect voor de level cap.",
    body: `
  <h2>Vangen</h2>
  <ol class="steps">
    <li>Craft genoeg <a href="Poke_Balls.html">Poké Balls</a>.</li>
    <li>Verzwak het doel (status + lage HP) zonder KO.</li>
    <li>Gooi de juiste ball; chip meer HP bij fail.</li>
  </ol>
  <h2>Wild aggro</h2>
  <p>Wilde Pokémon kunnen aanvallen. Hogere levels aggro’en sneller; failed catches kunnen provoceren. Heal en herpositioneer als ze vijandig blijven.</p>
  <h2>Vechten</h2>
  <p>Type-advantage wint gyms. Gebruik <a href="Brock.html">Brock</a> / <a href="Misty.html">Misty</a> / <a href="Gyms_Kanto.html">Kanto</a> voor teams. Respecteer de <a href="Level_Cap.html">level cap</a>.</p>
  <h2>Na het gevecht</h2>
  <p><a href="Healing_and_Storage.html">Genezen &amp; opslag</a> · <a href="Breeding.html">Broeden</a></p>
  ${navboxCore()}
  `,
  });

  track("Claims.html", {
    title: "Claims",
    breadcrumbs: crumbs({ label: "Claims", href: "Claims.html" }),
    lede: "Zonder claim is het niet veilig. Bescherm bed, chests, farms en waystones met <strong>FTB Chunks</strong> op PokeHaven EU — doe dit in je eerste minuten.",
    infobox: `<div class="infobox-title">Claims</div>
  <table>
    <tr><th>Systeem</th><td>Alleen FTB Chunks</td></tr>
    <tr><th>Kaart openen</th><td>Esc → Options → Controls → zoek <em>FTB</em> / <em>Chunks</em></td></tr>
    <tr><th>Moet erin</th><td>Bed, chests, farm, waystone</td></tr>
    <tr><th>Vermijd</th><td>Open Parties and Claims op dezelfde basis</td></tr>
  </table>`,
    body: `
  ${critical(
    "nl",
    "<strong>Claim vóór je valuables achterlaat.</strong> Unclaimed chests zijn publieke loot. Gebruik <strong>alleen FTB Chunks</strong> — de pack heeft ook Open Parties and Claims; beide mengen op één basis wordt rommelig."
  )}

  ${figure(
    guideImg("claims-ftb.png"),
    "<strong>Land claimen.</strong> Verf chunks rond je basis zodat anderen niet kunnen breken of looten.",
    "FTB Chunks-claimkaart over een basis"
  )}

  <h2>Walkthrough in 60 seconden</h2>
  <ol class="steps">
    <li>Esc → Options → Controls → zoek <em>FTB</em> of <em>Chunks</em> → bind/open de claimkaart.</li>
    <li>Claim chunks onder bed, chests, farm en waystone.</li>
    <li>Claim een buffer van 1 chunk rond je build.</li>
    <li>Met vrienden? Maak een <strong>FTB Team</strong> en deel de claim.</li>
  </ol>

  ${figure(
    guideImg("waystone.png"),
    "<strong>Claim ook de waystone.</strong> Thuis-teleport helpt niet als iemand het block griefed — houd bed, chests, farm en waystone in dezelfde claim.",
    "Waystone bij een geclaimde basis"
  )}

  <h2>Wat erin moet</h2>
  <ul>
    <li>Bed + respawn-gebied</li>
    <li>Chests / backpack-dump</li>
    <li>Apricorn- + wheat-farms</li>
    <li>Waystone</li>
    <li>Later: pasture / breeders — vergroot de claim als je uitbreidt</li>
  </ul>

  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>Eerst bouwen, later claimen — loot is weg.</li>
    <li>Huis geclaimd, farm of waystone niet.</li>
    <li>Open Parties and Claims i.p.v. (of bovenop) FTB Chunks.</li>
    <li>Claim niet mee laten groeien met de basis.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="First_Hours.html">Eerste uren</a> · <a href="Travel.html">Reizen</a> · <a href="Common_Mistakes.html">Veelgemaakte fouten</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxCore()}
  `,
  });

  track("Travel.html", {
    title: "Reizen",
    breadcrumbs: crumbs({ label: "Reizen", href: "Travel.html" }),
    lede: "Waystones, maps en hoe je niet verdwaalt tussen gyms.",
    body: `
  <h2>Waystones</h2>
  <p>Activeer waystones die je vindt en gebruik ze als snelle terugweg naar huis of hubs.</p>
  <h2>Gym-maps</h2>
  <p>Cartography-items wijzen naar gyms — <a href="Gym_Maps.html">Gym-maps</a>. Lege maps die je per ongeluk “opent” in de wereld zijn waardeloos voor die craft; craft opnieuw.</p>
  <h2>Rijden</h2>
  <p>Sommige Pokémon kun je berijden — <a href="Riding.html">Rijden</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Voice_Chat.html", {
    title: "Voice chat",
    breadcrumbs: crumbs({ label: "Voice chat", href: "Voice_Chat.html" }),
    lede: "Simple Voice Chat: afstanden, groepen en fatsoenlijke push-to-talk.",
    body: `
  <h2>Instellen</h2>
  <p>Esc → Options → Controls → Simple Voice Chat. Push-to-talk is het fijnst in groepen.</p>
  <h2>Gebruik</h2>
  <ul>
    <li>Proximity chat nabij andere spelers.</li>
    <li>Groepen/channels voor raids of gym-runs.</li>
    <li>Respecteer mute/deaf settings van anderen.</li>
  </ul>
  ${navboxCore()}
  `,
  });

  track("FAQ.html", {
    title: "FAQ",
    breadcrumbs: crumbs({ label: "FAQ", href: "FAQ.html" }),
    lede: "Uitgebreide antwoorden op de problemen die elke nieuwe PokeHaven-trainer raakt.",
    body: `
  ${figure(
    guideImg("multiplayer-join.png"),
    "<strong>Joinen.</strong> Serverlijstnaam: <code>PokeHaven EU</code>. Pack: CobbleVerse <strong>1.7.42</strong>. IP uit Discord — kan roteren.",
    "Client klaar om te joinen"
  )}

  <h2>Hoe heet de server?</h2>
  <p><strong>PokeHaven EU</strong> in Multiplayer → Add Server. De gekleurde MOTD komt van de server.</p>

  <h2>Waarom levelen mijn Pokémon niet meer?</h2>
  ${critical(
    "nl",
    "<strong>Level cap — geen bug.</strong> Versla de volgende gym. Check je Trainer Card. Zie <a href=\"Level_Cap.html\">Level cap</a>."
  )}

  <h2>Ik kan niet joinen</h2>
  ${critical(
    "nl",
    "<strong>Verkeerde pack-versie is meestal het probleem.</strong> Importeer opnieuw CobbleVerse <strong>1.7.42</strong>. Zie <a href=\"Getting_Started.html\">Aan de slag</a>."
  )}

  <h2>Textures zien er kapot uit</h2>
  <p>Herstart de client volledig na import. Volg FancyMenu-prompts. Download de pack opnieuw bij incomplete files.</p>

  <h2>Mijn Empty Map is nutteloos</h2>
  ${critical(
    "nl",
    "<strong>Je hebt hem in de wereld opengeklikt.</strong> Craft een nieuwe Empty Map en combineer op de Kanto Cartography Table — <a href=\"Gym_Maps.html\">Gym-maps</a>."
  )}

  ${figure(
    guideImg("claims-ftb.png"),
    "<strong>Claim vóór je valuables achterlaat.</strong> Iemand in je chests? Verf FTB Chunks rond bed, storage, farm en waystone. Zie <a href='Claims.html'>Claims</a>.",
    "FTB Chunks-claimkaart"
  )}

  <h2>Seagrass dropt niks</h2>
  ${critical(
    "nl",
    "<strong>Gebruik Shears.</strong> Met de hand breekt seagrass zonder drops in Java Edition."
  )}

  <h2>Iemand opende mijn chests</h2>
  <p>Claim met <a href="Claims.html">FTB Chunks</a>.</p>

  <h2>Waar is Brock?</h2>
  <p>Craft Brocks map met de starter Cartography Table + Brock Map Key + Empty Map. Walkthrough: <a href="Brock.html">Brock</a>.</p>

  <h2>Hoe craft ik Poké Balls?</h2>
  <p><a href="Poke_Balls.html">Poké Balls</a> · <a href="Essential_Recipes.html">Essentiële recepten</a> · <a href="Recipe_Browser.html">Receptenbrowser</a>.</p>

  <h2>Minecraft-tips?</h2>
  <p><a href="Minecraft_Hub.html">Minecraft survival-hub</a> en <a href="Pack_Differences.html">wat dit pack verandert</a>.</p>

  <h2>Is er een quest-pijl?</h2>
  <p>Nee. Gebruik <a href="Gym_Maps.html">gym-maps</a>, de <a href="Level_Cap.html">level cap</a>, en de Advancements-checklist (<a href="Achievements.html">Achievements</a> — vaak <kbd>L</kbd>). Na de league: <a href="Postgame_and_Legendaries.html">Post-game en legendaries</a>.</p>

  <h2>Mag ik dorpen looten?</h2>
  <p>Ja. Center/huis-chests zijn fair game. Op PokeHaven EU kunnen geleegde loot-chests later refreshen.</p>

  <h2>Voice-chat toets?</h2>
  <p>Esc → Options → Controls → Simple Voice Chat. Zie <a href="Voice_Chat.html">Voice chat</a>.</p>

  <h2>Waar vraag ik hulp?</h2>
  <p><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a> — stuur screenshot + wat je al probeerde. IP en pack-links staan daar ook.</p>

  <h2>Kan ik de level cap uitzetten?</h2>
  ${critical(
    "nl",
    "<strong>Nee — niet op PokeHaven EU.</strong> Versla de volgende gym. Zie <a href=\"Level_Cap.html\">Level cap</a>."
  )}

  <h2>Hoe werken outfits / costumes?</h2>
  <p>Craft trainerkleding met Cloth (wol + string), trek aan in armor-slots. Pokémon-looks via cosmetic slot / special items (Pika Case, Furfrou + dye + Shears, Lucario Costume Box). Gids: <a href="Outfits_and_Cosmetics.html">Outfits &amp; cosmetics</a>.</p>
  ${critical(
    "nl",
    "<strong>Cosplay Pikachu evolueert niet naar Raichu.</strong> Gebruik een gewone Pallet-Pikachu als je Raichu wilt."
  )}

  <p class="see-also"><strong>Zie ook:</strong> <a href="Common_Mistakes.html">Veelgemaakte fouten</a> · <a href="Misty.html">Misty</a> · <a href="Roadmap.html">30-dagen roadmap</a></p>
  `,
  });

  track("Minecraft_Hub.html", {
    title: "Minecraft-hub",
    breadcrumbs: crumbs({ label: "Minecraft-hub", href: "Minecraft_Hub.html" }),
    lede: "Survival-gidsen voor PokeHaven — mining, farms, Nether, dorpen en wat het pack anders doet.",
    body: `
  <div class="hub-grid">
    <a class="hub-card" href="Tools_and_Mining.html"><h3>Tools &amp; mining</h3><p>Koper, ijzer, caves.</p></a>
    <a class="hub-card" href="Farming_and_Food.html"><h3>Farms &amp; eten</h3><p>Emerald-loop.</p></a>
    <a class="hub-card" href="Combat_and_Death.html"><h3>Gevecht &amp; dood</h3><p>Blijf leven.</p></a>
    <a class="hub-card" href="Nether_Guide.html"><h3>Nether</h3><p>Portals &amp; routes.</p></a>
    <a class="hub-card" href="Villages_and_Trading.html"><h3>Dorpen</h3><p>Trades &amp; loot.</p></a>
    <a class="hub-card" href="Building_and_Storage.html"><h3>Bouwen</h3><p>Opslag &amp; bases.</p></a>
    <a class="hub-card" href="Dimensions_and_World.html"><h3>Dimensies</h3><p>Wereldstructuur.</p></a>
    <a class="hub-card" href="Pack_Differences.html"><h3>Pack-verschillen</h3><p>Wat anders is.</p></a>
  </div>
  ${navboxCore()}
  `,
  });

  track("Essential_Recipes.html", {
    title: "Essentiële recepten",
    breadcrumbs: crumbs({ label: "Essentiële recepten", href: "Essential_Recipes.html" }),
    lede: "De crafts die elke PokeHaven-trainer in week één nodig heeft. Gebruik REI (<kbd>E</kbd>) voor exacte grids — screenshots tonen de workflow.",
    infobox: `<div class="infobox-title">Essentials</div>
    <table>
      <tr><th>Lookup</th><td>Inventaris → receptzoeken</td></tr>
      <tr><th>Balls</th><td>Apricorns + metaal</td></tr>
      <tr><th>Maps</th><td>Empty Map + special item</td></tr>
      <tr><th>Database</th><td><a href="Recipe_Browser.html">Receptenbrowser</a></td></tr>
    </table>`,
    body: `
  <h2>Elk craft opzoeken</h2>
  <ol class="steps">
    <li>Druk <kbd>E</kbd>.</li>
    <li>Gebruik de REI-zoekbalk aan de zijkant.</li>
    <li>Typ de itemnaam (bijv. <em>great ball</em>, <em>shears</em>, <em>kanto</em>).</li>
    <li>Klik het resultaat om het patroon op het grid te pinnen.</li>
  </ol>
  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>REI-workflow.</strong> Zoeken → resultaat klikken → items op het gemarkeerde grid. Vertrouw altijd het live recept.",
    "REI-receptzoeken in inventaris"
  )}

  <h2>Poké Balls</h2>
  ${figure(
    guideImg("pokeball-craft.png"),
    "<strong>Poké Ball craften.</strong> Zoek de ball-naam, plaats daarna apricorns + core.",
    "Poké Balls craften"
  )}
  <table class="wikitable">
    <thead><tr><th>Resultaat</th><th>Core</th><th>Apricorns (typisch)</th></tr></thead>
    <tbody>
      <tr><td>Poké Ball</td><td>Copper ingot</td><td>4× rood</td></tr>
      <tr><td>Great Ball</td><td>Iron ingot</td><td>Rood + blauw</td></tr>
      <tr><td>Ultra Ball</td><td>Gold ingot</td><td>Zwart + geel</td></tr>
    </tbody>
  </table>
  <p>Volledige gids: <a href="Poke_Balls.html">Poké Balls</a>. Bomen oogsten:</p>
  ${figure(
    guideImg("apricorns.png"),
    "<strong>Apricorns.</strong> Rechtermuisklik op fruit; plant seeds bij je claim.",
    "Apricorn-boom"
  )}

  <h2>Vroege Minecraft-toolkit</h2>
  <table class="wikitable">
    <thead><tr><th>Item</th><th>Waarom</th><th>REI-zoekterm</th></tr></thead>
    <tbody>
      <tr><td>Crafting table</td><td>Alles</td><td><code>crafting table</code></td></tr>
      <tr><td>Stone pickaxe</td><td>Ijzer + koper</td><td><code>stone pickaxe</code></td></tr>
      <tr><td>Furnace</td><td>Smelten</td><td><code>furnace</code></td></tr>
      <tr><td>Shears</td><td>Seagrass voor Misty-map</td><td><code>shears</code></td></tr>
      <tr><td>Bed</td><td>Respawn</td><td><code>bed</code></td></tr>
      <tr><td>Empty Map</td><td>Gym-maps</td><td><code>empty map</code></td></tr>
      <tr><td>Shield</td><td>Creeper-veiligheid</td><td><code>shield</code></td></tr>
    </tbody>
  </table>

  <h2>Gym-map crafts</h2>
  ${figure(
    guideImg("cartography-maps.png"),
    "<strong>Map-tooling.</strong> Na Brock: Empty Map + special items op de Kanto Cartography Table. Details: <a href='Gym_Maps.html'>Gym-maps</a>.",
    "Cartography / map-crafting"
  )}
  <ol class="steps">
    <li>Craft <strong>Kanto Cartography Table</strong> (REI: <em>kanto</em> / <em>cartography</em>).</li>
    <li>Craft het special item van de leader (bijv. Misty → Cerulean Star).</li>
    <li>Craft Empty Map — <strong>niet</strong> openklikken in de wereld.</li>
    <li>Combineer op de Kanto Cartography Table.</li>
  </ol>

  <h2>Datapack-database</h2>
  <p>${recipesMeta.count} pack-recepten staan in de <a href="Recipe_Browser.html">Receptenbrowser</a> (EN-tool met dezelfde data).</p>
  ${navboxCore()}
  `,
  });

  track("Poke_Balls.html", {
    title: "Poké Balls",
    breadcrumbs: crumbs({ label: "Poké Balls", href: "Poke_Balls.html" }),
    lede: "Apricorns oogsten, balls craften, en een vaste voorraad houden zodat je nooit midden op de route leegloopt.",
    infobox: `<div class="infobox-title">Poké Ball crafting</div>
    <table>
      <tr><th>Basic ball</th><td>4 rode apricorns + koper</td></tr>
      <tr><th>Great Ball</th><td>Rood + blauw + ijzer</td></tr>
      <tr><th>Ultra Ball</th><td>Zwart + geel + goud</td></tr>
      <tr><th>Lookup</th><td>Inventaris (<kbd>E</kbd>) → receptzoeken</td></tr>
      <tr><th>Farm-tip</th><td>Plant seeds bij je claim</td></tr>
    </table>`,
    body: `
  <h2>Waarom dit telt</h2>
  <p>Zonder balls stall je een gym-trip razendsnel. Craften is goedkoper dan paniek-kopen, en leert de item-loop van het pack vroeg.</p>

  ${figure(
    guideImg("pokeball-craft.png"),
    "<strong>Een Poké Ball craften.</strong> Open inventaris (<kbd>E</kbd>), zoek de ball-naam, plaats apricorns + metalen core. Exacte grids kunnen per type verschillen — vertrouw REI.",
    "Poké Ball craften in de recept-UI"
  )}

  <h2>Stap voor stap: eerste Poké Ball</h2>
  <ol class="steps">
    <li>Vind een apricorn-boom (gekleurd fruit).</li>
    <li>Oogst de apricorns. Bewaar de seeds.</li>
    <li>Metaal: <strong>koper</strong> voor basic, ijzer voor Great, goud voor Ultra.</li>
    <li>Open inventaris (<kbd>E</kbd>), zoek in REI op <em>poke ball</em>.</li>
    <li>Klik het recept en plaats de items.</li>
    <li>Craft een stack vóór lange trips — hotbar minstens één stack balls.</li>
  </ol>

  ${figure(
    guideImg("apricorns.png"),
    "<strong>Apricorn-bomen.</strong> Oogst fruit, plant seeds bij je basis voor een hernieuwbare voorraad.",
    "Apricorn-boom met rode apricorns"
  )}

  <h2>Ball-tiers (early game)</h2>
  <table class="wikitable">
    <thead><tr><th>Ball</th><th>Core</th><th>Apricorns (typisch)</th><th>Wanneer</th></tr></thead>
    <tbody>
      <tr><td>Poké Ball</td><td>Koper</td><td>4× rood</td><td>Vroege catches</td></tr>
      <tr><td>Great Ball</td><td>Ijzer</td><td>Rood + blauw</td><td>Sterkere wilds / gym-routes</td></tr>
      <tr><td>Ultra Ball</td><td>Goud</td><td>Zwart + geel</td><td>Moeilijke catches</td></tr>
    </tbody>
  </table>

  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>Recept-workflow.</strong> Als een screenshot iets afwijkt van je UI-pack, wint altijd het REI-resultaat.",
    "Voorbeeld crafting-UI"
  )}

  <h2>Apricorn-farm</h2>
  <ol class="steps">
    <li>Claim een klein stuk naast je huis.</li>
    <li>Plant elke kleur seed die je vindt.</li>
    <li>Verlicht het gebied.</li>
    <li>Oogst elke sessie vóór gym-runs.</li>
  </ol>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Essential_Recipes.html">Essentiële recepten</a> · <a href="Catching_and_Battling.html">Vangen &amp; vechten</a> · <a href="Economy.html">Economie</a></p>
  ${navboxCore()}
  `,
  });

  track("Gyms_Kanto.html", {
    title: "Kanto-gyms",
    breadcrumbs: crumbs({ label: "Kanto-gyms", href: "Gyms_Kanto.html" }),
    lede: "Alle Kanto-leaders en de league — start hier voor je gym-run.",
    body: `
  <h2>Leaders</h2>
  <div class="hub-grid">
    ${trainers.kantoLeaders
      .filter((g) => g.order <= 8)
      .map(
        (g) =>
          `<a class="hub-card" href="${g.slug}.html"><h3>${esc(g.name)}</h3><p>Gym ${g.order}</p></a>`
      )
      .join("")}
  </div>
  <h2>Elite Four &amp; Champion</h2>
  <div class="hub-grid">
    ${trainers.kantoLeaders
      .filter((g) => g.order > 8)
      .map(
        (g) =>
          `<a class="hub-card" href="${g.slug}.html"><h3>${esc(g.name)}</h3><p>League</p></a>`
      )
      .join("")}
  </div>
  <p>Volg badges ook in Advancements — volledige lijst: <a href="Achievements.html">Achievements</a>. Na de league: <a href="Postgame_and_Legendaries.html">Post-game en legendaries</a>.</p>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Progression.html">Progressie</a> · <a href="Level_Cap.html">Level cap</a> · <a href="Gym_Maps.html">Gym-maps</a></p>
  `,
  });

  track("Gym_Maps.html", {
    title: "Gym-maps",
    breadcrumbs: crumbs({ label: "Gym-maps", href: "Gym_Maps.html" }),
    lede: "Gyms vinden op PokeHaven EU — elke regio heeft een eigen cartography-tafel. Craft een afgewerkte map voor marker én coördinaten.",
    infobox: `<div class="infobox-title">Gym-maps</div>
  <table>
    <tr><th>Kanto</th><td>Kanto Cartography Table</td></tr>
    <tr><th>Johto</th><td>Johto Cartography Table</td></tr>
    <tr><th>Hoenn</th><td>Hoenn Cartography Table</td></tr>
    <tr><th>Sinnoh</th><td>Sinnoh Cartography Table</td></tr>
    <tr><th>Eerste leaders</th><td>Brock → Valerio → Petra → Pedro</td></tr>
  </table>`,
    body: `
  <h2>Brock (eerste gym — gratis kit)</h2>
  <p>Je starter kit bevat een <strong>Kanto Cartography Table</strong>, <strong>Brock Map Key</strong> en <strong>Empty Map</strong>. Plaats de tafel, doe Empty Map + Brock Map Key erin, pak de afgewerkte map (marker + coördinaten). Walkthrough: <a href="Brock.html">Brock</a>.</p>
  ${critical(
    "nl",
    "<strong>Open / right-click een Empty Map nooit eerst in de wereld.</strong> Dan is hij onbruikbaar voor gym-crafts. Altijd een verse Empty Map in de <em>juiste</em> regio-tafel."
  )}

  ${figure(
    guideImg("cartography-maps.png"),
    "<strong>Gym-map craften.</strong> Empty Map + special item op de juiste regio-cartography-tafel. Open een Empty Map nooit eerst in de wereld.",
    "Cartography / map-crafting"
  )}

  <h2>Latere regio’s (Johto / Hoenn / Sinnoh)</h2>
  <p>Na elke league craft je de cartography-tafel van die regio (REI: <em>Johto</em> / <em>Hoenn</em> / <em>Sinnoh</em> + <em>cartography</em>). Eerste gym leaders:</p>
  <table class="wikitable">
    <thead><tr><th>Regio</th><th>Wanneer</th><th>Eerste gym</th><th>Tafel</th></tr></thead>
    <tbody>
      <tr><td>Johto</td><td>Na Blue + Johto Trainer Card</td><td><strong>Valerio</strong></td><td>Johto Cartography Table</td></tr>
      <tr><td>Hoenn</td><td>Na Lance + Hoenn-card</td><td><strong>Petra</strong></td><td>Hoenn Cartography Table</td></tr>
      <tr><td>Sinnoh</td><td>Na Rocco + Sinnoh-card</td><td><strong>Pedro</strong></td><td>Sinnoh Cartography Table</td></tr>
    </tbody>
  </table>
  <ol class="steps">
    <li>Ruil je Trainer Card bij de Trainer Association voor de nieuwe regio (reset <em>jouw</em> level cap — anderen niet).</li>
    <li>Check de Trainer Card voor een spawn-tip, <em>of</em> craft de map (hieronder).</li>
    <li>Ontbreken structures na de eerste champion van een regio? Discord — staff kan 1× server herstarten.</li>
  </ol>
  <p>Regio-overzichten: <a href="Gyms_Johto.html">Johto</a> · <a href="Gyms_Hoenn.html">Hoenn</a> · <a href="Gyms_Sinnoh.html">Sinnoh</a>.</p>

  <h2>Methode 1 — Map Guide-villager</h2>
  <ol class="steps">
    <li>Craft en plaats de <strong>juiste regio</strong>-cartography-tafel (REI).</li>
    <li>Zet die naast een unemployed villager.</li>
    <li>Die wordt Map Guide en kan gym-maps voor die regio traden.</li>
  </ol>

  <h2>Methode 2 — Empty Map + special item</h2>
  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>Zoek het special item in REI.</strong> Zoek de leadernaam, craft het item, combineer met een verse Empty Map op de <em>juiste</em> regio-tafel.",
    "REI voor gym-map ingrediënten"
  )}
  <ol class="steps">
    <li>Zoek de leadernaam in REI (bijv. Valerio, Petra, Pedro, Misty…).</li>
    <li>Craft dat special map-item.</li>
    <li>Craft een verse <strong>Empty Map</strong>.</li>
    <li>Combineer Empty Map + item in de <strong>regio</strong>-cartography-tafel (Kanto-tafel voor Kanto, Johto-tafel voor Johto, enz.).</li>
    <li>Op de afgewerkte map: hover (+ eventueel <kbd>Shift</kbd>) voor details/coördinaten.</li>
  </ol>

  ${critical(
    "nl",
    "<strong>Seagrass voor Cerulean Star (Misty) dropt alleen met Shears.</strong> Blote handen geven niks."
  )}

  <div class="callout tip">
    <div class="label">Map lijkt leeg?</div>
    Loop toch de aangegeven richting. Na een lange hike nog niks? Verplaats een paar duizend blocks en probeer opnieuw.
  </div>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Essential_Recipes.html">Essentiële recepten</a> · <a href="Villages_and_Trading.html">Dorpen</a> · <a href="Brock.html">Brock</a> · <a href="Progression.html">Progressie</a></p>
  ${navboxCore()}
  `,
  });

  track("Common_Mistakes.html", {
    title: "Veelgemaakte fouten",
    breadcrumbs: crumbs({ label: "Veelgemaakte fouten", href: "Common_Mistakes.html" }),
    lede: "Maak deze fouten één keer — of helemaal niet.",
    body: `
  ${critical(
    "nl",
    "Deze fouten kosten de meeste tijd. Rode rijen hieronder zijn wat spelers overslaan en daarna in Discord vragen."
  )}
  <table class="wikitable">
    <thead><tr><th>Fout</th><th>Gevolg</th><th>Fix</th></tr></thead>
    <tbody>
      <tr class="critical-row"><td>Verkeerde pack-versie</td><td>Niet joinen</td><td>1.7.42 opnieuw uit <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a></td></tr>
      <tr class="critical-row"><td>Level cap negeren</td><td>“XP kapot”</td><td><a href="Level_Cap.html">Volgende gym</a></td></tr>
      <tr class="critical-row"><td>Geen claim</td><td>Chests leeg</td><td><a href="Claims.html">FTB Chunks</a></td></tr>
      <tr class="critical-row"><td>Empty Map openklikken</td><td>Geen gym-map</td><td>Nieuwe Empty Map + <a href="Gym_Maps.html">tafel</a></td></tr>
      <tr class="critical-row"><td>Seagrass met hand</td><td>0 drops</td><td>Shears — <a href="Misty.html">Misty</a></td></tr>
      <tr class="critical-row"><td>Oud IP uit screenshot</td><td>Geen connectie</td><td>IP uit Discord <code>#how-to-join</code></td></tr>
      <tr class="critical-row"><td>Cosplay Pikachu voor Raichu</td><td>Evolueert nooit</td><td>Gewone Pallet-Pikachu — <a href="Outfits_and_Cosmetics.html">Outfits</a></td></tr>
    </tbody>
  </table>
  <p><a href="FAQ.html">FAQ</a> · <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a></p>
  ${navboxCore()}
  `,
  });

  track("Roadmap.html", {
    title: "30-dagen roadmap",
    breadcrumbs: crumbs({ label: "30-dagen roadmap", href: "Roadmap.html" }),
    lede: "Een rustig Kanto-tempo voor als je niet wilt racen.",
    body: `
  <h2>Week 1</h2>
  <p>Install, basis, balls, eerste vangsten, Brock-voorbereiding.</p>
  <h2>Week 2–3</h2>
  <p>Gyms 2–5, farms, waystones, eerste raids met vrienden.</p>
  <h2>Week 4</h2>
  <p>Rest van Kanto, league-prep, economie opschalen.</p>
  <h2>Na Blue</h2>
  <p>Optioneel post-game: fossils, birds, Mewtwo — <a href="Postgame_and_Legendaries.html">Post-game-gids</a> · <a href="Achievements.html">Achievements</a>.</p>
  <p>Pas het tempo aan — PokeHaven is een community-server, geen speedrun.</p>
  ${navboxCore()}
  `,
  });

  {
    const adv = advancements || { count: 0, groups: {}, cobbleverse: {}, cobblemon: {} };
    const cv = adv.cobbleverse?.groups || adv.groups || {};
    const cm = adv.cobblemon?.groups || {};
    const cvCount = adv.cobbleverse?.count ?? 0;
    const cmCount = adv.cobblemon?.count ?? 0;
    const advSection = (groups, groupKey) => {
      const rows = advancementTableRows(groups[groupKey], "nl");
      if (!rows) return "";
      return `
  <h3>${groupTitle(groupKey, "nl")}</h3>
  <table class="wikitable">
    <thead><tr><th>Achievement</th><th>Hoe</th><th>Icoon-item</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
    };

    track("Achievements.html", {
      title: "Achievements",
      breadcrumbs: crumbs({ label: "Achievements", href: "Achievements.html" }),
      lede: `In-game heb je <strong>twee</strong> grote Pokémon-advancement tabs: <strong>CobbleVerse</strong> (${cvCount} gym / league / legendary-doelen) en <strong>Cobblemon</strong> (${cmCount} vangen, farming, fossils…). Vanilla Minecraft-tabs bestaan ook. Deze pagina zet beide Pokémon-trees op een rij.`,
      infobox: `<div class="infobox-title">Advancements</div>
  <table>
    <tr><th>Open in-game</th><td>Advancements (vaak <kbd>L</kbd>) of Pause → Advancements</td></tr>
    <tr><th>CobbleVerse-tab</th><td>${cvCount} — alle regio-gyms / leagues + Kanto-legendaries</td></tr>
    <tr><th>Cobblemon-tab</th><td>${cmCount} — balls, berries, fossils, rides…</td></tr>
    <tr><th>Post-game-gids</th><td><a href="Postgame_and_Legendaries.html">Legendaries</a></td></tr>
  </table>`,
      body: `
  <h2>Hoe openen</h2>
  <ol class="steps">
    <li>Druk <kbd>L</kbd> (standaard Advancements-toets), of Pause → <strong>Advancements</strong>.</li>
    <li>Wissel tabs bovenaan — Paginated Advancements pint <strong>CobbleVerse</strong>; de <strong>Cobblemon</strong>-tab is de grote mod-tree.</li>
    <li>Gebruik toasts als checklist. Gym-maps + level cap blijven je echte progressie.</li>
  </ol>

  ${critical(
    "nl",
    "<strong>Dekking:</strong> CobbleVerse pack-advancements + PokeHaven EU Johto/Hoenn/Sinnoh toast-trees, plus elke Cobblemon <em>display</em>-advancement (vangen / farming / fossils / battle). We slaan Cobblemon recipe-book unlock-spam over (honderden “craft X”-ticks), vanilla Minecraft-tabs, en mods met alleen een root-stub (bijv. Mega Showdown)."
  )}

  <h2>CobbleVerse-tab (${cvCount})</h2>
  <p>Pack-progressie: starter → Kanto → Johto → Hoenn → Sinnoh (gyms + Elite Four + Champion), daarna Kanto fossils / legendaries. Johto+ komt uit het <strong>PokeHaven EU</strong>-datapack (alleen toasts — badges blijven trainer-loot). Post-game: <a href="Postgame_and_Legendaries.html">Post-game en legendaries</a>.</p>
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

  <h2>Cobblemon-tab (${cmCount})</h2>
  <p>Doelen uit de basis Cobblemon-mod (titels uit de mod-taalfile). Handig early: first catch, apricorns, berries, healing machine, fossils, rides.</p>
  ${advSection(cm, "root")}
  ${advSection(cm, "catching")}
  ${advSection(cm, "agriculture")}
  ${advSection(cm, "geological")}
  ${advSection(cm, "battle")}
  ${advSection(cm, "other")}

  <h2>Bewust niet opgenomen</h2>
  <ul>
    <li><strong>Cobblemon recipe unlocks</strong> onder <code>advancement/recipes/</code> — recipe-book ticks, geen echte doelen.</li>
    <li><strong>Vanilla Minecraft</strong> Story / Nether / Adventure-tabs.</li>
    <li><strong>Mega Showdown</strong> — alleen een root-stub in de pack-overlay.</li>
  </ul>

  <h2>Wat nu?</h2>
  <ul>
    <li>Early game: <a href="Brock.html">Brock</a> → <a href="Misty.html">Misty</a> → rest van <a href="Gyms_Kanto.html">Kanto</a>.</li>
    <li>Na Blue / late Kanto: <a href="Postgame_and_Legendaries.html">Post-game en legendaries</a>.</li>
    <li>Biomes zoeken: <a href="Spawn_Lookup.html">Spawn-lookup</a>.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Progression.html">Progressie</a> · <a href="Roadmap.html">30-dagen roadmap</a> · <a href="Level_Cap.html">Level cap</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxCore()}
  `,
    });

    track("Postgame_and_Legendaries.html", {
      title: "Post-game en legendaries",
      breadcrumbs: crumbs({
        label: "Post-game en legendaries",
        href: "Postgame_and_Legendaries.html",
      }),
      lede: "Na de Kanto-league opent CobbleVerse fossil/DNA-routes en legendary catches. Gebruik dit samen met de <a href=\"Achievements.html\">Achievements</a>-checklist.",
      infobox: `<div class="infobox-title">Post-game</div>
  <table>
    <tr><th>Wanneer</th><td>Late Kanto / na Champion Blue</td></tr>
    <tr><th>Mew-pad</th><td>Origin Fossil → Mew vangen</td></tr>
    <tr><th>Mewtwo-pad</th><td>Ancient DNA → Mewtwo reviven</td></tr>
    <tr><th>Birds</th><td>Articuno, Zapdos, Moltres</td></tr>
    <tr><th>Lookup</th><td>REI (<kbd>E</kbd>) + <a href="Spawn_Lookup.html">Spawn-lookup</a></td></tr>
  </table>`,
      body: `
  <h2>Wanneer post-game “open” voelt</h2>
  <p>Rond eerst de Kanto-gyms en league af. <a href="Blue.html">Champion Blue</a> opent de Origin Fossil-tak. Ancient DNA hangt aan late Kanto-progressie (Giovanni / inventaris-trigger in het pack). Neem een sterk, geheald team mee — dit is geen early-route content.</p>

  ${critical(
    "nl",
    "<strong>Respecteer de level cap en breng coverage.</strong> Start geen legendary hunts half-dood of met één type. Zie <a href=\"Level_Cap.html\">Level cap</a> en <a href=\"Catching_and_Battling.html\">Vangen &amp; vechten</a>."
  )}

  <h2>Origin Fossil → Mew</h2>
  <ol class="steps">
    <li>Clear Kanto tot en met <a href="Blue.html">Blue</a> (Champion).</li>
    <li>Open inventaris (<kbd>E</kbd>) en zoek in REI naar <strong>Origin Fossil</strong>.</li>
    <li>Craft het fossil met de materialen uit het recept.</li>
    <li>Volg daarna de Mew-encounter / revive-flow van het pack — “Catch Mew” tikt af als je Mew hebt.</li>
    <li>Shiny Mew is een aparte optionele advancement.</li>
  </ol>
  <div class="callout tip">
    <div class="label">REI is leidend</div>
    Exacte grids kunnen wijzigen bij pack-updates. Vertrouw altijd de in-game recipe view.
  </div>

  <h2>Ancient DNA → Mewtwo</h2>
  <ol class="steps">
    <li>Progress late Kanto (Giovanni en verder waar nodig).</li>
    <li>Zoek in REI naar <strong>Ancient DNA</strong> en cloning-items (bijv. <strong>Cloning Catalyst</strong>).</li>
    <li>Krijg Ancient DNA in je inventaris — dat tikt de pack-advancement af.</li>
    <li>Gebruik de revive / cloning-flow voor <strong>Mewtwo</strong>.</li>
    <li>Shiny Mewtwo-revive is optioneel.</li>
  </ol>

  <h2>Legendary birds</h2>
  <p>Articuno, Zapdos en Moltres hebben elk catch-advancements (plus optionele shinies). Deze wiki geeft geen vaste overworld-coördinaten.</p>
  <ol class="steps">
    <li>Zoek elke naam in <a href="Spawn_Lookup.html">Spawn-lookup</a> voor biomes / buckets uit pack-data.</li>
    <li>Reis voorbereid: balls, heals, status-tools, geclaimde basis met waystone.</li>
    <li>Vang de legendary — de advancement toast verschijnt als criteria kloppen.</li>
  </ol>

  <h2>Checklist vs gids</h2>
  <table class="wikitable">
    <thead><tr><th>Wil je…</th><th>Ga naar</th></tr></thead>
    <tbody>
      <tr><td>Volledige toast-lijst</td><td><a href="Achievements.html">Achievements</a></td></tr>
      <tr><td>Gym-teams &amp; maps</td><td><a href="Gyms_Kanto.html">Kanto-gyms</a> · <a href="Gym_Maps.html">Gym-maps</a></td></tr>
      <tr><td>Waar een species spawnt</td><td><a href="Spawn_Lookup.html">Spawn-lookup</a></td></tr>
      <tr><td>Rustig tempo</td><td><a href="Roadmap.html">30-dagen roadmap</a></td></tr>
    </tbody>
  </table>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Achievements.html">Achievements</a> · <a href="Progression.html">Progressie</a> · <a href="Blue.html">Blue</a> · <a href="Giovanni.html">Giovanni</a></p>
  ${navboxCore()}
  `,
    });
  }

  track("Healing_and_Storage.html", {
    title: "Genezen &amp; opslag",
    breadcrumbs: crumbs({ label: "Genezen &amp; opslag", href: "Healing_and_Storage.html" }),
    lede: "Pokémon Centers, Revives, PC en hoe je niet met een dood team vastzit.",
    body: `
  <h2>Genezen</h2>
  <p>Gebruik centers en heal-items tussen fights. Neem Revives mee naar gyms en raids.</p>
  <h2>Opslag</h2>
  <p>PC/boxen voor overflow. Claim je chest-monsters. Zie <a href="Building_and_Storage.html">Bouwen &amp; opslag</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Outfits_and_Cosmetics.html", {
    title: "Outfits &amp; cosmetics",
    breadcrumbs: crumbs({ label: "Outfits &amp; cosmetics", href: "Outfits_and_Cosmetics.html" }),
    lede: "Zie eruit als trainer op PokeHaven EU: craftbare <strong>outfits</strong> voor jou, plus <strong>Pokémon-cosmetics</strong> (costumes, sjaals, Furfrou-cuts).",
    body: `
  <div class="callout tip">
    <div class="label">Cosmetics ≠ battle-items</div>
    Outfits en costumes zijn voor de look. Verwar ze niet met held items zoals Choice Scarf.
  </div>

  <h2>Trainer-outfits (jij)</h2>
  <p>Het pack heeft <strong>Poke Clothing</strong>: craftbare hats, shirts en pants (Ash per regio, Misty, Brock, Red, Dawn, Brendan, Team Rocket / Magma / Aqua, Jessie, James, enz.).</p>
  <ol class="steps">
    <li>Open inventaris (<kbd>E</kbd>) en zoek in REI naar <strong>Cloth</strong>.</li>
    <li>Craft Cloth van <strong>wol + string</strong> (exact grid in REI).</li>
    <li>Zoek de personage-naam (bijv. <em>Ash</em>, <em>Misty</em>, <em>Rocket</em>) voor hat / shirt / pants.</li>
    <li>Craft de stukken die je wilt.</li>
    <li>Trek ze aan in je <strong>armor-slots</strong> — het is cosmetische kleding.</li>
  </ol>

  <h2>Pokémon-cosmetics</h2>
  <p>Veel looks gebruiken de <strong>cosmetic slot</strong> (apart van held item). Open summary / interact-menu, of gebruik het special item hieronder.</p>

  <h3>Cosplay Pikachu</h3>
  ${critical(
    "nl",
    "<strong>Cosplay Pikachu evolueert niet naar Raichu.</strong> Gewone Pallet-Pikachu wel. Kies Cosplay alleen voor de costumes — niet voor een Raichu-lijn."
  )}
  <ul>
    <li>Startercategorie <strong>Cosplay</strong> = costume-Pikachu (Belle, Libre, PhD, Pop Star, Rock Star…).</li>
    <li>Wissel costumes met een <strong>Pika Case</strong> (zoek in REI).</li>
  </ul>

  <h3>Furfrou</h3>
  <ol class="steps">
    <li>Doe een <strong>dye</strong> in Furfrou’s cosmetic slot.</li>
    <li>Gebruik <strong>Shears</strong> op Furfrou voor de trim.</li>
  </ol>

  <h3>Riolu &amp; Lucario</h3>
  <ul>
    <li><strong>Riolu:</strong> Red / Green Scarf als cosmetic.</li>
    <li><strong>Lucario:</strong> <strong>Lucario Costume Box</strong> — right-click om te wisselen.</li>
  </ul>

  <h2>Korte FAQ</h2>
  <table class="wikitable">
    <thead><tr><th>Vraag</th><th>Antwoord</th></tr></thead>
    <tbody>
      <tr><td>Geven outfits armor?</td><td>Behandel ze als cosmetics — geen vervanging voor echte armor.</td></tr>
      <tr><td>Waar is Cloth?</td><td>REI → zoek <em>Cloth</em> (wol + string).</td></tr>
      <tr class="critical-row"><td>Cosplay Pikachu evolueert niet</td><td class="critical-cell">Klopt — kies een normale Pikachu voor Raichu.</td></tr>
    </tbody>
  </table>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Essential_Recipes.html">Essentiële recepten</a> · <a href="Pack_Differences.html">Pack-verschillen</a> · <a href="../../pages/Outfits_and_Cosmetics.html">Volledige EN-gids</a></p>
  ${navboxCore()}
  `,
  });

  track("Breeding.html", {
    title: "Broeden",
    breadcrumbs: crumbs({ label: "Broeden", href: "Breeding.html" }),
    lede: "Broed in een geclaimde pasture bij je base. Eieren kosten enkele minuten — plan farms, geen frantic AFK bij spawn.",
    body: `
  <h2>Setup</h2>
  <ol class="steps">
    <li>Claim met <a href="Claims.html">FTB Chunks</a>.</li>
    <li>Bouw een kleine pasture bij bed/waystone.</li>
    <li>Zet een compatible paar (of Ditto + parent) in range.</li>
    <li>Wacht op eieren — vaak ongeveer <strong>7–15 minuten</strong> per window.</li>
  </ol>
  <h2>Verwacht</h2>
  <ul>
    <li>Shiny-odds kunnen verbeteren met Masuda-achtige paren / charm-methodes — nog steeds zeldzaam.</li>
    <li>Sommige legendary/paradox Ditto-chains kunnen geblokkeerd zijn.</li>
  </ul>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Catching_and_Battling.html">Vangen &amp; vechten</a></p>
  ${navboxCore()}
  `,
  });

  track("Fishing.html", {
    title: "Vissen",
    breadcrumbs: crumbs({ label: "Vissen", href: "Fishing.html" }),
    lede: "Op CobbleVerse / PokeHaven EU kun je <strong>Pokémon</strong> vissen — niet alleen vanilla vis. Gebruik Cobblemon-hengels in het juiste waterbiome.",
    infobox: `<div class="infobox-title">Vissen</div>
  <table>
    <tr><th>Doel</th><td>Water-Pokémon via hengel</td></tr>
    <tr><th>Tools</th><td>Cobblemon-rods (REI: “rod”)</td></tr>
    <tr><th>Data</th><td>${spawns.filter((s) => s.position === "fishing").length} fishing-spawnrijen</td></tr>
    <tr><th>Party nodig?</th><td>Nee (PokeHaven-config)</td></tr>
  </table>`,
    body: `
  <h2>Waarom vissen?</h2>
  <p>Honderden species komen (vooral) via <strong>fishing</strong>-spawns — Magikarp-lijn, Tentacool, veel Water-types, en zeldzamere ocean/river-vondsten. Echt bruikbaar voor progressie.</p>

  <h2>Aan de slag</h2>
  <ol class="steps">
    <li>Open inventory-search (<kbd>E</kbd> / REI) en zoek <strong>rod</strong> of <strong>Poke Rod</strong>.</li>
    <li>Craft een <strong>Cobblemon</strong>-hengel (Poke Rod, Lure Rod, Great Rod…). Een gewone Minecraft fishing rod is vooral voor vanilla loot.</li>
    <li>Ga bij water staan dat bij je biome past (rivier / oceaan / swamp-tags).</li>
    <li>Cast, wacht op de beet, haal in — er kan een wild Pokémon-encounter starten i.p.v. een item.</li>
    <li>Vang met balls zoals altijd. Claim je steiger als je daar AFK’t.</li>
  </ol>

  ${critical(
    "nl",
    "<strong>Gebruik Cobblemon-hengels voor Pokémon.</strong> Alleen sticks en pufferfish? Waarschijnlijk vanilla rod of verkeerd water/biome."
  )}

  <h2>Rods, lure level &amp; bait</h2>
  <ul>
    <li><strong>Rod-tiers</strong> (Poke → Great → Ultra → Master, plus themed rods) verhogen de <em>lure level</em>. Hogere lure ontgrendelt fishing-rijen met <code>minLureLevel</code> 1–3+.</li>
    <li>Themed rods (Net, Dive, Friend, …) craft je via REI; chests kunnen beschadigde rods droppen.</li>
    <li><strong>Bait</strong> bestaat in de pack — gebruik het als de tooltip het toelaat. Zoek in REI op “bait”.</li>
    <li>Je hebt op PokeHaven EU <strong>geen</strong> Pokémon in je party nodig om te vissen.</li>
  </ul>

  <h2>Waar casten?</h2>
  <ul>
    <li>Freshwater (rivieren/meren) vs ocean/beach verandert de pool.</li>
    <li>Sommige species hebben ook <em>submerged</em> / <em>surface</em> (zwemmen/boot). Fishing = alleen hengel.</li>
  </ul>

  <h2>Opzoeken</h2>
  <p>Open <a href="Spawn_Lookup.html">Spawn-lookup</a> (EN-tool) en zet Context op <code>fishing</code>, of ga naar de <a href="../../pages/Spawn_Lookup.html?ctx=fishing">EN spawn lookup met fishing-filter</a>.</p>

  <div class="callout tip">
    <div class="label">Gym-tip</div>
    Handig voor Water-coverage vóór Misty / latere oceanen — level cap blijft gelden.
  </div>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Catching_and_Battling.html">Vangen &amp; vechten</a> · <a href="Claims.html">Claims</a> · <a href="../../pages/Fishing.html">Volledige EN-gids</a></p>
  ${navboxCore()}
  `,
  });

  track("Riding.html", {
    title: "Rijden",
    breadcrumbs: crumbs({ label: "Rijden", href: "Riding.html" }),
    lede: "Pokémon als mount gebruiken om sneller te reizen.",
    body: `
  <p>Sommige species zijn rideable. Check controls in Options. Combineer met <a href="Travel.html">Waystones</a> voor lange routes.</p>
  ${navboxCore()}
  `,
  });

  track("Farming_and_Food.html", {
    title: "Farms &amp; eten",
    breadcrumbs: crumbs(
      { label: "Minecraft-hub", href: "Minecraft_Hub.html" },
      { label: "Farms & eten", href: "Farming_and_Food.html" }
    ),
    lede: "Crop-farms en villager-trades voeden je economie — ook met No Hunger.",
    body: `
  ${figure(
    guideImg("farm-loop.png"),
    "<strong>Wheat-farm.</strong> Kweek wheat, trade Farmers voor emeralds, verkoop bij de Bank.",
    "Wheat-farm voor emerald-trades"
  )}
  <h2>Farm setup voorbeeld</h2>
  <p>Top-down layout met waterkanalen. Klik om te vergroten.</p>
  ${figure(
    guideImg("farm-setup-example.png"),
    "<strong>Farm setup voorbeeld.</strong> Wisselende crop-rijen en water.",
    "Top-down wheat farm setup",
    { large: true, diagram: true }
  )}
  <h2>Wheat → emeralds → PokéDollars</h2>
  <ol class="steps">
    <li>Breek gras voor seeds; craft een hoe.</li>
    <li>Ploeg dirt binnen 4 blocks van water.</li>
    <li>Licht de farm; spring niet op crops.</li>
    <li>Trade een Farmer voor emeralds.</li>
    <li>Verkoop emeralds bij de Bank — zie <a href="Economy.html">Economie</a>.</li>
  </ol>
  <p>Uitgebreide EN-gids: <a href="../../pages/Farming_and_Food.html">Farming and food (EN)</a>.</p>
  ${navboxCore()}
  `,
  });

  // Minecraft short NL pages
  const mcPages = [
    ["Tools_and_Mining.html", "Tools & mining", "Koper en ijzer vroeg, light je caves, sterf niet dom in lava."],
    ["Combat_and_Death.html", "Gevecht & dood", "Armor, schild, totems waar mogelijk — haal je spullen terug."],
    ["Nether_Guide.html", "Nether", "Portal veilig bouwen; Blaine-routes kunnen nether-travel gebruiken."],
    ["Villages_and_Trading.html", "Dorpen & trading", "Farmers, Map Guides, loot-chests — fair game op PokeHaven."],
    ["Building_and_Storage.html", "Bouwen & opslag", "Sorteren, claimen, uitbreiden zonder chaos."],
    ["Dimensions_and_World.html", "Dimensies & wereld", "Overworld, Nether en pack-structuren in één plaatje."],
    ["Minecraft_Basics.html", "Minecraft-basics", "Korte primer als je nieuw bent in Java survival."],
  ];
  for (const [file, title, lede] of mcPages) {
    track(file, {
      title,
      breadcrumbs: crumbs(
        { label: "Minecraft-hub", href: "Minecraft_Hub.html" },
        { label: title, href: file }
      ),
      lede,
      body: `
  <p>${esc(lede)}</p>
  <p>Uitgebreide Engelse gids: <a href="../../pages/${file}">${esc(title)} (EN)</a>. Terug naar de <a href="Minecraft_Hub.html">Minecraft-hub</a>.</p>
  ${navboxCore()}
  `,
    });
  }

  track("Recipe_Browser.html", {
    title: "Receptenbrowser",
    breadcrumbs: crumbs({ label: "Receptenbrowser", href: "Recipe_Browser.html" }),
    lede: `Zoekbaar overzicht van ${recipesMeta.count} datapack-recepten.`,
    body: `
  <div class="callout tip">
    <div class="label">Interactieve browser</div>
    De volledige zoekbare browser staat op de Engelse pagina (zelfde data):
    <a href="../../pages/Recipe_Browser.html">Open Recipe Browser (EN)</a>.
  </div>
  <p>Of gebruik REI in-game (<kbd>E</kbd>) voor live grids. Zie ook <a href="Essential_Recipes.html">Essentiële recepten</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Trainer_Index.html", {
    title: "Trainer-index",
    breadcrumbs: crumbs({ label: "Trainer-index", href: "Trainer_Index.html" }),
    lede: `${trainers.all.length} named trainers uit pack-data.`,
    body: `
  <p>Volledige doorzoekbare index: <a href="../../pages/Trainer_Index.html">Trainer index (EN)</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Raid_Bosses.html", {
    title: "Raid-bosses",
    breadcrumbs: crumbs({ label: "Raid-bosses", href: "Raid_Bosses.html" }),
    lede: `${raids.bosses.length} boss-bestanden uit het pack.`,
    body: `
  <p>Volledige index: <a href="../../pages/Raid_Bosses.html">Raid bosses (EN)</a>. Uitleg: <a href="Raids.html">Raids</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Spawn_Lookup.html", {
    title: "Spawn-lookup",
    breadcrumbs: crumbs({ label: "Spawn-lookup", href: "Spawn_Lookup.html" }),
    lede: `${spawns.length} spawn-rijen uit pack-data.`,
    body: `
  <p>Interactieve lookup: <a href="../../pages/Spawn_Lookup.html">Spawn lookup (EN)</a>.</p>
  ${navboxCore()}
  `,
  });

  // Region overviews
  for (const [file, title, blurb] of [
    ["Gyms_Johto.html", "Johto", "Regio-overzicht en trainers voor Johto."],
    ["Gyms_Hoenn.html", "Hoenn", "Regio-overzicht en trainers voor Hoenn."],
    ["Gyms_Sinnoh.html", "Sinnoh", "Late-game regio-overzicht voor Sinnoh."],
  ]) {
    track(file, {
      title,
      breadcrumbs: crumbs({ label: title, href: file }),
      lede: blurb,
      body: `
  <p>${esc(blurb)}</p>
  <p>Engelse pagina met details: <a href="../../pages/${file}">${esc(title)} (EN)</a>. Startregio: <a href="Gyms_Kanto.html">Kanto</a>.</p>
  `,
    });
  }

  // Brock + Misty — full NL guides; other leaders: tip shell + EN team link
  {
    const brock = trainers.kantoLeaders.find((g) => g.slug === "Brock");
    if (brock) {
      const maxLv = Math.max(...brock.team.map((m) => Number(m.level) || 0));
      const minLv = Math.min(...brock.team.map((m) => Number(m.level) || 99));
      track("Brock.html", {
        title: "Brock",
        breadcrumbs: crumbs(
          { label: "Kanto-gyms", href: "Gyms_Kanto.html" },
          { label: "Brock", href: "Brock.html" }
        ),
        lede: `${esc(brock.name)} — ${esc(brock.type)}-specialist. Teamdata uit het CobbleVerse RCT-datapack op PokeHaven EU.`,
        infobox: `<div class="infobox-title">${esc(brock.name)}</div>
        <table>
          <tr><th>Rol</th><td>Gym Leader</td></tr>
          <tr><th>Type</th><td>${esc(brock.type)}</td></tr>
          <tr><th>Badge</th><td>${esc(brock.badge)}</td></tr>
          <tr><th>Locatie-tip</th><td>${esc(brock.biome)}</td></tr>
          <tr><th>Map-item</th><td>Brock Map Key</td></tr>
          <tr><th>Approx cap</th><td>~${maxLv + 5}</td></tr>
          <tr><th>Team levels</th><td>${minLv}–${maxLv}</td></tr>
          <tr><th>Party</th><td>${brock.team.length}</td></tr>
        </table>`,
        body: `
  <h2>Walkthrough — spawn naar Brock</h2>
  ${figure(
    guideImg("brock-gym.png"),
    "<strong>Brocks gym.</strong> Zoek een duidelijk gym-gebouw in Plains — niet een random dorpshuis.",
    "Voorbeeld gym-gebouw"
  )}
  <h3>Voorbereiden</h3>
  <ul>
    <li>Team van 4–6 met type-variatie</li>
    <li>Bij voorkeur Gras/Water tegen Rock</li>
    <li>Eten, Oran Berries, spare Poké Balls</li>
    <li>Steen/ijzeren pick voor de trip</li>
  </ul>
  ${figure(
    guideImg("hud.png"),
    "<strong>Travel-HUD.</strong> Houd je Brock-gymmap op de hotbar en heal vóór je naar binnen gaat.",
    "HUD onderweg naar de eerste gym"
  )}
  <h3>Craft Brocks map (coördinaten)</h3>
  <ol class="steps">
    <li>Je starter kit bevat een <strong>Kanto Cartography Table</strong>, <strong>Brock Map Key</strong> en <strong>Empty Map</strong>.</li>
    <li>Plaats de tafel. Doe Empty Map + Brock Map Key erin.</li>
    <li>Pak de afgewerkte map — díé heeft de marker én de exacte coördinaten.</li>
  </ol>
  ${critical(
    "nl",
    "<strong>Open / right-click de Empty Map niet eerst in de wereld.</strong> Dan is hij onbruikbaar voor gym-crafts. Gebruik een verse Empty Map in de Kanto Cartography Table."
  )}
  <div class="callout tip">
    <div class="label">Map lijkt leeg?</div>
    Loop toch de aangegeven richting. Waystones teleporteren alleen naar stenen die <em>jij</em> activeerde.
  </div>
  <h3>In de gym</h3>
  <ol class="steps">
    <li>Heal vóór de leader.</li>
    <li>Optioneel: versla gym-trainers voor XP + CobbleDollars.</li>
    <li>Win → badge → level cap stijgt.</li>
    <li>Craft daarna Misty’s map (<a href="Misty.html">Misty</a> · <a href="Gym_Maps.html">Gym-maps</a>).</li>
  </ol>

  <h2>Team</h2>
  ${teamTable(brock.team)}
  <p class="see-also"><strong>Zie ook:</strong> <a href="Gyms_Kanto.html">Kanto-gyms</a> · <a href="Level_Cap.html">Level cap</a> · <a href="First_Hours.html">Eerste uren</a></p>
  `,
      });
    }

    const misty = trainers.kantoLeaders.find((g) => g.slug === "Misty");
    if (misty) {
      const maxLv = Math.max(...misty.team.map((m) => Number(m.level) || 0));
      const minLv = Math.min(...misty.team.map((m) => Number(m.level) || 99));
      track("Misty.html", {
        title: "Misty",
        breadcrumbs: crumbs(
          { label: "Kanto-gyms", href: "Gyms_Kanto.html" },
          { label: "Misty", href: "Misty.html" }
        ),
        lede: `${esc(misty.name)} — ${esc(misty.type)}-specialist. Tweede gym-gids voor PokeHaven EU.`,
        infobox: `<div class="infobox-title">${esc(misty.name)}</div>
        <table>
          <tr><th>Rol</th><td>Gym Leader</td></tr>
          <tr><th>Type</th><td>${esc(misty.type)}</td></tr>
          <tr><th>Badge</th><td>${esc(misty.badge)}</td></tr>
          <tr><th>Locatie-tip</th><td>${esc(misty.biome)}</td></tr>
          <tr><th>Map-item</th><td>${esc(misty.specialItem)}</td></tr>
          <tr><th>Approx cap</th><td>~${maxLv + 5}</td></tr>
          <tr><th>Team levels</th><td>${minLv}–${maxLv}</td></tr>
          <tr><th>Party</th><td>${misty.team.length}</td></tr>
        </table>`,
        body: `
  <h2>Walkthrough — Brock naar Misty</h2>
  <h3>Voorbereiden</h3>
  <ul>
    <li>Electric- en Grass-coverage tegen Water</li>
    <li>Heals, spare balls, geclaimde basis om naar terug te keren</li>
    <li>Approx level-band ~${maxLv + 5} terwijl Misty volgt — <a href="Level_Cap.html">Level cap</a></li>
  </ul>
  <h3>Craft Misty’s map</h3>
  ${figure(
    guideImg("cartography-maps.png"),
    "<strong>Cartography-tafel.</strong> Empty Map + special item → afgewerkte gym-map met coördinaten.",
    "Cartography / map-crafting"
  )}
  <ol class="steps">
    <li>Craft een <strong>Cerulean Star</strong> (zoek Misty / Cerulean in REI).</li>
    <li>Craft een verse <strong>Empty Map</strong>.</li>
    <li>Combineer Empty Map + Cerulean Star in de <strong>Kanto Cartography Table</strong>.</li>
    <li>Hover de afgewerkte map voor coördinaten, reis daarna.</li>
  </ol>
  ${critical(
    "nl",
    "<strong>Seagrass dropt alleen met Shears.</strong> Blote handen geven niks. Open de Empty Map ook nooit eerst in de wereld."
  )}
  <h3>Fight-tips</h3>
  <p>${esc(misty.tips)}</p>
  <ol class="steps">
    <li>Reis met heals; activeer waystones onderweg.</li>
    <li>Clear gym-trainers als je XP of geld nodig hebt.</li>
    <li>Heal, daarna Misty challengen.</li>
    <li>Win → volgende: <a href="Lt._Surge.html">Lt. Surge</a>.</li>
  </ol>
  <h2>Team</h2>
  ${teamTable(misty.team)}
  <p class="see-also"><strong>Zie ook:</strong> <a href="Gym_Maps.html">Gym-maps</a> · <a href="Brock.html">Brock</a> · <a href="Level_Cap.html">Level cap</a></p>
  `,
      });
    }
  }

  for (const g of trainers.kantoLeaders) {
    if (g.slug === "Brock" || g.slug === "Misty") continue;
    const file = `${g.slug}.html`;
    const mapItem = g.slug === "Brock" ? "Brock Map Key" : g.specialItem;
    const maxLv = Math.max(...(g.team || []).map((m) => Number(m.level) || 0), 0);
    track(file, {
      title: g.name,
      breadcrumbs: crumbs(
        { label: "Kanto-gyms", href: "Gyms_Kanto.html" },
        { label: g.name, href: file }
      ),
      lede:
        g.order <= 8
          ? `Kanto gym ${g.order} — ${esc(g.name)} (${esc(g.type)}).`
          : `League-gevecht — ${esc(g.name)}.`,
      body: `
  <h2>Voorbereiden</h2>
  <p>${esc(g.tips)}</p>
  <ul>
    <li>Map-item: <strong>${esc(mapItem)}</strong> + Empty Map op de Kanto Cartography Table</li>
    <li>Approx cap terwijl dit gevecht volgt: ~${maxLv + 5}</li>
  </ul>
  <h2>Volledige team-tabel</h2>
  <p>Moves, held items en exacte levels: <a href="../../pages/${file}">${esc(g.name)} (EN)</a></p>
  <p><a href="Gyms_Kanto.html">← Kanto-gyms</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Level_Cap.html">Level cap</a></p>
  `,
    });
  }

  // Stubs for any remaining EN pages so the flag never 404s
  for (const entry of searchIndex) {
    const file =
      entry.href === "index.html"
        ? "index.html"
        : entry.href.replace(/^pages\//, "");
    if (written.has(file)) continue;
    if (file === "index.html") continue;
    track(file, {
      title: entry.title,
      searchIndexTitle: entry.title,
      breadcrumbs: crumbs({ label: entry.title, href: file }),
      lede: "Deze pagina heeft nog geen volledige Nederlandse tekst.",
      body: `
  <div class="callout tip">
    <div class="label">Engels beschikbaar</div>
    <p>${esc(entry.blurb || "")}</p>
    <p><a href="../../pages/${file}">Open “${esc(entry.title)}” in het Engels</a></p>
  </div>
  ${navboxCore()}
  `,
    });
  }

  void searchIndexNl;
}
