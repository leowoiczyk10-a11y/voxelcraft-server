# Task: Uploaded Files in Repo einordnen

## Kontext
VoxelCraft-Repo hat folgende Struktur nach dem Split:
```
voxelcraft-server/
├── index.html
├── css/style.css
├── js/
│   ├── state.js | constants.js | textures.js | recipes.js
│   ├── world.js | worker.js | physics.js
│   ├── mobs.js | combat.js | inventory.js
│   ├── sound.js | ui.js | multiplayer.js | main.js
├── docs/
│   ├── SECTION_MAP.md | SYSTEMS.md | BLOCKS.md
│   ├── RECIPES.md | MOBS.md | ROADMAP.md
├── prompts/
│   ├── SPLIT_TASK.md | UPLOAD_TASK.md
├── server.js       ← NIE ANFASSEN
├── three.module.js ← NIE ANFASSEN
└── addons/         ← NIE ANFASSEN
```

## Deine Aufgabe
Der User hat Dateien hochgeladen. Ordne jede Datei dem richtigen Verzeichnis zu
und kopiere sie dorthin. Dann committe ins Repo.

## Zuordnungs-Regeln

### Automatisch nach Dateiname:
| Muster | Ziel |
|---|---|
| `index.html` | `/` (Root) |
| `style.css`, `*.css` | `css/` |
| `state.js` | `js/` |
| `constants.js` | `js/` |
| `textures.js` | `js/` |
| `recipes.js` | `js/` |
| `world.js` | `js/` |
| `worker.js` | `js/` |
| `physics.js` | `js/` |
| `mobs.js` | `js/` |
| `combat.js` | `js/` |
| `inventory.js` | `js/` |
| `sound.js` | `js/` |
| `ui.js` | `js/` |
| `multiplayer.js` | `js/` |
| `main.js` | `js/` |
| `CLAUDE.md` | `/` (Root) |
| `*.md` (Doku) | `docs/` |
| `*TASK.md`, `*PROMPT.md` | `prompts/` |
| `server.js` | NICHT kopieren, NIE überschreiben |
| `three.module.js` | NICHT kopieren, NIE überschreiben |

### Bei Unklarheit:
- Dateiinhalt lesen
- Wenn JS mit `export` → `js/`
- Wenn reines Markdown mit Doku-Inhalt → `docs/`
- Wenn Markdown mit Task-Beschreibung/Prompt → `prompts/`
- Wenn unklar → User fragen BEVOR kopiert wird

## Vorgehen
```bash
# 1. Repo klonen falls noch nicht vorhanden
git clone https://github.com/leowoiczyk10-a11y/voxelcraft-server.git
cd voxelcraft-server

# 2. Für jede hochgeladene Datei: Ziel bestimmen (Tabelle oben)
# 3. Datei kopieren:
cp /mnt/user-data/uploads/DATEINAME.js js/DATEINAME.js

# 4. Alle kopierten Dateien commiten:
git add .
git commit -m "Update: [Dateinamen]"
git push
```

## Sicherheits-Checks
Vor dem Kopieren prüfen:
```bash
# server.js darf NIEMALS überschrieben werden:
if [ "$DATEI" = "server.js" ]; then echo "SKIP - server.js ist geschützt"; fi

# three.module.js ebenfalls:
if [ "$DATEI" = "three.module.js" ]; then echo "SKIP - three.module.js ist geschützt"; fi
```

## Nach dem Kopieren
Kurze Zusammenfassung ausgeben:
- Welche Dateien wurden wohin kopiert
- Ob der Git Push erfolgreich war
- Falls eine Datei übersprungen wurde: warum
