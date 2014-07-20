'use strict';

module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        concat: {
            less: {
                src: [
                    './src/assets/css/normalize.less',
                    './src/modules/**/*.less',
                    './src/assets/**/*.less'
                ],
                dest: './src/tmp/style.less'
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
                    "./dist/production/www": ["./src/index.jade"]
                }
            },
            dev: {
                options: {
                    client: false,
                    pretty: true,
                    runtime: false
                },
                files: {
                    "./dist/development/www/": ["./src/index.jade"]
                }
            }
        },

        less: {
            prod: {
                files: {
                    './dist/production/www/assets/css/style.css': './src/tmp/style.less'
                }
            },
            dev: {
                files: {
                    './dist/development/www/assets/css/style.css': './src/tmp/style.less'
                }
            }
        },

        browserify2: {
            prod: {
                entry: ['./src/modules/photoGallery/photoGallery.js'],
                compile: './dist/production/www/assets/js/application.js',
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
            },
            dev: {
                entry: ['./src/modules/photoGallery/photoGallery.js'],
                compile: './dist/development/www/assets/js/application.js',
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

        copy: {
            prodHtml: {
                expand: true,
                cwd: './src/',
                src: '*.html',
                dest: './dist/production/www'
            },
            devHtml: {
                expand: true,
                cwd: './src/',
                src: '*.html',
                dest: './dist/development/www'
            },

            prodImg: {
                expand: true,
                cwd: './src/modules/',
                src: '**/*.jpg',
                dest: './dist/production/www/assets'
            },
            devImg: {
                expand: true,
                cwd: './src/modules/',
                src: '**/*.jpg',
                dest: './dist/development/www/assets'
            },

            prodApi: {
                expand: true,
                cwd: './src/api',
                src: ['**/*.*', '../.htaccess'],
                dest: './dist/production/www/api'
            },
            devApi: {
                expand: true,
                cwd: './src/api',
                src: ['**/*.*', '../.htaccess'],
                dest: './dist/development/www/api'
            },

            prodConfig: {
                expand: true,
                cwd: './src/config/production',
                src: ['config.php'],
                dest: './dist/production'
            },
            devConfig: {
                expand: true,
                cwd: './src/config/development',
                src: ['config.php'],
                dest: './dist/development'
            },

            prodAssets: {
                expand: true,
                cwd: './src/assets',
                src: ['**/*.jpg', '**/*.png'],
                dest: './dist/production/www/assets'
            },
            devAssets: {
                expand: true,
                cwd: './src/assets',
                src: ['**/*.jpg', '**/*.png'],
                dest: './dist/development/www/assets'
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
                    'dist/production/www/assets/css/*.css',
                    'dist/production/www/assets/imgs/*.*',
                    'dist/production/www/assets/js/*.js'
                ],
                dest: [
                    'dist/production/www/index.html',
                    'dist/production/www/assets/css/*.css'
                ]
            },
            dev: {
                src: [
                    'dist/development/www/assets/css/*.css',
                    'dist/development/www/assets/imgs/*.*',
                    'dist/development/www/assets/js/*.js'
                ],
                dest: [
                    'dist/development/www/index.html',
                    'dist/development/www/assets/css/*.css'
                ]
            }
        },

        clean: {
            prod: ['./dist/production'],
            dev: ['./dist/development']
        },

        watch: {
            files: ['./**/*.js', './**/*.jade', './**/*.jpg', './**/*.less'],
            tasks: ['newer:copy', 'newer:jade', 'newer:browserify2', 'newer:concat', 'newer:less'],
            devBuild: ['devBuild']
        }
    });


    grunt.registerTask('copyDev', ['newer:copy:devHtml', 'newer:copy:devImg', 'newer:copy:devApi', 'newer:copy:devConfig', 'newer:copy:devAssets']);
    grunt.registerTask('copyProd', ['copy:prodHtml', 'copy:prodImg', 'copy:prodApi', 'copy:prodConfig', 'copy:prodAssets']);

    grunt.registerTask('prepare', ['concat:less', 'jade:templates']);
    grunt.registerTask('devBuild', ['prepare', 'less:dev', 'jade:dev', 'browserify2:dev', 'copyDev']);
    grunt.registerTask('prodBuild', ['clean:prod', 'prepare', 'less:prod', 'jade:prod', 'browserify2:prod', 'copyProd', 'hashres:prod']);



    // older
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['jade', 'browserify2', 'concat', 'less', 'newer:copy', 'hashres']);
    grunt.registerTask('staticAssets', ['newer:copy:api', 'newer:copy:html', 'newer:copy:img', 'newer:copy:assets']);
    grunt.registerTask('style', ['concat:less', 'less']);
};