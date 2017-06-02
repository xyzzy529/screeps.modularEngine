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
        let features = getGitDirectories(options.src);

        const taskConfig = {
            gitadd: {},
            gitcommit: {},
            gitpush: {}
        }
        function addGitTask(name, p){
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
        function runGitTask(name){
            grunt.task.run([
                'gitadd:' + name,
                'forceon',
                'gitcommit:' + name,
                'forceoff',
                'gitpush:' + name
            ]);
        }
        
        // create task config for each feature
        for (const i in features) {
            addGitTask(features[i], path.join(options.src, features[i]));
        }
        addGitTask('engine', './');
        
        // register task config
        for (const task in taskConfig) {
            grunt.config(task, taskConfig[task]);
        }
        // run tasks
        for (const i in features) {
            runGitTask(features[i]);
        }
        runGitTask('engine');
    });
    return {
        options: {
            src: 'src/features/'
        }
    };
};
