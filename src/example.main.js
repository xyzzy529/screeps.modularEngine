
const engine = require('engine.system');

module.exports.loop = function () {
    // register more features here...
    engine.registerFeature("sample", {
        // optionally set individual feature parameters
        // default values need to be defined in feature index (by feature developer)
        INITIAL_COUNTER: 500
    });

    engine.run();
    // optionally, you can define some settings 
    // this example shows default settings
    /*
    engine.run({
        enableProfiler: false, 
        flushUnusedPartitions: false
    });
    */
};
