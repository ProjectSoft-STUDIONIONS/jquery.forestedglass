module.exports = function(grunt){
	var _ = require('chalk');
	var entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#x2F;',
		'`': '&#x60;',
		'=': '&#x3D;'
	};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	var tasksConfig = {
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			banner: '/**\n' +
					' * jQuery.forestedGlass: The effect of frosted glass \n'+
					' * \n'+
					' * Copyright 2018 @ProjectSoft<projectsoft2009@yandex.ru> \n'+
					' * Licensed under the MIT license. \n'+
					' * \n'+
					' */\n'
		},
		copy: {
			all: {
				files: [
					{
						src: 'src/js/jquery.forestedglass.js',
						dest: 'dist/jquery.forestedglass.js'
					},
					{
						src: 'bower_components/jquery/dist/jquery.js',
						dest: 'demo/js/jquery.js'
					},
					{
						src: 'bower_components/jquery.highlight/jquery.highlight.js',
						dest: 'demo/js/jquery.highlight.js'
					},
					{
						src: 'bower_components/jquery.highlight/jquery.highlight.css',
						dest: 'demo/css/jquery.highlight.css'
					},
					{
						src: 'bower_components/normalize-css/normalize.css',
						dest: 'demo/css/normalize.css'
					},
					{
						src: 'src/js/main.js',
						dest: 'demo/js/main.js'
					}
				]
			},
		},
		clean: {
			folder: [
				'dist/',
				'demo/'
			]
		},
		usebanner: {
			taskName: {
				options: {
					position: 'top',
					banner: '<%= meta.banner %>',
					linebreak: true
				},
				files: {
					src: ['dist/jquery.forestedglass.js']
				}
			}
		},
		uglify: {
			compile: {
				options: {
					sourceMap: true,
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/jquery.forestedglass.min.js': 'src/js/jquery.forestedglass.js'
				}
			}
		},
		jshint: {
            src: [
                'src/js/jquery.forestedglass.js',
				'src/js/main.js'
            ],
        },
		less: {
			demo: {
				files : {
					'test/css/main.css' : [
						'src/css/main.less'
					],
					'test/css/style.css' : [
						'src/css/style.less'
					]
				},
				options : {
					compress: false,
					ieCompat: false
				}
			}
		},
		autoprefixer:{
			options: {
				browsers: ['last 2 versions', 'Android 4', 'ie 8', 'ie 9', 'Firefox >= 27', 'Opera >= 12.0', 'Safari >= 6'],
				cascade: true
			},
			css: {
				files: {
					'demo/css/main.css' : [
						'test/css/main.css'
					],
					'demo/css/style.css' : [
						'test/css/style.css'
					]
				}
			},
		},
		replace: {
			code: {
				src: ['src/html/inc/html_code/*.html'],
				dest: 'src/html/inc/include_code/',
				replacements: [{
					from: /[&<>"'`=\/]/g,
					to: function(string){
						return entityMap[string];
					}
				}]
			}
		},
		pug: {
			temp: {
				options: {
					pretty: '\t',
					separator: '\n',
					data: {
						debug: true
					}
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/html/inc/code/*.pug'
						],
						ext: '.html',
						dest: 'src/html/inc/html_code/',
						filter: 'isFile'
					}
				]
			},
			files: {
				options: {
					pretty: '\t',
					separator: '\n',
					data: {
						debug: true
					}
				},
				files: {
					"demo/index.html": ['src/html/index.pug']
				}
			}
		},
		imagemin: {
			compile: {
				options: {
					optimizationLevel: 7,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/images/*.{png,jpg,gif,svg}'
						],
						dest: 'demo/images/',
						filter: 'isFile'
					}
				]
			}
		},
		delta: {
			options: {
				livereload: true,
			},
			compile: {
				files: [
					'src/css/**/*.{css,less}',
					'src/js/**/*.js',
					'src/html/**/*.*'
				],
				tasks: [
					'notify:watch',
					'clean',
					'copy',
					'less',
					'autoprefixer',
					'jshint',
					'uglify',
					'usebanner',
					'imagemin',
					'pug:temp',
					'replace',
					'pug:files',
					'notify:done'
				]
			}
		},
		notify: {
			watch: {
				options: {
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: 'Запуск',
					image: __dirname+'\\src\\notify.png'
				}
			},
			done: {
				options: {
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: "Успешно Завершено",
					image: __dirname+'\\src\\notify.png'
				}
			}
		}
	};
	
	grunt.initConfig(tasksConfig);
	
	grunt.renameTask('watch',		'delta');
    grunt.registerTask('dev',		[ 'jshint', 'delta']);
	grunt.registerTask('default',	['notify:watch', 'clean', 'copy', 'less', 'autoprefixer', 'jshint', 'uglify', 'usebanner', 'imagemin', 'pug:temp', 'replace', 'pug:files', 'notify:done']);
}