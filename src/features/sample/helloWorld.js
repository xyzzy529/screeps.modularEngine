
let mod = {};
module.exports = mod;

mod.execute = function(){
    let memory = global.feature.sample.memory;
    memory['tick'] = memory['tick'] || 0;
    memory['tick']++;
    console.log('Hello World!', memory['tick']);
};
