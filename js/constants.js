// =====================================================================
//  CONSTANTS — pure data, no DOM, no side effects
// =====================================================================

export const isTouch = typeof window !== 'undefined'
  ? (('ontouchstart' in window) || navigator.maxTouchPoints > 0)
  : false;

// ---- Chunk / World geometry ----
export const CHUNK_SIZE   = 16;
export const Y_MIN = -64, Y_MAX = 320;
export const WORLD_HEIGHT = Y_MAX - Y_MIN;
export const SECTION_H = 64;
export const NUM_SECTIONS = WORLD_HEIGHT / SECTION_H;
export const SECTION_VOL = SECTION_H * CHUNK_SIZE * CHUNK_SIZE;
export function sectionOf(wy){ return ((wy - Y_MIN) / SECTION_H) | 0; }
export const WATER_LEVEL  = 62;
export const LAVA_SEA     = -48;

// ---- Settings ----
export const PRESETS = {
  niedrig: { renderDist:3, simDist:2, renderScale:0.7 },
  mittel:  { renderDist:5, simDist:3, renderScale:1.0 },
  hoch:    { renderDist:10, simDist:6, renderScale:1.0 },
};
export const SETTINGS_KEY   = 'voxelcraft_settings_v1';
export const DEFAULT_PRESET = isTouch ? 'niedrig' : 'mittel';

// ---- Block IDs ----
export const AIR=0, GRASS=1, DIRT=2, STONE=3, SAND=4, WATER=5, WOOD=6;
export const COBBLE=7, GLASS=8, BRICKS=9, LOG=10, LEAVES=11, SNOW=12, GRAVEL=13, CRAFTING_TABLE=14;
export const BEDROCK=15, COAL_ORE=16, COPPER_ORE=17, IRON_ORE=18, GOLD_ORE=19, DIAMOND_ORE=20;
export const LAVA=21, OBSIDIAN=22;
export const TALL_GRASS=23, FLOWER_RED=24, FLOWER_YELLOW=25, CACTUS=26, DEAD_BUSH=27;
export const FURNACE=28, TORCH=29;
export const BED=30;
export const SPAWNER=31, CHEST=32, ANVIL=33, ENCHANTER=34;
export const NETHERRACK=35, GLOWSTONE=36, PORTAL=37, SOUL_SAND=38;
export const REDSTONE_ORE=39;
export const REDSTONE_WIRE=40, REDSTONE_WIRE_ON=41, LEVER=42, LEVER_ON=43, REDSTONE_LAMP=44, REDSTONE_LAMP_ON=45;
export const TNT=46, LANTERN=47, SOUL_LANTERN=48, CAMPFIRE=49, BOOKSHELF=50, BARREL=51, STONECUTTER=52;
export const FARMLAND=53, WHEAT_S0=54, WHEAT_S1=55, WHEAT_S2=56, WHEAT_S3=57, SAPLING=58;
export const ICE=59, KELP=60, CORAL=61, SNOW_LAYER=62, FIRE=63, COMPOSTER=64;
export const BREWING_STAND=65, ENDER_CHEST=66, GRINDSTONE=67;
export const RAIL=68, POWERED_RAIL=69;
export const END_PORTAL_FRAME=70, END_PORTAL=71, END_STONE=72, PURPUR=73, BEACON=74, DRAGON_EGG=75, SUGARCANE=76;
export const IRON_BLOCK=77, GOLD_BLOCK=78, DIAMOND_BLOCK=79, COAL_BLOCK=80, REDSTONE_BLOCK=81;
export const PUMPKIN=82, JACK_O_LANTERN=83, SLIME_BLOCK=84, HAY_BLOCK=85;
export const EMERALD_ORE=86, EMERALD_BLOCK=87;
export const DOOR_CLOSED=88, DOOR_OPEN=89, TRAPDOOR_CLOSED=90, TRAPDOOR_OPEN=91;
export const CAKE=92;
export const SANDSTONE=93, STONE_BRICKS=94, POLISHED_STONE=95, SMOOTH_SANDSTONE=96;
export const MUSHROOM=97;
export const CRACKED_STONE_BRICKS=98, CHISELED_STONE_BRICKS=99;
export const WOOL=100;

export function isWheat(id){ return id===WHEAT_S0||id===WHEAT_S1||id===WHEAT_S2||id===WHEAT_S3; }
export function isStorageBlock(id){ return id===IRON_BLOCK||id===GOLD_BLOCK||id===DIAMOND_BLOCK||id===COAL_BLOCK||id===REDSTONE_BLOCK; }

export const BLOCKS = {
  [AIR]:   { name:'Air',    solid:false, opaque:false },
  [GRASS]: { name:'Gras',   solid:true,  opaque:true,  top:0x5fa83d, side:0x6e7b3c, bottom:0x8a6a43 },
  [DIRT]:  { name:'Erde',   solid:true,  opaque:true,  color:0x8a6a43 },
  [STONE]: { name:'Stein',  solid:true,  opaque:true,  color:0x888d92 },
  [SAND]:  { name:'Sand',   solid:true,  opaque:true,  color:0xdfd6a4 },
  [WATER]: { name:'Wasser', solid:false, opaque:false, color:0x2f6fd8, transparent:true },
  [WOOD]:  { name:'Holz',   solid:true,  opaque:true,  top:0x9a7842, side:0x6f5126, bottom:0x9a7842 },
  [COBBLE]:{ name:'Bruchstein', solid:true, opaque:true, color:0x7e7e82 },
  [GLASS]: { name:'Glas',   solid:true,  opaque:false, color:0xbfe0ee, transparent:true },
  [BRICKS]:{ name:'Ziegel', solid:true,  opaque:true,  color:0x9c4a3a },
  [LOG]:   { name:'Stamm',  solid:true,  opaque:true,  top:0xb9965f, side:0x5f4a2e, bottom:0xb9965f },
  [LEAVES]:{ name:'Laub',   solid:true,  opaque:true,  color:0x3f7a2f },
  [SNOW]:  { name:'Schnee', solid:true,  opaque:true,  color:0xeef3f8 },
  [GRAVEL]:{ name:'Kies',   solid:true,  opaque:true,  color:0x87827c },
  [WOOL]:  { name:'Wolle',  solid:true,  opaque:true,  color:0xece9e2 },
  [CRAFTING_TABLE]:{ name:'Werkbank', solid:true, opaque:true, top:0xb9965f, side:0x7a5a30, bottom:0x6f5126 },
  [BEDROCK]:    { name:'Grundgestein', solid:true, opaque:true, color:0x33333a },
  [COAL_ORE]:   { name:'Kohleerz',   solid:true, opaque:true, color:0x4a4d52 },
  [COPPER_ORE]: { name:'Kupfererz',  solid:true, opaque:true, color:0x9c7257 },
  [IRON_ORE]:   { name:'Eisenerz',   solid:true, opaque:true, color:0xb09583 },
  [GOLD_ORE]:   { name:'Golderz',    solid:true, opaque:true, color:0xc6a43e },
  [DIAMOND_ORE]:{ name:'Diamanterz', solid:true, opaque:true, color:0x52c7cf },
  [FURNACE]:    { name:'Ofen',   solid:true,  opaque:true,  color:0x6e6e74, top:0x5c5c62 },
  [TORCH]:      { name:'Fackel', solid:false, opaque:false, color:0xffb34d },
  [LAVA]:       { name:'Lava',   solid:false, opaque:false, color:0xff7a1a },
  [OBSIDIAN]:   { name:'Obsidian', solid:true, opaque:true,  color:0x14121f },
  [TALL_GRASS]: { name:'Hohes Gras', solid:false, opaque:false, color:0x5fa83d },
  [FLOWER_RED]: { name:'Mohn',      solid:false, opaque:false, color:0xd83a3a },
  [FLOWER_YELLOW]:{ name:'Löwenzahn', solid:false, opaque:false, color:0xf2d24a },
  [CACTUS]:     { name:'Kaktus',    solid:true,  opaque:true,  color:0x4e8f3a },
  [DEAD_BUSH]:  { name:'Toter Busch', solid:false, opaque:false, color:0x9a6f3a },
  [BED]:        { name:'Bett',  solid:true,  opaque:true,  top:0xd23b3b, side:0xb02e2e, bottom:0x7a5a32 },
  [SPAWNER]:    { name:'Mob-Spawner', solid:true, opaque:true, color:0x24262c, top:0x2e3036 },
  [CHEST]:      { name:'Truhe', solid:true,  opaque:true,  top:0x8a6a3a, side:0x7a5a2e, bottom:0x6f5126 },
  [ANVIL]:      { name:'Amboss', solid:true, opaque:true,  color:0x3a3a40, top:0x55555c, bottom:0x2a2a30 },
  [ENCHANTER]:  { name:'Zaubertisch', solid:true, opaque:true, top:0x6a3a8a, side:0x33263f, bottom:0x14121f },
  [NETHERRACK]: { name:'Netherrack', solid:true, opaque:true, color:0x6e2b24 },
  [GLOWSTONE]:  { name:'Glowstone', solid:true, opaque:true, color:0xe8c25a },
  [PORTAL]:     { name:'Nether-Portal', solid:false, opaque:false, color:0x9a3ad8, transparent:true },
  [SOUL_SAND]:  { name:'Seelensand', solid:true, opaque:true, color:0x4a3a2e },
  [REDSTONE_ORE]:    { name:'Redstone-Erz', solid:true, opaque:true, color:0x9a3a30 },
  [REDSTONE_WIRE]:   { name:'Redstone', solid:false, opaque:false, color:0x8a1a1a },
  [REDSTONE_WIRE_ON]:{ name:'Redstone', solid:false, opaque:false, color:0xff2a2a },
  [LEVER]:      { name:'Hebel', solid:false, opaque:false, color:0x6a5030 },
  [LEVER_ON]:   { name:'Hebel', solid:false, opaque:false, color:0xc08a3a },
  [REDSTONE_LAMP]:   { name:'Redstone-Lampe', solid:true, opaque:true, color:0x6a5530 },
  [REDSTONE_LAMP_ON]:{ name:'Redstone-Lampe', solid:true, opaque:true, color:0xffd86a },
  [TNT]:        { name:'TNT', solid:true, opaque:true, top:0xc83a2a, side:0xc83a2a, bottom:0x8a6a3a },
  [LANTERN]:    { name:'Laterne', solid:true, opaque:false, color:0xffce6a },
  [SOUL_LANTERN]:{ name:'Seelenlaterne', solid:true, opaque:false, color:0x4ad0e0 },
  [CAMPFIRE]:   { name:'Lagerfeuer', solid:true, opaque:false, top:0xff7a2a, side:0x6f5126, bottom:0x4a3826 },
  [BOOKSHELF]:  { name:'Bücherregal', solid:true, opaque:true, top:0x9a7842, side:0x9a6a3a, bottom:0x9a7842 },
  [BARREL]:     { name:'Fass', solid:true, opaque:true, top:0xc89a5a, side:0x8a6a3a, bottom:0x8a6a3a },
  [STONECUTTER]:{ name:'Steinschneider', solid:true, opaque:true, top:0x9aa0a6, side:0x6e6e74, bottom:0x6e6e74 },
  [FARMLAND]:   { name:'Ackerboden', solid:true, opaque:true, top:0x4a3220, side:0x6b4f2a, bottom:0x6b4f2a },
  [WHEAT_S0]:   { name:'Weizen', solid:false, opaque:false, color:0x6a9a3a },
  [WHEAT_S1]:   { name:'Weizen', solid:false, opaque:false, color:0x8aaa3a },
  [WHEAT_S2]:   { name:'Weizen', solid:false, opaque:false, color:0xb0b040 },
  [WHEAT_S3]:   { name:'Weizen', solid:false, opaque:false, color:0xd9c060 },
  [SAPLING]:    { name:'Setzling', solid:false, opaque:false, color:0x3f8f2a },
  [ICE]:        { name:'Eis', solid:true, opaque:false, color:0x9fcaf0, transparent:true },
  [KELP]:       { name:'Seetang', solid:false, opaque:false, color:0x2f8f4a },
  [CORAL]:      { name:'Koralle', solid:false, opaque:false, color:0xe85a8a },
  [SNOW_LAYER]: { name:'Schneedecke', solid:false, opaque:false, color:0xeef3f8 },
  [FIRE]:       { name:'Feuer', solid:false, opaque:false, color:0xff8a2a },
  [COMPOSTER]:  { name:'Komposter', solid:true, opaque:true, top:0x3a2a18, side:0x8a6a3a, bottom:0x6f5126 },
  [BREWING_STAND]:{ name:'Braustand', solid:false, opaque:false, color:0x8a8a90 },
  [ENDER_CHEST]:{ name:'Endertruhe', solid:true, opaque:true, top:0x183a36, side:0x12302c, bottom:0x0d1f1c },
  [GRINDSTONE]: { name:'Schleifstein', solid:true, opaque:true, top:0x9aa0a6, side:0x7a5a30, bottom:0x6e6e74 },
  [RAIL]:       { name:'Schiene', solid:false, opaque:false, color:0xb0a070 },
  [POWERED_RAIL]:{ name:'Antriebsschiene', solid:false, opaque:false, color:0xd0a040 },
  [END_PORTAL_FRAME]:{ name:'Endportalrahmen', solid:true, opaque:true, top:0x2a3a30, side:0x202a24, bottom:0x202a24 },
  [END_PORTAL]: { name:'Endportal', solid:false, opaque:false, color:0x0a1410, transparent:true },
  [END_STONE]:  { name:'Endstein', solid:true, opaque:true, color:0xdadca0 },
  [PURPUR]:     { name:'Purpur', solid:true, opaque:true, color:0xa868a8 },
  [BEACON]:     { name:'Leuchtfeuer', solid:true, opaque:false, color:0x6fe0e0, transparent:true },
  [DRAGON_EGG]: { name:'Drachenei', solid:true, opaque:true, color:0x140e1f },
  [SUGARCANE]:  { name:'Zuckerrohr', solid:false, opaque:false, color:0x8ac060 },
  [IRON_BLOCK]: { name:'Eisenblock', solid:true, opaque:true, color:0xe6e8ec },
  [GOLD_BLOCK]: { name:'Goldblock', solid:true, opaque:true, color:0xf2d24a },
  [DIAMOND_BLOCK]:{ name:'Diamantblock', solid:true, opaque:true, color:0x52c7cf },
  [COAL_BLOCK]: { name:'Kohleblock', solid:true, opaque:true, color:0x202024 },
  [REDSTONE_BLOCK]:{ name:'Redstoneblock', solid:true, opaque:true, color:0xc83020 },
  [PUMPKIN]:    { name:'Kürbis', solid:true, opaque:true, top:0xc88a2a, side:0xc88a2a, bottom:0xc88a2a },
  [JACK_O_LANTERN]:{ name:'Kürbislaterne', solid:true, opaque:true, top:0xc88a2a, side:0xffce6a, bottom:0xc88a2a },
  [SLIME_BLOCK]:{ name:'Schleimblock', solid:true, opaque:false, color:0x6acf6a, transparent:true },
  [HAY_BLOCK]:  { name:'Heuballen', solid:true, opaque:true, color:0xd9c060, top:0xb09530, bottom:0xb09530 },
  [EMERALD_ORE]:{ name:'Smaragderz', solid:true, opaque:true, color:0x6acaa0 },
  [EMERALD_BLOCK]:{ name:'Smaragdblock', solid:true, opaque:true, color:0x30c060 },
  [DOOR_CLOSED]:{ name:'Tür', solid:true, opaque:false, color:0x8a5a32, transparent:true },
  [DOOR_OPEN]:  { name:'Tür', solid:false, opaque:false, color:0x8a5a32 },
  [TRAPDOOR_CLOSED]:{ name:'Falltür', solid:true, opaque:false, color:0x8a5a32, transparent:true },
  [TRAPDOOR_OPEN]:  { name:'Falltür', solid:false, opaque:false, color:0x8a5a32 },
  [CAKE]:       { name:'Kuchen', solid:true, opaque:true, color:0xf4ecd8, top:0xf4f0e8, side:0xd8a96a, bottom:0x8a6a3a },
  [SANDSTONE]:       { name:'Sandstein', solid:true, opaque:true, color:0xd9ce9a, top:0xe3d9a6, bottom:0xe3d9a6 },
  [STONE_BRICKS]:    { name:'Steinziegel', solid:true, opaque:true, color:0x83878c },
  [POLISHED_STONE]:  { name:'Polierter Stein', solid:true, opaque:true, color:0x9aa0a6 },
  [SMOOTH_SANDSTONE]:{ name:'Glatter Sandstein', solid:true, opaque:true, color:0xe0d6a2 },
  [MUSHROOM]:        { name:'Pilz', solid:false, opaque:false, color:0xc83a3a },
  [CRACKED_STONE_BRICKS]: { name:'Rissiger Steinziegel', solid:true, opaque:true, color:0x7b7f84 },
  [CHISELED_STONE_BRICKS]:{ name:'Gemeißelter Steinziegel', solid:true, opaque:true, color:0x868b90 },
};

export function isWire(id){ return id===REDSTONE_WIRE||id===REDSTONE_WIRE_ON; }
export function isLever(id){ return id===LEVER||id===LEVER_ON; }
export function isLamp(id){ return id===REDSTONE_LAMP||id===REDSTONE_LAMP_ON; }
export const isSolid  = (id) => BLOCKS[id] ? BLOCKS[id].solid : true;
export const isOpaque = (id) => BLOCKS[id] ? BLOCKS[id].opaque : true;
export const isCrossPlant = (id) => id===TALL_GRASS||id===FLOWER_RED||id===FLOWER_YELLOW||id===DEAD_BUSH||id===REDSTONE_WIRE||id===REDSTONE_WIRE_ON||id===LEVER||id===LEVER_ON||isWheat(id)||id===SAPLING||id===KELP||id===CORAL||id===SUGARCANE||id===FIRE||id===SNOW_LAYER||id===MUSHROOM;

export const HOTBAR_COUNT = 9;

// ---- Item IDs ----
export const STICK=215, BEEF=101, CHICKEN_RAW=102, MUTTON=103, SWORD_WOOD=104;
export const WOOD_PICKAXE=105, WOOD_AXE=106, WOOD_SHOVEL=107, STONE_PICKAXE=108, STONE_AXE=109, STONE_SHOVEL=110, STONE_SWORD=111;
export const COAL=112, RAW_COPPER=113, RAW_IRON=114, RAW_GOLD=115, DIAMOND=116;
export const IRON_INGOT=117, COPPER_INGOT=118, GOLD_INGOT=119;
export const COOKED_BEEF=120, COOKED_CHICKEN=121, COOKED_MUTTON=122;
export const IRON_PICKAXE=123, IRON_AXE=124, IRON_SHOVEL=125, IRON_SWORD=126;
export const GOLD_PICKAXE=127, GOLD_AXE=128, GOLD_SHOVEL=129, GOLD_SWORD=130;
export const DIAMOND_PICKAXE=131, DIAMOND_AXE=132, DIAMOND_SHOVEL=133, DIAMOND_SWORD=134;
export const ROTTEN_FLESH=135, BONE=136, ARROW_ITEM=137, GUNPOWDER=138;
export const EMPTY_BUCKET=139, WATER_BUCKET=140, LAVA_BUCKET=141;
export const LEATHER=142;
export const LEATHER_HELMET=143, LEATHER_CHEST=144, LEATHER_LEGS=145, LEATHER_BOOTS=146;
export const IRON_HELMET=147,    IRON_CHEST=148,    IRON_LEGS=149,    IRON_BOOTS=150;
export const GOLD_HELMET=151,    GOLD_CHEST=152,    GOLD_LEGS=153,    GOLD_BOOTS=154;
export const DIAMOND_HELMET=155, DIAMOND_CHEST=156, DIAMOND_LEGS=157, DIAMOND_BOOTS=158;
export const BOW=159;
export const PORK_RAW=160, PORK_COOKED=161, MILK_BUCKET=162, FLINT_AND_STEEL=163;
export const STRING=164, ENDER_PEARL=165, BLAZE_ROD=166, SPIDER_EYE=167, FEATHER=168;
export const WHEAT_SEEDS=169, WHEAT=170, BREAD=171, BONE_MEAL=172, APPLE=173, GOLDEN_APPLE=174;
export const FISHING_ROD=175, RAW_FISH=176, COOKED_FISH=177, PAPER=178, BOOK=179, MAP_ITEM=180;
export const NETHER_WART=181, BLAZE_POWDER=182, GLASS_BOTTLE=183, AWKWARD_POTION=184;
export const POTION_HEAL=185, POTION_STRENGTH=186, POTION_SPEED=187, POTION_POISON=188;
export const NETHER_STAR=189, ELYTRA=190, SADDLE=191, SHIELD_ITEM=192, CHARCOAL=193, SUGAR_CANE=194, GHAST_TEAR=195, ENDER_EYE=196;
export const WOOD_HOE=197, STONE_HOE=198, IRON_HOE=199, MINECART=200;
export const SLIME_BALL=201, EMERALD=202, PUMPKIN_SEEDS=203, INK_SAC=204, SHULKER_SHELL=205;
export const SUGAR=206;
export const SWEET_BERRIES=207, COOKIE=208;
export const BOWL=209, MUSHROOM_STEW=210;
export const FLINT=211;
export const SHEARS=212;
export const PHANTOM_MEMBRANE=213;
export const TRIDENT=214;
export const MAGMA_CREAM=216;
export const SPYGLASS=217;
export const SNOWBALL=218;

export const ITEM = {
  [MAGMA_CREAM]:   { name:'Magmacreme',     color:0xd24a10 },
  [SPYGLASS]:      { name:'Fernglas',       color:0xb07a3a },
  [SNOWBALL]:      { name:'Schneeball',     color:0xeef3f8 },
  [STRING]:        { name:'Faden',          color:0xe8e8e8 },
  [ENDER_PEARL]:   { name:'Enderperle',     color:0x18a08a },
  [BLAZE_ROD]:     { name:'Lohenrute',      color:0xf0a020 },
  [SPIDER_EYE]:    { name:'Spinnenauge',    color:0xa33030 },
  [FEATHER]:       { name:'Feder',          color:0xf0f0f0 },
  [WHEAT_SEEDS]:   { name:'Weizensamen',    color:0x6a9a3a },
  [WHEAT]:         { name:'Weizen',         color:0xd9c060 },
  [BREAD]:         { name:'Brot',           color:0xc08a3a },
  [BONE_MEAL]:     { name:'Knochenmehl',    color:0xf0f0e8 },
  [APPLE]:         { name:'Apfel',          color:0xd83a3a },
  [GOLDEN_APPLE]:  { name:'Goldener Apfel', color:0xf2d24a },
  [SWEET_BERRIES]: { name:'Süßbeeren',      color:0xc02a3a },
  [COOKIE]:        { name:'Keks',           color:0xb07a3a },
  [BOWL]:          { name:'Schüssel',       color:0x8a5a32 },
  [MUSHROOM_STEW]: { name:'Pilzsuppe',      color:0xb05a3a },
  [FLINT]:         { name:'Feuerstein',     color:0x3a3d42 },
  [SHEARS]:        { name:'Schere',         color:0xcfd4dc },
  [PHANTOM_MEMBRANE]:{ name:'Phantommembran', color:0x8a90a0 },
  [FISHING_ROD]:   { name:'Angel',          color:0x9a7842 },
  [RAW_FISH]:      { name:'Roher Fisch',    color:0x8aa0b0 },
  [COOKED_FISH]:   { name:'Gebratener Fisch',color:0xc8a060 },
  [PAPER]:         { name:'Papier',         color:0xf4f4ee },
  [BOOK]:          { name:'Buch',           color:0x9a5030 },
  [MAP_ITEM]:      { name:'Karte',          color:0xe8e0c0 },
  [NETHER_WART]:   { name:'Netherwarze',    color:0xa01828 },
  [BLAZE_POWDER]:  { name:'Lohenstaub',     color:0xf0b020 },
  [GLASS_BOTTLE]:  { name:'Glasflasche',    color:0xbfe0ee },
  [AWKWARD_POTION]:{ name:'Seltsamer Trank',color:0x6a6ad0 },
  [POTION_HEAL]:   { name:'Heiltrank',      color:0xf03a6a },
  [POTION_STRENGTH]:{ name:'Stärketrank',   color:0xd03020 },
  [POTION_SPEED]:  { name:'Tempotrank',     color:0x30c0e0 },
  [POTION_POISON]: { name:'Gifttrank',      color:0x40a030 },
  [NETHER_STAR]:   { name:'Netherstern',    color:0xf0f0ff },
  [ELYTRA]:        { name:'Elytra',         color:0x7a6a8a },
  [SADDLE]:        { name:'Sattel',         color:0x7a4a2a },
  [SHIELD_ITEM]:   { name:'Schild',         color:0x6a4a2a },
  [CHARCOAL]:      { name:'Holzkohle',      color:0x303338 },
  [SUGAR_CANE]:    { name:'Zuckerrohr',     color:0x8ac060 },
  [GHAST_TEAR]:    { name:'Ghastträne',     color:0xd8e8e8 },
  [ENDER_EYE]:     { name:'Auge des Endes', color:0x30b090 },
  [MINECART]:      { name:'Lore',           color:0x9a9aa0 },
  [INK_SAC]:       { name:'Tintenbeutel',   color:0x1a1a2a },
  [SHULKER_SHELL]: { name:'Shulkerschale',  color:0xa87aa8 },
  [PORK_RAW]:      { name:'Rohes Schwein', color:0xe09a8a },
  [PORK_COOKED]:   { name:'Schweinebraten', color:0xb06a40 },
  [MILK_BUCKET]:   { name:'Milcheimer',     color:0xf2f2f2 },
  [FLINT_AND_STEEL]:{ name:'Feuerzeug',     color:0xb0b4bc },
  [STICK]:       { name:'Stock',        color:0x9a7842 },
  [BEEF]:        { name:'Rohes Rind',   color:0xc06050 },
  [CHICKEN_RAW]: { name:'Rohes Huhn',   color:0xe8b0a0 },
  [MUTTON]:      { name:'Rohes Hammel', color:0xd08070 },
  [SWORD_WOOD]:  { name:'Holzschwert',  color:0xb0a060 },
  [COAL]:        { name:'Kohle',        color:0x303338 },
  [RAW_COPPER]:  { name:'Rohkupfer',    color:0xc07850 },
  [RAW_IRON]:    { name:'Roheisen',     color:0xd8b89a },
  [RAW_GOLD]:    { name:'Rohgold',      color:0xd8b840 },
  [DIAMOND]:     { name:'Diamant',      color:0x52c7cf },
  [IRON_INGOT]:    { name:'Eisenbarren',  color:0xe6d8c8 },
  [COPPER_INGOT]:  { name:'Kupferbarren', color:0xd98c5f },
  [GOLD_INGOT]:    { name:'Goldbarren',   color:0xf2d24a },
  [COOKED_BEEF]:   { name:'Steak',        color:0x8a4a28 },
  [COOKED_CHICKEN]:{ name:'Brathuhn',     color:0xc88a4a },
  [COOKED_MUTTON]: { name:'Hammelbraten', color:0x9a5030 },
  [ROTTEN_FLESH]:  { name:'Verrottetes Fleisch', color:0x7a5a3a },
  [BONE]:          { name:'Knochen',             color:0xe8e4d4 },
  [ARROW_ITEM]:    { name:'Pfeil',               color:0xb0a080 },
  [GUNPOWDER]:     { name:'Schwarzpulver',       color:0x40403e },
  [EMPTY_BUCKET]:  { name:'Eimer',               color:0xb8bcc4 },
  [WATER_BUCKET]:  { name:'Wassereimer',         color:0x3a6fd0 },
  [LAVA_BUCKET]:   { name:'Lavaeimer',           color:0xe2531a },
  [LEATHER]:       { name:'Leder',               color:0x8a5a32 },
  [SLIME_BALL]:    { name:'Schleimball',          color:0x6acf6a },
  [EMERALD]:       { name:'Smaragd',              color:0x30c060 },
  [PUMPKIN_SEEDS]: { name:'Kürbissamen',          color:0xc8a050 },
  [SUGAR]:         { name:'Zucker',               color:0xf4f4f4 },
};

export function thing(id){ return BLOCKS[id] || ITEM[id] || TOOL[id] || ARMOR[id]; }
export function thingColor(id){ const t=thing(id); return t ? (t.color??t.top??0x888888) : 0x888888; }

export const FOOD = {
  [BEEF]:3, [CHICKEN_RAW]:2, [MUTTON]:2, [PORK_RAW]:3,
  [COOKED_BEEF]:8, [COOKED_CHICKEN]:6, [COOKED_MUTTON]:6, [PORK_COOKED]:8,
  [ROTTEN_FLESH]:2, [MILK_BUCKET]:2,
  [BREAD]:5, [APPLE]:4, [GOLDEN_APPLE]:4, [RAW_FISH]:2, [COOKED_FISH]:5,
  [SPIDER_EYE]:2, [SWEET_BERRIES]:2, [COOKIE]:2, [MUSHROOM_STEW]:6,
};
export function isFood(id){ return FOOD[id]!==undefined; }

export const TOOL = {
  [SWORD_WOOD]:    {cat:'sword',  tier:1, speed:1,   dur:60,  dmg:6, name:'Holzschwert',    color:0xb0a060},
  [STONE_SWORD]:   {cat:'sword',  tier:2, speed:1,   dur:132, dmg:7, name:'Steinschwert',   color:0x9aa0a6},
  [WOOD_PICKAXE]:  {cat:'pick',   tier:1, speed:2.5, dur:60,         name:'Holzspitzhacke',  color:0xb0a060},
  [STONE_PICKAXE]: {cat:'pick',   tier:2, speed:5,   dur:132,        name:'Steinspitzhacke', color:0x9aa0a6},
  [WOOD_AXE]:      {cat:'axe',    tier:1, speed:2.5, dur:60,         name:'Holzaxt',         color:0xb0a060},
  [STONE_AXE]:     {cat:'axe',    tier:2, speed:5,   dur:132,        name:'Steinaxt',        color:0x9aa0a6},
  [WOOD_SHOVEL]:   {cat:'shovel', tier:1, speed:2.5, dur:60,         name:'Holzschaufel',    color:0xb0a060},
  [STONE_SHOVEL]:  {cat:'shovel', tier:2, speed:5,   dur:132,        name:'Steinschaufel',   color:0x9aa0a6},
  [IRON_PICKAXE]:  {cat:'pick',   tier:3, speed:8,   dur:250,        name:'Eisenspitzhacke', color:0xe6d8c8},
  [IRON_AXE]:      {cat:'axe',    tier:3, speed:8,   dur:250,        name:'Eisenaxt',        color:0xe6d8c8},
  [IRON_SHOVEL]:   {cat:'shovel', tier:3, speed:8,   dur:250,        name:'Eisenschaufel',   color:0xe6d8c8},
  [IRON_SWORD]:    {cat:'sword',  tier:3, speed:1,   dur:250, dmg:8, name:'Eisenschwert',    color:0xe6d8c8},
  [WOOD_HOE]:      {cat:'hoe',    tier:1, speed:1,   dur:60,         name:'Holzhacke',       color:0xb0a060},
  [STONE_HOE]:     {cat:'hoe',    tier:2, speed:1,   dur:132,        name:'Steinhacke',      color:0x9aa0a6},
  [IRON_HOE]:      {cat:'hoe',    tier:3, speed:1,   dur:250,        name:'Eisenhacke',      color:0xe6d8c8},
  [GOLD_PICKAXE]:  {cat:'pick',   tier:2, speed:12,  dur:32,         name:'Goldspitzhacke',  color:0xf2d24a},
  [GOLD_AXE]:      {cat:'axe',    tier:2, speed:12,  dur:32,         name:'Goldaxt',         color:0xf2d24a},
  [GOLD_SHOVEL]:   {cat:'shovel', tier:2, speed:12,  dur:32,         name:'Goldschaufel',    color:0xf2d24a},
  [GOLD_SWORD]:    {cat:'sword',  tier:2, speed:1,   dur:32,  dmg:6, name:'Goldschwert',     color:0xf2d24a},
  [DIAMOND_PICKAXE]:{cat:'pick',  tier:4, speed:14,  dur:1000,       name:'Diamantspitzhacke',color:0x52c7cf},
  [DIAMOND_AXE]:    {cat:'axe',   tier:4, speed:14,  dur:1000,       name:'Diamantaxt',      color:0x52c7cf},
  [DIAMOND_SHOVEL]: {cat:'shovel',tier:4, speed:14,  dur:1000,       name:'Diamantschaufel', color:0x52c7cf},
  [DIAMOND_SWORD]:  {cat:'sword', tier:4, speed:1,   dur:1000, dmg:9,name:'Diamantschwert',  color:0x52c7cf},
  [BOW]:            {cat:'bow',   tier:1, speed:1,   dur:120,  dmg:1, name:'Bogen',          color:0x8a5a2a},
  [TRIDENT]:        {cat:'trident', tier:3, speed:1, dur:250, dmg:9, name:'Dreizack',        color:0x3aa6a0},
};
export function isTool(id){ return TOOL[id]!==undefined; }
export function isBow(id){ return id===BOW; }

export const ARMOR = {
  [LEATHER_HELMET]: {slot:0, points:1, dur:55,  mat:'Leder',   name:'Lederkappe',        color:0x9c6b3e},
  [LEATHER_CHEST]:  {slot:1, points:3, dur:80,  mat:'Leder',   name:'Lederjacke',        color:0x82542d},
  [LEATHER_LEGS]:   {slot:2, points:2, dur:75,  mat:'Leder',   name:'Lederhose',         color:0x6f4824},
  [LEATHER_BOOTS]:  {slot:3, points:1, dur:65,  mat:'Leder',   name:'Lederstiefel',      color:0x5e3c1d},
  [IRON_HELMET]:    {slot:0, points:2, dur:165, mat:'Eisen',   name:'Eisenhelm',         color:0xe6e8ec},
  [IRON_CHEST]:     {slot:1, points:6, dur:240, mat:'Eisen',   name:'Eisenbrustpanzer',  color:0xc8cace},
  [IRON_LEGS]:      {slot:2, points:5, dur:225, mat:'Eisen',   name:'Eisenbeinschutz',   color:0xb6b8bc},
  [IRON_BOOTS]:     {slot:3, points:2, dur:195, mat:'Eisen',   name:'Eisenstiefel',      color:0xa4a6aa},
  [GOLD_HELMET]:    {slot:0, points:2, dur:77,  mat:'Gold',    name:'Goldhelm',          color:0xf6dd6a},
  [GOLD_CHEST]:     {slot:1, points:5, dur:112, mat:'Gold',    name:'Goldbrustpanzer',   color:0xeac84a},
  [GOLD_LEGS]:      {slot:2, points:3, dur:105, mat:'Gold',    name:'Goldbeinschutz',    color:0xd9b53a},
  [GOLD_BOOTS]:     {slot:3, points:1, dur:91,  mat:'Gold',    name:'Goldstiefel',       color:0xc8a42f},
  [DIAMOND_HELMET]: {slot:0, points:3, dur:363, mat:'Diamant', name:'Diamanthelm',       color:0x72d8df},
  [DIAMOND_CHEST]:  {slot:1, points:8, dur:528, mat:'Diamant', name:'Diamantbrustpanzer',color:0x4cc2ca},
  [DIAMOND_LEGS]:   {slot:2, points:6, dur:495, mat:'Diamant', name:'Diamantbeinschutz', color:0x3ba9b1},
  [DIAMOND_BOOTS]:  {slot:3, points:3, dur:429, mat:'Diamant', name:'Diamantstiefel',    color:0x2f9097},
};
export function isArmor(id){ return ARMOR[id]!==undefined; }
export function stackable(id){ return !isTool(id) && !isArmor(id); }

export const BLOCK_MINE = {
  [GRASS]:  {hard:0.6, tool:'shovel', needsTool:false},
  [DIRT]:   {hard:0.5, tool:'shovel', needsTool:false},
  [SAND]:   {hard:0.5, tool:'shovel', needsTool:false},
  [GRAVEL]: {hard:0.6, tool:'shovel', needsTool:false},
  [SNOW]:   {hard:0.4, tool:'shovel', needsTool:false},
  [WOOL]:   {hard:0.5, tool:null,     needsTool:false},
  [STONE]:  {hard:2.2, tool:'pick',   needsTool:true},
  [COBBLE]: {hard:2.2, tool:'pick',   needsTool:true},
  [BRICKS]: {hard:2.4, tool:'pick',   needsTool:true},
  [CRAFTING_TABLE]: {hard:1.5, tool:'axe', needsTool:false},
  [WOOD]:   {hard:1.5, tool:'axe',    needsTool:false},
  [LOG]:    {hard:1.6, tool:'axe',    needsTool:false},
  [LEAVES]: {hard:0.3, tool:null,     needsTool:false},
  [GLASS]:  {hard:0.4, tool:null,     needsTool:false},
  [COAL_ORE]:   {hard:3.0, tool:'pick', needsTool:true, minTier:1},
  [COPPER_ORE]: {hard:3.0, tool:'pick', needsTool:true, minTier:2},
  [IRON_ORE]:   {hard:3.0, tool:'pick', needsTool:true, minTier:2},
  [GOLD_ORE]:   {hard:3.0, tool:'pick', needsTool:true, minTier:3},
  [DIAMOND_ORE]:{hard:3.6, tool:'pick', needsTool:true, minTier:3},
  [BEDROCK]:    {hard:1e9, tool:'pick', needsTool:true, minTier:99},
  [FURNACE]:    {hard:3.5, tool:'pick', needsTool:true, minTier:1},
  [TORCH]:      {hard:0.1, tool:null,   needsTool:false},
  [OBSIDIAN]:   {hard:25,  tool:'pick', needsTool:true, minTier:4},
  [TALL_GRASS]: {hard:0,   tool:null,   needsTool:false},
  [FLOWER_RED]: {hard:0,   tool:null,   needsTool:false},
  [FLOWER_YELLOW]:{hard:0, tool:null,   needsTool:false},
  [DEAD_BUSH]:  {hard:0,   tool:null,   needsTool:false},
  [CACTUS]:     {hard:0.4, tool:null,   needsTool:false},
  [BED]:        {hard:0.5, tool:null,   needsTool:false},
  [SPAWNER]:    {hard:4.0, tool:'pick', needsTool:true, minTier:1},
  [CHEST]:      {hard:1.5, tool:'axe',  needsTool:false},
  [ANVIL]:      {hard:4.0, tool:'pick', needsTool:true, minTier:1},
  [ENCHANTER]:  {hard:4.0, tool:'pick', needsTool:true, minTier:1},
  [NETHERRACK]: {hard:0.6, tool:'pick', needsTool:false},
  [GLOWSTONE]:  {hard:0.4, tool:null,   needsTool:false},
  [SOUL_SAND]:  {hard:0.6, tool:'shovel', needsTool:false},
  [REDSTONE_ORE]:{hard:3.0, tool:'pick', needsTool:true, minTier:2},
  [REDSTONE_WIRE]:   {hard:0, tool:null, needsTool:false},
  [REDSTONE_WIRE_ON]:{hard:0, tool:null, needsTool:false},
  [LEVER]:      {hard:0.1, tool:null,   needsTool:false},
  [LEVER_ON]:   {hard:0.1, tool:null,   needsTool:false},
  [REDSTONE_LAMP]:   {hard:0.4, tool:null, needsTool:false},
  [REDSTONE_LAMP_ON]:{hard:0.4, tool:null, needsTool:false},
  [TNT]:        {hard:0.1, tool:null,   needsTool:false},
  [LANTERN]:    {hard:0.5, tool:'pick', needsTool:false},
  [SOUL_LANTERN]:{hard:0.5,tool:'pick', needsTool:false},
  [CAMPFIRE]:   {hard:0.8, tool:'axe',  needsTool:false},
  [BOOKSHELF]:  {hard:1.2, tool:'axe',  needsTool:false},
  [BARREL]:     {hard:1.5, tool:'axe',  needsTool:false},
  [STONECUTTER]:{hard:2.5, tool:'pick', needsTool:true, minTier:1},
  [FARMLAND]:   {hard:0.6, tool:'shovel', needsTool:false},
  [WHEAT_S0]:   {hard:0, tool:null, needsTool:false}, [WHEAT_S1]:{hard:0, tool:null, needsTool:false},
  [WHEAT_S2]:   {hard:0, tool:null, needsTool:false}, [WHEAT_S3]:{hard:0, tool:null, needsTool:false},
  [SAPLING]:    {hard:0, tool:null, needsTool:false},
  [ICE]:        {hard:0.5, tool:'pick', needsTool:false},
  [KELP]:       {hard:0, tool:null, needsTool:false}, [CORAL]:{hard:0, tool:null, needsTool:false},
  [SNOW_LAYER]: {hard:0.1, tool:'shovel', needsTool:false},
  [FIRE]:       {hard:0, tool:null, needsTool:false},
  [COMPOSTER]:  {hard:0.6, tool:'axe', needsTool:false},
  [BREWING_STAND]:{hard:0.5, tool:'pick', needsTool:false},
  [ENDER_CHEST]:{hard:22, tool:'pick', needsTool:true, minTier:3},
  [GRINDSTONE]: {hard:2.0, tool:'pick', needsTool:true, minTier:1},
  [RAIL]:       {hard:0.7, tool:'pick', needsTool:false}, [POWERED_RAIL]:{hard:0.7, tool:'pick', needsTool:false},
  [END_PORTAL_FRAME]:{hard:1e9, tool:'pick', needsTool:true, minTier:99},
  [END_PORTAL]: {hard:1e9, tool:null, needsTool:false},
  [END_STONE]:  {hard:3.0, tool:'pick', needsTool:true, minTier:1},
  [PURPUR]:     {hard:1.5, tool:'pick', needsTool:true, minTier:1},
  [BEACON]:     {hard:3.0, tool:'pick', needsTool:false},
  [DRAGON_EGG]: {hard:3.0, tool:null, needsTool:false},
  [SUGARCANE]:  {hard:0, tool:null, needsTool:false},
  [IRON_BLOCK]: {hard:5.0, tool:'pick', needsTool:true, minTier:2},
  [GOLD_BLOCK]: {hard:3.0, tool:'pick', needsTool:true, minTier:3},
  [DIAMOND_BLOCK]:{hard:5.0, tool:'pick', needsTool:true, minTier:3},
  [COAL_BLOCK]: {hard:5.0, tool:'pick', needsTool:true, minTier:1},
  [REDSTONE_BLOCK]:{hard:5.0, tool:'pick', needsTool:true, minTier:2},
  [PUMPKIN]:    {hard:1.0, tool:'axe', needsTool:false},
  [JACK_O_LANTERN]:{hard:1.0, tool:'axe', needsTool:false},
  [SLIME_BLOCK]:{hard:0.0, tool:null, needsTool:false},
  [HAY_BLOCK]:  {hard:0.5, tool:null, needsTool:false},
  [EMERALD_ORE]:{hard:3.0, tool:'pick', needsTool:true, minTier:2},
  [EMERALD_BLOCK]:{hard:5.0, tool:'pick', needsTool:true, minTier:2},
  [DOOR_CLOSED]:{hard:0.6, tool:'axe', needsTool:false},
  [DOOR_OPEN]:  {hard:0.6, tool:'axe', needsTool:false},
  [TRAPDOOR_CLOSED]:{hard:0.5, tool:'axe', needsTool:false},
  [TRAPDOOR_OPEN]:  {hard:0.5, tool:'axe', needsTool:false},
  [CAKE]:       {hard:0.5, tool:null, needsTool:false},
  [SANDSTONE]:       {hard:1.6, tool:'pick', needsTool:true},
  [STONE_BRICKS]:    {hard:2.2, tool:'pick', needsTool:true},
  [POLISHED_STONE]:  {hard:2.2, tool:'pick', needsTool:true},
  [SMOOTH_SANDSTONE]:{hard:1.8, tool:'pick', needsTool:true},
  [MUSHROOM]:        {hard:0, tool:null, needsTool:false},
  [CRACKED_STONE_BRICKS]: {hard:2.2, tool:'pick', needsTool:true},
  [CHISELED_STONE_BRICKS]:{hard:2.2, tool:'pick', needsTool:true},
};
export function mineInfo(id){ return BLOCK_MINE[id] || {hard:1, tool:null, needsTool:false}; }

export const STACK_MAX=64, SLOT_COUNT=36;
export const PLAYER_HALF=0.3, PLAYER_HEIGHT=1.8, EYE_HEIGHT=1.62;
export const WALK_SPEED=4.7, GRAVITY=26, JUMP_VELOCITY=8.4, TERMINAL_VY=-42, REACH=6, SWIM_UP=4.2;
export const BUDGET_BASE=isTouch?5:6, BUDGET_MIN=3, BUDGET_MAX=isTouch?8:12;
export const HEALTH_MAX=10, HUNGER_MAX=10, AIR_MAX=10;
export const CHEST_SIZE=27;
export const NETHER_TOP=48, NETHER_LAVA=8;
export const END_Y=64;
export const CLOUD_Y=48;

export function dropFor(id){
  if(id===GRASS) return DIRT;
  if(id===STONE) return COBBLE;
  if(id===COAL_ORE) return COAL;
  if(id===COPPER_ORE) return RAW_COPPER;
  if(id===IRON_ORE) return RAW_IRON;
  if(id===GOLD_ORE) return RAW_GOLD;
  if(id===DIAMOND_ORE) return DIAMOND;
  if(id===EMERALD_ORE) return EMERALD;
  if(id===REDSTONE_ORE) return REDSTONE_WIRE;
  if(id===REDSTONE_WIRE_ON) return REDSTONE_WIRE;
  if(id===LEVER_ON) return LEVER;
  if(id===REDSTONE_LAMP_ON) return REDSTONE_LAMP;
  if(id===PORTAL) return AIR;
  if(id===FARMLAND) return DIRT;
  if(id===ICE) return AIR;
  if(id===SNOW_LAYER) return BONE_MEAL;
  if(id===FIRE||id===END_PORTAL) return AIR;
  if(id===WHEAT_S3) return WHEAT;
  if(id===WHEAT_S0||id===WHEAT_S1||id===WHEAT_S2) return WHEAT_SEEDS;
  if(id===SAPLING) return SAPLING;
  if(id===KELP) return KELP;
  if(id===CORAL) return CORAL;
  if(id===SUGARCANE) return SUGAR_CANE;
  if(id===CAMPFIRE) return CHARCOAL;
  if(id===END_PORTAL_FRAME) return AIR;
  if(id===DOOR_OPEN) return DOOR_CLOSED;
  if(id===TRAPDOOR_OPEN) return TRAPDOOR_CLOSED;
  if(id===CAKE) return AIR;
  if(id===LEAVES||id===GLASS||id===BEDROCK||id===TALL_GRASS||id===DEAD_BUSH)
    return (id===LEAVES&&Math.random()<0.05)?SAPLING:AIR;
  return id;
}
