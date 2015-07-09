'use strict';

var path = require('path');


module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Common paths to be used by tasks
        base: {
            'dev':'.',
            'tmplhtml':'./templates',
            'tmpl':'./js/templates',
            'dist':'./dist',
            'temp': './.tmp'
        },
        clean: {
            temp: {
                src: ['<%= base.temp %>/']
            },
            tmpl:{
                src:['<%= base.tmpl %>/']
            },
            dist: {
                src: ['<%= base.dist %>/']
            }
        },
        rev: {
            dist: {
                options: {
                    algorithm: 'sha1',
                    length: 4
                },
                src: [
                    '<%= base.dist %>/js/*.js',
                    '<%= base.dist %>/ueditor/*.js',
                    '<%= base.dist %>/css/*.css'
                ]
            }
        },
        requirejs: {
            
            dist: {
                options: {
                    name: 'main', 
                    mainConfigFile: '<%= base.dev %>/js/main.js',                
                    out: '<%= base.dist %>/js/main.js',
                    preserveLicenseComments: false,
                    almond:true, 
                    replaceRequireScript: [
                        {
                            files: ['<%= base.dist %>/index.html'],
                            module: 'main'
                        }
                    ],
                    baseUrl: '<%= base.dev %>/js/'
                    
                    
                }
            }
        },
        copy: {
            ueditor:{
                files: [
                    {
                        expand: true,
                        cwd: '<%= base.dev %>/ueditor/',
                        src: ['./lang/**/*','./themes/**/*','./third-party/**/*'],
                        dest: '<%= base.dist %>/ueditor/'
                    }
                ]
            },
            img: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= base.dev %>/img/',
                        src: ['./*'],
                        dest: '<%= base.dist %>/img/'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= base.dev %>',
                        src: ['./*.html'],
                        dest: '<%= base.dist %>/'
                    }
                ]
            },
            fonts:{
                files: [
                    {
                        expand: true,
                        cwd: '<%= base.dev %>/css/fonts',
                        src: ['./*'],
                        dest: '<%= base.dist %>/fonts'
                    }
                ]        
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= base.dist %>/'
            },
            html: {
                src: ['<%= base.dev %>/*.html']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    '<%= base.dist %>/index.html': '<%= base.dist %>/index.html'
                }
            }
        },
        usemin: {
            html: ['<%= base.dist %>/*.html']
        },
        handlebars:{
            compile:{
                options:{
                    namespace:'JST',
                    processName:function(filePath){
                        return filePath.match(/^\.\/templates\/(.*)\/(.*)\.hbs$/)[2];
                    },
                    amd:true
                },
                files:{
                    '<%= base.tmpl %>/templates.js':['<%= base.tmplhtml %>/**/*.hbs']
                }
            }
        }

    });


    grunt.registerTask('tmpl', function() {
        grunt.task.run('clean:tmpl');
        grunt.task.run('handlebars');

    });


    grunt.registerTask('release', function() {
        grunt.task.run('clean:dist');
        // minify images
        grunt.task.run('copy:img');
        // combile and uglify js files
        grunt.task.run('copy:html');
        grunt.task.run('copy:ueditor');
        grunt.task.run('copy:fonts');

        grunt.task.run('useminPrepare');

    
        grunt.task.run('requirejs:dist');
        grunt.task.run('concat:generated');
        grunt.task.run('uglify:generated');

        grunt.task.run('cssmin');
        grunt.task.run('rev');
        grunt.task.run('usemin');
      
        // html mini
        grunt.task.run('htmlmin');
        grunt.task.run('clean:temp');
    });

    grunt.registerTask('dist', ['tmpl','release']);


};
