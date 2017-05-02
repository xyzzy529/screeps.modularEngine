
let mod = {};
module.exports = mod;

mod.install = function(feature){
    feature.requiresMemory = true;
    feature.load('helloWorld.js');
};
