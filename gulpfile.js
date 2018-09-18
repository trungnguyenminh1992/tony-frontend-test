var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe($.sass())
        .pipe($.if('*.css', $.cssnano()))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function() {
    browserSync.init({ 
      server: {
        baseDir: 'dist'
      }
    });
});

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', ['sass']); 
    gulp.watch('app/*.html', browserSync.reload); 
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('default', function (callback) {
    runSequence('clean:dist',
        ['sass','useref', 'images', 'fonts', 'browserSync'], 'watch',
      callback
    );
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
      ['sass', 'useref', 'images', 'fonts'],
      callback
    );
});