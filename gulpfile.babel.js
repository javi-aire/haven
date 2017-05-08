/**
* Import necessary plugins
*/
import gulp from 'gulp';
import sass from 'gulp-sass';
import browser from 'browser-sync';
import htmlMin from 'gulp-htmlmin';
import cssMin from 'gulp-clean-css';
import imgMin from 'gulp-imagemin';
import fontMin from 'gulp-fontmin';
import jsMin from 'gulp-uglify';
import seq from 'run-sequence';
import babel from 'gulp-babel';

/**
* Object map of paths for use with tasks
*/
const paths = {
  src: 'client',
  js: './client/js/**/*.js',
  images: './client/assets/images/**/*',
  fonts: './client/assets/fonts/**/*.{eot,woff,ttf,svg}',
  html: './client/*.html',
  css: './client/css/**/*.scss',
  dest: 'dist'
};

/**
* compile/minify sass files
*/
gulp.task("sass", () => {
  return gulp.src(paths.css)
      .pipe(sass())
      .pipe(gulp.dest(`${paths.dest}/css`))
      .pipe(browser.reload({
        stream: true
      }));
});

/**
* minify html but compiles sass first
*/
gulp.task('html', ['sass'], () => {
  return gulp.src(paths.html)
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest(`${paths.dest}/`));
});

/**
* minify images
*/
gulp.task('images', () => {
  return gulp.src(paths.images)
    .pipe(imgMin())
    .pipe(gulp.dest(`${paths.dest}/assets/images`));
});

/**
* minify font
*/
gulp.task('font', () => {
  return gulp.src(paths.fonts)
    .pipe(fontMin())
    .pipe(gulp.dest(`${paths.dest}/assets/fonts`));
});

/**
* compile and minify JS (even though there isn't any)
*/
gulp.task('babel', () => {
  return gulp.src(paths.js)
    .pipe(babel())
    .pipe(jsMin())
    .pipe(gulp.dest(`${paths.dest}/js`));
});


/**
* watch js, html, scss files for changes
* compiles/minifies all on any change
*/
gulp.task('watch', ['serve'], () => {
  gulp.watch(`${paths.src}/**/*.{js,scss,html}`, ['sass', 'html', 'babel', browser.reload]);
});


/**
* serve on port 3175 from base directory dist/
* also exposes node_modules to dist so nothing will break :)
*/
gulp.task('serve', () => {
  browser({
    port: process.env.PORT || 3175,
    ghostMode: false,
    open: false,
    server: {
      baseDir: `${paths.dest}/`,
      routes : {
        './node_modules': './node_modules'
      }
    }
  });
});


/*
* uses run-sequence to run every task in order
*/
gulp.task('build', () => {
  return seq('sass', 'html', 'images', 'font', 'watch');
});


/*
* default task -- calls the build command
*/
gulp.task('default', (done) => {
  seq('build', done);
});