
const engine = require('engine.system');

module.exports.loop = function () {
    // set your ingame username. may be used in some features...
    global.USERNAME = 'cyberblast';
    // friendly players which should not get attacked
    global.PLAYER_WHITELIST = [];
    
    // removing (not registering) a feature will also clear its memory
    // add more features here...
    engine.registerFeature("sample");
    engine.run();
};
