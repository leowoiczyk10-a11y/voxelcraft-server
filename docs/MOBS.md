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
- Bat (Höhle, passiv)
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
