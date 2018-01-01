
var gulp           = require('gulp'),
    webpack        = require('webpack-stream'),
    googleWebFonts = require('gulp-google-webfonts'),
    sass           = require('gulp-sass'),
    prefixer       = require('gulp-autoprefixer'),
    uglify         = require('gulp-uglify'),
    minifyCSS      = require('gulp-clean-css'),
    htmlmin        = require('gulp-htmlmin'),
    connect        = require('gulp-connect'),
    concat         = require('gulp-concat'),
    replace        = require('gulp-replace'),
    rename         = require('gulp-rename'),
    del            = require('del');

const base_path = './',
      src       = base_path + '_dev/src',
      dist      = base_path + 'docs';

// Initialize the live server
gulp.task('connect', function(){
  connect.server({
    root: dist,
    livereload: true
  });
});

// Copy and minify HTML files
gulp.task('html', function(){
  return gulp.src( src + '/*.html' )
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true
    }))
    .pipe(gulp.dest( dist ))
    .pipe(connect.reload());
});

// Copy all necessary images
gulp.task('images', function(){
  return gulp.src( src + '/images/**/*' )
    .pipe(gulp.dest( dist + '/assets/images/' ))
    .pipe(connect.reload());
});

// Get all the necessary Google fonts listed in 'fonts.list'
gulp.task('google-fonts', function(){
  return gulp.src( base_path + 'fonts.list' )
    .pipe(googleWebFonts({
      fontsDir: dist + '/assets/fonts/google/',
      cssDir: dist + '/assets/css/',
      cssFilename: 'fonts.css'
    }))
    .pipe(gulp.dest('./'));
});

// Fix CSS Google Fonts PATH
gulp.task('google-fonts-css-fix', ['google-fonts'], function(){
  return gulp.src( dist + '/assets/css/fonts.css')
    .pipe(replace('url(docs/assets/', 'url(../'))
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dist + '/assets/css/'));
});

// Copy Font Awesome Fonts files
gulp.task('fontawesome-fonts', function(){
  return gulp.src( base_path + 'node_modules/font-awesome/fonts/*' )
    .pipe(gulp.dest(dist + '/assets/fonts/font-awesome/'));
});

// Compiles Font Awesome Styles
gulp.task('fontawesome-sass', function(){
  return gulp.src( src + '/stylesheet/font-awesome.scss' )
    .pipe(sass({
      includePaths: [
        'node_modules/font-awesome/scss'
      ]
    }))
    .pipe(prefixer())
    .pipe(minifyCSS({
      level: {1: {specialComments: 0}}
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dist + '/assets/css/'));
});

// Copy scripts that doesn't need any compilation
gulp.task('no-compile-scripts', function(){
  return gulp.src([
    //'node_modules/jquery/dist/jquery.min.js', Only for local development
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/lightbox2/dist/js/lightbox.min.js',
    'node_modules/lazysizes/lazysizes.min.js'
  ])
    .pipe(gulp.dest( dist + '/assets/js/' ));
});

// Compile Javascript scripts.js
gulp.task('compile-scripts', function(){
  return gulp.src( src + '/javascript/scripts.js')
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest( dist + '/assets/js/' ));
});

// Compile Boostrat Framewor Styles
gulp.task('bootstrap-sass', function(){
  return gulp.src( src + '/stylesheet/bootstrap_custom.scss' )
    .pipe(sass({
      includePaths: 'node_modules/bootstrap/scss'
    }))
    .pipe(prefixer())
    .pipe(minifyCSS({
      level: {1: {specialComments: 0}}
    }))
    .pipe(rename('bootstrap.min.css'))
    .pipe(gulp.dest( dist + '/assets/css/' ));
});

// Compile Lightbox Styles
gulp.task('lightbox-sass', function(){
  return gulp.src( src + '/stylesheet/lightbox.scss' )
    .pipe(sass())
    .pipe(prefixer())
    .pipe(minifyCSS())
    .pipe(rename('lightbox.min.css'))
    .pipe(gulp.dest( dist + '/assets/css/' ));
});

// Compile styles.scss
gulp.task('styles-sass', function(){
  return gulp.src( src + '/stylesheet/styles.scss' )
    .pipe(sass({
      includePaths: 'node_modules/bootstrap/scss'
    }))
    .pipe(minifyCSS())
    .pipe(prefixer())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest( dist + '/assets/css/' ));
});

// Compile Boostrat Framework Javascript
gulp.task('bootstrap-js', function(){
  return gulp.src( src + '/javascript/bootstrap.js' )
    .pipe(webpack( require('./webpack.config') ))
    .pipe(uglify())
    .pipe(rename('bootstrap.min.js'))
    .pipe(gulp.dest( dist + '/assets/js/' ));
});

// Concat all Styles Files into one file
gulp.task('concat-styles', [
  'google-fonts',
  'google-fonts-css-fix',
  'fontawesome-fonts',
  'fontawesome-sass',
  'bootstrap-sass',
  'lightbox-sass',
  'styles-sass' ], function(){
return gulp.src([
   dist + '/assets/css/bootstrap.min.css',
   dist + '/assets/css/lightbox.min.css',
   dist + '/assets/css/font-awesome.min.css',
   dist + '/assets/css/fonts.min.css',
   dist + '/assets/css/styles.min.css'
  ])
  .pipe(concat('app.mim.css'))
  .pipe(gulp.dest( dist + '/assets/css/' ));
});

// Concat all Scripts Files into one file
gulp.task('concat-scripts', [
  'bootstrap-js',
  'no-compile-scripts',
  'compile-scripts' ], function(){
return gulp.src([
    dist + '/assets/js/popper.min.js',
    dist + '/assets/js/bootstrap.min.js',
    dist + '/assets/js/lightbox.min.js',
    dist + '/assets/js/lazysizes.min.js',
    dist + '/assets/js/scripts.min.js'
  ])
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest( dist + '/assets/js/' ));
});

// Live concat all styles files into one file
// If any changes are made in styles.scss
gulp.task('watch-concat-styles', ['styles-sass'], function(){
  return gulp.src([
    dist + '/assets/css/bootstrap.min.css',
    dist + '/assets/css/lightbox.min.css',
    dist + '/assets/css/font-awesome.min.css',
    dist + '/assets/css/fonts.min.css',
    dist + '/assets/css/styles.min.css'
   ])
   .pipe(concat('app.mim.css'))
   .pipe(gulp.dest( dist + '/assets/css/' ))
   .pipe(connect.reload());
});

// Live concat all scripts files into one file
// If any changes are made in scripts.js
gulp.task('watch-concat-scripts', ['compile-scripts'], function(){
  return gulp.src([
    dist + '/assets/js/popper.min.js',
    dist + '/assets/js/bootstrap.min.js',
    dist + '/assets/js/lightbox.min.js',
    dist + '/assets/js/lazysizes.min.js',
    dist + '/assets/js/scripts.min.js'
  ])
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest( dist + '/assets/js/' ))
  .pipe(connect.reload());
});

// Clean all files inside the 'dist' folder
gulp.task('clean', function(){
  return del( dist + '/*' );
});

// Watch styles.scss and scripts.js for any changes
gulp.task('watch', function(){
  gulp.watch( src + '/*.html', ['html'] );
  gulp.watch( src + '/stylesheet/*.scss', ['watch-concat-styles'] );
  gulp.watch( src + '/javascript/scripts.js', ['watch-concat-scripts'] );
});

// Default task
gulp.task('default', ['clean'], function(){
  gulp.start(
    'html',
    'images',
    'concat-styles',
    'concat-scripts',
    'connect',
    'watch');
});