# VoxelCraft — Claude Code Kontext

## Projekt-Übersicht
Browser-basierter Minecraft-Klon. Three.js, ES-Module, kein Build-Step.
Multiplayer via WebSocket (server.js auf Railway).
Alle Spiel-Logik lebt in `index.html` (eine einzige `<script type="module">`-Sektion).

## Dateien
| Datei | Beschreibung |
|---|---|
| `index.html` | Gesamtes Spiel (~6200 Zeilen, CSS Zeile 16–300, JS ab Zeile 527) |
| `server.js` | WebSocket-Server — **NIE ANFASSEN** |
| `three.module.js` | Lokales Three.js Bundle — **NIE ANFASSEN** |
| `addons/` | Three.js Addons — **NIE ANFASSEN** |
| `manifest.json` / `sw.js` | PWA-Support |

## Referenz-Dokumente (zuerst prüfen, bevor index.html gelesen wird)
| Datei | Wann laden |
|---|---|
| `docs/SECTION_MAP.md` | Immer zuerst — zeigt exakte Zeilenbereiche + Suchstrings |
| `docs/BLOCKS.md` | Block-IDs, Eigenschaften, neue Blöcke hinzufügen |
| `docs/RECIPES.md` | Crafting-Rezepte lesen/hinzufügen |
| `docs/MOBS.md` | Mob-Typen, KI, Spawn-Regeln |
| `docs/SYSTEMS.md` | Überblick aller implementierten Systeme |
| `docs/ROADMAP.md` | Offene Features + Prioritäten |

## Eiserne Regeln
1. `server.js`, `three.module.js`, `addons/` werden **niemals** modifiziert
2. Kein CDN für Three.js — immer `./three.module.js`
3. Kein Build-Step — alles bleibt in `index.html`
4. Output immer nach `/mnt/user-data/outputs/index.html`
5. Vor jeder Implementierung: `docs/SECTION_MAP.md` lesen, dann **nur die relevanten Sektionen** per `sed` lesen (nicht die ganze Datei)
6. Nach Implementierung: Node.js Testharness für Logik-Checks wo möglich

## Workflow für neue Features

### Schritt 1: Docs lesen (nicht index.html!)
```bash
# Immer zuerst:
cat docs/SECTION_MAP.md

# Je nach Task zusätzlich:
cat docs/BLOCKS.md      # bei neuen Blöcken/Items
cat docs/MOBS.md        # bei Mob-Änderungen
cat docs/RECIPES.md     # bei Rezepten
cat docs/ROADMAP.md     # für Kontext und Prioritäten
```

### Schritt 2: Nur relevante Sektionen lesen
```bash
# Beispiel: Mob-Feature → nur Mob-Bereich lesen
sed -n '4558,4769p' index.html   # SURVIVAL + MOBS
sed -n '4019,4557p' index.html   # LOKALE MOB-KI

# Beispiel: neuer Block → nur Registry lesen
sed -n '527,572p' index.html     # KONFIG (Konstanten)
sed -n '752,1199p' index.html    # BLOCK-REGISTRY

# Genaue Zeilenbereiche: immer in docs/SECTION_MAP.md nachschauen
```

### Schritt 3: Feature implementieren
- Großer Batch, kein Micro-Editing
- Abhängigkeiten zwischen Sektionen beachten (SECTION_MAP.md zeigt sie)

### Schritt 4: Validieren
```bash
node -e "..." # Logik-Checks für nicht-grafische Systeme
```

### Schritt 5: Output
```bash
cp index.html /mnt/user-data/outputs/index.html
```

## Wann welche Sektionen lesen (Quick-Reference)
| Task | Sektionen aus SECTION_MAP.md |
|---|---|
| Neuer Block/Item | KONFIG, BLOCK-REGISTRY |
| Neue Textur/Icon | TEXTUR-ATLAS, ICON-ATLAS |
| Neues Rezept | REZEPTE (docs/RECIPES.md reicht oft) |
| Welt-Gen, Biome, Erze | NOISE + WELT-GEN, CHUNK+WORLD |
| Neuer Mob | SURVIVAL+MOBS, LOKALE MOB-KI, BLOCK-REGISTRY (für Konstante) |
| Kampf, Waffen | SURVIVAL+MOBS, PFEILE+PARTIKEL |
| Inventar, Crafting-UI | HUD (Inventar-Teil) |
| HUD, Menüs | HUD |
| Sound | SOUND |
| Multiplayer | MULTIPLAYER |
| Performance, Render | RENDERING, CHUNK-MESHING, CHUNK LOADING |
| Physik, Bewegung | PLAYER+KOLLISION, INPUT |
| Dimensionen/Nether | DIMENSIONEN+PORTAL |
| V2-Systeme (TNT/Feuer/Ackerbau) | ROADMAP V2 |

## Eigeninitiative & Überarbeitung
Claude Code darf und soll bei offensichtlichen Problemen eigenständig handeln:
- **Bugs** die beim Lesen einer Sektion auffallen: direkt fixen, im Output-Kommentar erwähnen
- **Dead Code / doppelte Funktionen**: entfernen wenn eindeutig sicher
- **Veraltete Kommentare**: aktualisieren
- **Performance-Probleme** in der gerade bearbeiteten Sektion: ansprechen oder direkt fixen
- Roadmap-Items die als Nebeneffekt lösbar sind (< 20 Zeilen Aufwand): umsetzen und in ROADMAP.md als erledigt markieren
- `docs/SECTION_MAP.md` nach Änderungen aktualisieren wenn sich Zeilennummern verschieben

## Wichtige globale Variablen (alle in index.html im top-level scope)
```js
world          // { chunks: Map<string,ChunkData>, getBlock, setBlock, ... }
chunkMeshes    // Map<string, SectionMesh[]>
player         // { x, y, z, vx, vy, vz, onGround, ... }
inv            // Array[36] — Haupt-Inventar
armor          // Array[4] — Rüstungs-Slots
hotbar         // alias auf inv[0..8]
selectedSlot   // number 0-8
mobsMap        // Map<id, MobObject>
scene          // THREE.Scene
camera         // THREE.PerspectiveCamera
renderer       // THREE.WebGLRenderer
ws / net       // WebSocket-Wrapper
dayTime        // 0.0–1.0 (0=Morgen, 0.5=Mittag, 0.75=Abend, 1=Nacht)
dimension      // 0=Oberwelt, 1=Nether, 2=End
settings       // { preset, renderDist, volume, ao, bloom, ... }
```
