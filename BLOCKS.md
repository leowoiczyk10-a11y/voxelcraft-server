# Block-ID-Registry

> **ACHTUNG:** Diese Liste muss mit `const BLOCKS =` in index.html übereinstimmen.
> Bei Widerspruch gilt immer der Code. Neue IDs nur hier eintragen wenn gleichzeitig im Code.

## Format
`ID | NAME | Eigenschaften`

## Terrain-Blöcke
| ID | Name | Abbau-Tool | Transparent | Solid | Notizen |
|---|---|---|---|---|---|
| 0 | AIR | — | ✓ | ✗ | Leer |
| 1 | GRASS | Shovel | ✗ | ✓ | Oberste Grasschicht |
| 2 | DIRT | Shovel | ✗ | ✓ | |
| 3 | STONE | Pickaxe | ✗ | ✓ | Dropped: Cobblestone |
| 4 | COBBLESTONE | Pickaxe | ✗ | ✓ | |
| 5 | SAND | Shovel | ✗ | ✓ | Gravity? (noch nicht) |
| 6 | GRAVEL | Shovel | ✗ | ✓ | |
| 7 | BEDROCK | — | ✗ | ✓ | Unabbaubar |
| 8 | SNOW_LAYER | Shovel | ✗ | ✗ | Dünne Schicht |
| 9 | ICE | Pickaxe | teilw. | ✓ | |

## Holz / Pflanzen
| ID | Name | Tool | Transparent | Solid | Notizen |
|---|---|---|---|---|---|
| 10 | OAK_LOG | Axe | ✗ | ✓ | |
| 11 | OAK_PLANKS | Axe | ✗ | ✓ | |
| 12 | OAK_LEAVES | Axe | ✓ | ✗ | |
| 13 | CACTUS | Hand | ✗ | ✓ | Schaden bei Berührung? |
| 14 | DEAD_BUSH | Hand | ✓ | ✗ | Nur auf Sand |
| 15 | TALL_GRASS | Hand | ✓ | ✗ | |
| 16 | FLOWER_YELLOW | Hand | ✓ | ✗ | Dandelion |
| 17 | FLOWER_RED | Hand | ✓ | ✗ | Poppy |

## Erze & Tiefen-Blöcke
| ID | Name | Tool (Mindest-Tier) | Notizen |
|---|---|---|---|
| 20 | COAL_ORE | Pickaxe (Wood) | Y: alle Tiefen |
| 21 | IRON_ORE | Pickaxe (Stone) | Y: 0–64 |
| 22 | GOLD_ORE | Pickaxe (Iron) | Y: 0–32 |
| 23 | DIAMOND_ORE | Pickaxe (Iron) | Y: 0–16 |
| 24 | EMERALD_ORE | Pickaxe (Iron) | Y: 0–16 |
| 25 | REDSTONE_ORE | Pickaxe (Iron) | Y: 0–16 |

## Flüssigkeiten
| ID | Name | Notizen |
|---|---|---|
| 30 | WATER | Halbsolid, kein Flowing |
| 31 | LAVA | Schaden bei Kontakt, kein Flowing |

## Gebaute Blöcke / Utility
| ID | Name | Tool | Notizen |
|---|---|---|---|
| 40 | CRAFTING_TABLE | Axe | Öffnet 3×3 Crafting |
| 41 | FURNACE | Pickaxe | UI noch nicht implementiert |
| 42 | CHEST | Axe | UI noch nicht implementiert |
| 43 | TORCH | Hand | Platzierbar, kein echtes Licht |
| 44 | GLASS | Pickaxe | Transparent |
| 45 | WOOL_WHITE | Axe | Crafting für Bett/Bogen |
| 46 | BOOKSHELF | Axe | Dekorativ |
| 47 | SANDSTONE | Pickaxe | Desert-Biom |

## Wüsten-Blöcke
| ID | Name | Tool | Notizen |
|---|---|---|---|
| 50 | SAND | Shovel | bereits oben bei Terrain |
| 51 | SANDSTONE | Pickaxe | |

## Nächste freie IDs
- Ab ID **60** für zukünftige Blöcke (Deepslate-Layer, Netherrack, etc.)
- **IMMER** dieses Dokument + CLAUDE.md + Code gleichzeitig updaten

## Block-Eigenschaften-Flags (im Code)
```js
// In BLOCKS[id]:
{
  name: "Stone",
  hardness: 1.5,      // Abbau-Dauer Multiplikator
  tool: "pickaxe",    // benötigtes Tool-Typ oder null
  toolLevel: 0,       // 0=Wood, 1=Stone, 2=Iron, 3=Diamond
  drop: 4,            // welcher Block/Item-ID gedroppt wird
  transparent: false,
  solid: true,
  liquid: false,
}
```
