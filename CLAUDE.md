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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
