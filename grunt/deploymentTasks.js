
module.exports = function(grunt) {
    // clean deployment (dry run)
    grunt.registerTask('default', ['clean', 'copy:src2dist', 'deploymentnumber']);
    // clean deployment
    grunt.registerTask('deploy', ['default', 'screeps']);
    /*
    // compressed [experimental] (dry run)
    grunt.registerTask('compress', ['clean', 'copy:src', 'deploymentnumber', 'webpack']);
    // compressed [experimental]
    grunt.registerTask('compress-deploy', ['clean', 'copy:src', 'deploymentnumber', 'webpack', 'switch-to-pack-deploy','screeps']);
    // uglified [experimental] (dry run)
    grunt.registerTask('ugly', ['clean', 'copy:src', 'deploymentnumber', 'webpack', 'uglify']);
    // uglified [experimental]
    grunt.registerTask('ugly-deploy', ['clean', 'copy:src', 'deploymentnumber', 'webpack', 'uglify', 'switch-to-pack-deploy', 'screeps']);
    */
};
