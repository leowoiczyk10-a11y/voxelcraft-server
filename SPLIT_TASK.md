# Task: VoxelCraft index.html aufteilen

## Ziel
Die ~6200-Zeilen `index.html` in feature-kohärente Dateien aufteilen, sodass
zukünftige Änderungen nur die jeweils relevante Datei betreffen.
Das Spiel muss danach exakt gleich funktionieren wie vorher.

## Ziel-Dateistruktur
```
voxelcraft-server/
├── index.html          ← nur noch HTML-Gerüst + <link>/<script> Tags
├── css/
│   └── style.css       ← gesamtes CSS in einer Datei (einfacher als weiter splitten)
├── js/
│   ├── state.js        ← globaler Mutable State (world, player, scene, etc.)
│   ├── constants.js    ← BLOCKS, ITEMS, Biome-Definitionen
│   ├── textures.js     ← buildAtlas(), buildIconAtlas()
│   ├── recipes.js      ← RECIPES Array + checkCraft()
│   ├── world.js        ← Chunk-Generierung, Greedy Meshing, Chunk-Management
│   ├── worker.js       ← Web Worker Code (standalone, KEIN import)
│   ├── physics.js      ← AABB-Kollision, updatePhysics(), Gravity
│   ├── mobs.js         ← Mob-Klasse, KI State Machine, Spawner, Drops
│   ├── combat.js       ← Angriff, Bogen/Pfeile, Schadens-Berechnung
│   ├── inventory.js    ← Inventar-Logik, Drag&Drop, Persistenz (localStorage)
│   ├── sound.js        ← Web Audio API, alle SFX
│   ├── ui.js           ← HUD-Updates, Menüs, Recipe Book, Touch-Setup
│   ├── multiplayer.js  ← WebSocket-Handler, Spieler-Sync
│   └── main.js         ← Init, Game Loop (animate()), Render
├── server.js           ← NIE ANFASSEN
├── three.module.js     ← NIE ANFASSEN
└── addons/             ← NIE ANFASSEN
```

## Wann welche Datei gelesen werden muss (für zukünftige Tasks)
| Feature-Task | Dateien lesen |
|---|---|
| Neuen Block/Item hinzufügen | `constants.js` |
| Neue Textur/Icon | `textures.js` |
| Neues Rezept | `recipes.js` |
| Welt-Generation, Biome, Erze | `world.js`, `worker.js` |
| Neuen Mob | `mobs.js`, `constants.js` |
| Kampf, Waffen, Schaden | `combat.js`, `constants.js` |
| Inventar, Crafting-UI | `inventory.js`, `ui.js` |
| HUD, Menüs, CSS | `ui.js`, `css/style.css` |
| Sound | `sound.js` |
| Multiplayer | `multiplayer.js` |
| Performance, Render-Loop | `main.js`, `world.js` |
| Physik, Bewegung | `physics.js` |

## Vorgehen

### Schritt 1: index.html vollständig lesen
Komplette Datei lesen. Sections identifizieren anhand der `/* === */` Kommentare.
Keine Änderungen vornehmen bis der Plan steht.

### Schritt 2: state.js zuerst erstellen
Das ist das kritischste File. Alle globalen Variablen die zwischen Modulen
geteilt werden (world, player, scene, camera, renderer, mobs, ws, etc.)
müssen hier als exportiertes Objekt raus:

```js
// js/state.js
export const state = {
  world: new Map(),
  chunkMeshes: new Map(),
  pendingChunks: new Set(),
  player: null,      // wird in main.js initialisiert
  mobs: [],
  scene: null,
  camera: null,
  renderer: null,
  ws: null,
  remotePlayers: new Map(),
  // ... alle weiteren globalen Vars
};
```

state.js importiert NICHTS aus anderen game-Modulen. Null Circular Deps.

### Schritt 3: Module der Reihe nach extrahieren
Reihenfolge (abhängigkeitsfreie zuerst):
1. `constants.js` (keine Abhängigkeiten)
2. `state.js` (keine Abhängigkeiten)
3. `sound.js` (nur Web Audio, kein state nötig)
4. `textures.js` (nur Canvas, evtl. constants)
5. `recipes.js` (nur constants)
6. `worker.js` (standalone, KEIN export/import — wird via Blob geladen)
7. `world.js` (state, constants, worker)
8. `physics.js` (state, constants)
9. `mobs.js` (state, constants, world, sound)
10. `combat.js` (state, mobs, sound, world)
11. `inventory.js` (state, constants, recipes, sound)
12. `multiplayer.js` (state, world, mobs)
13. `ui.js` (state, inventory, sound)
14. `input.js` (state, physics, inventory, ui, combat, world)
15. `main.js` (alles — initialisiert und startet)

### Schritt 4: Web Worker korrekt behandeln
Der Worker-Code ist aktuell ein String im Code (`const workerCode = \`...\``).
Extrahiere ihn als echte Datei `js/worker.js`.
In `world.js` dann:
```js
const worker = new Worker('./js/worker.js');
// statt: new Worker(URL.createObjectURL(new Blob([workerCode])))
```
Der worker.js darf KEINE ES-Module-Imports haben. Alles was er braucht
(noise-Funktionen etc.) muss inline in worker.js sein.

### Schritt 5: CSS extrahieren
Gesamtes `<style>...</style>` aus index.html raus nach `css/style.css`.
In index.html ersetzen durch: `<link rel="stylesheet" href="./css/style.css">`

### Schritt 6: index.html schlank machen
Nach dem Split sollte index.html nur noch enthalten:
- `<head>` mit Meta-Tags, manifest, font-links, style-link
- Das HTML-Gerüst (canvas, hud, overlay, invScreen etc.)
- Ganz unten: `<script type="module" src="./js/main.js"></script>`

### Schritt 7: Validierung
```bash
# Syntax-Check aller neuen JS-Files:
node --input-type=module < js/constants.js 2>&1 | head -5
node --input-type=module < js/state.js 2>&1 | head -5
# ... etc.

# Prüfen dass keine alten globalen Variablen vergessen wurden:
grep -n "^const world\|^let world\|^var world" js/*.js
grep -n "^const player\|^let player" js/*.js
# Alle globalen Defs sollten nur noch in state.js sein
```

## Wichtige Regeln
- `server.js`, `three.module.js`, `addons/` werden NICHT angefasst
- Three.js Import bleibt: `import * as THREE from './three.module.js'`
- Kein NPM, kein Webpack, kein Build-Step — alles native ES-Module
- Alle neuen Dateien nach `/mnt/user-data/outputs/` ausgeben
- index.html ebenfalls nach `/mnt/user-data/outputs/index.html`

## Erfolgskriterium
Das Spiel läuft nach dem Split identisch. Keine neuen Funktionen, keine Fixes.
Rein strukturelle Änderung.
