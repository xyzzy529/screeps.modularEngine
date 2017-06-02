
// Sample feature
// Will log a dummy message each tick if bucket level > 50%

// copy locally to have at hand within functions when called from other contexts
// (not required for this example, just to show the idea)
let feature = context;

function initialize(){
    // access feature memory using feature.memory.get() and feature.memory.set(value). You can pass as many additional arguments as you want, specifying the path of what you want to get/set
    // like feature.memory.set({c:1}, 'a', 'b') will set b in { a: { b: { c: 1 }}}
    let tick = feature.memory.get('tick');

    // access feature settings using the context
    if( tick == null ) tick = feature.settings.INITIAL_COUNTER;
    else tick++;

    feature.memory.set(tick, 'tick');
}
function execute(){
    // skip on low bucket
    if( global.state.bucketLevel > 0.5 ){ 

        // log is a custom log function. 
        // param 1: log text
        // param 2: Classification {scope, severity, roomName}. Logging can be configured to show / don't show messages, regarding these values...
        // param 3: additional data to show below message. may be an object.
        log('Hello World!', {
            scope: 'census', 
            severity: 'verbose'
        }, feature.memory.get('tick'));
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
