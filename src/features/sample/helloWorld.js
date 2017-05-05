
let mod = {};
module.exports = mod;

function flush(){
    // omitting the second property will create tick = {} if tick not found. setting false returns null instead.
    let tick = context.memory.getObject('tick', false); 
    if( tick == null ) tick = 0;
    else tick++;
    context.memory.setObject('tick', tick);
}
function execute(){
    // skip on low bucket
    if( global.state.bucketLevel > 0.5 ){ 
        log('Hello World!', {
            scope: 'core', 
            severity: 'verbose'
        }, context.memory.getObject('tick'));
    }
}

// register local functions to context events
context.flush.on(flush);
context.execute.on(execute);
