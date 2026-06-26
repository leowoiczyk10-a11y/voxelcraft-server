// =====================================================================
//  WORLD — Noise, Terrain-Generierung, Chunk-Klasse, world-Objekt
//  Circular deps (rendering + network) via Callbacks lösen:
//    onMeshSection / onMeshChunk / onDisposeChunk / onSendBlock
// =====================================================================
import {
  AIR, GRASS, DIRT, STONE, SAND, WATER, WOOD, COBBLE, GLASS, BRICKS,
  LOG, LEAVES, SNOW, CRAFTING_TABLE, BEDROCK,
  COAL_ORE, COPPER_ORE, IRON_ORE, GOLD_ORE, DIAMOND_ORE, EMERALD_ORE,
  LAVA, OBSIDIAN,
  TALL_GRASS, FLOWER_RED, FLOWER_YELLOW, CACTUS, DEAD_BUSH, MUSHROOM, PUMPKIN,
  BED, SPAWNER, CHEST, NETHERRACK, GLOWSTONE, SOUL_SAND, TNT,
  LANTERN, CAMPFIRE, FARMLAND, WHEAT_S3, ICE, KELP, CORAL,
  SNOW_LAYER, BREWING_STAND, END_STONE, PURPUR,
  DRAGON_EGG, SUGARCANE, DOOR_CLOSED, TORCH,
  CHUNK_SIZE, Y_MIN, Y_MAX, WATER_LEVEL, LAVA_SEA,
  NUM_SECTIONS, SECTION_H, SECTION_VOL, WORLD_HEIGHT, sectionOf,
  BLOCKS,
} from './constants.js';

import {
  SEED,
  currentSeed, setCurrentSeed,
  perlin,       setPerlin,
  dimension,
  genDim,
  overridesByChunk,
  lastCX, setLastCX,
  lastCZ, setLastCZ,
} from './state.js';

// =====================================================================
//  NOISE (seeded, reseedbar)
// =====================================================================
function mulberry32(a){ return function(){ a|=0; a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
function makePerlin(seed){
  const perm=new Uint8Array(512), p=[...Array(256).keys()], rnd=mulberry32(seed);
  for(let i=255;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; }
  for(let i=0;i<512;i++) perm[i]=p[i&255];
  const fade=t=>t*t*t*(t*(t*6-15)+10), lerp=(a,b,t)=>a+t*(b-a);
  const grad=(h,x,y)=>((h&1)?-x:x)+((h&2)?-y:y);
  return function(x,y){
    const X=Math.floor(x)&255, Y=Math.floor(y)&255; x-=Math.floor(x); y-=Math.floor(y);
    const u=fade(x), v=fade(y), A=perm[X]+Y, B=perm[X+1]+Y;
    return lerp(lerp(grad(perm[A],x,y),grad(perm[B],x-1,y),u),
                lerp(grad(perm[A+1],x,y-1),grad(perm[B+1],x-1,y-1),u),v);
  };
}
export function reseed(s){
  setCurrentSeed(s);
  setPerlin(makePerlin(s));
}
// Initialisierung beim Modul-Load (vor dem ersten generateChunkData-Aufruf)
reseed(SEED);

// deterministischer Hash pro Welt-Koordinate
function hash2(x,z){
  let h = (Math.imul(x|0,374761393) + Math.imul(z|0,668265263) + Math.imul(currentSeed|0,1274126177)) | 0;
  h = Math.imul(h ^ (h>>>13), 1274126177);
  return ((h ^ (h>>>16)) >>> 0) / 4294967296;
}
export { hash2 };

// 3D Value-Noise (Höhlen + Erzadern)
function vhash3(x,y,z){ let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(z|0,2246822519)+Math.imul(currentSeed|0,3266489917))|0; h=Math.imul(h^(h>>>13),1274126177); return ((h^(h>>>16))>>>0)/4294967296; }
function noise3(x,y,z){
  const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z);
  const xf=x-xi,yf=y-yi,zf=z-zi;
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf), w=zf*zf*(3-2*zf);
  const L=(a,b,t)=>a+(b-a)*t;
  return L(L(L(vhash3(xi,yi,zi),vhash3(xi+1,yi,zi),u), L(vhash3(xi,yi+1,zi),vhash3(xi+1,yi+1,zi),u), v),
           L(L(vhash3(xi,yi,zi+1),vhash3(xi+1,yi,zi+1),u), L(vhash3(xi,yi+1,zi+1),vhash3(xi+1,yi+1,zi+1),u), v), w);
}
export { noise3 };

function oreAt(x,y,z){
  if(y< -24 && noise3(x*0.17+11, y*0.17, z*0.17+11) > 0.88) return DIAMOND_ORE;
  if(y<   8 && noise3(x*0.17+27, y*0.17, z*0.17+27) > 0.87) return GOLD_ORE;
  if(y>74 && noise3(x*0.22+131, y*0.22, z*0.22+131) > 0.90) return EMERALD_ORE;
  if(y<  56 && noise3(x*0.16+43, y*0.16, z*0.16+43) > 0.83) return IRON_ORE;
  if(y<  68 && noise3(x*0.16+61, y*0.16, z*0.16+61) > 0.85) return COPPER_ORE;
  if(noise3(x*0.15+79, y*0.15, z*0.15+79) > 0.84) return COAL_ORE;
  return 0;
}

// Setzt einen Block nur wenn er in diesem Chunk liegt
function setTreeBlock(data, ox, oz, wx, wy, wz, id, onlyAir){
  if(wy<Y_MIN||wy>=Y_MAX) return;
  const lx=wx-ox, lz=wz-oz;
  if(lx<0||lx>=CHUNK_SIZE||lz<0||lz>=CHUNK_SIZE) return;
  const i=((wy-Y_MIN)*CHUNK_SIZE+lz)*CHUNK_SIZE+lx;
  if(onlyAir && data[i]!==AIR) return;
  data[i]=id;
}

export function terrainHeight(wx,wz){
  let amp=1, freq=1/120, sum=0, val=0;
  for(let o=0;o<4;o++){ val+=perlin(wx*freq,wz*freq)*amp; sum+=amp; amp*=0.5; freq*=2.1; }
  val/=sum;
  return Math.max(WATER_LEVEL-14, Math.min(100, Math.floor((WATER_LEVEL+2)+val*20)));
}

const DESERT_T = 0.62;
function biomeNoise(wx,wz){ return (perlin(wx/240+1000, wz/240-1000)+1)*0.5; }
function tempNoise(wx,wz){ return (perlin(wx/300-2000, wz/300+2000)+1)*0.5; }
function moistNoise(wx,wz){ return (perlin(wx/210+5000, wz/210-5000)+1)*0.5; }
function isCold(wx,wz){ return terrainHeight(wx,wz) > WATER_LEVEL+16 || tempNoise(wx,wz) < 0.32; }
export function biomeAt(wx,wz){
  const h=terrainHeight(wx,wz);
  if(h<=WATER_LEVEL+1) return 'ocean';
  if(isCold(wx,wz)) return 'snow';
  const bn=biomeNoise(wx,wz), tn=tempNoise(wx,wz), mo=moistNoise(wx,wz);
  if(bn>DESERT_T) return 'desert';
  if(h<=WATER_LEVEL+3 && mo>0.6) return 'swamp';
  if(tn>0.7 && bn<0.4) return 'savanna';
  if(tn>0.6 && mo>0.66) return 'jungle';
  if(mo>0.56) return 'forest';
  return 'plains';
}

// =====================================================================
//  NETHER / END — lokale Konstanten
// =====================================================================
const NETHER_TOP=48, NETHER_LAVA=8;
export const lootChests = new Set();
export const richChests = new Set();
export const END_Y = 64;
export const END_PILLARS = [];
(function(){ for(let i=0;i<8;i++){ const a=i/8*6.283, r=26; END_PILLARS.push({x:Math.round(Math.cos(a)*r), z:Math.round(Math.sin(a)*r), h:12+(i%4)*5}); } })();

// =====================================================================
//  CHUNK-GENERIERUNG — Oberwelt
// =====================================================================
export function generateChunkData(cx,cz){
  if(genDim===1) return generateNetherData(cx,cz);
  if(genDim===2) return generateEndData(cx,cz);
  const data=new Uint8Array(CHUNK_SIZE*WORLD_HEIGHT*CHUNK_SIZE);
  const ox=cx*CHUNK_SIZE, oz=cz*CHUNK_SIZE;
  for(let z=0;z<CHUNK_SIZE;z++) for(let x=0;x<CHUNK_SIZE;x++){
    const wx=ox+x, wz=oz+z;
    const h=terrainHeight(wx,wz), beach=h<=WATER_LEVEL+1, snowy=h>WATER_LEVEL+18;
    const desert = !beach && !snowy && biomeNoise(wx,wz) > DESERT_T;
    for(let y=Y_MIN;y<Y_MAX;y++){
      let b=AIR;
      if(y===Y_MIN){ b=BEDROCK; }
      else if(y<=h){
        if(y===h) b = beach?SAND : (snowy?SNOW : (desert?SAND:GRASS));
        else if(y>=h-3) b = (beach||desert)?SAND : DIRT;
        else b = STONE;
        if(b===STONE && y>Y_MIN+2 && y<h-2){
          if(noise3(wx*0.09, y*0.13, wz*0.09) > 0.78 || noise3(wx*0.05+50, y*0.08, wz*0.05+50) > 0.84){
            b = (y <= LAVA_SEA) ? LAVA : AIR;
          }
        }
        if(b===STONE){ const o=oreAt(wx,y,wz); if(o) b=o; }
      } else if(y<=WATER_LEVEL){ b = (snowy && y===WATER_LEVEL) ? ICE : WATER; }
      data[((y-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=b;
    }
    const top=h+1;
    if(h>WATER_LEVEL+1 && top<Y_MAX){
      const pr=hash2(wx*1.7+300, wz*1.7-300);
      if(desert){
        if(pr<0.010){ const ch=1+((hash2(wx-9,wz+9)*3)|0); for(let k=0;k<ch && top+k<Y_MAX;k++) data[((top+k-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=CACTUS; }
        else if(pr<0.020){ data[((top-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=DEAD_BUSH; }
      } else if(snowy){
        if(pr<0.6) data[((top-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=SNOW_LAYER;
      } else {
        const bio2=biomeAt(wx,wz), ti=((top-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x;
        if(bio2==='swamp'){
          if(pr<0.20) data[ti]=TALL_GRASS; else if(pr<0.24) data[ti]=DEAD_BUSH; else if(pr<0.27) data[ti]=MUSHROOM;
        } else if(bio2==='jungle'){
          if(pr<0.30) data[ti]=TALL_GRASS; else if(pr<0.34) data[ti]=(hash2(wx+5,wz+5)<0.5)?FLOWER_RED:FLOWER_YELLOW;
        } else if(bio2==='forest'){
          if(pr<0.18) data[ti]=TALL_GRASS; else if(pr<0.23) data[ti]=(hash2(wx+5,wz+5)<0.5)?FLOWER_RED:FLOWER_YELLOW; else if(pr<0.245) data[ti]=MUSHROOM;
        } else {
          if(pr<0.10) data[ti]=TALL_GRASS;
          else if(pr<0.115) data[ti]=(hash2(wx+5,wz+5)<0.5)?FLOWER_RED:FLOWER_YELLOW;
          else if(pr<0.119) data[ti]=PUMPKIN;
        }
      }
    } else if(h===WATER_LEVEL+1 && top<Y_MAX){
      if(hash2(wx*2.3+7, wz*2.3-7)<0.06){ const ch=1+((hash2(wx,wz)*3)|0); for(let k=0;k<ch && top+k<Y_MAX;k++) data[((top+k-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=SUGARCANE; }
    } else if(h<=WATER_LEVEL && h>WATER_LEVEL-13){
      const pr=hash2(wx*2.1+11, wz*2.1-11);
      if(pr<0.05){ const kh=1+((hash2(wx-3,wz+3)*4)|0); for(let k=0;k<kh && h+1+k<=WATER_LEVEL;k++) data[((h+1+k-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=KELP; }
      else if(pr<0.075 && h+1<=WATER_LEVEL){ data[((h+1-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=CORAL; }
    }
  }
  // Bäume
  const M=3;
  for(let tz=-M; tz<CHUNK_SIZE+M; tz++) for(let tx=-M; tx<CHUNK_SIZE+M; tx++){
    const wx=ox+tx, wz=oz+tz;
    const bio=biomeAt(wx,wz);
    let dens;
    if(bio==='jungle') dens=0.085; else if(bio==='forest') dens=0.06;
    else if(bio==='swamp') dens=0.02; else if(bio==='savanna') dens=0.006;
    else if(bio==='plains') dens=0.012; else continue;
    if(hash2(wx,wz) > dens) continue;
    const gh=terrainHeight(wx,wz);
    if(gh<=WATER_LEVEL+1 || gh>WATER_LEVEL+18) continue;
    const big = (bio==='jungle');
    const trunk = (big ? 8 + ((hash2(wx-3,wz+3)*5)|0) : 4 + ((hash2(wx+7,wz-7)*3)|0));
    const topY = gh + trunk;
    for(let i=1;i<=trunk;i++) setTreeBlock(data, ox, oz, wx, gh+i, wz, LOG, false);
    const baseR = big?3:2;
    for(let ly=topY-2; ly<=topY+1; ly++){
      const r = (ly>=topY) ? (big?2:1) : baseR;
      for(let lz=-r; lz<=r; lz++) for(let lx=-r; lx<=r; lx++){
        if(Math.abs(lx)===r && Math.abs(lz)===r) continue;
        setTreeBlock(data, ox, oz, wx+lx, ly, wz+lz, LEAVES, true);
      }
    }
    if(big){
      for(let v=0; v<3; v++){
        const vx=wx+((hash2(wx+v,wz-v)*5|0)-2), vz=wz+((hash2(wx-v,wz+v)*5|0)-2);
        const vlen=2+((hash2(vx,vz)*4)|0);
        for(let k=0;k<vlen;k++) setTreeBlock(data, ox, oz, vx, topY-2-k, vz, LEAVES, true);
      }
    }
  }
  placeStructures(data, cx, cz, ox, oz);
  return data;
}

// ---- Nether ----
function generateNetherData(cx,cz){
  const data=new Uint8Array(CHUNK_SIZE*WORLD_HEIGHT*CHUNK_SIZE);
  const ox=cx*CHUNK_SIZE, oz=cz*CHUNK_SIZE;
  for(let z=0;z<CHUNK_SIZE;z++) for(let x=0;x<CHUNK_SIZE;x++){
    const wx=ox+x, wz=oz+z;
    for(let y=Y_MIN;y<NETHER_TOP;y++){
      let b;
      if(y===Y_MIN || y===NETHER_TOP-1) b=BEDROCK;
      else {
        const cave = noise3(wx*0.07, y*0.09, wz*0.07) > 0.62;
        b = cave ? ((y<=NETHER_LAVA)?LAVA:AIR) : NETHERRACK;
      }
      if(b===NETHERRACK && y===NETHER_TOP-2 && hash2(wx*3+1, wz*3-1) < 0.03) b=GLOWSTONE;
      if(b===NETHERRACK && y<NETHER_LAVA+6 && noise3(wx*0.2+9, y*0.2, wz*0.2-9) > 0.8) b=SOUL_SAND;
      data[((y-Y_MIN)*CHUNK_SIZE+z)*CHUNK_SIZE+x]=b;
    }
  }
  placeNetherStructures(data, ox, oz);
  return data;
}

// ---- End ----
function generateEndData(cx,cz){
  const data=new Uint8Array(CHUNK_SIZE*WORLD_HEIGHT*CHUNK_SIZE);
  const ox=cx*CHUNK_SIZE, oz=cz*CHUNK_SIZE;
  const setE=(wx,wy,wz,id)=>{ const lx=wx-ox, lz=wz-oz; if(lx<0||lx>=CHUNK_SIZE||lz<0||lz>=CHUNK_SIZE||wy<Y_MIN||wy>=Y_MAX) return; data[((wy-Y_MIN)*CHUNK_SIZE+lz)*CHUNK_SIZE+lx]=id; };
  for(let z=0;z<CHUNK_SIZE;z++) for(let x=0;x<CHUNK_SIZE;x++){
    const wx=ox+x, wz=oz+z, dc=Math.hypot(wx,wz);
    let island=false, outer=false;
    if(dc<42) island=true;
    else if(dc>72){ const n=(noise3(wx*0.018, 4.5, wz*0.018)); if(n>0.70) { island=true; outer=true; } }
    if(island){
      const dome = dc<42 ? Math.floor((1-dc/42)*6) : 0;
      const top = END_Y + dome;
      const thick = 4 + Math.floor(noise3(wx*0.08,5,wz*0.08)*5);
      for(let y=top-thick;y<=top;y++) setE(wx,y,wz, END_STONE);
      if(outer && noise3(wx*0.3,9,wz*0.3)>0.85){ setE(wx,top+1,wz, PURPUR); }
    }
  }
  for(const p of END_PILLARS){ if(p.x>=ox-1 && p.x<ox+CHUNK_SIZE+1 && p.z>=oz-1 && p.z<oz+CHUNK_SIZE+1){
    for(let y=END_Y; y<=END_Y+p.h; y++) for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++) setE(p.x+dx,y,p.z+dz, OBSIDIAN);
  } }
  const cityX=140, cityZ=20;
  if(cityX>=ox-3 && cityX<ox+CHUNK_SIZE+3 && cityZ>=oz-3 && cityZ<oz+CHUNK_SIZE+3){
    for(let y=END_Y; y<END_Y+14; y++) for(let dx=-3;dx<=3;dx++) for(let dz=-3;dz<=3;dz++){ const edge=Math.abs(dx)===3||Math.abs(dz)===3; if(edge) setE(cityX+dx,y,cityZ+dz, PURPUR); }
    for(let dx=-3;dx<=3;dx++) for(let dz=-3;dz<=3;dz++) setE(cityX+dx,END_Y+14,cityZ+dz, PURPUR);
    setE(cityX,END_Y+15,cityZ, DRAGON_EGG);
  }
  return data;
}

// =====================================================================
//  STRUKTUREN
// =====================================================================
function placeStructures(data,cx,cz,ox,oz){
  const CELL=40, M=8;
  for(let gz=Math.floor((oz-M)/CELL); gz<=Math.floor((oz+CHUNK_SIZE+M)/CELL); gz++)
  for(let gx=Math.floor((ox-M)/CELL); gx<=Math.floor((ox+CHUNK_SIZE+M)/CELL); gx++){
    const r=hash2(gx*131+7, gz*197-3);
    if(r>0.5) continue;
    const ax=gx*CELL + 6 + ((hash2(gx*31+1,gz*17+5)*(CELL-12))|0);
    const az=gz*CELL + 6 + ((hash2(gx*13-2,gz*29+9)*(CELL-12))|0);
    if(r<0.24) buildHut(data,ox,oz,ax,az); else buildDungeon(data,ox,oz,ax,az);
  }
  const VCELL=240, VM=18;
  for(let gz=Math.floor((oz-VM)/VCELL); gz<=Math.floor((oz+CHUNK_SIZE+VM)/VCELL); gz++)
  for(let gx=Math.floor((ox-VM)/VCELL); gx<=Math.floor((ox+CHUNK_SIZE+VM)/VCELL); gx++){
    if(hash2(gx*311+19, gz*373-23) > 0.4) continue;
    const cxv=gx*VCELL + 30 + ((hash2(gx*41+11,gz*53+7)*(VCELL-60))|0);
    const czv=gz*VCELL + 30 + ((hash2(gx*23-13,gz*37+5)*(VCELL-60))|0);
    buildVillage(data, ox, oz, cxv, czv, gx, gz);
  }
  const LCELL=72, LM=10;
  for(let gz=Math.floor((oz-LM)/LCELL); gz<=Math.floor((oz+CHUNK_SIZE+LM)/LCELL); gz++)
  for(let gx=Math.floor((ox-LM)/LCELL); gx<=Math.floor((ox+CHUNK_SIZE+LM)/LCELL); gx++){
    if(hash2(gx*733+57, gz*829-91) > 0.30) continue;
    const ax=gx*LCELL + 8 + ((hash2(gx*47+3,gz*59+11)*(LCELL-16))|0);
    const az=gz*LCELL + 8 + ((hash2(gx*53-9,gz*43+7)*(LCELL-16))|0);
    const bi=biomeAt(ax,az);
    if(bi==='plains'||bi==='forest'||bi==='savanna') buildCamp(data,ox,oz,ax,az);
  }
  placeSpecialStructures(data, ox, oz);
}
function buildVillage(data, ox, oz, cx, cz, gx, gz){
  const base=terrainHeight(cx, cz);
  if(base<=WATER_LEVEL+1 || base>WATER_LEVEL+25) return;
  if(biomeNoise(cx,cz) > DESERT_T) return;
  for(let dz=-1;dz<=1;dz++) for(let dx=-1;dx<=1;dx++){
    setTreeBlock(data,ox,oz, cx+dx, base, cz+dz, COBBLE, false);
    if(Math.abs(dx)===1||Math.abs(dz)===1){
      setTreeBlock(data,ox,oz, cx+dx, base+1, cz+dz, COBBLE, false);
      setTreeBlock(data,ox,oz, cx+dx, base+2, cz+dz, COBBLE, false);
    } else setTreeBlock(data,ox,oz, cx+dx, base+1, cz+dz, WATER, false);
  }
  const SLOTS=[[ -8,-2],[8,-2],[0,9]];
  let hi=0;
  for(const s of SLOTS){
    const ax=cx+s[0], az=cz+s[1];
    if(hi===0) buildVillageHouse(data, ox, oz, ax, az, true);
    else buildVillageHouse(data, ox, oz, ax, az, false);
    hi++;
  }
  for(let dz=-2;dz<=2;dz++) for(let dx=-2;dx<=2;dx++){
    const fx=cx+dx-12, fz=cz+dz;
    const fy=terrainHeight(fx,fz);
    setTreeBlock(data,ox,oz, fx, fy, fz, FARMLAND, false);
    if((dx+dz)&1) setTreeBlock(data,ox,oz, fx, fy+1, fz, WHEAT_S3, false);
  }
}
function buildVillageHouse(data, ox, oz, ax, az, hasLoot){
  const base=terrainHeight(ax,az);
  if(base<=WATER_LEVEL+1 || base>WATER_LEVEL+30) return;
  const W=3;
  for(let dz=-W;dz<=W;dz++) for(let dx=-W;dx<=W;dx++){
    setTreeBlock(data,ox,oz, ax+dx, base, az+dz, WOOD, false);
    const edge=(Math.abs(dx)===W||Math.abs(dz)===W);
    if(edge){
      for(let h=1;h<=3;h++) setTreeBlock(data,ox,oz, ax+dx, base+h, az+dz, (h===3?LOG:COBBLE), false);
      if((dx===W && dz===0)||(dx===-W && dz===0)) setTreeBlock(data,ox,oz, ax+dx, base+2, az+dz, GLASS, false);
    }
  }
  setTreeBlock(data,ox,oz, ax, base+1, az+W, DOOR_CLOSED, false);
  setTreeBlock(data,ox,oz, ax, base+2, az+W, AIR, false);
  for(let dz=-W;dz<=W;dz++) for(let dx=-W;dx<=W;dx++) setTreeBlock(data,ox,oz, ax+dx, base+4, az+dz, WOOD, false);
  setTreeBlock(data,ox,oz, ax, base+3, az, LANTERN, false);
  if(hasLoot){ setTreeBlock(data,ox,oz, ax+1, base+1, az-1, CHEST, false); lootChests.add((ax+1)+'_'+(base+1)+'_'+(az-1)); }
}
function buildHut(data,ox,oz,ax,az){
  const base=terrainHeight(ax,az);
  if(base<=WATER_LEVEL+1 || base>WATER_LEVEL+30) return;
  const W=2;
  for(let dz=-W;dz<=W;dz++) for(let dx=-W;dx<=W;dx++){
    setTreeBlock(data,ox,oz, ax+dx, base, az+dz, WOOD, false);
    if(Math.abs(dx)===W||Math.abs(dz)===W){ for(let h=1;h<=3;h++) setTreeBlock(data,ox,oz, ax+dx, base+h, az+dz, (h===3?WOOD:COBBLE), false); }
  }
  setTreeBlock(data,ox,oz, ax, base+1, az+W, AIR, false);
  setTreeBlock(data,ox,oz, ax, base+2, az+W, AIR, false);
  for(let dz=-W;dz<=W;dz++) for(let dx=-W;dx<=W;dx++) setTreeBlock(data,ox,oz, ax+dx, base+4, az+dz, WOOD, false);
  setTreeBlock(data,ox,oz, ax, base+3, az, TORCH, false);
  setTreeBlock(data,ox,oz, ax+1, base+1, az-1, CHEST, false);
  lootChests.add((ax+1)+'_'+(base+1)+'_'+(az-1));
}
function buildDungeon(data,ox,oz,ax,az){
  const gh=terrainHeight(ax,az);
  const fy = Math.max(Y_MIN+6, gh - 14 - ((hash2(ax,az)*10)|0));
  const W=2;
  for(let dz=-W;dz<=W;dz++) for(let dx=-W;dx<=W;dx++) for(let h=0;h<=3;h++){
    const edge=(Math.abs(dx)===W||Math.abs(dz)===W||h===0||h===3);
    setTreeBlock(data,ox,oz, ax+dx, fy+h, az+dz, edge?COBBLE:AIR, false);
  }
  setTreeBlock(data,ox,oz, ax, fy+1, az, SPAWNER, false);
  setTreeBlock(data,ox,oz, ax+1, fy+1, az+1, CHEST, false);
  lootChests.add((ax+1)+'_'+(fy+1)+'_'+(az+1));
}
function buildCamp(data,ox,oz,ax,az){
  const base=terrainHeight(ax,az);
  if(base<=WATER_LEVEL+1 || base>WATER_LEVEL+24) return;
  setTreeBlock(data,ox,oz, ax, base+1, az, CAMPFIRE, false);
  setTreeBlock(data,ox,oz, ax-2, base+1, az,   LOG, false);
  setTreeBlock(data,ox,oz, ax+2, base+1, az,   LOG, false);
  setTreeBlock(data,ox,oz, ax,   base+1, az-2, LOG, false);
  setTreeBlock(data,ox,oz, ax-2, base+1, az+2, LOG, false);
  setTreeBlock(data,ox,oz, ax-2, base+2, az+2, TORCH, false);
  setTreeBlock(data,ox,oz, ax+2, base+1, az+2, CRAFTING_TABLE, false);
  setTreeBlock(data,ox,oz, ax+1, base+1, az-2, CHEST, false);
  lootChests.add((ax+1)+'_'+(base+1)+'_'+(az-2));
}
function placeSpecialStructures(data,ox,oz){
  const CELL=112, M=14;
  for(let gz=Math.floor((oz-M)/CELL); gz<=Math.floor((oz+CHUNK_SIZE+M)/CELL); gz++)
  for(let gx=Math.floor((ox-M)/CELL); gx<=Math.floor((ox+CHUNK_SIZE+M)/CELL); gx++){
    const r=hash2(gx*523+41, gz*617-29);
    if(r>0.55) continue;
    const ax=gx*CELL + 12 + ((hash2(gx*61+3,gz*47+13)*(CELL-24))|0);
    const az=gz*CELL + 12 + ((hash2(gx*29-7,gz*71+5)*(CELL-24))|0);
    const bi=biomeAt(ax,az);
    if(bi==='desert')      buildDesertTemple(data,ox,oz,ax,az);
    else if(bi==='snow')   buildIgloo(data,ox,oz,ax,az);
    else if(bi==='ocean'){
      if(terrainHeight(ax,az) >= WATER_LEVEL-3 && hash2(ax*9+5,az*9-5)<0.5) buildWitchHut(data,ox,oz,ax,az);
      else buildOceanRuin(data,ox,oz,ax,az);
    }
    else if(r<0.30) buildRuinedPortal(data,ox,oz,ax,az);
  }
}
function buildDesertTemple(data,ox,oz,ax,az){
  const base=terrainHeight(ax,az);
  if(base<=WATER_LEVEL+1) return;
  for(let layer=0;layer<=4;layer++){
    const w=4-layer, y=base+layer;
    for(let dz=-w;dz<=w;dz++) for(let dx=-w;dx<=w;dx++)
      setTreeBlock(data,ox,oz, ax+dx, y, az+dz, SAND, false);
  }
  for(let h=1;h<=3;h++) for(let dz=-2;dz<=2;dz++) for(let dx=-2;dx<=2;dx++)
    if(Math.abs(dx)<2&&Math.abs(dz)<2) setTreeBlock(data,ox,oz, ax+dx, base+h, az+dz, AIR, false);
  for(let h=1;h<=2;h++) setTreeBlock(data,ox,oz, ax, base+h, az+4, AIR, false);
  setTreeBlock(data,ox,oz, ax, base+3, az, GLOWSTONE, false);
  const fy=base-6;
  for(let h=0;h<=4;h++) for(let dz=-2;dz<=2;dz++) for(let dx=-2;dx<=2;dx++){
    const edge=(Math.abs(dx)===2||Math.abs(dz)===2||h===0||h===4);
    setTreeBlock(data,ox,oz, ax+dx, fy+h, az+dz, edge?SAND:AIR, false);
  }
  setTreeBlock(data,ox,oz, ax, fy, az, TNT, false);
  for(const s of [[-1,0],[1,0],[0,-1],[0,1]]){
    const cx=ax+s[0], cz=az+s[1];
    setTreeBlock(data,ox,oz, cx, fy+1, cz, CHEST, false);
    const k=cx+'_'+(fy+1)+'_'+cz; lootChests.add(k); richChests.add(k);
  }
}
function buildIgloo(data,ox,oz,ax,az){
  const base=terrainHeight(ax,az);
  if(base<=WATER_LEVEL+1) return;
  const R=3;
  for(let dy=0;dy<=R;dy++){
    const ry=Math.round(Math.sqrt(Math.max(0,R*R-dy*dy)));
    for(let dz=-ry;dz<=ry;dz++) for(let dx=-ry;dx<=ry;dx++){
      const d=Math.hypot(dx,dz); if(d>ry+0.3) continue;
      const shell=(dy===0)||(d>ry-1);
      setTreeBlock(data,ox,oz, ax+dx, base+dy, az+dz, shell?SNOW:AIR, false);
    }
  }
  setTreeBlock(data,ox,oz, ax, base+1, az+R, AIR, false);
  setTreeBlock(data,ox,oz, ax, base+2, az+R, AIR, false);
  setTreeBlock(data,ox,oz, ax-1, base+1, az-1, BED, false);
  setTreeBlock(data,ox,oz, ax+1, base+1, az-2, CRAFTING_TABLE, false);
  setTreeBlock(data,ox,oz, ax+2, base+2, az,  TORCH, false);
  setTreeBlock(data,ox,oz, ax-2, base+1, az+1, CHEST, false);
  lootChests.add((ax-2)+'_'+(base+1)+'_'+(az+1));
}
function buildRuinedPortal(data,ox,oz,ax,az){
  const base=terrainHeight(ax,az);
  if(base<=WATER_LEVEL) return;
  for(let h=0;h<=4;h++) for(let w=0;w<=3;w++){
    if(!(w===0||w===3||h===0||h===4)) continue;
    if(hash2(ax*7+w*13, az*5+h*17) < 0.28) continue;
    setTreeBlock(data,ox,oz, ax+w, base+h, az, OBSIDIAN, false);
  }
  for(let dz=-2;dz<=2;dz++) for(let dx=-1;dx<=4;dx++){
    if(hash2(ax+dx*3+1, az+dz*3-1) >= 0.2) continue;
    const gy=terrainHeight(ax+dx, az+dz);
    setTreeBlock(data,ox,oz, ax+dx, gy, az+dz, (hash2(ax+dx,az+dz+9)<0.2?GLOWSTONE:NETHERRACK), false);
  }
  setTreeBlock(data,ox,oz, ax-1, base,   az, NETHERRACK, false);
  setTreeBlock(data,ox,oz, ax-1, base+1, az, CHEST, false);
  const k=(ax-1)+'_'+(base+1)+'_'+az; lootChests.add(k); richChests.add(k);
}
function buildWitchHut(data,ox,oz,ax,az){
  const seabed=terrainHeight(ax,az); if(seabed<WATER_LEVEL-6) return;
  const floor=WATER_LEVEL+1;
  for(const s of [[-2,-2],[2,-2],[-2,2],[2,2]])
    for(let y=seabed+1;y<=floor;y++) setTreeBlock(data,ox,oz, ax+s[0], y, az+s[1], LOG, false);
  for(let dz=-2;dz<=2;dz++) for(let dx=-2;dx<=2;dx++) setTreeBlock(data,ox,oz, ax+dx, floor, az+dz, WOOD, false);
  for(let dz=-2;dz<=2;dz++) for(let dx=-2;dx<=2;dx++){
    if(Math.abs(dx)===2||Math.abs(dz)===2) for(let h=1;h<=2;h++) setTreeBlock(data,ox,oz, ax+dx, floor+h, az+dz, (h===2?LOG:WOOD), false);
  }
  for(let dz=-3;dz<=3;dz++) for(let dx=-3;dx<=3;dx++) setTreeBlock(data,ox,oz, ax+dx, floor+3, az+dz, WOOD, false);
  setTreeBlock(data,ox,oz, ax, floor+1, az+2, AIR, false); setTreeBlock(data,ox,oz, ax, floor+2, az+2, AIR, false);
  setTreeBlock(data,ox,oz, ax-1, floor+1, az-1, BREWING_STAND, false);
  setTreeBlock(data,ox,oz, ax+1, floor+1, az-1, CRAFTING_TABLE, false);
  setTreeBlock(data,ox,oz, ax-1, floor+1, az+1, TORCH, false);
  setTreeBlock(data,ox,oz, ax+1, floor+1, az+1, CHEST, false);
  lootChests.add((ax+1)+'_'+(floor+1)+'_'+(az+1));
}
function buildOceanRuin(data,ox,oz,ax,az){
  const sb=terrainHeight(ax,az); if(sb<Y_MIN+4 || sb>WATER_LEVEL-2) return;
  const W=2;
  for(let dz=-W;dz<=W;dz++) for(let dx=-W;dx<=W;dx++){
    setTreeBlock(data,ox,oz, ax+dx, sb, az+dz, COBBLE, false);
    if(Math.abs(dx)===W||Math.abs(dz)===W) for(let h=1;h<=2;h++){
      if(hash2(ax+dx*5+h, az+dz*5-h) < 0.45) continue;
      setTreeBlock(data,ox,oz, ax+dx, sb+h, az+dz, (hash2(ax+dx,az+dz)<0.35?STONE:COBBLE), false);
    }
  }
  setTreeBlock(data,ox,oz, ax, sb+1, az, CHEST, false);
  const k=ax+'_'+(sb+1)+'_'+az; lootChests.add(k); richChests.add(k);
}
function placeNetherStructures(data,ox,oz){
  const CELL=88, M=12;
  for(let gz=Math.floor((oz-M)/CELL); gz<=Math.floor((oz+CHUNK_SIZE+M)/CELL); gz++)
  for(let gx=Math.floor((ox-M)/CELL); gx<=Math.floor((ox+CHUNK_SIZE+M)/CELL); gx++){
    if(hash2(gx*733+17, gz*811-19) > 0.4) continue;
    const ax=gx*CELL + 10 + ((hash2(gx*37+9,gz*43+1)*(CELL-20))|0);
    const az=gz*CELL + 10 + ((hash2(gx*53-5,gz*59+7)*(CELL-20))|0);
    buildNetherFortress(data,ox,oz,ax,az);
  }
}
function buildNetherFortress(data,ox,oz,ax,az){
  const y0=NETHER_LAVA+6;
  for(let h=-1;h<=5;h++) for(let dz=-4;dz<=4;dz++) for(let dx=-4;dx<=4;dx++)
    setTreeBlock(data,ox,oz, ax+dx, y0+h, az+dz, AIR, false);
  for(let dz=-3;dz<=3;dz++) for(let dx=-3;dx<=3;dx++){
    setTreeBlock(data,ox,oz, ax+dx, y0, az+dz, BRICKS, false);
    setTreeBlock(data,ox,oz, ax+dx, y0+4, az+dz, BRICKS, false);
    if(Math.abs(dx)===3||Math.abs(dz)===3)
      for(let h=1;h<=3;h++) setTreeBlock(data,ox,oz, ax+dx, y0+h, az+dz, BRICKS, false);
  }
  for(let h=1;h<=2;h++){
    setTreeBlock(data,ox,oz, ax,   y0+h, az+3, AIR, false);
    setTreeBlock(data,ox,oz, ax+3, y0+h, az,   AIR, false);
  }
  for(let dz=-1;dz<=1;dz++) setTreeBlock(data,ox,oz, ax-2, y0+1, az+dz, SOUL_SAND, false);
  setTreeBlock(data,ox,oz, ax,   y0+3, az,   GLOWSTONE, false);
  setTreeBlock(data,ox,oz, ax,   y0+1, az,   SPAWNER, false);
  setTreeBlock(data,ox,oz, ax+2, y0+1, az-2, CHEST, false);
  const k=(ax+2)+'_'+(y0+1)+'_'+(az-2); lootChests.add(k); richChests.add(k);
}

// =====================================================================
//  OVERRIDES — Block-Änderungen vom Server (Multiplayer-Sync)
// =====================================================================
export function setOverride(wx,wy,wz,id){
  const cx=Math.floor(wx/CHUNK_SIZE), cz=Math.floor(wz/CHUNK_SIZE);
  const lx=wx-cx*CHUNK_SIZE, lz=wz-cz*CHUNK_SIZE, key=cx+','+cz;
  let m=overridesByChunk.get(key); if(!m){ m=new Map(); overridesByChunk.set(key,m); }
  m.set(((wy-Y_MIN)*CHUNK_SIZE+lz)*CHUNK_SIZE+lx, id);
}

// =====================================================================
//  CHUNK-KLASSE
// =====================================================================
export class Chunk {
  constructor(cx,cz){
    this.cx=cx; this.cz=cz; this.data=null; this.hasData=false;
    this.secCount=null;
    this.secMesh = new Array(NUM_SECTIONS).fill(null);
    this.secWater= new Array(NUM_SECTIONS).fill(null);
    this.secTorch= new Array(NUM_SECTIONS).fill(null);
    this.secLava = new Array(NUM_SECTIONS).fill(null);
    this.secPlant= new Array(NUM_SECTIONS).fill(null);
    this.meshed=false; this.dirty=true;
  }
}

export function writeData(c, idx, id){
  const old=c.data[idx]; if(old===id) return;
  c.data[idx]=id;
  if(c.secCount){ const s=(idx/SECTION_VOL)|0;
    if(old===AIR && id!==AIR) c.secCount[s]++;
    else if(old!==AIR && id===AIR) c.secCount[s]--;
  }
}

// =====================================================================
//  CALLBACKS für Circular Dependencies (gesetzt von rendering.js / network)
// =====================================================================
let _meshSectionCb  = (c, s) => {};
let _meshChunkCb    = (c)    => {};
let _disposeChunkCb = (c)    => {};
let _sendBlockCb    = (wx, wy, wz, id) => {};

export function onMeshSection(fn)  { _meshSectionCb  = fn; }
export function onMeshChunk(fn)    { _meshChunkCb    = fn; }
export function onDisposeChunk(fn) { _disposeChunkCb = fn; }
export function onSendBlock(fn)    { _sendBlockCb    = fn; }

// =====================================================================
//  WORLD-OBJEKT
// =====================================================================
export const world = {
  chunks: new Map(),
  key(cx,cz){ return cx+','+cz; },
  getChunk(cx,cz){ return this.chunks.get(this.key(cx,cz)); },

  ensureChunkData(cx,cz){
    let c=this.getChunk(cx,cz);
    if(!c){ c=new Chunk(cx,cz); this.chunks.set(this.key(cx,cz),c); }
    if(!c.hasData){
      c.data=generateChunkData(cx,cz);
      const m=overridesByChunk.get(this.key(cx,cz));
      if(m) for(const [idx,id] of m) c.data[idx]=id;
      const sc=new Int32Array(NUM_SECTIONS), d=c.data;
      for(let i=0;i<d.length;i++){ if(d[i]!==AIR) sc[(i/SECTION_VOL)|0]++; }
      c.secCount=sc;
      c.hasData=true;
    }
    return c;
  },

  getBlock(wx,wy,wz){
    if(wy<Y_MIN||wy>=Y_MAX) return AIR;
    const cx=Math.floor(wx/CHUNK_SIZE), cz=Math.floor(wz/CHUNK_SIZE);
    const c=this.getChunk(cx,cz); if(!c||!c.hasData) return AIR;
    const lx=wx-cx*CHUNK_SIZE, lz=wz-cz*CHUNK_SIZE;
    return c.data[((wy-Y_MIN)*CHUNK_SIZE+lz)*CHUNK_SIZE+lx];
  },

  setBlock(wx,wy,wz,id,fromNet){
    if(wy<Y_MIN||wy>=Y_MAX) return;
    if(id!==AIR && !BLOCKS[id]) id=STONE;
    setOverride(wx,wy,wz,id);
    const cx=Math.floor(wx/CHUNK_SIZE), cz=Math.floor(wz/CHUNK_SIZE);
    const c=this.ensureChunkData(cx,cz);
    const lx=wx-cx*CHUNK_SIZE, lz=wz-cz*CHUNK_SIZE;
    writeData(c, ((wy-Y_MIN)*CHUNK_SIZE+lz)*CHUNK_SIZE+lx, id);
    const s=sectionOf(wy);
    if(c.meshed){
      _meshSectionCb(c, s);
      const lyInSec=(wy-Y_MIN)-s*SECTION_H;
      if(lyInSec===SECTION_H-1 && s+1<NUM_SECTIONS) _meshSectionCb(c, s+1);
      if(lyInSec===0 && s-1>=0)                     _meshSectionCb(c, s-1);
    }
    if(lx===0)              this._remeshSection(cx-1,cz,s);
    if(lx===CHUNK_SIZE-1)   this._remeshSection(cx+1,cz,s);
    if(lz===0)              this._remeshSection(cx,cz-1,s);
    if(lz===CHUNK_SIZE-1)   this._remeshSection(cx,cz+1,s);
    if(!fromNet && dimension===0) _sendBlockCb(wx,wy,wz,id);
  },

  _remesh(cx,cz){ const c=this.getChunk(cx,cz); if(c&&c.hasData) _meshChunkCb(c); },
  _remeshSection(cx,cz,s){ const c=this.getChunk(cx,cz); if(c&&c.hasData&&c.meshed) _meshSectionCb(c,s); },
};

// =====================================================================
//  clearAllChunks
// =====================================================================
export function clearAllChunks(){
  for(const [,c] of world.chunks){ _disposeChunkCb(c); }
  world.chunks.clear();
  setLastCX(null); setLastCZ(null);
}
