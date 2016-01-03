var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        //pattern: ['gulp-*', 'gulp.*'], // the glob(s) to search for
        //scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
        //replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
        //camelize: true,
        lazy: true,
        rename: {
            'gulp-if':'gulpif'
        }
    }),

    plumber = require('gulp-plumber'),
    argv = require('yargs').argv;

var usePlumber = true;

var paths = {
    scripts_src: ['./src/**/*.js'],
    scripts_test: ['./test/**/*.js'],
    scripts_build: './build/js'
};

var exec = require('child_process').exec;

function runCommand(command) {
    return function (cb) {
        exec(command, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb();
        });
    }
}

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return gulp.src('build', {read: false})
        .pipe(plugins.rimraf());
});

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts_src)
        .pipe(plugins.gulpif(usePlumber, plugins.plumber()))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.jscs())
        .pipe(plugins.jscs.reporter())
        .pipe(plugins.jscs.reporter('fail'))
        .pipe(plugins.gulpif(argv.prod, plugins.sourcemaps.init()))
        .pipe(plugins.gulpif(argv.prod, plugins.uglify()))
        //.pipe(concat('app.js'))
        .pipe(plugins.gulpif(argv.prod, plugins.sourcemaps.write()))
        .pipe(gulp.dest(paths.scripts_build))
});

gulp.task('run', ['scripts'], function() {
    plugins.env({
        vars: {
            NPM_CONFIG_LOGLEVEL: 'debug',
            NODE_ENV: 'development',
            MONGOLAB_URI: 'mongodb://localhost:27017/RIB_DB',
            CORS_ORIGIN: 'http://127.0.0.1:9000,http://localhost:9000'
        }
    });
    return plugins.express.run(['bin/www'], null, false);
});

gulp.task('stop', function() {
    return plugins.express.stop();
});

gulp.task('start-mongo', runCommand('mongod --dbpath ./data/ --fork --logpath ./data/mongodb.log'));
gulp.task('stop-mongo', runCommand('mongod --dbpath ./data/ --shutdown'));

// Rerun the task when a file changes
gulp.task('watch', ['scripts', 'run'], function() {
    gulp.watch(paths.scripts_src, ['scripts', 'run']);
});

gulp.task('default', ['watch', 'scripts']);

gulp.task('build', ['scripts']);

gulp.task('test', function(cb) {
    usePlumber = false;
    var runSequence = require('run-sequence').use(gulp);
    return runSequence(['run', 'start-mongo'], 'run-test', ['stop', 'stop-mongo'], function(err) {
        if (err) {
            gulp.start('stop');
            gulp.start('stop-mongo');
            return process.exit(2);
        } else {
            return cb();
        }
    });
});

gulp.task('run-test', function() {
    usePlumber = false;

    return gulp.src(paths.scripts_test, {read: false})
        .pipe(plugins.wait(1000))
        .pipe(plugins.mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }));
});

