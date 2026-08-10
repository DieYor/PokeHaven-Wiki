# PokeHaven EU Wiki

All-in-one static player wiki (OSRS-wiki style, CobbleVerse look) for **PokeHaven EU** / CobbleVerse 1.7.42.

Includes gym guides, Minecraft survival pages, essential crafts, and a datapack **recipe browser**.

English at the site root; Dutch at `nl/`. Use the 🇬🇧 / 🇳🇱 flags in the header to switch.

## Open locally
Open `index.html` (EN) or `nl/index.html` (NL) in a browser.  
Search works offline (embedded `js/search-data-*.js`).

For Recipe Browser / Spawn Lookup, serve the folder:

```powershell
cd d:\COBBLEVERSE\PokeHaven-Wiki
npx --yes serve .
```

## Rebuild from pack data
Requires extract at `d:\COBBLEVERSE\_pack_analysis` (with `_dp_peek` datapacks).

```powershell
cd d:\COBBLEVERSE\PokeHaven-Wiki
npm run build
```

Parsers: `scripts/parse-pack.js` + `scripts/parse-recipes.js`.
