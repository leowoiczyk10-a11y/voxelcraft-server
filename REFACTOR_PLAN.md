# VoxelCraft — Modul-Refactor Plan
> Für Claude Code. Lies das komplett durch bevor du irgendwas anfasst.

## Ziel
`index.html` (6640 Zeilen, eine riesige `<script type="module">`) aufteilen in
echte ES-Module unter `js/`. Danach können Agents parallel an verschiedenen
Dateien arbeiten ohne sich zu überschreiben.

**Was NICHT geändert wird:** `server.js`, `three.module.js`, `addons/`, CSS, HTML-Gerüst.

---

## Das Kernproblem: Globaler Shared State

Es gibt **71 `let`-Variablen** im top-level scope die von allen Teilen des Codes
gelesen und geschrieben werden (`health`, `inv`, `player`, `dayTime`, usw.).
Außerdem gibt es ~92 Stellen wo UI-Funktionen (`renderHotbar`, `renderInventory`,
`flashMsg`) mitten in Spiellogik aufgerufen werden.

Die einzige saubere Lösung ohne alles umzuschreiben: **ein zentrales `state.js`**
das alle Globals hält, und alle Module importieren daraus.

---

## Ziel-Struktur

```
index.html          ← nur noch CSS + HTML-Gerüst + <script type="module" src="js/main.js">
js/
  state.js          ← ALLE let-Globals + THREE-Objekte (scene, camera, renderer)
  constants.js      ← alle const (Block-IDs, BLOCKS{}, ITEMS{}, TOOL{}, ARMOR{}, FOOD{}, PRESETS)
  sound.js          ← SFX-Objekt (Web Audio API)
  registry.js       ← RECIPES, matchRecipe(), recomputeCraft(), Furnace-Logik
  world.js          ← ChunkData-Klasse, world-Objekt, generateChunkData(), Noise, Biome, Strukturen
  rendering.js      ← Three.js Setup, Textur-Atlas, Meshing, Himmel, EgoHand, Bloom
  ui.js             ← HUD, Hotbar, Inventar, Settings, RecipeBook, Chat
  player.js         ← AABB-Kollision, updatePlayer(), Input-Events, Persistenz (saveInv/loadInv)
  mobs.js           ← Mob-Modelle, Mob-KI, Spawning, Kampf, Pfeile, Partikel
  network.js        ← net-Objekt, WebSocket-Handler, Avatar-Rendering
  systems.js        ← Dimensionen, Bosse, Redstone, Wasser-Fluss, V2-Systeme, Achievements
  main.js           ← startGame(), frame()-Loop, alles zusammenstecken
```

---

## Schritt-für-Schritt Vorgehen

### Schritt 0: Vorbereitung
```bash
mkdir -p js
cp index.html index.html.bak   # Sicherheitskopie
```
Noch KEINE Änderung an index.html.

---

### Schritt 1: `js/constants.js` extrahieren
**Was kommt rein:** Alle `const`-Deklarationen die reine Daten sind und
KEINE anderen Funktionen aufrufen:
- Block-ID-Konstanten (AIR, GRASS, DIRT, ... alles bis STONE_WALL etc., Zeilen ~756–900)
- `BLOCKS {}` Objekt (Zeilen ~752–1007)
- `ITEM {}`, `TOOL {}`, `ARMOR {}`, `FOOD {}` (Zeilen ~1008–1170)
- `BLOCK_MINE {}` (Zeile ~1091)
- `CHUNK_SIZE`, `Y_MIN`, `Y_MAX`, `WATER_LEVEL`, `LAVA_SEA`, `SECTION_H` etc.
- `PRESETS`, `SETTINGS_KEY`, `DEFAULT_PRESET`
- `isTouch`
- Helper-Funktionen die nur constants nutzen: `isTool()`, `isArmor()`, `isFood()`,
  `isSolid()`, `isTransparent()`, `isCrossPlant()`, `thing()`, `mineInfo()`,
  `armorPoints()`, `dropFor()`, `enchLvl()`

**Ende der Datei:**
```js
export { AIR, GRASS, DIRT, /* ...alle Block-IDs... */,
         BLOCKS, ITEM, TOOL, ARMOR, FOOD, BLOCK_MINE,
         CHUNK_SIZE, Y_MIN, Y_MAX, WATER_LEVEL, LAVA_SEA, SECTION_H,
         NUM_SECTIONS, SECTION_VOL, sectionOf, WORLD_HEIGHT,
         PRESETS, SETTINGS_KEY, DEFAULT_PRESET, isTouch,
         isTool, isArmor, isFood, isSolid, isTransparent, isCrossPlant,
         thing, mineInfo, armorPoints, dropFor, enchLvl };
```

**Abhängigkeiten:** Keine. Importiert nur `THREE` für eine Konstante falls nötig,
sonst völlig standalone.

**Test nach diesem Schritt:**
```bash
node --input-type=module < js/constants.js
```
Muss ohne Fehler durchlaufen.

---

### Schritt 2: `js/state.js` erstellen
Das ist der kritischste Schritt. Hier landen ALLE 71 `let`-Globals.

**Inhalt:**
```js
import * as THREE from '../three.module.js';
import { PRESETS, DEFAULT_PRESET, isTouch, SETTINGS_KEY, CHUNK_SIZE, HEALTH_MAX, HUNGER_MAX, AIR_MAX, SLOT_COUNT } from './constants.js';

// --- Settings ---
export let settings = Object.assign({...}, PRESETS[DEFAULT_PRESET]);
export let settingsOpen = false;
export let baseFov = settings.fov;
export let zoomActive = false;
export let RENDER_DISTANCE = settings.renderDist;
export let SIM_DISTANCE = settings.simDist;
export let UNLOAD_DISTANCE = RENDER_DISTANCE + 2;

// --- Three.js Objekte ---
export let scene, camera, renderer;
export function initThree(s, c, r) { scene = s; camera = c; renderer = r; }

// --- Spieler ---
export let player = { x:8.5, y:0, z:8.5, vx:0, vy:0, vz:0, onGround:false };
export let health = HEALTH_MAX, hunger = HUNGER_MAX, air = AIR_MAX;
export let dead = false, hurtT = 0, burnT = 0;
export let yaw = 0, pitch = 0;
export let gameMode = 'survival', flying = false;
export let selectedSlot = 0;
export let inv = new Array(SLOT_COUNT).fill(null);
export let armor = [null,null,null,null];

// --- Welt ---
export let SEED = 1337;
export let dimension = 0, genDim = 0;
export let dayTime = 0.3;
export let weather = 'clear';

// ... alle weiteren lets aus index.html ...

// Setter-Funktionen für Variablen die von mehreren Modulen geschrieben werden:
export function setHealth(v) { health = v; }
export function setHunger(v) { hunger = v; }
export function setDead(v) { dead = v; }
export function setDayTime(v) { dayTime = v; }
export function setDimension(v) { dimension = v; }
// usw.
```

**Wichtig:** Für Variablen die von außen mutiert werden brauchen wir Setter-Funktionen,
weil ES-Module-Exports von primitiven Typen (number, boolean) nicht direkt von außen
beschreibbar sind. Objekte (`player`, `inv`, `settings`) können direkt mutiert werden
da sie als Referenz exportiert werden.

**Test:** Alle anderen Module importieren state.js, nichts explodiert.

---

### Schritt 3: `js/sound.js` extrahieren
**Inhalt:** Das gesamte SFX-Objekt (Zeilen 573–751 in index.html).

```js
import { settings } from './state.js';
// ... SFX-Objekt ...
export { SFX };
```

Einfachster Schritt, SFX hat kaum nach-außen-Abhängigkeiten.

---

### Schritt 4: `js/world.js` extrahieren
**Inhalt:**
- `mulberry32`, `makePerlin` (Noise, Zeilen ~1396–1432)
- `generateChunkData()` (Biome, Terrain, Erze, Strukturen)
- `ChunkData`-Klasse / `Chunk`-Klasse
- `world`-Objekt mit `getBlock`, `setBlock`, `ensureChunkData`
- `clearAllChunks()`
- `overridesByChunk`, `setOverride()`
- `writeData()`

**Importiert:** `constants.js` (Block-IDs), `state.js` (SEED, dimension)

```js
export { world, generateChunkData, clearAllChunks, setOverride, overridesByChunk };
```

---

### Schritt 5: `js/registry.js` extrahieren
**Inhalt:**
- `RECIPES`-Array (Zeilen ~1200–1340)
- `matchRecipe()`, `recomputeCraft()`
- Furnace-Logik: `tickFurnace()`, `tickAllFurnaces()`, `furnaces`-Map
- `addItem()` — **Achtung:** ruft `renderHotbar()` auf. Lösung: Callback-Parameter
  ```js
  export function addItem(id, count, onRender = () => {}) { ...; onRender(); }
  ```
  In `main.js` dann: `addItem(id, count, () => { renderHotbar(); renderInventory(); })`

**Importiert:** `constants.js`, `state.js`

```js
export { RECIPES, matchRecipe, recomputeCraft, addItem, furnaces, tickAllFurnaces };
```

---

### Schritt 6: `js/rendering.js` extrahieren
**Inhalt:**
- Three.js Scene/Camera/Renderer Setup
- Textur-Helfer (`hashStr`, `px`, `rect` etc.)
- `paintTile()` — alle Block-Texturen
- `buildAtlasTexture()`, `blockIconURL()`, `itemIconURL()`
- `buildSectionGeometry()`, `meshChunk()`
- `applyBlockRes()`, dynamische Lichter, Bloom
- Himmel-Dome, `updateSky()`, `applyDayNight()`
- EgoHandItem: `heldTexture()`, `renderHeld()`

**Importiert:** `constants.js`, `state.js`

```js
export { scene, camera, renderer, chunkMeshes,
         buildAtlasTexture, meshChunk, updateSky, applyDayNight,
         blockIconURL, itemIconURL, renderHeld };
```

---

### Schritt 7: `js/ui.js` extrahieren
**Inhalt:**
- `renderHotbar()`, `renderInventory()`
- `showItemName()`, `showSelectedName()`
- `slotClick()`, `handleSlot()`, `quickTransfer()`
- `openInv()`, `closeInv()`, `toggleInv()`
- `renderRecipeBook()`, `openSettings()`, `applyPreset()`
- `addChatMsg()`, `openChat()`, `closeChat()`, `sendChat()`

**Importiert:** `constants.js`, `state.js`, `sound.js`, `registry.js`

Das Modul mit den meisten Abhängigkeiten, aber in sich kohärent.

```js
export { renderHotbar, renderInventory, showItemName, openInv, closeInv,
         addChatMsg, openChat, closeChat };
```

---

### Schritt 8: `js/mobs.js` extrahieren
**Inhalt:**
- `boxMesh()`, `legPivot()`, `makeMobModel()` — alle Mob-3D-Modelle
- `addMob()`, `removeMob()`, `clearMobs()`
- `attackMob()`, `rollDrops()`, `arrowHitMob()`
- `damagePlayer()`, `die()`, `respawn()`
- `survivalUpdate()`
- `spawnLocalMob()`, `updateLocalMobs()` — Mob-KI
- `makeArrowMesh()`, `updateArrows()` — Projektile
- Partikel: `poof()`, `breakParticles()`, `dustParticle()`
- GroundItems: `spawnGroundItem()`, `updateGroundItems()`

**Importiert:** alle bisherigen Module

```js
export { mobsMap, addMob, removeMob, attackMob, damagePlayer, die, respawn,
         survivalUpdate, updateLocalMobs, updateArrows, spawnGroundItem };
```

---

### Schritt 9: `js/network.js` extrahieren
**Inhalt:**
- Avatar-Rendering (`colorFor()`, `addAvatar()`, `moveAvatar()`, `removeAvatar()`)
- `net`-Objekt komplett
- `onWelcome()`

**Importiert:** alle bisherigen Module (net.handle ruft fast alles auf)

```js
export { net, avatars };
```

---

### Schritt 10: `js/player.js` extrahieren
**Inhalt:**
- `updatePlayer()` — AABB-Kollision, Gravity, Swim
- `updateWorld()` — Chunk-Load/Unload
- Input-Events (Keyboard, Mouse, Touch, Pointer Lock)
- `startBreak()`, `doPlace()`, `useBucket()`, Raycast
- `saveInv()`, `loadInv()`, `savePos()`, `loadPos()`
- `dropSelected()`

**Importiert:** alle bisherigen Module

```js
export { updatePlayer, updateWorld, player, yaw, pitch,
         locked, sprinting, jumpHeld };
```

---

### Schritt 11: `js/systems.js` extrahieren
**Inhalt:**
- `switchDimension()`, Portal-Logik
- Bosse: `spawnEndBoss()`, `updateBosses()`
- Redstone: `updateRedstone()`, `toggleLever()`
- `floodWater()`, `fillLoot()`
- V2-Systeme: TNT, Feuer, Angeln, Tränke, Beacon, Lagerfeuer
- Achievements: `unlockAch()`, `showDeathStats()`
- Minimap: `updateMinimap()`, `toggleMinimap()`
- `tickClimate()`, `tickV2()`

```js
export { switchDimension, updateBosses, updateRedstone,
         unlockAch, updateMinimap, tickV2 };
```

---

### Schritt 12: `js/main.js` + `index.html` aufräumen
**main.js:**
```js
import * as THREE from '../three.module.js';
import { ... } from './constants.js';
import { ... } from './state.js';
import { SFX } from './sound.js';
import { world } from './world.js';
import { buildAtlasTexture, meshChunk, updateSky, ... } from './rendering.js';
import { renderHotbar, renderInventory, ... } from './ui.js';
import { net } from './network.js';
import { updateLocalMobs, survivalUpdate, ... } from './mobs.js';
import { updatePlayer, updateWorld } from './player.js';
import { switchDimension, tickV2, updateBosses, ... } from './systems.js';

function startGame() { ... }
function frame(now) { ... requestAnimationFrame(frame); }
requestAnimationFrame(frame);
```

**index.html:** Das `<script type="module">` wird zu:
```html
<script type="module" src="js/main.js"></script>
```

---

## Reihenfolge & Regeln für Claude Code

### Goldene Regel: Ein Modul pro Session, Spiel muss danach noch laufen.

Solange index.html noch den kompletten Code enthält kannst du die neuen `.js`-Dateien
parallel schreiben. Erst wenn eine Datei fertig und getestet ist, wird der entsprechende
Block aus index.html entfernt und durch einen Import ersetzt.

### Teststrategie pro Schritt:
1. Neue Datei schreiben
2. `node --input-type=module < js/dateiname.js` — prüft Syntax + Import-Kette
3. Lokalen HTTP-Server starten: `npx serve . -p 3000`
4. Im Browser öffnen, kurz spielen — Fehler in der Console?
5. Erst dann den Block aus index.html entfernen

### Circular Dependency vermeiden:
Die Import-Reihenfolge ist strikt:
```
constants.js → state.js → sound.js → world.js → registry.js
  → rendering.js → ui.js → mobs.js → network.js → player.js
    → systems.js → main.js
```
Kein Modul darf etwas importieren das weiter rechts in dieser Kette steht.

### UI-Seiteneffekte in Logik-Funktionen:
Überall wo `renderHotbar()` oder `renderInventory()` in Nicht-UI-Funktionen aufgerufen
wird, Callback-Pattern verwenden:
```js
// Vorher (in registry.js):
function addItem(id, count) { ...; renderHotbar(); }

// Nachher:
function addItem(id, count, onChanged = () => {}) { ...; onChanged(); }

// In main.js beim Aufrufen:
const uiUpdate = () => { renderHotbar(); if(invOpen) renderInventory(); };
// Dann: addItem(id, count, uiUpdate);
```

### CLAUDE.md aktualisieren:
Nach dem Refactor die Workflow-Sektion in CLAUDE.md anpassen — statt
`sed -n 'X,Yp' index.html` dann `cat js/mobs.js` etc.

---

## Aufwandsschätzung
- Schritt 1–3 (constants, state, sound): ~1 Session, risikoarm
- Schritt 4–6 (world, registry, rendering): ~1–2 Sessions, mittleres Risiko
- Schritt 7–9 (ui, mobs, network): ~1–2 Sessions, höchstes Risiko (meiste Kopplungen)
- Schritt 10–12 (player, systems, main): ~1 Session
- Gesamt: 4–6 Sessions reiner Refactor, kein neues Feature

Danach: Agents können parallel an `mobs.js`, `ui.js`, `world.js` arbeiten
ohne sich zu beißen.
