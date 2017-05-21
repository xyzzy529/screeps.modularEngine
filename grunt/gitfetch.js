'use strict';

const submodules = ['ocs.internal', 'ocs.public'];

module.exports = function(grunt){
    const gitfetch = {};
    submodules.forEach(function(subdir) {
        gitfetch[subdir] = {
            options: {
                cwd: subdir,
                all: true,
            },
        };
    });
    return gitfetch;
};
