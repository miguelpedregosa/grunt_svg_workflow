/**
 * Created by migue on 24/08/15.
 */

module.exports = function (grunt) {
    require('jit-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ["dist"],
            svg_sprite: ["svg/compressed"]
        },

        sass: {
            dist: {
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

            dist: {
                src: 'dist/css/**/*.css',
                processors: [
                    require('pixrem')(),
                    require('autoprefixer')({browsers: 'last 2 versions'})
                ]
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

        svgmin: { //minimize SVG files
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
                prefix: 'icon-' // This will prefix each <g> ID
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
                files: ['sass/*.scss'],
                tasks: ['sass:dist'],
                options: {
                    nospawn: true
                }
            },
            sass_sections: {
                files: ['sass/sections/**/*.scss'],
                tasks: ['sass:sections'],
                options: {
                    nospawn: true
                }
            },
            ts: {
                files: ['js/**/*.ts'],
                tasks: ['typescript'],
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

    //SVG
    grunt.registerTask('svg', ['svgmin:svg']);
    grunt.registerTask('svg-sprite', ['svgmin:sprite', 'svgstore', 'grunticon', 'clean:svg_sprite']);

    //Sass & Css
    grunt.registerTask('css', ['sass']);

    grunt.registerTask('default', ['clean', 'sass', 'svg', 'svg-sprite', 'typescript']);
};
