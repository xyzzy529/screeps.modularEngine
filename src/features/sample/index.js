
let mod = {};
module.exports = mod;

mod.install = function(feature){
    feature.requiresMemory = true;
    feature.logScopes = { // will be merged (only when logging from within the feature) with global scopes
        core: {severity: 'verbose'}
    };
    feature.load('helloWorld');
};
