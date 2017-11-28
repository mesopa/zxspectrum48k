
var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    prefixer= require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    del     = require('del');

const base_path = './',
      src       = base_path + '_dev/src',
      dist      = base_path + 'dist';

gulp.task('connect', function(){
  connect.server({
    root: dist,
    livereload: true
  });
});

gulp.task('html', function(){
  return gulp.src( src + '/*.html' )
    .pipe(gulp.dest( dist ))
    .pipe(connect.reload());
});

gulp.task('images', function(){
  return gulp.src( src + '/images/*' )
    .pipe(gulp.dest( dist + '/assets/images/' ))
    .pipe(connect.reload());
});

gulp.task('jquery', function(){
  return gulp.src( base_path + 'node_modules/jquery/dist/jquery.min.js' )
    .pipe(gulp.dest(dist + '/assets/js/'));
});

gulp.task('sass', function(){
  return gulp.src( src + '/stylesheet/*.scss' )
    .pipe(sass({
      errLogToConsole: true,
      includePaths: ['node_modules/foundation-sites/scss']
    }))
    .pipe(prefixer({
      browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
    }))
    .pipe(gulp.dest(dist + '/assets/css/'))
    .pipe(connect.reload());
});

gulp.task('foundation-js', function(){
  return gulp.src( base_path + 'node_modules/foundation-sites/dist/js/foundation.min.js' )
    .pipe(gulp.dest(dist + '/assets/js/'));
});

gulp.task('watch', function(){
  gulp.watch( src + '/*.html', ['html'] );
  gulp.watch( src + '/stylesheet/*.scss', ['sass'] );
});

gulp.task('clean', function(){
  return del( dist + '/*' );
});

gulp.task('default', ['clean'], function(){
  gulp.start('connect', 'watch', 'html', 'images', 'jquery', 'foundation-js', 'sass');
});