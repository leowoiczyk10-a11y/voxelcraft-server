# Mob-System

## Implementierte Mob-Klasse
```js
class Mob {
  id, type, pos, vel, health, maxHealth
  state: "idle" | "detect" | "chase" | "attack" | "dead"
  mesh           // THREE.Group
  detectionRange // wie weit Mob Spieler sieht
  attackRange    // Melee oder Ranged
}
```

## Mob-Typen

### Creeper
- HP: 20, Schaden: 0 (Explosion)
- Detect-Range: 16 Blöcke
- Verhalten: Chase → bei ~2 Blöcken Countdown → Explosion (Schaden + Block-Zerstörung im Radius)
- Spawn: Oberfläche, Nacht

### Skeleton
- HP: 20, Schaden: 3 (Pfeil)
- Detect-Range: 20 Blöcke
- Verhalten: Chase bis ~10 Blöcke → Pfeil schießen → Rückwärts wenn zu nah
- Spawn: Oberfläche, Nacht
- Drops: Knochen, Pfeile

### Enderman
- HP: 40, Schaden: 7
- Detect-Range: 64 Blöcke, aber NUR bei direktem Blickkontakt (Crosshair-Check)
- Verhalten: Idle (Blöcke aufheben) → bei Blick: Teleport + Angriff
- Teleport: Random Pos im Radius bei Schaden oder als Flucht
- Spawn: Nacht, selten

### Villager
- HP: 20, Schaden: 0 (passiv)
- Verhalten: Random Wander, Flucht bei Mob-Nähe
- KEIN Trading implementiert
- Spawn: (noch selten/zufällig, kein Dorf)

### Drowned (Unterwasser-Zombie)  — *neu*
- HP: 10, XP: 5, Schaden: 2 (Kontakt, generisch über `survivalUpdate`)
- `kind:'drowned'`, `MOB_DEF.drowned = {hostile:true, hw:0.35, hh:0.95, fly:true}` (fly=true → manuelle Höhe im Wasser)
- Modell: Zombie-Variante in Blaugrün (Branch `kind==='zombie'||'skeleton'||'drowned'` in `makeMobModel`)
- KI: `updateDrownedAI()` — jagt den Spieler durchs Wasser, bleibt in der Wassersäule (clamp floor+0.6 … WATER_LEVEL-0.4), dreht vor Nicht-Wasser ab (strandet nicht)
- Spawn: `tryWaterSpawnPoint()` (tiefes Wasser, Dist > 12), nachts häufiger; `_drownedSpawnTimer`; nur solo/lokal
- Drops: Rotten Flesh (1–2), Kupferbarren (0–1); ~15 % der Drowned sind **Dreizack-Träger** (`m.tridentHolder`) → 50 % Dreizack-Drop in `onMobDead`
- **Dreizack** (`TRIDENT`, id 214): Nahkampf dmg 9 (= Diamantschwert) + werfbar per Rechtsklick (`throwTrident()` → lokales Projektil `updateThrownTridents()`, landet als aufsammelbares Item). Kein Crafting (MC-konform: nur Drowned-Drop).

### Magmawürfel (Nether)  — *neu*
- `kind:'magma_cube'` (HP 16, hw 0.45) + `kind:'magma_cube_small'` (HP 6, hw 0.25), beide `fly:true`
- **Warum fly:true:** `updateLocalMobs()` läuft nur in der Oberwelt (`dimension!==0 return`) und `updateMobs()` cullt im Nether alles außer `m.local && m.fly`. Magma nutzt daher den fly-Pfad + eigene KI `magmaCubeAI()` (in `updateNetherMobs`).
- Modell: Slime-Branch in `makeMobModel` erweitert (dunkle Obsidian-Kruste 0x3a0e08 + glühender Kern 0xff7a1e)
- KI: hüpft in Schüben auf den Spieler zu (Sprung-Arc via `m.vy`, Landung clampt auf `mobFloorY`), Kontaktschaden 4 (groß) / 2 (klein)
- **Feuerimmun:** es gibt keinen Mob-Lava/Feuer-Schaden-Pfad → automatisch immun (kein Extra-Code)
- Splittet beim Tod in 2–3 `magma_cube_small` (generalisierter Slime-Split, übernimmt Eltern-Y im Nether)
- Spawn: `updateNetherMobs()` ~35 % Bodenspawn (sonst Ghast/Blaze), Limit 6 lokale Mobs
- Drops: **Magmacreme** (`MAGMA_CREAM`, id 216, Brau-Zutat für später), XP 6 (groß) / 2 (klein)

### Biene (Atmosphäre)  — *neu*
- `kind:'bee'` (HP 4, hw 0.25, `fly:true`), passiv, keine Drops, XP 1
- Modell: kleiner gelb-schwarz gestreifter Körper + durchscheinende Flügel (`makeMobModel`)
- KI: `updateBeeAI()` — schwebt gemächlich in Schüben über dem Boden (proportionale Höhensteuerung auf `mobGroundY+2.5` + leichtes Wippen via `m.phase`)
- Spawn: `updateLocalMobs` `_beeSpawnTimer`, tagsüber über Gras (`trySpawnPoint().ground===GRASS`), max 3
- Reines Atmosphäre-Mob: kein Angriff, kein Stechen (Scope), kein Honig (kein Block dafür)

### Fledermaus (Höhlen-Atmosphäre)  — *neu*
- `kind:'bat'` (HP 4, hw 0.2, `fly:true`), passiv, keine Drops, XP 0
- Modell: kleiner brauner Körper + Ohren + dunkle Flügel
- KI: `updateBatAI()` — flattert erratisch in 3D um ein Roam-Zentrum (`m.cx/cy/cz`, bei Spawn gesetzt), weicht dem Boden aus; kein Spielerbezug
- Spawn: `_batSpawnTimer` via `tryCaveSpawnPoint()` (dunkler Hohlraum tief unter der Oberfläche), max 4

## KI State Machine (alle Mobs)
```
IDLE ──(Spieler in Range)──► DETECT
DETECT ──(bestätigt)──► CHASE
CHASE ──(in Attack-Range)──► ATTACK
CHASE ──(Spieler zu weit)──► IDLE
ATTACK ──(Cooldown)──► CHASE
any ──(HP <= 0)──► DEAD → despawn
```

## Spawn-System (aktueller Stand)
- Spawn nur oberirdisch (Y > terrain surface)
- Check: Licht-Level < Schwelle (Nacht / Höhle theoretisch)
- Spawn-Radius: 24–48 Blöcke vom Spieler
- Max gleichzeitige Mobs: begrenzt (Config-Variable)
- **PROBLEM:** Höhlen werden nicht erkannt → unterirdisches Spawning fehlt komplett

## Fehlende Mob-Features (Roadmap)
- Unterirdisches Spawnen (Höhlen-aware)
- Schwein, Kuh, Schaf (passive, farmbare Tiere)
- Wolf (tameable)
- ~~Bat (Höhle, passiv)~~ ✅  (auch Bee als Wiesen-Flieger ✅)
- Zombie (Basis-Melee, kein Skeleton)
- Spider (klettert?)
- Slime (splits on death)
- Blaze, Ghast (Nether)
- Endermite, Shulker (End)

## Mob-Drops
```js
// Schema in code:
drops: [
  { id: ITEM_ID, chance: 0.0–1.0, min: 1, max: N }
]
```
Aktuell implementiert: Skeleton → Knochen/Pfeile, Creeper → Gunpowder
