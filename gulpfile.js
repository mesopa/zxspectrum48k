
// -----------------
// Project Variables
// -----------------

const { src, dest, series, parallel, watch } = require('gulp');

const sass           = require('gulp-sass')(require('sass')),
      uglify         = require('gulp-uglify'),
      minifyCSS      = require('gulp-clean-css'),
      htmlmin        = require('gulp-htmlmin'),
      connect        = require('gulp-connect'),
      concat         = require('gulp-concat'),
      inlinesource   = require('gulp-inline-source'),
      rename         = require('gulp-rename'),
      del            = require('del');

const theme_name   = 'zxspectrum48k',
      theme_suffix = '';

const base_path  = '',
      source     = base_path + '_dev',
      dist       = base_path + 'docs',
      temp       = base_path + '_dev/tmp',
      paths      = {
        vendor_js:   [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/popper.js/dist/umd/popper.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/lightbox2/dist/js/lightbox.min.js',
          'node_modules/lazysizes/lazysizes.min.js',
        ],
        vendor_css:  [
          'node_modules/bootstrap/dist/css/bootstrap.min.css',
          'node_modules/lightbox2/dist/css/lightbox.min.css',
        ],
        js:   [
          source + '/javascript/' + theme_name + '-javascript.js',
        ],
        sass: [
          source + '/scss/' + theme_name + '-styles.scss',
          source + '/scss/' + theme_name + '-styles-fonts.scss',
        ]
      };


// -------------
// Project Tasks
// -------------

// Local Server
function connectServer() {
  connect.server({
    root: dist,
    livereload: true
  });
};

// -- CLEAN 'dist' --
function cleanDist() {
  return del( dist + '/*' );
};

// -- CLEAN 'tmp' --
function cleanTmp() {
  return del( temp + '/*' );
};

// -- ASSETS --
function assets() {
  return src( source + '/assets/**/**/**/*' )
    .pipe( dest( dist + '/assets/' ) );
};

// -- JS     --
function js() {
  return src( paths.js )
    .pipe( concat( theme_name + theme_suffix + '.js' ) )
    .pipe( uglify())
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-js' ) );
};

// -- SASS   --
function sassStyles() {
  return src( paths.sass )
    .pipe( sass())
    .pipe( minifyCSS({
        level: {1: {specialComments: 0}}
      }))
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-css' ) )
    .pipe( dest( dist + '/assets/css' ) );
};

// -- Vendor JS    --
function vendorJs() {
  return src( paths.vendor_js )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.js' ) )
    .pipe( uglify())
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-js' ) );
};

// -- Vendor CSS   --
function vendorCss() {
  return src( paths.vendor_css )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.css' ) )
    .pipe( minifyCSS({
      level: {1: {specialComments: 0}}
    }))
    .pipe( rename({
      suffix: '.min'
    }))
    .pipe( dest( temp + '/compiled-css' ) );
};

// -- Inline CSS   --
function inlineCss() {
  return src( source + '/html/*' )
     .pipe( inlinesource() )
     .pipe( htmlmin({
       collapseWhitespace: true
      }))
     .pipe( dest( dist ) )
     .pipe( connect.reload() );
};

// -- Concat JS   --
function concatJs() {
  return src([
    temp + '/compiled-js/' + theme_name + '-vendor.min.js',
    temp + '/compiled-js/' + theme_name + '.min.js',
  ])
  .pipe( concat(theme_name + '-all.min.js') )
  .pipe( dest( dist + '/assets/js' ) )
  .pipe( connect.reload() );
};

// -- WATCH          --
function watchFiles() {
  watch( source + '/html/*', series(sassStyles, vendorCss, inlineCss) );
  watch( source + '/javascript/*', series(js, vendorJs, concatJs) );
  watch( source + '/scss/*', series(sassStyles, vendorCss, inlineCss) );
};

// ------------------------------
// -- Project `default` Gulp Task
// ------------------------------

exports.default = series(
  cleanDist,
  cleanTmp,
  assets,
  js,
  vendorJs,
  concatJs,
  sassStyles,
  vendorCss,
  inlineCss,
  parallel(
    watchFiles,
    connectServer,
  ),
);













