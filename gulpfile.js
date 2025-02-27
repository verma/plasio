//gulp &  plugins
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');
var awspublish = require('gulp-awspublish');
var htmlreplace = require('gulp-html-replace');
var react = require('gulp-react');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var connect = require('connect');
var http = require('http');
var open = require('open');
var path = require('path');
var logger = require('morgan');
var serveStatic = require('serve-static');

var execFile = require('child_process').execFile;
var fs = require('fs');

/**
 * path globs / expressions for targets below
 */
var paths = {
    main     : 'js/client.js',
    sources  : 'js/**/*.js',
    jsx      : 'js/**/*.jsx',
    specs    : 'test/spec/specs.js',
    badScripts: ['vendor/bluebird.js', 'vendor/laz-perf.js'],
    workers  : 'workers/**',
    resources: 'resources/**',
    css      : 'less/**/*.css',
    less     : 'less/style.less',
    jade     : 'client/**/*.jade',
    html     : '*.html',
    docs     : 'docs/**/*',
    build    : './build/'
};

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

// 错误处理函数
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

// 服务器启动函数
function startServer(path, cb) {
    var devApp, devServer, devAddress, devHost, url, log=gutil.log, colors=gutil.colors;
    devApp = connect();
    devApp.use(logger('dev'));
    devApp.use(serveStatic(path));
    devServer = http.createServer(devApp).listen(8000);
    
    devServer.on('error', function(error) {
        log(colors.underline(colors.red('ERROR'))+' Unable to start server!');
        cb(error);
    });

    devServer.on('listening', function() {
        devAddress = devServer.address();
        devHost = devAddress.address === '0.0.0.0' ? 'localhost' : devAddress.address;
        url = 'http://' + devHost + ':' + devAddress.port + '/index.html';

        log('');
        log('Started dev server at '+colors.magenta(url));
        open(url);
        cb();
    });
}

// 清理构建目录
gulp.task('clean', function() {
    return gulp.src(paths.build, { read: false, allowEmpty: true })
        .pipe(clean());
});

// 复制资源文件
gulp.task('resources', function() {
    return gulp.src(paths.resources)
        .pipe(gulp.dest(paths.build));
});

// JS 代码检查
gulp.task('lint', function() {
    return gulp.src(paths.sources)
        .pipe(jshint({
            "smarttabs": true,
            "linter": require("jshint-jsx").JSXHINT
        }))
        .pipe(jshint.reporter('default'));
});

// 编译 CSS
gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(concat('all.css'))
        .pipe(gulp.dest(path.join(paths.build, 'css')));
});

// 编译 LESS
gulp.task('less', function() {
    return gulp.src(paths.less)
        .pipe(less({
            paths: ['./less/']
        }))
        .pipe(gulp.dest(path.join(paths.build, 'css')));
});

// 复制 HTML 文件
gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.build));
});

// 复制文档
gulp.task('docs', function() {
    return gulp.src(paths.docs)
        .pipe(gulp.dest(path.join(paths.build, 'docs')));
});

// 复制 workers
gulp.task('workers', function() {
    return gulp.src(paths.workers)
        .pipe(gulp.dest(path.join(paths.build, 'workers')));
});

// 处理不好的脚本
gulp.task('bad-scripts', function() {
    return gulp.src(paths.badScripts)
        .pipe(concat("bad.js"))
        .pipe(gulp.dest(paths.build));
});

// 构建客户端 JS
gulp.task('scripts', function() {
    return browserify({
        entries: [paths.main],
        debug: process.env.NODE_ENV !== 'production',
        transform: ['reactify']
    })
    .bundle()
    .on('error', handleError)
    .pipe(source('client.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.build));
});

// 构建测试
gulp.task('build-specs', function() {
    return browserify({
        entries: [paths.specs],
        debug: true
    })
    .bundle()
    .on('error', handleError)
    .pipe(source('specs.js'))
    .pipe(buffer())
    .pipe(gulp.dest("test/build"));
});

// 优化 JS
gulp.task('optimize', function(cb) {
    var input = path.join(paths.build, 'client.js');
    var tmp = path.join(paths.build, 'client.tmp.js');

    execFile('java', [
        '-jar', 'vendor/closure-compiler/compiler.jar',
        '--js', input,
        '--language_in', 'ECMASCRIPT5',
        '--compilation_level', 'SIMPLE_OPTIMIZATIONS',
        '--js_output_file', tmp
    ], {
        maxBuffer: (1000 * 4096)
    }, function(err, stdout, stderr) {
        if (err) return cb(err);
        fs.unlinkSync(input);
        fs.renameSync(tmp, input);
        cb();
    });
});

// 服务器任务
gulp.task('serve', function(cb) {
    startServer('build', cb);
});

// 测试服务器任务
gulp.task('serve-specs', gulp.series('build-specs', function(cb) {
    startServer('test', cb);
}));

// 监视任务
gulp.task('watch', function() {
    gulp.watch(paths.sources, gulp.parallel('lint', 'scripts'));
    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.less, gulp.series('less'));
    gulp.watch(paths.docs, gulp.series('docs'));
    gulp.watch(paths.workers, gulp.series('workers'));
    gulp.watch(paths.resources, gulp.series('resources'));
});

// 监视测试文件
gulp.task('watch-specs', function() {
    gulp.watch([paths.sources, 'test/spec/**/*.js'], gulp.series('build-specs'));
});

// LiveReload 任务
gulp.task('livereload', function(done) {
    livereload.listen();
    done();
});

// 测试 LiveReload 任务
gulp.task('livereload-tests', function(done) {
    livereload.listen();
    done();
});

// 构建任务
gulp.task('build', 
    gulp.parallel(
        'css',
        'less',
        'bad-scripts',
        'workers',
        'lint',
        'scripts',
        'resources',
        'html',
        'docs'
    )
);

// 生产构建任务
gulp.task('prod-build', gulp.series('build', 'optimize'));

// 发布任务
gulp.task('publish', gulp.series('prod-build', function() {
    var homeDir = process.env['HOME'] || process.env.USERPROFILE;
    var settings = require(path.join(homeDir, ".aws.json"));

    settings.bucket = "plas.io";
    
    if (!settings.apiVersion) {
        settings.apiVersion = '2006-03-01';
    }

    var publisher = awspublish.create(settings);

    return gulp.src(paths.build + "/**/*")
        .pipe(publisher.publish())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter());
}));

// 主要任务
gulp.task('default', gulp.series('build'));
gulp.task('develop', gulp.series('build', gulp.parallel('serve', 'watch', 'livereload')));
gulp.task('tdd', gulp.series('serve-specs', 'watch-specs', 'livereload-tests'));

