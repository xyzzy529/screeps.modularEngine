'use strict';

module.exports = function(grunt){
    grunt.registerTask('deploymentnumber', function () {
        let options = this.options();
        //grunt.log.oklns(JSON.stringify(grunt.config('deploymentnumber')));
        let meta = grunt.file.read( options.file );
        let config = grunt.file.readJSON( options.configFile );
        let number = config[options.configField]+1;
        
        let replaced = false;
        let replace = (match, p1) => {
            replaced = true;
            return match.replace(p1, number.toString());
        };
        let pattern = new RegExp("(?:[ ]*" + options.field + "[ ]*[=][ ]*)(\\d*)(?:;?\\r)");
        let newMeta = meta.replace(pattern, replace);
        if( replaced ){
            config[options.configField] = number;
            grunt.file.write( options.configFile, JSON.stringify( config, null, 2 ) );
            grunt.file.write( options.file, newMeta );
            grunt.log.oklns( 'Deployment number: ' + number );
        } else {
            grunt.log.errorlns( 'Parameter "' + options.field + '" not found in "' + options.file + '".' );
        }
    });

    grunt.registerTask('dn', ['deploymentnumber']);
    
    return {
        options: {
            file: 'dist/engine.system.js', 
            field: 'DEPLOYMENT',
            configFile: 'screeps.json', 
            configField: 'deployment'
        }
    };
};
