/** UI strings + helpers for EN/NL wiki */

export const DISCORD_INVITE = "https://discord.gg/7EHPZfGwU4";

export const UI = {
  en: {
    htmlLang: "en",
    searchPlaceholder: "Search the wiki…",
    contents: "Contents",
    footerMain: "PokeHaven EU Wiki · CobbleVerse 1.7.42 · Player guide for our community server.",
    footerNote: "Pack data parsed from the shared CurseForge export. World coordinates may vary by seed/world.",
    footerStamp: "Updated for CobbleVerse 1.7.42 · PokeHaven EU",
    footerDiscord: "Discord",
    footerIpNote: "Server IP only from Discord",
    langEn: "English",
    langNl: "Nederlands",
    nav: [
      ["Start", "Getting_Started.html"],
      ["Minecraft", "Minecraft_Hub.html"],
      ["Recipes", "Recipe_Browser.html"],
      ["Kanto", "Gyms_Kanto.html"],
      ["Economy", "Economy.html"],
      ["Raids", "Raids.html"],
      ["Combat", "Catching_and_Battling.html"],
      ["Data", "Spawn_Lookup.html"],
    ],
  },
  nl: {
    htmlLang: "nl",
    searchPlaceholder: "Zoek in de wiki…",
    contents: "Inhoud",
    footerMain: "PokeHaven EU Wiki · CobbleVerse 1.7.42 · Spelersgids voor onze community-server.",
    footerNote: "Pack-data uit de gedeelde CurseForge-export. Wereldcoördinaten kunnen per seed/wereld verschillen.",
    footerStamp: "Bijgewerkt voor CobbleVerse 1.7.42 · PokeHaven EU",
    footerDiscord: "Discord",
    footerIpNote: "Server-IP alleen via Discord",
    langEn: "English",
    langNl: "Nederlands",
    nav: [
      ["Start", "Getting_Started.html"],
      ["Minecraft", "Minecraft_Hub.html"],
      ["Recepten", "Recipe_Browser.html"],
      ["Kanto", "Gyms_Kanto.html"],
      ["Economie", "Economy.html"],
      ["Raids", "Raids.html"],
      ["Gevecht", "Catching_and_Battling.html"],
      ["Data", "Spawn_Lookup.html"],
    ],
  },
};

export function tx(lang, en, nl) {
  return lang === "nl" ? nl : en;
}

/** Link from the current language page to the same page in the other language. */
export function altLangHref(currentLang, file) {
  const isIndex = file === "index.html";
  if (currentLang === "en") {
    // From EN root or pages/ → NL
    return isIndex ? "nl/index.html" : `../nl/pages/${file}`;
  }
  // From NL root (nl/) or nl/pages/ → EN
  return isIndex ? "../index.html" : `../../pages/${file}`;
}

export function relPrefixFor(lang, file) {
  const isIndex = file === "index.html";
  if (lang === "en") return isIndex ? "" : "../";
  return isIndex ? "../" : "../../";
}

/**
 * Loud red callout for must-not-miss player facts.
 * @param {"en"|"nl"} lang
 * @param {string} bodyHtml  Already-escaped or trusted HTML fragment
 * @param {string} [label]   Override label (defaults: Important / Belangrijk)
 */
export function critical(lang, bodyHtml, label) {
  const lab = label ?? (lang === "nl" ? "Belangrijk" : "Important");
  return `<div class="callout critical" role="note">
  <div class="label">${lab}</div>
  <p class="critical-text">${bodyHtml}</p>
</div>`;
}
