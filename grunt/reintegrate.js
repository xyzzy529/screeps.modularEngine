'use strict';

const optional = require('require-optional');
const submodules = ['ocs.internal', 'ocs.public'];

module.exports = function(grunt) {
    if (grunt.file.exists('./overrides/.git')) submodules.push('overrides');

    grunt.registerTask('reintegrate', 'Create a new integration branch with branches configured from reintegrate.json', function(branch, targetOption) {
        const options = this.options();
        if (Object.getOwnPropertyNames(options).length === 0) {
            grunt.fail.fatal("reintegrate requires external config: reintegrate.json");
            return false;
        }

        const optionOutput = {
            gitadd: {},
            gitcommit: {},
            gitcheckout: {},
            gitreset: {},
            gitmerge: {},
        };

        let runMerge = false;
        for (const subdir in options) {
            optionOutput.gitadd[subdir] = {
                options: {
                    cwd: subdir,
                    all: true,
                }
            };
            optionOutput.gitcommit[subdir] = {
                options: {
                    cwd: subdir,
                    message: 'reintegrate ' + subdir + ' before branching to ' + branch,
                    allowEmpty: true,
                }
            };
            optionOutput.gitcheckout[subdir] = {
                options: {
                    cwd: subdir,
                    branch: branch,
                    overwrite: true,
                }
            };
            optionOutput.gitreset[subdir] = {
                options: {
                    cwd: subdir,
                    mode: 'hard',
                    commit: options[subdir].reset,
                }
            };

            if (targetOption !== "clean" && options[subdir].merge) {
                for (const merge of options[subdir].merge) {
                    runMerge = true;
                    const key = subdir + "-" + merge;
                    optionOutput.gitmerge[key] = {
                        options: {
                            cwd: subdir,
                            branch: merge,
                        }
                    }
                }
            }
        }

        for (const task in optionOutput) {
            grunt.config(task, optionOutput[task]);
        }

        grunt.task.run([
            'gitadd', // add loose files
            'gitcommit', // commit changes
            'gitcheckout', // create new branch
            'gitreset', // reset hard to base branch
        ]);

        if (runMerge) {
            grunt.task.run(['gitmerge']); // merge features
        }
    });
    
    return {
        options: optional('./overrides/reintegrate.json') || optional('./reintegrate.json')
    };
};
