# Implementierte Systeme

## Rendering
- **Three.js WebGL** — Perspective Camera, eigener Render-Loop
- **Procedural Texture Atlas** — alle Block-Texturen via Canvas 2D generiert, kein externes PNG
- **Greedy Meshing** — fasst gleichartige Flächen zusammen, reduziert Draw Calls drastisch
- **Chunk-System** — 16×16×Nchunks, Web Worker für Generierung (kein 20fps-Cap mehr)
- **Day/Night Cycle** — Himmelfarbe + Ambient Light interpoliert, Sonnen/Mondposition

## Welt-Generation
- **Noise-basiertes Terrain** — simplex/perlin noise, variable Höhe
- **Biome-System** — Normal (Grass/Oak), Wüste (Sand/Cactus/Deadbush), Snow (noch rudimentär)
- **Höhlen** — 3D-Noise-Tunnel ab bestimmter Tiefe
- **Erz-Verteilung** — Coal, Iron, Gold, Diamond, Emerald, Redstone je nach Y-Level
- **Wasser** — statische Source-Blöcke (kein Flowing)
- **Lava-See** — tiefer Layer Lava als Bodenabschluss

## Physik
- **AABB-Kollision** — Player vs. Blöcke, Sub-Step für hohe Geschwindigkeiten
- **Gravity** — konstante Fallbeschleunigung, Sprung
- **Schwimmen** — Wasser ist halbsolid, kein echtes Auftrieb-System

## Spieler
- **Gesundheit** — 20 HP (10 Herzen), Regeneration bei vollem Magen (kein Hunger-System!)
- **Rüstung** — 4 Slots (Helm, Brust, Hose, Stiefel), alle Tiers (Leather/Gold/Iron/Diamond), Durability, Schadensreduktion, HUD-Anzeige
- **Werkzeuge** — Pickaxe/Axe/Shovel/Sword je Tier, Durability, Mining-Speed-Multiplikatoren
- **Hotbar** — 9 Slots, Scroll/Touch/Zifferntasten
- **Inventar** — 36 Slots + 4 Rüstungs-Slots, Drag & Drop

## Crafting
- **2×2 Crafting** — direkt im Inventar
- **3×3 Crafting** — Crafting Table (Block im Inventar nutzbar)
- **Recipe Book** — alle Rezepte sichtbar, Autofill wenn Materialien vorhanden
- **Rezepte vorhanden** — Werkzeuge, Waffen, Rüstung, Blöcke, Bogen, Pfeile, Eimer, etc.

## Items & Blöcke
- **Block-Platzierung/Abbau** — Raycast, Mining-Progress-Bar
- **Drop-System** — abgebaute Blöcke als Items auf dem Boden
- **Item-Pickup** — automatisch bei Nähe
- **Eimer** — Wasser aufnehmen/platzieren, Lava aufnehmen/platzieren
- **Lava-Schaden** — Kontakt mit Lava macht Schaden

## Kampf & Mobs
- **Melee-Angriff** — Schwung-Animation, Schaden je Werkzeug-Tier
- **Bogen & Pfeile** — Aufladen, Projektil-Physik, server-autoritativ, Owner-Tracking, Crafting mit Leder
- **Mob-KI** — State-Machine: Idle → Detect → Chase → Attack
- **Mob-Typen:**
  - Creeper — Explosion bei Nähe, Schaden + Block-Destruction
  - Skeleton — Ranged AI, schießt Pfeile auf Spieler
  - Enderman — teleportiert sich, aggressiv bei Blickkontakt
  - Villager — passiv, kein Trading
- **Spawn-System** — oberirdisch, dunkelheit-abhängig (tags keine Mobs)
- **Mob-HP-Bar** — erscheint beim Angriff über dem Mob

## Sound
- **Web Audio API** — kein externes Sound-File, alles synthetisch
- **Sounds vorhanden** — Abbau (je Block-Typ), Platzieren, Schaden, Mob-Geräusche, Bogen
- **Positional Audio** — Lautstärke je nach Distanz

## Multiplayer
- **WebSocket** — verbindet zu server.js auf Railway
- **Spieler-Sync** — Position, Rotation, Skin-Farbe sichtbar für andere
- **Block-Sync** — Abbau/Platzieren wird an alle gesendet
- **Arrow-Sync** — Pfeile server-autoritativ übertragen

## UI
- **Titelscreen** — Dirt-Hintergrund, Name-Input, Play-Button
- **Inventar-Screen** — vollständige MC-Style UI mit Bevel-Panels
- **Recipe Book Modal** — scrollbar, kategoriefähig
- **Settings Menu** — UI-Scale, Render-Distance, AO-Toggle (Toggle vorhanden, AO rudimentär)
- **Debug Overlay** — F3 zeigt Pos, Chunk, FPS, Block-ID
- **Item-Icons** — 62 Silhouetten-Icons (Werkzeuge, Rüstung, Ressourcen, Bogen, Eimer etc.)
- **Hotbar-Namen** — Item-Name erscheint kurz beim Slot-Wechsel (NOCH NICHT implementiert laut Roadmap)

## Mobile
- **Touch-Joystick** — Bewegung links
- **Action-Buttons** — Platzieren, Abbauen, Springen, Inventar
- **Safe-Area-Insets** — iOS/Android Notch-Support
- **Vergrößerte Touch-Targets**

## Persistenz
- **localStorage** — Inventar (Items + Rüstung + Durability), Spieler-Position
- **Garbage-Filter** — korrupte Slot-Daten werden gefiltert
- **Death-Reset** — Tod löscht Inventar (Keep-Inventory Toggle: NOCH NICHT)
