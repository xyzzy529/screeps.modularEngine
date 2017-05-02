const engine = require('engine.system.js');
module.exports.loop = function () {
    engine.registerFeature("sample");
    engine.run();
}