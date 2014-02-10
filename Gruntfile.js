module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                livereload: true
            },
            express: {
              files:  [ 'app.js', 'views/**/*.js', 'views/**/*.hbs' ],
              tasks:  [ 'express:dev' ],
              options: {
                spawn: false // Without this option specified express won't be reloaded
              }
            },
            sass: {
                files: [ 'public/css/sass/**/*.scss' ],
                tasks: ['compass:dev']
            }
        },
        compass: {
            dist: {
                options: {
                    config: 'public/css/config.rb',
                    basePath: 'public/css',
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    config: 'public/css/config.rb',
                    basePath: 'public/css',
                    outputStyle: 'nested'
                }
            }

        },
        concurrent: {
            dev: {
                tasks: ['compass:dev', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        express: {
            dev: {
                options: {
                    script: 'app.js'
                }
            },
             run: {
                options: {
                    script: 'app.js',
                    background: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-express-server');


    grunt.registerTask('build', ['compass:dist']);

    grunt.registerTask('server', ['build', 'express:dev', 'watch']);

    grunt.registerTask('run', ['express:dev', 'compass:dev'])

    grunt.registerTask('default', ['build']);

};