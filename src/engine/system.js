
/*
TODO: 

- add logging

*/

let mod = {};
module.exports = mod;

// installer.inject keeps overridden functions in module.baseOf['<namespace>']['<functionName>']
const KEEP_OVERRIDEN_BASE_FUNCTION = false;
const ENABLE_PROFILER = false;
const BAD_NODE_CPU = 6;

const profiler = require('profiler');

const phase = {
    flush(elem){
        if(elem.flush !== undefined) elem.flush();
    },
    register(elem){
        if(elem.register !== undefined) elem.register();
    },
    analyze(elem){
        if(elem.analyze !== undefined) elem.analyze();
    },
    execute(elem){
        if(elem.execute !== undefined) elem.execute();
    },
    cleanup(elem){
        if(elem.cleanup !== undefined) elem.cleanup();
    },
};

const Feature = function(name){
    this.name = name;
    this.files = {};
    this.requiresMemory = false;
    this.memory = null;
    this.initMemory = function(){
        if( this.requiresMemory === true ){
            // TODO: load memory partition
            feature.memory = {};
        }
    };
    this.load = function(file){
        this.files[file] = require(`features.${this.name}.${file}`);
    };
    this.flush = function(){
        this.files.forEach(phase.flush);
    };
    this.register = function(){
        this.files.forEach(phase.register);
    };
    this.analyze = function(){
        this.files.forEach(phase.analyze);
    };
    this.execute = function(){
        this.files.forEach(phase.execute);
    };
    this.cleanup = function(){
        this.files.forEach(phase.cleanup);
    };
    this.saveMemory = function(){
        if( this.requiresMemory === true ){
            // TODO: save memory partition
        }
    };
};

const system = {
    basics(){
        // base class for events
        // if (collect), triggers will not call handlers immediately but upon release() instead
        global.LiteEvent = function(collect = true) {
            // registered subscribers
            this.handlers = [];
            // collected calls
            this.triggers = [];
            // register a new subscriber
            this.on = function(handler) {
                this.handlers.push(handler);
            };
            // remove a registered subscriber
            this.off = function(handler) {
                this.handlers = this.handlers.filter(h => h !== handler);
            };
            // call all registered subscribers
            this.trigger = function(data) {
                if( collect ) this.triggers.push(data == null ? 'nullEvent' : data);
                else this.call(data);
            };
            this.call = function(data){
                try{
                    if( data === 'nullEvent' ) data = null;
                    this.handlers.slice(0).forEach(h => h(data));
                } catch(e){
                    console.log(`Error in LiteEvent.trigger ${data}`, e);
                }
            };
            this.release = function(collectAgain = false){
                collect = collectAgain;
                let that = this;
                this.triggers.forEach(d => that.call(d));
                let response = this.triggers;
                this.triggers = [];
                return response;
            };
        };
    },
    bootstrap(){
        const startCpu = Game.cpu.getUsed();
        const isBadNode = startCpu > BAD_NODE_CPU;
        const isNewServer = global.cacheTime !== (Game.time-1) || global.lastServerSwitch === undefined;
        const requiresInstall = global.installedVersion !== mod.DEPLOYMENT;
        global.cacheTime = Game.time;
        if( isNewServer ) global.lastServerSwitch = Game.time;
        let isNewDeployment = false;

        // load modules
        if( requiresInstall ){
            let systemSegment = RawMemory.segments[0];
            if( systemSegment != null && systemSegment.length !== 0 ) global.system = JSON.parse(systemSegment);
            isNewDeployment = global.system == null || global.system.version !== mod.DEPLOYMENT;

            this.basics();
            global.feature = {};
            mod.features.forEach(installFeature);
            global.installedVersion = mod.DEPLOYMENT;
        }

        if( isNewDeployment ) console.log(`<span style="color:green;font-weight:bold">v ${mod.DEPLOYMENT} arrived!</span>`);

        // setup memory
        _.invoke(global.feature, 'initMemory');
        let active = [0,2]; // 0 = modules, 1 = profiler, 2 = commandBuffer
        if( ENABLE_PROFILER ) active.push(1);
        RawMemory.setActiveSegments(active); 
    },
    shutdown(){
        // execute buffered command        
        const command = RawMemory.segments[2];
        if(command == null || command === '') return;
        try{
            console.log('Executing buffered command<br>', command);
            console.log(eval(command));
        }catch(e){
            console.log(e);
        }
        RawMemory.segments[2] = '';

        _.invoke(global.feature, 'saveMemory');

        if( global.moduleSegmentUpdate === true ) {
            if( global.system == null ) RawMemory.segments[0] = '';
            else RawMemory.segments[0] = JSON.stringify(global.system);
        }
        if( ENABLE_PROFILER ) profiler.save();
    },
    installFeature(name){
        let featureIndex;
        try{
            featureIndex = require(`features.${name}.index.js`);
        } catch(e) {
            if( e.message && e.message.indexOf('Unknown module') > -1 ){
                console.log(`Unable to find feature index file for "${name}"!`);
            } else {
                console.log(`Error loading feature index "${name}"!<br/>${e.toString()}`);
            }
            featureIndex = null;
        }
        if( featureIndex != null && featureIndex.install != null ){
            const feature = new Feature(name);
            try{
                featureIndex.install(feature);
                global.feature[name] = feature;
            }catch(e) {
                console.log(`Error installing feature "${name}"!<br/>${e.toString()}`);
            }
        }
    }
};

mod.features = [];
mod.registerFeature = function(name){
    mod.features.push(name);
};
mod.DEPLOYMENT = 0;
mod.run = function(){
    if( ENABLE_PROFILER ) profiler.enable();
    profiler.wrap(function() {
        system.bootstrap();
        _.forEach(global.feature, phase.flush);
        _.forEach(global.feature, phase.register);
        _.forEach(global.feature, phase.analyze);
        _.forEach(global.feature, phase.execute);
        _.forEach(global.feature, phase.cleanup);
        system.shutdown();
    });
};
