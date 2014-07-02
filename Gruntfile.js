/*global require, module*/
'use strict';

module.exports = function(grunt) {

  // Show elapsed time after tasks run
  require('time-grunt')(grunt);
  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dir: {
      app: 'app',
      build: 'build',
      temp: '.tmp'
    },
    vendor: {
        jquery: '<%= dir.app %>/jquery.js',
        modernizr: '<%= dir.app %>/modernizr.js',
        normalize: '<%= dir.app %>/normalize.css'
    },

    watch: {
      // WATCH THE SASS FILES FOR CHANGES AND COMPILE WITH COMPASS
      // compass: {
      //   files: ['<%= dir.app %>/_scss/**/*.{scss,sass}'],
      //   tasks: ['compass:dev'] //compass:server
      // },
      sass: {
        files: ['<%= dir.app %>/_scss/**/*.scss'],
        tasks: ['sass:dev']
      },
      autoprefixer: {
        files: ['<%= dir.app %>/css/**/*.css'],
        tasks: ['copy:stageCss', 'autoprefixer:server']
      },
      jekyll: {
        files: [
          '<%= dir.app %>/**/*.{html,yml,md,mkd,markdown}',
          '!<%= dir.app %>/_bower_components/**/*'
        ],
        tasks: ['jekyll:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.jekyll/**/*.html',
          '.tmp/css/**/*.css',
          '{.tmp,<%= dir.app %>}/js/**/*.js',
          '<%= dir.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
        ]
      }
    },

    bowerInstall: {
      target: {
        src: '<%= dir.app %>/index.html' // point to your HTML file.
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: false,
          base: [
            '.tmp',
            '.jekyll',
            '<%= dir.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: [
            '<%= dir.build %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            '.tmp',
            '.jekyll',
            'test',
            '<%= dir.app %>'
          ]
        }
      }
    },

    clean: {
      build: {
        files: [{
          dot: true,
          src: [
            '<%= dir.build %>/*',
            // Running Jekyll also cleans the target directory.  Exclude any
            // non-standard `keep_files` here (e.g., the generated files
            // directory from Jekyll Picture Tag).
            '!<%= dir.build %>/.git*'
          ]
        }]
      },
      server: [
        '.tmp',
        '.jekyll'
      ]
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= dir.build %>/css',
          src: '**/*.css',
          dest: '<%= dir.build %>/css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '.tmp/css',
          src: '**/*.css',
          dest: '.tmp/css'
        }]
      }
    },

    /**
     * Jekyll build and config
     *
     * @type server = development
     * @type dist = production
     * @type check = validation
     */
    jekyll: {
      options: {
        bundleExec: true,
        src: '<%= dir.app %>',
      },
      dist: {
        options: {
          config: '_config.yml,_config.build.yml',
          dest: '<%= dir.build %>'
        }
      },
      server: {
        options: {
          config: '_config.yml,_config.dev.yml',
          drafts: true,
          dest: '.jekyll'
        }
      },
      check: {
        options: {
          doctor: true
        }
      }
    },

    /**
     * Compass pre-compiling (no concat)
     *
     * @type dev = development [default]
     * @type prod = production build
     */
    // compass: {
    //   options: {
    //     bundleExec: true,
    //     // basePath: '<%= dir.app %>',
    //     require: ['normalize-scss', 'susy'],
    //     sassDir: ['<%= dir.app %>/_scss'],
    //     cssDir: ['.tmp/css'],
    //     imagesDir: '<%= dir.app %>/img',
    //     javascriptsDir: '<%= dir.app %>/js',
    //     relativeAssets: false,
    //     httpImagesPath: '/img',
    //     httpGeneratedImagesPath: '/img/generated'
    //   },
    //   dev: {
    //     options: {
    //       environment: 'development',
    //       outputStyle: 'expanded',
    //       force: true,
    //       debugInfo: true,
    //       generatedImagesDir: '.tmp/img/generated'
    //     }
    //   },
    //   prod: {
    //     options: {
    //       environment: 'production',
    //       outputStyle: 'compressed',
    //       generatedImagesDir: '<%= dir.build %>/img/generated'
    //     }
    //   }
    // },

    sass: {
      options: {
        bundleExec: true,
        require: ['bourbon', 'neat'],
      },
      dev: {
        files: {
          '.tmp/css/base.css': '<%= dir.app %>/_scss/base.scss'
        },
        environment: 'development',
        style: 'expanded',
        // debugInfo: true,
        check: true,
        options: {
          trace: true
        }
      },
      // prod: {
      //   options: {
      //     environment: 'production',
      //     style: 'compressed'
      //   }
      // },
      // check: {
      //   options: {
      //     style: 'expanded',
      //     debugInfo: true,
      //     check: true,
      //     trace: true
      //   }
      // }
    },

    useminPrepare: {
      options: {
        dest: '<%= dir.build %>'
      },
      html: '<%= dir.build %>/index.html'
    },
    usemin: {
      options: {
        assetsDirs: '<%= dir.build %>',
      },
      html: ['<%= dir.build %>/**/*.html'],
      css: ['<%= dir.build %>/css/**/*.css']
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true
        },
        files: [{
          expand: true,
          cwd: '<%= dir.build %>',
          src: '**/*.html',
          dest: '<%= dir.build %>'
        }]
      }
    },
    // Usemin adds files to concat
    concat: {},
    // Usemin adds files to uglify
    uglify: {},
    // Usemin adds files to cssmin
    cssmin: {
      dist: {
        options: {
          check: 'gzip'
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= dir.build %>',
          src: '**/*.{jpg,jpeg,png}',
          dest: '<%= dir.build %>'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= dir.build %>',
          src: '**/*.svg',
          dest: '<%= dir.build %>'
        }]
      }
    },

    /**
     * Copy files to dest.
     *
     * @type css = compass -> minify -> copy
     * @type js = minify/concat -> copy
     */
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= dir.app %>',
          src: [
            // Jekyll processes and moves HTML and text files.
            // Usemin moves CSS and javascript inside of Usemin blocks.
            // Copy moves asset files and directories.
            'img/**/*',
            'fonts/**/*',
            // Like Jekyll, exclude files & folders prefixed with an underscore.
            '!**/_*{,/**}',
            // Explicitly add any files your site needs for distribution here.
            // '_bower_components/jquery/jquery.js',
            // '_bower_components/modernizr/modernizr.js',
            'favicon.ico',
            'apple-touch*.png'
          ],
          dest: '<%= dir.build %>'
        }]
      },
      // Copy CSS into .tmp directory for Autoprefixer processing
      stageCss: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= dir.app %>/css',
          src: '**/*.css',
          dest: '.tmp/css'
        }]
      }
    },

    filerev: {
      options: {
        length: 4
      },
      dist: {
        files: [{
          src: [
            '<%= dir.build %>/js/**/*.js',
            '<%= dir.build %>/css/**/*.css',
            '<%= dir.build %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}',
            '<%= dir.build %>/fonts/**/*.{eot*,otf,svg,ttf,woff}'
          ]
        }]
      }
    },

    buildcontrol: {
      deploy: {
        options: {
          dir: 'build',
          remote: 'git@github.com:mistermark/mistermark.github.com.git',
          branch: 'master',
          commit: true,
          push: true
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= dir.app %>/js/**/*.js',
        'test/spec/**/*.js'
      ]
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      check: {
        src: [
          '.tmp/css/**/*.css',
          '!<%= dir.app %>/_scss/**/*.scss'
        ]
      }
    },

    concurrent: {
      server: [
        'sass:dev',
        'copy:stageCss',
        'jekyll:server'
      ],
      dist: [
        'sass:prod',
        'copy:dist'
      ]
    }

  });

  grunt.registerTask('serve', function (target) {
    if (target === 'build') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  // No real tests yet.
  grunt.registerTask('test', [
  //   'clean:server',
  //   'concurrent:test',
  //   'connect:test'
  ]);

  grunt.registerTask('check', [
    'clean:server',
    'jekyll:check',
    'sass:dev',
    'jshint:all',
    // 'csslint:check'
  ]);

  grunt.registerTask('build', [
    'clean',
    // Jekyll cleans files from the target directory, so must run first
    'jekyll:dist',
    'concurrent:dist',
    'useminPrepare',
    'concat',
    'autoprefixer:dist',
    'cssmin',
    'uglify',
    'imagemin',
    'svgmin',
    'filerev',
    'usemin',
    'htmlmin'
    ]);

  grunt.registerTask('deploy', [
    'check',
    'test',
    'build',
    'buildcontrol'
    ]);

  grunt.registerTask('default', [
    'check',
    'test',
    'build'
  ]);

};
