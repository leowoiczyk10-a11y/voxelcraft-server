VoxelCraft – Claude Code Instructions
Architecture
Single-file browser game. Everything except multiplayer lives in index.html.
server.js handles WebSocket multiplayer only. Never modify server.js.
index.html section map (use grep/sed, never read the whole file)
Lines
Section
1–514
HTML + CSS (UI, Minecraft styling)
515–553
Device/config detection
554–736
Sound engine (Web Audio API, procedural)
737–1347
Block registry, item/tool/armor defs, crafting recipes
1348–1800
World generation (Perlin noise, biomes, structures)
1801–1899
Chunk overrides (server sync)
1900–2478
Texture atlas (procedural canvas drawing)
2479–2619
Chunk meshing (Three.js geometry)
2620–2868
Rendering (scene, sky, lighting)
2869–2900
Chunk loading/unloading
2901–3182
Player physics + collision (AABB)
3005–3184
Voxel raycast (DDA)
3183–3662
Input handling
3663–3748
Multiplayer (WebSocket client)
3749–4218
Survival systems (health, hunger, inventory)
4219–4430
Local mob spawning + AI
4431–4645
Arrows + particles
4646–4762
Mining + tools
4857–4920
Chat
4921–5095
Dimensions (Nether/End) + portals
5096–5228
Bosses (Ender Dragon, Wither, Ghast)
5229–5353
Redstone
5353–5573
Farming, TNT, fishing, breeding, potions
5574–5740
Achievements, minimap, HUD
Block ID Registry (NEVER change existing IDs, saves use them)
Code
Items start at 100. Next free item ID: check bottom of item section (~207+).
Hard Rules
No silent assumptions. If a requirement is unclear, ask one focused question before writing code.
Minimal changes. Only touch code directly relevant to the requested feature. No opportunistic refactoring.
No orthogonal edits. Don't rename variables, restructure functions, or fix unrelated things unless explicitly asked.
Grep before reading. Use grep -n to find relevant lines. Only read the sections you need.
No new IDs without checking. Always grep -n "^const.*=[0-9]" index.html first to find the next free ID.
Verify before delivering. After writing code: grep for the new symbols to confirm they're defined and used correctly.
Workflow for new features
Code
Known intentional quirks (do not "fix" these)
Old ID conflict LAVA/FURNACE=21 and OBSIDIAN/TORCH=22 was already resolved (FURNACE=28, TORCH=29). Do not change.
World saves use numeric block IDs — any ID change corrupts existing saves.
server.js is intentionally minimal. Game logic stays in index.html.
Tech stack
Three.js (imported as three.module.js, no build step)
Web Audio API (procedural, no audio files)
WebSocket (multiplayer, server-authoritative for block changes + mobs)
Pure vanilla JS, no frameworks, no bundler
Single HTML file — CSS, JS, and HTML all in index.html
Response style
Short answers. No long explanations unless asked.
If something will take >50 lines, give a 1-sentence plan first.
Code only, no markdown in code blocks when editing the file directly.
1. grep for relevant existing code (find hooks, similar patterns)
2. Identify exact line range to edit
3. Write minimal, targeted change
4. grep to verify new symbols exist and old ones still work
5. Confirm no ID conflictsAIR=0 GRASS=1 DIRT=2 STONE=3 SAND=4 WATER=5 WOOD=6
COBBLE=7 GLASS=8 BRICKS=9 LOG=10 LEAVES=11 SNOW=12 GRAVEL=13 CRAFTING_TABLE=14
BEDROCK=15 COAL_ORE=16 COPPER_ORE=17 IRON_ORE=18 GOLD_ORE=19 DIAMOND_ORE=20
LAVA=21 OBSIDIAN=22
TALL_GRASS=23 FLOWER_RED=24 FLOWER_YELLOW=25 CACTUS=26 DEAD_BUSH=27
FURNACE=28 TORCH=29 BED=30
SPAWNER=31 CHEST=32 ANVIL=33 ENCHANTER=34
NETHERRACK=35 GLOWSTONE=36 PORTAL=37 SOUL_SAND=38 REDSTONE_ORE=39
... (new blocks start at next free ID, currently ~93+)
