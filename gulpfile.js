//gulp &  plugins
var gulp = require('gulp');

var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

/**
 * Tasks:
 *
 *  build (default):
 *    builds the client into ./dist
 *
 *  develop:
 *    builds client, and runs auto reloading dev server
 *
 *  lint:
 *    lint all javascript sourcefiles
 *
 *  test:
 *    run mocha tests in ./test/
 *
 *  debug:
 *    like develop but also runs tests and linting
 */
 
gulp.task('default', ['build']);
gulp.task('build', ['css', 'less', 'bad-scripts', 'scripts', 'resources', 'html']);
 
 
/**
 * path globs / expressions for targets below
 */
 
var paths = {
	main	 : 'js/client.js',
	badScripts: ['vendor/bluebird.js'],
	resources: 'resources/**',
	css      : 'less/**/*.css',
	less     : 'less/style.less',
	jade     : 'client/**/*.jade',
	assets   : ['client/**/*', '!**/*.js', '!**/*.styl', '!**/*.jade'],
	html	 : ['index.html'],
	build    : './build/'
};
 
 
//clean build directory
gulp.task('clean', function(){
	return gulp.src(paths.client.build, {read: false} )
	.pipe(clean());
});

gulp.task('resources', function() {
	return gulp.src(paths.resources)
	.pipe(gulp.dest(paths.build));
});
 
// lint all of our js source files
gulp.task('lint', function (){
  return gulp.src(paths.sources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('bad-scripts', function() {
	return gulp.src(paths.badScripts)
		.pipe(concat("bad.js"))
		.pipe(gulp.dest(paths.build));
});
 
// build client side js app
gulp.task('scripts', function(){
	return gulp.src(paths.main)
		.pipe(browserify({
			debug: gulp.env.production
		}))
		.pipe(gulp.dest(paths.build))
});

gulp.task('css', function() {
	return gulp.src(paths.css).
		pipe(concat('all.css')).
		pipe(gulp.dest(paths.build));
});

gulp.task('less', function() {
	return gulp.src(paths.less).
		pipe(less({
			paths: ['./less/']
		})).
		pipe(gulp.dest(paths.build))
});

gulp.task('html', function() {
	return gulp.src(paths.html).
		pipe(gulp.dest(paths.build));
});
 
