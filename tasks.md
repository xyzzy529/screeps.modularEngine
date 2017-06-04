# Tasks

## Current Work

### Foundation feature

* Creep
  * Implement Creep.spawningStarted event
  * clear creep memory on cleanup: mod.staleCreeps & mod.staleHostiles
  * Treat Intruders in rooms marked for claiming/mining as Enemy, not EnemyOnNeutralGround (in analyzeHostile). maybe use a callback

# Backlog

## 1. Local basics

* Add mining feature
  * local & remote
  * auto identify unused adjacent rooms and try to make them remotes
  * creep types & actions
  * energy & mineral
  * dropmining (for low lvl) & container mining
* Add basic worker feature
  * build, repair, fortify, support hauler/upgrader
* Add hauler feature
  * estimate local & remote hauler requirements
  * creep type & action
* Add upgrader feature

## 2. Expansion 

* Add claimer feature
  * claiming & reserving
* Add pioneer feature
  * worker for remote rooms
* Add defender feature
  * auto spawn defenses
* Add guard feature
  * place guards manually

## 3. Economy basics

* Add economy feature
  * Inter room energy/mineral exchange
  * resource evaluation (present/required)
  * Auto sell minerals

## 4. Basic war tools

* Warrior
* Sapper
* Healer
* Robber
* Hopper/Teaser
* Train (creep combo)
* Auto safe mode

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

## 11. Driver cockpit

* Add UI or external components
* Simplify driver (user) orders 


# Ideas

## navigation feature

### matrix serialization

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
or (to be measured/Compared)
```JavaScript
global.serialize = function(unserialized){
    return String.fromCharCode.apply(null, unserialized._bits)
}
global.deserialize = function(serialized){
    let chars = new Uint8Array(new ArrayBuffer(serialized.length));
    for (let i=0; i < serialized.length; i++) {
        chars[i] = serialized.charCodeAt(i);
    }
    let matrix = new PathFinder.CostMatrix;
    matrix._bits = chars;
    return matrix;
}
```
## logging

* don't compile logScopes upon each 'log' but once per feature upon 'run'. or on system segment upon deployment.

## documentation

* For each feature repo readme
  * Add event documentation
  * Add feature parameter documentation
  * (Add extension documentation (added properties etc)) *optional*
