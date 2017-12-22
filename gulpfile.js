
var gulp           = require('gulp'),
    webpack        = require('webpack-stream'),
    googleWebFonts = require('gulp-google-webfonts'),
    sass           = require('gulp-sass'),
    prefixer       = require('gulp-autoprefixer'),
    uglify         = require('gulp-uglify'),
    minifyCSS      = require('gulp-clean-css'),
    connect        = require('gulp-connect'),
    replace        = require('gulp-replace'),
    rename         = require('gulp-rename'),
    del            = require('del');

const base_path = './',
      src       = base_path + '_dev/src',
      dist      = base_path + 'docs';

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
  return gulp.src( src + '/images/**/*' )
    .pipe(gulp.dest( dist + '/assets/images/' ))
    .pipe(connect.reload());
});

gulp.task('google-fonts', function(){
  return gulp.src( base_path + 'fonts.list' )
    .pipe(googleWebFonts({
      fontsDir: dist + '/assets/fonts/google/',
      cssDir: dist + '/assets/css/',
      cssFilename: 'fonts.css'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('google-fonts-css-fix', ['google-fonts'], function(){
  return gulp.src( dist + '/assets/css/fonts.css')
    .pipe(replace('url(docs/assets/', 'url(../'))
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dist + '/assets/css/'));
});

gulp.task('fontawesome-fonts', function(){
  return gulp.src( base_path + 'node_modules/font-awesome/fonts/*' )
    .pipe(gulp.dest(dist + '/assets/fonts/font-awesome/'));
});

gulp.task('fontawesome-sass', function(){
  return gulp.src( src + '/stylesheet/font-awesome.scss' )
    .pipe(sass({
      includePaths: [
        'node_modules/font-awesome/scss'
      ]
    }))
    .pipe(prefixer())
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dist + '/assets/css/'));
});

gulp.task('no-compile-scripts', function(){
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/lightbox2/dist/js/lightbox.min.js',
    'node_modules/lazysizes/lazysizes.min.js'
  ])
    .pipe(gulp.dest( dist + '/assets/js/' ));
});

gulp.task('compile-scripts', function(){
  return gulp.src( src + '/javascript/scripts.js')
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest( dist + '/assets/js/' ))
    .pipe(connect.reload());;
});

gulp.task('bootstrap-sass', function(){
  return gulp.src( src + '/stylesheet/bootstrap_custom.scss' )
    .pipe(sass({
      includePaths: 'node_modules/bootstrap/scss'
    }))
    .pipe(prefixer())
    .pipe(minifyCSS())
    .pipe(rename('bootstrap.min.css'))
    .pipe(gulp.dest( dist + '/assets/css/' ));
});

gulp.task('lightbox-sass', function(){
  return gulp.src( src + '/stylesheet/lightbox.scss' )
    .pipe(sass())
    .pipe(prefixer())
    .pipe(minifyCSS())
    .pipe(rename('lightbox.min.css'))
    .pipe(gulp.dest( dist + '/assets/css/' ));
});

gulp.task('styles-sass', function(){
  return gulp.src( src + '/stylesheet/styles.scss' )
    .pipe(sass({
      includePaths: 'node_modules/bootstrap/scss'
    }))
    .pipe(prefixer())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest( dist + '/assets/css/' ))
    .pipe(connect.reload());
});

gulp.task('bootstrap-js', function(){
  return gulp.src( src + '/javascript/bootstrap.js' )
    .pipe(webpack( require('./webpack.config') ))
    .pipe(uglify())
    .pipe(rename('bootstrap.min.js'))
    .pipe(gulp.dest( dist + '/assets/js/' ));
});

gulp.task('watch', function(){
  gulp.watch( src + '/*.html', ['html'] );
  gulp.watch( src + '/stylesheet/*.scss', ['styles-sass'] );
  gulp.watch( src + '/javascript/scripts.js', ['compile-scripts'] );
});

gulp.task('clean', function(){
  return del( dist + '/*' );
});

gulp.task('default', ['clean'], function(){
  gulp.start(
    'html',
    'images',
    'google-fonts',
    'google-fonts-css-fix',
    'fontawesome-fonts',
    'fontawesome-sass',
    'bootstrap-sass',
    'lightbox-sass',
    'styles-sass',
    'bootstrap-js',
    'no-compile-scripts',
    'compile-scripts',
    'connect',
    'watch');
});