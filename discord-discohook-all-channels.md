# PokeHaven EU — Discohook embeds (all INFO channels)

Same workflow as `#rules` for every channel below.

### Shared setup (every time)

1. Open [https://discohook.app](https://discohook.app) → clear default junk (Support Server / Invite Bot buttons)
2. **Add Embed**
3. Discord → that channel → Integrations → Webhooks → New Webhook → **Copy URL**
4. Paste URL in Discohook → **Send**
5. **Pin** the message in Discord
6. Channel should be read-only for members (View ✅, Send ❌) except `#introductions`

### Shared images (reuse URLs you already uploaded)


| Discohook field        | File                                                          |
| ---------------------- | ------------------------------------------------------------- |
| Thumbnail              | `d:\COBBLEVERSE\discord-assets\thumbnail-pokehaven-large.png` |
| Large image (optional) | `d:\COBBLEVERSE\discord-assets\rules-banner.png`              |


Upload once in a staff channel → Copy Link → reuse everywhere.

**Replace everywhere:**

- `[PASTE APEX IP HERE]`
- `[PACK DOWNLOAD LINK]`
- `[HANDBOOK LINK]` (optional)
- `[PAYPAL LINK]` = `https://www.paypal.com/ncp/payment/WSCKHWXYQUP6Q`

---

# 1) `#welcome`

**Color:** `5EC4C8`  
**Thumbnail:** PH logo  
**Large image:** banner (optional)

### Title

```text
🏝️ Welcome to PokeHaven EU
```

### Description

```text
Our CobbleVerse community — catch, train, clear gyms, claim land, and play together with voice chat.

Glad you're here, trainer.
```

### Fields (Inline OFF)

**📌 Start here**

```text
1️⃣ Read <#1535346174368686211>
2️⃣ Follow <#1535347393984331836>
3️⃣ Say hi in <#1535363937644711987>
4️⃣ Jump into the server and begin your journey
```

**🎮 What we play**

```text
Pack: **PokeHaven EU Client 1.7.42** (CobbleVerse)
Server name: **PokeHaven EU**
Focus: Gyms • PokéDollars • Claims • Voice • Community
```

**💬 Need help?**

```text
Ask in <#HELP_CHANNEL_ID> with a short description + screenshot.
Staff is here to help — be patient and kind.
```

(Replace `<#HELP_CHANNEL_ID>` — right-click `#help` → Copy Channel ID.)

### Footer

```text
🏝️ PokeHaven EU • Play fair • Have fun
```

### Button (link)

- Label: `Donate with PayPal` (optional)
- URL: `[PAYPAL LINK]`

---

# 2) `#how-to-join`

**Color:** `F0B429`  
**Thumbnail:** PH logo  
**Large image:** banner (optional)

### Title

```text
🎮 How to join PokeHaven EU
```

### Description

```text
Follow these steps exactly. Most join issues are a pack version mismatch.
```

### Fields (Inline OFF)

**1️⃣ Minecraft Java**

```text
You need **Minecraft: Java Edition** with a real Microsoft account.
Cracked / offline accounts will not work.
```

**2️⃣ Install CurseForge**

```text
Download the CurseForge App:
[Download CurseForge](https://www.curseforge.com/download/app)

Install it and log in.
```

**3️⃣ Install our pack**

```text
Import **PokeHaven EU Client 1.7.42** (CobbleVerse + PokeHaven menus/splash — same mods as the server).

Pack download: [Download PokeHaven EU Client](PASTE_DRIVE_LINK_HERE)
Local filename: `PokeHaven-EU-Client-1.7.42.zip`

Wait until every mod finishes downloading. Do **not** use stock CobbleVerse from CurseForge search if you want our branding — use this zip.
```

**4️⃣ Add the server**

```text
1. Launch **PokeHaven EU Client** via CurseForge (main menu should say PokeHaven)
2. Multiplayer → Add Server
3. Server Name: **PokeHaven EU**
4. Server Address: `88.211.214.163:25565`
5. Done → Join
```

**5️⃣ First hour in-game**

```text
1. Pick a starter (**C**) — Grass is safest for Brock
2. Place a bed and sleep once (respawn)
3. **Claim now** with **FTB Chunks** (Esc → Options → Controls → search FTB) — bed, chests, farm
4. Activate a spawn waystone if you see one; skim the hotbar guidebook
5. Catch 2–3 nearby Pokémon; keep balls + heals on your hotbar
6. Craft the **Brock map**: place **Kanto Cartography Table** → put **Empty Map + Brock Map Key** in it
   (do **NOT** open the Empty Map in the world) → follow the map to Brock
7. Level cap stays on until you beat the next gym — intentional on PokeHaven EU
8. Stuck? Screenshot + ask in <#HELP_CHANNEL_ID> · guides: [pokehaven.wiki](https://pokehaven.wiki)
```

**❓ Can't join?**

```text
Usually the wrong pack version.
Reinstall / re-import **PokeHaven EU Client 1.7.42** from the pack button below.

Server-only mods do **not** need to be on your client.
```

### Footer

```text
Pack CobbleVerse 1.7.42 • Server: PokeHaven EU
```

### Buttons (do these — most reliable clickable links)

1. Label: `Download CurseForge` → `https://www.curseforge.com/download/app`
2. Label: `Download Pack` → `PASTE_DRIVE_LINK_HERE`
3. Label: `Donate with PayPal` → `https://www.paypal.com/ncp/payment/WSCKHWXYQUP6Q`

---

# 3) `#announcements` (first launch post)

**Color:** `E8913A`  
**Thumbnail:** PH logo

### Title

```text
📢 PokeHaven EU is live
```

### Description

```text
The haven is open. Catch, battle, clear gyms, and build with the community.
```

### Fields (Inline OFF)

**🌍 Server**

```text
Name: **PokeHaven EU**
Pack: **PokeHaven EU Client 1.7.42** (CobbleVerse)
Region: **EU**
```

**✨ Features**

```text
• Gyms & badges
• PokéDollars / economy
• Chunk claims (FTB Chunks)
• Voice chat
• Waystones / teleport stones
• Trainer outfits (Poke Clothing)
```

**📌 Getting started**

```text
1️⃣ Read <#1535346174368686211>
2️⃣ Follow <#1535347393984331836>
3️⃣ Say hi in <#1535363937644711987>

Guides: [pokehaven.wiki](https://pokehaven.wiki)

Good luck with Brock — welcome to the haven. 🏖️
```

### Footer

```text
Updates & downtime will be posted here
```

### Buttons (optional)

1. Label: `How to join` → link to Discord channel is awkward; skip OR use wiki
2. Label: `Player Wiki` → `https://pokehaven.wiki`
3. Label: `Donate with PayPal` → `https://www.paypal.com/ncp/payment/WSCKHWXYQUP6Q`

---

# 4) `#server-status` — SKIP (Discohook)

**Geen vaste Discohook-embed.** Live status = **PokeHaven Status**-bot. Dat kanaal alleen voor de bot laten.

---

# 5) `#introductions`

**Color:** `5EC4C8`  
**Thumbnail:** PH logo  

> This channel should stay **writable** for members.

### Title

```text
👋 Introduce yourself
```

### Description

```text
New here? Drop a short intro so the community can say hi!
```

### Fields (Inline OFF)

**✏️ Template**

```text
• Name / nickname:
• Age (optional):
• New to Minecraft? Yes / No
• Favorite starter / Pokémon:
• What are you most excited for? (gyms / building / trading / voice)
```

**📌 Tip**

```text
Keep it friendly and SFW.
After introducing yourself, check #how-to-join if you haven't joined the Minecraft server yet.
```

### Footer

```text
Welcome to the haven 🏝️
```

---

# Checklist

- [x] `#welcome` embed + pin (+ optional PayPal button)
- [x] `#rules` embed + pin *(already done)*
- [x] `#how-to-join` embed + pin *(fill pack link + IP)*
- [x] `#announcements` launch post + pin
- [x] `#server-status` — skip Discohook (PokeHaven Status bot)
- [x] `#introductions` template + pin

Start with `#welcome`, then `#how-to-join` (that one matters most for new players).