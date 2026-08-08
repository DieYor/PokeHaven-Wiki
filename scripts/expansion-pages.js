import { figure, guideImg } from "./deep-pages.js";
import { critical } from "./i18n.js";

export function registerExpansionPages({
  writePage,
  navboxSystems,
  navboxMinecraft,
  navboxGyms,
  recipesMeta,
  trainers,
}) {
  const nsOptions = (recipesMeta.namespaces || [])
    .map((ns) => `<option value="${ns}">${ns} (${recipesMeta.byNamespace[ns]})</option>`)
    .join("");

  writePage("Recipe_Browser.html", {
    title: "Recipe browser",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Recipe browser", href: "Recipe_Browser.html" },
    ],
    lede: `Search <strong>${recipesMeta.count || 0}</strong> recipes parsed from CobbleVerse datapacks (TMs, LumyMon, cuisine, …). Cobblemon core ball recipes are also covered in <a href="Essential_Recipes.html">Essential recipes</a> because those live in mod JARs, not this datapack dump.`,
    body: `
    <div class="callout tip">
      <div class="label">How to use</div>
      Filter by name or ingredient. Click a row to expand the crafting grid when the recipe is shaped.
      In-game REI (<kbd>E</kbd>) remains the live authority if a pack update changes a craft.
    </div>

    <div class="filter-bar">
      <input id="rec-q" type="search" placeholder="Result or ingredient…" style="min-width:200px;flex:1" />
      <select id="rec-ns">
        <option value="">All namespaces</option>
        ${nsOptions}
      </select>
    </div>
    <p class="muted" id="rec-count"></p>
    <div id="rec-results"></div>

    <script type="module">
    const res = await fetch('../data/recipes-lite.json');
    const RECIPES = await res.json();

    function gridHtml(r) {
      if (!r.pat || !r.keys) return '<p class="muted">Shapeless / special — ingredients: '+(r.il||[]).join(', ')+'</p>';
      const rows = r.pat.map(row => {
        const cells = [...row.padEnd(3,' ')].slice(0,3).map(ch => {
          if (ch === ' ') return '<div class="r-cell empty"></div>';
          const k = r.keys[ch];
          const label = k ? (k.label || k.id || ch) : ch;
          return '<div class="r-cell" title="'+(k&&k.id?k.id:'')+'">'+label+'</div>';
        }).join('');
        return '<div class="r-row">'+cells+'</div>';
      }).join('');
      return '<div class="r-grid">'+rows+'</div><p class="muted">→ <strong>'+r.rl+'</strong>'+(r.n>1?' ×'+r.n:'')+'</p>';
    }

    function render() {
      const q = document.getElementById('rec-q').value.toLowerCase().trim();
      const ns = document.getElementById('rec-ns').value;
      const hits = RECIPES.filter(r => {
        if (ns && r.ns !== ns) return false;
        if (!q) return true;
        const blob = (r.rl+' '+r.res+' '+r.id+' '+(r.il||[]).join(' ')+(r.ing||[]).join(' ')).toLowerCase();
        return blob.includes(q);
      }).slice(0, 150);

      document.getElementById('rec-count').textContent = 'Showing '+hits.length+' match(es) (max 150).';
      document.getElementById('rec-results').innerHTML = hits.map((r,i) =>
        '<details class="rec-card"><summary><strong>'+r.rl+'</strong> <span class="muted">'+r.ns+' · '+r.t+' · <code>'+r.id+'</code></span></summary>'+
        '<div class="rec-body">'+gridHtml(r)+
        '<p><strong>Ingredients:</strong> '+((r.il&&r.il.length)?r.il.join(', '):'—')+'</p></div></details>'
      ).join('') || '<p>No matches.</p>';
    }
    document.getElementById('rec-q').addEventListener('input', render);
    document.getElementById('rec-ns').addEventListener('change', render);
    render();
    </script>

    <p class="see-also"><strong>See also:</strong> <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Minecraft_Hub.html">Minecraft hub</a></p>
    ${navboxSystems()}
    `,
  });

  writePage("Essential_Recipes.html", {
    title: "Essential recipes",
    breadcrumbs: [
      { label: "Main Page", href: "../index.html" },
      { label: "Essential recipes", href: "Essential_Recipes.html" },
    ],
    lede: "The crafts every PokeHaven trainer needs in week one. Use REI (<kbd>E</kbd>) for exact grids — screenshots show the workflow.",
    infobox: `<div class="infobox-title">Essentials</div>
    <table>
      <tr><th>Lookup</th><td>Inventory → recipe search</td></tr>
      <tr><th>Balls</th><td>Apricorns + metal</td></tr>
      <tr><th>Maps</th><td>Empty Map + special item</td></tr>
      <tr><th>Database</th><td><a href="Recipe_Browser.html">Recipe browser</a></td></tr>
    </table>`,
    body: `
    <h2>How to look up any craft</h2>
    <ol class="steps">
      <li>Press <kbd>E</kbd>.</li>
      <li>Use the side recipe list search (REI).</li>
      <li>Type the item name (e.g. <em>great ball</em>, <em>shears</em>, <em>kanto</em>).</li>
      <li>Click the result to pin the pattern on the grid.</li>
    </ol>
    ${figure(
      guideImg("rei-crafting.png"),
      "<strong>REI workflow.</strong> Search → click result → place items on the highlighted grid. Always trust the live recipe over memory.",
      "REI recipe search in inventory"
    )}

    <h2>Poké Balls</h2>
    ${figure(
      guideImg("pokeball-craft.png"),
      "<strong>Poké Ball craft workflow.</strong> Search the ball name, then place apricorns + core.",
      "Crafting Poké Balls"
    )}
    <table class="wikitable">
      <thead><tr><th>Result</th><th>Core</th><th>Apricorns (typical)</th></tr></thead>
      <tbody>
        <tr><td>Poké Ball</td><td>Copper ingot</td><td>4× red</td></tr>
        <tr><td>Great Ball</td><td>Iron ingot</td><td>Red + blue mix</td></tr>
        <tr><td>Ultra Ball</td><td>Gold ingot</td><td>Black + yellow mix</td></tr>
      </tbody>
    </table>
    <p>Full guide: <a href="Poke_Balls.html">Poké Balls</a>. Harvest trees:</p>
    ${figure(
      guideImg("apricorns.png"),
      "<strong>Apricorns.</strong> Right-click fruit; plant seeds at your claim.",
      "Apricorn tree"
    )}

    <h2>Early Minecraft toolkit</h2>
    <table class="wikitable">
      <thead><tr><th>Item</th><th>Why</th><th>REI search</th></tr></thead>
      <tbody>
        <tr><td>Crafting table</td><td>Everything</td><td><code>crafting table</code></td></tr>
        <tr><td>Stone pickaxe</td><td>Iron + copper</td><td><code>stone pickaxe</code></td></tr>
        <tr><td>Furnace</td><td>Smelt ores/food</td><td><code>furnace</code></td></tr>
        <tr><td>Shears</td><td>Seagrass for Misty map item</td><td><code>shears</code></td></tr>
        <tr><td>Bed</td><td>Respawn</td><td><code>bed</code> + wool colour</td></tr>
        <tr><td>Empty Map</td><td>Gym maps</td><td><code>empty map</code></td></tr>
        <tr><td>Shield</td><td>Creeper / brute safety</td><td><code>shield</code></td></tr>
      </tbody>
    </table>

    <h2>Gym map crafts</h2>
    ${figure(
      guideImg("cartography-maps.png"),
      "<strong>Map tooling.</strong> After Brock, Empty Map + special items on the Kanto Cartography Table are your GPS. Details: <a href='Gym_Maps.html'>Gym maps</a>.",
      "Cartography / map crafting context"
    )}
    <ol class="steps">
      <li>Craft <strong>Kanto Cartography Table</strong> (REI: <em>kanto</em> / <em>cartography</em>).</li>
      <li>Craft the leader’s special item (e.g. Misty → Cerulean Star).</li>
      <li>Craft Empty Map.</li>
      <li>Combine on the Kanto Cartography Table.</li>
    </ol>
    ${critical(
      "en",
      "<strong>Do not right-click the Empty Map in the world first.</strong> That ruins it for gym crafting."
    )}
    <p>Walkthrough: <a href="Gym_Maps.html">Gym maps</a> · Villager method: <a href="Villages_and_Trading.html">Villages</a>.</p>

    <h2>Healing &amp; convenience</h2>
    <ul>
      <li>Potions / Revives — craft, loot Centers, or buy (<a href="Economy.html">Economy</a>).</li>
      <li>Oran Berries — early free healing.</li>
      <li>Waystones — craft/find and activate (<a href="Travel.html">Travel</a>).</li>
      <li>PC access — <code>/pc</code> (<a href="Healing_and_Storage.html">Healing &amp; storage</a>).</li>
    </ul>

    <h2>Datapack recipe database</h2>
    <p>${recipesMeta.count} pack recipes (mostly TMs via <code>tmcraft</code>, plus LumyMon / furniture / cuisine) live in the <a href="Recipe_Browser.html">Recipe browser</a>.</p>
    <div class="callout tip">
      <div class="label">Missing Cobblemon JAR crafts?</div>
      Balls and many Cobblemon machines are inside mod JARs. Re-install the CurseForge instance locally if you want those auto-parsed later; until then this essentials page + REI cover beginners.
    </div>

    ${navboxMinecraft()}
    ${navboxSystems()}
    `,
  });

  // Region overviews
  function regionPage(name, file, prefix, blurb, tips) {
    const list = trainers.all.filter((t) => t.region === prefix);
    const named = list
      .filter((t) => !t.id.includes("groups"))
      .slice(0, 40)
      .map(
        (t) =>
          `<tr><td>${t.name}</td><td><code>${t.id}</code></td><td>${t.team.length}</td><td>${t.team.map((m) => m.level).join(", ")}</td></tr>`
      )
      .join("");

    writePage(file, {
      title: `${name} overview`,
      breadcrumbs: [
        { label: "Main Page", href: "../index.html" },
        { label: `${name} overview`, href: file },
      ],
      lede: blurb,
      body: `
      <h2>When you unlock it</h2>
      <p>${tips.unlock}</p>

      <h2>What to prepare</h2>
      <ul>${tips.prep.map((x) => `<li>${x}</li>`).join("")}</ul>

      <h2>Named trainers in pack data (${list.length})</h2>
      <p class="muted">Sample of trainers tagged <code>${prefix}</code> in the RCT datapack. Full search: <a href="Trainer_Index.html">Trainer index</a>.</p>
      <table class="wikitable">
        <thead><tr><th>Name</th><th>ID</th><th>Party</th><th>Levels</th></tr></thead>
        <tbody>${named || "<tr><td colspan=4>No trainers parsed for this region prefix.</td></tr>"}</tbody>
      </table>

      <p class="see-also"><strong>See also:</strong> <a href="Progression.html">Progression</a> · <a href="Gyms_Kanto.html">Kanto gyms</a> · <a href="Trainer_Index.html">Trainer index</a></p>
      ${navboxGyms()}
      `,
    });
  }

  regionPage(
    "Johto",
    "Gyms_Johto.html",
    "johto",
    "Johto opens after you finish the Kanto challenge. Use this overview to plan coverage and scout named trainers from pack data.",
    {
      unlock: "Complete Kanto gyms + Elite Four + Champion (Blue), then continue into Johto content.",
      prep: [
        "Stable waystone network from Kanto hubs",
        "Money buffer for balls/heals (income is ×0.5)",
        "Broader type coverage than early Kanto",
        "Claimed home base you can teleport back to",
      ],
    }
  );

  regionPage(
    "Hoenn",
    "Gyms_Hoenn.html",
    "hoenn",
    "Hoenn is the mid/late adventure step after Johto. Pack data includes Hoenn leaders and Team Aqua/Magma adjacent trainers.",
    {
      unlock: "After Johto Champion progression (follow in-game series unlocks / Trainer Card).",
      prep: [
        "Water/Surf-capable mounts help a lot",
        "Stock Ultra Balls and status heals",
        "Nether comfort if you still farm there for gear",
      ],
    }
  );

  regionPage(
    "Sinnoh",
    "Gyms_Sinnoh.html",
    "sinnoh",
    "Sinnoh is late-game CobbleVerse content — tougher teams and longer routes.",
    {
      unlock: "After Hoenn Champion progression.",
      prep: [
        "Near-complete coverage team in the PC",
        "Raid experience for cash/items",
        "Do not under-level into league content",
      ],
    }
  );
}
