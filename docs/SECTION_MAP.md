# Section Map — index.html
> Zeilennummern beziehen sich auf die aktuelle index.html.
> Bei größeren Refactors: Nummern mit `grep -n "SUCHSTRING" index.html` verifizieren.
> Sektionsgrenzen erkennbar an `// =====================================================================` Kommentaren.

## CSS (Zeile 16–300)
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| CSS Variablen / Root | 17–70 | `:root{` | Alle --mc-* CSS-Variablen, Farben, UI-Scale |
| Hotbar CSS | ~71 | `#hotbar` | Hotbar, Slots, Active-Highlight |
| Inventar CSS | ~130 | `#invScreen` | Inv-Panel, Craft-Grid, Item-Slots |
| Mob-HP-Bar CSS | ~180 | `#mobHp` | Mob-Gesundheitsanzeige |
| Armor HUD CSS | ~200 | `#armorBar` | Rüstungsleiste unter Herzen |
| Touch-Controls CSS | ~220 | `#joy` | Joystick, Action-Buttons |
| Overlay/Titlescreen CSS | ~250 | `#overlay` | Start-Screen |
| Settings CSS | ~270 | `#settingsMenu` | Einstellungs-Panel |
| Recipe Book CSS | ~285 | `#recipeBook` | Rezept-Buch Modal |

## HTML-Gerüst (Zeile 301–526)
Canvas, HUD-Divs, Overlay, Inventar-Screen, Settings-Panel, Touch-Controls.
Suchstring für einzelne Elemente: `id="elementId"` direkt im HTML.

## JS — Sektionen (ab Zeile 527)

### Grundkonfiguration & Konstanten
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| KONFIG | 527–572 | `const CHUNK_SIZE` | isTouch, Chunk-Größe, Y_MIN/MAX, PRESETS, Settings |
| SOUND | 573–751 | `const SFX =` | Web Audio API, alle synthetischen Sounds, SFX.dig/place/hit/etc |

### Block- & Item-Registry
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| BLOCK-REGISTRY | 752–1007 | `const BLOCKS =` | Block-IDs als Konstanten, BLOCKS{}-Objekt, Biome-Blöcke, Spezialblöcke |
| ITEM/TOOL/ARMOR/FOOD | 1008–1170 | `function thing(id)` | ITEM{}, TOOL{}, ARMOR{}, FOOD{}, Helper-Funktionen (isFood/isTool/isArmor) |
| MINE-INFO & INVENTORY-HELPERS | 1170–1199 | `function mineInfo` | mineInfo(), armorPoints(), addItem(), dropFor() |
| REZEPTE | 1200–1395 | `const RECIPES =` | RECIPES-Array, matchRecipe(), recomputeCraft(), Ofen/Furnace-Logik |

### Welt-Generierung
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| NOISE + WELT-GEN | 1396–1910 | `function mulberry32` | Perlin-Noise, generateChunkData(), Biom-Noise, Erz-Verteilung, Strukturen (Dorf/Dungeon/Tempel) |
| OVERRIDES | 1911–1930 | `function setOverride` | Block-Overrides vom Server (Multiplayer-Sync) |
| CHUNK + WORLD | 1931–2036 | `function writeData` | ChunkData-Klasse, world.getBlock/setBlock, clearAllChunks |

### Rendering & Texturen
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| TEXTUR-HELFER | 2037–2055 | `function hashStr` | hashStr, clamp255, shadeHex, px(), rect(), noiseFill() |
| TEXTUR-ATLAS | 2056–2461 | `function paintTile` | paintTile() für jeden Block-Typ, ore(), flowerTile() |
| ATLAS-BUILD & ICONS | 2462–2631 | `function buildAtlasTexture` | buildAtlasTexture(), blockIconURL(), itemIconSpec(), paintItemIcon(), itemIconURL() |
| UV-MAPPING & MESHING | 2632–2783 | `function tileUV` | tileUV(), blockTileIndex(), faceColor(), buildSectionGeometry(), meshChunk() |
| RENDERING | 2784–2867 | `function applyBlockRes` | applyBlockRes(), Torch-Glow, Dyn. Lichter, Bloom |
| HIMMEL & DAY/NIGHT | 2868–2990 | `function updateSky` | Himmel-Dome, Sonne/Mond, Sterne, Wolken, Sternschnuppen, updateSky(), applyDayNight() |
| EGO-HANDITEM | 2991–3066 | `function heldTexture` | Gehaltenes Item vor Kamera, Bob-Animation, Swing |

### Spieler & Welt-Interaktion
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| CHUNK LOADING | 3067–3100 | `function updateWorld` | updateWorld(), Chunk-Load/Unload-Radius |
| PLAYER + KOLLISION | 3101–3201 | `function moveAxis` | updatePlayer(), AABB-Kollision, stepAxis(), Gravity, Swim |
| VOXEL-RAYCAST | 3202–3387 | `function raycast` | DDA-Raycast, liquidRay(), useBucket(), doPlace(), startBreak() |
| INPUT | 3388–3434 | `function dropSelected` | dropSelected(), isActive(), Tastatur-Events, Pointer Lock, Touch-Bewegung |

### Game-Start & Persistenz
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| GAME-START & PERSISTENZ | 3421–3492 | `function startGame` | startGame(), savePos/loadPos, saveInv/loadInv, Serialisierung |

### HUD & UI
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| HUD — Item-Namen | 3493–3508 | `function showItemName` | showItemName(), showSelectedName() — Tooltip + Hotbar-Name-Fade |
| HUD — Hotbar | 3509–3534 | `function renderHotbar` | renderHotbar(), hex(), Slot-Rendering |
| HUD — Inventar-Render | 3535–3580 | `function setPointer` | durBar(), slotInner(), slotDiv(), renderInventory() |
| HUD — Inventar-Logik | 3581–3712 | `function slotClick` | slotClick(), splitClick(), handleSlot(), quickTransfer(), Touch-Tip |
| HUD — Inventar-Helper | 3713–3812 | `function invCount` | invCount(), recipeNeed(), autoFill(), renderRecipeBook(), openInv/Table/Furnace/Chest/Anvil/Enchanter |
| HUD — Inventory-Close & Settings | 3813–3935 | `function closeInv` | closeInv(), toggleInv(), Settings-Sync, applyPreset(), openSettings() |

### Multiplayer
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| MULTIPLAYER | 3936–4030 | `function colorFor` | Avatar-Rendering, nameTag, onWelcome(), WebSocket-Handler, net.send/connected |

### Mobs & Kampf
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| MOB-MODELLE | 4031–4298 | `function boxMesh` | 3D-Mob-Modelle (boxMesh, legPivot, makeMobModel für alle Mob-Typen) |
| MOB-MANAGEMENT | 4299–4361 | `function updateMobsFromTick` | addMob/removeMob/clearMobs, HP-Bar, updateMobsFromTick, onMobHp |
| KAMPF | 4362–4430 | `function attackMob` | attackMob(), rollDrops(), shootBow(), arrowHitMob(), eat(), damagePlayer(), die(), respawn() |
| SURVIVAL-UPDATE | 4512–4564 | `function survivalUpdate` | survivalUpdate() — Hunger, Regen, Lava-Schaden, Poison-Tick |
| LOKALE MOB-KI | 4565–4770 | `function spawnLocalMob` | spawnLocalMob(), trySpawnPoint(), updateLocalMobs(), Mob-KI States (idle/chase/attack), Zucht |
| PFEILE & PARTIKEL | 4771–5030 | `function makeArrowMesh` | Pfeil-Physik, updateArrows(), Partikel (Poof/Break/Dust/Explosion), GroundItems, DamagePop |

### Spieler-Systeme
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| MINING & WERKZEUGE | 5031–5092 | `function addToolItem` | breakBlock(), damageTool(), updateAim(), crosshairHit() |
| XP & LEVEL | 5093–5134 | `function xpForLevel` | xpForLevel(), renderXP(), addXP(), XP-Orbs |
| KOMPASS | 5135–5169 | `function placeOnCompass` | updateCompass(), Himmelsrichtung, Spawn-Marker |
| SCHLAFEN | 5170–5194 | `function isNightTime` | trySleep(), Nacht-Skip, Respawn-Punkt |
| TAG/NACHT-AMBIENT | 5195–5295 | `function updateAmbient` | Vogel/Grille-Sounds, Glut/Glühwürmchen, Fledermäuse, Blätter, Vögel |
| CHAT | 5296–5332 | `function escTxt` | addChatMsg(), openChat/closeChat(), sendChat() |
| PvP | 5333–5358 | `function avatarInView` | avatarInView(), attackPlayer() |

### Welt-Systeme
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| DIMENSIONEN + PORTAL | 5359–5529 | `function setOverrideInto` | switchDimension(), Nether/End-Portale, Pferd/Reiten, Villager-Handel, Schienen |
| BOSSE | 5530–5662 | `function spawnFlyingMob` | Enderdrache, Wither, Ghast/Blaze, End-Kristalle, Endboss-Sequenz |
| REDSTONE | 5663–5688 | `function updateRedstone` | Hebel→Draht→Lampe, toggleLever() |
| WASSER-FLUSS | 5689–5718 | `function floodWater` | floodWater(), Loot-Truhen fillLoot() |

### Main Loop
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| MAIN LOOP | 5719–5812 | `function frame` | frame() = requestAnimationFrame, alle update-Calls, Render |

### V2-Systeme (Roadmap)
| Sektion | Zeilen | Suchstring | Beschreibung |
|---|---|---|---|
| ROADMAP V2 | 5813–6019 | `function igniteTNT` | TNT, Feuer, Ackerbau (Weizen), Angeln, Zucht/Zähmen, Tränke, Ofen, Wetter, Beacon, Lagerfeuer |
| ACHIEVEMENTS | 6020–6065 | `function unlockAch` | unlockAch(), showDeathStats(), Statistiken |
| MINIMAP & EFFEKT-HUD | 6066–6186 | `function surfaceColor` | updateMinimap(), toggleMinimap(), updateEffectsHUD(), tickClimate(), tickSugarcane(), tickV2() |

---

## Abhängigkeiten zwischen Sektionen
```
KONFIG
  └─ BLOCK-REGISTRY → ITEM/TOOL/ARMOR → REZEPTE
       └─ NOISE+WELT-GEN → CHUNK+WORLD → CHUNK LOADING
            └─ TEXTUR-ATLAS → UV-MAPPING → RENDERING
                 └─ PLAYER+KOLLISION → INPUT
                      └─ MOB-KI → KAMPF → SURVIVAL-UPDATE
                           └─ HUD → MULTIPLAYER → MAIN LOOP
```

## Wichtige globale Variablen
```js
world          // { chunks: Map<string,ChunkData>, getBlock, setBlock }
player         // { x, y, z, vx, vy, vz, onGround }
inv            // Array[36] — Haupt-Inventar
armor          // Array[4] — Rüstungs-Slots
selectedSlot   // 0–8
mobsMap        // Map<id, MobObject>
scene          // THREE.Scene
camera         // THREE.PerspectiveCamera
renderer       // THREE.WebGLRenderer
net            // WebSocket-Wrapper { send(), connected }
dayTime        // 0.0–1.0 (0=Morgen, 0.5=Mittag, 0.75=Abend)
dimension      // 0=Oberwelt, 1=Nether, 2=End
settings       // { preset, renderDist, volume, ao, bloom, uiScale, ... }
```

## Sektion schnell finden
```bash
# Zeilennummer einer Funktion:
grep -n "function NAME" index.html

# Sektion-Beginn:
grep -n "SUCHSTRING" index.html | head -3

# Sektion lesen (Beispiele):
sed -n '573,751p' index.html    # Sound
sed -n '752,1007p' index.html   # Block-Registry
sed -n '1200,1395p' index.html  # Rezepte
sed -n '4565,4770p' index.html  # Lokale Mob-KI
sed -n '5719,5812p' index.html  # Main Loop
```
