
let mod = {};
module.exports = mod;

mod.install = function(){
    // will create a dedicated memory partition utilizing RawMemory
    context.requiresMemory = true;
    // will be merged (only when logging from within the feature) with global log scope configuration
    // in this sample we are extending logging severity for 'core' log-context to 'verbose' (global is set to 'information')
    context.logScopes = {
        core: {severity: 'verbose'}
    };
    // load hello world sample feature module
    context.load('helloWorld');
};
