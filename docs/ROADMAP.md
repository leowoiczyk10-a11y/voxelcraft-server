# VoxelCraft Roadmap

## Legende
`[P1]` = hoher Impact, schnell umsetzbar — als nächstes angehen
`[P2]` = mittlerer Impact oder etwas mehr Aufwand
`[P3]` = großer Scope, später
`[MC]` = wichtig für Minecraft-Feeling
`[PERF]` = Performance-kritisch
`[BUG]` = bekannter Bug

---

## Bereits implementiert (nicht mehr anfassen außer Bugfixes)
- Rüstung (4 Slots, alle Tiers, Durability, HUD)
- Bogen + Pfeile (server-autoritativ, owner-System)
- Inventar-Persistenz (localStorage, death-reset)
- Item-Icons (62 Silhouetten)
- Lava + Feuerschaden
- Wüsten-Biom + Vegetation
- Sound-Engine (Web Audio API, synthetisch)
- Hunger-System (Bar vorhanden, Regen/Schaden funktioniert)
- Chest-UI (27 Slots, localStorage, Multiplayer-Sync)
- Anvil (Item-Reparatur)
- Enchanting Table (UI vorhanden)
- Shield (blockt 50% Schaden, Cooldown)
- Fishing Rod (Grundlogik vorhanden)
- XP + Level (Bar + Orbs)
- Achievements (unlockAch)
- Minimap (togglebar)
- Dimensionen: Nether + The End (Grundstruktur vorhanden)
- Bosse: Enderdrache + Wither (Grundlogik)
- Redstone: Hebel → Draht → Lampe
- Wetter (Regen, Donner, Blitz)
- Campfire, Barrel, Stonecutter, Composter, Brewing Stand, Ender Chest (Blöcke vorhanden)
- Rails + Minecart (Fahren grundlegend)
- Wolf + Horse (spawn, tamen, reiten)

---

## P1 — Nächste Sessions (hoher Impact, überschaubarer Aufwand)

### [P1][BUG] Ofen-UI vollständig machen
**Problem:** Furnace-Block existiert, aber öffnet kein Panel beim Anklicken.
- Ofen-Panel mit 3 Slots (Input, Fuel, Output) + Fortschrittsbalken
- Schmelzrezepte: Iron Ore→Ingot, Gold Ore→Ingot, Sand→Glass, Log→Charcoal, Raw Fish→Cooked Fish
- Fuel: Coal=8s, Charcoal=8s, Log=3s, Planks=1.5s
- tickFurnace() existiert schon — nur UI-Anbindung fehlt

### [P1][MC] Item-Namen GUI
**Warum wichtig:** Fehlt komplett, aber essentiell für Spielgefühl.
- Tooltip beim Hover (MC-Style: lila Rahmen, Itemname)
- Name erscheint kurz über Hotbar bei Slot-Wechsel (Fade-out nach 2s)
- Enchant-Level im Tooltip wenn verzaubert

### [P1][MC] Mob-Spawning unterirdisch
**Problem:** Mobs spawnen nur oberirdisch. Höhlen sind leer.
- Surface-Cache pro (x,z) → `surfaceY[x][z]`
- Spawn nur wenn `y < surfaceY` UND Luftblock direkt über Spawn-Pos
- Creeper/Skeleton/Spider/Zombie (Spider noch nicht implementiert) in Höhlen

### [P1][MC] Hunger aktiv machen (Sinken bei Aktionen)
**Problem:** Hunger existiert aber sinkt nicht. Nur Regen/Schaden-Logik da.
- Hunger sinkt: passiv (0.3/min), Sprint (+0.5/min), Angriff (+0.5 pro Hit), Sprung (+0.1)
- Food-Items: Bread, Apple, Cooked Beef, Cooked Pork, Melon Slice, Carrot, Potato
- Rohes Fleisch: macht Hunger, kleine Chance auf Vergiftung
- `eat()` Funktion anpassen → hunger += foodValue

### [P1][PERF] Chunk-Unloading
**Problem:** Chunks werden nie aus dem RAM entfernt → Memory-Leak bei langen Sessions.
- Meshes von Chunks > renderDist + 2 disposen (`disposeMesh`)
- Chunk-Daten im `world`-Map behalten (für Rückkehr ohne Neugen)
- Spart 50–80% RAM bei größeren Welten

### [P1][MC] Spider-Mob
**Fehlt komplett.** Wichtiger MC-Mob.
- Modell: breiter flacher Körper, 8 Beine
- KI: wie Zombie, aber kann Wände hochklettern (y-Velocity an Wänden)
- Drops: String (2–4), Spider Eye (selten)
- Spawn: Höhlen + nacht oberirdisch
- Neutrale tags: tagsüber passiv wenn kein Blickkontakt

### [P1][MC] Zombie-Mob
**Fehlt.** Grundlegendster Hostile Mob nach Creeper/Skeleton.
- Modell: wie Spieler-Shape (Villager-Basis nutzen)
- KI: Chase + Melee, langsamer als Skeleton
- Drops: Rotten Flesh (1–3), selten Iron Ingot/Carrot/Potato
- Brennt in der Sonne (wie MC)

---

## P2 — Mittelfristig

### [P2][MC] Wolf zähmen + Begleiter-KI
**Problem:** Wolf spawnt aber tut nichts Nützliches.
- Mit Knochen füttern → zähmen (3–5 Knochen, RNG)
- Gezähmter Wolf: folgt Spieler, greift Feinde an, sitzt auf Rechtsklick
- Wölfin + Wolf → Welpen (Breeding-System schon teilweise da)
- Drops bei Tod: nichts (gezähmt), Knochen (wild)

### [P2][MC] Pferd vollständig machen
**Problem:** Pferd reitet, aber kein Sattel-System, kein Inventar.
- Sattel anlegen: Rechtsklick mit Saddle-Item
- Pferd-Inventar (2 Slots: Sattel + Rüstung) bei Shift+Rechtsklick
- Pferde-Rüstung: Iron/Gold/Diamond (3 Tiers, schon als Konstante vorhanden?)
- Springen: Leertaste hält → Sprungkraft aufbaut

### [P2][MC] Bett + Schlafen
**Status:** Code-Stub `trySleep()` vorhanden, aber keine UI.
- Bett-Block: Rechtsklick → Modal "Schlafen?" 
- Nacht-Skip nur ohne Hostile Mobs in Nähe (32 Blöcke)
- Respawn-Punkt setzen
- Multiplayer: Mehrheit muss schlafen

### [P2][MC] Villager Trading vollständig
**Problem:** Villager spawnt passiv, `tradeWithVillager()` stub vorhanden.
- Trade-UI: 3 Angebote je Villager, Items gegen Emeralds
- Professionen: Farmer (Food↔Emerald), Blacksmith (Tools↔Emerald), Librarian (Books↔Emerald)
- Angebote je nach Profession aus fixer Liste

### [P2][MC] Farmland + Hoe + Crops
**Status:** Wheat-Stages (WHEAT_S0–S3) und tickCrops() vorhanden. Farmland-Block fehlt.
- Hoe-Werkzeug (Wood/Stone/Iron/Gold/Diamond)
- Dirt/Grass → Farmland bei Hoe-Nutzung
- Farmland trocknet aus ohne Wasser in 4 Blöcken
- Carrot, Potato, Beetroot als neue Crops (Setzlinge aus Drops)
- Ernte gibt 1–4 Items

### [P2][MC] Schafe + Wolle
**Problem:** Sheep spawnt aber hat keine Schermechanik.
- Schaf hat Woll-Farbe (zufällig, 4–5 Farben)
- Schere (Iron Ingot + Stick) → klicken → Wolle droppen (1–3)
- Ohne Schur: kein Wool-Drop beim Tod, mit Schur: Wool-Drop
- Wolle → Bett crafting

### [P2][MC] Kuh melken
**Problem:** Kuh spawnt, gibt Leather beim Tod, aber kein Melken.
- Rechtsklick mit Empty Bucket → Milk Bucket
- Milk Bucket trinken → hebt alle Status-Effekte auf (Poison etc.)

### [P2] Schwimmen / Wasser-Physik
**Problem:** Wasser ist halbsolid aber kein echtes Schwimmen.
- In Wasser: langsameres Sinken, Auftrieb (Y-vel dämpfen)
- Schwimm-Animation (Kamera leicht nach vorne geneigt)
- Ertrinken: Air-Bar sinkt unter Wasser, Schaden bei 0

### [P2][PERF] Frustum Culling
- Chunks außerhalb Camera-Frustum nicht rendern
- Three.js Frustum-Klasse + Chunk-AABB
- ~20–40% FPS-Gewinn ohne Qualitätsverlust

### [P2] Renderable Lichtquellen
**Problem:** Fackeln/Lava/Glowstone geben kein echtes Licht.
- THREE.PointLight Pool (max 8 gleichzeitig, nach Distanz priorisiert)
- Fackel: Radius 6, intensity 0.8, orange
- Lava: Radius 10, intensity 1.2, rot-orange
- Glowstone: Radius 8, intensity 1.0, gelb
- Flackern bei Feuer/Lava (leichte Intensity-Variation)

### [P2] Keep-Inventory Toggle
- Setting in Settings-Menu (Checkbox)
- Bei Tod: wenn aktiv → Inventar behalten
- Sinnvoll für Mobile-Spieler die kein gutes Kampf-Interface haben

### [P2][MC] Sand + Gravel Physik
**Problem:** Sand/Gravel fallen nicht.
- Bei Block-Platzierung/Abbau darunter: Gravity-Check
- Fällender Block als kurze Animation (Move Entity), dann setBlock
- Gravel → Flint-Drop (12.5% Chance)

---

## P3 — Langfristig / Großer Scope

### [P3][MC] Slime-Mob vollständig
**Status:** Slime/Slime_small als HP-Konstante vorhanden.
- Modell: grüner Würfel, springt in Richtung Spieler
- Bei Tod: 2–4 kleine Slimes spawnen (nur wenn groß)
- Drops: Slimeball (1–4, nur kleine Slimes)
- Spawnt in Sümpfen nachts + tief in Höhlen (Schicht Y < 16)

### [P3][MC] Nether vollständig
**Status:** generateNetherData + Grundstruktur vorhanden.
- Nether-Festung komplett (Blaze-Spawner, Nether Wart, Treppen)
- Zombified Piglin: neutral bis angegriffen, dann alle angreifen
- Magma Cube (wie Slime aber Feuer-immun)
- Nether Quartz Ore + Abbau
- Basalt-Biom, Soul Sand Valley

### [P3][MC] The End vollständig
**Status:** generateEndData + Enderdrache-Grundlogik vorhanden.
- End-Kristalle auf Säulen regenerieren Drachen
- Drachen-Phasen: kreisen, landen, Feuer-Atem
- End-Stadt nach Drachen-Tod (Shulker, Elytra)
- End-Portal zurück in Oberwelt

### [P3][MC] Enchanting System
**Status:** Enchanting Table Block + UI-Stub vorhanden.
- Bücherregale erhöhen Enchant-Level (max 30)
- 3 zufällige Enchants zur Auswahl
- Enchants: Sharpness I–V, Efficiency I–V, Protection I–IV, Unbreaking I–III, Fortune I–III, Silk Touch
- Enchanted Items: lila Schimmer auf Icon

### [P3][MC] Brewing Stand + Tränke
**Status:** Brewing Stand Block vorhanden, `openBrewing()` stub.
- Brewing-UI: 3 Fläschchen-Slots + 1 Zutat-Slot + Blaze-Powder Fuel
- Basis: Water Bottle → + Nether Wart = Awkward Potion
- Tränke: Healing, Harming, Poison, Regen, Speed, Strength, Fire Resistance
- Splash Tränke (+ Gunpowder) zum Werfen

### [P3][PERF] Web Worker für Chunk-Generierung
**Problem:** generateChunkData() läuft im Main Thread → Ruckler beim Erkunden.
- Chunk-Gen als echter Web Worker (worker.js standalone, kein import)
- Main Thread schickt (cx,cz,seed) → Worker antwortet mit Uint8Array
- Beseitigt die Haupt-Ursache für Lag-Spikes

### [P3][MC] Komplexeres Mob-Pathfinding
**Problem:** Mobs bleiben an Wänden/Treppen hängen.
- Einfaches A*-Pathfinding auf Chunk-Level (nicht volle MC-Komplexität)
- Treppenstufen erkennen (1-Block-Höhenunterschied übersteigen)
- Wasser meiden (außer Squid)
- Reicht für 90% der Situations

### [P3][MC] Maps + Kompass als Items
**Status:** MAP_ITEM + COMPASS als Konstanten vorhanden.
- Map: zeigt 128×128 Blöcke der aktuellen Region farbig
- Kompass zeigt immer zu 0,0 (Spawn)
- Uhr zeigt Tageszeit

### [P3] Shader-Setting / Ambient Occlusion
**Problem:** AO-Toggle vorhanden aber AO rudimentär.
- Echtes Vertex-AO in buildSectionGeometry (schon Code-Basis da mit occ1/occ2)
- AO-Toggle schaltet tatsächlich echtes AO an/aus
- Optional: SSAO als Post-Processing (Bloom-Composer vorhanden)

---

## Erledigt (Session 2026-06-26)
- **Fledermaus (Höhlen-Atmosphäre-Mob)** — passiver Flatterer (`kind:'bat'`, HP 4, `fly:true`), erratische 3D-Flug-KI (`updateBatAI`) um ein Roam-Zentrum, spawnt in dunklen Höhlen (`tryCaveSpawnPoint`, max 4). Keine Drops/XP. Siehe `docs/MOBS.md`.
- **Schneeball (werfbar)** — neues Item `SNOWBALL` (id 218), Rezept 1 Schnee-Block → 4 Schneebälle. Rechtsklick wirft (`thrownSnowballs`/`updateThrownSnowballs`): Rückstoß + 1 Schaden (3 vs Blaze, MC-konform), weißer Aufprall-Poof. Verbraucht beim Wurf.
- **Enderperle werfen → Teleport** — Rechtsklick mit `ENDER_PEARL` wirft eine Perle (`thrownPearls`/`updateThrownPearls`); beim Aufprall teleportiert der Spieler zum Landepunkt (sucht 2 Luftblöcke für sichere Standhöhe, sichert Ziel-Chunks via `ensureChunkData`), kostet 1 Perle + 2 Schaden, Ender-Poof an beiden Enden. Verbraucht beim Wurf (MC-konform).
- **Dreizack Channeling** — geworfener Dreizack ruft beim Einschlag im Gewitter (`weather==='thunder'`) einen Blitz (`doLightning(x,z)`). `doLightning` ist jetzt parametrisierbar (optionale Zielkoordinaten) und trifft Mobs im Umkreis (8 Schaden, AoE) — gilt auch für zufällige Gewitterblitze.
- **Verifiziert bereits vorhanden:** Lagerfeuer-Garen (`cookOnCampfire`, Rechtsklick auf `CAMPFIRE` mit rohem Essen → gegart), Schnee-Akkumulation (`tickClimate`).
- **Biene (Atmosphäre-Mob)** — passiver Flieger (`kind:'bee'`, HP 4, `fly:true`), schwebt tagsüber über Wiesen (`updateBeeAI` proportionale Höhe + Wippen), gelb-schwarzes Modell mit durchscheinenden Flügeln. Spawn via `_beeSpawnTimer` (max 3, Gras, Tag). Keine Drops/kein Stechen (Scope). Siehe `docs/MOBS.md`.
- **Dreizack-Treuepflicht (Loyalty)** — geworfener Dreizack kehrt nach Einschlag (Mob/Block/Ablauf) zum Spieler zurück und landet im Inventar (`thrownTrident.returning`), statt als Bodenitem liegenzubleiben. Als Basis-Verhalten umgesetzt (kein Enchant-Wiring nötig); MC-Anpassung, da Dreizack hier ein seltenes Einzelstück (Drowned-Drop) ist.
- **Schnee-Akkumulation (Roadmap P2): verifiziert bereits vorhanden** — `tickClimate()` legt bei Regen/Gewitter in kalten Biomen `SNOW_LAYER` auf Oberflächen + friert Wasser zu `ICE`. Kein Code nötig.
- **Magmawürfel (Nether-Mob)** — slime-artiger Springer in zwei Größen (`magma_cube` HP 16 / `magma_cube_small` HP 6), `fly:true` + eigene `magmaCubeAI()` (nötig, weil `updateLocalMobs` nur Dim 0 läuft und `updateMobs` im Nether alles außer `local && fly` cullt). Dunkle Kruste + glühender Kern, hüpft auf den Spieler zu (Kontakt 4/2), feuerimmun (kein Mob-Lava-Pfad), splittet beim Tod in 2–3 kleine. Spawnt am Boden via `updateNetherMobs` (~35 %, sonst Ghast/Blaze). Neuer Drop **Magmacreme** (`MAGMA_CREAM`, id 216). Siehe `docs/MOBS.md`.
- **Fernglas / Spyglass** — neues Item (`SPYGLASS`, id 217), Rezept Glas + 2 Kupfer (vertikal). Rechtsklick **halten** zoomt (FOV → 22°, sanfter Lerp), feineres Zielen (Sensitivität ∝ FOV) + runde Vignette (`#spyglassOverlay`). Loslassen/Inventar/Tod = Zoom aus. Desktop (Maus); kein Item-Verbrauch.
- **Hinweis Frustum-Culling (Roadmap P2):** *nicht* umgesetzt — Three.js cullt Chunk-Section-Meshes bereits automatisch per `geometry.boundingSphere` (`makeMesh` ruft `computeBoundingSphere`) + Default `frustumCulled=true`. Manuelles Culling wäre redundanter Dead-Code. Roadmap-Item entsprechend obsolet.

## Erledigt (Session 2026-06-24, Teil 2)
- **Rezept-Matching gefixt** — formloses Matching zählte Stapelgrößen mit `>=` statt belegter Zellen exakt. Folge: das formlose „2 Eisen = Schere"-Rezept verschattete **jedes** rein-eiserne geformte Rezept dahinter → **Amboss (7 Eisen), Lore (5 Eisen), Eisenblock (9 Eisen) waren unbaubar**. Fix: `craftCounts()` zählt Zellen (`+1`), Matching `c[k]===r.in[k]`. Node-Test: alle 111 Rezepte liefern wieder ihren eigenen Output.
- **Zucker-Rezept gefixt** — verlangte `SUGARCANE` (Pflanzen-Block id 76, nie im Inventar) statt `SUGAR_CANE` (Item id 194). Jetzt aus 1 Zuckerrohr-Item baubar.
- **Drowned-Mob + Dreizack** — Unterwasser-Zombie (`kind:'drowned'`, HP 10): schwimmt zum Spieler, bleibt in der Wassersäule, strandet nicht; spawnt nachts in tiefem Wasser. Drops Rotten Flesh + Kupfer; ~15 % tragen einen **Dreizack** (id 214, dmg 9, werfbar per Rechtsklick als lokales Projektil, landet zum Aufsammeln). Kein Crafting (nur Drowned-Drop, MC-konform). Siehe `docs/MOBS.md`.
- **Drive-by:** `damageTool()` initialisiert fehlende `dur` (aufgesammelte Werkzeuge hatten via `addItem` keine Haltbarkeit → `NaN`).

## Erledigt (Session 2026-06-24)
- **Hunger sinkt jetzt auch solo** — survivalUpdate() ungated; Sprint/Sprung/Angriff zehren extra (useHunger). Hunger tötet nicht mehr (Floor bei 1 HP, Easy).
- **Sand/Kies-Schwerkraft** — applyGravityAt() fällt Säulen ein, Hook in breakBlock + doPlace, fällt durch Wasser bis fester Boden.
- **Zombie/Skelett verbrennen im Sonnenlicht** — Tag + offener Himmel → 1 HP/s + Feuerpartikel, in updateLocalMobs().
- **Enchant-Level in Item-Namen** — Tooltip (Hover/Touch) + Hotbar-Name zeigen z.B. "Diamantschwert · Schärfe II" (enchSuffix).
- **Unterirdisches Mob-Spawning** — tryCaveSpawnPoint() (dunkler Hohlraum ≥6 unter Oberfläche) + mobFloorY() (Höhlenboden statt Surface-Snap) + cave-Flag; Zombie/Skelett/Spider/Creeper, Tag+Nacht, kein Tag-Despawn.
- **Spider tagsüber neutral** — jagt nur nachts oder wenn provoziert (m.provoked via attackMob/arrowHitMob); kein Kontaktschaden am Tag.
- **Kies → Feuerstein** — neues FLINT-Item (id 211), 10% Drop beim Kies-Abbau.
- **Dev-Command Creative Mode** — `/changemode creative|survival` (silent, nicht an Server): alle Items ins Inventar, kein Hunger/Schaden/Tod, Fliegen (Doppel-Space, Space=hoch/Shift=runter), Instant-Break, kein Item-/Tool-Verbrauch.
- **Wasser/Lava-Flowing** — `floodWater()` war Dead-Code; jetzt `floodLiquid()` (generalisiert) + Trigger beim Block-Abbau neben Quelle. Wasser breit (budget 64, range 4), Lava knapp (16/2).
- **Schaf scheren + Wolle** — neuer WOOL-Block (id100) + SHEARS-Item (id212, Rezept 2 Eisen). Rechtsklick-Schere auf Schaf → 1–3 Wolle (einmalig bis nachwächst-Stub); ungeschorenes Schaf droppt Wolle beim Tod. Bett-Rezept auf 3 Wolle + 3 Bretter umgestellt.
- **Phantom-Mob** — Nachtflieger ab 3 schlaflosen Nächten (Dawn-Counter, Reset beim Schlafen). Sturzflug-KI (abwechselnd hochziehen/herabstoßen), 2 Schaden im Sturz, verbrennt am Morgen, Drop Phantommembran (id213). Nutzt vorhandene Fly-Infra.
- Verifiziert bereits vorhanden (Doc war veraltet): Ofen-UI, Chunk-Unloading, Item-Namen-Basis, Zombie+Spider-Mobs, Cow-Melken, Keep-Inventory-Toggle, dyn. Lichter.

## Bekannte Bugs

| Bug | Priorität | Fix |
|---|---|---|
| Mob-Pathfinding (hängt an Wänden) | P3 | A*-Lite |
| AO nur rudimentär | P3 | echtes Vertex-AO in buildSectionGeometry |
| Lava kein Flowing | P2 | analog zu Wasser |
| Mob-Pathfinding (hängt an Wänden) | P3 | A*-Lite |
| Cactus-Schaden fehlt | P2 | survivalUpdate(): AABB check gegen Cactus |
| Villager macht nichts | P1[MC] | tradeWithVillager() implementieren |
| AO nur rudimentär | P3 | echtes Vertex-AO in buildSectionGeometry |

---

## MC-Vollständigkeits-Gap (was noch fehlt)

### Blöcke die fehlen:
- Mud, Mangrove, Bamboo, Cherry Blossom (neuere MC-Versionen, kein Prio)
- Sculk, Deep Dark (Warden-Content, P3)
- Copper + Oxidation
- Amethyst

### Mobs die fehlen:
- Pillager, Ravager (P3)
- ~~Magma Cube (Nether)~~ ✅, Zombified Piglin (P3)
- ~~Bee (Atmosphäre)~~ ✅
- Warden / Deep Dark (P3)
- ~~Drowned~~ ✅, ~~Phantom~~ ✅, ~~Zombie/Spider/Slime~~ ✅ (erledigt)

### Mechaniken die fehlen:
- Elytra fliegen (Item vorhanden, Mechanik fehlt)
- ~~Trident~~ ✅ (id 214: Nahkampf dmg 9 + Wurf; Drowned-Drop)
- Trident: **Loyalty (Rückkehr)** ✅ + **Channeling (Blitz bei Einschlag im Gewitter)** ✅ — beide umgesetzt
- Shield-Blocker Animation (Shield-Item vorhanden, nur Damage-Reduction)
- Schneefall + Schnee-Akkumulation (Snow Layer Block vorhanden)
- Tropfstein / Stalagmiten (Schaden)

---

## Dev Tools (nicht für normale Spieler sichtbar)

### [P1] Creative Mode via Chat-Command (/op-Tool)
Zweck: Feature-Testing ohne Einschränkungen. Funktioniert wie Minecraft /op — voller Zugriff auf alles.
- Command: `/changemode creative` oder `/changemode survival` (Gross/Klein egal)
- Kein sichtbarer Tip, kein Chat-Output, keine Bestaetigung — reines Dev-Tool
- Wird nicht an den Server gesendet (vor `net.sendChat` abfangen)

**Creative Mode — vollstaendiger Umfang:**
- Inventar sofort mit ALLEN Items befuellen (jede Block-ID, jedes Item, jedes Tool, jede Ruestung, je 64 Stueck bzw. 1 bei Werkzeugen/Ruestung)
- Kein Hunger, kein Fallschaden, kein Mob-Schaden, kein Sterben
- Fliegen: Doppel-Leertaste aktiviert/deaktiviert Flug; Leertaste = hoch, Shift = runter
- Abbau sofort (instant break, kein Mining-Progress)
- Kein Item-Verbrauch beim Platzieren (`consumeSelected` ueberspringen)
- Keine Werkzeug-Durability
- Unendliche Blocks: Stack bleibt bei 64 nach Platzieren

**Survival Mode:** Inventar bleibt (nicht leeren), alle Einschraenkungen wieder aktiv, Fliegen aus

**Implementierung:**
```js
let gameMode = 'survival';
let flying = false;

// in sendChat() VOR net.sendChat / addChatMsg:
if(text.toLowerCase().startsWith('/changemode ')){
  const mode = text.slice(12).trim().toLowerCase();
  if(mode === 'creative'){
    gameMode = 'creative'; flying = false;
    let si = 0;
    for(const id in BLOCKS){ if(si<36) inv[si++]={id:+id, count:64}; }
    for(const id in ITEM){   if(si<36) inv[si++]={id:+id, count:64}; }
    for(const id in TOOL){   if(si<36) inv[si++]={id:+id, count:1, dur:TOOL[id].dur}; }
    for(const id in ARMOR){  if(si<36) inv[si++]={id:+id, count:1, dur:ARMOR[id].dur}; }
    renderHotbar(); if(invOpen) renderInventory();
  } else if(mode === 'survival'){
    gameMode = 'survival'; flying = false;
  }
  return;
}

// Doppel-Leertaste fuer Fly-Toggle (nur Creative):
// keydown 'Space': if(gameMode==='creative' && lastSpace > Date.now()-300){ flying=!flying; }

// updatePlayer(): wenn flying → Gravity + Kollision ueberspringen, Y via Space/Shift steuern
// survivalUpdate(): if(gameMode==='creative') return
// damagePlayer(): if(gameMode==='creative') return
// damageTool(): if(gameMode==='creative') return
// consumeSelected(): if(gameMode==='creative') return
// updateAim(): if(gameMode==='creative') mining.progress = 1 sofort
```

---

## Weitere wichtige Features (Erweiterung)

### [P1][MC] Hunger sinkt bei Aktionen
**Problem:** Hunger-Variable existiert, sinkt aber nur minimal im Multiplayer.
- Solo: Hunger sinkt auch ohne Server
- Raten: passiv -0.3/min, Sprint -0.5/min extra, Angriff -0.5 pro Hit, Sprung -0.1
- Schaden bei Hunger=0: auf 1 HP dämpfen (nie direkt töten im Easy-Modus)

### [P1][MC] Ofen öffnet Panel
**Problem:** `openFurnace()` existiert, aber doPlace() triggert es nicht korrekt.
- `doPlace()` bei Raycast auf FURNACE → `openFurnace(key)` aufrufen
- Ofen-Panel: Input-Slot, Fuel-Slot, Output-Slot + animierter Fortschrittsbalken
- Schmelzrezepte: Iron Ore→Ingot, Gold Ore→Ingot, Sand→Glass, Log→Charcoal, Raw Fish→Cooked Fish, Cobble→Stone
- Fuel-Werte: Coal/Charcoal=8s, Log=3s, Planks=1.5s

### [P1][MC] Unterirdisches Mob-Spawning
- Surface-Y-Cache: `surfaceCache[cx][cz]` → `Int16Array` für schnelle Lookup
- Spawn-Check: `y < surfaceY(x,z) - 1` UND Block über Spawn ist AIR
- Betrifft: Zombie, Skeleton, Creeper, Spider
- Lichtlevel-Simulation: spawn nur wenn >3 Blöcke von Oberfläche entfernt (approximiert Dunkelheit)

### [P2][MC] Schneefall + Schnee-Akkumulation
- Snow Layer Block (schon vorhanden als ID) auf Oberflächen-Blöcken in Snow-Biom
- Bei Regen in kalten Biomen → Schnee statt Regen-Partikel
- Schnee akkumuliert bis zu 1 Block Höhe (8 Layer)
- Wasser gefriert zu Eis in kalten Biomen

### [P2][MC] Elytra fliegen
- Item schon vorhanden (ELYTRA), Gleit-Mechanik schon in `updatePlayer()`
- Echter Flug: Doppel-Leertaste im Survival nicht möglich → nur mit Feuerwerk-Rakete beschleunigen
- Firework Rocket: Item + in Hand → Schub beim Gleiten
- Crafting: Paper + Gunpowder = Firework Rocket

### [P2][MC] Trident
- Neues Weapon-Item: TRIDENT
- Werfen: wie Bogen, aber Trident fliegt und kehrt zurück (Loyality-Enchant)
- Schaden: 9 Herzen (stärker als Schwert)
- Channeling-Enchant: bei Gewitter → Blitz beschwören
- Drop: sehr selten von Drowned

### [P2][MC] Drowned Mob
- Unterwasser-Zombie: spawnt in Flüssen/Meeren (Y < WATER_LEVEL)
- KI: schwimmt zum Spieler, Melee-Angriff
- Drops: Rotten Flesh, selten Trident (1% Chance), selten Copper Ingot
- Wirft Trident wenn er einen hat

### [P2][MC] Phantom Mob
- Spawnt wenn Spieler 3+ In-Game-Tage nicht geschlafen hat (Schlaf-Counter nötig)
- Fliegt hoch, stürzt dann auf Spieler herab
- Schaden: 2 Herzen, Reichweite von oben
- Drops: Phantom Membrane (für Elytra-Reparatur)
- Motivation: Bett benutzen zu wollen

### [P2] Schaf Wolle + Farben
- Schaf hat zufällige Woll-Farbe bei Spawn (weiß/grau/braun/schwarz/rot/gelb)
- Schere (2x Iron Ingot) → klicken auf Schaf → Wool-Drop (1–3)
- Wollfarbe bestimmt Drop-Farbe
- Wool → Bett crafting (3 Wool + 3 Planks)
- Wool + Dye → gefärbte Wolle (8 Farben)

### [P2] Kuh melken
- Rechtsklick mit Empty Bucket auf Kuh → Milk Bucket
- Milk Bucket konsumieren → alle Status-Effekte aufheben (Poison, Hunger etc.)
- Cooldown: Kuh kann erst nach 5 Minuten erneut gemolken werden

### [P2][PERF] Frustum Culling
- Chunks außerhalb des Kamera-Frustums komplett überspringen beim Rendern
- THREE.Frustum + Chunk-AABB (16×384×16)
- Implementierung in `frame()` vor dem render()-Aufruf: Mesh.visible = frustumIntersects
- Erwarteter Gewinn: 20–40% FPS auf schwacher Hardware

### [P2] Renderable Lichtquellen
- THREE.PointLight Pool (max 8 aktive Lights gleichzeitig, nach Distanz priorisiert)
- Fackel: Radius 6, orange (0xff8833), intensity 0.8
- Lava: Radius 10, rot-orange (0xff4400), intensity 1.2
- Glowstone: Radius 8, gelb (0xffee88), intensity 1.0
- Campfire: Radius 7, warm-orange, flackert (Intensity ±0.15 random)
- `scanDynLights()` läuft schon — nur THREE.PointLight-Erstellung fehlt

### [P3][MC] Copper + Oxidation
- Copper Ore (neues Erz, Y 16–112)
- Copper Ingot → Copper Block, Cut Copper, Copper Stairs/Slab
- Oxidation: 4 Stufen (frisch → belegt → verwittert → oxidiert) über Zeit
- Wachsed Copper: mit Wachs behandelt → oxidiert nicht
- Blitz trifft Copper → zurück zu frisch

### [P3][MC] Amethyst
- Amethyst Geode: sphärische Struktur in Y -64–30
- Schichten: Smooth Basalt → Calcite → Amethyst
- Budding Amethyst → wächst Amethyst Cluster (4 Stages)
- Drop: Amethyst Shard (4x von vollreifem Cluster)
- Verwendung: Spyglass (Fernglas), Tinted Glass

### [P3] Spyglass / Fernglas
- Item: Copper Ingot + Amethyst Shard
- Rechtsklick gehalten → Zoom-Effekt (FOV auf 10–15 reduzieren)
- Crosshair wird kreisförmig (CSS-Overlay)
- Loslassen → FOV zurück

### [P3][MC] Warden + Deep Dark
- Neues Biom: Deep Dark (ab Y -40, Sculk-Blöcke, kein normales Mob-Spawn)
- Sculk Sensor: registriert Lärm (Schritte, Abbau) → aktiviert sich
- Warden: stärkster Mob im Spiel (500 HP, 30 Schaden pro Hit)
- Spawn: Sculk Shrieker ruft Warden bei zu viel Lärm
- Drops: Sculk Catalyst
- Strategie: schleichen, nicht kämpfen

### [P3] Angeln vollständig machen
- `fishingState` und `tickFishing()` vorhanden, aber nur Flash-Message
- Echter Bobber als Entity (kleines Mesh im Wasser)
- Beißen-Animation: Bobber taucht unter
- Rechtsklick einziehen → Item-Drop (Fish, Schatz, Müll je nach Luck)
- Schatz: Enchanted Book, Saddle, Name Tag, Bow (selten)
- Müll: Lily Pad, Stick, String, Boots (beschädigt)
