# Section Map — index.html

> Nach jedem größeren Refactor aktualisieren.
> Zeilenbereiche als Orientierung — immer im echten File verifizieren.
> Suche nach `/* ===` Kommentaren für genaue Grenzen.

## CSS-Sektionen (ca. Zeile 1–400)
| Sektion | Suchstring | Beschreibung |
|---|---|---|
| CSS-Root / Variablen | `:root{` | Alle --mc-* CSS-Variablen, Farben |
| Hotbar CSS | `#hotbar` | Hotbar, Slots, Active-Highlight |
| Inventar CSS | `#invScreen` | Inv-Panel, Craft-Grid, Item-Slots |
| Mob-HP-Bar CSS | `#mobHp` | Mob-Gesundheitsanzeige |
| Armor HUD CSS | `#armorBar` | Rüstungsleiste unter Herzen |
| Touch-Controls CSS | `#joy` | Joystick, Action-Buttons |
| Overlay/Titlescreen CSS | `#overlay` | Start-Screen |
| Settings CSS | `#settingsMenu` | Einstellungs-Panel |
| Recipe Book CSS | `#recipeBook` | Rezept-Buch Modal |

## JS-Sektionen (ca. Zeile 400–6200)
| Sektion | Suchstring | Beschreibung |
|---|---|---|
| Block-Registry | `const BLOCKS =` | Block-IDs, Namen, Eigenschaften |
| Item-Registry | `const ITEMS =` | Item-Definitionen, Stack-Größen |
| Textur-Atlas | `function buildAtlas` | Procedural Canvas-Texturen für alle Blöcke |
| Icon-Atlas | `function buildIconAtlas` | 62 Item-Icons als Silhouetten |
| Rezept-Definitionen | `const RECIPES =` | Alle Crafting-Rezepte |
| Welt-Generator | `function generateChunk` | Terrain, Caves, Biome-Selection |
| Chunk-Worker | `workerCode` | Web-Worker String für Chunk-Gen |
| Greedy Meshing | `function greedyMesh` | Mesh-Optimierung |
| Physik / Kollision | `function updatePhysics` | AABB-Kollision, Gravity |
| Spieler-Controller | `function handleInput` | Bewegung, Maus, Touch |
| Inventar-Logik | `function openInventory` | Slot-Drag, Stacking, Crafting |
| Crafting-Logik | `function checkCraft` | 2x2 + 3x3 Rezept-Matching |
| Mob-System | `class Mob` | Mob-Klasse, KI-States |
| Mob-Spawner | `function spawnMobs` | Spawn-Regeln, Distanz-Check |
| Kampf-System | `function attackMob` | Schaden, Knockback, Armor-Berechnung |
| Bogen/Pfeil | `function shootArrow` | Projektil-Physik, Owner-Tracking |
| Sound-Engine | `const SFX =` | Web Audio API, Sounds |
| Day/Night | `function updateSky` | Himmel-Farben, Licht-Level |
| Multiplayer | `function initWS` | WebSocket-Handler, Player-Sync |
| Inv-Persistenz | `function saveInventory` | localStorage Save/Load |
| Render-Loop | `function animate` | requestAnimationFrame, Haupt-Loop |
| HUD-Update | `function updateHUD` | Herzen, Hotbar, XP-Bar |
| Touch-Setup | `function initTouch` | Touch-Events, Joystick |

## Wichtige globale Variablen
```js
world          // Map<string, Uint8Array> — alle Chunk-Daten
chunkMeshes    // Map<string, THREE.Mesh>
player         // { pos, vel, health, armor, inventory, hotbar, ... }
mobs           // Array<Mob>
scene          // THREE.Scene
camera         // THREE.PerspectiveCamera
renderer       // THREE.WebGLRenderer
ws             // WebSocket zur server.js
```
