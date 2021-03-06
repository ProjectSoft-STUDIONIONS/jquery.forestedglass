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
					' * jQuery.forestedGlass v<%= pkg.version %>: The effect of frosted glass \n'+
					' * \n'+
					' * Copyright 2018 @ProjectSoft<projectsoft2009@yandex.ru> \n'+
					' * Licensed under the MIT license. \n'+
					' * \n'+
					' */\n'
		},
		realFavicon: {
			favicons: {
				src: 'src/notify.png',
				dest: "docs/",
				options: {
					iconsPath: '/<%= pkg.name%>',
					html: [ 'src/html/inc/html_code/favicon.html' ],
					design: {
						ios: {
							pictureAspect: 'backgroundAndMargin',
							backgroundColor: '#ffffff',
							margin: '14%',
							assets: {
								ios6AndPriorIcons: true,
								ios7AndLaterIcons: true,
								precomposedIcons: true,
								declareOnlyDefaultIcon: true
							},
							appName: "<%= pkg.name%>"
						},
						desktopBrowser: {},
						windows: {
							pictureAspect: 'noChange',
							backgroundColor: '#ffffff',
							onConflict: 'override',
							assets: {
								windows80Ie10Tile: true,
								windows10Ie11EdgeTiles: {
									small: true,
									medium: true,
									big: true,
									rectangle: true
								}
							},
							appName: "<%= pkg.name%>"
						},
						androidChrome: {
							pictureAspect: 'backgroundAndMargin',
							margin: '17%',
							backgroundColor: '#ffffff',
							themeColor: '#ffffff',
							manifest: {
								name: "<%= pkg.name%>",
								display: 'standalone',
								orientation: 'notSet',
								onConflict: 'override',
								declared: true
							},
							assets: {
								legacyIcon: true,
								lowResolutionIcons: true
							}
						},
						safariPinnedTab: {
							pictureAspect: 'silhouette',
							themeColor: '#5bbad5'
						}
					},
					settings: {
						scalingAlgorithm: 'Mitchell',
						errorOnImageTooSmall: false
					}
				}
			}
		},
		copy: {
			all: {
				files: [
					{
						src: 'src/js/jquery.forestedglass.js',
						dest: 'dist/jquery.forestedglass.js'
					},
					{
						src: 'dist/jquery.forestedglass.js',
						dest: 'docs/js/jquery.forestedglass.js'
					},
					{
						src: 'dist/jquery.forestedglass.min.js',
						dest: 'docs/js/jquery.forestedglass.min.js'
					},
					{
						src: 'dist/jquery.forestedglass.min.js.map',
						dest: 'docs/js/jquery.forestedglass.min.js.map'
					},
					{
						src: 'bower_components/jquery/dist/jquery.js',
						dest: 'docs/js/jquery.js'
					},
					{
						src: 'bower_components/jquery.highlight/jquery.highlight.js',
						dest: 'docs/js/jquery.highlight.js'
					},
					{
						src: 'bower_components/jquery.highlight/jquery.highlight.css',
						dest: 'docs/css/jquery.highlight.css'
					},
					{
						src: 'bower_components/normalize-css/normalize.css',
						dest: 'docs/css/normalize.css'
					},
					{
						src: 'src/js/main.js',
						dest: 'docs/js/main.js'
					}
				]
			},
		},
		clean: {
			folder: [
				'dist/',
				//'src/html/inc/html_code/',
				'src/html/inc/include_code/'
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
					src: [
						'dist/jquery.forestedglass.js',
						'docs/js/jquery.forestedglass.js'
					]
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
					'docs/css/main.css' : [
						'test/css/main.css'
					],
					'docs/css/style.css' : [
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
					"docs/index.html": ['src/html/index.pug']
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
						dest: 'docs/images/',
						filter: 'isFile'
					}
				]
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			compile: {
				files: [
					'src/css/**/*.{css,less}',
					'src/js/**/*.js',
					'src/html/**/*.pug'
				],
				tasks: [
					'notify:watch',
					'clean',
					'less',
					'autoprefixer',
					'jshint',
					'uglify',
					'newer:imagemin',
					'pug:temp',
					'replace',
					'pug:files',
					'copy',
					'usebanner',
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
	},
	tasksDef = [
		'notify:watch',
		'clean',
		'less',
		'autoprefixer',
		'jshint',
		'uglify',
		//'imagemin',
		'realFavicon',
		'pug:temp',
		'replace',
		'pug:files',
		'copy',
		'usebanner',
		'notify:done'
	];
	
	grunt.initConfig(tasksConfig);
	
    grunt.registerTask('dev',		[ 'jshint', 'watch']);
	grunt.registerTask('default',	tasksDef);
}