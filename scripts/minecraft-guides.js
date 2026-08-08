import { figure } from "./deep-pages.js";
import { critical } from "./i18n.js";

export function registerMinecraftGuides({ writePage, navboxMinecraft, navboxSystems }) {
  writePage("Minecraft_Hub.html", {
    title: "Minecraft survival hub",
    hideToc: true,
    isHub: true,
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
    ],
    lede: "Vanilla Minecraft skills that still matter on <strong>PokeHaven EU</strong> — with CobbleVerse pack twists called out up front.",
    body: `
    <div class="callout tip">
      <div class="label">Read this first</div>
      This is not a generic Minecraft wiki dump. Every page below focuses on what helps you progress gyms, money, and travel on CobbleVerse 1.7.42.
      Full list of pack quirks: <a href="Pack_Differences.html">Pack differences</a>.
    </div>

    <h2>Guides</h2>
    <div class="hub-grid">
      <a class="hub-card" href="Tools_and_Mining.html"><h3>Tools &amp; mining</h3><p>Wood to netherite, copper for balls, caves.</p></a>
      <a class="hub-card" href="Farming_and_Food.html"><h3>Farming &amp; food</h3><p>Wheat→emeralds; hunger rules on this pack.</p></a>
      <a class="hub-card" href="Combat_and_Death.html"><h3>Combat &amp; death</h3><p>Armor, dying safely, void tips.</p></a>
      <a class="hub-card" href="Nether_Guide.html"><h3>Nether guide</h3><p>Portals, Crimson Forest, Blaine routes.</p></a>
      <a class="hub-card" href="Villages_and_Trading.html"><h3>Villages &amp; trading</h3><p>Farmers, Map Guides, cartography.</p></a>
      <a class="hub-card" href="Building_and_Storage.html"><h3>Building &amp; storage</h3><p>Chests, backpacks, bases.</p></a>
      <a class="hub-card" href="Dimensions_and_World.html"><h3>Dimensions &amp; world</h3><p>Overworld / Nether / End, Terralith.</p></a>
      <a class="hub-card" href="Essential_Recipes.html"><h3>Essential recipes</h3><p>Balls, maps, tools — curated crafts.</p></a>
    </div>

    <h2>Also useful</h2>
    <ul>
      <li><a href="Minecraft_Basics.html">Minecraft basics</a> (short starter course)</li>
      <li><a href="Recipe_Browser.html">Recipe browser</a> (datapack recipe search)</li>
      <li><a href="Claims.html">Claims</a> · <a href="Travel.html">Travel</a> · <a href="Economy.html">Economy</a></li>
    </ul>
    ${navboxMinecraft()}
    `,
  });

  writePage("Tools_and_Mining.html", {
    title: "Tools and mining",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Tools and mining", href: "Tools_and_Mining.html" },
    ],
    lede: "You cannot craft Poké Balls or gear without a normal Minecraft tool ladder. This is the short, pack-focused version.",
    body: `
    <h2>Tool ladder</h2>
    <pre>Wood → Stone → Iron → Diamond → Netherite</pre>
    <table class="wikitable">
      <thead><tr><th>Tier</th><th>Why you need it on PokeHaven</th></tr></thead>
      <tbody>
        <tr><td>Wood</td><td>First pick/axe/sword — minutes only</td></tr>
        <tr><td>Stone</td><td>Minimum to mine iron + copper reliably</td></tr>
        <tr><td>Iron</td><td>Armor, shears, shield, Great Ball cores, buckets</td></tr>
        <tr><td>Diamond</td><td>Safe caves / Nether prep</td></tr>
        <tr><td>Netherite</td><td>Late-game durability (optional for gyms)</td></tr>
      </tbody>
    </table>

    <h2>Ores that matter early</h2>
    <ul>
      <li><strong>Copper</strong> — Poké Ball cores (<a href="Poke_Balls.html">Poké Balls</a>)</li>
      <li><strong>Iron</strong> — tools, shears, Great Balls, rails/buckets</li>
      <li><strong>Coal</strong> — torches + smelting</li>
      <li><strong>Gold</strong> — Ultra Ball cores, powered rails, piglin trades</li>
      <li><strong>Diamonds</strong> — armor before tough gyms / Nether</li>
    </ul>

    <h2>Safe mining loop</h2>
    <ol class="steps">
      <li>Craft stone tools + 20+ torches.</li>
      <li>Branch mine or follow caves; place torches so you can leave.</li>
      <li>Bring food even if hunger is altered — see <a href="Farming_and_Food.html">Farming &amp; food</a>.</li>
      <li>Keep a bed / waystone network so death is not a 2000-block walk (<a href="Travel.html">Travel</a>).</li>
      <li>Claim your ore dump chests (<a href="Claims.html">Claims</a>).</li>
    </ol>

    <div class="callout tip">
      <div class="label">Gym trip kit</div>
      Pickaxe + food + balls + heals + torches. You will break stone and need copper mid-route more often than you think.
    </div>

    <p class="see-also"><strong>See also:</strong> <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Nether_Guide.html">Nether</a></p>
    ${navboxMinecraft()}
    `,
  });

  writePage("Farming_and_Food.html", {
    title: "Farming and food",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Farming and food", href: "Farming_and_Food.html" },
    ],
    lede: "Farms fund your economy. Hunger behaviour on CobbleVerse may differ from vanilla — treat food as healing/utility too.",
    body: `
    ${figure(
      "../assets/guides/farm-loop.png",
      "<strong>Wheat farm.</strong> Farm wheat, trade Farmers for emeralds, sell at the Bank for PokéDollars.",
      "Wheat farm for emerald trading"
    )}

    <h2>Farm setup example</h2>
    <p>Top-down layout with water channels so every crop stays hydrated. Click the diagram to enlarge.</p>
    ${figure(
      "../assets/guides/farm-setup-example.png",
      "<strong>Farm setup example.</strong> Alternating crop rows and water — expand this pattern at your claim.",
      "Top-down wheat farm setup example",
      { large: true, diagram: true }
    )}

    <h2>Pack note: No Hunger datapack</h2>
    <p>CobbleVerse ships a <strong>No Hunger</strong> datapack. That means classic starvation pressure is reduced/removed compared to vanilla.
    You still want farms for <em>emerald trading</em>, animal breeding, and some healing foods — not only to fill a hunger bar.</p>
    <p>Details: <a href="Pack_Differences.html">Pack differences</a>.</p>

    <h2>Wheat → emeralds → PokéDollars</h2>
    <ol class="steps">
      <li>Break grass for seeds; craft a hoe.</li>
      <li>Till dirt within 4 blocks of water.</li>
      <li>Light the farm; do not jump on crops.</li>
      <li>Trade a Farmer villager for emeralds.</li>
      <li>Sell emeralds at the Bank (~400$ each on this pack). See <a href="Economy.html">Economy</a>.</li>
    </ol>

    <h2>Other useful farms</h2>
    <ul>
      <li><strong>Apricorns</strong> — balls (<a href="Poke_Balls.html">guide</a>)</li>
      <li><strong>Sugar cane / paper</strong> — Empty Maps for gym maps</li>
      <li><strong>Animals</strong> — leather, food, trading leftovers</li>
      <li><strong>Kelp / seagrass</strong> — Misty map items need <strong>Shears</strong> for seagrass</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Villages_and_Trading.html">Villages</a> · <a href="Essential_Recipes.html">Essential recipes</a></p>
    ${navboxMinecraft()}
    `,
  });

  writePage("Combat_and_Death.html", {
    title: "Combat and death",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Combat and death", href: "Combat_and_Death.html" },
    ],
    lede: "Pokémon battles are the main combat loop — but Minecraft damage still kills you in caves, the Nether, and Deep Dark (Giovanni).",
    body: `
    <h2>Protect the trainer, not only the party</h2>
    <ul>
      <li>Wear armor before long cave / Nether runs.</li>
      <li>Shield blocks creepers and piglin brutes.</li>
      <li>Carry a water bucket (mlg / lava clearing).</li>
      <li>Totem of Undying is a luxury panic button for Elite Four prep.</li>
    </ul>

    <h2>Death checklist</h2>
    <ol class="steps">
      <li>Note coordinates from F3 / minimap before risky fights.</li>
      <li>Have a bed + waystone at home so respawn is sane.</li>
      <li>Claim valuables — death is worse if someone loots your base too.</li>
      <li>Rebuild hotbar: balls, heals, food, pickaxe, map.</li>
    </ol>

    <div class="callout warn">
      <div class="label">Deep Dark / Giovanni</div>
      Bring wool, sneak habits, and an escape plan. Minecraft world damage ends runs as often as Pokémon KOs.
    </div>

    <h2>Wild Pokémon aggro</h2>
    <p>Fight or Flight can make wilds attack you. Heal at Centers; do not enter gym leaders half-dead. See <a href="Catching_and_Battling.html">Catching &amp; battling</a>.</p>

    ${navboxMinecraft()}
    `,
  });

  writePage("Nether_Guide.html", {
    title: "Nether guide",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Nether guide", href: "Nether_Guide.html" },
    ],
    lede: "You will enter the Nether for resources and for CobbleVerse routes (e.g. Blaine / Crimson Forest vibes). Treat it as a planned expedition.",
    body: `
    <h2>When to go</h2>
    <ul>
      <li>Iron armor + fire resistance potions ideally</li>
      <li>Waystone / bed secured in the Overworld</li>
      <li>Pickaxe, blocks, food, balls, flint &amp; steel backup</li>
    </ul>

    <h2>Portal basics</h2>
    <ol class="steps">
      <li>Build a 4×5 obsidian frame (corners optional).</li>
      <li>Light with flint &amp; steel.</li>
      <li>Mark the Overworld portal coords on Xaero.</li>
      <li>Place a waystone near the Overworld portal once stable.</li>
    </ol>

    <h2>Why CobbleVerse players care</h2>
    <ul>
      <li><strong>Blaine</strong> tips point at Crimson Forest-style biomes — see <a href="Blaine.html">Blaine</a>.</li>
      <li>Blaze rods / powder for brewing and progress.</li>
      <li>Ancient Debris later for netherite gear.</li>
    </ul>

    ${critical(
      "en",
      "<strong>Do not dig straight down from a random portal exit.</strong> Scout with blocks; never pearl blindly over lava oceans."
    )}

    ${navboxMinecraft()}
    `,
  });

  writePage("Villages_and_Trading.html", {
    title: "Villages and trading",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Villages and trading", href: "Villages_and_Trading.html" },
    ],
    lede: "Villages are your Map Guides, Farmers, and early loot — central to CobbleVerse gym navigation.",
    body: `
    <h2>Priority villagers</h2>
    <table class="wikitable">
      <thead><tr><th>Role</th><th>Why</th></tr></thead>
      <tbody>
        <tr><td>Farmer</td><td>Emeralds from wheat/crops → Bank money</td></tr>
        <tr><td>Map Guide (job site)</td><td>Gym maps after you place Kanto Cartography Table</td></tr>
        <tr><td>Tool / weaponsmith</td><td>Gear trades when you have emeralds</td></tr>
      </tbody>
    </table>

    <h2>Map Guide setup</h2>
    <ol class="steps">
      <li>Craft <strong>Kanto Cartography Table</strong> (search REI).</li>
      <li>Place it next to an unemployed villager.</li>
      <li>Trade gym maps — or craft via Empty Map + special item. Full steps: <a href="Gym_Maps.html">Gym maps</a>.</li>
    </ol>

    <h2>Looting etiquette on PokeHaven</h2>
    <p>Village and Pokémon Center chests are fair to loot. Claim your own base separately so you are not “that guy” who also griefs claimed land.</p>

    ${navboxMinecraft()}
    `,
  });

  writePage("Building_and_Storage.html", {
    title: "Building and storage",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Building and storage", href: "Building_and_Storage.html" },
    ],
    lede: "A small, claimed, organised base beats a palace with no gym badges.",
    body: `
    <h2>Minimum viable base</h2>
    <ul>
      <li>Bed + respawn</li>
      <li>Claimed chests / backpack dump</li>
      <li>Crafting table + furnace + anvil later</li>
      <li>Waystone</li>
      <li>Apricorn + wheat plots</li>
      <li>Torch lighting</li>
    </ul>

    ${figure(
      "../assets/guide-claims.png",
      "<strong>Claim the base.</strong> Storage means nothing if it is not claimed.",
      "Claimed base"
    )}

    <h2>Storage tips</h2>
    <ul>
      <li>Label chests: Balls / Heals / Ores / Maps / Food.</li>
      <li>Use the pack backpack for road kits.</li>
      <li>Sophisticated Storage / Tom's Storage exist in the pack for later sorting — learn them after Brock/Misty.</li>
      <li>PC boxes for Pokémon coverage teams (<a href="Healing_and_Storage.html">Healing &amp; storage</a>).</li>
    </ul>

    ${navboxMinecraft()}
    `,
  });

  writePage("Dimensions_and_World.html", {
    title: "Dimensions and world",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Minecraft hub", href: "Minecraft_Hub.html" },
      { label: "Dimensions and world", href: "Dimensions_and_World.html" },
    ],
    lede: "How the CobbleVerse world is laid out for PokeHaven players — including Terralith and disabled vanilla bosses.",
    body: `
    <h2>Dimensions</h2>
    <table class="wikitable">
      <thead><tr><th>Dimension</th><th>Role on this pack</th></tr></thead>
      <tbody>
        <tr><td>Overworld</td><td>Gyms, villages, raids dens, main adventure (Terralith biomes)</td></tr>
        <tr><td>Nether</td><td>Resources + some gym biome targets</td></tr>
        <tr><td>The End</td><td>Elite Four tower content — <strong>Ender Dragon disabled</strong> by datapack</td></tr>
      </tbody>
    </table>

    <h2>Terralith</h2>
    <p>Worldgen is expanded. Biomes look different from vanilla tutorials — use gym maps + Nature’s/Explorer’s compasses, not YouTube “seed 123” coords.</p>

    <h2>Disabled / altered vanilla goals</h2>
    <ul>
      <li><strong>No Ender Dragon</strong> datapack — you are not here to cheese dragon gear as the main goal.</li>
      <li><strong>No Hunger</strong> datapack — see Farming page.</li>
      <li>Progression spine = <a href="Progression.html">gyms / level cap</a>, not the dragon.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Pack_Differences.html">Pack differences</a> · <a href="Nether_Guide.html">Nether</a></p>
    ${navboxMinecraft()}
    `,
  });

  writePage("Pack_Differences.html", {
    title: "Pack differences",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Pack differences", href: "Pack_Differences.html" },
    ],
    lede: "Why random Minecraft, Cobblemon, or Lumyverse pages feel wrong on PokeHaven EU — here’s what CobbleVerse 1.7.42 actually does here.",
    infobox: `<div class="infobox-title">Quick facts</div>
    <table>
      <tr><th>Pack</th><td>CobbleVerse 1.7.42</td></tr>
      <tr><th>Server</th><td>PokeHaven EU</td></tr>
      <tr><th>Shiny</th><td>1 / 2048</td></tr>
      <tr><th>XP</th><td>×2</td></tr>
      <tr><th>Income</th><td>×0.5</td></tr>
      <tr><th>Waystones</th><td>No cost / cooldown</td></tr>
    </table>`,
    body: `
    <h2>Datapack / config differences</h2>
    <table class="wikitable">
      <thead><tr><th>Topic</th><th>On this pack</th><th>Why it matters</th></tr></thead>
      <tbody>
        <tr><td>Hunger</td><td><strong>No Hunger</strong> datapack</td><td>Farms are for emeralds/items more than starvation</td></tr>
        <tr><td>Ender Dragon</td><td><strong>Disabled</strong></td><td>End is not the vanilla boss checklist</td></tr>
        <tr><td>Level cap</td><td>RCT series progression</td><td>XP “stops” until next gym</td></tr>
        <tr><td>Waystones</td><td>Free, no cooldown</td><td>Build a teleport network early</td></tr>
        <tr><td>PokéDollars</td><td>×0.5 income</td><td>Craft + emerald loop matters more</td></tr>
        <tr><td>Shiny rate</td><td>1/2048</td><td>Do not expect gen-series shiny odds myths</td></tr>
        <tr><td>Raid dens</td><td>1/480 spawn, tier table in wiki</td><td>See <a href="Raids.html">Raids</a></td></tr>
        <tr><td>Claims</td><td>FTB Chunks recommended</td><td>Do not mix claim mods</td></tr>
        <tr><td>Trainer outfits</td><td>Poke Clothing (craftable)</td><td>See <a href="Outfits_and_Cosmetics.html">Outfits and cosmetics</a></td></tr>
        <tr><td>Pokémon looks</td><td>Cosplay Pikachu, Furfrou cuts, scarves…</td><td>Cosmetic slot / special items — same guide</td></tr>
      </tbody>
    </table>

    <h2>Do not trust blindly</h2>
    <ul>
      <li>Generic Minecraft hunger farms as “must do or die”</li>
      <li>Dragon-focused End guides as your main progression</li>
      <li>Other servers’ shop prices</li>
      <li>Lumyverse wiki UX — use this PokeHaven wiki for how <em>we</em> play</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Minecraft_Hub.html">Minecraft hub</a> · <a href="Outfits_and_Cosmetics.html">Outfits and cosmetics</a> · <a href="Progression.html">Progression</a> · <a href="Economy.html">Economy</a></p>
    ${navboxSystems()}
    ${navboxMinecraft()}
    `,
  });
}
