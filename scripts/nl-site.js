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
      <a href="Shiny.html">Shiny hunting</a>
      <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>
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
      <a href="Rules_and_Commands.html">Regels &amp; commands</a>
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
    <a class="hub-card" href="pages/Rules_and_Commands.html"><h3>Regels &amp; commands</h3><p>Serverregels, /pc, toetsen.</p></a>
  </div>

  <h2>Gyms &amp; progressie</h2>
  <div class="hub-grid">
    <a class="hub-card" href="pages/Gyms_Kanto.html"><h3>Kanto</h3><p>Alle 8 leaders + Elite Four.</p></a>
    <a class="hub-card" href="pages/Gyms_Johto.html"><h3>Johto</h3><p>Valerio → Lance — diepe gidsen.</p></a>
    <a class="hub-card" href="pages/Gyms_Hoenn.html"><h3>Hoenn</h3><p>Maps en trainerlijst — diepe gidsen volgen.</p></a>
    <a class="hub-card" href="pages/Gyms_Sinnoh.html"><h3>Sinnoh</h3><p>Maps en trainerlijst — diepe gidsen volgen.</p></a>
    <a class="hub-card" href="pages/Misty.html"><h3>Misty</h3><p>Tweede gym, diepe gids.</p></a>
    <a class="hub-card" href="pages/Valerio.html"><h3>Valerio</h3><p>Eerste Johto-gym — Flying.</p></a>
    <a class="hub-card" href="pages/Gym_Maps.html"><h3>Gym-maps</h3><p>Cartography &amp; coördinaten.</p></a>
    <a class="hub-card" href="pages/Progression.html"><h3>Progressie</h3><p>Regio’s &amp; gym-loop.</p></a>
    <a class="hub-card" href="pages/Achievements.html"><h3>Achievements</h3><p>Pack advancement-checklist.</p></a>
    <a class="hub-card" href="pages/Postgame_and_Legendaries.html"><h3>Post-game</h3><p>Mew, birds, Mewtwo.</p></a>
    <a class="hub-card" href="pages/Mega_and_Late_Game.html"><h3>Mega &amp; late-game</h3><p>Gimmicks + checklist na Blue.</p></a>
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
    <a class="hub-card" href="pages/Raids.html"><h3>Raids</h3><p>Dens, tiers, damage-share.</p></a>
    <a class="hub-card" href="pages/Claims.html"><h3>Claims</h3><p>FTB Chunks.</p></a>
    <a class="hub-card" href="pages/Travel.html"><h3>Reizen</h3><p>Waystones.</p></a>
    <a class="hub-card" href="pages/Breeding.html"><h3>Broeden</h3><p>Pasture, eieren, Ditto-regels.</p></a>
    <a class="hub-card" href="pages/Shiny.html"><h3>Shiny hunting</h3><p>Rates, Masuda, crystals.</p></a>
    <a class="hub-card" href="pages/Fishing.html"><h3>Vissen</h3><p>Cobblemon-hengels en water-catches.</p></a>
    <a class="hub-card" href="pages/Outfits_and_Cosmetics.html"><h3>Outfits &amp; cosmetics</h3><p>Trainerkleding &amp; Pokémon-looks.</p></a>
    <a class="hub-card" href="pages/Common_Mistakes.html"><h3>Veelgemaakte fouten</h3><p>Één keer maken.</p></a>
    <a class="hub-card" href="pages/Rules_and_Commands.html"><h3>Regels &amp; commands</h3><p>Serverregels, /pc, toetsen.</p></a>
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
  <p>Prijslijsten staan in de Engelse economie-pagina. Gebruik de vlag om te wisselen, of open <a href="../../pages/Economy.html">Economie (EN, met tabellen)</a> naast deze uitleg.</p>
  <h2>Tips</h2>
  <ul>
    <li>Investeer vroeg in food/crop-farms — zie <a href="Farming_and_Food.html">Farms &amp; eten</a>.</li>
    <li>Koop niet alles; craft Poké Balls zelf (<a href="Poke_Balls.html">gids</a>).</li>
    <li>Claim je farms zodat niemand meepikt.</li>
  </ul>
  ${navboxCore()}
  `,
  });

  track("Raids.html", (() => {
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
    return {
      title: "Raids",
      breadcrumbs: crumbs({ label: "Raids", href: "Raids.html" }),
      lede: "Raid-dens zijn crystal-fights in de overworld. Neem heals, type-coverage en vrienden mee voor hogere tiers — vroeg wipe’en kost tijd en items.",
      infobox: `<div class="infobox-title">Raid-dens</div>
    <table>
      <tr><th>Waar</th><td>Overworld-crystals</td></tr>
      <tr><th>Spawn-kans</th><td>1 / ${raids.common.spawnRate}</td></tr>
      <tr><th>Reset</th><td>~${resetHours}u game time (${raids.common.resetTime}s)</td></tr>
      <tr><th>Cycle</th><td>${raids.common.cycleMode}</td></tr>
      <tr><th>Beloningen</th><td>${raids.common.rewardDistribution} (meedoen)</td></tr>
      <tr><th>Retry fails</th><td>${raids.common.retryFailed ? "Ja" : "Nee"}</td></tr>
      <tr><th>Shard energy</th><td>${raids.common.requiredEnergy}</td></tr>
      <tr><th>Boss-index</th><td><a href="Raid_Bosses.html">${raids.bosses.length} bosses</a></td></tr>
      <tr><th>Tier-weights</th><td>${weights}</td></tr>
    </table>`,
      body: `
  <h2>Wanneer raiden</h2>
  <p>Begin met <strong>T1–T3</strong> als je een stabiel team, Revives en spare balls hebt. Dens zijn bonus-geld en zeldzame loot — geen skip voor gyms. Bewaar <strong>T5+</strong> tot je <a href="Level_Cap.html">level cap</a> en coverage een lange fight aankunnen.</p>
  <div class="callout tip">
    <div class="label">Check de boss eerst</div>
    Open <a href="Raid_Bosses.html">Raid-bosses</a>, zoek de species, en neem answers mee voor z’n moves. Zes dezelfde mon verliest meer dens dan een gemengd team.
  </div>

  <h2>Hoe een den werkt</h2>
  <ol class="steps">
    <li>Verken de overworld tot je een <strong>raid-den crystal</strong> vindt.</li>
    <li>Heal op, zet een <a href="Travel.html">waystone</a> of Xaero-pin in de buurt als je terugkomt.</li>
    <li>Start de raid — heals klaar. Met party: gebruik <a href="Voice_Chat.html">voice chat</a>.</li>
    <li>Doe schade. Beloningen gebruiken <strong>${raids.common.rewardDistribution}</strong> — draag bij of je mist de cut.</li>
    <li>Na clears / de timer reset de den en kan boss én tier wisselen.</li>
  </ol>

  <h2>Prep-checklist</h2>
  <ul>
    <li>Team vol geheald + Revives / heal-items in de hotbar</li>
    <li>Type-coverage voor de boss (en z’n STAB-moves)</li>
    <li>Level-passende mons — geen T2-team in T6</li>
    <li>Vrienden voor tiers met hogere max players (zie tabel)</li>
    <li>Shard energy klaar (${raids.common.requiredEnergy} vereist)</li>
  </ul>

  <h2>Beloningen &amp; damage-share</h2>
  <p>Loot en payout schalen met hoeveel je helpt. Elke tier heeft een <strong>minimum damage-share</strong> (ongeveer 16–20%) — AFK zitten kan betekenen: geen reward, ook als de groep wint. Het $-bedrag in de tabel is de currency-reward; hogere tiers hebben meer HP (multiplier) en betere IVs.</p>
  <ul>
    <li><strong>Hidden Ability-kans:</strong> 20% op elke tier</li>
    <li><strong>Max clears</strong> per den vóór rotate: 3</li>
    <li><strong>Gefaalde raids:</strong> opnieuw proberen (${raids.common.retryFailed ? "ja" : "nee"})</li>
    <li><strong>T6–T7 AI:</strong> STRONG — slimmer dan vroege dens</li>
  </ul>

  <h2>Party-grootte</h2>
  <p>T1 is solo. T2–T3 kleine groups. Vanaf <strong>T4</strong> max <strong>vier</strong> spelers — gebruik dat voor T5–T7. Verdeel rollen in voice: iemand chipt voor de damage-drempel, iemand walls, iemand dekt types.</p>

  <h2>Tier-tabel</h2>
  <p>Hogere <em>tier weight</em> = vaker gerold. Op PokeHaven komen mid-tiers (zeker T4) vaker voor dan T6/T7.</p>
  <table class="wikitable">
    <thead><tr>
      <th>Tier</th><th>Boss lv</th><th>Max players</th><th>IVs</th><th>$</th><th>HP ×</th><th>Min damage</th><th>HA</th><th>AI</th><th>Max clears</th>
    </tr></thead>
    <tbody>${tierRows}</tbody>
  </table>
  <p class="muted">Tier-weights: ${weights}</p>

  <h2>Dens terugvinden</h2>
  <ol class="steps">
    <li>Pin de crystal op <strong>Xaero’s World Map</strong> zodra je ‘m ziet.</li>
    <li>Zet een genaamde waystone neer als de den farm-waardig is na reset.</li>
    <li>Na ~${resetHours} uur game time opnieuw checken — boss/tier kan wisselen.</li>
  </ol>

  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>T5+ starten onder de level cap zonder Revives</li>
    <li>Damage-share negeren en geen reward krijgen</li>
    <li>Eén type meenemen tegen een boss die dat walls</li>
    <li>Den niet pinnen — en ‘m kwijtraken in de meadow</li>
    <li>Raiden i.p.v. gyms terwijl je vastzit op de <a href="Level_Cap.html">level cap</a></li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Raid_Bosses.html">Raid-bosses</a> · <a href="Economy.html">Economie</a> · <a href="Voice_Chat.html">Voice chat</a> · <a href="Travel.html">Reizen</a> · <a href="Catching_and_Battling.html">Vangen &amp; vechten</a> · <a href="Healing_and_Storage.html">Genezen &amp; opslag</a></p>
  ${navboxCore()}
  `,
    };
  })());

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
  <h2>Mega / Z / Tera / Dynamax</h2>
  <p>Mega Showdown staat aan. Pack-settings + checklist na Kanto: <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>.</p>
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
    lede: "Waystones zijn gratis snelle travel op PokeHaven EU. Combineer ze met gym-maps, Xaero-pins en een mount zodat je nooit dezelfde 2000 blokken opnieuw loopt.",
    body: `
  ${figure(
    "../../assets/waystone.png",
    "<strong>Waystone.</strong> Rechtsklik om te activeren. Shift + rechtsklik om te hernoemen. Bouw een netwerk: Spawn, Home, elke gym-stop.",
    "Waystone teleport-blok"
  )}
  <h2>Setup op dag één</h2>
  <ol class="steps">
    <li>Activeer de <strong>spawn</strong>-waystone zodra je inlogt.</li>
    <li>Plaats en activeer er één bij je <a href="Claims.html">geclaimde</a> basis (bij bed + chests).</li>
    <li>Na elke gym (of lange hike): activeer een steen in de buurt — of plaats er zelf één.</li>
    <li>Hernoem duidelijk: <em>Home</em>, <em>Brock</em>, <em>Misty</em>, <em>Raid dens</em>, enz.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Gratis netwerk</div>
    Op deze server hebben waystones <strong>geen teleport-kosten</strong> en geen cooldown. Gebruik ze vaak.
  </div>

  <h2>Waystones vs pins vs gym-maps</h2>
  <table class="wikitable">
    <thead><tr><th>Systeem</th><th>Wat het doet</th><th>Teleporteert?</th></tr></thead>
    <tbody>
      <tr><td>Waystone</td><td>Wereldblok — jij (en anderen die ‘m activeren) kunnen erheen warpen</td><td>Ja</td></tr>
      <tr><td>Xaero-pin</td><td>Persoonlijke map-marker</td><td>Nee</td></tr>
      <tr><td>Gym-map</td><td>Afgewerkte map met coördinaten voor een leader</td><td>Nee — alleen navigatie</td></tr>
    </tbody>
  </table>

  <h2>Gym-route gewoonte</h2>
  <ol class="steps">
    <li>Craft de map van de leader op de juiste cartography-tafel — <a href="Gym_Maps.html">Gym-maps</a>.</li>
    <li>Pin de coördinaten in Xaero als je een spoor op de minimap wilt.</li>
    <li>Rijd of loop erheen (<a href="Riding.html">Rijden</a>), vecht, waystone terug naar huis om te healen.</li>
    <li>Laat een genaamde waystone bij de gym achter als je terugkomt voor rematches of vrienden.</li>
  </ol>

  <h2>Andere tools</h2>
  <ul>
    <li><strong>Nature’s Compass / Explorer’s Compass</strong> — biomes of structures zoeken.</li>
    <li><strong>Xaero’s World Map</strong> — uitzoomen, dens pinnen, caves markeren.</li>
    <li><strong>Bed + waystone thuis</strong> — death moet een korte teleporteer + wandeling zijn, geen continent-hike.</li>
  </ul>

  <h2>Etiquette</h2>
  <ul>
    <li>Breek of grief geen andermans waystone-netwerk.</li>
    <li>Publieke stenen: activeer ze, hernoem ze niet als anderen de naam nodig hebben.</li>
    <li>Vraag voordat je een steen diep in iemands claim plant.</li>
  </ul>

  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>Langslopen zonder te activeren — dan staat ‘ie niet in je lijst.</li>
    <li>Alleen Xaero pinnen en verwachten dat je kunt teleporteren.</li>
    <li>Empty Map in de wereld openen vóór gym-crafting — die map is dan waardeloos voor de cartography-recept.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Riding.html">Rijden</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Claims.html">Claims</a> · <a href="First_Hours.html">Eerste uren</a></p>
  ${navboxCore()}
  `,
  });

  track("Rules_and_Commands.html", {
    title: "Regels &amp; commands",
    breadcrumbs: crumbs({ label: "Regels & commands", href: "Rules_and_Commands.html" }),
    lede: "Speel fair, wees cool, houd PokeHaven leuk. Dezelfde regels als Discord <code>#rules</code> — plus de chat-commands en toetsen die je elke dag gebruikt.",
    body: `
  <div class="callout tip">
    <div class="label">Akkoord</div>
    Door te joinen op de Minecraft-server of in de
    <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a>
    te blijven, ga je akkoord met deze regels.
  </div>

  <h2>Serverregels</h2>
  <ol class="steps">
    <li><strong>Respect</strong> — Wees aardig. Geen harassment, hate speech, discriminatie of toxische drama. Oneens zijn mag; een eikel zijn niet.</li>
    <li><strong>Geen cheaten</strong> — Geen x-ray, dupes, hacked clients, macros voor oneerlijk voordeel, of exploits. Bug gevonden? Meld in Discord <code>#bug-reports</code> — misbruik ‘m niet.</li>
    <li><strong>Claims &amp; builds</strong> — Geen griefing, stelen of andermans bases slopen. Claim met <strong>FTB Chunks</strong> — ungeclaimd land is niet beschermd. Details: <a href="Claims.html">Claims</a>.</li>
    <li><strong>Geen spam / ads</strong> — Geen spam, mass-pings, scam-links of reclame voor andere servers / Discords. Self-promo alleen met staff-goedkeuring.</li>
    <li><strong>Chat</strong> — <strong>English</strong> is de hoofdtaal in publieke channels (EU-server). Houd het SFW. Namen, nicknames en profielfoto’s netjes houden.</li>
    <li><strong>Voice chat</strong> — Push-to-talk heeft voorkeur. Geen earrape, soundboards blazen of zinloos schreeuwen. Setup: <a href="Voice_Chat.html">Voice chat</a>.</li>
    <li><strong>Hulp vragen</strong> — Gebruik Discord <code>#help</code> met wat misging, een screenshot, en wat je al probeerde.</li>
    <li><strong>Staff-beslissingen</strong> — Staff mag warnen, muten, kicken of bannen. Bediscussieer moderatie niet publiek — contacteer staff privé als nodig.</li>
  </ol>

  <h2>Handige chat-commands</h2>
  <p>Typ <code>/</code> in chat om te zien wat je client aanbiedt. Dit zijn de commands die de meeste trainers op PokeHaven EU nodig hebben:</p>
  <table class="wikitable">
    <thead><tr><th>Command</th><th>Wat het doet</th></tr></thead>
    <tbody>
      <tr><td><code>/pc</code></td><td>Open Pokémon PC-opslag overal — <a href="Healing_and_Storage.html">Genezen &amp; opslag</a></td></tr>
    </tbody>
  </table>
  <div class="callout tip">
    <div class="label">Geld &amp; shops</div>
    PokéDollars lopen via in-world shops en de Bank — er is geen aparte “must-learn” money-command voor dagelijks spelen.
    Zie <a href="Economy.html">Economie</a>.
  </div>

  <h2>Toetsen die je constant gebruikt</h2>
  <table class="wikitable">
    <thead><tr><th>Actie</th><th>Standaard</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Party / starter</td><td><kbd>C</kbd></td><td>Starter kiezen en team beheren</td></tr>
      <tr><td>Uitsturen / recall</td><td><kbd>R</kbd></td><td>Battles en mounts</td></tr>
      <tr><td>Recipe viewer (REI)</td><td><kbd>E</kbd></td><td>Live crafts — <a href="Essential_Recipes.html">Essentiële recepten</a></td></tr>
      <tr><td>Rijden</td><td><kbd>Shift</kbd> + rechtsklik</td><td><a href="Riding.html">Rijden</a></td></tr>
      <tr><td>Claim-map (FTB Chunks)</td><td>Bind in Controls → zoek <em>FTB</em> / <em>Chunks</em></td><td><a href="Claims.html">Claims</a></td></tr>
      <tr><td>Voice chat</td><td>Controls → Simple Voice Chat</td><td>Push-to-talk heeft voorkeur — <a href="Voice_Chat.html">Voice chat</a></td></tr>
    </tbody>
  </table>

  <h2>Waar vind je wat</h2>
  <ul>
    <li><strong>Wiki:</strong> <a href="https://pokehaven.wiki/nl/">pokehaven.wiki/nl</a> · <a href="https://pokehaven.wiki">EN</a></li>
    <li><strong>Discord:</strong> IP, pack-zip, help — <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">join hier</a></li>
    <li><strong>Eerste uren:</strong> <a href="Getting_Started.html">Aan de slag</a> · <a href="First_Hours.html">Eerste uren</a> · <a href="FAQ.html">FAQ</a></li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Common_Mistakes.html">Veelgemaakte fouten</a> · <a href="Claims.html">Claims</a> · <a href="Voice_Chat.html">Voice chat</a></p>
  ${navboxCore()}
  `,
  });

  track("Voice_Chat.html", {
    title: "Voice chat",
    breadcrumbs: crumbs({ label: "Voice chat", href: "Voice_Chat.html" }),
    lede: "Simple Voice Chat zit in het pack. Nabij praten werkt in-game — Discord is optioneel voor lobby, nieuws en aankondigingen.",
    infobox: `<div class="infobox-title">Voice</div>
  <table>
    <tr><th>Hoorafstand</th><td>~48 blokken</td></tr>
    <tr><th>Whisper</th><td>~24 blokken</td></tr>
    <tr><th>Groepen</th><td>Aan</td></tr>
    <tr><th>Forced VC</th><td>Nee</td></tr>
  </table>`,
    body: `
  <h2>Eerste keer</h2>
  <ol class="steps">
    <li>Join PokeHaven EU en sta mic / voice-chat toe als Windows of het spel daarom vraagt.</li>
    <li>Open <strong>Esc → Options → Controls → Simple Voice Chat</strong> en zet <strong>Push to talk</strong> (fijnst in groepen).</li>
    <li>Kies het juiste input-device als niemand je hoort.</li>
    <li>Test met iemand in de buurt — binnen de hoorafstand moet je elkaar horen.</li>
  </ol>

  <h2>Hoe het hier werkt</h2>
  <ul>
    <li><strong>Proximity chat</strong> — mensen bij je horen je; loop weg en het volume zakt.</li>
    <li><strong>Whisper</strong> — korter bereik (~24 blokken).</li>
    <li><strong>Groepen</strong> — handig voor raids, gym-runs of bouwcrew terwijl je uit elkaar loopt.</li>
    <li>Voice is <strong>niet verplicht</strong> — mute of blijf in text als je wilt.</li>
  </ul>

  <h2>Discord vs in-game voice</h2>
  <table class="wikitable">
    <thead><tr><th>Situatie</th><th>Beste tool</th></tr></thead>
    <tbody>
      <tr><td>Praten tijdens exploreren / raiden naast iemand</td><td>In-game Simple Voice Chat</td></tr>
      <tr><td>Server-nieuws, IP, rules, LFG</td><td><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a></td></tr>
      <tr><td>Lange AFK-voice terwijl je niet bij elkaar bent</td><td>Discord (of een VC-groep)</td></tr>
    </tbody>
  </table>

  <h2>Problemen oplossen</h2>
  <ul>
    <li><strong>Niemand hoort je:</strong> verkeerde mic, mute-toets, of Windows privacy blokkeert Minecraft.</li>
    <li><strong>Jij hoort niets:</strong> output-device, game-volume, buiten bereik / niet in dezelfde groep.</li>
    <li><strong>Echo:</strong> koptelefoon; push-to-talk i.p.v. open mic.</li>
    <li>Caves/gebouwen kunnen “echter” klinken met Sound Physics — dat is normaal.</li>
  </ul>

  <h2>Etiquette</h2>
  <ul>
    <li>Push-to-talk bij een drukke raid of crowd.</li>
    <li>Geen muziek blazen in open mic.</li>
    <li>Respecteer mutes — als iemand deafent, niet zeuren in chat.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Raids.html">Raids</a> · <a href="Getting_Started.html">Aan de slag</a> · <a href="FAQ.html">FAQ</a></p>
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

  <h2>Waar is de spelerswiki?</h2>
  <p><strong><a href="https://pokehaven.wiki">pokehaven.wiki</a></strong> — Engels + Nederlands (vlaggen). Ook gepind in Discord <code>#pokehaven-wiki</code>. Start met Aan de slag, Claims, Gym-maps, Brock.</p>

  <h2>Waar vraag ik hulp?</h2>
  <p><a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">PokeHaven EU Discord</a> — stuur screenshot + wat je al probeerde. IP/pack in <code>#how-to-join</code>.</p>

  <h2>Kan ik de level cap uitzetten?</h2>
  ${critical(
    "nl",
    "<strong>Nee — niet op PokeHaven EU.</strong> Versla de volgende gym. Zie <a href=\"Level_Cap.html\">Level cap</a>."
  )}

  <h2>Waarom bijten er geen Pokémon aan mijn hengel?</h2>
  <p>Gebruik een <strong>Cobblemon</strong>-hengel (Poke Rod / Lure Rod / …), niet alleen vanilla. Gids: <a href="Fishing.html">Vissen</a>.</p>

  <h2>Hoe werken shiny-odds?</h2>
  <p>Wild base <strong>1 / 2048</strong>. Broeden: Masuda / crystal. Zie <a href="Shiny.html">Shiny hunting</a> · <a href="Breeding.html">Broeden</a>.</p>

  <h2>Ik versloeg Blue — moet de server herstarten?</h2>
  <p><strong>Nee.</strong> Volg het champion-boek: Trainer Association → Johto-card. Ontbreken structures? Discord — staff kan 1× herstarten. Checklist: <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a> · <a href="Progression.html">Progressie</a> · <a href="Blue.html">Blue</a>.</p>

  <h2>Hoe werken outfits / costumes?</h2>
  <p>Craft trainerkleding met Cloth (wol + string), trek aan in armor-slots. Pokémon-looks via cosmetic slot / special items. Gids: <a href="Outfits_and_Cosmetics.html">Outfits &amp; cosmetics</a>.</p>
  ${critical(
    "nl",
    "<strong>Cosplay Pikachu evolueert niet naar Raichu.</strong> Gebruik een gewone Pallet-Pikachu als je Raichu wilt."
  )}

  <p class="see-also"><strong>Zie ook:</strong> <a href="Common_Mistakes.html">Veelgemaakte fouten</a> · <a href="https://pokehaven.wiki">Wiki</a> · <a href="Roadmap.html">30-dagen roadmap</a></p>
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

  <h2>Volledige receptenlijst</h2>
  <p>${recipesMeta.count} recepten staan in de <a href="Recipe_Browser.html">Receptenbrowser</a> (EN-tool met dezelfde lijst).</p>
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
      <tr class="critical-row"><td>Verkeerde pack-versie</td><td>Niet joinen</td><td>1.7.42 opnieuw uit Discord <code>#how-to-join</code></td></tr>
      <tr class="critical-row"><td>Oud IP uit screenshot</td><td>Geen connectie</td><td>Live IP alleen uit <code>#how-to-join</code></td></tr>
      <tr class="critical-row"><td>Level cap negeren</td><td>“XP kapot”</td><td><a href="Level_Cap.html">Volgende gym</a></td></tr>
      <tr class="critical-row"><td>Geen claim / verkeerde mod</td><td>Chests leeg</td><td>Alleen <a href="Claims.html">FTB Chunks</a> (niet Open Parties)</td></tr>
      <tr class="critical-row"><td>Empty Map openklikken</td><td>Geen gym-map</td><td>Nieuwe Empty Map + <a href="Gym_Maps.html">regio-tafel</a></td></tr>
      <tr class="critical-row"><td>Verkeerde regio-cartography</td><td>Map faalt / verkeerde regio</td><td>Kanto-tafel voor Kanto; later Johto/Hoenn/Sinnoh — <a href="Gym_Maps.html">Gym-maps</a></td></tr>
      <tr class="critical-row"><td>Seagrass met hand</td><td>0 drops</td><td>Shears — <a href="Misty.html">Misty</a></td></tr>
      <tr class="critical-row"><td>Alleen vanilla-hengel</td><td>Vis-items, weinig Pokémon</td><td>Cobblemon-hengels — <a href="Fishing.html">Vissen</a></td></tr>
      <tr class="critical-row"><td>Pasture/eieren niet geclaimd</td><td>Shiny-project gestolen</td><td>Claim breedfarm — <a href="Breeding.html">Broeden</a> · <a href="Shiny.html">Shiny</a></td></tr>
      <tr><td>Wiki nooit openen</td><td>Zelfde Discord-tickets</td><td><a href="https://pokehaven.wiki">pokehaven.wiki</a> · <code>#pokehaven-wiki</code></td></tr>
      <tr><td>Alleen luxe shop-gear</td><td>Broke</td><td>Balls craften; emeralds verkopen</td></tr>
      <tr><td>Palace / shiny vóór gyms</td><td>Trage progressie</td><td>Eerst gyms — <a href="Brock.html">Brock</a></td></tr>
      <tr class="critical-row"><td>Verkeerde Pokémon geselecteerd</td><td>Verkeerde mon uitgestuurd</td><td>Pijltjestoetsen, dan <kbd>R</kbd></td></tr>
      <tr class="critical-row"><td>Cosplay Pikachu voor Raichu</td><td>Evolueert nooit</td><td>Gewone Pallet-Pikachu — <a href="Outfits_and_Cosmetics.html">Outfits</a></td></tr>
      <tr><td>“Wereld sluiten” na Blue</td><td>Verwarring op multiplayer</td><td>Champion-boek → Johto-card; Discord bij ontbrekende structures</td></tr>
    </tbody>
  </table>
  <p><a href="FAQ.html">FAQ</a> · <a href="https://pokehaven.wiki">Wiki</a> · <a href="${DISCORD_INVITE}" rel="noopener noreferrer" target="_blank">Discord</a></p>
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
  <p>Johto-card + optioneel post-game / Mega-prep — <a href="Mega_and_Late_Game.html">Late-game checklist</a> · <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Achievements.html">Achievements</a>.</p>
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
    <li>Zoek elke naam in <a href="Spawn_Lookup.html">Spawn-lookup</a> voor biomes en spawn-buckets.</li>
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
      <tr><td>Mega / Tera / Dynamax + Johto-prep</td><td><a href="Mega_and_Late_Game.html">Mega &amp; late-game</a></td></tr>
    </tbody>
  </table>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Achievements.html">Achievements</a> · <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a> · <a href="Progression.html">Progressie</a> · <a href="Blue.html">Blue</a> · <a href="Giovanni.html">Giovanni</a></p>
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
    lede: "Broed met CobBreeding-pastures op PokeHaven EU. Eieren kosten minuten — claim je farm, plan je AFK.",
    infobox: `<div class="infobox-title">Broeden</div>
  <table>
    <tr><th>Egg-wait</th><td>~7–15 min</td></tr>
    <tr><th>Hidden Abilities</th><td>Aan</td></tr>
    <tr><th>Ditto×Ditto legendaries</th><td>Geblokkeerd</td></tr>
    <tr><th>Shiny-methodes</th><td><a href="Shiny.html">Shiny hunting</a></td></tr>
  </table>`,
    body: `
  <h2>Setup</h2>
  <ol class="steps">
    <li>Claim met <a href="Claims.html">FTB Chunks</a>.</li>
    <li>Plaats een <strong>pasture</strong>-blok (REI: “pasture”).</li>
    <li>Bouw een pen bij bed/waystone.</li>
    <li>Zet een compatible paar (of <strong>Ditto + parent</strong>) in range.</li>
    <li>Wacht op eieren — pack-config ongeveer <strong>7–15 minuten</strong> per window.</li>
  </ol>
  <h2>Regels op PokeHaven</h2>
  <ul>
    <li><strong>Hidden Abilities</strong> kunnen doorgeven (aan in CobBreeding).</li>
    <li><strong>Ditto + Ditto</strong> farmt hier <em>geen</em> random legendaries / paradox / ultra beasts.</li>
    <li>Hoppers mogen uit pastures pullen (automatisering ok volgens pack).</li>
  </ul>
  <h2>Waarvoor broeden?</h2>
  <ul>
    <li><strong>Early:</strong> eerst coverage vangen, geen shiny-project vóór badges.</li>
    <li><strong>Mid:</strong> natures / bruikbare IVs met Ditto + balls-farm.</li>
    <li><strong>Shiny:</strong> Masuda-style + crystal — zie <a href="Shiny.html">Shiny hunting</a>.</li>
  </ul>
  ${critical(
    "nl",
    "<strong>Claim de pasture.</strong> Unclaimed eieren/parents = free loot."
  )}
  <p class="see-also"><strong>Zie ook:</strong> <a href="Shiny.html">Shiny hunting</a> · <a href="Claims.html">Claims</a> · <a href="Catching_and_Battling.html">Vangen &amp; vechten</a></p>
  ${navboxCore()}
  `,
  });

  track("Shiny.html", {
    title: "Shiny hunting",
    breadcrumbs: crumbs({ label: "Shiny hunting", href: "Shiny.html" }),
    lede: "Shiny-odds op PokeHaven EU / CobbleVerse — wild versus breeding-methodes.",
    infobox: `<div class="infobox-title">Shiny-odds</div>
  <table>
    <tr><th>Base wild</th><td>1 / 2048</td></tr>
    <tr><th>Masuda</th><td>×2 (breeding)</td></tr>
    <tr><th>Crystal</th><td>×2 (breeding)</td></tr>
    <tr><th>Always</th><td>×8 (breeding)</td></tr>
  </table>`,
    body: `
  <h2>Base rate</h2>
  <p>Wild shiny-rate uit Cobblemon-config: <strong>1 / 2048</strong>. Dat is je default in het wild of tijdens vissen.</p>

  <h2>Breeding shiny-methodes (CobBreeding)</h2>
  <p>Egg-rolls kunnen method-multipliers gebruiken. Nog steeds zeldzaam — geen “zo klaar”.</p>
  <table class="wikitable">
    <thead><tr><th>Methode</th><th>Multiplier</th><th>Rough (alleen die multiplier op 1/2048)</th></tr></thead>
    <tbody>
      <tr><td><strong>Masuda</strong></td><td>×2</td><td>~1 / 1024</td></tr>
      <tr><td><strong>Crystal</strong></td><td>×2</td><td>~1 / 1024</td></tr>
      <tr><td><strong>Always</strong></td><td>×8</td><td>~1 / 256</td></tr>
    </tbody>
  </table>
  ${critical(
    "nl",
    "<strong>Ga er niet van uit dat alles eindeloos stackt.</strong> Check REI / tooltips / CobBreeding in-game hoe Masuda vs crystal vs “always” op jouw paar werkt."
  )}

  <h2>Praktische loops</h2>
  <ol class="steps">
    <li><strong>Wild / vissen:</strong> goede biomes + balls-farm. Lange hunts bij 1/2048 — <a href="Fishing.html">Vissen</a> · <a href="Spawn_Lookup.html">Spawn-lookup</a>.</li>
    <li><strong>Broeden:</strong> geclaimde pasture, Ditto + target, Masuda-style als het kan — ~7–15 min eggs — <a href="Breeding.html">Broeden</a>.</li>
    <li><strong>Food-buffs:</strong> CobbleCuisine kan tijdelijke shiny-boosts geven — check tooltips.</li>
    <li><strong>Gyms eerst:</strong> een shiny verhoogt de level cap niet.</li>
  </ol>

  <h2>Mythes</h2>
  <ul>
    <li>“Lucky chunk” zonder juiste spawn/methode.</li>
    <li>Ditto×Ditto legendary-farm — hier geblokkeerd.</li>
    <li>Unclaimed pasture — iemand steelt je project.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Breeding.html">Broeden</a> · <a href="Catching_and_Battling.html">Vangen &amp; vechten</a> · <a href="Claims.html">Claims</a></p>
  ${navboxCore()}
  `,
  });

  track("Mega_and_Late_Game.html", {
    title: "Mega &amp; late-game",
    breadcrumbs: crumbs({ label: "Mega &amp; late-game", href: "Mega_and_Late_Game.html" }),
    lede: "Wat Mega Showdown toelaat op PokeHaven EU, plus een praktische checklist na Kanto — vóór Johto, raids of legendaries.",
    infobox: `<div class="infobox-title">Mega Showdown (pack)</div>
  <table>
    <tr><th>Mega Evolution</th><td>Aan</td></tr>
    <tr><th>Z-Moves</th><td>Aan</td></tr>
    <tr><th>Terastallization</th><td>Aan</td></tr>
    <tr><th>Dynamax</th><td>Aan (power spots)</td></tr>
    <tr><th>Multiple Megas</th><td>Toegestaan</td></tr>
    <tr><th>Dynamax overal?</th><td>Nee</td></tr>
    <tr><th>Power spot range</th><td>32 blocks</td></tr>
    <tr><th>Tera shards voor Tera</th><td>50</td></tr>
  </table>`,
    body: `
  <h2>Prioriteit op PokeHaven</h2>
  <ol class="steps">
    <li><strong>Badges &amp; level cap</strong> — gyms unlocken levels; gimmicks niet. Zie <a href="Level_Cap.html">Level cap</a>.</li>
    <li><strong>Claim + heals + balls</strong> — basisveiligheid eerst. <a href="Claims.html">Claims</a> · <a href="Poke_Balls.html">Poké Balls</a>.</li>
    <li><strong>Leer één gimmick</strong> — Mega <em>of</em> Tera <em>of</em> Dynamax voor zware fights; blijf niet steken in Kanto voor elke stone.</li>
    <li><strong>Na Blue</strong> — Johto Trainer Card (champion-boek), daarna optioneel post-game. <a href="Blue.html">Blue</a> · <a href="Progression.html">Progressie</a>.</li>
  </ol>
  ${critical(
    "nl",
    "<strong>Week-één-regel:</strong> badges gaan vóór Mega / Dynamax-flex. Versla eerst de volgende gym."
  )}

  <h2>Mega Evolution</h2>
  <ul>
    <li>Aan. <strong>Multiple Megas</strong> toegestaan in de Mega Showdown-config van dit pack.</li>
    <li>Outside-battle Mega staat aan — handig voor reizen/showcase; in battle nog steeds de juiste held stone + Key Stone-flow van de mod.</li>
    <li>Zoek in REI (<kbd>E</kbd>) naar <em>mega</em>, <em>ite</em>, of species + stone. Raid dens kunnen Mega-bosses hebben — <a href="Raid_Bosses.html">Raid-bosses</a>.</li>
    <li>Exacte Key Stone / bracelet-recepten wijzigen mee met updates — vertrouw in-game recepten.</li>
  </ul>

  <h2>Z-Moves</h2>
  <ul>
    <li>Aan. Je hebt matching Z-Crystal / Z-Ring-achtige items nodig (REI: <em>z</em> / crystal-namen).</li>
    <li>Eén sterke Z-Move kan een gym/raid-turn kantelen — breng alsnog type-coverage mee.</li>
  </ul>

  <h2>Terastallization</h2>
  <ul>
    <li>Aan. Pack vraagt <strong>50 Tera Shards</strong> van het juiste type (<code>teraShardRequired</code>).</li>
    <li>Drop-weights in config: gewone Tera shards <strong>10</strong>, Stellar <strong>1</strong> — farm via mod-bronnen / REI.</li>
    <li>Cobblemon wild <strong>tera type rate</strong> op dit pack: <strong>20</strong> — Tera’d wilds kunnen spawnen; dat is niet hetzelfde als jouw Tera Orb-progress.</li>
  </ul>

  <h2>Dynamax</h2>
  <ul>
    <li>Aan, maar <strong>niet overal</strong> — je hebt een <strong>power spot</strong> nodig binnen ca. <strong>32 blocks</strong>.</li>
    <li>Cobblemon max Dynamax level: <strong>10</strong>.</li>
    <li>Gerelateerd craft: <strong>Star Core</strong> (Wishing Star + gems) — check REI.</li>
  </ul>

  <h2>Late-game checklist (na late Kanto / Blue)</h2>
  <table class="wikitable">
    <thead><tr><th>Klaar?</th><th>Taak</th><th>Waarom</th></tr></thead>
    <tbody>
      <tr><td>☐</td><td><a href="Blue.html">Champion Blue</a> verslaan</td><td>Kanto clear; Johto-pad opent</td></tr>
      <tr><td>☐</td><td>Champion-boek → Trainer Association → <strong>Johto Trainer Card</strong></td><td>Jouw level cap reset voor Johto</td></tr>
      <tr><td>☐</td><td><strong>Johto</strong>-maps op de <strong>Johto Cartography Table</strong></td><td>Verkeerde regio-tafel = verspilde Empty Maps — <a href="Gym_Maps.html">Gym-maps</a></td></tr>
      <tr><td>☐</td><td>Party healen + balls / Revives bijvullen</td><td>Johto-leaders raken harder</td></tr>
      <tr><td>☐</td><td><a href="Claims.html">FTB-claim</a> checken</td><td>Late-game loot is de moeite waard om te stelen</td></tr>
      <tr><td>☐</td><td>Eén gimmick kiezen (Mega / Tera / Dynamax)</td><td>Minder inventory-chaos</td></tr>
      <tr><td>☐</td><td>Optioneel: <a href="Postgame_and_Legendaries.html">Mew / birds / Mewtwo</a></td><td>Parallel — niet verplicht voor Johto-gyms</td></tr>
      <tr><td>☐</td><td>Optioneel: hogere <a href="Raids.html">raids</a></td><td>Mega-bosses + shard/loot</td></tr>
      <tr><td>☐</td><td>Optioneel: <a href="Shiny.html">shiny</a> / <a href="Breeding.html">broeden</a></td><td>Side content; claim de pasture</td></tr>
    </tbody>
  </table>

  <div class="callout tip">
    <div class="label">Johto-structures kwijt?</div>
    Vraag in Discord — staff kan <em>1×</em> herstarten. “Wereld sluiten” zoals singleplayer-tekst soms zegt geldt niet zo op multiplayer. Zie <a href="FAQ.html">FAQ</a>.
  </div>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Catching_and_Battling.html">Vangen &amp; vechten</a> · <a href="Postgame_and_Legendaries.html">Post-game</a> · <a href="Progression.html">Progressie</a> · <a href="Gyms_Johto.html">Johto</a></p>
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
  <p>Dit pack heeft <strong>${spawns.filter((s) => s.position === "fishing").length} fishing-spawnrijen</strong>. Veel Water-types (en ultra-rares) zitten op de hengel. Handig voor Misty, ocean-hunts en shiny side-projects.</p>

  <h2>Aan de slag</h2>
  ${figure(
    guideImg("rei-crafting.png"),
    "<strong>Craft de hengel in REI.</strong> Open inventaris (<kbd>E</kbd>), zoek <em>Poke Rod</em> / <em>rod</em>, en craft een Cobblemon-hengel — niet alleen de vanilla Minecraft fishing rod.",
    "REI-recipebrowser om een Cobblemon-hengel te craften"
  )}
  <ol class="steps">
    <li>Zoek in REI naar <strong>Poke Rod</strong> / <strong>rod</strong> en craft een Cobblemon-hengel (Poke → Great → Ultra → Master, of themed zoals Lure / Net / Dive).</li>
    <li>Ga bij water staan dat bij je biome past (rivier/meer vs oceaan/kust).</li>
    <li>Cast, wacht op de beet, haal in — er kan een wild Pokémon-encounter starten i.p.v. een vis-item.</li>
    <li>Vang met balls zoals altijd. Claim je steiger als je AFK’t.</li>
  </ol>
  ${figure(
    guideImg("catching.png"),
    "<strong>Na de beet.</strong> Een fishing-encounter is een normaal catch-gevecht — verzwakken, dan gooien. Balls op de hotbar.",
    "Wild Pokémon vangen na een fishing-encounter"
  )}

  ${critical(
    "nl",
    "<strong>Gebruik Cobblemon-hengels voor Pokémon.</strong> Alleen sticks en pufferfish? Waarschijnlijk vanilla rod of verkeerd water/biome."
  )}

  <h2>Rods, lure level &amp; bait</h2>
  <ul>
    <li><strong>Rod-tiers</strong> verhogen <em>lure level</em>. Hogere lure ontgrendelt rijen met <code>minLureLevel</code> 1–3+.</li>
    <li>Themed rods (Net, Dive, Friend, Lure, …) via REI; chests kunnen beschadigde rods droppen.</li>
    <li><strong>Bait</strong> — gebruik als de tooltip het toelaat. REI: <em>bait</em>.</li>
    <li>Op PokeHaven EU heb je <strong>geen</strong> party-Pokémon nodig om te vissen.</li>
  </ul>

  <h2>Waar casten?</h2>
  <ul>
    <li><strong>Freshwater</strong> — rivieren/meren: Psyduck, Goldeen, Squirtle (ultra-rare), …</li>
    <li><strong>Ocean / coast</strong> — Tentacool, Horsea, Staryu, Chinchou, Lapras, Relicanth, …</li>
    <li>Sommige species hebben ook <em>submerged</em> / <em>surface</em>. Context <code>fishing</code> = alleen hengel.</li>
  </ul>

  <h2>Pack-voorbeelden (fishing)</h2>
  <table class="wikitable">
    <thead><tr><th>Pokémon</th><th>Bucket</th><th>Levels</th><th>Typische biomes</th><th>Lookup</th></tr></thead>
    <tbody>
      <tr><td>Magikarp</td><td>common</td><td>1–20</td><td><code>is_overworld</code></td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=magikarp">open</a></td></tr>
      <tr><td>Psyduck</td><td>common</td><td>7–32</td><td><code>is_freshwater</code>, forest, …</td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=psyduck">open</a></td></tr>
      <tr><td>Goldeen</td><td>common</td><td>7–32</td><td>veel freshwater-tags</td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=goldeen">open</a></td></tr>
      <tr><td>Tentacool</td><td>common</td><td>9–29</td><td><code>is_ocean</code></td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=tentacool">open</a></td></tr>
      <tr><td>Staryu</td><td>common–uncommon</td><td>9–34</td><td>coast, ocean, tropical</td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=staryu">open</a></td></tr>
      <tr><td>Squirtle</td><td>ultra-rare</td><td>5–31</td><td>freshwater + hills/jungle/temperate</td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=squirtle">open</a></td></tr>
      <tr><td>Lapras</td><td>common–ultra-rare</td><td>29–54</td><td>frozen ocean / ocean</td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=lapras">open</a></td></tr>
      <tr><td>Relicanth</td><td>common–rare</td><td>24–49</td><td>deep ocean / ocean</td><td><a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=relicanth">open</a></td></tr>
    </tbody>
  </table>

  <h2>Spawn-lookup — voorbeelden</h2>
  <ol class="steps">
    <li>Open de <a href="../../pages/Spawn_Lookup.html?ctx=fishing">EN Spawn lookup met Context = fishing</a> (interactieve tool).</li>
    <li>Vul een species in, bv. <a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=tentacool">tentacool</a>.</li>
    <li>Of filter biome: <a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;biome=freshwater">fishing + freshwater</a> · <a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;biome=ocean">fishing + ocean</a>.</li>
    <li>Combineer: <a href="../../pages/Spawn_Lookup.html?ctx=fishing&amp;q=squirtle&amp;biome=freshwater">squirtle + freshwater</a>.</li>
    <li>Check <strong>Bucket</strong> + <strong>Level</strong> — respecteer de <a href="Level_Cap.html">level cap</a>.</li>
  </ol>

  <h2>Snelle fixes</h2>
  <table class="wikitable">
    <thead><tr><th>Probleem</th><th>Probeer</th></tr></thead>
    <tbody>
      <tr><td>Alleen vanilla vis / junk</td><td>Cobblemon-hengel (REI: Poke Rod)</td></tr>
      <tr><td>Altijd dezelfde commons</td><td>Ander biome (rivier ↔ oceaan); check lookup-tags</td></tr>
      <tr><td>Water-types voor Misty</td><td>Freshwater-dock + Psyduck / Goldeen — <a href="Misty.html">Misty</a></td></tr>
      <tr><td>AFK-steiger gegriefd</td><td><a href="Claims.html">FTB Chunks</a> rond de pier</td></tr>
    </tbody>
  </table>

  <div class="callout tip">
    <div class="label">Gym-tip</div>
    Handig voor Water-coverage vóór Misty / latere oceanen — level cap blijft gelden.
  </div>

  <p class="see-also"><strong>Zie ook:</strong> <a href="../../pages/Spawn_Lookup.html?ctx=fishing">Spawn lookup (fishing)</a> · <a href="Catching_and_Battling.html">Vangen &amp; vechten</a> · <a href="Shiny.html">Shiny hunting</a> · <a href="Claims.html">Claims</a></p>
  ${navboxCore()}
  `,
  });

  track("Riding.html", {
    title: "Rijden &amp; vliegen",
    breadcrumbs: crumbs({ label: "Rijden & vliegen", href: "Riding.html" }),
    lede: "Berijd een Pokémon om sneller over de map te gaan. Flyers openen de lucht; land-mounts winnen het nog steeds van lopen.",
    body: `
  <h2>Hoe rijden</h2>
  <ol class="steps">
    <li>Stuur een rideable Pokémon uit met <kbd>R</kbd>.</li>
    <li>Houd <kbd>Shift</kbd> in en rechtsklik → kies <strong>Ride</strong>.</li>
    <li>Beweeg met WASD + muis. Afstappen met <kbd>R</kbd> of sneak.</li>
  </ol>
  <table class="wikitable">
    <thead><tr><th>Actie</th><th>Standaard</th></tr></thead>
    <tbody>
      <tr><td>Uitsturen / recall</td><td><kbd>R</kbd></td></tr>
      <tr><td>Interact-menu</td><td><kbd>Shift</kbd> + rechtsklik</td></tr>
      <tr><td>Afstappen</td><td><kbd>R</kbd> of sneak</td></tr>
    </tbody>
  </table>
  <div class="callout tip">
    <div class="label">Stamina</div>
    Op PokeHaven EU is ride-stamina onbeperkt — je kunt lang gemount blijven op gym-hikes.
  </div>

  <h2>Vroege mounts</h2>
  <ul>
    <li><strong>Vroeg Kanto:</strong> elke stevige land-mount wint van lopen — vogels helpen na evolutie (Pidgeot / Fearow).</li>
    <li><strong>Midgame:</strong> een flyer (Charizard, grotere vogels, later Dragonite-achtigen) voor lange hops.</li>
    <li>Je hebt <em>geen</em> flyer nodig vóór Brock of Misty — land-mount + waystones is genoeg.</li>
  </ul>

  <h2>Gewoontes die tijd schelen</h2>
  <ul>
    <li>Combineer rijden met een <a href="Travel.html">waystone-netwerk</a> — eruit rijden, thuis warpen.</li>
    <li>Land en heal vóór gym-fights; begin geen battle terwijl je nog controls zoekt.</li>
    <li>Houd je mount veilig bij je basis zodat death je niet midden op de map strandt.</li>
    <li>Vliegen is voor travel, niet “ik heb geen maps nodig” — craft nog steeds gym-maps (<a href="Gym_Maps.html">Gym-maps</a>).</li>
  </ul>

  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>Een niet-rideable species uitsturen en zoeken naar Ride.</li>
    <li>Mount recallen naar de PC zonder waystone in de buurt.</li>
    <li>‘s Nachts tegen terrain / lava vliegen — verlicht je landingszone.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Travel.html">Reizen</a> · <a href="First_Hours.html">Eerste uren</a> · <a href="Gym_Maps.html">Gym-maps</a></p>
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

  // Full NL survival guides (parity with EN minecraft-guides.js)
  track("Combat_and_Death.html", {
    title: "Gevecht &amp; dood",
    breadcrumbs: crumbs(
      { label: "Minecraft-hub", href: "Minecraft_Hub.html" },
      { label: "Gevecht & dood", href: "Combat_and_Death.html" }
    ),
    lede: "Pokémon-battles zijn de hoofdloop — maar Minecraft-schade doodt je nog steeds in caves, de Nether en Deep Dark. Bescherm de trainer net zo hard als je party.",
    body: `
  <h2>Twee soorten gevaar</h2>
  <table class="wikitable">
    <thead><tr><th>Dreiging</th><th>Wat te doen</th></tr></thead>
    <tbody>
      <tr><td>Wild / trainer-Pokémon</td><td>Coverage, heals, level cap — <a href="Catching_and_Battling.html">Vangen &amp; vechten</a></td></tr>
      <tr><td>Minecraft-mobs / omgeving</td><td>Armor, schild, licht, water bucket, niet recht omlaag graven</td></tr>
    </tbody>
  </table>
  <h2>Bescherm de trainer</h2>
  <ul>
    <li>Minimaal iron vóór lange cave- of Nether-runs.</li>
    <li>Schild blokkeert creepers, skeletons en piglin brutes.</li>
    <li>Water bucket meenemen (MLG, lava, vuur).</li>
    <li>Eten helpt regen nog steeds met No Hunger — hotbar-stack houden.</li>
    <li>Totem of Undying is een luxe panic-button voor Elite Four / Deep Dark.</li>
  </ul>
  <h2>Voor een riskante trip</h2>
  <ol class="steps">
    <li>Pin coords in Xaero (of F3-screenshot).</li>
    <li>Check bed + <a href="Travel.html">waystone</a> in je <a href="Claims.html">claim</a>.</li>
    <li>Hotbar: balls, potions/Revives, pickaxe, blocks, map, schild.</li>
    <li>Heal de party in een Center — niet half-fainted vertrekken.</li>
  </ol>
  <h2>Death-checklist</h2>
  <ol class="steps">
    <li>Respawn bij bed → waystone richting je death-pin.</li>
    <li>Eerst gear, dan Pokémon-items — niet AFK op het lijk.</li>
    <li>Road-kit opnieuw opbouwen vóór de volgende gym-poging.</li>
    <li>Lava/void = gear-reset; rage-quit geen ungeclaimde chests thuis.</li>
  </ol>
  <div class="callout warn">
    <div class="label">Deep Dark / Giovanni</div>
    Wool, sneak-gewoontes en een escape-plan. World-damage eindigt runs net zo vaak als KOs — <a href="Giovanni.html">Giovanni</a>.
  </div>
  <h2>Wild aggro</h2>
  <p>Fight or Flight kan wilds op <em>jou</em> laten aanvallen. Afstand houden, eerst uitsturen, Centers tussen dens/gyms.</p>
  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>Party full heals, trainer naakt in een creeper-cave.</li>
    <li>Geen waystone → 2000-blokken corpse-run.</li>
    <li>Doodgaan met ungeclaimde valuables thuis.</li>
  </ul>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Catching_and_Battling.html">Vangen &amp; vechten</a> · <a href="Healing_and_Storage.html">Genezen</a> · <a href="Nether_Guide.html">Nether</a></p>
  ${navboxCore()}
  `,
  });

  track("Nether_Guide.html", {
    title: "Nether-gids",
    breadcrumbs: crumbs(
      { label: "Minecraft-hub", href: "Minecraft_Hub.html" },
      { label: "Nether-gids", href: "Nether_Guide.html" }
    ),
    lede: "Ga bewust de Nether in — voor resources en CobbleVerse-routes (Blaine / Crimson Forest). Elke trip is een geplande expeditie.",
    body: `
  <h2>Wanneer gaan</h2>
  <ul>
    <li>Minimaal iron armor; Fire Resistance als je kunt brew’en.</li>
    <li>Eerst bed + waystone veilig in de Overworld.</li>
    <li>Meenemen: pickaxe, blocks, eten, balls, spare flint &amp; steel, schild.</li>
    <li>Niet in je eerste uur — eerst basis + Brock-pad.</li>
  </ul>
  <h2>Portal-basics</h2>
  <ol class="steps">
    <li>4×5 obsidian-frame (hoeken optioneel).</li>
    <li>Aansteken met flint &amp; steel.</li>
    <li>Overworld-portalcoords meteen in Xaero pinnen.</li>
    <li>Waystone bij de Overworld-kant zodra de link stabiel is.</li>
    <li>Optioneel: klein geclaimd kamertje om de portal.</li>
  </ol>
  <h2>Eerste minuten binnen</h2>
  <ol class="steps">
    <li>Ledge/dak zodat ghasts de portal niet snipen.</li>
    <li>Cobble/dirt-brug — nooit recht omlaag graven.</li>
    <li>Nether-kant van je portal pinnen.</li>
    <li>Pak wat je kwam halen, en ga weer. Sightseeing later.</li>
  </ol>
  <h2>Waarom CobbleVerse-spelers dit doen</h2>
  <ul>
    <li><strong>Blaine</strong> wijst naar Crimson Forest-achtige biomes — <a href="Blaine.html">Blaine</a>.</li>
    <li>Blaze rods / powder voor brewing.</li>
    <li>Ancient Debris later voor netherite (na stabiele Kanto midgame).</li>
    <li>Quartz, glowstone, crimson/warped wood voor builds.</li>
  </ul>
  ${critical(
    "nl",
    "<strong>Graaf niet recht omlaag vanaf een random portal-exit.</strong> Scout met blocks; pearl nooit blind over lava-oceans."
  )}
  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>Geen spare flint &amp; steel als de portal stuk gaat.</li>
    <li>Geen goud bij bastions / piglins.</li>
    <li>Nether als shortcut zonder Overworld-waystone naar huis.</li>
  </ul>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Travel.html">Reizen</a> · <a href="Combat_and_Death.html">Gevecht &amp; dood</a> · <a href="Blaine.html">Blaine</a></p>
  ${navboxCore()}
  `,
  });

  track("Villages_and_Trading.html", {
    title: "Dorpen &amp; trading",
    breadcrumbs: crumbs(
      { label: "Minecraft-hub", href: "Minecraft_Hub.html" },
      { label: "Dorpen & trading", href: "Villages_and_Trading.html" }
    ),
    lede: "Dorpen zijn Map Guides, Farmers en early loot — centraal voor gym-navigatie en je emerald → PokéDollar-loop.",
    body: `
  <h2>Priority villagers</h2>
  <table class="wikitable">
    <thead><tr><th>Rol</th><th>Waarom</th></tr></thead>
    <tbody>
      <tr><td>Farmer</td><td>Wheat/crops → emeralds → Bank (<a href="Economy.html">Economie</a>)</td></tr>
      <tr><td>Map Guide</td><td>Gym-maps na de juiste cartography-tafel</td></tr>
      <tr><td>Librarian</td><td>Enchanted books als je geart</td></tr>
      <tr><td>Tool / weaponsmith</td><td>Gear-trades met emerald-surplus</td></tr>
    </tbody>
  </table>
  <h2>Map Guide setup</h2>
  <ol class="steps">
    <li>Craft de regio-cartography-tafel (start: <strong>Kanto Cartography Table</strong> — REI).</li>
    <li>Plaats naast een unemployed villager → Map Guide-job.</li>
    <li>Trade maps <em>of</em> craft Empty Map + special item. Stappen: <a href="Gym_Maps.html">Gym-maps</a>.</li>
    <li>Latere regio’s: Johto/Hoenn/Sinnoh-tafels — niet de Kanto-tafel daarvoor.</li>
  </ol>
  <h2>Houd een trade-village levend</h2>
  <ul>
    <li>Light + claim de plots die jij bouwt.</li>
    <li>Fence job sites die je nodig hebt tegen zombies.</li>
    <li>Pin het dorp in Xaero — je komt elke paar gyms terug.</li>
  </ul>
  <h2>Loot-etiquette op PokeHaven</h2>
  <ul>
    <li>Village- en Pokémon Center-chests mag je looten.</li>
    <li>Player-claims niet — <a href="Rules_and_Commands.html">Regels</a> · <a href="Claims.html">Claims</a>.</li>
    <li>Breek geen job-site blocks van een dorp dat iemand duidelijk gebruikt zonder te vragen.</li>
  </ul>
  <h2>Speler-trades</h2>
  <p>Geen forced auction house. Trade te goeder trouw, bij voorkeur in claims/public hubs, en drop geen valuables vóór je de deal vertrouwt. Scam = staff + screenshots.</p>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Farming_and_Food.html">Farms</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Economy.html">Economie</a></p>
  ${navboxCore()}
  `,
  });

  track("Building_and_Storage.html", {
    title: "Bouwen &amp; opslag",
    breadcrumbs: crumbs(
      { label: "Minecraft-hub", href: "Minecraft_Hub.html" },
      { label: "Bouwen & opslag", href: "Building_and_Storage.html" }
    ),
    lede: "Een kleine, geclaimde, georganiseerde basis wint het van een paleis zonder badges. Eerst progressie — mooi mag later.",
    body: `
  <h2>Minimum viable base</h2>
  <ul>
    <li>Bed (respawn) + torches</li>
    <li>Geclaimde chests / backpack-dump</li>
    <li>Crafting table + furnace (anvil later)</li>
    <li>Waystone in de claim</li>
    <li>Apricorn-hoek + klein wheat-veld</li>
    <li>Ruimte om pastures/sorting later uit te breiden</li>
  </ul>
  ${figure(
    guideImg("claims-ftb.png"),
    "<strong>Claim de basis.</strong> Opslag betekent niks zonder claim — <a href=\"Claims.html\">Claims</a>.",
    "FTB Chunks-claimkaart"
  )}
  <h2>Layout op dag één</h2>
  <ol class="steps">
    <li>Kies een plek bij spawn of een leuk dorp — niet 10k blokken weg in uur één.</li>
    <li>Bed → claim chunk(s) → starter kit in gelabelde chests.</li>
    <li>Waystone naast het bed activeren/plaatsen.</li>
    <li>Apricorns + wheat planten vóór de eerste lange Brock-hike.</li>
  </ol>
  <h2>Opslag-tips</h2>
  <ul>
    <li>Label vroeg: Balls / Heals / Ores / Maps / Food / Misc.</li>
    <li>Road-kit in de backpack: balls, eten, pickaxe, map, potions.</li>
    <li>PC-boxes voor coverage — <code>/pc</code> — <a href="Healing_and_Storage.html">Genezen &amp; opslag</a>.</li>
    <li>Sophisticated Storage / Tom’s Storage later — ná Brock/Misty, niet in plaats van badges.</li>
  </ul>
  <h2>Uitbreiden zonder chaos</h2>
  <ul>
    <li>Claim uitbreiden vóór de bouw groeit.</li>
    <li>Farms en pastures in dezelfde claim als het bed.</li>
    <li>Eén dump-chest is oké voor 20 minuten — niet voor een week.</li>
  </ul>
  <h2>Veelgemaakte fouten</h2>
  <ul>
    <li>Paleis eerst, claim nooit.</li>
    <li>Waystone buiten de claim.</li>
    <li>Alles in één mega-chest voor altijd.</li>
  </ul>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Claims.html">Claims</a> · <a href="Travel.html">Reizen</a> · <a href="First_Hours.html">Eerste uren</a></p>
  ${navboxCore()}
  `,
  });

  track("Dimensions_and_World.html", {
    title: "Dimensies &amp; wereld",
    breadcrumbs: crumbs(
      { label: "Minecraft-hub", href: "Minecraft_Hub.html" },
      { label: "Dimensies & wereld", href: "Dimensions_and_World.html" }
    ),
    lede: "Hoe de CobbleVerse-wereld op PokeHaven ligt — Terralith-overworld, Nether-routes, en een End dat niet om de dragon draait.",
    body: `
  <h2>Dimensies</h2>
  <table class="wikitable">
    <thead><tr><th>Dimensie</th><th>Rol op PokeHaven EU</th></tr></thead>
    <tbody>
      <tr><td>Overworld</td><td>Gyms, dorpen, raid-dens, claims, hoofdavontuur (Terralith)</td></tr>
      <tr><td>Nether</td><td>Resources + sommige gym-biomes — <a href="Nether_Guide.html">Nether-gids</a></td></tr>
      <tr><td>The End</td><td>Elite Four / late structures — <strong>Ender Dragon uit</strong></td></tr>
    </tbody>
  </table>
  <h2>Terralith-overworld</h2>
  <p>Worldgen is uitgebreid. Biomes lijken niet op vanilla YouTube-guides. Gebruik:</p>
  <ul>
    <li><a href="Gym_Maps.html">Gym-maps</a> voor leaders</li>
    <li>Nature’s / Explorer’s Compass voor biomes/structures</li>
    <li>Xaero-pins voor dens, portals en dorpen</li>
  </ul>
  <p>Vertrouw <strong>geen</strong> random “seed 123”-coords van een andere wereld.</p>
  <h2>Wat progressie wél / niet is</h2>
  <ul>
    <li><strong>Wél:</strong> gyms → level cap → regio’s — <a href="Progression.html">Progressie</a></li>
    <li><strong>Niet:</strong> Ender Dragon rushen voor “endgame gear”</li>
    <li><strong>Niet:</strong> hunger-farms als must (No Hunger) — farm wél voor emeralds</li>
  </ul>
  <h2>Praktische gewoontes</h2>
  <ul>
    <li>Eerste basis in de Overworld bij nuttige biomes / een dorp.</li>
    <li>Nether pas openen als je geared bent.</li>
    <li>End-content als het pack/league-pad je daarheen stuurt.</li>
    <li>Raid-dens zijn Overworld-crystals — <a href="Raids.html">Raids</a>.</li>
  </ul>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Pack_Differences.html">Pack-verschillen</a> · <a href="Nether_Guide.html">Nether</a> · <a href="Travel.html">Reizen</a></p>
  ${navboxCore()}
  `,
  });

  // Remaining short NL stubs
  const mcPages = [
    ["Tools_and_Mining.html", "Tools & mining", "Koper en ijzer vroeg, light je caves, sterf niet dom in lava."],
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
    lede: `Zoekbaar overzicht van ${recipesMeta.count} CobbleVerse-recepten.`,
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
    lede: `${trainers.all.length} named trainers op PokeHaven EU.`,
    body: `
  <p>Volledige doorzoekbare index: <a href="../../pages/Trainer_Index.html">Trainer index (EN)</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Raid_Bosses.html", {
    title: "Raid-bosses",
    breadcrumbs: crumbs({ label: "Raid-bosses", href: "Raid_Bosses.html" }),
    lede: `Doorzoekbare index van ${raids.bosses.length} raid-bosses — species, tier en moves. Hoe dens werken: <a href="Raids.html">Raids</a>.`,
    body: `
  <p>Volledige zoekbare tabel: <a href="../../pages/Raid_Bosses.html">Raid bosses (EN)</a>. Uitleg over dens, tiers en rewards: <a href="Raids.html">Raids</a>.</p>
  ${navboxCore()}
  `,
  });

  track("Spawn_Lookup.html", {
    title: "Spawn-lookup",
    breadcrumbs: crumbs({ label: "Spawn-lookup", href: "Spawn_Lookup.html" }),
    lede: `${spawns.length} spawn-rijen om te doorzoeken.`,
    body: `
  <p>Interactieve lookup: <a href="../../pages/Spawn_Lookup.html">Spawn lookup (EN)</a>.</p>
  ${navboxCore()}
  `,
  });

  // Johto deep hub + leader pages (parity with EN)
  {
    const johto = trainers.johtoLeaders || [];
    const rows = johto
      .map((g) => {
        const label =
          g.slug === "Johto_Koga"
            ? "Koga (Johto)"
            : g.slug === "Johto_Bruno"
              ? "Bruno (Johto)"
              : g.slug === "Johto_Lance"
                ? "Lance (Johto Champion)"
                : g.name;
        return `<tr>
      <td><a href="${g.slug}.html">${esc(label)}</a></td>
      <td>${esc(g.type)}</td>
      <td>${esc(g.badge)}</td>
      <td>${esc(g.biome)}</td>
      <td>${esc(g.specialItem)}</td>
      <td>${g.team?.[0]?.level ?? "—"}–${g.team?.[g.team.length - 1]?.level ?? "—"}</td>
    </tr>`;
      })
      .join("");

    track("Gyms_Johto.html", {
      title: "Johto-gyms",
      breadcrumbs: crumbs({ label: "Johto-gyms", href: "Gyms_Johto.html" }),
      lede: "Checklist voor de Johto-challenge na <a href=\"Blue.html\">Champion Blue</a>. Open een leader-pagina voor volledige teams en prep-tips.",
      body: `
  <h2>Unlock</h2>
  <ol class="steps">
    <li>Versla <a href="Blue.html">Blue</a> en volg het champion-boek → Trainer Association → <strong>Johto Trainer Card</strong>.</li>
    <li>Craft maps op de <strong>Johto Cartography Table</strong> — niet de Kanto-tafel. Zie <a href="Gym_Maps.html">Gym-maps</a>.</li>
    <li>Start met <a href="Valerio.html">Valerio</a>. Late-game checklist: <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>.</li>
  </ol>
  <h2>Gym leaders &amp; league</h2>
  <table class="wikitable">
    <thead><tr><th>Trainer</th><th>Type</th><th>Badge / rol</th><th>Biome / plek</th><th>Map-item</th><th>Team lv</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="callout tip">
    <div class="label">Naambotsingen</div>
    Johto Elite Four heeft ook Koga / Bruno / Lance. Pagina’s: <a href="Johto_Koga.html">Johto Koga</a>, <a href="Johto_Bruno.html">Johto Bruno</a>, <a href="Johto_Lance.html">Johto Lance</a> — los van Kanto.
  </div>
  <p>Achievements: <a href="Achievements.html">Achievements</a>. Na Johto Champion: <a href="Gyms_Hoenn.html">Hoenn</a>.</p>
  ${navboxCore()}
  `,
    });

    const nlJohtoExtras = {
      Valerio: {
        title: "Walkthrough — Blue naar Valerio",
        coverage: "Electric, Rock en Ice straffen Flying.",
        travel: "Eerst Johto Trainer Card. Locatie-tip: Windswept Hills.",
        gotcha: "Verkeerde cartography-tafel = verspilde Empty Map. Gebruik de Johto-tafel.",
        first: true,
      },
      Raffaello: {
        title: "Walkthrough — Valerio naar Raffaello",
        coverage: "Fire, Flying en Rock drukken Bug.",
        travel: "Sparse Jungle — waystone onderweg.",
        gotcha: "Heracross / Scyther outspeeden zachte teams.",
      },
      Chiara: {
        title: "Walkthrough — Raffaello naar Chiara",
        coverage: "Fighting tegen Normal.",
        travel: "Cherry Grove — claim een rustplek.",
        gotcha: "Miltank-achtige stall. Status + Fighting-pivot.",
      },
      Angelo: {
        title: "Walkthrough — Chiara naar Angelo",
        coverage: "Dark en Ghost drukken Ghost.",
        travel: "Lush Cave — torches + escape-waystone.",
        gotcha: "Cave + Ghost-status. Full HP bij de leader.",
      },
      Furio: {
        title: "Walkthrough — Angelo naar Furio",
        coverage: "Flying, Psychic en Fairy tegen Fighting.",
        travel: "Desert — water/eten meenemen.",
        gotcha: "Fighting straft Normal/Rock/Ice/Steel.",
      },
      Jasmine: {
        title: "Walkthrough — Furio naar Jasmine",
        coverage: "Fire, Fighting en Ground kraken Steel.",
        travel: "Taiga — langere hike, Revives bijvullen.",
        gotcha: "Magnezone / Metagross straffen pure Water.",
      },
      Alfredo: {
        title: "Walkthrough — Jasmine naar Alfredo",
        coverage: "Fire, Fighting, Rock en Steel tegen Ice.",
        travel: "Ice Spikes — koude prep + retreat-stone.",
        gotcha: "Niet underleveled de ~65-band in.",
      },
      Sandra: {
        title: "Walkthrough — Alfredo naar Sandra",
        coverage: "Ice en Fairy straffen Dragon.",
        travel: "Soul Sand Valley (Nether) — fire resist + Nether-waystone eerst.",
        gotcha: "Eerst Nether-prep, dan gym.",
      },
      Pino: {
        title: "Walkthrough — Sandra naar Johto Elite Four (Pino)",
        coverage: "Dark, Bug en Ghost drukken Psychic.",
        travel: "Elite Four Tower (The End) — alle 8 Johto-gyms eerst.",
        gotcha: "Full heal tussen Elite-rooms.",
        league: true,
      },
      Johto_Koga: {
        title: "Walkthrough — Pino naar Johto Koga",
        coverage: "Psychic en Ground tegen Poison.",
        travel: "Zelfde End-tower — restock na Pino.",
        gotcha: "Ander team dan Kanto Koga — zie teamtabel.",
        league: true,
      },
      Johto_Bruno: {
        title: "Walkthrough — Johto Koga naar Johto Bruno",
        coverage: "Flying, Psychic en Fairy tegen Fighting.",
        travel: "Tower room 3 — full heal na Johto Koga.",
        gotcha: "Niet Kanto Bruno’s roster.",
        league: true,
      },
      Karen: {
        title: "Walkthrough — Johto Bruno naar Karen",
        coverage: "Fighting, Bug en Fairy drukken Dark.",
        travel: "Vierde Elite-room — late Johto-wall.",
        gotcha: "Weavile / Houndoom-speed. Niet één Psychic in Dark gooien.",
        league: true,
      },
      Johto_Lance: {
        title: "Walkthrough — Karen naar Champion Lance (Johto)",
        coverage: "Ice en Fairy; plan voor Lugia.",
        travel: "Top van de Johto Elite Four Tower.",
        gotcha: "Lugia-ace + Dragon-core. Daarna: Hoenn via Trainer Card.",
        league: true,
        champion: true,
      },
    };

    for (const g of johto) {
      const file = `${g.slug}.html`;
      const mapItem = g.specialItem;
      const maxLv = Math.max(...(g.team || []).map((m) => Number(m.level) || 0), 0);
      const minLv = Math.min(...(g.team || []).map((m) => Number(m.level) || 99), 99);
      const sorted = [...johto].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((x) => x.slug === g.slug);
      const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
      const nextLink = next
        ? `<a href="${next.slug}.html">${esc(
            next.slug === "Johto_Koga"
              ? "Koga (Johto)"
              : next.slug === "Johto_Bruno"
                ? "Bruno (Johto)"
                : next.slug === "Johto_Lance"
                  ? "Lance (Johto)"
                  : next.name
          )}</a>`
        : `<a href="Gyms_Hoenn.html">Hoenn</a>`;
      const displayName =
        g.slug === "Johto_Koga"
          ? "Koga (Johto)"
          : g.slug === "Johto_Bruno"
            ? "Bruno (Johto)"
            : g.slug === "Johto_Lance"
              ? "Lance (Johto Champion)"
              : g.name;
      const ex = nlJohtoExtras[g.slug] || {
        title: `Walkthrough — ${esc(displayName)}`,
        coverage: esc(g.tips),
        travel: `Locatie-tip: ${esc(g.biome)}.`,
        gotcha: "Heal vóór de leader. Respecteer de level cap.",
      };
      const afterWin = ex.champion
        ? `Win → Johto Champion. Volgende regio: <a href="Gyms_Hoenn.html">Hoenn</a>. Zie <a href="Progression.html">Progressie</a>.`
        : `Win → level cap stijgt → volgende: ${nextLink}.`;

      const unlockBlock = ex.first
        ? `<h3>Unlock Johto eerst</h3>
  <ol class="steps">
    <li>Versla <a href="Blue.html">Champion Blue</a>.</li>
    <li>Champion-boek → Trainer Association → <strong>Johto Trainer Card</strong>.</li>
    <li>Structures kwijt? Discord — staff kan 1× herstarten. Zie <a href="Mega_and_Late_Game.html">Mega &amp; late-game</a>.</li>
  </ol>`
        : "";

      track(file, {
        title: displayName,
        searchIndexTitle: displayName,
        breadcrumbs: crumbs(
          { label: "Johto-gyms", href: "Gyms_Johto.html" },
          { label: displayName, href: file }
        ),
        lede:
          g.order <= 8
            ? `${esc(displayName)} — ${esc(g.type)}-specialist. Johto gym ${g.order} op PokeHaven EU.`
            : `${esc(displayName)} — Johto league-gevecht op PokeHaven EU.`,
        infobox: `<div class="infobox-title">${esc(displayName)}</div>
  <table>
    <tr><th>Regio</th><td>Johto</td></tr>
    <tr><th>Rol</th><td>${g.order <= 8 ? "Gym Leader" : g.order === 13 ? "Champion" : "Elite Four"}</td></tr>
    <tr><th>Type</th><td>${esc(g.type)}</td></tr>
    <tr><th>Badge</th><td>${esc(g.badge)}</td></tr>
    <tr><th>Locatie-tip</th><td>${esc(g.biome)}</td></tr>
    <tr><th>Map-item</th><td>${esc(mapItem)}</td></tr>
    <tr><th>Approx cap</th><td>~${maxLv + 5}</td></tr>
    <tr><th>Team levels</th><td>${minLv}–${maxLv}</td></tr>
    <tr><th>Party</th><td>${(g.team || []).length}</td></tr>
  </table>`,
        body: `
  <h2>${ex.title}</h2>
  ${unlockBlock}
  <h3>Voorbereiden</h3>
  <p>${esc(g.tips)}</p>
  <ul>
    <li><strong>Coverage:</strong> ${ex.coverage}</li>
    <li>Teamlevels: ongeveer <strong>${minLv}–${maxLv}</strong></li>
    <li>Approx cap: <strong>~${maxLv + 5}</strong> — <a href="Level_Cap.html">Level cap</a></li>
    <li>Heals, status-cures, spare balls, geclaimde basis / waystone</li>
    <li>${ex.travel}</li>
  </ul>
  <h3>Craft de map</h3>
  ${figure(
    guideImg("cartography-maps.png"),
    "<strong>Johto Cartography Table.</strong> Empty Map + special item → afgewerkte map met coördinaten.",
    "Cartography / map-crafting"
  )}
  <ol class="steps">
    <li>Zoek <strong>${esc(g.name)}</strong> in REI en craft <strong>${esc(mapItem)}</strong>.</li>
    <li>Craft een verse <strong>Empty Map</strong>.</li>
    <li>Combineer Empty Map + ${esc(mapItem)} in de <strong>Johto Cartography Table</strong>.</li>
    <li>Hover voor coördinaten. Details: <a href="Gym_Maps.html">Gym-maps</a>.</li>
  </ol>
  ${critical(
    "nl",
    "<strong>Open de Empty Map niet eerst in de wereld</strong> — en gebruik de Johto-tafel, niet de Kanto-tafel."
  )}
  <h3>Fight-tips</h3>
  <p>${ex.gotcha}</p>
  <ol class="steps">
    <li>Reis met heals; activeer waystones onderweg.</li>
    ${
      ex.league
        ? "<li>Elite Four / Champion: <strong>full heal tussen rooms</strong>.</li>"
        : "<li>Clear gym-trainers als je XP of CobbleDollars nodig hebt.</li>"
    }
    <li>Heal, daarna <strong>${esc(displayName)}</strong> challengen.</li>
    <li>${afterWin}</li>
  </ol>
  <h2>Team</h2>
  ${teamTable(g.team)}
  <p class="see-also"><strong>Zie ook:</strong> <a href="Gyms_Johto.html">Johto-gyms</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Level_Cap.html">Level cap</a></p>
  ${navboxCore()}
  `,
      });
    }
  }

  // Hoenn under-construction hub
  {
    const hoennNamed = trainers.all
      .filter((t) => t.region === "hoenn" && !String(t.id).includes("groups"))
      .sort((a, b) => a.name.localeCompare(b.name));
    const previewRows = hoennNamed
      .map((t) => {
        const levels = (t.team || []).map((m) => m.level).filter((x) => x != null);
        const lv =
          levels.length > 0
            ? `${levels[0]}–${levels[levels.length - 1]}`
            : "—";
        return `<tr>
      <td>${esc(t.name)}</td>
      <td><code>${esc(t.id)}</code></td>
      <td>${(t.team || []).length}</td>
      <td>${esc(lv)}</td>
    </tr>`;
      })
      .join("");
    track("Gyms_Hoenn.html", {
      title: "Hoenn-gyms",
      breadcrumbs: crumbs({ label: "Hoenn-gyms", href: "Gyms_Hoenn.html" }),
      lede: "Hoenn opent na de Johto Champion. Volledige walkthroughs zoals Kanto en Johto worden nog geschreven — begin met de gym-maps en de trainerlijst hieronder.",
      body: `
  <div class="callout tip">
    <div class="label">Nog in de maak</div>
    Volledige leader-pagina’s (teams, coverage, map-keys, walkthroughs) komen later.
    Rond eerst <a href="Gyms_Johto.html">Johto</a> af — deze hub groeit daarna op dezelfde manier.
  </div>

  <h2>Unlock (als je hier bent)</h2>
  <ol class="steps">
    <li>Versla Johto Champion <a href="Johto_Lance.html">Lance</a>.</li>
    <li>Volg je Trainer Card-unlocks naar Hoenn.</li>
    <li>Gebruik de <strong>Hoenn Cartography Table</strong> — <a href="Gym_Maps.html">Gym-maps</a>. Eerste leader-tip daar: <strong>Petra</strong>.</li>
  </ol>

  <h2>Named Hoenn-trainers</h2>
  <p class="muted">Kort overzicht voor nu — diepe gidsen volgen. Zoeken: <a href="Trainer_Index.html">Trainer-index</a> · achievements: <a href="Achievements.html">Achievements</a>.</p>
  <table class="wikitable">
    <thead><tr><th>Naam</th><th>ID</th><th>Party</th><th>Levels</th></tr></thead>
    <tbody>${previewRows || "<tr><td colspan=4>Nog geen Hoenn-trainers opgelijst.</td></tr>"}</tbody>
  </table>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Gyms_Johto.html">Johto-gyms</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Progression.html">Progressie</a> · <a href="Gyms_Sinnoh.html">Sinnoh</a></p>
  ${navboxCore()}
  `,
    });
  }

  // Sinnoh hub — zelfde opzet als Hoenn
  {
    const sinnohNamed = trainers.all
      .filter((t) => t.region === "sinnoh" && !String(t.id).includes("groups"))
      .sort((a, b) => a.name.localeCompare(b.name));
    const previewRows = sinnohNamed
      .map((t) => {
        const levels = (t.team || []).map((m) => m.level).filter((x) => x != null);
        const lv =
          levels.length > 0
            ? `${levels[0]}–${levels[levels.length - 1]}`
            : "—";
        return `<tr>
      <td>${esc(t.name)}</td>
      <td><code>${esc(t.id)}</code></td>
      <td>${(t.team || []).length}</td>
      <td>${esc(lv)}</td>
    </tr>`;
      })
      .join("");
    track("Gyms_Sinnoh.html", {
      title: "Sinnoh-gyms",
      breadcrumbs: crumbs({ label: "Sinnoh-gyms", href: "Gyms_Sinnoh.html" }),
      lede: "Sinnoh opent na Hoenn Champion Rocco. Volledige walkthroughs zoals Kanto en Johto worden nog geschreven — begin met de gym-maps en de trainerlijst hieronder.",
      body: `
  <div class="callout tip">
    <div class="label">Nog in de maak</div>
    Volledige leader-pagina’s (teams, coverage, map-keys, walkthroughs) komen later.
    Rond eerst <a href="Gyms_Hoenn.html">Hoenn</a> af — deze hub groeit daarna op dezelfde manier.
  </div>

  <h2>Unlock (als je hier bent)</h2>
  <ol class="steps">
    <li>Versla Hoenn Champion <strong>Rocco</strong> (na de Hoenn-league).</li>
    <li>Volg je Trainer Card-unlocks naar Sinnoh.</li>
    <li>Gebruik de <strong>Sinnoh Cartography Table</strong> — <a href="Gym_Maps.html">Gym-maps</a>. Eerste leader-tip daar: <strong>Pedro</strong>.</li>
  </ol>

  <h2>Named Sinnoh-trainers</h2>
  <p class="muted">Kort overzicht voor nu — diepe gidsen volgen. Zoeken: <a href="Trainer_Index.html">Trainer-index</a> · achievements: <a href="Achievements.html">Achievements</a>.</p>
  <table class="wikitable">
    <thead><tr><th>Naam</th><th>ID</th><th>Party</th><th>Levels</th></tr></thead>
    <tbody>${previewRows || "<tr><td colspan=4>Nog geen Sinnoh-trainers opgelijst.</td></tr>"}</tbody>
  </table>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Gyms_Hoenn.html">Hoenn-gyms</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Progression.html">Progressie</a> · <a href="Achievements.html">Achievements</a></p>
  ${navboxCore()}
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
        lede: `${esc(brock.name)} — ${esc(brock.type)}-specialist op PokeHaven EU.`,
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

  const nlGymExtras = {
    "Lt._Surge": {
      title: "Walkthrough — Misty naar Lt. Surge",
      coverage: "Ground is het antwoord op Electric. Tanky Waters kunnen helpen als ze de eerste hit overleven.",
      travel: "Savanna Plateau-tip — neem eten mee voor een langere hike.",
      gotcha: "Paralysis + speed snowballen. Status-cures en een Ground-pivot meenemen.",
    },
    Erika: {
      title: "Walkthrough — Surge naar Erika",
      coverage: "Fire, Flying, Ice en Poison drukken Grass.",
      travel: "Flower Forest-tip — mooi biome, claim toch een rustplek.",
      gotcha: "Sleep/powder kan stallen. Cleansers meenemen.",
    },
    Koga: {
      title: "Walkthrough — Erika naar Koga",
      coverage: "Psychic en Ground helpen tegen Poison.",
      travel: "Swamp-tip — boots, eten, waystone onderweg.",
      gotcha: "Poison-chip. Antidotes/Pecha meenemen.",
    },
    Sabrina: {
      title: "Walkthrough — Koga naar Sabrina",
      coverage: "Dark, Bug en Ghost drukken Psychic.",
      travel: "Dark Forest-tip — licht + geclaimde retreat.",
      gotcha: "Confusion/setup. Revenge killer klaarzetten.",
    },
    Blaine: {
      title: "Walkthrough — Sabrina naar Blaine",
      coverage: "Water en Ground zijn betrouwbaar tegen Fire.",
      travel: "Crimson Forest / Nether-adjacent — fire resist helpt de trip.",
      gotcha: "Warme biomes zijn dodelijk zonder prep. Eerst waystone + eten.",
    },
    Giovanni: {
      title: "Walkthrough — Blaine naar Giovanni",
      coverage: "Water, Grass en Ice raken Ground hard.",
      travel: "Deep Dark-tip — goed geared gaan.",
      gotcha: "Deep Dark is gevaarlijk. Scout voorzichtig, fight op full HP.",
    },
    Lorelei: {
      title: "Walkthrough — Giovanni naar Elite Four (Lorelei)",
      coverage: "Fire, Fighting, Rock en Steel helpen tegen Ice.",
      travel: "Elite Four Tower (The End) — eerst alle Kanto-gyms; stacks heals.",
      gotcha: "Full heal tussen Elite-rooms.",
      league: true,
    },
    Bruno: {
      title: "Walkthrough — Lorelei naar Bruno",
      coverage: "Flying, Psychic en Fairy tegen Fighting.",
      travel: "Zelfde tower — restock vóór zijn room.",
      gotcha: "Fighting straft Normal/Rock/Ice/Steel. Flying/Psychic-pivot houden.",
      league: true,
    },
    Agatha: {
      title: "Walkthrough — Bruno naar Agatha",
      coverage: "Dark en Ghost drukken Ghost.",
      travel: "Tower room 3 — full heal na Bruno.",
      gotcha: "Status + Ghost-tricks. Niet op één Dark-type gokken.",
      league: true,
    },
    Lance: {
      title: "Walkthrough — Agatha naar Lance",
      coverage: "Ice en Dragon het belangrijkst; Fairy helpt ook.",
      travel: "Vierde Elite-room — late-Kanto wall.",
      gotcha: "Dragon-spam straft dunne teams. Ice-coverage + meerdere wincons.",
      league: true,
    },
    Blue: {
      title: "Walkthrough — Lance naar Champion Blue",
      coverage: "Mixed champion — antwoorden voor meerdere types, geen single gimmick.",
      travel: "Top van de Elite Four Tower. Full restore + items.",
      gotcha: "Na Blue op PokeHaven: Johto unlock + Trainer Association card-swap. Ontbreken structures? Discord — staff kan 1× herstarten. Zie je champion-boek.",
      league: true,
      champion: true,
    },
  };

  for (const g of trainers.kantoLeaders) {
    if (g.slug === "Brock" || g.slug === "Misty") continue;
    const file = `${g.slug}.html`;
    const mapItem = g.specialItem;
    const maxLv = Math.max(...(g.team || []).map((m) => Number(m.level) || 0), 0);
    const minLv = Math.min(...(g.team || []).map((m) => Number(m.level) || 99), 99);
    const sorted = [...trainers.kantoLeaders].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x) => x.slug === g.slug);
    const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
    const nextLink = next
      ? `<a href="${next.slug}.html">${esc(next.name)}</a>`
      : "de volgende regio";
    const ex = nlGymExtras[g.slug] || {
      title: `Walkthrough — ${esc(g.name)}`,
      coverage: esc(g.tips),
      travel: `Locatie-tip: ${esc(g.biome)}.`,
      gotcha: "Heal vóór de leader. Respecteer de level cap.",
    };
    const afterWin = ex.champion
      ? `Win → Kanto Champion. Volgende: Johto via Trainer Association (cap reset voor <em>jou</em>). Zie <a href="Progression.html">Progressie</a> · <a href="Gyms_Johto.html">Johto</a>.`
      : `Win → level cap stijgt → volgende: ${nextLink}.`;

    track(file, {
      title: g.name,
      breadcrumbs: crumbs(
        { label: "Kanto-gyms", href: "Gyms_Kanto.html" },
        { label: g.name, href: file }
      ),
      lede:
        g.order <= 8
          ? `${esc(g.name)} — ${esc(g.type)}-specialist. Kanto gym ${g.order} op PokeHaven EU.`
          : `${esc(g.name)} — league-gevecht op PokeHaven EU.`,
      infobox: `<div class="infobox-title">${esc(g.name)}</div>
  <table>
    <tr><th>Rol</th><td>${g.order <= 8 ? "Gym Leader" : g.order === 13 ? "Champion" : "Elite Four"}</td></tr>
    <tr><th>Type</th><td>${esc(g.type)}</td></tr>
    <tr><th>Badge</th><td>${esc(g.badge)}</td></tr>
    <tr><th>Locatie-tip</th><td>${esc(g.biome)}</td></tr>
    <tr><th>Map-item</th><td>${esc(mapItem)}</td></tr>
    <tr><th>Approx cap</th><td>~${maxLv + 5}</td></tr>
    <tr><th>Team levels</th><td>${minLv}–${maxLv}</td></tr>
    <tr><th>Party</th><td>${(g.team || []).length}</td></tr>
  </table>`,
      body: `
  <h2>${ex.title}</h2>
  <h3>Voorbereiden</h3>
  <p>${esc(g.tips)}</p>
  <ul>
    <li><strong>Coverage:</strong> ${ex.coverage}</li>
    <li>Teamlevels: ongeveer <strong>${minLv}–${maxLv}</strong></li>
    <li>Approx cap terwijl dit gevecht volgt: <strong>~${maxLv + 5}</strong> — <a href="Level_Cap.html">Level cap</a></li>
    <li>Heals, status-cures, spare balls, geclaimde basis / waystone</li>
    <li>${ex.travel}</li>
  </ul>
  <h3>Craft de map</h3>
  ${figure(
    guideImg("cartography-maps.png"),
    "<strong>Cartography-tafel.</strong> Empty Map + special item → afgewerkte map met coördinaten.",
    "Cartography / map-crafting"
  )}
  <ol class="steps">
    <li>Zoek <strong>${esc(g.name)}</strong> in REI en craft <strong>${esc(mapItem)}</strong>.</li>
    <li>Craft een verse <strong>Empty Map</strong>.</li>
    <li>Combineer Empty Map + ${esc(mapItem)} in de <strong>Kanto Cartography Table</strong> (of Map Guide-villager).</li>
    <li>Hover voor coördinaten. Details: <a href="Gym_Maps.html">Gym-maps</a>.</li>
  </ol>
  ${critical(
    "nl",
    "<strong>Open de Empty Map niet eerst in de wereld</strong> — dan is hij onbruikbaar voor gym-crafts."
  )}
  <h3>Fight-tips</h3>
  <p>${ex.gotcha}</p>
  <ol class="steps">
    <li>Reis met heals; activeer waystones onderweg.</li>
    ${
      ex.league
        ? "<li>Elite Four / Champion: <strong>full heal tussen rooms</strong>.</li>"
        : "<li>Clear gym-trainers als je XP of CobbleDollars nodig hebt.</li>"
    }
    <li>Heal, daarna <strong>${esc(g.name)}</strong> challengen.</li>
    <li>${afterWin}</li>
  </ol>
  <h2>Team</h2>
  ${teamTable(g.team)}
  <p class="muted">Moves/items in detail ook op de <a href="../../pages/${file}">EN-pagina</a>.</p>
  <p class="see-also"><strong>Zie ook:</strong> <a href="Gyms_Kanto.html">Kanto-gyms</a> · <a href="Gym_Maps.html">Gym-maps</a> · <a href="Level_Cap.html">Level cap</a></p>
  ${navboxCore()}
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
