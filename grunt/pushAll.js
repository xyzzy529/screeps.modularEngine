'use strict';

const fs = require('fs');
const path = require('path');

function getGitDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => {
        const p = path.join(srcpath, file);
        const pg = path.join(p, '/.git');
        return fs.lstatSync(p).isDirectory() && fs.existsSync(pg);
    })
}

module.exports = function(grunt) {
    grunt.registerTask('forceoff', 'Forces the force flag off', function() {
        grunt.option('force', false);
    });

    grunt.registerTask('forceon', 'Forces the force flag on', function() {
        grunt.option('force', true);
    });

    grunt.registerTask('pushAll', function (message) {
        let options = this.options();
        if( message == null ) message = "changes";

        // get list of features
        let features = getGitDirectories(options.src);

        // create task config
        const taskConfig = {
            gitadd: {},
            gitcommit: {},
            gitpush: {}
        }
        function addTask(name, p){
            taskConfig.gitadd[name] = {
                options: {
                    cwd: p,
                    all: true,
                }
            };
            taskConfig.gitcommit[name] = {
                options: {
                    cwd: p,
                    message
                }
            };
            taskConfig.gitpush[name] = {
                options: {
                    cwd: p
                }
            };
        }
        function run(name){
            grunt.task.run([
                'gitadd:' + name,
                'forceon',
                'gitcommit:' + name,
                'forceoff',
                'gitpush:' + name
            ]);
        }
        for (const i in features) {
            const feature = features[i];
            const p = path.join(options.src, feature);
            addTask(feature, p);
        }
        addTask('engine', './');
        
        // register task config
        for (const task in taskConfig) {
            grunt.config(task, taskConfig[task]);
        }
        // register task config
        for (const i in features) {
            run(features[i]);
        }
        run('engine');
    });
    return {
        options: {
            src: 'src/features/'
        }
    };
};
