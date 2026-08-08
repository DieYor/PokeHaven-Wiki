import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PACK = path.resolve(ROOT, "..", "_pack_analysis");
const PEEK = path.join(PACK, "_dp_peek");
const OUT = path.join(ROOT, "data");

function itemLabel(id) {
  if (!id) return "—";
  const raw = String(id);
  const name = raw.includes(":") ? raw.split(":")[1] : raw;
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ingredientId(ing) {
  if (!ing) return null;
  if (typeof ing === "string") return ing;
  if (ing.item) return ing.item;
  if (ing.id) return ing.id;
  if (ing.tag) return `#${String(ing.tag).replace(/^#/, "")}`;
  if (Array.isArray(ing)) return ingredientId(ing[0]);
  return null;
}

function findRecipeDirs(dataRoot) {
  const dirs = [];
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (!ent.isDirectory()) continue;
      if (ent.name === "recipe" || ent.name === "recipes") dirs.push(full);
      else walk(full);
    }
  }
  walk(dataRoot);
  return dirs;
}

function collectJsonFiles(dir) {
  const out = [];
  function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".json")) out.push(full);
    }
  }
  walk(dir);
  return out;
}

function parseRecipeFile(filePath, namespaceHint) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;

  const type = data.type || "unknown";
  const resultObj = data.result || data.results?.[0] || {};
  const resultId =
    typeof resultObj === "string"
      ? resultObj
      : resultObj.id || resultObj.item || null;

  const ns =
    namespaceHint ||
    (resultId && resultId.includes(":") ? resultId.split(":")[0] : "unknown");

  const fileId = path.basename(filePath, ".json");
  const base = {
    id: `${ns}:${fileId}`,
    file: fileId,
    namespace: ns,
    type,
    result: resultId || `${ns}:${fileId}`,
    resultLabel: itemLabel(resultId || fileId),
    count: resultObj.count || 1,
    ingredients: [],
    pattern: null,
    keys: null,
    experience: data.experience ?? null,
    cookingtime: data.cookingtime ?? data.cookingTime ?? null,
  };

  if (data.pattern) {
    base.pattern = data.pattern;
    base.keys = {};
    for (const [k, v] of Object.entries(data.key || {})) {
      const iid = ingredientId(v);
      base.keys[k] = { id: iid, label: itemLabel(iid) };
      if (iid) base.ingredients.push(iid);
    }
  } else if (data.ingredients) {
    for (const ing of data.ingredients) {
      const iid = ingredientId(ing);
      if (iid) base.ingredients.push(iid);
    }
  } else if (data.ingredient) {
    const iid = ingredientId(data.ingredient);
    if (iid) base.ingredients.push(iid);
  }

  base.ingredients = [...new Set(base.ingredients)];
  base.ingredientLabels = base.ingredients.map(itemLabel);
  return base;
}

function collectFromPeek() {
  const recipes = [];
  if (!fs.existsSync(PEEK)) {
    console.warn("Missing _dp_peek — no recipes parsed");
    return recipes;
  }

  for (const packName of fs.readdirSync(PEEK)) {
    const packRoot = path.join(PEEK, packName);
    if (!fs.statSync(packRoot).isDirectory()) continue;
    const dataRoot = path.join(packRoot, "data");
    if (!fs.existsSync(dataRoot)) continue;

    for (const recipeDir of findRecipeDirs(dataRoot)) {
      const ns = path.basename(path.dirname(recipeDir));
      for (const file of collectJsonFiles(recipeDir)) {
        const parsed = parseRecipeFile(file, ns);
        if (parsed) {
          parsed.pack = packName;
          recipes.push(parsed);
        }
      }
    }
  }

  const map = new Map();
  for (const r of recipes) {
    if (!map.has(r.id)) map.set(r.id, r);
  }
  return [...map.values()].sort((a, b) =>
    a.resultLabel.localeCompare(b.resultLabel)
  );
}

fs.mkdirSync(OUT, { recursive: true });
const recipes = collectFromPeek();
fs.writeFileSync(path.join(OUT, "recipes.json"), JSON.stringify(recipes, null, 2));

const lite = recipes.map((r) => ({
  id: r.id,
  ns: r.namespace,
  t: String(r.type).replace("minecraft:", ""),
  res: r.result,
  rl: r.resultLabel,
  ing: r.ingredients,
  il: r.ingredientLabels,
  pat: r.pattern,
  keys: r.keys,
  n: r.count,
}));
fs.writeFileSync(path.join(OUT, "recipes-lite.json"), JSON.stringify(lite));

const namespaces = [...new Set(recipes.map((r) => r.namespace))].sort();
fs.writeFileSync(
  path.join(OUT, "recipes-meta.json"),
  JSON.stringify(
    {
      count: recipes.length,
      namespaces,
      byNamespace: Object.fromEntries(
        namespaces.map((ns) => [
          ns,
          recipes.filter((r) => r.namespace === ns).length,
        ])
      ),
    },
    null,
    2
  )
);

console.log(`Parsed recipes=${recipes.length} namespaces=${namespaces.length}`);
