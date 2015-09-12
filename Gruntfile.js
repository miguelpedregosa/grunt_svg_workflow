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

            main_dist: {
                src: 'dist/css/*_ltr.css',
                options: {
                    processors: [
                        require('pixrem')(),
                        require('autoprefixer')({browsers: 'last 3 versions'})
                    ]
                }
            },
            main_rtl: {
                options: {
                    processors: [
                        require('rtlcss')()
                    ]
                },

                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*_ltr.css'],
                    dest: 'dist/css/',
                    rename: function (dest, matchedSrcPath) {
                        return path.join(dest, matchedSrcPath.replace('_ltr', '_rtl'));
                    }
                }]
            },
            main_nano: {
                options: {
                    processors: [
                        require('cssnano')()
                    ]
                },

                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    dest: 'dist/css',
                    src: ['*.css'],
                    ext: '.min.css'
                }]
            },
            sections_dist: {
                src: 'dist/css/sections/**/*_ltr.css',
                options: {
                    processors: [
                        require('pixrem')(),
                        require('autoprefixer')({browsers: 'last 3 versions'})
                    ]
                }
            },
            sections_rtl: {
                options: {
                    processors: [
                        require('rtlcss')()
                    ]
                },

                files: [{
                    expand: true,
                    cwd: 'dist/css/sections',
                    src: ['**/*_ltr.css'],
                    dest: 'dist/css/sections',
                    rename: function (dest, matchedSrcPath) {
                        return path.join(dest, matchedSrcPath.replace('_ltr', '_rtl'));
                    }
                }]
            },
            sections_nano: {
                options: {
                    processors: [
                        require('cssnano')()
                    ]
                },

                files: [{
                    expand: true,
                    cwd: 'dist/css/sections',
                    dest: 'dist/css/sections',
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
                includedemo: true,
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
            sass_main: {
                files: ['sass/*.scss'],
                tasks: ['css-main'],
                options: {
                    nospawn: true
                }
            },
            sass_sections: {
                files: ['sass/sections/**/*.scss'],
                tasks: ['css-sections'],
                options: {
                    nospawn: true
                }
            },
            sass_bootstrap: {
                files: ['sass/bootstrap/**/*.scss'],
                tasks: ['css-sections'],
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

    //SVG
    grunt.registerTask('svg', ['svgmin:svg']);
    grunt.registerTask('svg-sprite', ['svgmin:sprite', 'svgstore', 'grunticon', 'clean:svg_sprite']);

    //Sass & Css
    grunt.registerTask('postcss-main', ['postcss:main_dist', 'postcss:main_rtl', 'postcss:main_nano']);
    grunt.registerTask('postcss-sections', ['postcss:sections_dist', 'postcss:sections_rtl', 'postcss:sections_nano']);

    grunt.registerTask('css-main', ['sass:main', 'postcss-main']);
    grunt.registerTask('css-sections', ['sass:sections', 'postcss-sections']);
    grunt.registerTask('css', ['css-main', 'css-sections']);

    //JS
    grunt.registerTask('js', ['typescript', 'uglify']);


    grunt.registerTask('default', ['clean', 'css', 'svg', 'svg-sprite', 'js']);
};
