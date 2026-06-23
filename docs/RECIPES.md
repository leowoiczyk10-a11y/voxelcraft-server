# Crafting-Rezepte

## Format
`[A][B][C] / [D][E][F] / [G][H][I] → OUTPUT (Anzahl)`
Leere Felder = AIR. Für 2×2: nur erste 2 Zeilen, 2 Spalten.

## Werkzeuge (alle Tiers: Wood/Stone/Iron/Gold/Diamond)
```
[M][M][M]     Pickaxe (M=Material)
[ ][S][ ]     → 1x Pickaxe
[ ][S][ ]     S=Stick

[M][M][ ]
[ ][S][ ]     → 1x Axe
[ ][S][ ]

[ ][M][ ]
[ ][S][ ]     → 1x Shovel
[ ][S][ ]

[ ][M][ ]
[ ][M][ ]     → 1x Sword
[ ][S][ ]
```

## Rüstung (alle Tiers)
```
[M][ ][M]
[M][M][M]     → 1x Helmet
[ ][ ][ ]

[M][ ][M]
[M][M][M]     → 1x Chestplate
[M][M][M]

[M][M][M]
[M][ ][M]     → 1x Leggings
[M][ ][M]

[M][ ][M]
[M][ ][M]     → 1x Boots
[ ][ ][ ]
```

## Crafting Table
```
[P][P]
[P][P]    → 1x Crafting Table    (2×2)
P=Oak Planks
```

## Stick
```
[P]
[P]        → 4x Stick            (2×2)
```

## Oak Planks
```
[L]        → 4x Oak Planks       (2×2)
L=Oak Log
```

## Bogen
```
[ ][S][L]
[S][ ][L]   → 1x Bow
[ ][S][L]
S=Stick, L=Leather String (Wool/Leder)
```

## Pfeile
```
[ ][F][ ]
[ ][S][ ]   → 4x Arrow
[ ][E][ ]
F=Flint, S=Stick, E=Feather
```

## Eimer
```
[I][ ][I]
[ ][I][ ]   → 1x Bucket
I=Iron Ingot
```

## Bett
```
[W][W][W]
[P][P][P]   → 1x Bed
W=Wool, P=Planks
```

## Torch (4 Stück)
```
[C]
[S]        → 4x Torch
C=Coal, S=Stick
```

## Furnace
```
[S][S][S]
[S][ ][S]   → 1x Furnace
[S][S][S]
S=Cobblestone
```

## Chest
```
[P][P][P]
[P][ ][P]   → 1x Chest
[P][P][P]
P=Oak Planks
```

## Glass
Kein Crafting → Schmelzen von Sand im Ofen

## Iron Ingot aus Iron Ore
Kein Crafting → Schmelzen im Ofen

## Gold Ingot aus Gold Ore
Kein Crafting → Schmelzen im Ofen

## Bread
```
[W][W][W]   → 1x Bread          (3×3, nur 1 Zeile belegt)
W=Wheat
```

## Iron Block / Gold Block / Diamond Block
```
[I][I][I]
[I][I][I]   → 1x Block
[I][I][I]
I=Ingot/Gem
```

## Schmelzrezepte (Ofen)
| Input | Fuel | Output |
|---|---|---|
| Iron Ore | Coal/Log | Iron Ingot |
| Gold Ore | Coal/Log | Gold Ingot |
| Sand | Coal/Log | Glass |
| Raw Food | Coal/Log | Cooked Food |
| Cobblestone | Coal/Log | Stone |

## Noch nicht implementierte Rezepte (MC-Standard fehlt)
- Anvil (3 Iron Block + 4 Iron Ingot)
- Enchanting Table (Obsidian + Book + Diamond)
- Brewing Stand (Blaze Rod + Cobblestone)
- Fishing Rod (Stick + String)
- Map (Paper + Compass)
- Clock (Gold + Redstone)
- Compass (Iron + Redstone)
- Beacon (Glass + Nether Star + Obsidian)
- Shield (Planks + Iron Ingot)
