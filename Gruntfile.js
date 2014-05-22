"use strict";

module.exports = function( grunt ) {
    
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    
    grunt.initConfig({
        // Watch
        watch: {
            css: {
                files: [ '../scss/**/*' ],
                tasks: [ 'compass' ]
            },
            js: {
                files: '../assets/js/**/*',
                tasks: [ 'uglify' ]
            }
        },
        compass: {
            dist: {
                options: {
                        force: true,
                        config: 'config.rb',
                        outputStyle: 'compressed'
                }
            }
        },
        
        // Concat and minify javascripts
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    '../build/js/app.min.js': [
                        '../assets/js/app.js'
                    ]
                }
            }
        },

    });

    // carregando plugins
    grunt.loadNpmTasks( 'plugin-name' );

    // registrando tarefas
    grunt.registerTask( 'default', [ 'watch' ] );

};