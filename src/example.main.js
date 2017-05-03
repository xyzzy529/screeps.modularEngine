const engine = require('engine.system');
module.exports.loop = function () {
    // removing a feature will also clear its memory
    engine.registerFeature("sample");
    engine.run();
};
