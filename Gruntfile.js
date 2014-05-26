"use strict";

module.exports = function( grunt ) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect:{
            server:{
                options:{
                    port:9001,
                    hostname: 'localhost',
                    open: true
                }
            }
        },
        compass:{
            dev:{
                options:{
                    sassDir:'sass/',
                    cssDir:'css/',
                    imagesDir:'images/',
                    fontsDir:'fonts/',
                    generatedImagesDir:'sprites/',
                    outputStyle:'expanded',
                    relativeAssets:true,
                }
            },
            prod:{
                options:{
                    sassDir:'sass/',
                    cssDir:'prod/css/',
                    imagesDir:'images/',
                    fontsDir:'fonts/',
                    generatedImagesDir:'prod/sprites/',
                    outputStyle:'compressed',
                    relativeAssets:true,
                }
            }
        },
        csslint:{
            dev:{
                csslintrc:'.csslint'
            },
            strict:{
                options: {
                    import: 2
                },
                src:['css/*']
            }
        },
        
        uglify: {
            prod: {
              files: {
                'prod/f-angucharts.min.js': ['lib/angular/angular-charts.min.js','js/directives.js']
              }
            }
        },
        livereload  : {
            options   : {
              base    : 'css',
            },
            files     : ['css/**/*']
        },
        
        watch:{
            css:{
                files:['sass/**/*'],
                tasks:['buildCss']
            },
            js:{
                files:['js/**/*'],
                tasks:['uglify:prod']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-livereload');
    
    grunt.registerTask('createServer', ['connect:server']);
    grunt.registerTask('buildCss', ['compass:prod', 'csslint:strict']);
    grunt.registerTask('build', ['buildCss', 'uglify:prod']);
    grunt.registerTask('run', ['createServer', 'watch']);
    
    
};