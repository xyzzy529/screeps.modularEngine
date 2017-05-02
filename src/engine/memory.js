const SPLITTER = '³';
let mod = {};
module.exports = mod;
mod.deserialize = function(rawSegment){
    try{
        if( rawSegment != null && rawSegment.length !== 0 ) {
            /*
            return {
                name: rawSegment.substr(0,10).trim(), 
                tick: rawSegment.substr(10,10).trim(), 
                data: rawSegment.length > 20 ? JSON.parse(rawSegment.substr(20)) : {}
            }
            */
            return rawSegment.length > 20 ? JSON.parse(rawSegment.substr(20)) : {};
        }
    }
    catch(e){
        log(`Error deserializing memory part!`, {
            severity: 'error', 
            scope: 'Memory'
        }, e);
    }
    return null;
};
mod.serialize = function(segment){
    let serialized = null;
    try{
        const name = (segment.name + '          ').substr(0, 10);
        const tick = ('000000000' + segment.tick.toString()).slice(-10);
        const serializedData = JSON.stringify(segment.data);
        serialized = name + tick + serializedData;
    }
    catch(e){
        log(`Error serializing memory segment ${name}!`, {
            severity: 'error', 
            scope: 'Memory', 
        }, e);
    }
    return serialized;
};
function Segment(index, name, tick, rawSegment) {
    this.index = index;
    this.name = name;
    this.tick = tick;
    this.size = rawSegment.length;
    this.changed = false;
    let _loaded = false;
    let _data = null;

    function load(){
        let deserialized = mod.deserialize(rawSegment);
        if( deserialized === null )
            _data = {};
        else 
            _data = deserialized; //deserialized.data;
        _loaded = true;
    }
    
    Object.defineProperty(this, 'data', {
        configurable: true,
        get: function() {
            if( _loaded !== true ) load();
            return _data;
        },
        set: function(value) {
            _data = value;
            this.changed = true;
        }
    });

    this.set = function(handler){
        if( _loaded !== true ) load();
        handler(_data);
        this.changed = true;
    };    
    this.getObject = function(key, createIfNull = true){
        if( _loaded !== true ) load();
        if( _data[key] == null && createIfNull ){
            _data[key] = {};
            this.changed = true;
        }
        return _data[key];
    };
    this.setObject = function(key, value){
        if( _loaded !== true ) load();
        _data[key] = value;
        this.changed = true;
    };
};
function initSegment(rawSegment, index) {
    const name = rawSegment.substr(0,10).trim();
    if( name === '' ) return;
    const persistedTick = parseInt(rawSegment.substr(10,10));

    if( global.segments[name] == null || global.segments[name].tick != persistedTick ){
        log(`Loading memory segment ${name}!`, {
            severity: 'verbose', 
            scope: 'Memory'
        });
        global.segments[name] = new Segment(index, name, persistedTick, rawSegment);
    } // else keep existing memory instance
    else {
        global.segments[name].index = index;
        /*
        log(`Reusing cached memory segment ${name}!`, {
            severity: 'information', 
            scope: 'Memory'
        }, {
            "reusage ticks": Game.time - persistedTick
        });*/
    }
    return name;
};
mod.saveSegment = function(segment) {
    if( segment.changed === true ){
        log(`Saving memory segment ${segment.name}!`, {
            severity: 'verbose', 
            scope: 'Memory', 
        }, {
            size: segment.size
        });
        segment.tick = Game.time;
        const raw = mod.serialize(segment);
        global.rawSegments[segment.index] = raw;
        segment.size = raw.length;
        segment.changed = false;
    }
};
mod.setup = function(name){
    if( global.segments[name] === undefined ){
        log(`Setting up new memory segment ${name}!`, {
            severity: 'information', 
            scope: 'Memory', 
        });
        const index = global.rawSegments.length;
        global.segments[name] = new Segment(index, name, Game.time, name);
        global.segments[name].changed = true;
    }
};
mod.init = function(names){
    const raw = Memory.raw || '';
    global.rawSegments = raw.split(SPLITTER);
    if( global.segments == null ) global.segments = {};
    const initializer = (rawSegment, index) => {
        let name = initSegment(rawSegment, index);
        if(!names.includes(name)){
            // delete rawSegment
            global.rawSegments.splice(index,1);
            log(`Removing memory segment ${name}!`, {
                severity: 'information', 
                scope: 'Memory', 
            });
        }
    };
    global.rawSegments.forEach(initializer);
    names.forEach(mod.setup);
};
mod.save = function(){
    _.forEach(global.segments, mod.saveSegment);
    Memory.raw = global.rawSegments.join(SPLITTER);
};
