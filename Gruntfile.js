/**
 * Created by migue on 24/08/15.
 */

module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    cleancss: true
                },
                files: {
                    "css/main.css": "less/main.less" // destination file and source file
                }
            },
            web: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    cleancss: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'less/web',
                        src: ['**/*.less'],
                        dest: 'css/web',
                        ext: '.css'
                    }
                ]
            }
        },
        webfont: {
            icons: {
                src: 'svg/*.svg',
                dest: 'build/fonts',
                autoHint: false,
                options: {}
            }
        },

        clean: ['svg/compressed', 'build'], //removes old data

        svgmin: { //minimize SVG files
            options: {
                plugins: [
                    {removeViewBox: false},
                    {removeUselessStrokeAndFill: false}
                ]
            },
            dist: {
                expand: true,
                cwd: 'svg',
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
            default: {
                files: {
                    'build/icons/icons.svg': ['svg/compressed/*.svg']
                }
            }
        },


        grunticon: {
            myIcons: {
                files: [{
                    expand: true,
                    cwd: 'svg/compressed',
                    src: ['*.svg', '*.png'],
                    dest: "build/icons/fallback"
                }],
                options: {}
            }
        },
        watch: {
            styles: {
                files: ['less/**/*.less'], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-svgstore');

    grunt.registerTask('default', ['clean', 'less', 'webfont', 'svgmin', 'svgstore', 'grunticon']);
};
