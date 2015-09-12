/**
 * Created by migue on 24/08/15.
 */

module.exports = function (grunt) {
    require('jit-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ["dist"],
            svg_sprite: ["svg/compressed"]
        },

        sass: {
            main: {
                options: {
                    style: 'expanded',
                    compass: true
                },
                files: {
                    'dist/css/<%= pkg.name %>_ltr.css': 'sass/<%= pkg.name %>.scss'
                }
            },
            sections: {
                options: {
                    style: 'expanded',
                    compass: true
                },
                files: [{
                    expand: true,
                    cwd: 'sass/sections',
                    src: ['**/*.scss'],
                    dest: 'dist/css/sections',
                    ext: '_ltr.css'
                }]
            }
        },

        postcss: {
            options: {
                map: true
            },

            main: {
                src: 'dist/css/**/*_ltr.css',
                options: {
                    processors: [
                        require('pixrem')(),
                        require('autoprefixer')({browsers: 'last 3 versions'})
                    ]
                }
            },
            rtl: {
                options: {
                    processors: [
                        require('rtlcss')()
                    ]
                },

                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['**/*_ltr.css'],
                    dest: 'dist/css/',
                    rename: function (dest, matchedSrcPath) {
                        return path.join(dest, matchedSrcPath.replace('_ltr', '_rtl'));
                    }
                }]
            }
        },
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                advanced: false,
                sourceMap: true
            },
            main: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    dest: 'dist/css',
                    src: ['**/*.css'],
                    ext: '.min.css'
                }]
            }
        },

        typescript: {
            dist: {
                src: ['js/**/*.ts'],
                dest: 'dist/js/<%= pkg.name %>.js',
                options: {
                    module: 'amd'
                }
            }
        },

        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist/js',
                    dest: 'dist/js',
                    src: ['**/*.js'],
                    ext: '.min.js'
                }]
            }
        },

        svgmin: {
            options: {
                plugins: [
                    {removeViewBox: false},
                    {removeUselessStrokeAndFill: false}
                ]
            },
            svg: {
                expand: true,
                cwd: 'svg',
                src: ['*.svg'],
                dest: 'dist/svg',
                ext: '.svg'
            },
            sprite: {
                expand: true,
                cwd: 'svg/sprite',
                src: ['*.svg'],
                dest: 'svg/compressed',
                ext: '.svg'
            }
        },

        svgstore: {
            options: {
                includedemo: false,
                prefix: 'icon-'
            },
            sprite: {
                files: {
                    'dist/svg/sprite/<%= pkg.name %>.svg': ['svg/compressed/*.svg']
                }
            }
        },

        grunticon: {
            sprite: {
                files: [{
                    expand: true,
                    cwd: 'svg/compressed',
                    src: ['*.svg'],
                    dest: "dist/svg/sprite/fallback"
                }],
                options: {}
            }
        },
        watch: {
            sass_dist: {
                files: ['sass/**/*.scss'],
                tasks: ['css'],
                options: {
                    nospawn: true
                }
            },
            ts: {
                files: ['js/**/*.ts'],
                tasks: ['js'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //SVG
    grunt.registerTask('svg', ['svgmin:svg']);
    grunt.registerTask('svg-sprite', ['svgmin:sprite', 'svgstore', 'grunticon', 'clean:svg_sprite']);

    //Sass & Css
    grunt.registerTask('css', ['sass', 'postcss', 'cssmin']);

    //JS
    grunt.registerTask('js', ['typescript', 'uglify']);


    grunt.registerTask('default', ['clean', 'css', 'svg', 'svg-sprite', 'js']);
};
