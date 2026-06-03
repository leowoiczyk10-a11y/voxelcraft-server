// ============================================================
//  VoxelCraft Multiplayer-Server
//  Laeuft auf eurem PC. Haelt die gemeinsame Welt, alle Spieler,
//  Mobs und die Tageszeit und verteilt Aenderungen an alle.
// ============================================================
//
//  EINMALIG einrichten (im selben Ordner wie diese Datei):
//      npm install ws
//
//  STARTEN:
//      node server.js
//
//  Dann zeigt der Server eure lokale IP an. Auf jedem Handy/Tablet
//  im SELBEN WLAN im Browser oeffnen:  http://<DIESE-IP>:8080
// ============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const TICK_MS = 100;          // Mob-/Zeit-Sync alle 100ms (10x pro Sekunde)
const WORLD_SEED = 1337;      // gemeinsamer Seed -> alle haben dieselbe Welt

// ---- statische Dateien ausliefern (index.html, three.module.js, addons, icons) ----
const MIME = {
  '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.json':'application/json', '.png':'image/png', '.css':'text/css',
  '.svg':'image/svg+xml', '.ico':'image/x-icon'
};
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const filePath = path.join(__dirname, urlPath);
  // simpler Schutz gegen Pfad-Ausbruch
  if (!filePath.startsWith(__dirname)) { res.writeHead(403); res.end('nope'); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('nicht gefunden: ' + urlPath); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

// ---- WebSocket auf demselben Port ----
const wss = new WebSocketServer({ server });

// ---- gemeinsamer Spielzustand ----
const blockOverrides = new Map();   // "x_y_z" -> blockId (0 = abgebaut)
const players = new Map();          // id -> {id,name,x,y,z,ry,health,hunger}
let dayTime = 0.25;                 // 0..1, fuer alle synchron
let nextId = 1;

// ---- Welt-Persistenz: Supabase (Cloud, dauerhaft) ODER lokale Datei (Fallback) ----
// Supabase wird nur genutzt, wenn diese zwei Umgebungsvariablen gesetzt sind:
//   SUPABASE_URL   = https://deinprojekt.supabase.co
//   SUPABASE_KEY   = der service_role key
// Bei Railway traegst du die unter "Variables" ein. Ohne sie: ganz normales
// Speichern in die lokale Datei (saves/world-save.json).
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);
const WORLD_ROW_ID = 'main';            // wir speichern die Welt in einer Zeile mit dieser id

const SAVE_DIR = path.join(__dirname, 'saves');
const SAVE_FILE = path.join(SAVE_DIR, 'world-save.json');
let saveDirty = false;          // gibt es ungespeicherte Aenderungen?
let saving = false;             // gerade ein Save am Laufen? (verhindert Ueberschneidungen)

// ---------- Supabase-Helfer (REST API, kein extra Paket noetig) ----------
async function supaLoad(){
  const url = SUPABASE_URL + '/rest/v1/worlds?id=eq.' + WORLD_ROW_ID + '&select=data';
  const res = await fetch(url, { headers: {
    apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY
  }});
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const rows = await res.json();
  return (rows && rows[0] && rows[0].data) ? rows[0].data : null;
}
async function supaSave(data){
  // upsert: legt die Zeile an oder aktualisiert sie
  const url = SUPABASE_URL + '/rest/v1/worlds?on_conflict=id';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify([{ id: WORLD_ROW_ID, data }])
  });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + (await res.text()));
}

async function loadWorld(){
  // 1) Supabase versuchen
  if (USE_SUPABASE){
    try {
      const data = await supaLoad();
      if (data){
        if (Array.isArray(data.overrides)) for (const [k,v] of data.overrides) blockOverrides.set(k, v);
        if (typeof data.dayTime === 'number') dayTime = data.dayTime;
        console.log(' Spielstand aus Supabase geladen: ' + blockOverrides.size + ' Block-Aenderungen.');
        return;
      }
      console.log(' Supabase verbunden, aber noch keine Welt gespeichert. Neue Welt.');
      return;
    } catch(e){
      console.log(' Supabase-Laden fehlgeschlagen (' + e.message + '), nutze lokale Datei.');
    }
  }
  // 2) lokale Datei (Fallback)
  try {
    if (!fs.existsSync(SAVE_FILE)) { console.log(' Kein Spielstand gefunden, neue Welt.'); return; }
    const data = JSON.parse(fs.readFileSync(SAVE_FILE, 'utf8'));
    if (Array.isArray(data.overrides)) for (const [k,v] of data.overrides) blockOverrides.set(k, v);
    if (typeof data.dayTime === 'number') dayTime = data.dayTime;
    console.log(' Spielstand (lokal) geladen: ' + blockOverrides.size + ' Block-Aenderungen.');
  } catch(e){ console.log(' Spielstand beschaedigt, starte neue Welt. (' + e.message + ')'); }
}

async function saveWorld(){
  if (saving) return;            // nicht zwei Saves gleichzeitig
  saving = true;
  const data = { overrides: [...blockOverrides.entries()], dayTime, savedAt: Date.now() };
  try {
    if (USE_SUPABASE){
      await supaSave(data);
      saveDirty = false;
    } else {
      if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });
      const tmp = SAVE_FILE + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(data));
      fs.renameSync(tmp, SAVE_FILE);
      saveDirty = false;
    }
  } catch(e){
    console.log(' FEHLER beim Speichern: ' + e.message);
    // bei Supabase-Fehler zusaetzlich lokal sichern, damit nichts verloren geht
    if (USE_SUPABASE){
      try { if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR,{recursive:true});
        fs.writeFileSync(SAVE_FILE, JSON.stringify(data)); } catch(_){}
    }
  } finally { saving = false; }
}

console.log(USE_SUPABASE ? ' Speicher-Modus: Supabase (Cloud)' : ' Speicher-Modus: lokale Datei');
loadWorld();
// regelmaessig speichern, aber nur wenn sich was geaendert hat
setInterval(() => { if (saveDirty) saveWorld(); }, 15000);
// auch beim sauberen Beenden speichern
process.on('SIGINT', async () => { console.log('\n Speichere Welt...'); await saveWorld(); process.exit(0); });
process.on('SIGTERM', async () => { await saveWorld(); process.exit(0); });

// ---- Mobs serverseitig (alle sehen dieselben) ----
const mobs = new Map();             // mobId -> {id,kind,x,y,z,dir,hp,hostile}
let nextMobId = 1;
const MOB_KINDS_PASSIVE = ['cow','sheep','chicken'];
const MOB_HP = { cow:8, sheep:6, chicken:4, zombie:10, skeleton:8 };
let mobSpawnTimer = 0;

function isNight() { return dayTime > 0.75 || dayTime < 0.2; }

function spawnMob(hostile) {
  // um den gemeinsamen Spawn-Punkt (0,0) in kleinem Radius
  const ang = Math.random()*Math.PI*2, r = 8 + Math.random()*16;
  const x = Math.cos(ang)*r, z = Math.sin(ang)*r;
  let kind;
  if (hostile) kind = Math.random()<0.5 ? 'zombie':'skeleton';
  else kind = MOB_KINDS_PASSIVE[Math.floor(Math.random()*3)];
  const id = nextMobId++;
  mobs.set(id, { id, kind, x, y:20, z, dir:Math.random()*6.28, hp:MOB_HP[kind], hostile });
}

function broadcast(obj, exceptId) {
  const msg = JSON.stringify(obj);
  for (const ws of wss.clients) {
    if (ws.readyState === 1 && ws._pid !== exceptId) ws.send(msg);
  }
}
function sendTo(ws, obj) { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); }

wss.on('connection', (ws) => {
  const id = nextId++;
  ws._pid = id;
  const me = { id, name:'Spieler'+id, x:0, y:25, z:0, ry:0, health:10, hunger:10 };
  players.set(id, me);

  // 1) Begruessung: eigene ID, Seed, ganze Welt-Aenderungen, alle anderen Spieler, alle Mobs, Zeit
  sendTo(ws, {
    t:'welcome',
    id,
    seed: WORLD_SEED,
    overrides: [...blockOverrides.entries()],
    players: [...players.values()].filter(p => p.id !== id),
    mobs: [...mobs.values()],
    time: dayTime
  });

  // 2) den anderen sagen: neuer Spieler da
  broadcast({ t:'join', player: me }, id);

  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    const p = players.get(id);
    if (!p) return;

    switch (m.t) {
      case 'move':            // Position/Blickrichtung
        p.x=m.x; p.y=m.y; p.z=m.z; p.ry=m.ry;
        broadcast({ t:'move', id, x:m.x, y:m.y, z:m.z, ry:m.ry }, id);
        break;
      case 'stat':            // Health/Hunger/Name (eigene Werte)
        if (typeof m.health==='number') p.health=m.health;
        if (typeof m.hunger==='number') p.hunger=m.hunger;
        if (m.name) p.name=String(m.name).slice(0,16);
        broadcast({ t:'stat', id, health:p.health, hunger:p.hunger, name:p.name }, id);
        break;
      case 'block':           // Block gesetzt/abgebaut -> gemeinsame Welt
        { const k = m.x+'_'+m.y+'_'+m.z;
          if (m.id === 0) blockOverrides.set(k, 0);   // abgebaut
          else blockOverrides.set(k, m.id);           // gesetzt
          saveDirty = true;                            // -> wird gespeichert
          broadcast({ t:'block', x:m.x, y:m.y, z:m.z, id:m.id }, id);
        }
        break;
      case 'mobhit':          // jemand trifft/toetet einen Mob
        { const mob = mobs.get(m.mobId);
          if (mob) {
            mob.hp -= (m.dmg||0);
            if (mob.hp <= 0) { mobs.delete(m.mobId); broadcast({ t:'mobdead', mobId:m.mobId }); }
            else broadcast({ t:'mobhp', mobId:m.mobId, hp:mob.hp });
          }
        }
        break;
    }
  });

  ws.on('close', () => {
    players.delete(id);
    broadcast({ t:'leave', id });
  });
});

// ---- Server-Tick: Zeit + Mob-Bewegung an alle senden ----
setInterval(() => {
  // Tageszeit (volle Runde dauert ~10 Min = 600s; pro Tick 0.1s)
  dayTime = (dayTime + (TICK_MS/1000)/600) % 1;

  // Mobs spawnen/entfernen
  mobSpawnTimer += TICK_MS/1000;
  if (mobSpawnTimer >= 4) {
    mobSpawnTimer = 0;
    let passive=0, hostile=0;
    for (const mob of mobs.values()) mob.hostile ? hostile++ : passive++;
    if (passive < 6) { spawnMob(false); broadcast({ t:'mobspawn', mob:[...mobs.values()].pop() }); }
    if (isNight() && hostile < 5) { spawnMob(true); broadcast({ t:'mobspawn', mob:[...mobs.values()].pop() }); }
  }

  // Mob-Bewegung: simpel, Richtung Naehe oder Wandern. Detail-Animation macht der Client.
  for (const mob of mobs.values()) {
    let nearest=null, nd=1e9;
    for (const p of players.values()) {
      const d = Math.hypot(p.x-mob.x, p.z-mob.z);
      if (d<nd) { nd=d; nearest=p; }
    }
    const speed = (mob.hostile?2.4:1.4) * (TICK_MS/1000);
    if (mob.hostile && nearest && nd<16) {
      mob.dir = Math.atan2(nearest.x-mob.x, nearest.z-mob.z);
    } else if (Math.random()<0.03) {
      mob.dir = Math.random()*6.28;
    }
    mob.x += Math.sin(mob.dir)*speed;
    mob.z += Math.cos(mob.dir)*speed;
  }

  // kompakter Zustand: nur Positionen
  const mobState = [...mobs.values()].map(m => [m.id, +m.x.toFixed(2), +m.z.toFixed(2), +m.dir.toFixed(2)]);
  broadcast({ t:'tick', time:+dayTime.toFixed(4), mobs: mobState });
}, TICK_MS);

// ---- lokale IP herausfinden und anzeigen ----
const os = require('os');
function localIPs() {
  const out = [];
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const i of ifaces) if (i.family==='IPv4' && !i.internal) out.push(i.address);
  }
  return out;
}
server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log(' VoxelCraft Multiplayer laeuft!');
  console.log('');
  console.log(' Auf diesem PC:   http://localhost:'+PORT);
  for (const ip of localIPs()) console.log(' Im selben WLAN:  http://'+ip+':'+PORT);
  console.log('');
  console.log(' Gebt die WLAN-Adresse auf den Handys im Browser ein.');
  console.log(' Zum Beenden: Strg + C');
  console.log('========================================');
});
