'use strict';

const config = require('../screeps.json');

module.exports = function(grunt){
    if(!config.branch) {
        config.branch = 'sim';
    }
    if(!config.ptr) {
        config.ptr = false;
    }
    if(!config.publishDir) {
        config.publishDir = 'pub/';
    }

    // Override branch in screeps.json
    // grunt deploy --branch=<customBranch>
    var branch = false;
    if(grunt.option('branch')) branch = grunt.option('branch');

    grunt.registerTask('switch-to-pack-deploy', function () {
        grunt.config.set('screeps.dist.src', ['pack/main.js']);
    });

    return {
        options: {
            email: config.email,
            password: config.password,
            branch: branch ? branch : config.branch,
            ptr: config.ptr
        },
        dist: {
            src: ['dist/*.js']
        }
    };
};
