module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      sass: {
        files: ['public/styles/**/*.scss'],
        tasks: ['sass:dev']
      },
      express: {
        files: ['*.js', 'models/**.js', 'controllers/**.js'],
        tasks: [ 'express:dev' ],
        options: {
          nospawn: true
        }
      }
    },
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: 'public/styles/sass',
          src: ['*.scss'],
          dest: 'public/styles',
          ext: '.css'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/styles',
          src: ['**.scss'],
          dest: 'dist/styles',
          ext: '.css'
        }]
      }
    },
    express: {
      dev: {
        options: {
          script: 'server.js',
          port: 3000
        }
      }
    },
    mochaTest: {
      test: {
        src: ['test/**.js']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('test', 'mochaTest')

  grunt.registerTask('server', [
    'sass:dev',
    'express:dev',
    'watch'
  ]);
};
