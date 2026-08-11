/** UI strings + helpers for EN/NL wiki */

export const DISCORD_INVITE = "https://discord.gg/7EHPZfGwU4";
export const BLUEMAP_URL = "http://88.211.214.163:8100";

export const UI = {
  en: {
    htmlLang: "en",
    searchPlaceholder: "Search the wiki…",
    contents: "Contents",
    footerMain: "PokeHaven EU Wiki · CobbleVerse 1.7.42 · Player guide for our community server.",
    footerNote: "Written for CobbleVerse 1.7.42 on PokeHaven EU. Map coordinates can vary by world.",
    footerStamp: "Updated for CobbleVerse 1.7.42 · PokeHaven EU",
    footerDiscord: "Discord",
    footerIpNote: "Server IP only from Discord",
    langEn: "English",
    langNl: "Nederlands",
    nav: [
      ["Start", "Getting_Started.html"],
      ["Quests", "Quests.html"],
      ["Gyms", "Gyms_Kanto.html"],
      ["Keys", "Keybinds.html"],
      ["BlueMap", BLUEMAP_URL],
      ["Recipes", "Recipe_Browser.html"],
      ["Economy", "Economy.html"],
      ["Raids", "Raids.html"],
      ["Claims", "Claims.html"],
    ],
  },
  nl: {
    htmlLang: "nl",
    searchPlaceholder: "Zoek in de wiki…",
    contents: "Inhoud",
    footerMain: "PokeHaven EU Wiki · CobbleVerse 1.7.42 · Spelersgids voor onze community-server.",
    footerNote: "Geschreven voor CobbleVerse 1.7.42 op PokeHaven EU. Kaartcoördinaten kunnen per wereld verschillen.",
    footerStamp: "Bijgewerkt voor CobbleVerse 1.7.42 · PokeHaven EU",
    footerDiscord: "Discord",
    footerIpNote: "Server-IP alleen via Discord",
    langEn: "English",
    langNl: "Nederlands",
    nav: [
      ["Start", "Getting_Started.html"],
      ["Quests", "Quests.html"],
      ["Gyms", "Gyms_Kanto.html"],
      ["Toetsen", "Keybinds.html"],
      ["BlueMap", BLUEMAP_URL],
      ["Recepten", "Recipe_Browser.html"],
      ["Economie", "Economy.html"],
      ["Raids", "Raids.html"],
      ["Claims", "Claims.html"],
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
