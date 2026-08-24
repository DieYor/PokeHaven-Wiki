/**
 * Sophisticated Backpacks + Storage — PokeHaven EU pack guide (EN + NL).
 * Numbers from sophisticatedbackpacks-server.toml / sophisticatedstorage-server.toml (1.7.42).
 */

import { critical } from "./i18n.js";

export const SOPH_BACKPACKS_INFOBOX_EN = `<div class="infobox-title">Backpacks &amp; storage</div>
  <table>
    <tr><th>Open backpack</th><td><kbd>B</kbd></td></tr>
    <tr><th>Sort (Soph GUI)</th><td>Middle mouse</td></tr>
    <tr><th>Mods</th><td>Sophisticated Backpacks + Storage</td></tr>
    <tr><th>PokeHaven buff</th><td>Iron+ backpacks — more slots &amp; upgrades</td></tr>
    <tr><th>Keep on death?</th><td>Yes (inventory kept)</td></tr>
  </table>`;

export const SOPH_BACKPACKS_INFOBOX_NL = `<div class="infobox-title">Backpacks &amp; opslag</div>
  <table>
    <tr><th>Backpack openen</th><td><kbd>B</kbd></td></tr>
    <tr><th>Sorteren (Soph GUI)</th><td>Middelmuisknop</td></tr>
    <tr><th>Mods</th><td>Sophisticated Backpacks + Storage</td></tr>
    <tr><th>PokeHaven-buff</th><td>Iron+ backpacks — meer slots &amp; upgrades</td></tr>
    <tr><th>Keep bij dood?</th><td>Ja (inventory blijft)</td></tr>
  </table>`;

export function sophisticatedBackpacksBodyEn({ navboxSystems, navboxMinecraft }) {
  return `
  <h2>What these mods are</h2>
  <p><strong>Sophisticated Backpacks</strong> are wearable inventories you open with <kbd>B</kbd>. <strong>Sophisticated Storage</strong> is the same upgrade idea for <em>placed</em> chests, barrels, and shulkers at your base.</p>
  <ul>
    <li><strong>Pokémon PC</strong> (<code>/pc</code>) stores Pokémon — not items. See <a href="Healing_and_Storage.html">Healing &amp; storage</a>.</li>
    <li><strong>Tom’s Storage</strong> is a separate base network (terminal default <kbd>Y</kbd>) — not the same as Soph. See <a href="Keybinds.html">Keybinds</a>.</li>
  </ul>

  <h2>Quick start</h2>
  <ol class="steps">
    <li>Craft a <strong>Leather Backpack</strong> (EMI/REI: <em>backpack</em>).</li>
    <li>Put it on (chestplate / backpack slot) or keep it in your inventory.</li>
    <li>Press <kbd>B</kbd> to open it — or right-click the item / worn backpack.</li>
    <li>Keep a <strong>road kit</strong> inside: balls, food, pickaxe, map, potions.</li>
    <li>Upgrade the backpack tier with the upgrade recipes when you can afford the materials.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Early game</div>
    Learn sorting after Brock / Misty — badges first. A leather backpack + labelled chests is enough for the first hours.
  </div>

  <h2>Keys</h2>
  <table class="wikitable">
    <thead><tr><th>Action</th><th>Default</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Open backpack</td><td><kbd>B</kbd></td><td>Voice-chat <em>group</em> is unbound so it never steals this</td></tr>
      <tr><td>Sort Soph GUI</td><td>Middle mouse</td><td>Works in backpacks and Soph Storage screens</td></tr>
      <tr><td>Inventory Profiles Next</td><td>—</td><td>Ignored on Soph screens — use Soph’s own sort</td></tr>
      <tr><td>TrashSlot</td><td>Always visible</td><td>Drag to move; sits outside the top-right of the GUI</td></tr>
      <tr><td>Loot filter / trash history</td><td>Loot button</td><td>Left edge of inventory screens — not a backpack upgrade</td></tr>
    </tbody>
  </table>

  <h2>PokeHaven differences</h2>
  <ul>
    <li><strong>Pickup order:</strong> partial hotbar stacks → main inventory → <strong>into your backpacks</strong> → empty hotbar slots. Ground loot fills the backpack automatically when your inventory is busy.</li>
    <li><strong>Death:</strong> you keep your inventory (including backpacks). XP can still drop.</li>
    <li><strong>Iron+</strong> backpacks have <em>more inventory and upgrade slots</em> than stock Sophisticated defaults (table below).</li>
    <li>Mobs do <strong>not</strong> spawn wearing backpacks / drop backpacks on this pack.</li>
    <li>Active upgrades (magnet, pickup, feeding, …) work from backpacks in your inventory — not only the one you’re wearing.</li>
    <li>Backpacks <strong>cannot</strong> go inside shulker boxes / other “container items”.</li>
  </ul>

  <h2>Backpack tiers (PokeHaven)</h2>
  <table class="wikitable">
    <thead><tr><th>Tier</th><th>Inventory slots</th><th>Upgrade slots</th><th>vs default Soph</th></tr></thead>
    <tbody>
      <tr><td>Leather</td><td>27</td><td>1</td><td>Same</td></tr>
      <tr><td>Copper</td><td>45</td><td>1</td><td>Same</td></tr>
      <tr><td><strong>Iron</strong></td><td><strong>81</strong></td><td><strong>7</strong></td><td>Buffed (was 54 / 2)</td></tr>
      <tr><td><strong>Gold</strong></td><td><strong>96</strong></td><td><strong>8</strong></td><td>Buffed (was 81 / 3)</td></tr>
      <tr><td>Diamond</td><td>108</td><td><strong>9</strong></td><td>More upgrades (was 5)</td></tr>
      <tr><td>Netherite</td><td>120</td><td><strong>10</strong></td><td>More upgrades (was 7)</td></tr>
    </tbody>
  </table>
  <p>Stack upgrades are capped at <strong>3</strong> per backpack (plus at most one jukebox / furnace upgrade type).</p>

  <h2>Useful upgrades</h2>
  <p>Craft and insert upgrades into the upgrade slots on the left of the backpack GUI. Exact recipes: search EMI/REI.</p>
  <table class="wikitable">
    <thead><tr><th>Upgrade</th><th>Why you want it</th></tr></thead>
    <tbody>
      <tr><td>Pickup / Magnet</td><td>Pull nearby drops into the backpack (great on routes)</td></tr>
      <tr><td>Filter / Deposit filter</td><td>Only keep what you want — or send ores to a deposit target</td></tr>
      <tr><td>Void</td><td>Deletes matching junk. <strong>Be careful</strong> — easy to wipe valuables</td></tr>
      <tr><td>Compacting</td><td>Auto-crafts blocks / nuggets when filters match</td></tr>
      <tr><td>Crafting</td><td>Craft grid inside the backpack</td></tr>
      <tr><td>Feeding</td><td>Auto-eats food from the backpack</td></tr>
      <tr><td>Stack upgrade</td><td>Bigger stacks in the backpack (max 3 on PokeHaven)</td></tr>
    </tbody>
  </table>
  ${critical(
    "en",
    "<strong>Void upgrade.</strong> Start with a tight allow/deny filter. “Void anything” will destroy items you meant to keep."
  )}

  <h2>Sophisticated Storage (base)</h2>
  <p>Use placed Soph chests / barrels / shulkers when your house sorting outgrows vanilla chests. Same upgrade idea as backpacks; middle-click sorts the GUI.</p>
  <table class="wikitable">
    <thead><tr><th>Chest / barrel tier</th><th>Slots</th><th>Upgrade slots</th></tr></thead>
    <tbody>
      <tr><td>Wood</td><td>27</td><td>1</td></tr>
      <tr><td>Copper</td><td>45</td><td>1</td></tr>
      <tr><td>Iron</td><td>54</td><td>2</td></tr>
      <tr><td>Gold</td><td>81</td><td>3</td></tr>
      <tr><td>Diamond</td><td>108</td><td>4</td></tr>
      <tr><td>Netherite</td><td>132</td><td>5</td></tr>
    </tbody>
  </table>
  <p>Stack upgrades on chests/barrels/shulkers are capped at <strong>2</strong> each. Always put storage inside an <a href="Claims.html">FTB claim</a>.</p>

  <h2>TrashSlot on the backpack screen</h2>
  <ul>
    <li>The trash can sits <strong>outside</strong> the top-right of the backpack / inventory GUI so it isn’t covered by upgrades or tabs.</li>
    <li>Drag it if you want another spot; it stays on by default.</li>
    <li>Accidentally deleted something? Open the <strong>Loot</strong> button → trash history to recover recent trashes.</li>
  </ul>

  <h2>Pitfalls</h2>
  <ul>
    <li>Don’t put backpacks inside shulkers / bundles that refuse container items — the pack blocks that.</li>
    <li>Void filters wipe permanently (history is for TrashSlot deletes, not void upgrades).</li>
    <li>If <kbd>B</kbd> opens voice group instead of your backpack, unbind voice group under Controls.</li>
    <li>Don’t spend your first day building a mega sorting wall — claim a bed, beat Brock, then expand storage.</li>
  </ul>

  <p class="see-also"><strong>See also:</strong> <a href="Building_and_Storage.html">Building &amp; storage</a> · <a href="Healing_and_Storage.html">Healing &amp; storage</a> · <a href="Keybinds.html">Keybinds</a> · <a href="Claims.html">Claims</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxSystems()}
  ${navboxMinecraft ? navboxMinecraft() : ""}
  `;
}

export function sophisticatedBackpacksBodyNl({ navboxCore }) {
  return `
  <h2>Wat deze mods zijn</h2>
  <p><strong>Sophisticated Backpacks</strong> zijn draagbare inventories die je opent met <kbd>B</kbd>. <strong>Sophisticated Storage</strong> is hetzelfde upgrade-idee voor <em>geplaatste</em> chests, barrels en shulkers op je basis.</p>
  <ul>
    <li><strong>Pokémon-PC</strong> (<code>/pc</code>) bewaart Pokémon — geen items. Zie <a href="Healing_and_Storage.html">Genezen &amp; opslag</a>.</li>
    <li><strong>Tom’s Storage</strong> is een apart basis-netwerk (terminal standaard <kbd>Y</kbd>) — niet hetzelfde als Soph. Zie <a href="Keybinds.html">Keybinds</a>.</li>
  </ul>

  <h2>Snel starten</h2>
  <ol class="steps">
    <li>Craft een <strong>Leather Backpack</strong> (EMI/REI: <em>backpack</em>).</li>
    <li>Doe hem aan (borstplaat / backpack-slot) of houd hem in je inventory.</li>
    <li>Druk <kbd>B</kbd> om te openen — of rechtsklik het item / de gedragen backpack.</li>
    <li>Houd een <strong>road-kit</strong> erin: balls, eten, pickaxe, map, potions.</li>
    <li>Upgrade de tier met de upgrade-recepten als je de materialen hebt.</li>
  </ol>
  <div class="callout tip">
    <div class="label">Vroeg spel</div>
    Leer sorting na Brock / Misty — eerst badges. Leather backpack + gelabelde chests volstaan de eerste uren.
  </div>

  <h2>Toetsen</h2>
  <table class="wikitable">
    <thead><tr><th>Actie</th><th>Default</th><th>Notities</th></tr></thead>
    <tbody>
      <tr><td>Backpack openen</td><td><kbd>B</kbd></td><td>Voice-chat <em>group</em> is unbound zodat dit niet gestolen wordt</td></tr>
      <tr><td>Soph GUI sorteren</td><td>Middelmuisknop</td><td>Werkt in backpacks én Soph Storage</td></tr>
      <tr><td>Inventory Profiles Next</td><td>—</td><td>Genegeerd op Soph-schermen — gebruik Soph’s eigen sort</td></tr>
      <tr><td>TrashSlot</td><td>Altijd zichtbaar</td><td>Slepen mag; zit buiten rechtsboven van de GUI</td></tr>
      <tr><td>Loot-filter / trash history</td><td>Loot-knop</td><td>Linkerrand van inventory-schermen — geen backpack-upgrade</td></tr>
    </tbody>
  </table>

  <h2>PokeHaven-verschillen</h2>
  <ul>
    <li><strong>Pickup-volgorde:</strong> gedeeltelijke hotbar-stacks → main inventory → <strong>in je backpacks</strong> → lege hotbar-slots.</li>
    <li><strong>Dood:</strong> je houdt je inventory (inclusief backpacks). XP kan nog wel wegvallen.</li>
    <li><strong>Iron+</strong> backpacks hebben <em>meer inventory- en upgrade-slots</em> dan standaard Sophisticated (tabel hieronder).</li>
    <li>Mobs spawnen / droppen <strong>geen</strong> backpacks op deze pack.</li>
    <li>Actieve upgrades (magnet, pickup, feeding, …) werken ook vanuit backpacks in je inventory — niet alleen de gedragen.</li>
    <li>Backpacks kunnen <strong>niet</strong> in shulkers / andere “container items”.</li>
  </ul>

  <h2>Backpack-tiers (PokeHaven)</h2>
  <table class="wikitable">
    <thead><tr><th>Tier</th><th>Inventory-slots</th><th>Upgrade-slots</th><th>vs default Soph</th></tr></thead>
    <tbody>
      <tr><td>Leather</td><td>27</td><td>1</td><td>Gelijk</td></tr>
      <tr><td>Copper</td><td>45</td><td>1</td><td>Gelijk</td></tr>
      <tr><td><strong>Iron</strong></td><td><strong>81</strong></td><td><strong>7</strong></td><td>Gebufft (was 54 / 2)</td></tr>
      <tr><td><strong>Gold</strong></td><td><strong>96</strong></td><td><strong>8</strong></td><td>Gebufft (was 81 / 3)</td></tr>
      <tr><td>Diamond</td><td>108</td><td><strong>9</strong></td><td>Meer upgrades (was 5)</td></tr>
      <tr><td>Netherite</td><td>120</td><td><strong>10</strong></td><td>Meer upgrades (was 7)</td></tr>
    </tbody>
  </table>
  <p>Stack-upgrades max <strong>3</strong> per backpack (plus max één jukebox- / furnace-upgrade-type).</p>

  <h2>Handige upgrades</h2>
  <p>Craft upgrades en zet ze in de upgrade-slots links in de backpack-GUI. Exacte recepten: EMI/REI.</p>
  <table class="wikitable">
    <thead><tr><th>Upgrade</th><th>Waarom</th></tr></thead>
    <tbody>
      <tr><td>Pickup / Magnet</td><td>Raapt drops in de buurt op (fijn op routes)</td></tr>
      <tr><td>Filter / Deposit filter</td><td>Alleen houden wat je wilt — of ores naar een deposit sturen</td></tr>
      <tr><td>Void</td><td>Verwijdert matching junk. <strong>Voorzichtig</strong> — makkelijk iets belangrijks kwijt</td></tr>
      <tr><td>Compacting</td><td>Auto-craft blokken / nuggets via filters</td></tr>
      <tr><td>Crafting</td><td>Craft-grid in de backpack</td></tr>
      <tr><td>Feeding</td><td>Eet automatisch eten uit de backpack</td></tr>
      <tr><td>Stack upgrade</td><td>Grotere stacks (max 3 op PokeHaven)</td></tr>
    </tbody>
  </table>
  ${critical(
    "nl",
    "<strong>Void-upgrade.</strong> Begin met een strakke filter. “Void anything” vernietigt items die je wilde bewaren."
  )}

  <h2>Sophisticated Storage (basis)</h2>
  <p>Gebruik geplaatste Soph chests / barrels / shulkers als je huis-sorting te groot wordt voor vanilla chests. Zelfde upgrade-idee; middelmuisknop sorteert.</p>
  <table class="wikitable">
    <thead><tr><th>Chest / barrel-tier</th><th>Slots</th><th>Upgrade-slots</th></tr></thead>
    <tbody>
      <tr><td>Wood</td><td>27</td><td>1</td></tr>
      <tr><td>Copper</td><td>45</td><td>1</td></tr>
      <tr><td>Iron</td><td>54</td><td>2</td></tr>
      <tr><td>Gold</td><td>81</td><td>3</td></tr>
      <tr><td>Diamond</td><td>108</td><td>4</td></tr>
      <tr><td>Netherite</td><td>132</td><td>5</td></tr>
    </tbody>
  </table>
  <p>Stack-upgrades op chests/barrels/shulkers max <strong>2</strong>. Zet opslag altijd in een <a href="Claims.html">FTB-claim</a>.</p>

  <h2>TrashSlot op het backpack-scherm</h2>
  <ul>
    <li>De prullenbak zit <strong>buiten</strong> rechtsboven van de backpack- / inventory-GUI, zodat upgrades/tabs er niet overheen liggen.</li>
    <li>Slepen mag; hij staat standaard aan.</li>
    <li>Per ongeluk weggegooid? <strong>Loot</strong>-knop → trash history voor recente trash.</li>
  </ul>

  <h2>Valkuilen</h2>
  <ul>
    <li>Geen backpacks in shulkers / container-items — de pack blokkeert dat.</li>
    <li>Void wist permanent (history is voor TrashSlot, niet voor void-upgrades).</li>
    <li>Opent <kbd>B</kbd> voice-group i.p.v. je backpack? Unbind group onder Controls.</li>
    <li>Bouw geen mega-sortingmuur op dag één — claim een bed, versla Brock, breid daarna pas uit.</li>
  </ul>

  <p class="see-also"><strong>Zie ook:</strong> <a href="Building_and_Storage.html">Bouwen &amp; opslag</a> · <a href="Healing_and_Storage.html">Genezen &amp; opslag</a> · <a href="Keybinds.html">Keybinds</a> · <a href="Claims.html">Claims</a> · <a href="FAQ.html">FAQ</a></p>
  ${navboxCore()}
  `;
}

export function registerSophisticatedBackpacks({ writePage, navboxSystems, navboxMinecraft }) {
  writePage("Sophisticated_Backpacks.html", {
    title: "Sophisticated Backpacks",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Sophisticated Backpacks", href: "Sophisticated_Backpacks.html" },
    ],
    lede: "Wearable backpacks and upgradeable chests on PokeHaven EU — open with <kbd>B</kbd>, sort with middle-click, and use pack-buffed Iron+ tiers.",
    infobox: SOPH_BACKPACKS_INFOBOX_EN,
    body: sophisticatedBackpacksBodyEn({ navboxSystems, navboxMinecraft }),
  });
}
