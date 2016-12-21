const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    lazy: true,
    camelize: true
});
const vinylBuffer = require('vinyl-buffer');
const vinylSourceStream = require('vinyl-source-stream');
const yargs = require('yargs').argv;

const serverConfig = require('./src/backend/module/serverConfig.js');

gulp.task('help', $.taskListing);

gulp.task('removePublic', function() {
    let dir = './public';
    log('cleaning: ' + $.util.colors.blue(dir));
    return del.sync(dir);
});

gulp.task('removeBuild', function() {
    let dir = './build';
    log('cleaning: ' + $.util.colors.blue(dir));
    return del.sync(dir);
});

gulp.task('removeTemp', function() {
    let dir = './temp';
    log('cleaning: ' + $.util.colors.blue(dir));
    return del.sync(dir);
});

gulp.task('cleanUp', ['removePublic', 'removeBuild', 'removeTemp'], function() {
    return;
});

gulp.task('lint', function() {
    log('code analysation with Eslint and JSCS');
    fileList = [
        './src/**/*.js',
        './*.js'
    ];
    return gulp
        .src(fileList)
        .pipe($.if(yargs.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jscsStylish())
        .pipe($.jscs.reporter('fail'))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

gulp.task('transpile', function() {
    log('transpile frontend javascript');
    let entryScript = './src/frontend/js/entry.js';
    let destDir = './public/js';
    return browserify(entryScript, {
            debug: true
    })
        .transform(babelify, {
            presets: ['es2015'],
            sourceMaps: true
        })
        .bundle()
        .pipe(vinylSourceStream('bundle.js'))
        .pipe(vinylBuffer())
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(destDir));
});

gulp.task('staticHtml', function() {
    log('processing static HTML files');
    let destDir = './public';
    return gulp.src('./src/frontend/*.html').pipe(gulp.dest(destDir));
});

gulp.task('staticView', function() {
    log('processing static HTML files');
    let destDir = './public/view';
    return gulp.src('./src/frontend/view/**/*.html').pipe(gulp.dest(destDir));
});

gulp.task('staticCss', function() {
    log('processing static CSS files');
    let destDir = './public/css';
    return gulp.src('./src/frontend/css/*.css').pipe(gulp.dest(destDir));
});

gulp.task('favicon', function() {
    log('processing the favicon');
    let destDir = './public';
    return gulp.src('./src/frontend/*.png').pipe(gulp.dest(destDir));
});

gulp.task('staticFrontendFiles', ['staticCss', 'staticView', 'staticHtml', 'favicon'], function() {
    return;
});

gulp.task('startWatcher', ['staticFrontendFiles', 'transpile'], function() {
    let watchList = {
        frontendFileList: ['./src/frontend/**/*.js'],
        staticFrontendFileList: ['./src/frontend/**/*.html', './src/frontend/**/*.css']
    };
    gulp.watch(watchList.frontendFileList, ['transpile']);
    gulp.watch(watchList.staticFrontendFileList, ['staticFrontendFiles']);
});

gulp.task('buildBackend', function() {
    log('building backend server files...');
    return gulp
        .src('./src/backend/**/*.js')
        .pipe(gulp.dest('./build'));
});

gulp.task('startServer', ['cleanUp', 'buildBackend', 'startWatcher'], function() {
    let nodemonOption = {
        script: './build/server.js',
        delayTime: 1,
        env: {
            'PORT': serverConfig.serverPort,
            'NODE_ENV': serverConfig.development ? 'development' : 'production'
        },
        verbose: false,
        watch: ['./src/backend'],
        tasks: ['removeBuild', 'buildBackend']
    };
    return $.nodemon(nodemonOption)
        .on('start', function() {
            log('*** server started on: ' + serverConfig.serverUrl);
            startBrowserSync();
        })
        .on('restart', function(event) {
            log('*** server restarted and operating on: ' + serverConfig.serverUrl);
            log('files triggered the restart:\n' + event);
            setTimeout(function() {
                browserSync.notify('伺服器重新啟動，頁面即將同步重置...');
                browserSync.reload({
                    stream: false
                });
            }, 5000);
        })
        .on('crash', function() {
            log('*** server had crashed...');
        })
        .on('shutdown', function() {
            log('*** server had been shutdown...');
        });
});

function startBrowserSync() {
    if (browserSync.active) {
        return;
    }
    let option = {
        proxy: 'http://localhost:' + serverConfig.serverPort + '/productionHistory/isProdDataForm/index.html?formReference=isProdData',
        port: 9999,
        files: ['./src/frontend/**/*.*'],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-output',
        notify: true,
        reloadDelay: 1000
    };
    browserSync(option);
    log('start browserSync on port: ' + serverConfig.serverPort);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
