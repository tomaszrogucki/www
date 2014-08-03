'use strict';

module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);
    var config = grunt.file.readJSON('config.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        concat: {
            styl: {
                src: [
                    './src/assets/css/normalize.styl',
                    './src/assets/css/icons.styl',
                    './src/assets/css/colors.styl',
                    './src/assets/css/fonts.styl',
                    './src/assets/css/general.styl',
                    './src/modules/**/*.styl',
                    './src/assets/**/*.styl'
                ],
                dest: './src/tmp/style.styl'
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

        stylus: {
            prod: {
                files: {
                    './dist/production/www/assets/css/style.css': './src/tmp/style.styl'
                }
            },
            dev: {
                options: {
                    compress: false
                },
                files: {
                    './dist/development/www/assets/css/style.css': './src/tmp/style.styl'
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
                src: ['**/*.jpg', '**/*.png', '**/*.ttf', '**/*.woff'],
                dest: './dist/production/www/assets'
            },
            devAssets: {
                expand: true,
                cwd: './src/assets',
                src: ['**/*.jpg', '**/*.png', '**/*.ttf', '**/*.woff'],
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
                    'dist/production/www/assets/fonts/*.*',
                    'dist/production/www/assets/icons/*.*',
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
                    'dist/development/www/assets/fonts/*.*',
                    'dist/development/www/assets/icons/*.*',
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

        'ftp-deploy': {
            prod: {
                auth: {
                    host: config.hostname,
                    port: 21,
                    authKey: 'key'
                },
                src: 'dist/production/www',
                dest: '/public_html',
                exclusions: ['dist/production/www/.htaccess']
            }
        },

        watch: {
            custom: {
                files: ['./**/*.js', './**/*.jade', './**/*.jpg', './**/*.styl'],
                tasks: ['newer:copy', 'newer:jade', 'newer:browserify2', 'newer:concat', 'newer:styl']
            },
            devBuild: {
                files: ['./src/**/*.*'],
                tasks: ['devBuild']
            }
        }
    });


    grunt.registerTask('copyDev', ['newer:copy:devHtml', 'newer:copy:devImg', 'newer:copy:devApi', 'newer:copy:devConfig', 'newer:copy:devAssets']);
    grunt.registerTask('copyProd', ['copy:prodHtml', 'copy:prodImg', 'copy:prodApi', 'copy:prodConfig', 'copy:prodAssets']);

    grunt.registerTask('prepare', ['concat:styl', 'jade:templates']);
    grunt.registerTask('devBuild', ['prepare', 'stylus:dev', 'jade:dev', 'browserify2:dev', 'copyDev']);
    grunt.registerTask('prodBuild', ['clean:prod', 'prepare', 'stylus:prod', 'jade:prod', 'browserify2:prod', 'copyProd', 'hashres:prod']);



    // older
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['jade', 'browserify2', 'concat', 'stylus', 'newer:copy', 'hashres']);
    grunt.registerTask('staticAssets', ['newer:copy:api', 'newer:copy:html', 'newer:copy:img', 'newer:copy:assets']);
    grunt.registerTask('style', ['concat:styl', 'stylus']);
};