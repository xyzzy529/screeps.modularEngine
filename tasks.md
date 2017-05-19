# Tasks

## Foundation

* Creep
  * Implement Creep.spawningStarted event
  * clear memory on cleanup: mod.staleCreeps & mod.staleHostiles
  * Save bodyCount property to memory. may also get filled at spawning
  * Treat Intruders in rooms marked for claiming/mining as Enemy, not EnemyOnNeutralGround => callback?
* Flag
  * Add Flag.found event for each primary color
* Room
  * trigger Room.collapsed
* Compelete event readme doc

## basicTower

* change static whitelist to isPlayerWhitelisted callback => intel feature

## navigation

* implement segment backend with fixed width fields to use better serialization (no JSON)
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

## Overall

* Implement global.isPlayerWhitelisted(playername) callback => intel feature


