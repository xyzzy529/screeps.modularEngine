# Tasks

## Current

### Foundation

* Creep
  * Implement Creep.spawningStarted event
  * clear memory on cleanup: mod.staleCreeps & mod.staleHostiles
  * Save bodyCount property to memory. may also get filled at spawning
  * Treat Intruders in rooms marked for claiming/mining as Enemy, not EnemyOnNeutralGround => callback?
* Flag
  * Add Flag.found event for each primary color
* Room
  * trigger Room.collapsed

### navigation

* implement segment backend with fixed width fields for costMatrices with better serialization (no JSON).  
Initial Idea:
```JavaScript
global.serialize = function(unserialized){
    return String.fromCharCode.apply(null, new Uint16Array(unserialized._bits.buffer))
}
global.deserialize = function(serialized){
    let buf = new ArrayBuffer(serialized.length*2);
    let chars = new Uint16Array(buf);
    for (let i=0; i < serialized.length; i++) {
        chars[i] = serialized.charCodeAt(i);
    }
    let matrix = new PathFinder.CostMatrix;
    matrix._bits = new Uint8Array(buf);
    return matrix;
}
```

### basicTower

* change static whitelist to isPlayerWhitelisted callback => intel feature

### Overall

* Implement global.isPlayerWhitelisted(playername) callback => Add intel feature

*Soft goals:*
* Add event documentation for all features (in its readme.md)
* Add extension documentation (added properties etc) for all features (in its readme.md)
* Add feature parameter documentation for all features (in its readme.md)
* Add Licenses

# Backlog

## 1. Local basics

* Add mining feature
  * local & remote
  * auto identify unused adjacent rooms and try to make them remotes
  * creep types & actions
  * energy & mineral
  * dropmining (for low lvl) & store mining
* Add worker feature
* Add hauler feature
  * estimate local & remote hauler requirements
  * creep type & action
* Add upgrader feature

## 2. Expansion 

* Add claimer feature
  * claiming & reserving
* Add pioneer feature
* Add defender feature
* Add guard feature

## 3. Economy basics

* Add economy feature
  * Inter room energy/mineral exchange
  * resource evaluation (present/required)
  * Auto sell minerals

## 4. Basic war tools

* Robbing
* Sapper
* Healer
* Train
* Hopper/Teaser
* Invasion

## 5. Labs

* Add lab feature
* Implement Boosting

## 6. Source Keepers

* Implement SKFarming feature

## 7. Power

* Add observation feature
* Add PowerFarming feature

## 8. Analysis

* Add statistics feature 

## 9. Advanced Economy

* Auto Buy
* Direct trades

## 10. Advanced War Features

* Auto Nuker
* Advanced invasion techniques 
* Advanced defense techniques 
