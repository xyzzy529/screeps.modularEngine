
// Sample feature
// Will log a dummy message each tick if bucket level > 50%

let mod = {};
module.exports = mod;

// copy locally to have at hand within functions when called from other contexts
// (not required for this example, just to show the idea)
let feature = context;

function initialize(){
    // access feature memory using context.memory.getObject(key, createIfNull=true) 
    // omitting the second argument or setting to true will create an empty object {}, if 'key' is not found. setting false returns null instead.
    let tick = feature.memory.getObject('tick', false);
    if( tick == null ) tick = feature.settings.INITIAL_COUNTER;
    else tick++;
    // you need to call setObject to write back. 
    // this is required to avoid serialization (save cpu) if there is no change on that partition
    feature.memory.setObject('tick', tick);
}
function execute(){
    // skip on low bucket
    if( global.state.bucketLevel > 0.5 ){ 
        // log is a custom log function. 
        // param 1: log text
        // param 2: Classification (scope & severity). Logging can be configured to show / don't show messages, regarding these values...
        // param 3: additional data to show below message. may be an object.
        log('Hello World!', {
            scope: 'census', 
            severity: 'verbose'
        }, feature.memory.getObject('tick'));
    }
}

// register local functions to context events
feature.initialize.on(initialize);
feature.execute.on(execute);

// available events are (triggered in that order): 
// - flush
//   create or delete objects/cache/memory at loop start
// - initialize
//   attach to events, prepare
// - analyze
//   scan environment. trigger events (will get executed delayed).
// - execute
//   do something. release events to subscribers.
// - cleanup
//   save or clean up memory/cache. Loop end imminent.
