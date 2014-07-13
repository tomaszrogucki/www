'use strict';

module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        copy: {
            html: {
                expand: true,
                cwd: './src/',
                src: '*.html',
                dest: './dist/production'
            },
            img: {
                expand: true,
                cwd: './src/modules/',
                src: '**/*.jpg',
                dest: './dist/production/assets'
            },
            api: {
                expand: true,
                cwd: './src/api',
                src: ['**/*.*', '../../.htaccess', '../../config.php'],
                dest: './dist/production/api'
            },
            assets: {
                expand: true,
                cwd: './src/assets',
                src: ['**/*.jpg', '**/*.png'],
                dest: './dist/production/assets'
            }
        },

        jade: {
            templates: {
                options: {
                    wrap: 'node',
                    runtime: true
                },
                files: {
                    "./src/tmp/templates/": ["./src/**/*.jade"]
                }
            },
            prod: {
                options: {
                    client: false,
                    pretty: true,
                    runtime: false
                },
                files: {
                    "./dist/production/": ["./src/index.jade"]
                }
            }
        },

        browserify2: {
            dev: {
                entry: ['./src/modules/photoGallery/photoGallery.js'],
                compile: './dist/production/assets/js/application.js',
                options: {
                    expose: {
                        files: [
                            {
                                cwd: './src/',
                                src: ['**/*.js']
                            }
                        ]
                    }

                }
            }
        },

        concat: {
            less: {
                src: [
                    './src/modules/**/*.less',
                    './src/assets/**/*.less'
                ],
                dest: './src/tmp/style.less'
            }
        },

        less: {
            dev: {
                files: {
                    './dist/production/assets/css/style.css': './src/tmp/style.less'
                }
            }
        },

        hashres: {
            options: {
                encoding: 'utf8',
                fileNameFormat: '${name}-${hash}.${ext}',
                renameFiles: true
            },
            prod: {
                src: [
                    'dist/production/assets/css/*.css',
                    'dist/production/assets/imgs/*.*',
                    'dist/production/assets/js/*.js'
                ],
                dest: [
                    'dist/production/index.html',
                    'dist/production/assets/css/*.css'
                ]
            }
        },

        watch: {
            files: ['./**/*.js', './**/*.jade', './**/*.jpg', './**/*.less'],
            tasks: ['newer:copy', 'newer:jade', 'newer:browserify2', 'newer:concat', 'newer:less']
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['jade', 'browserify2', 'concat', 'less', 'newer:copy', 'hashres']);
    grunt.registerTask('staticAssets', ['newer:copy:api', 'newer:copy:html', 'newer:copy:img', 'newer:copy:assets']);
    grunt.registerTask('style', ['concat:less', 'less']);
};