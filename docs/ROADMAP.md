# Roadmap

## Legende
`[P1]` = hoher Impact, realistisch umzusetzen
`[P2]` = mittlerer Impact
`[P3]` = großer Scope, später
`[MC]` = fehlt für Minecraft-Vollständigkeit
`[PERF]` = Performance-Kritisch

---

## Kurzfristig (nächste Sessions)

### [P1] Item-Namen GUI
- Tooltip beim Hover über Hotbar/Inventar-Slot (MC-Style: lila Rahmen, Itemname)
- Name-Fade-In über Hotbar wenn Slot gewechselt oder Item aufgenommen
- Implementierung: CSS + JS, kein großer Aufwand

### [P1] Unterirdisches Mob-Spawnen
- Spawner muss Terrain-Surface pro (x,z) kennen
- Mob spawn nur wenn Y < surface[x][z] UND Höhle (Luftblock über Spawn-Pos)
- Betrifft: alle Hostile Mobs (Creeper, Skeleton, Enderman)
- Separates Surface-Cache-Array nötig

### [P1] Ofen-UI
- Block Furnace anklickbar → öffnet Ofen-Panel
- Slots: Input (1), Fuel (1), Output (1)
- Fortschrittsbalken für Schmelz-Dauer
- Schmelzrezepte: Iron Ore→Iron Ingot, Gold Ore→Gold Ingot, Sand→Glass, etc.
- Fuel: Coal/Log/Planks (verschiedene Burn-Times)

### [P2] Bett + Schlafen
- Bett-Block (crafting: 3 Wool + 3 Planks)
- Anklicken: Modal "Schlafen?" → Nacht überspringen (bei keine Mobs in der Nähe)
- Spawnpunkt setzen
- Server-autoritativ (alle Spieler müssen schlafen oder Mehrheit)

### [P2] Keep-Inventory Toggle
- Setting in Settings-Menu
- Bei Tod: Inventar behalten statt droppen
- localStorage für Setting

### [P2] Axe/Shovel Icons unterscheidbar
- Aktuelle Silhouetten zu ähnlich
- Shovel: längere, schmälere Klinge
- Axe: asymmetrische Axt-Form

---

## Mittelfristig

### [P1][MC] Hunger-System
- Hunger-Bar (10 Hühnerkeulchen) unter Herzen
- Hunger sinkt über Zeit + bei Sprint/Kampf
- HP-Regen nur wenn Hunger > 18/20
- Schaden wenn Hunger = 0 (auf 1 HP, nie Tod durch Hunger im Easy-Mode)
- Food-Items: Bread, Cooked Meat, Apple, etc. (Crafting/Drops)

### [P1][MC] Chest-UI
- Truhe platzieren → Klick öffnet Truhe-Panel (27 Slots)
- Inhalte bleiben erhalten (localStorage per Chunk-Position als Key)
- Server-Sync: andere Spieler sehen Truheninhalte

### [P2][MC] Farmland + Crops
- Hoe (neue Werkzeug-Kategorie)
- Dirt/Grass → Farmland bei Hoe-Klick
- Setzlinge: Wheat, Carrot, Potato, Beetroot
- Wachstums-Stages (4 oder 8 Stufen, Random-Tick-System)
- Ernte gibt Food-Items

### [P2][PERF] Chunk-Unloading
- Chunks > Render-Distance aus `chunkMeshes` entfernen
- Mesh dispose (GPU-Memory freigeben)
- Chunk-Daten im `world`-Map behalten (für Rückkehr)
- Ergebnis: deutlich weniger RAM/VRAM bei großer Welt

### [P2][PERF] Frustum Culling
- Chunks die nicht im Camera-Frustum sind → nicht rendern
- Three.js hat Frustum-Klasse, manuell per Chunk-AABB prüfen
- Einfache 20–40% FPS-Verbesserung

### [P2] Renderable Lichtquellen
- Fackel/Lava → THREE.PointLight an Block-Position
- Max N gleichzeitige Lights (Performance-Budget)
- Licht-Radius: Fackel=8, Lava=12
- PointLight-Pool (wiederverwenden, nicht neu erstellen)

### [P2][MC] XP-System
- XP-Orbs droppen von Mobs/Öfen
- XP-Bar unter Hotbar (grüne Leiste, schon visuell vorhanden)
- Level-Anzeige (Zahl über XP-Bar)
- Benötigt für Enchanting

### [P3][MC] Enchanting-System
- Enchanting Table (Block: Obsidian + Buch + Diamant)
- UI: Item einlegen, 3 Enchant-Optionen je nach Level
- Enchants: Sharpness, Efficiency, Protection, Unbreaking, Fortune, etc.
- Enchanted Items: lila Glow-Effekt auf Icon

### [P3][MC] Brewing / Tränke
- Brewing Stand (Block)
- Tränke: Strength, Speed, Healing, Harming, Poison, Regen
- Zutaten-System (Nether Wart + Base)

### [P3][MC] Villager Trading
- Villager anklicken → Trade-UI
- Angebote: Items gegen Emeralds oder Items gegen Items
- Profession-System (Farmer, Smith, Librarian etc.)

---

## Langfristig / Dimensionen

### [P3][MC] Nether
- Neue Dimension (separates World-Array oder anderer Chunk-Namespace)
- Biom: Netherrack, Lava-Seen, Netherquarz-Erz
- Mobs: Zombified Piglin, Ghast, Blaze, Magma Cube
- Nether Portal (Obsidian-Rahmen, Flint & Steel → Aktivierung)
- Quartz, Blaze Rods als exklusive Ressourcen
- Nether-Wart für Brewing

### [P3][MC] The End
- Boss-Dimension
- Endstein, Säulen mit End-Kristallen
- Ender Dragon Boss-Fight (HP-Bar, Phasenwechsel)
- End Portal in Stronghold
- End-Chest (globales Inventar)

### [P3][MC] Redstone
- Komplexestes System, extremer Scope
- Minimum: Redstone Dust, Lever, Button, Redstone Lamp
- Kein Piston, Comparator etc. im ersten Schritt
- Block-Update-Propagation nötig

### [P2][MC] Wetter
- Regen-Partikel (einfache Linien von oben)
- Donner (Sound + Blitz-Licht)
- Schnee in Snow-Biomen
- Kein Gameplay-Einfluss vorerst (kein nasses Schwert etc.)

### [P2][MC] Minecarts & Rails
- Rail-Block (Schiene)
- Minecart-Entity (fährt auf Rails, physikalisch)
- Powered Rail (beschleunigt)
- Für Spieler-Transport

---

## Bekannte Bugs / Tech Debt

| Problem | Priorität | Beschreibung |
|---|---|---|
| Wasser kein Flowing | P2 | Source-Only, kein Fließen |
| Lava kein Flowing | P2 | Source-Only |
| Sand/Gravel kein Gravity | P3 | Blöcke fallen nicht |
| Cactus-Schaden | P2 | Kontakt macht noch keinen Schaden |
| Villager kein Trading | P1[MC] | Passiv aber nutzlos |
| AO nur Toggle | P3 | Nicht echtes AO, nur rudimentär |
| Chunk-Memory Leak | P1[PERF] | Chunks nie unloaded → RAM-Anstieg |
| Mob-Pathfinding | P2 | Bleibt an Treppen/Wänden hängen |

---

## Was VoxelCraft zum vollständigen MC-Klon fehlt (Gesamt-Gap)

### Fehlt komplett (nicht auf Roadmap):
- Fishing
- Maps, Kompass, Uhr (Items)
- Anvil (Item-Reparatur + Umbenennung)
- Beacon
- Brewing Stand / Tränke (auf Roadmap als P3)
- Schilden / Shield
- Elytra / Trident (Late-Game)
- Tameable Mobs (Wolf, Katze, Pferd)
- Schaf-Scheren / Melken (Kuh)
- End-Portal / Stronghold
- Books & Enchanting (Roadmap P3)
- Campfire
- Composter
- Barrel
- Scaffolding
- Grindstone / Stonecutter

### Fehlt aber auf Roadmap:
- Hunger-System
- Chest-UI
- Farmland + Crops
- Nether
- The End
- Redstone (rudimentär)
- XP + Enchanting
- Wetter
- Villager Trading
- Bett
- Ofen-UI
- Keep-Inventory
