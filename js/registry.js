// =====================================================================
//  REGISTRY — Crafting-Rezepte, Ofen-Logik, addItem, armorPoints
//  Circular deps (ui.js): Callbacks onChanged / onRenderInventory
// =====================================================================
import {
  AIR,
  LOG, WOOD, COBBLE, GLASS, SAND, STONE, OBSIDIAN, FURNACE, TORCH, CHEST,
  ANVIL, ENCHANTER, BED, LEVER, REDSTONE_LAMP, SPAWNER, LANTERN, SOUL_LANTERN,
  CAMPFIRE, BARREL, BOOKSHELF, COMPOSTER, STONECUTTER, GRINDSTONE, RAIL,
  POWERED_RAIL, END_PORTAL_FRAME, ENDER_CHEST, BEACON, IRON_BLOCK, GOLD_BLOCK,
  DIAMOND_BLOCK, COAL_BLOCK, REDSTONE_BLOCK, HAY_BLOCK, EMERALD_BLOCK,
  DOOR_CLOSED, TRAPDOOR_CLOSED, SANDSTONE, STONE_BRICKS, PUMPKIN, JACK_O_LANTERN,
  SLIME_BLOCK, WOOL, BREWING_STAND, REDSTONE_WIRE, END_STONE, SOUL_SAND, MUSHROOM,
  POLISHED_STONE, SMOOTH_SANDSTONE, TNT, SNOW, CRAFTING_TABLE, CAKE,
  STICK, COAL, RAW_IRON, RAW_COPPER, RAW_GOLD, IRON_INGOT, COPPER_INGOT, GOLD_INGOT,
  DIAMOND, LEATHER, ARROW_ITEM, SWORD_WOOD, WOOD_PICKAXE, WOOD_AXE, WOOD_SHOVEL,
  STONE_PICKAXE, STONE_AXE, STONE_SHOVEL, STONE_SWORD,
  IRON_PICKAXE, IRON_AXE, IRON_SHOVEL, IRON_SWORD,
  GOLD_PICKAXE, GOLD_AXE, GOLD_SHOVEL, GOLD_SWORD,
  DIAMOND_PICKAXE, DIAMOND_AXE, DIAMOND_SHOVEL, DIAMOND_SWORD,
  LEATHER_HELMET, LEATHER_CHEST, LEATHER_LEGS, LEATHER_BOOTS,
  IRON_HELMET, IRON_CHEST, IRON_LEGS, IRON_BOOTS,
  GOLD_HELMET, GOLD_CHEST, GOLD_LEGS, GOLD_BOOTS,
  DIAMOND_HELMET, DIAMOND_CHEST, DIAMOND_LEGS, DIAMOND_BOOTS,
  BOW, SHEARS, SNOWBALL, EMPTY_BUCKET, SPYGLASS, FLINT_AND_STEEL, ROTTEN_FLESH,
  WOOD_HOE, STONE_HOE, IRON_HOE, PAPER, BOOK, MAP_ITEM, SHIELD_ITEM,
  BREAD, GOLDEN_APPLE, BOWL, MUSHROOM_STEW, BONE_MEAL, FISHING_ROD, MINECART,
  GLASS_BOTTLE, BLAZE_POWDER, ENDER_EYE, PUMPKIN_SEEDS, COOKIE, SLIME_BALL,
  EMERALD, SUGAR, SUGAR_CANE, WHEAT, MILK_BUCKET, APPLE, GUNPOWDER, BONE,
  STRING, ENDER_PEARL, BLAZE_ROD, NETHER_STAR, CHARCOAL,
  COOKED_BEEF, COOKED_CHICKEN, COOKED_MUTTON, PORK_COOKED, COOKED_FISH,
  RAW_FISH, BEEF, CHICKEN_RAW, MUTTON, PORK_RAW,
  ARMOR, STACK_MAX, SLOT_COUNT,
} from './constants.js';

import {
  inv, craftGrid, craftN, setCraftOutput,
  invOpen, invMode, armor,
} from './state.js';

// =====================================================================
//  armorPoints + protPoints (brauchen armor aus state.js)
// =====================================================================
export function armorPoints(){ let p=0; for(let i=0;i<4;i++){ const a=armor[i]; if(a) p+=ARMOR[a.id].points; } return p; }
export function protPoints(){ let p=0; for(let i=0;i<4;i++){ const a=armor[i]; if(a && a.ench && a.ench.kind==='prot') p+=a.ench.lvl; } return p; }

// =====================================================================
//  addItem — Callback statt direktem UI-Aufruf
//  onChanged(id, pickedUp) wird nach jedem Aufruf aufgerufen;
//  in main.js: (id, pu) => { renderHotbar(); if(invOpen) renderInventory(); if(!invOpen&&pu) showItemName(id); }
// =====================================================================
export function addItem(id, count, onChanged = null){
  if(id===AIR||count<=0) return count;
  const start=count;
  for(let i=0;i<SLOT_COUNT && count>0;i++){ const s=inv[i]; if(s && s.id===id && s.count<STACK_MAX){ const a=Math.min(STACK_MAX-s.count,count); s.count+=a; count-=a; } }
  for(let i=0;i<SLOT_COUNT && count>0;i++){ if(!inv[i]){ const a=Math.min(STACK_MAX,count); inv[i]={id,count:a}; count-=a; } }
  if(onChanged) onChanged(id, count < start);
  return count;
}

// =====================================================================
//  RECIPES
// =====================================================================
export const RECIPES = [
  { in:{[LOG]:1},              out:{id:WOOD,           count:4} },
  { shape:["X","X"],           key:{X:WOOD},          out:{id:STICK,          count:4} },
  { shape:["XX","XX"],         key:{X:WOOD},          out:{id:CRAFTING_TABLE, count:1} },
  // Holz-Werkzeuge
  { shape:["XXX",".S.",".S."], key:{X:WOOD,S:STICK},  out:{id:WOOD_PICKAXE,  count:1} },
  { shape:["XX","XS",".S"],    key:{X:WOOD,S:STICK},  out:{id:WOOD_AXE,      count:1} },
  { shape:["X","S","S"],       key:{X:WOOD,S:STICK},  out:{id:WOOD_SHOVEL,   count:1} },
  { shape:["X","X","S"],       key:{X:WOOD,S:STICK},  out:{id:SWORD_WOOD,    count:1} },
  // Stein-Werkzeuge
  { shape:["XXX",".S.",".S."], key:{X:COBBLE,S:STICK}, out:{id:STONE_PICKAXE, count:1} },
  { shape:["XX","XS",".S"],    key:{X:COBBLE,S:STICK}, out:{id:STONE_AXE,     count:1} },
  { shape:["X","S","S"],       key:{X:COBBLE,S:STICK}, out:{id:STONE_SHOVEL,  count:1} },
  { shape:["X","X","S"],       key:{X:COBBLE,S:STICK}, out:{id:STONE_SWORD,   count:1} },
  // Ofen + Fackeln
  { shape:["XXX","X.X","XXX"], key:{X:COBBLE},          out:{id:FURNACE,        count:1} },
  { shape:["C","S"],           key:{C:COAL,S:STICK},    out:{id:TORCH,          count:4} },
  { shape:["X.X",".X."],       key:{X:IRON_INGOT},      out:{id:EMPTY_BUCKET,   count:1} },
  { shape:["G","C","C"],       key:{G:GLASS,C:COPPER_INGOT}, out:{id:SPYGLASS,  count:1} },
  // Eisen-Werkzeuge
  { shape:["XXX",".S.",".S."], key:{X:IRON_INGOT,S:STICK}, out:{id:IRON_PICKAXE, count:1} },
  { shape:["XX","XS",".S"],    key:{X:IRON_INGOT,S:STICK}, out:{id:IRON_AXE,     count:1} },
  { shape:["X","S","S"],       key:{X:IRON_INGOT,S:STICK}, out:{id:IRON_SHOVEL,  count:1} },
  { shape:["X","X","S"],       key:{X:IRON_INGOT,S:STICK}, out:{id:IRON_SWORD,   count:1} },
  // Gold-Werkzeuge
  { shape:["XXX",".S.",".S."], key:{X:GOLD_INGOT,S:STICK}, out:{id:GOLD_PICKAXE, count:1} },
  { shape:["XX","XS",".S"],    key:{X:GOLD_INGOT,S:STICK}, out:{id:GOLD_AXE,     count:1} },
  { shape:["X","S","S"],       key:{X:GOLD_INGOT,S:STICK}, out:{id:GOLD_SHOVEL,  count:1} },
  { shape:["X","X","S"],       key:{X:GOLD_INGOT,S:STICK}, out:{id:GOLD_SWORD,   count:1} },
  // Diamant-Werkzeuge
  { shape:["XXX",".S.",".S."], key:{X:DIAMOND,S:STICK}, out:{id:DIAMOND_PICKAXE, count:1} },
  { shape:["XX","XS",".S"],    key:{X:DIAMOND,S:STICK}, out:{id:DIAMOND_AXE,     count:1} },
  { shape:["X","S","S"],       key:{X:DIAMOND,S:STICK}, out:{id:DIAMOND_SHOVEL,  count:1} },
  { shape:["X","X","S"],       key:{X:DIAMOND,S:STICK}, out:{id:DIAMOND_SWORD,   count:1} },
  // Rüstung
  { shape:["XXX","X.X"],       key:{X:LEATHER},    out:{id:LEATHER_HELMET, count:1} },
  { shape:["X.X","XXX","XXX"], key:{X:LEATHER},    out:{id:LEATHER_CHEST,  count:1} },
  { shape:["XXX","X.X","X.X"], key:{X:LEATHER},    out:{id:LEATHER_LEGS,   count:1} },
  { shape:["X.X","X.X"],       key:{X:LEATHER},    out:{id:LEATHER_BOOTS,  count:1} },
  { shape:["XXX","X.X"],       key:{X:IRON_INGOT}, out:{id:IRON_HELMET,    count:1} },
  { shape:["X.X","XXX","XXX"], key:{X:IRON_INGOT}, out:{id:IRON_CHEST,     count:1} },
  { shape:["XXX","X.X","X.X"], key:{X:IRON_INGOT}, out:{id:IRON_LEGS,      count:1} },
  { shape:["X.X","X.X"],       key:{X:IRON_INGOT}, out:{id:IRON_BOOTS,     count:1} },
  { shape:["XXX","X.X"],       key:{X:GOLD_INGOT}, out:{id:GOLD_HELMET,    count:1} },
  { shape:["X.X","XXX","XXX"], key:{X:GOLD_INGOT}, out:{id:GOLD_CHEST,     count:1} },
  { shape:["XXX","X.X","X.X"], key:{X:GOLD_INGOT}, out:{id:GOLD_LEGS,      count:1} },
  { shape:["X.X","X.X"],       key:{X:GOLD_INGOT}, out:{id:GOLD_BOOTS,     count:1} },
  { shape:["XXX","X.X"],       key:{X:DIAMOND},    out:{id:DIAMOND_HELMET, count:1} },
  { shape:["X.X","XXX","XXX"], key:{X:DIAMOND},    out:{id:DIAMOND_CHEST,  count:1} },
  { shape:["XXX","X.X","X.X"], key:{X:DIAMOND},    out:{id:DIAMOND_LEGS,   count:1} },
  { shape:["X.X","X.X"],       key:{X:DIAMOND},    out:{id:DIAMOND_BOOTS,  count:1} },
  // Bogen + Pfeile
  { shape:[".XL","X.L",".XL"], key:{X:STICK, L:LEATHER},          out:{id:BOW,        count:1} },
  { shape:["C","S","L"],       key:{C:COBBLE, S:STICK, L:LEATHER}, out:{id:ARROW_ITEM, count:4} },
  // Bett
  { shape:["WWW","XXX"],       key:{W:WOOL, X:WOOD},               out:{id:BED,        count:1} },
  { in:{[IRON_INGOT]:2},                                           out:{id:SHEARS,     count:1} },
  { in:{[SNOW]:1},                                                 out:{id:SNOWBALL,   count:4} },
  // Stationen
  { shape:["XXX","X.X","XXX"], key:{X:WOOD},                       out:{id:CHEST,      count:1} },
  { shape:["III",".I.","III"], key:{I:IRON_INGOT},                 out:{id:ANVIL,      count:1} },
  { shape:["DDD",".O.","OOO"], key:{D:DIAMOND, O:OBSIDIAN},        out:{id:ENCHANTER,  count:1} },
  // Redstone
  { shape:["S","C"],           key:{S:STICK, C:COBBLE},            out:{id:LEVER,      count:1} },
  { shape:[".R.","RIR",".R."], key:{R:REDSTONE_WIRE, I:IRON_INGOT},out:{id:REDSTONE_LAMP, count:1} },
  // Feuerzeug
  { shape:["I.",".C"],         key:{I:IRON_INGOT, C:COBBLE},       out:{id:FLINT_AND_STEEL, count:1} },
  // Mob-Spawner
  { shape:["III","IRI","III"], key:{I:IRON_INGOT, R:ROTTEN_FLESH}, out:{id:SPAWNER, count:1} },
  // Hacken (v2)
  { shape:["XX",".S",".S"], key:{X:WOOD,S:STICK},       out:{id:WOOD_HOE,  count:1} },
  { shape:["XX",".S",".S"], key:{X:COBBLE,S:STICK},     out:{id:STONE_HOE, count:1} },
  { shape:["XX",".S",".S"], key:{X:IRON_INGOT,S:STICK}, out:{id:IRON_HOE,  count:1} },
  // TNT
  { shape:["GSG","SGS","GSG"], key:{G:GUNPOWDER,S:SAND}, out:{id:TNT, count:1} },
  // Licht
  { shape:["I","T","I"],       key:{I:IRON_INGOT,T:TORCH}, out:{id:LANTERN,      count:1} },
  { in:{[LANTERN]:1,[SOUL_SAND]:1},                        out:{id:SOUL_LANTERN, count:1} },
  { shape:[".S.","SCS","WWW"], key:{S:STICK,C:COAL,W:WOOD}, out:{id:CAMPFIRE,    count:1} },
  // Lager
  { shape:["WSW","W.W","WSW"], key:{W:WOOD,S:STICK},     out:{id:BARREL,    count:1} },
  { shape:["WWW","BBB","WWW"], key:{W:WOOD,B:BOOK},      out:{id:BOOKSHELF, count:1} },
  { shape:["W.W","W.W","WWW"], key:{W:WOOD},             out:{id:COMPOSTER, count:1} },
  { shape:[".I.","SSS"],       key:{I:IRON_INGOT,S:STONE}, out:{id:STONECUTTER, count:1} },
  { shape:["SCS","W.W"],       key:{S:STICK,C:STONE,W:WOOD}, out:{id:GRINDSTONE, count:1} },
  // Papier/Buch/Karte
  { shape:["SSS"],             key:{S:SUGAR_CANE},       out:{id:PAPER,    count:3} },
  { in:{[PAPER]:3,[LEATHER]:1},                          out:{id:BOOK,     count:1} },
  { shape:["PPP","PPP","PPP"], key:{P:PAPER},            out:{id:MAP_ITEM, count:1} },
  // Schild
  { shape:["WIW","WWW",".W."], key:{W:WOOD,I:IRON_INGOT}, out:{id:SHIELD_ITEM, count:1} },
  // Nahrung
  { shape:["WWW"],             key:{W:WHEAT},            out:{id:BREAD,        count:1} },
  { shape:["GGG","GAG","GGG"], key:{G:GOLD_INGOT,A:APPLE}, out:{id:GOLDEN_APPLE, count:1} },
  { in:{[SUGAR_CANE]:1},                                 out:{id:SUGAR,    count:1} },
  { shape:["MMM","SAS","WWW"], key:{M:MILK_BUCKET,S:SUGAR,A:APPLE,W:WHEAT}, out:{id:CAKE, count:1} },
  { in:{[WHEAT]:2,[SUGAR]:1},  out:{id:COOKIE,       count:8} },
  { shape:["X.X",".X."],       key:{X:WOOD},            out:{id:BOWL,         count:4} },
  { in:{[BOWL]:1,[MUSHROOM]:2},                          out:{id:MUSHROOM_STEW,count:1} },
  { in:{[BONE]:1},                                       out:{id:BONE_MEAL,   count:3} },
  // Angel
  { shape:["..S",".ST","S.T"], key:{S:STICK,T:STRING},  out:{id:FISHING_ROD, count:1} },
  // Schienen + Lore
  { shape:["I.I","III"],       key:{I:IRON_INGOT},        out:{id:MINECART, count:1} },
  { shape:["I.I","ISI","I.I"], key:{I:IRON_INGOT,S:STICK}, out:{id:RAIL,    count:16} },
  { shape:["G.G","GSG","GRG"], key:{G:GOLD_INGOT,S:STICK,R:REDSTONE_WIRE}, out:{id:POWERED_RAIL, count:6} },
  // Brauen / End / Beacon
  { shape:["G.G",".G."],       key:{G:GLASS},            out:{id:GLASS_BOTTLE, count:3} },
  { shape:[".B.","CCC"],       key:{B:BLAZE_ROD,C:COBBLE}, out:{id:BREWING_STAND, count:1} },
  { in:{[BLAZE_ROD]:1},                                  out:{id:BLAZE_POWDER, count:2} },
  { in:{[ENDER_PEARL]:1,[BLAZE_POWDER]:1},               out:{id:ENDER_EYE,  count:1} },
  { shape:["OOO","OEO","OOO"], key:{O:OBSIDIAN,E:ENDER_EYE}, out:{id:ENDER_CHEST, count:1} },
  { shape:["GGG","GNG","OOO"], key:{G:GLASS,N:NETHER_STAR,O:OBSIDIAN}, out:{id:BEACON, count:1} },
  // End-Portalrahmen
  { shape:["EEE","E.E"],       key:{E:END_STONE},        out:{id:END_PORTAL_FRAME, count:2} },
  { shape:["OO","OO"],         key:{O:OBSIDIAN},         out:{id:END_PORTAL_FRAME, count:1} },
  // Mineralblöcke (3x3 → Block)
  { shape:["XXX","XXX","XXX"], key:{X:IRON_INGOT},   out:{id:IRON_BLOCK,     count:1} },
  { shape:["XXX","XXX","XXX"], key:{X:GOLD_INGOT},   out:{id:GOLD_BLOCK,     count:1} },
  { shape:["XXX","XXX","XXX"], key:{X:DIAMOND},      out:{id:DIAMOND_BLOCK,  count:1} },
  { shape:["XXX","XXX","XXX"], key:{X:COAL},         out:{id:COAL_BLOCK,     count:1} },
  { shape:["XXX","XXX","XXX"], key:{X:REDSTONE_WIRE},out:{id:REDSTONE_BLOCK, count:1} },
  { shape:["XXX","XXX","XXX"], key:{X:WHEAT},        out:{id:HAY_BLOCK,      count:1} },
  // Block → Material
  { in:{[IRON_BLOCK]:1},     out:{id:IRON_INGOT,    count:9} },
  { in:{[GOLD_BLOCK]:1},     out:{id:GOLD_INGOT,    count:9} },
  { in:{[DIAMOND_BLOCK]:1},  out:{id:DIAMOND,       count:9} },
  { in:{[COAL_BLOCK]:1},     out:{id:COAL,          count:9} },
  { in:{[REDSTONE_BLOCK]:1}, out:{id:REDSTONE_WIRE, count:9} },
  { in:{[HAY_BLOCK]:1},      out:{id:WHEAT,         count:9} },
  // Slime
  { shape:["XX","XX"],       key:{X:SLIME_BALL},    out:{id:SLIME_BLOCK,  count:1} },
  { in:{[SLIME_BLOCK]:1},    out:{id:SLIME_BALL,   count:4} },
  // Kürbis
  { in:{[PUMPKIN]:1,[TORCH]:1}, out:{id:JACK_O_LANTERN, count:1} },
  { in:{[PUMPKIN]:1},        out:{id:PUMPKIN_SEEDS, count:4} },
  // Smaragd
  { shape:["XXX","XXX","XXX"], key:{X:EMERALD}, out:{id:EMERALD_BLOCK, count:1} },
  { in:{[EMERALD_BLOCK]:1},  out:{id:EMERALD, count:9} },
  // Türen + Falltüren
  { shape:["XX","XX","XX"], key:{X:WOOD}, out:{id:DOOR_CLOSED,     count:3} },
  { shape:["XXX","XXX"],    key:{X:WOOD}, out:{id:TRAPDOOR_CLOSED, count:2} },
  // Baublocke
  { shape:["XX","XX"],       key:{X:SAND},  out:{id:SANDSTONE,    count:1} },
  { shape:["XX","XX"],       key:{X:STONE}, out:{id:STONE_BRICKS, count:4} },
];

// =====================================================================
//  Crafting-Helfer
// =====================================================================
function craftCounts(){ const c={}; for(let i=0;i<craftN*craftN;i++){ const s=craftGrid[i]; if(s) c[s.id]=(c[s.id]||0)+1; } return c; }
function gridIds(){ const a=[]; for(let r=0;r<craftN;r++){ a.push([]); for(let c=0;c<craftN;c++){ const s=craftGrid[r*craftN+c]; a[r].push(s?s.id:null); } } return a; }
function trimGrid(g){ let r0=9,r1=-1,c0=9,c1=-1; for(let r=0;r<g.length;r++)for(let c=0;c<g[r].length;c++) if(g[r][c]!=null){ if(r<r0)r0=r; if(r>r1)r1=r; if(c<c0)c0=c; if(c>c1)c1=c; } if(r1<0) return null; const o=[]; for(let r=r0;r<=r1;r++){ const row=[]; for(let c=c0;c<=c1;c++) row.push(g[r][c]); o.push(row); } return o; }
function shapeIds(rc){ return rc.shape.map(row=>row.split('').map(ch=>(ch==='.'||ch===' ')?null:rc.key[ch])); }
function eqGrid(a,b){ if(!a||!b||a.length!==b.length) return false; for(let r=0;r<a.length;r++){ if(a[r].length!==b[r].length) return false; for(let c=0;c<a[r].length;c++) if(a[r][c]!==b[r][c]) return false; } return true; }

export function matchRecipe(){
  const tg=trimGrid(gridIds());
  for(const r of RECIPES){
    if(r.shape){ if(tg && eqGrid(tg, trimGrid(shapeIds(r)))) return r; }
    else { const c=craftCounts(), ids=Object.keys(c), rids=Object.keys(r.in); if(rids.length!==ids.length) continue; let ok=true; for(const k of rids){ if(c[k]!==r.in[k]){ ok=false; break; } } if(ok) return r; }
  }
  return null;
}
export function recomputeCraft(){ const r=matchRecipe(); setCraftOutput(r ? {id:r.out.id, count:r.out.count} : null); }

// =====================================================================
//  Ofen (Furnace)
// =====================================================================
export const SMELT = {
  [RAW_IRON]:IRON_INGOT, [RAW_COPPER]:COPPER_INGOT, [RAW_GOLD]:GOLD_INGOT,
  [SAND]:GLASS, [COBBLE]:STONE, [STONE]:POLISHED_STONE, [SANDSTONE]:SMOOTH_SANDSTONE,
  [BEEF]:COOKED_BEEF, [CHICKEN_RAW]:COOKED_CHICKEN, [MUTTON]:COOKED_MUTTON, [PORK_RAW]:PORK_COOKED,
  [RAW_FISH]:COOKED_FISH, [LOG]:CHARCOAL, [WOOD]:CHARCOAL,
};
export const FUEL = { [COAL]:50, [LOG]:16, [WOOD]:16, [CRAFTING_TABLE]:16, [STICK]:7 };
export const furnaces = new Map();

export function furnaceAt(key){
  let f=furnaces.get(key);
  if(!f){ f={slots:[null,null,null], cook:0, cookMax:6, burn:0, burnMax:0}; furnaces.set(key,f); }
  return f;
}
function furnaceOutRoom(f, outId){ const o=f.slots[2]; return !o || (o.id===outId && o.count<STACK_MAX); }

function tickFurnace(f, dt){
  const inS=f.slots[0], fuelS=f.slots[1];
  const canSmelt = inS && SMELT[inS.id]!==undefined && furnaceOutRoom(f, SMELT[inS.id]);
  if(f.burn>0) f.burn-=dt;
  if(f.burn<=0 && canSmelt && fuelS && FUEL[fuelS.id]!==undefined){
    f.burnMax=FUEL[fuelS.id]; f.burn=f.burnMax;
    fuelS.count--; if(fuelS.count<=0) f.slots[1]=null;
  }
  if(f.burn>0 && canSmelt){
    f.cook+=dt;
    if(f.cook>=f.cookMax-1e-6){
      f.cook=0; const out=SMELT[inS.id];
      inS.count--; if(inS.count<=0) f.slots[0]=null;
      const o=f.slots[2]; if(!o) f.slots[2]={id:out,count:1}; else o.count++;
    }
  } else { f.cook=Math.max(0, f.cook-dt*2); }
}

// onRenderInventory: in main.js => () => { if(invOpen && invMode==='furnace') renderInventory(); }
export function tickAllFurnaces(dt, onRenderInventory = null){
  for(const f of furnaces.values()) tickFurnace(f, dt);
  if(onRenderInventory && invOpen && invMode==='furnace') onRenderInventory();
}
