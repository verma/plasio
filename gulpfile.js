//gulp &  plugins
var gulp = require('gulp');

var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var nodemon = require('gulp-nodemon');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');
var awspublish = require('gulp-awspublish');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var react = require('gulp-react');

var through = require('through2');
var connect = require('connect');
var http = require('http');
var open = require('open');
var path = require('path');

var execFile = require('child_process').execFile;
var fs = require('fs');

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
gulp.task('build', ['css', 'less', 'bad-scripts', 'workers', 'lint', 'scripts', 'resources', 'html', 'docs']);
gulp.task('develop', ['build', 'serve', 'livereload']);
gulp.task('tdd', ['serve-specs', 'livereload-tests']);


/**
 * path globs / expressions for targets below
 */

var paths = {
    main	 : 'js/client.js',
    sources  : 'js/**/*.js',
    jsx      : 'js/**/*.jsx',
    specs    : 'test/spec/specs.js',
    badScripts: ['vendor/bluebird.js', 'vendor/laz-perf.js'],
    workers: 'workers/**',
    resources: 'resources/**',
    css      : 'less/**/*.css',
    less     : 'less/style.less',
    jade     : 'client/**/*.jade',
    html	 : '*.html',
    docs	 : 'docs/**/*',
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
    .pipe(jshint({
        "smarttabs": true
    }))
    .pipe(jshint.reporter('default'));
});

var startServer = function(path, cb) {
    var devApp, devServer, devAddress, devHost, url, log=gutil.log, colors=gutil.colors;
    devApp = connect();
    devApp.use(connect.logger('dev'));
    devApp.use(connect.static(path));
    devServer = http.createServer(devApp).listen(8000);
    devServer.on('error', function(error) {
        log(colors.underline(colors.red('ERROR'))+' Unable to start server!');
        cb(error);
    });

    devServer.on('listening', function() {
        devAddress = devServer.address();
        devHost = devAddress.address === '0.0.0.0' ? 'localhost' : devAddress.address;
        url = 'http://' + devHost + ':' + devAddress.port + '/' + 'index.html';

        log('');
        log('Started dev server at '+colors.magenta(url));
        open(url);
        cb();
    });
};

gulp.task('serve', ['build'], function(cb) {
    startServer('build', cb);
});

gulp.task('serve-specs', ['build-specs'], function(cb) {
    startServer('test', cb);
});

gulp.task('watch', ['build'], function() {
    // watch all our dirs and reload if any build stuff changes
    //
    gulp.watch(paths.sources, ['lint', 'scripts']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.docs, ['docs']);
    gulp.watch(paths.workers, ['workers']);
    gulp.watch(paths.resources, ['resources']);
});

gulp.task('livereload', ['watch'], function() {
    var server = livereload();
    return gulp.watch(path.join(paths.build, "/**/*"), function(evt) {
        server.changed(evt.path);
    });
});

gulp.task('livereload-tests', ['watch-specs'], function() {
    var server = livereload();

    return gulp.watch("test/build/**/*", function(evt) {
        server.changed(evt.path);
    });
});

gulp.task('bad-scripts', function() {
    return gulp.src(paths.badScripts)
    .pipe(concat("bad.js"))
    .pipe(gulp.dest(paths.build));
});

// build client side js app
gulp.task('build-specs', function(){
    return gulp.src([paths.specs])
    .pipe(browserify())
    .on("error", gutil.log)
    .on("error", gutil.beep)
    .pipe(gulp.dest("test/build"));
});


gulp.task('watch-specs', function() {
    gulp.watch([paths.sources, 'test/spec/**/*.js'], ['build-specs']);
});

// build client side js app
gulp.task('scripts', function(){
    return gulp.src([paths.main, paths.jsx])
    .pipe(browserify({
        debug: gulp.env.production,
        transform: ['reactify']
    }))
    .on("error", gutil.log)
    .on("error", gutil.beep)
    .pipe(gulp.dest(paths.build));
});

gulp.task('css', function() {
    return gulp.src(paths.css).
        pipe(concat('all.css')).
        pipe(gulp.dest(path.join(paths.build, 'css')));
});

gulp.task('less', function() {
    return gulp.src(paths.less).
        pipe(less({
        paths: ['./less/']
    })).
        pipe(gulp.dest(path.join(paths.build, 'css')));
});

gulp.task('html', function() {
    return gulp.src(paths.html).
        pipe(gulp.dest(paths.build));
});

gulp.task('clean', function() {
    return gulp.src(paths.build, { read: false })
    .pipe(clean());
});

gulp.task('optimize', ['build'], function(cb) {
    var input = path.join(paths.build, 'client.js');
    var tmp = path.join(paths.build, 'client.tmp.js');

    execFile('java', [
        '-jar', 'vendor/closure-compiler/compiler.jar',
        '--js', input,
        '--language_in', 'ECMASCRIPT5',
        '--compilation_level', 'SIMPLE_OPTIMIZATIONS',
        '--js_output_file', tmp],
        {maxBuffer: (1000*4096)},
        function(err, stdout, stderr) {
            if (err)
                return cb(err);

            fs.unlinkSync(input);
            fs.renameSync(tmp, input);

            cb();
        });
});

gulp.task('docs', function() {
    return gulp.src(paths.docs).
        pipe(gulp.dest(path.join(paths.build, 'docs')));
});

gulp.task('workers', function() {
    return gulp.src(paths.workers).
        pipe(gulp.dest(path.join(paths.build, 'workers')));
});

gulp.task('prod-build', ['build', 'optimize']);

gulp.task('publish', ['prod-build'], function() {
    var homeDir = process.env['HOME'];
    var settings = require(path.join(homeDir, ".aws.json"));

    settings.bucket = "plas.io";

    var publisher = awspublish.create(settings);

    return gulp.src(paths.build + "/**/*")
    .pipe(publisher.publish())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});

