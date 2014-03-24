module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-complexity');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				commitFiles: ['-a'],
				commitMessage: 'release %VERSION%',
				tagMessage: 'version %VERSION%',
				pushTo: 'origin'
			}
		},
		karma: {
			lib: {
				configFile: 'karma.conf.js',
			}
		},
		jshint: {
			lib: {
				src: ['index.js', 'specs/*.js']
			}
		},
		complexity: {
			lib: {
				src: ['index.js', 'specs/*.js']
			}
		},
		uglify: {
			lib: {
				options: {
					report: 'min',
					wrap: 'reactive'
				},
				src: 'index.js',
				dest: 'reactive.min.js'
			}
		}
	});

	grunt.registerTask('default', ['karma', 'jshint', 'complexity', 'uglify']);
};