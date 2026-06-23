# VoxelCraft — Claude Code Kontext

## Projekt-Übersicht
Browser-basierter Minecraft-Klon. Three.js, ES-Module, kein Build-Step.
Multiplayer via WebSocket (server.js auf Railway).

## Dateien
| Datei | Beschreibung |
|---|---|
| `index.html` | Gesamtes Spiel (~6200 Zeilen, ~408 KB) |
| `server.js` | WebSocket-Server — **NIE ANFASSEN** |
| `three.module.js` | Lokales Three.js Bundle |
| `addons/` | Three.js Addons (OrbitControls etc.) |
| `manifest.json` / `sw.js` | PWA-Support |

## Eiserne Regeln
1. `server.js` wird **niemals** modifiziert
2. Kein CDN für Three.js — immer `./three.module.js`
3. Kein Build-Step — alles bleibt in `index.html`
4. Output immer nach `/mnt/user-data/outputs/index.html`
5. Vor jeder Implementierung: vollständige Datei lesen, section map prüfen
6. Nach Implementierung: Node.js Testharness für Logik-Checks

## Workflow für neue Features
```
1. git clone → index.html vollständig lesen
2. Relevante Sektionen identifizieren (→ docs/SECTION_MAP.md)
3. Feature implementieren (großer Batch, kein Micro-Editing)
4. node -e "..." Validierung für nicht-grafische Logik
5. Output nach /mnt/user-data/outputs/index.html
```

## Referenz-Dokumente (nur laden wenn nötig)
- `docs/SECTION_MAP.md` — Zeilenbereiche aller Code-Sektionen in index.html
- `docs/SYSTEMS.md` — Alle implementierten Systeme (kurz)
- `docs/BLOCKS.md` — Block-ID-Registry + Eigenschaften
- `docs/RECIPES.md` — Alle Crafting-Rezepte
- `docs/MOBS.md` — Mob-Typen, KI, Spawn-Regeln
- `docs/ROADMAP.md` — Offene Features + MC-Vollständigkeits-Gap

## Was zu tun ist → docs/ROADMAP.md
