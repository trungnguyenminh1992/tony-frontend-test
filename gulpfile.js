var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function() {
    browserSync.init({ 
      server: {
        baseDir: 'app'
      }
    });
});

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', ['sass']); 
    gulp.watch('app/*.html', browserSync.reload); 
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(useref())
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('default', function (callback) {
    runSequence(['sass','browserSync'], 'watch',
      callback
    );
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
      ['sass', 'useref', 'images'],
      callback
    );
});