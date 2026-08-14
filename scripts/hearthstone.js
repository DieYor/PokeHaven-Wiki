/**
 * Hearthstone home teleport — live PokeHaven EU (HearthstoneMod + world datapack).
 * Used by EN deep-pages + NL site.
 */

import { critical } from "./i18n.js";

export function hearthstoneBodyEn({ navboxSystems }) {
  return `
    ${critical(
      "en",
      "<strong>Craft recipe on PokeHaven:</strong> cobblestone + diamonds + ender pearl (shaped). REI may show the mod’s default <code>c:stones</code> tag — trust the cobble recipe below."
    )}

    <h2>What it does</h2>
    <p>A <strong>Hearthstone</strong> teleports you to your linked home (bed / respawn anchor style link). Channel for <strong>10 seconds</strong>, then <strong>15 minutes</strong> cooldown. Cross-dimension travel is allowed.</p>

    <h2>Craft (PokeHaven recipe)</h2>
    <table class="wikitable">
      <thead><tr><th></th><th>1</th><th>2</th><th>3</th></tr></thead>
      <tbody>
        <tr><th>A</th><td>Cobblestone</td><td>Diamond</td><td>Cobblestone</td></tr>
        <tr><th>B</th><td>Diamond</td><td>Ender Pearl</td><td>Diamond</td></tr>
        <tr><th>C</th><td>Cobblestone</td><td>Diamond</td><td>Cobblestone</td></tr>
      </tbody>
    </table>
    <p>Result: <code>hearthstonemod:hearthstone</code> ×1. Search REI for <em>Hearthstone</em>.</p>

    <h2>How to use</h2>
    <ol class="steps">
      <li>Craft the stone (or get one from a friend).</li>
      <li>Link it to your home the first time you set it (follow the in-game prompts — bed / respawn style).</li>
      <li>Hold and use to channel home. Moving or taking damage usually cancels the channel.</li>
      <li>Wait out the cooldown before the next warp. The item bar shows progress; if you try again early you’ll see the remaining time.</li>
    </ol>

    <h2>Timers (live server)</h2>
    <table class="wikitable">
      <thead><tr><th>Setting</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td>Channel</td><td>10 seconds</td></tr>
        <tr><td>Cooldown</td><td>15 minutes</td></tr>
        <tr><td>Cross-dimension</td><td>Yes</td></tr>
      </tbody>
    </table>

    <h2>Vs waystones</h2>
    <table class="wikitable">
      <thead><tr><th></th><th>Hearthstone</th><th>Waystones</th></tr></thead>
      <tbody>
        <tr><td>Cost / cooldown</td><td>15 min cooldown</td><td>Free, no cooldown</td></tr>
        <tr><td>Destinations</td><td>Your linked home</td><td>Any activated stone</td></tr>
        <tr><td>Best for</td><td>Panic / mid-hike home</td><td>Gym routes &amp; network travel</td></tr>
      </tbody>
    </table>
    <p>Keep both: waystones for the route, hearthstone for “get me home now”.</p>

    <h2>Common mistakes</h2>
    <ul>
      <li>Crafting with the wrong recipe because REI showed stones instead of cobble.</li>
      <li>Expecting no cooldown (it is 15 minutes on PokeHaven).</li>
      <li>Skipping <a href="Claims.html">FTB Chunks</a> on your bed / home — the stone won’t protect your base.</li>
    </ul>

    <p class="see-also"><strong>See also:</strong> <a href="Travel.html">Travel</a> · <a href="Claims.html">Claims</a> · <a href="Essential_Recipes.html">Essential recipes</a> · <a href="Pack_Differences.html">Pack differences</a></p>
    ${navboxSystems()}
  `;
}

export function hearthstoneBodyNl({ navboxCore, criticalFn }) {
  const crit = criticalFn || critical;
  return `
    ${crit(
      "nl",
      "<strong>Craftrecept op PokeHaven:</strong> cobblestone + diamonds + ender pearl (shaped). REI kan de default <code>c:stones</code>-tag van de mod tonen — vertrouw het cobble-recept hieronder."
    )}

    <h2>Wat het doet</h2>
    <p>Een <strong>Hearthstone</strong> teleporteert je naar je gekoppelde thuis. Channel <strong>10 seconden</strong>, daarna <strong>15 minuten</strong> cooldown. Cross-dimension mag.</p>

    <h2>Craft (PokeHaven-recept)</h2>
    <table class="wikitable">
      <thead><tr><th></th><th>1</th><th>2</th><th>3</th></tr></thead>
      <tbody>
        <tr><th>A</th><td>Cobblestone</td><td>Diamond</td><td>Cobblestone</td></tr>
        <tr><th>B</th><td>Diamond</td><td>Ender Pearl</td><td>Diamond</td></tr>
        <tr><th>C</th><td>Cobblestone</td><td>Diamond</td><td>Cobblestone</td></tr>
      </tbody>
    </table>
    <p>Resultaat: <code>hearthstonemod:hearthstone</code> ×1. Zoek in REI op <em>Hearthstone</em>.</p>

    <h2>Gebruik</h2>
    <ol class="steps">
      <li>Craft de steen (of krijg er één van een vriend).</li>
      <li>Koppel hem de eerste keer aan je thuis (in-game prompts — bed / respawn-stijl).</li>
      <li>Houd vast en gebruik om te channelen. Bewegen of schade annuleert meestal de channel.</li>
      <li>Wacht de cooldown af. Het balkje op het item toont voortgang; te vroeg opnieuw gebruiken toont de resterende tijd.</li>
    </ol>

    <h2>Timers (live server)</h2>
    <table class="wikitable">
      <thead><tr><th>Instelling</th><th>Waarde</th></tr></thead>
      <tbody>
        <tr><td>Channel</td><td>10 seconden</td></tr>
        <tr><td>Cooldown</td><td>15 minuten</td></tr>
        <tr><td>Cross-dimension</td><td>Ja</td></tr>
      </tbody>
    </table>

    <h2>Vs waystones</h2>
    <table class="wikitable">
      <thead><tr><th></th><th>Hearthstone</th><th>Waystones</th></tr></thead>
      <tbody>
        <tr><td>Kosten / cooldown</td><td>15 min cooldown</td><td>Gratis, geen cooldown</td></tr>
        <tr><td>Bestemmingen</td><td>Je gekoppelde thuis</td><td>Elke geactiveerde steen</td></tr>
        <tr><td>Beste voor</td><td>Snel naar huis</td><td>Gym-routes &amp; netwerk</td></tr>
      </tbody>
    </table>

    <p class="see-also"><strong>Zie ook:</strong> <a href="Travel.html">Reizen</a> · <a href="Claims.html">Claims</a> · <a href="Essential_Recipes.html">Essentiële recepten</a> · <a href="Pack_Differences.html">Pack-verschillen</a></p>
    ${navboxCore()}
  `;
}
