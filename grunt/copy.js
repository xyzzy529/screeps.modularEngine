'use strict';

const config = require('../screeps.json');

module.exports = {
    src2dist: {
        files: [{
            expand: true,
            cwd: 'src/',
            src: ['**', '!example.main.js'],
            dest: 'dist/',
            filter: 'isFile',
            rename: function (dest, src) {
                // Change the path name. utilize dots for folders
                return dest + src.replace(/\//g,'.');
            }
        }]
    }
};
