
// Every feature must have an index.js at root, exporting an install() function

let mod = {};
module.exports = mod;

// other required features (names) to get this one running
mod.dependencies = [];

// configuration & load modules
mod.install = function(){
    // will create a dedicated memory partition utilizing RawMemory. See helloWorld.js for usage.
    context.provideDefaultPartition = true;
    // You can specify further additional memory partitions, using context.memoryPartitions
    // context.memoryPartitions = ['someName1'];
    // Those partitions are accessible using global.getMemory('someName1') and global.setMemory(value, 'someName1'). 
    // You can pass as many additional arguments as you want, specifying the path of what you want to get/set
    // like global.setMemory(({c:1}, 'someName1', 'a', 'b') will set b in { a: { b: { c: 1 }}}

    // setting parameter default values (may get overridden in individual main.js feature registration)
    context.defaultValue('INITIAL_COUNTER', 0);
    /*
    // you can define multiple default values at once using this syntax
    context.defaultValues({
        INITIAL_COUNTER: 0, 
        something: 'else'
    });
    */

    // context log scopes will be merged (only when logging from within the feature) with global log scope configuration
    // in this sample we are extending logging severity for 'census' log-context to 'verbose' (global is set to 'warning')
    context.logScopes = {
        census: {severity: 'verbose'}
    };
    
    // load hello world sample feature module
    context.load('helloWorld');
};
