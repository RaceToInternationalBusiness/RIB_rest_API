var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),

    server = require('gulp-express'),

    clean = require('gulp-clean'),

    paths = {
        scripts_src: ['./src/**/*.js'],
        scripts_build: './build/js'
    };

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts_src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        //.pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scripts_build))
});

gulp.task('run', ['scripts'], function() {
    server.run(['bin/www']);

});

// Rerun the task when a file changes
gulp.task('watch', ['scripts', 'run'], function() {
    gulp.watch(paths.scripts_src, ['scripts', 'run']);
});

gulp.task('default', ['watch', 'scripts']);

