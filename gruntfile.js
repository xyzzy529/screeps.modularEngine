'use strict';

const path = require('path');

module.exports = function(grunt) {
    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt'),
        overridePath: path.join(process.cwd(), 'grunt.private')
    });
    require('load-grunt-tasks')(grunt);
};
