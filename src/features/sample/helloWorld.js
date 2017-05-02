
let mod = {};
module.exports = mod;

mod.execute = function(){
    let memory = global.currentContext.memory;
    let tick = 0;
    if( memory ) {
        tick = memory.getObject('tick', false);
        if( tick == null ) tick = 0;
        else tick++;
        memory.setObject('tick', tick);
    }
    log('Hello World!', {
        scope: 'core', 
        severity: 'verbose'
    }, tick);
};
