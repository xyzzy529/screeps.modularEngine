
let mod = {};
module.exports = mod;

function analyze(){
    let tick = context.memory.getObject('tick', false); // omitting the second property will create tick = {} if tick not found. setting false returns null instead.
    if( tick == null ) tick = 0;
    else tick++;
    context.memory.setObject('tick', tick);
}
function run(){
    log('Hello World!', {
        scope: 'core', 
        severity: 'verbose'
    }, context.memory.getObject('tick'));
}

context.analyze.on(analyze);
context.execute.on(run);
