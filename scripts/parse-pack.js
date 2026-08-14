import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PACK = path.resolve(ROOT, "..", "_pack_analysis");
const CONFIG = path.join(PACK, "overrides", "config");
const RCT = path.join(PACK, "_dp_peek", "COBBLEVERSE-RCT-DP-v20");
const MAIN_DP = path.join(PACK, "_dp_peek", "COBBLEVERSE-DP-v21-CF");
const POKEHAVEN_DP = path.resolve(ROOT, "..", "zz-PokeHaven-EU");
const OUT = path.join(ROOT, "data");

function readJson(file) {
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(text);
}

function stripJson5(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/,(\s*[}\]])/g, "$1");
}

function readJson5(file) {
  return JSON.parse(
    stripJson5(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""))
  );
}

function itemLabel(id) {
  if (!id) return "—";
  const name = String(id).includes(":") ? String(id).split(":")[1] : String(id);
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bPokemon\b/g, "Pokémon");
}

function parseEconomy() {
  const common = readJson(path.join(CONFIG, "cobbledollars", "common.json"));
  const shop = readJson(path.join(CONFIG, "cobbledollars", "default_shop.json"));
  const bank = readJson(path.join(CONFIG, "cobbledollars", "bank.json"));

  const shopSections = [];
  for (const block of shop.defaultShop || []) {
    for (const [section, items] of Object.entries(block)) {
      shopSections.push({
        section,
        items: items.map((i) => ({
          item: i.item,
          label: itemLabel(i.item),
          price: i.price,
        })),
      });
    }
  }

  const bankItems = (bank.sellableItems || bank.items || bank.bank || [])
    .map?.((i) => ({
      item: i.item || i.id,
      label: itemLabel(i.item || i.id),
      price: i.price ?? i.sellPrice ?? i.value,
    }))
    .filter((i) => i.item && i.price != null);

  // bank.json shape may be object map
  let bankList = bankItems;
  if (!bankList.length && bank && typeof bank === "object") {
    bankList = [];
    const maybe = bank.prices || bank.sellPrices || bank;
    if (Array.isArray(maybe)) {
      bankList = maybe.map((i) => ({
        item: i.item,
        label: itemLabel(i.item),
        price: i.price,
      }));
    } else {
      for (const [key, val] of Object.entries(maybe)) {
        if (key === "defaultShop") continue;
        if (typeof val === "number") {
          bankList.push({ item: key, label: itemLabel(key), price: val });
        } else if (val && typeof val === "object" && (val.price != null || val.sellPrice != null)) {
          bankList.push({
            item: val.item || key,
            label: itemLabel(val.item || key),
            price: val.price ?? val.sellPrice,
          });
        }
      }
    }
  }

  // Live PokeHaven battle/capture payouts (Cobblemon Economy mod)
  let cobblemonEconomy = null;
  const ecoPath = path.join(CONFIG, "cobblemon-economy", "config.json");
  if (fs.existsSync(ecoPath)) {
    const eco = readJson(ecoPath);
    cobblemonEconomy = {
      mainCurrency: eco.mainCurrency ?? "cobbledollars",
      startingBalance: eco.startingBalance ?? null,
      battleVictoryReward: eco.battleVictoryReward ?? null,
      raidDenVictoryReward: eco.raidDenVictoryReward ?? null,
      captureReward: eco.captureReward ?? null,
      shinyMultiplier: eco.shinyMultiplier ?? null,
      radiantMultiplier: eco.radiantMultiplier ?? null,
      legendaryMultiplier: eco.legendaryMultiplier ?? null,
      paradoxMultiplier: eco.paradoxMultiplier ?? null,
    };
  }

  return {
    incomeMultiplier: common.cobbleDollarsIncomeMultiplier ?? common.incomeMultiplier ?? 0.5,
    earnFromWild: common.earnFromWildPokemon ?? common.earnCobbleDollarsFromWildPokemon ?? true,
    earnFromNpc: common.earnFromNPC ?? common.earnCobbleDollarsFromNPC ?? true,
    cobblemonEconomy,
    shop: shopSections,
    bank: bankList.sort((a, b) => a.label.localeCompare(b.label)),
  };
}

function parseRaids() {
  const common = readJson5(path.join(CONFIG, "cobblemonraiddens", "common.json5"));
  const tiers = [];
  for (let i = 1; i <= 7; i++) {
    const names = ["one", "two", "three", "four", "five", "six", "seven"];
    const file = path.join(CONFIG, "cobblemonraiddens", `tier_${names[i - 1]}.json5`);
    if (!fs.existsSync(file)) continue;
    const t = readJson5(file);
    tiers.push({
      tier: i,
      bossLevel: t.boss_level ?? t.level,
      maxPlayers: t.max_players ?? t.player_count,
      ivs: t.ivs ?? t.guaranteed_ivs,
      currency: t.currency ?? t.currency_reward ?? t.reward_currency,
      hpMultiplier: t.health_multiplier ?? t.hp_multiplier,
      maxClears: t.max_clears,
      haRate: t.ha_rate ?? t.hidden_ability_chance,
      requiredDamage: t.required_damage,
      ai: t.raid_ai || t.ai_type || t.ai,
    });
  }

  const bossesDir = path.join(MAIN_DP, "data", "cobblemonraiddens", "raid", "boss");
  const bosses = [];
  if (fs.existsSync(bossesDir)) {
    for (const file of fs.readdirSync(bossesDir).filter((f) => f.endsWith(".json"))) {
      try {
        const data = readJson(path.join(bossesDir, file));
        bosses.push({
          id: file.replace(/\.json$/, ""),
          label: itemLabel(file.replace(/\.json$/, "")),
          pokemon: data.pokemon || data.species || file.replace(/\.json$/, ""),
          tier: data.tier ?? data.raid_tier ?? null,
          weight: data.weight ?? null,
        });
      } catch {
        bosses.push({
          id: file.replace(/\.json$/, ""),
          label: itemLabel(file.replace(/\.json$/, "")),
          pokemon: file.replace(/\.json$/, ""),
          tier: null,
          weight: null,
        });
      }
    }
  }

  return {
    common: {
      spawnRate: common.dimension_spawn_rate?.["minecraft:overworld"] ?? 480,
      tierWeights: common.dimension_tier_weights?.["minecraft:overworld"] ?? [],
      resetTime: common.reset_time,
      resetMode: common.reset_mode,
      cycleMode: common.cycle_mode,
      rewardDistribution: common.reward_distribution,
      retryFailed: common.retry_failed_raids,
      syncRewards: common.sync_rewards,
      requiredEnergy: common.required_energy,
    },
    tiers,
    bosses: bosses.sort((a, b) => a.label.localeCompare(b.label)),
  };
}

const KANTO_META = {
  kanto_brock: {
    slug: "Brock",
    type: "Rock",
    badge: "Boulder Badge",
    biome: "Plains",
    specialItem: "Onyx Stone",
    order: 1,
    tips: "Grass and Water moves hit hard. Bring Oran Berries and heal before the leader.",
  },
  kanto_misty: {
    slug: "Misty",
    type: "Water",
    badge: "Cascade Badge",
    biome: "Lukewarm ocean",
    specialItem: "Cerulean Star",
    order: 2,
    tips: "Electric and Grass help. Craft Cerulean Star for her gym map (seagrass needs Shears).",
  },
  kanto_ltsurge: {
    slug: "Lt._Surge",
    type: "Electric",
    badge: "Thunder Badge",
    biome: "Savanna Plateau",
    specialItem: "Lieutenant Medal",
    order: 3,
    tips: "Ground types shine. Watch for speed and paralysis.",
  },
  kanto_erika: {
    slug: "Erika",
    type: "Grass",
    badge: "Rainbow Badge",
    biome: "Flower Forest",
    specialItem: "Nature Fan",
    order: 4,
    tips: "Fire, Flying, Ice, and Poison are strong options.",
  },
  kanto_koga: {
    slug: "Koga",
    type: "Poison",
    badge: "Soul Badge",
    biome: "Swamp",
    specialItem: "Ninja Poison",
    order: 5,
    tips: "Psychic and Ground help. Bring status cures.",
  },
  kanto_sabrina: {
    slug: "Sabrina",
    type: "Psychic",
    badge: "Marsh Badge",
    biome: "Dark Forest",
    specialItem: "Hypnotic Whip",
    order: 6,
    tips: "Dark, Bug, and Ghost pressure her team.",
  },
  kanto_blaine: {
    slug: "Blaine",
    type: "Fire",
    badge: "Volcano Badge",
    biome: "Crimson Forest",
    specialItem: "Cinnabar Glasses",
    order: 7,
    tips: "Water and Ground are reliable. Prepare for Nether-adjacent biomes.",
  },
  kanto_giovanni: {
    slug: "Giovanni",
    type: "Ground",
    badge: "Earth Badge",
    biome: "Deep Dark",
    specialItem: "Boss Ring",
    order: 8,
    tips: "Water, Grass, and Ice help. Deep Dark is dangerous — go prepared.",
  },
  kanto_league_lorelei: {
    slug: "Lorelei",
    type: "Ice",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Never-Melt Ice",
    order: 9,
    tips: "Fire, Fighting, Rock, and Steel help. Full heal between rooms.",
  },
  kanto_league_bruno: {
    slug: "Bruno",
    type: "Fighting",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Focus Band",
    order: 10,
    tips: "Flying, Psychic, and Fairy are strong answers.",
  },
  kanto_league_agatha: {
    slug: "Agatha",
    type: "Ghost",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Cleanse Tag",
    order: 11,
    tips: "Dark and Ghost pressure her. Watch for status.",
  },
  kanto_league_lance: {
    slug: "Lance",
    type: "Dragon",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Dragon Fang",
    order: 12,
    tips: "Ice and Dragon moves matter. Bring a balanced late-game team.",
  },
  kanto_champion_blue: {
    slug: "Blue",
    type: "Mixed",
    badge: "Champion",
    biome: "Top of Elite Four Tower",
    specialItem: "Rival Sling",
    order: 13,
    tips: "Cover many types. Unique drop notes mention Ancient Origin Ball on some packs.",
  },
};

/** Johto gym / E4 / Champion — RCT johto_* ids. Slugs avoid colliding with Kanto Koga/Bruno/Lance pages. */
const JOHTO_META = {
  johto_valerio: {
    slug: "Valerio",
    type: "Flying",
    badge: "Zephyr Badge",
    biome: "Windswept Hills",
    specialItem: "Raptor Bracer",
    order: 1,
    tips: "Electric, Rock, and Ice punish Flying. After Blue, grab the Johto Trainer Card before you hunt Valerio.",
  },
  johto_raffaello: {
    slug: "Raffaello",
    type: "Bug",
    badge: "Hive Badge",
    biome: "Sparse Jungle",
    specialItem: "Magnifying Glass",
    order: 2,
    tips: "Fire, Flying, and Rock hit Bug hard. Watch for Heracross / Scyther speed.",
  },
  johto_chiara: {
    slug: "Chiara",
    type: "Normal",
    badge: "Plain Badge",
    biome: "Cherry Grove",
    specialItem: "Sweet Milk",
    order: 3,
    tips: "Fighting answers Normal. Miltank / bulky Normals stall — bring status and Fighting coverage.",
  },
  johto_angelo: {
    slug: "Angelo",
    type: "Ghost",
    badge: "Fog Badge",
    biome: "Lush Cave",
    specialItem: "Spirit Scarf",
    order: 4,
    tips: "Dark and Ghost pressure Ghost. Light sources for the cave trip; don’t walk in half-healed.",
  },
  johto_furio: {
    slug: "Furio",
    type: "Fighting",
    badge: "Storm Badge",
    biome: "Desert",
    specialItem: "Heavy Dumbbell",
    order: 5,
    tips: "Flying, Psychic, and Fairy answer Fighting. Desert travel needs water / food / shade breaks.",
  },
  johto_jasmine: {
    slug: "Jasmine",
    type: "Steel",
    badge: "Mineral Badge",
    biome: "Taiga",
    specialItem: "Secret Medicine",
    order: 6,
    tips: "Fire, Fighting, and Ground crack Steel. Magnezone / Metagross hit hard — don’t send pure Water blindly.",
  },
  johto_alfredo: {
    slug: "Alfredo",
    type: "Ice",
    badge: "Glacier Badge",
    biome: "Ice Spikes",
    specialItem: "Winter Staff",
    order: 7,
    tips: "Fire, Fighting, Rock, and Steel help into Ice. Bring cold-weather food and a retreat waystone.",
  },
  johto_sandra: {
    slug: "Sandra",
    type: "Dragon",
    badge: "Rising Badge",
    biome: "Soul Sand Valley (Nether)",
    specialItem: "Pearl Choker",
    order: 8,
    tips: "Ice and Fairy punish Dragon. This gym tips toward the Nether — fire resist and a Nether waystone first.",
  },
  johto_league_pino: {
    slug: "Pino",
    type: "Psychic",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Power Lens",
    order: 9,
    tips: "Dark, Bug, and Ghost pressure Psychic. Full heal before every Johto Elite room.",
  },
  johto_league_koga: {
    slug: "Johto_Koga",
    type: "Poison",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Loaded Dice",
    order: 10,
    tips: "Psychic and Ground help into Poison. Not the same fight as Kanto Koga — check this page’s team.",
  },
  johto_league_bruno: {
    slug: "Johto_Bruno",
    type: "Fighting",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Muscle Band",
    order: 11,
    tips: "Flying, Psychic, and Fairy answer Fighting. Lucario / Hitmon line hit different than Kanto Bruno.",
  },
  johto_league_karen: {
    slug: "Karen",
    type: "Dark",
    badge: "Elite Four",
    biome: "Elite Four Tower (The End)",
    specialItem: "Razor Claw",
    order: 12,
    tips: "Fighting, Bug, and Fairy pressure Dark. Watch Weavile / Houndoom speed.",
  },
  johto_champion_lance: {
    slug: "Johto_Lance",
    type: "Dragon",
    badge: "Champion",
    biome: "Top of Elite Four Tower",
    specialItem: "Master Cape",
    order: 13,
    tips: "Ice and Fairy matter; Lugia as ace changes the endgame. Pack multiple win conditions.",
  },
};

/**
 * Hoenn gym / E4 / Champion — RCT hoenn_* ids.
 *
 * IMPORTANT — Tell/Alice type+badge+order swap vs. generate-ftb-quests.mjs:
 * The FTB quest generator (pokehaven-client-branding/scripts/generate-ftb-quests.mjs,
 * ~line 312-313) hardcodes order 6 = Tell/Flying/Feather Badge and order 7 =
 * Alice/Psychic/Mind Badge. That contradicts THREE independent real-data sources
 * that all agree with each other:
 *   1. hoenn_tell.json's actual team is 100% Psychic-type (Solrock, Lunatone,
 *      Gallade, Gardevoir, Claydol, Gothitelle); hoenn_alice.json's team is 100%
 *      Flying-type (Altaria, Tropius, Skarmory, Pelipper, Noctowl).
 *   2. The real mob-encounter requiredDefeats chain (rctmod/mobs/trainers/single/
 *      hoenn_{tell,alice}.json) requires hoenn_alice.json to require hoenn_norman,
 *      and hoenn_tell.json to require hoenn_alice — i.e. the game only lets you
 *      fight Alice after Norman, and Tell after Alice. Not the other way around.
 *   3. This repo's own scripts/advancement-copy.js already lists
 *      "trainer/hoenn/defeat_tell" as Mind Badge and "defeat_alice" as Feather
 *      Badge — matching (1) and (2), not the quest generator.
 * We follow (1)+(2)+(3) here (Alice = Flying/Feather Badge/order 6, Tell =
 * Psychic/Mind Badge/order 7) so the team table on each page actually matches
 * the type/badge shown in the header. Flagged for server-owner sign-off —
 * see wiki task final report.
 */
const HOENN_META = {
  hoenn_petra: {
    slug: "Petra",
    type: "Rock",
    badge: "Stone Badge",
    biome: "Rocky Mountains",
    specialItem: "Rock Tome",
    order: 1,
    tips: "Water, Grass, Fighting, and Ground answer Rock hard. Watch Thunder Punch / Flamethrower coverage on her Geodude.",
  },
  hoenn_rudi: {
    slug: "Rudi",
    type: "Fighting",
    badge: "Knuckle Badge",
    biome: "Yosemite Cliffs",
    specialItem: "Fighting Glove",
    order: 2,
    tips: "Flying, Psychic, and Fairy answer Fighting. This is a vertical map — bring blocks or a Flying mount for the ledges.",
  },
  hoenn_walter: {
    slug: "Walter",
    type: "Electric",
    badge: "Dynamo Badge",
    biome: "Arid Highlands",
    specialItem: "Electric Connector",
    order: 3,
    tips: "Ground shuts Electric down completely; Grass also resists. Dry biome — bring extra water and food for the hike.",
  },
  hoenn_fiammetta: {
    slug: "Fiammetta",
    type: "Fire",
    badge: "Heat Badge",
    biome: "Forested Highlands",
    specialItem: "Fire Lighter",
    order: 4,
    tips: "Water, Ground, and Rock are reliable into Fire. Don't walk in with a team still mono-Grass from earlier gyms.",
  },
  hoenn_norman: {
    slug: "Norman",
    type: "Normal",
    badge: "Balance Badge",
    biome: "Brushland",
    specialItem: "Normal Tablet",
    order: 5,
    tips: "Fighting is the cleanest answer to Normal; Ghost immunities help too. Bulky Normals can stall — bring status or a Fighting pivot.",
  },
  hoenn_alice: {
    slug: "Alice",
    type: "Flying",
    badge: "Feather Badge",
    biome: "Moonlight Grove",
    specialItem: "Flying Feather",
    order: 6,
    tips: "Electric, Rock, and Ice punish Flying hard. Dim biome — bring light sources and food for the trip.",
  },
  hoenn_tell: {
    slug: "Tell",
    type: "Psychic",
    badge: "Mind Badge",
    biome: "Amethyst Rainforest",
    specialItem: "Psychic Medallion",
    order: 7,
    tips: "Dark, Bug, and Ghost pressure Psychic — Dark-types ignore his STAB entirely. Dense biome, claim a rest stop near the gym.",
  },
  hoenn_adriano: {
    slug: "Adriano",
    type: "Water",
    badge: "Rain Badge",
    biome: "Cold Ocean",
    specialItem: "Water Rod",
    order: 8,
    tips: "Electric and Grass answer Water. Last Hoenn gym before the Elite Four — full heal and restock before the league gauntlet.",
  },
  hoenn_league_fosco: {
    slug: "Fosco",
    type: "Dark",
    badge: "Elite Four",
    biome: "Steppe (Hoenn league grounds)",
    specialItem: "Dark Bass",
    order: 9,
    tips: "Fighting, Bug, and Fairy pressure Dark. Full heal before every Hoenn Elite Four room — Fosco opens the gauntlet.",
  },
  hoenn_league_ester: {
    slug: "Ester",
    type: "Ghost",
    badge: "Elite Four",
    biome: "Steppe (Hoenn league grounds)",
    specialItem: "Ghost Bloom",
    order: 10,
    tips: "Dark and Ghost pressure Ghost back — watch immunities both ways. Restock between rooms.",
  },
  hoenn_league_frida: {
    slug: "Frida",
    type: "Ice",
    badge: "Elite Four",
    biome: "Steppe (Hoenn league grounds)",
    specialItem: "Ice Necklace",
    order: 11,
    tips: "Fire, Fighting, Rock, and Steel help into Ice. Third Elite room — heal fully after Ester, don't underlevel.",
  },
  hoenn_league_drake: {
    slug: "Drake",
    type: "Dragon",
    badge: "Elite Four",
    biome: "Steppe (Hoenn league grounds)",
    specialItem: "Dragon Cap",
    order: 12,
    tips: "Ice and Fairy punish Dragon hardest. Fourth Elite room — last wall before Champion Rocco.",
  },
  hoenn_champion_rocco: {
    slug: "Rocco",
    type: "Mixed",
    badge: "Champion",
    biome: "Steppe (Hoenn league grounds)",
    specialItem: "Steel Hat",
    order: 13,
    tips: "Mixed champion team headlined by box legendaries and weather-setters — pack answers for several types, not one gimmick.",
  },
};

/** Sinnoh gym / E4 / Champion — RCT sinnoh_* ids. Order/type/badge confirmed against the real requiredDefeats chain (no swaps found). */
const SINNOH_META = {
  sinnoh_pedro: {
    slug: "Pedro",
    type: "Rock",
    badge: "Coal Badge",
    biome: "Volcanic Peaks",
    specialItem: "Rock Casque",
    order: 1,
    tips: "Water, Grass, Fighting, and Ground answer Rock. Fire-resist gear helps near the vents on the way in.",
  },
  sinnoh_gardenia: {
    slug: "Gardenia",
    type: "Grass",
    badge: "Forest Badge",
    biome: "Blooming Valley",
    specialItem: "Grass Aroma",
    order: 2,
    tips: "Fire, Flying, Ice, Bug, and Poison pressure Grass. Sleep Powder / Stun Spore can stall — bring cleansers.",
  },
  sinnoh_marzia: {
    slug: "Marzia",
    type: "Fighting",
    badge: "Cobble Badge",
    biome: "Lush Desert",
    specialItem: "Fighting Bandage",
    order: 3,
    tips: "Flying, Psychic, and Fairy answer Fighting. Mixed biome — bring water and shade for the trip.",
  },
  sinnoh_omar: {
    slug: "Omar",
    type: "Water",
    badge: "Fen Badge",
    biome: "Beach",
    specialItem: "Water Mask",
    order: 4,
    tips: "Electric and Grass answer Water. Rain-setters can boost his team — Electric sweepers end this quickly.",
  },
  sinnoh_fannie: {
    slug: "Fannie",
    type: "Ghost",
    badge: "Relic Badge",
    biome: "Lavender Valley",
    specialItem: "Ghost Pendant",
    order: 5,
    tips: "Dark and Ghost pressure Ghost — watch immunities. Destiny Bond / Will-O-Wisp can flip a fight late.",
  },
  sinnoh_ferruccio: {
    slug: "Ferruccio",
    type: "Steel",
    badge: "Mine Badge",
    biome: "Volcanic Crater",
    specialItem: "Steel Spade",
    order: 6,
    tips: "Fire, Fighting, and Ground crack Steel. Skarmory / Steelix / Aggron wall physical hits — bring special or Fighting coverage.",
  },
  sinnoh_bianca: {
    slug: "Bianca",
    type: "Ice",
    badge: "Icicle Badge",
    biome: "Glacial Chasm",
    specialItem: "Ice Ribbon",
    order: 7,
    tips: "Fire, Fighting, Rock, and Steel help into Ice. Weavile / Mamoswine hit hard physically — don't walk in underleveled.",
  },
  sinnoh_corrado: {
    slug: "Corrado",
    type: "Electric",
    badge: "Beacon Badge",
    biome: "Shrubland",
    specialItem: "Electric Fuse",
    order: 8,
    tips: "Ground shuts Electric down completely. Last Sinnoh gym before the Elite Four — restock fully.",
  },
  sinnoh_league_aaron: {
    slug: "Aaron",
    type: "Bug",
    badge: "Elite Four",
    biome: "Desert Oasis (Sinnoh league grounds)",
    specialItem: "Bug Net",
    order: 9,
    tips: "Fire, Flying, and Rock pressure Bug. Full heal before every Sinnoh Elite Four room — Aaron opens the gauntlet.",
  },
  sinnoh_league_terrie: {
    slug: "Terrie",
    type: "Ground",
    badge: "Elite Four",
    biome: "Desert Oasis (Sinnoh league grounds)",
    specialItem: "Ground Shawl",
    order: 10,
    tips: "Water, Grass, and Ice answer Ground — Electric does nothing here. Restock after Aaron.",
  },
  sinnoh_league_vulcano: {
    slug: "Vulcano",
    type: "Fire",
    badge: "Elite Four",
    biome: "Desert Oasis (Sinnoh league grounds)",
    specialItem: "Fire Flint",
    order: 11,
    tips: "Water, Ground, and Rock are reliable into Fire. Third Elite room — heal fully after Terrie.",
  },
  sinnoh_league_luciano: {
    slug: "Luciano",
    type: "Psychic",
    badge: "Elite Four",
    biome: "Desert Oasis (Sinnoh league grounds)",
    specialItem: "Psychic Volume",
    order: 12,
    tips: "Dark, Bug, and Ghost pressure Psychic — keep a Dark-type on the team. Fourth room, last wall before Camilla.",
  },
  sinnoh_champion_camilla: {
    slug: "Camilla",
    type: "Mixed",
    badge: "Champion",
    biome: "Desert Oasis (Sinnoh league grounds)",
    specialItem: "Draconic Fin",
    order: 13,
    tips: "Mixed champion team — pack answers for several types, not one gimmick. The final champion of the current gym line.",
  },
};

function parseTrainerFile(filePath, id) {
  const data = readJson(filePath);
  const name =
    data.name?.literal ||
    data.name?.translate ||
    itemLabel(id.replace(/^kanto_/, "").replace(/^johto_/, "").replace(/^hoenn_/, "").replace(/^sinnoh_/, ""));
  const team = (data.team || []).map((mon, idx) => ({
    slot: idx + 1,
    species: mon.species,
    level: mon.level,
    ability: mon.ability || "—",
    nature: mon.nature || "—",
    gender: mon.gender || "—",
    heldItem: Array.isArray(mon.heldItem)
      ? mon.heldItem.map(itemLabel).join(", ")
      : mon.heldItem
        ? itemLabel(mon.heldItem)
        : "—",
    moves: mon.moveset || mon.moves || [],
  }));
  const bag = (data.bag || []).map((b) => `${itemLabel(b.item)} x${b.quantity ?? 1}`);
  return { id, name, team, bag, rawName: data.name };
}

function parseTrainers() {
  const dir = path.join(RCT, "data", "rctmod", "trainers");
  const all = [];
  if (!fs.existsSync(dir))
    return { kantoLeaders: [], johtoLeaders: [], hoennLeaders: [], sinnohLeaders: [], all: [] };

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const id = file.replace(/\.json$/, "");
    const parsed = parseTrainerFile(path.join(dir, file), id);
    const region = id.startsWith("kanto_")
      ? "kanto"
      : id.startsWith("johto_")
        ? "johto"
        : id.startsWith("hoenn_")
          ? "hoenn"
          : id.startsWith("sinnoh_")
            ? "sinnoh"
            : id.startsWith("hisui_")
              ? "hisui"
              : id.startsWith("team_")
                ? "team"
                : "other";
    all.push({ ...parsed, region, file });
  }

  function leadersFromMeta(meta) {
    return Object.entries(meta)
      .map(([id, m]) => {
        const t = all.find((x) => x.id === id);
        if (!t) return null;
        return { ...t, ...m };
      })
      .filter(Boolean)
      .sort((a, b) => a.order - b.order);
  }

  return {
    kantoLeaders: leadersFromMeta(KANTO_META),
    johtoLeaders: leadersFromMeta(JOHTO_META),
    hoennLeaders: leadersFromMeta(HOENN_META),
    sinnohLeaders: leadersFromMeta(SINNOH_META),
    all: all.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function parseSpawns() {
  const dir = path.join(MAIN_DP, "data", "cobblemon", "spawn_pool_world");
  const rows = [];
  if (!fs.existsSync(dir)) return rows;

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    try {
      const data = readJson(path.join(dir, file));
      if (!data.enabled && data.enabled !== undefined) continue;
      for (const spawn of data.spawns || []) {
        const biomes = spawn.condition?.biomes || [];
        rows.push({
          id: spawn.id || file,
          pokemon: spawn.pokemon || path.basename(file, ".json"),
          bucket: spawn.bucket || "—",
          level: spawn.level || "—",
          weight: spawn.weight ?? null,
          biomes: biomes.map(String),
          position: spawn.spawnablePositionType || spawn.context || "—",
        });
      }
    } catch {
      // skip bad files
    }
  }
  return rows;
}

function parseCoreRates() {
  const mainPath = path.join(CONFIG, "cobblemon", "main.json");
  const main = fs.existsSync(mainPath) ? readJson(mainPath) : {};
  const megaPath = path.join(CONFIG, "mega_showdown", "config.json");
  const mega = fs.existsSync(megaPath) ? readJson(megaPath) : {};
  let breeding = {};
  const breedDir = path.join(CONFIG, "cobbreeding");
  if (fs.existsSync(breedDir)) {
    const f = fs.readdirSync(breedDir).find((x) => x.endsWith(".json") || x.endsWith(".json5"));
    if (f) {
      breeding = f.endsWith("5")
        ? readJson5(path.join(breedDir, f))
        : readJson(path.join(breedDir, f));
    }
  }
  return { cobblemon: main, mega, breeding };
}

const TRAINER_ADV_SLUGS = {
  defeat_brock: "Brock",
  defeat_misty: "Misty",
  defeat_ltsurge: "Lt._Surge",
  defeat_erika: "Erika",
  defeat_koga: "Koga",
  defeat_sabrina: "Sabrina",
  defeat_blaine: "Blaine",
  defeat_giovanni: "Giovanni",
  defeat_elite_lorelei: "Lorelei",
  defeat_elite_bruno: "Bruno",
  defeat_elite_agatha: "Agatha",
  defeat_elite_lance: "Lance",
  defeat_champion_blue: "Blue",
};

function walkJsonFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJsonFiles(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function summarizeCriteria(criteria = {}) {
  const bits = [];
  for (const [key, c] of Object.entries(criteria)) {
    const trigger = c.trigger || "";
    const cond = c.conditions || {};
    if (cond.trainer_ids?.length) {
      bits.push(`Defeat trainer (${cond.trainer_ids.join(", ")})`);
    } else if (cond.species) {
      const species = itemLabel(cond.species);
      const aspects = (cond.aspects || []).join(", ");
      bits.push(aspects ? `Catch/collect ${species} (${aspects})` : `Catch/collect ${species}`);
    } else if (cond.items?.length) {
      const items = cond.items
        .flatMap((i) => (Array.isArray(i.items) ? i.items : [i.items || i.item]))
        .filter(Boolean)
        .map(itemLabel);
      bits.push(`Obtain ${items.join(", ")}`);
    } else if (trigger.includes("pick_starter")) {
      bits.push("Pick a starter");
    } else if (trigger.includes("tick")) {
      bits.push("Join / play (automatic)");
    } else if (trigger.includes("resurrect")) {
      bits.push(`Revive ${itemLabel(cond.species || key)}`);
    } else {
      bits.push(key.replace(/_/g, " "));
    }
  }
  return bits.join("; ") || "—";
}

function cobbleverseGroup(relId, fileBase) {
  if (fileBase === "root" || /^gen_\d+$/.test(fileBase)) return "start";
  // Paths are relative (e.g. "trainer/kanto/defeat_brock") — no leading slash
  const region = relId.match(/trainer\/(kanto|johto|hoenn|sinnoh)\//)?.[1];
  if (region) {
    if (fileBase.startsWith("defeat_elite_") || fileBase.startsWith("defeat_champion_")) {
      return region === "kanto" ? "elite" : `${region}_elite`;
    }
    if (fileBase.startsWith("defeat_")) {
      return region === "kanto" ? "kanto_gym" : `${region}_gym`;
    }
  }
  if (fileBase.startsWith("defeat_elite_") || fileBase === "defeat_champion_blue") {
    return "elite";
  }
  if (fileBase.startsWith("defeat_")) return "kanto_gym";
  if (relId.startsWith("item/") || relId.includes("/item/")) return "postgame_item";
  if (fileBase.endsWith("_shiny")) return "shiny";
  if (relId.startsWith("pokemon/") || relId.includes("/pokemon/")) return "legendary";
  return "other";
}

function cobblemonGroup(relId, fileBase) {
  if (fileBase === "root") return "root";
  // Pack datapack sometimes places Cobblemon overrides at the namespace root
  const agriRoot = new Set([
    "any_plant",
    "obtain_berry",
    "obtain_all_berries",
    "harvest_apricorn",
    "root_agriculture",
  ]);
  const catchRoot = new Set(["craft_poke_ball", "craft_pokedex", "root_catching"]);
  if (relId.startsWith("agriculture/") || agriRoot.has(fileBase)) return "agriculture";
  if (relId.startsWith("battle/") || fileBase.startsWith("root_battle")) return "battle";
  if (relId.startsWith("catching/") || catchRoot.has(fileBase)) return "catching";
  if (relId.startsWith("geological/") || fileBase.startsWith("root_geological")) return "geological";
  return "other";
}

function loadCobblemonLang() {
  const langPath = path.join(ROOT, "_external", "cobblemon-advancement", "_en_us.json");
  if (!fs.existsSync(langPath)) return {};
  try {
    return readJson(langPath);
  } catch {
    return {};
  }
}

function loadPokehavenLang() {
  const langPath = path.join(POKEHAVEN_DP, "assets", "cobbleverse", "lang", "en_us.json");
  if (!fs.existsSync(langPath)) return {};
  try {
    return readJson(langPath);
  } catch {
    return {};
  }
}

function parseNamespaceAdvancements({
  rootDir,
  namespace,
  groupFn,
  lang = {},
  skipFileNames = new Set(["_en_us.json"]),
}) {
  const files = walkJsonFiles(rootDir).filter((f) => !skipFileNames.has(path.basename(f)));
  const list = [];

  for (const file of files) {
    let data;
    try {
      data = readJson(file);
    } catch {
      continue;
    }
    // Skip recipe-book unlock stubs (no display)
    if (!data.display) continue;

    const rel = path.relative(rootDir, file).replace(/\\/g, "/").replace(/\.json$/, "");
    const id = `${namespace}:${rel}`;
    const fileBase = path.basename(rel);
    const display = data.display || {};
    const icon = display.icon?.id || display.icon?.item || null;
    const titleKey = display.title?.translate || null;
    const descriptionKey = display.description?.translate || null;
    const titleEn =
      display.title?.text || (titleKey && lang[titleKey]) || itemLabel(fileBase);
    const descriptionEn =
      display.description?.text ||
      (descriptionKey && lang[descriptionKey]) ||
      summarizeCriteria(data.criteria);

    list.push({
      id,
      namespace,
      path: rel,
      file: fileBase,
      parent: data.parent || null,
      category: rel.includes("/") ? rel.split("/")[0] : "meta",
      group: groupFn(rel, fileBase),
      frame: display.frame || "task",
      hidden: !!display.hidden,
      icon,
      iconLabel: itemLabel(icon),
      criteriaSummary: summarizeCriteria(data.criteria),
      leaderSlug: namespace === "cobbleverse" ? TRAINER_ADV_SLUGS[fileBase] || null : null,
      rewardFunction: data.rewards?.function || null,
      titleKey,
      descriptionKey,
      titleEn,
      descriptionEn,
    });
  }
  return list;
}

function parseAdvancements() {
  const lang = loadCobblemonLang();
  const cvRoot = path.join(MAIN_DP, "data", "cobbleverse", "advancement");
  const cvPokehaven = path.join(POKEHAVEN_DP, "data", "cobbleverse", "advancement");
  const cmExternal = path.join(ROOT, "_external", "cobblemon-advancement");
  // Pack overrides for a few Cobblemon advancements (e.g. starter_pack reward on root)
  const cmDp = path.join(MAIN_DP, "data", "cobblemon", "advancement");

  const cvByPath = new Map();
  for (const a of parseNamespaceAdvancements({
    rootDir: cvRoot,
    namespace: "cobbleverse",
    groupFn: cobbleverseGroup,
  })) {
    cvByPath.set(a.path, a);
  }
  // PokeHaven EU overlay: Johto / Hoenn / Sinnoh toast trees (+ any future CV overrides)
  if (fs.existsSync(cvPokehaven)) {
    for (const a of parseNamespaceAdvancements({
      rootDir: cvPokehaven,
      namespace: "cobbleverse",
      groupFn: cobbleverseGroup,
    })) {
      cvByPath.set(a.path, a);
    }
  }
  // Re-parse overlay with PokeHaven lang so translate keys resolve for wiki titles
  const phLang = { ...loadPokehavenLang() };
  if (fs.existsSync(cvPokehaven) && Object.keys(phLang).length) {
    for (const a of parseNamespaceAdvancements({
      rootDir: cvPokehaven,
      namespace: "cobbleverse",
      groupFn: cobbleverseGroup,
      lang: phLang,
    })) {
      cvByPath.set(a.path, a);
    }
  }
  const cobbleverse = [...cvByPath.values()];

  // Prefer external Cobblemon tree; overlay DP files by path
  const byPath = new Map();
  if (fs.existsSync(cmExternal)) {
    for (const a of parseNamespaceAdvancements({
      rootDir: cmExternal,
      namespace: "cobblemon",
      groupFn: cobblemonGroup,
      lang,
    })) {
      byPath.set(a.path, a);
    }
  }
  if (fs.existsSync(cmDp)) {
    for (const a of parseNamespaceAdvancements({
      rootDir: cmDp,
      namespace: "cobblemon",
      groupFn: cobblemonGroup,
      lang,
    })) {
      const prev = byPath.get(a.path);
      byPath.set(a.path, prev ? { ...prev, ...a, titleEn: a.titleEn || prev.titleEn, descriptionEn: a.descriptionEn || prev.descriptionEn } : a);
    }
  }
  const cobblemon = [...byPath.values()];

  const cvOrder = {
    start: 0,
    kanto_gym: 1,
    elite: 2,
    johto_gym: 3,
    johto_elite: 4,
    hoenn_gym: 5,
    hoenn_elite: 6,
    sinnoh_gym: 7,
    sinnoh_elite: 8,
    postgame_item: 9,
    legendary: 10,
    shiny: 11,
    other: 12,
  };
  cobbleverse.sort((a, b) => (cvOrder[a.group] ?? 99) - (cvOrder[b.group] ?? 99) || a.path.localeCompare(b.path));
  const cmOrder = { root: 0, catching: 1, agriculture: 2, geological: 3, battle: 4, other: 5 };
  cobblemon.sort((a, b) => (cmOrder[a.group] ?? 9) - (cmOrder[b.group] ?? 9) || a.path.localeCompare(b.path));

  const group = (list, key) => list.filter((a) => a.group === key);
  const cvGroups = {
    start: group(cobbleverse, "start"),
    kanto_gym: group(cobbleverse, "kanto_gym"),
    elite: group(cobbleverse, "elite"),
    johto_gym: group(cobbleverse, "johto_gym"),
    johto_elite: group(cobbleverse, "johto_elite"),
    hoenn_gym: group(cobbleverse, "hoenn_gym"),
    hoenn_elite: group(cobbleverse, "hoenn_elite"),
    sinnoh_gym: group(cobbleverse, "sinnoh_gym"),
    sinnoh_elite: group(cobbleverse, "sinnoh_elite"),
    postgame_item: group(cobbleverse, "postgame_item"),
    legendary: group(cobbleverse, "legendary"),
    shiny: group(cobbleverse, "shiny"),
  };

  return {
    count: cobbleverse.length + cobblemon.length,
    cobbleverse: {
      count: cobbleverse.length,
      groups: cvGroups,
      all: cobbleverse,
    },
    cobblemon: {
      count: cobblemon.length,
      groups: {
        root: group(cobblemon, "root"),
        catching: group(cobblemon, "catching"),
        agriculture: group(cobblemon, "agriculture"),
        geological: group(cobblemon, "geological"),
        battle: group(cobblemon, "battle"),
        other: group(cobblemon, "other"),
      },
      all: cobblemon,
    },
    // Back-compat for older page code that expected top-level groups
    groups: cvGroups,
    all: [...cobbleverse, ...cobblemon],
  };
}

fs.mkdirSync(OUT, { recursive: true });

const economy = parseEconomy();
const raids = parseRaids();
const trainers = parseTrainers();
const spawns = parseSpawns();
const rates = parseCoreRates();
const advancements = parseAdvancements();

fs.writeFileSync(path.join(OUT, "economy.json"), JSON.stringify(economy, null, 2));
fs.writeFileSync(path.join(OUT, "raids.json"), JSON.stringify(raids, null, 2));
fs.writeFileSync(path.join(OUT, "trainers.json"), JSON.stringify(trainers, null, 2));
fs.writeFileSync(path.join(OUT, "spawns.json"), JSON.stringify(spawns, null, 2));
fs.writeFileSync(path.join(OUT, "rates.json"), JSON.stringify(rates, null, 2));
fs.writeFileSync(path.join(OUT, "advancements.json"), JSON.stringify(advancements, null, 2));

console.log(`Parsed economy shop sections=${economy.shop.length} bank=${economy.bank.length}`);
console.log(`Parsed raid tiers=${raids.tiers.length} bosses=${raids.bosses.length}`);
console.log(
  `Parsed trainers=${trainers.all.length} kanto=${trainers.kantoLeaders.length} johto=${trainers.johtoLeaders.length} hoenn=${trainers.hoennLeaders.length} sinnoh=${trainers.sinnohLeaders.length}`
);
console.log(`Parsed spawn rows=${spawns.length}`);
console.log(`Parsed advancements=${advancements.count}`);
