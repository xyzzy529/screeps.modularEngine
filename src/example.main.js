
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
        flushUnusedPartitions: false // experimental
    });
    */
    // You can also override default log scope settings specifying a second argument
    // you only need to define those log scope settings which you want to change, they will get merged
    // this example shows system default settings
    /*
    engine.run({
        enableProfiler: false, 
        flushUnusedPartitions: false // experimental
    }, {
        none: {severity: 'verbose', promptSign: '#999'}, // gray
        core: {severity: 'information', promptSign: 'red'}, 
        military: {severity: 'information', promptSign: 'black'}, 
        PathFinding: {severity: 'information', promptSign: '#e6de99'}, // light yellow
        market: {severity: 'information', promptSign: '#ffaa00'}, // orange
        census: {severity: 'warning', promptSign: '#82a1d6'}, // light blue
        CreepAction: {severity: 'warning', promptSign: '#fff'}, // white
        Memory: {severity: 'information', promptSign: 'firebrick'}, // red
    });
    */
    // The same works for engine.registerFeature() - the third param may define logScope overrides
    //
    // In the end, log scope can be defined at different levels (lower number wins): 
    // 1. root main: engine.registerFeature()  /defined by enduser /feature impact
    // 2. root main: engine.run()  /defined by enduser /global impact
    // 3. feature index: context.logScopes  /defined by feature development /feature impact
    // 4. system baseline: global.LOG_SCOPE  /defined by engine development /global impact
    //
    // valid severity values are (from few to many): 
    // - none
    // - error
    // - warning
    // - ok
    // - information
    // - verbose
};
