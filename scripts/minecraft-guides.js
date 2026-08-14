import { figure, guideImg } from "./deep-pages.js";
import { critical } from "./i18n.js";

export function registerMinecraftGuides({
  writePage,
  navboxMinecraft,
  navboxSystems,
  shiny,
  xpMult,
  economy,
  raids,
}) {
  writePage("Minecraft_Hub.html", {
    title: "Minecraft hub",
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
      <a class="hub-card" href="Pokemon_Husbandry.html"><h3>Pokémon husbandry</h3><p>Wool, milk, string from Pokémon — no sheep.</p></a>
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
      <li>Sell emeralds at the Bank (~${economy.bank.find((i) => i.item === "minecraft:emerald")?.price ?? 400}$ each on this pack). See <a href="Economy.html">Economy</a>.</li>
    </ol>

    <h2>Other useful farms</h2>
    <ul>
      <li><strong>Apricorns</strong> — balls (<a href="Poke_Balls.html">guide</a>)</li>
      <li><strong>Sugar cane / paper</strong> — Empty Maps for gym maps</li>
      <li><strong>Pokémon ranch</strong> — wool, milk, string, honey via interactions (<a href="Pokemon_Husbandry.html">Pokémon husbandry</a>). Vanilla sheep/cows/spiders are off.</li>
      <li><strong>Kelp / seagrass</strong> — Misty map items need <strong>Shears</strong> for seagrass</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Pokemon_Husbandry.html">Pokémon husbandry</a> · <a href="Villages_and_Trading.html">Villages</a> · <a href="Essential_Recipes.html">Essential recipes</a></p>
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
    lede: "Pokémon battles are the main fight loop — but Minecraft damage still kills you in caves, the Nether, and Deep Dark. Protect the trainer as hard as the party.",
    body: `
    <h2>Two kinds of combat</h2>
    <table class="wikitable">
      <thead><tr><th>Threat</th><th>What to do</th></tr></thead>
      <tbody>
        <tr><td>Wild / trainer Pokémon</td><td>Type coverage, heals, level cap — <a href="Catching_and_Battling.html">Catching &amp; battling</a></td></tr>
        <tr><td>Minecraft mobs / environment</td><td>Armor, shield, light, water bucket, don’t dig straight down</td></tr>
      </tbody>
    </table>

    <h2>Protect the trainer</h2>
    <ul>
      <li>Wear at least iron before long cave or Nether runs.</li>
      <li>Shield blocks creepers, skeletons, and piglin brutes.</li>
      <li>Carry a water bucket (MLG falls, lava clearing, quick fire-outs).</li>
      <li>Food still helps regen even with No Hunger — keep a stack on the hotbar.</li>
      <li>Totem of Undying is a luxury panic button for Elite Four / Deep Dark prep.</li>
    </ul>

    <h2>Before a risky trip</h2>
    <ol class="steps">
      <li>Pin coords on Xaero (or screenshot F3).</li>
      <li>Confirm bed + <a href="Travel.html">waystone</a> at your <a href="Claims.html">claimed</a> base.</li>
      <li>Hotbar: balls, potions/Revives, pickaxe, blocks, map, shield.</li>
      <li>Heal the party at a Center — don’t leave half-fainted.</li>
    </ol>

    <h2>Death checklist</h2>
    <ol class="steps">
      <li>Respawn at bed → waystone toward your death pin if you can.</li>
      <li>Grab gear first, then Pokémon items — don’t AFK on the corpse.</li>
      <li>Rebuild the road kit before the next gym attempt.</li>
      <li>If you died in lava / void, treat it as a gear reset and re-craft — don’t rage-quit unclaimed chests at home.</li>
    </ol>

    <div class="callout warn">
      <div class="label">Deep Dark / Giovanni</div>
      Bring wool, sneak habits, and an escape plan. World damage ends runs as often as Pokémon KOs — <a href="Giovanni.html">Giovanni</a>.
    </div>

    <h2>Wild Pokémon aggro</h2>
    <p>Fight or Flight can make wilds attack <em>you</em>. Keep distance, send out first, and heal at Centers between dens and gyms.</p>

    <h2>Common mistakes</h2>
    <ul>
      <li>Full party heals but naked trainer in a creeper cave.</li>
      <li>No waystone → 2000-block corpse run.</li>
      <li>Dying with unclaimed valuables at home.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Catching_and_Battling.html">Catching &amp; battling</a> · <a href="Healing_and_Storage.html">Healing</a> · <a href="Nether_Guide.html">Nether</a></p>
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
    lede: "Enter the Nether on purpose — for resources and for CobbleVerse routes (Blaine / Crimson Forest vibes). Treat every trip as a planned expedition.",
    body: `
    <h2>When to go</h2>
    <ul>
      <li>Iron armor minimum; Fire Resistance potions if you can brew.</li>
      <li>Bed + waystone secured in the Overworld first.</li>
      <li>Pack: pickaxe, building blocks, food, balls, flint &amp; steel backup, shield.</li>
      <li>Don’t make the Nether your first-hour project — finish a base and Brock path first.</li>
    </ul>

    <h2>Portal basics</h2>
    <ol class="steps">
      <li>Build a 4×5 obsidian frame (corners optional).</li>
      <li>Light with flint &amp; steel.</li>
      <li>Mark Overworld portal coords on Xaero immediately.</li>
      <li>Once the link is stable, place a waystone near the Overworld side.</li>
      <li>Optional: secure a small claimed room around the portal so it doesn’t get griefed.</li>
    </ol>

    <h2>First minutes inside</h2>
    <ol class="steps">
      <li>Build a one-block ledge / roof so ghasts can’t snipe the portal.</li>
      <li>Place a cobble / dirt bridge — never dig straight down.</li>
      <li>Pin the Nether spawn of your portal on the map.</li>
      <li>Grab what you came for, then leave. Sightseeing later.</li>
    </ol>

    <h2>Why CobbleVerse players care</h2>
    <ul>
      <li><strong>Blaine</strong> tips point at Crimson Forest-style biomes — <a href="Blaine.html">Blaine</a>.</li>
      <li>Blaze rods / powder for brewing and progress.</li>
      <li>Ancient Debris later for netherite gear (after you’re stable in Kanto mid-game).</li>
      <li>Quartz, glowstone, and crimson/warped wood for builds and crafts.</li>
    </ul>

    ${critical(
      "en",
      "<strong>Do not dig straight down from a random portal exit.</strong> Scout with blocks; never pearl blindly over lava oceans."
    )}

    <h2>Common mistakes</h2>
    <ul>
      <li>No flint &amp; steel backup when the portal breaks.</li>
      <li>Gold armor forgotten in bastions / near piglins.</li>
      <li>Using the Nether as a shortcut with no Overworld waystone home.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Travel.html">Travel</a> · <a href="Combat_and_Death.html">Combat &amp; death</a> · <a href="Blaine.html">Blaine</a></p>
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
    lede: "Villages are Map Guides, Farmers, and early loot — central to gym navigation and your emerald → PokéDollar loop.",
    body: `
    <h2>Priority villagers</h2>
    <table class="wikitable">
      <thead><tr><th>Role</th><th>Why you care</th></tr></thead>
      <tbody>
        <tr><td>Farmer</td><td>Wheat / crops → emeralds → Bank money (<a href="Economy.html">Economy</a>)</td></tr>
        <tr><td>Map Guide</td><td>Gym maps after you place the right cartography table</td></tr>
        <tr><td>Librarian</td><td>Enchanted books when you’re gearing up</td></tr>
        <tr><td>Tool / weaponsmith</td><td>Gear trades once you have emerald surplus</td></tr>
      </tbody>
    </table>

    <h2>Map Guide setup</h2>
    <ol class="steps">
      <li>Craft the region cartography table (start with <strong>Kanto Cartography Table</strong> — REI).</li>
      <li>Place it next to an unemployed villager so they take the Map Guide job.</li>
      <li>Trade maps <em>or</em> craft Empty Map + special item yourself. Full steps: <a href="Gym_Maps.html">Gym maps</a>.</li>
      <li>Later regions need Johto / Hoenn / Sinnoh tables — don’t use the Kanto table for those maps.</li>
    </ol>

    <h2>Keep a trading village alive</h2>
    <ul>
      <li>Light the village and claim the plots you build on.</li>
      <li>Fence or wall job sites you care about so zombies don’t wipe your Farmers.</li>
      <li>Bring a bed for yourself nearby — don’t sleep in a way that scrambles villager beds if you can avoid it.</li>
      <li>Pin the village on Xaero; you’ll return every few gyms for emeralds and maps.</li>
    </ul>

    <h2>Looting etiquette on PokeHaven</h2>
    <ul>
      <li>Village chests and Pokémon Center chests are fair to loot.</li>
      <li>Player claims are not — see <a href="Rules_and_Commands.html">Rules</a> and <a href="Claims.html">Claims</a>.</li>
      <li>Don’t break job site blocks in a village another player is clearly using without asking.</li>
    </ul>

    <h2>Player trading</h2>
    <p>There is no forced auction house. Trade with players in good faith, prefer meeting in claimed / public hubs, and never drop valuables before you trust the deal. Scam = report to staff with screenshots. Quest chapter: <strong>Trade Hall</strong> (player trading + trade-evolutions) — <a href="Quests.html">Quests</a>.</p>

    <p class="see-also"><strong>See also:</strong> <a href="Farming_and_Food.html">Farming</a> · <a href="Gym_Maps.html">Gym maps</a> · <a href="Economy.html">Economy</a> · <a href="Quests.html">Quests</a></p>
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
    lede: "A small, claimed, organised base beats a palace with zero gym badges. Build for progress first — pretty later.",
    body: `
    <h2>Minimum viable base</h2>
    <ul>
      <li>Bed (set respawn) + torches</li>
      <li>Claimed chests / backpack dump</li>
      <li>Crafting table + furnace (anvil later)</li>
      <li>Waystone inside the claim</li>
      <li>Apricorn corner + tiny wheat patch</li>
      <li>Room to expand pastures / sorting later</li>
    </ul>

    ${figure(
      guideImg("claims-ftb.png"),
      "<strong>Claim the base.</strong> Storage means nothing if it isn’t claimed — <a href=\"Claims.html\">Claims</a>.",
      "FTB Chunks claim map over a base"
    )}

    <h2>Day-one layout</h2>
    <ol class="steps">
      <li>Pick a spot near spawn or a village you like — not 10k blocks away on hour one.</li>
      <li>Place bed → claim the chunk(s) → dump starter kit into labelled chests.</li>
      <li>Activate / place a waystone next to the bed.</li>
      <li>Plant apricorns + wheat before the first long Brock hike.</li>
    </ol>

    <h2>Storage tips</h2>
    <ul>
      <li>Label chests early: Balls / Heals / Ores / Maps / Food / Misc.</li>
      <li>Road kit stays in the backpack: balls, food, pickaxe, map, potions.</li>
      <li>PC boxes for coverage teams — <code>/pc</code> — <a href="Healing_and_Storage.html">Healing &amp; storage</a>.</li>
      <li>Sophisticated Storage / Tom’s Storage are in the pack for later sorting — learn them after Brock / Misty, not instead of badges.</li>
    </ul>

    <h2>Expand without chaos</h2>
    <ul>
      <li>Expand the <strong>claim</strong> before the build footprint grows.</li>
      <li>Keep farms and pastures inside the same claim as the bed.</li>
      <li>One “dump chest” is fine for 20 minutes — not for a week.</li>
      <li>Pretty roofs can wait until Valerio; a lit, claimed box cannot.</li>
    </ul>

    <h2>Common mistakes</h2>
    <ul>
      <li>Palace first, claim never.</li>
      <li>Waystone outside the claim.</li>
      <li>Every item in one mega-chest forever.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Claims.html">Claims</a> · <a href="Travel.html">Travel</a> · <a href="First_Hours.html">First hours</a></p>
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
    lede: "How the CobbleVerse world is laid out for PokeHaven players — Terralith overworld, Nether routes, and an End that is not about the dragon.",
    body: `
    <h2>Dimensions</h2>
    <table class="wikitable">
      <thead><tr><th>Dimension</th><th>Role on PokeHaven EU</th></tr></thead>
      <tbody>
        <tr><td>Overworld</td><td>Gyms, villages, raid dens, claims, main adventure (Terralith biomes)</td></tr>
        <tr><td>Nether</td><td>Resources + some gym biome targets — <a href="Nether_Guide.html">Nether guide</a></td></tr>
        <tr><td>The End</td><td>Elite Four / late structures — <strong>Ender Dragon disabled</strong></td></tr>
      </tbody>
    </table>

    <h2>Terralith overworld</h2>
    <p>Worldgen is expanded. Biomes and skylines look different from vanilla YouTube guides. Use:</p>
    <ul>
      <li><a href="Gym_Maps.html">Gym maps</a> for leaders</li>
      <li>Nature’s Compass / Explorer’s Compass for biomes / structures</li>
      <li>Xaero pins for dens, portals, and villages you care about</li>
    </ul>
    <p>Do <strong>not</strong> trust random “seed 123” coordinates from another world.</p>

    <h2>What progression is (and isn’t)</h2>
    <ul>
      <li><strong>Is:</strong> gyms → level cap → regions — <a href="Progression.html">Progression</a></li>
      <li><strong>Isn’t:</strong> rush the Ender Dragon for “endgame gear”</li>
      <li><strong>Isn’t:</strong> treat hunger farms as mandatory survival (No Hunger datapack) — still farm for emeralds</li>
    </ul>

    <h2>Practical habits</h2>
    <ul>
      <li>Build your first base in the Overworld near useful biomes / a village.</li>
      <li>Open Nether only when geared — see the Nether guide.</li>
      <li>Enter End content when the pack / league path sends you there, not as a day-one flex.</li>
      <li>Raid dens are Overworld crystals — <a href="Raids.html">Raids</a>.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Pack_Differences.html">Pack differences</a> · <a href="Nether_Guide.html">Nether</a> · <a href="Travel.html">Travel</a></p>
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
      <tr><th>Shiny</th><td>1 / ${shiny}</td></tr>
      <tr><th>XP</th><td>×${xpMult}</td></tr>
      <tr><th>Income</th><td>×${economy.incomeMultiplier}</td></tr>
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
        <tr><td>PokéDollars</td><td>×${economy.incomeMultiplier} income</td><td>Craft + emerald loop matters more</td></tr>
        <tr><td>Shiny rate</td><td>1/${shiny}</td><td>Do not expect gen-series shiny odds myths</td></tr>
        <tr><td>Raid dens</td><td>1/${raids.common.spawnRate} spawn, tier table in wiki</td><td>See <a href="Raids.html">Raids</a></td></tr>
        <tr><td>Claims</td><td>FTB Chunks only (OPAC removed)</td><td>Do not mix claim mods</td></tr>
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
