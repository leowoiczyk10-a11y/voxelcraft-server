// =====================================================================
//  STATE — alle globalen let/mutable-const Variablen
//  Primitive: immer über Setter mutieren (ES-Module live bindings sind read-only von außen)
//  Objekte/Arrays: direkt mutieren (Referenz-Semantik)
// =====================================================================
import {
  PRESETS, DEFAULT_PRESET, SETTINGS_KEY, isTouch,
  HEALTH_MAX, HUNGER_MAX, AIR_MAX,
  SLOT_COUNT, CHUNK_SIZE,
} from './constants.js';

// ---- Settings ----
export let settings = Object.assign(
  { preset: DEFAULT_PRESET, blockRes:16, volume:0.7, keepInv:false, fov:72,
    sensitivity:1.0, skin:0x4a90d9, ao:true, bloom:!isTouch, uiScale:1.0,
    brightness:1.0, autoRes:false },
  PRESETS[DEFAULT_PRESET]
);
try {
  const _raw = typeof localStorage !== 'undefined' && localStorage.getItem(SETTINGS_KEY);
  if(_raw) Object.assign(settings, JSON.parse(_raw));
} catch(_) {}

export let settingsOpen = false;
export let baseFov = settings.fov;
export let zoomActive = false;
export let RENDER_DISTANCE = settings.renderDist;
export let SIM_DISTANCE = settings.simDist;
export let UNLOAD_DISTANCE = RENDER_DISTANCE + 2;

export function setRenderDistance(v){ RENDER_DISTANCE = v; }
export function setSimDistance(v){ SIM_DISTANCE = v; }
export function setUnloadDistance(v){ UNLOAD_DISTANCE = v; }
export function setSettingsOpen(v){ settingsOpen = v; }
export function setBaseFov(v){ baseFov = v; }
export function setZoomActive(v){ zoomActive = v; }

// ---- World/Seed ----
export let SEED = 1337;
export let CHUNK_BUDGET_MS = isTouch ? 5 : 6;
export let currentSeed = SEED;
export let perlin = null; // init'd by world.js after makePerlin()
export let dimension = 0, genDim = 0;
export let overridesByChunk = new Map();

export function setSeed(v){ SEED = v; }
export function setCurrentSeed(v){ currentSeed = v; }
export function setPerlin(v){ perlin = v; }
export function setDimension(v){ dimension = v; }
export function setGenDim(v){ genDim = v; }
export function setChunkBudgetMs(v){ CHUNK_BUDGET_MS = v; }
export function setOverridesByChunk(v){ overridesByChunk = v; }

// ---- Three.js singletons (null bis rendering.js sie setzt) ----
export let scene = null;
export let camera = null;
export let renderer = null;
export function initThree(s, c, r){ scene = s; camera = c; renderer = r; }

// ---- Rendering internals ----
export let composer = null, bloomPass = null, bloomReady = false, bloomLoading = false;
export let _dynScanT = 0;
export let _shoot = null, _shootCd = 6 + Math.random() * 10;
export let _cloudT = 0, _waterT = 0;
export let _wasUnderwater = false;
export let heldId = null, swingT = 0, _bobPhase = 0, _lastHX = 0, _lastHZ = 0;

export function setComposer(v){ composer = v; }
export function setBloomPass(v){ bloomPass = v; }
export function setBloomReady(v){ bloomReady = v; }
export function setBloomLoading(v){ bloomLoading = v; }
export function setHeldId(v){ heldId = v; }
export function setSwingT(v){ swingT = v; }

// ---- Day/Night ----
export let dayTime = 0.3;
export function setDayTime(v){ dayTime = v; }

// ---- Player ----
export const player = { x:8.5, y:0, z:8.5, vx:0, vy:0, vz:0, onGround:false };
export let yaw = 0, pitch = 0;
export let gameMode = 'survival', flying = false, _lastSpaceTap = 0;
export let stepAcc = 0, _wasAir = false;
export let gliding = false;
export let health = HEALTH_MAX, hunger = HUNGER_MAX, air = AIR_MAX;
export let dead = false, hurtT = 0, burnT = 0;
export let lastDrown = 0, lastStatSent = 0, lastH = -1, lastHu = -1, lastBurnDmg = 0, lastCactus = 0;
export let lastAtk = 0, lastEat = 0;
export let lastShot = 0, lastBowPower = 0;
export let shieldCd = 0;
export let xp = 0, xpLevel = 0;
export let playerName = '';
export let _vitSig = '';
export let _crackStage = -1;
export let _hitTickT = null;

export function setYaw(v){ yaw = v; }
export function setPitch(v){ pitch = v; }
export function setGameMode(v){ gameMode = v; }
export function setFlying(v){ flying = v; }
export function setGliding(v){ gliding = v; }
export function setHealth(v){ health = v; }
export function setHunger(v){ hunger = v; }
export function setAir(v){ air = v; }
export function setDead(v){ dead = v; }
export function setHurtT(v){ hurtT = v; }
export function setBurnT(v){ burnT = v; }
export function setXp(v){ xp = v; }
export function setXpLevel(v){ xpLevel = v; }
export function setPlayerName(v){ playerName = v; }
export function setSelectedSlot(v){ selectedSlot = v; }
export function setShieldCd(v){ shieldCd = v; }

// ---- Inventory ----
export let selectedSlot = 0;
export const inv = new Array(SLOT_COUNT).fill(null);
export const craftGrid = new Array(9).fill(null);
export const armor = [null, null, null, null];
export let held = null, craftOutput = null, invOpen = false, invMode = 'craft', furnaceKey = null, offhand = null;
export let craftN = 2, splitMode = false;
export let chestKey = null;
export let enchIn = null, enchPos = null;
export let recipeBookOpen = false;

export function setHeld(v){ held = v; }
export function setCraftOutput(v){ craftOutput = v; }
export function setInvOpen(v){ invOpen = v; }
export function setInvMode(v){ invMode = v; }
export function setFurnaceKey(v){ furnaceKey = v; }
export function setOffhand(v){ offhand = v; }
export function setCraftN(v){ craftN = v; }
export function setSplitMode(v){ splitMode = v; }
export function setChestKey(v){ chestKey = v; }
export function setEnchIn(v){ enchIn = v; }
export function setEnchPos(v){ enchPos = v; }
export function setRecipeBookOpen(v){ recipeBookOpen = v; }

// ---- Init inventory start kit ----
inv[0] = { id: 10/*LOG*/,   count: 8  };
inv[1] = { id: 2 /*DIRT*/,  count: 16 };
inv[2] = { id: 7 /*COBBLE*/, count: 8 };

// ---- Chunk loading ----
export let chunkQueue = [], lastCX = null, lastCZ = null;
export function setLastCX(v){ lastCX = v; }
export function setLastCZ(v){ lastCZ = v; }

// ---- Input ----
export let locked = false, touchPlaying = false, jumpHeld = false, sprinting = false, breakHeld = false;
export let joyId = null, lookId = null, lookX = 0, lookY = 0;
export let shakeAmt = 0;
export let _autoResCur = 1.0, _autoResT = 0;

export function setLocked(v){ locked = v; }
export function setSprinting(v){ sprinting = v; }
export function setJumpHeld(v){ jumpHeld = v; }
export function setBreakHeld(v){ breakHeld = v; }
export function setTouchPlaying(v){ touchPlaying = v; }
export function setShakeAmt(v){ shakeAmt = v; }
export function isActive(){ return (isTouch ? touchPlaying : locked) && !settingsOpen; }

// ---- HUD timers ----
export let _nameTimer = null, _tipTimer = null;
export function setNameTimer(v){ _nameTimer = v; }
export function setTipTimer(v){ _tipTimer = v; }

// ---- Mobs / Combat ----
export const mobsMap = new Map();
export let localMobSeq = 1, _mobSpawnTimer = 1.5, _slimeSpawnTimer = 6;
export let _squidSpawnTimer = 4, _caveSpawnTimer = 3, _drownedSpawnTimer = 8;
export let _beeSpawnTimer = 5, _batSpawnTimer = 7;
export let sleeplessDays = 0, _wasNight = false;
export let _netherSpawnT = 3, _spawnerScanT = 0;
export let endDragonDefeated = false;

export function setEndDragonDefeated(v){ endDragonDefeated = v; }
export function setSleeplessDays(v){ sleeplessDays = v; }

// ---- Network / Avatars ----
export const avatars = new Map();

// ---- Sleep / Bed ----
export let bedSpawn = null, sleeping = false;
export function setBedSpawn(v){ bedSpawn = v; }
export function setSleeping(v){ sleeping = v; }

// ---- Ambient ----
export let _ambTimer = 4, _ambFxT = 0;

// ---- Chat ----
export let chatOpen = false;
export function setChatOpen(v){ chatOpen = v; }

// ---- Dimension / Portal ----
export let portalT = 0, portalCooldown = 0, netherReturn = null;
export function setPortalT(v){ portalT = v; }
export function setPortalCooldown(v){ portalCooldown = v; }
export function setNetherReturn(v){ netherReturn = v; }

// ---- Mount / Vehicle ----
export let mountedHorse = null, mountedCart = false, cartSpeed = 0;
export const cartDir = { x:0, z:1 };
export function setMountedHorse(v){ mountedHorse = v; }
export function setMountedCart(v){ mountedCart = v; }
export function setCartSpeed(v){ cartSpeed = v; }

// ---- Potions / Buffs ----
export let buffSpeed = 0, buffStrength = 0, poisonT = 0;
export function setBuffSpeed(v){ buffSpeed = v; }
export function setBuffStrength(v){ buffStrength = v; }
export function setPoisonT(v){ poisonT = v; }

// ---- Weather ----
export let weather = 'clear', weatherT = 120 + Math.random() * 180;
export function setWeather(v){ weather = v; }
export function setWeatherT(v){ weatherT = v; }

// ---- Fishing ----
export let fishingState = null;
export function setFishingState(v){ fishingState = v; }

// ---- Achievements ----
export const ACH_KEY = 'voxelcraft_ach_v1';
export let achUnlocked = new Set();
try {
  const _r = typeof localStorage !== 'undefined' && localStorage.getItem(ACH_KEY);
  if(_r) achUnlocked = new Set(JSON.parse(_r));
} catch(_) {}
export let _achTimer = null;
export function setAchTimer(v){ _achTimer = v; }

// ---- Minimap ----
export let minimapOn = true;
export let _miniTimer = 0, _climateT = 0, _caneT = 0;
export function setMinimapOn(v){ minimapOn = v; }

// ---- Main loop ----
export let last = typeof performance !== 'undefined' ? performance.now() : 0;
export let fpsAcc = 0, fpsCount = 0, fps = 0, fpsTimer = 0, _hudInfoT = 0;
export let lastSent = 0, lsx = null, lsy = null, lsz = null, lsr = null;
export function setLast(v){ last = v; }
export function setFps(v){ fps = v; }
