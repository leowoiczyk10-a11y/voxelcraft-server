// =====================================================================
//  SOUND — prozeduraler Web Audio API (keine externen Dateien)
// =====================================================================
import { settings, player } from './state.js';
import {
  GRASS, LEAVES, SNOW, SAND, GRAVEL, DIRT,
  WOOD, LOG, CRAFTING_TABLE, TORCH, BED,
  GLASS, WATER, STONE, COBBLE, BRICKS, BEDROCK,
  FURNACE, COAL_ORE, COPPER_ORE, IRON_ORE, GOLD_ORE, DIAMOND_ORE,
} from './constants.js';

export const SFX = (function(){
  let ctx=null, master=null, ready=false, noiseBuf=null;
  function init(){
    if(ctx) return;
    try{
      ctx = new (window.AudioContext||window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = (settings.volume!=null?settings.volume:0.7);
      master.connect(ctx.destination);
      const n = ctx.sampleRate|0; noiseBuf = ctx.createBuffer(1,n,ctx.sampleRate);
      const d = noiseBuf.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
      ready=true;
    }catch(_){ ready=false; }
  }
  function resume(){ if(ctx && ctx.state==='suspended') ctx.resume(); }
  function setVolume(v){ if(master) master.gain.value = Math.max(0, Math.min(1, v)); }
  function distGain(pos){
    if(!pos) return 1;
    const dx=pos.x-player.x, dy=(pos.y!=null?pos.y:player.y)-player.y, dz=pos.z-player.z;
    const dd=Math.hypot(dx,dy,dz); if(dd>=28) return 0; return 1-dd/28;
  }
  function noiseSrc(){ const s=ctx.createBufferSource(); s.buffer=noiseBuf; s.loop=true; return s; }
  function burst(t0, f, q, dur, gain, type){
    const src=noiseSrc();
    const filt=ctx.createBiquadFilter(); filt.type=type||'bandpass'; filt.frequency.value=f; filt.Q.value=q;
    const g=ctx.createGain();
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.linearRampToValueAtTime(gain,t0+0.004);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t0); src.stop(t0+dur+0.03);
  }
  function tone(t0, f, f2, dur, gain, type){
    const o=ctx.createOscillator(); o.type=type||'square'; o.frequency.setValueAtTime(f,t0);
    if(f2) o.frequency.exponentialRampToValueAtTime(f2, t0+dur);
    const g=ctx.createGain();
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.linearRampToValueAtTime(gain,t0+0.005);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0+dur+0.03);
  }
  function matOf(id){
    switch(id){
      case GRASS: case LEAVES: case SNOW: return 'grass';
      case SAND: case GRAVEL: return 'sand';
      case DIRT: return 'dirt';
      case WOOD: case LOG: case CRAFTING_TABLE: case TORCH: case BED: return 'wood';
      case GLASS: return 'glass';
      case WATER: return 'water';
      case STONE: case COBBLE: case BRICKS: case BEDROCK: case FURNACE:
      case COAL_ORE: case COPPER_ORE: case IRON_ORE: case GOLD_ORE: case DIAMOND_ORE: return 'stone';
      default: return 'dirt';
    }
  }
  const MAT = {
    grass: { f:340, q:1.1, body:0,   dur:0.16 },
    dirt:  { f:240, q:1.0, body:95,  dur:0.18 },
    sand:  { f:520, q:0.7, body:0,   dur:0.15 },
    stone: { f:200, q:2.6, body:130, dur:0.20 },
    wood:  { f:300, q:3.2, body:170, dur:0.18 },
    glass: { f:1100,q:1.4, body:0,   dur:0.22 },
    water: { f:600, q:0.6, body:0,   dur:0.20 },
  };
  function dig(id, pos){
    if(!ready) return; resume(); const t=ctx.currentTime; const dg=distGain(pos); if(dg<=0) return;
    const m=MAT[matOf(id)]; const j=0.9+Math.random()*0.2;
    burst(t, m.f*j, m.q, m.dur, 0.5*dg, 'bandpass');
    if(m.body) tone(t, m.body*j, m.body*0.6, m.dur*0.9, 0.18*dg, 'triangle');
    if(matOf(id)==='glass'){ burst(t+0.01, 2200*j, 3, 0.10, 0.22*dg, 'highpass'); burst(t+0.05, 1700*j, 4, 0.08, 0.16*dg, 'highpass'); }
  }
  function place(id, pos){
    if(!ready) return; resume(); const t=ctx.currentTime; const dg=distGain(pos); if(dg<=0) return;
    const m=MAT[matOf(id)]; const j=0.9+Math.random()*0.2;
    burst(t, m.f*0.8*j, m.q*1.3, m.dur*0.8, 0.34*dg, 'lowpass');
    tone(t, (m.body||120)*0.8*j, null, 0.07, 0.12*dg, 'sine');
  }
  function step(id){
    if(!ready) return; resume(); const t=ctx.currentTime;
    const m=MAT[matOf(id)]; const j=0.85+Math.random()*0.3;
    burst(t, m.f*0.9*j, m.q*0.8, 0.07, 0.12, 'bandpass');
  }
  function land(id){
    if(!ready) return; resume(); const t=ctx.currentTime;
    const m=MAT[matOf(id)];
    burst(t, m.f*0.7, m.q, 0.12, 0.28, 'lowpass'); tone(t, 90, 55, 0.10, 0.10, 'sine');
  }
  function hit(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    burst(t, 700, 1.2, 0.06, 0.30, 'bandpass'); tone(t, 150, 90, 0.08, 0.16, 'square');
  }
  function mobDie(kind, pos){
    if(!ready) return; resume(); const t=ctx.currentTime; const dg=distGain(pos); if(dg<=0) return;
    burst(t, 380, 0.8, 0.22, 0.30*dg, 'lowpass');
    const lo = (kind==='zombie'||kind==='skeleton')?120:200;
    tone(t, lo, lo*0.55, 0.22, 0.16*dg, 'square');
  }
  function pickup(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    tone(t, 660, null, 0.06, 0.14, 'square'); tone(t+0.06, 990, null, 0.07, 0.13, 'square');
  }
  function hurt(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    tone(t, 200, 120, 0.18, 0.26, 'square'); burst(t, 500, 0.7, 0.12, 0.18, 'bandpass');
  }
  function die(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    tone(t, 300, 70, 0.7, 0.30, 'sawtooth'); tone(t+0.05, 200, 50, 0.7, 0.18, 'square');
  }
  function eat(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    for(let i=0;i<3;i++) burst(t+i*0.09, 300+Math.random()*200, 1.5, 0.06, 0.14, 'bandpass');
  }
  function ui(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    tone(t, 520, null, 0.04, 0.10, 'square');
  }
  function fuse(pos){
    if(!ready) return; resume(); const t=ctx.currentTime; const dg=distGain(pos); if(dg<=0) return;
    const src=noiseSrc();
    const filt=ctx.createBiquadFilter(); filt.type='bandpass'; filt.Q.value=1.3;
    filt.frequency.setValueAtTime(700,t); filt.frequency.exponentialRampToValueAtTime(2600,t+0.5);
    const g=ctx.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.24*dg,t+0.05);
    g.gain.setValueAtTime(0.24*dg,t+0.4); g.gain.exponentialRampToValueAtTime(0.0001,t+0.62);
    src.connect(filt); filt.connect(g); g.connect(master); src.start(t); src.stop(t+0.66);
  }
  function explode(pos){
    if(!ready) return; resume(); const t=ctx.currentTime; const dg=distGain(pos); if(dg<=0) return;
    burst(t, 90, 0.5, 0.6, 0.6*dg, 'lowpass'); tone(t, 70, 35, 0.6, 0.3*dg, 'sawtooth');
    burst(t+0.02, 400, 0.6, 0.25, 0.3*dg, 'bandpass');
  }
  function bow(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    burst(t, 1200, 1.5, 0.10, 0.16, 'bandpass'); tone(t, 520, 160, 0.12, 0.10, 'triangle');
  }
  function sizzle(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    const src=noiseSrc();
    const filt=ctx.createBiquadFilter(); filt.type='highpass'; filt.frequency.value=1100;
    const g=ctx.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.11,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.32);
    src.connect(filt); filt.connect(g); g.connect(master); src.start(t); src.stop(t+0.36);
  }
  function xp(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    tone(t, 880+Math.random()*120, 1500, 0.07, 0.10, 'sine');
  }
  function levelup(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    const f=[523,659,784,1047];
    for(let i=0;i<f.length;i++) tone(t+i*0.08, f[i], null, 0.16, 0.13, 'triangle');
  }
  function bird(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    const b=1600+Math.random()*600;
    tone(t,      b,      b*1.25, 0.07, 0.045, 'sine');
    tone(t+0.10, b*1.15, b*0.9,  0.06, 0.04,  'sine');
  }
  function cricket(){
    if(!ready) return; resume(); const t=ctx.currentTime;
    for(let i=0;i<4;i++) burst(t+i*0.045, 5200+Math.random()*400, 9, 0.025, 0.05, 'bandpass');
  }
  return { init, resume, setVolume, dig, place, step, land, hit, mobDie, pickup, hurt, die, eat, ui, fuse, explode, sizzle, bow, xp, levelup, bird, cricket };
})();
