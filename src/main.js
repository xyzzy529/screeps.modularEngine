const engine = require('engine.system');
module.exports.loop = function () {
    engine.registerFeature("sample");
    engine.run();
}