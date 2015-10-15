var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'], // the glob(s) to search for
        scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
        replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
        camelize: true,
        lazy: true,
        rename: {
            'gulp-if':'gulpif'
        }
    }),

    argv = require('yargs').argv;

var paths = {
    scripts_src: ['./src/**/*.js'],
    scripts_build: './build/js'
};

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
               .pipe(plugins.gulpif(!argv.prod, plugins.plumber()))
               .pipe(plugins.jshint())
               .pipe(plugins.jshint.reporter('jshint-stylish'))
               .pipe(plugins.jshint.reporter('fail'))
               .pipe(plugins.gulpif(argv.prod, plugins.sourcemaps.init()))
               .pipe(plugins.gulpif(argv.prod, plugins.uglify()))
               //.pipe(concat('app.js'))
               .pipe(plugins.gulpif(argv.prod, plugins.sourcemaps.write()))
               .pipe(gulp.dest(paths.scripts_build))
});

gulp.task('run', ['scripts'], function() {
    plugins.express.run(['bin/www']);
});

// Rerun the task when a file changes
gulp.task('watch', ['scripts', 'run'], function() {
    gulp.watch(paths.scripts_src, ['scripts', 'run']);
});

gulp.task('default', ['watch', 'scripts']);

gulp.task('build', ['scripts']);

gulp.task('test', ['build'], function() {
    //TODO run test
});

