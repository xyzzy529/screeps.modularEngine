
const engine = require('engine.system');

module.exports.loop = function () {
    // removing (not registering) a feature will also clear its memory
    // add more features here...
    engine.registerFeature("sample");
    engine.run();
};
