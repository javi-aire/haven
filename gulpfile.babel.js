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
  fonts: './client/assets/fonts/**/*',
  html: './client/*.html',
  css: './client/scss/**/*.scss',
  dest: 'dist'
};

/**
* compile/minify sass files
*/
gulp.task("sass", () => {
  gulp.src(paths.css)
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
  gulp.src(paths.html)
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest(`${paths.dest}/`));
});

/**
* minify images
*/
gulp.task('images', () => {
  gulp.src(paths.images)
    .pipe(imgMin())
    .pipe(gulp.dest(`${paths.dest}/assets/images`));
});

/**
* minify font
*/
gulp.task('font', () => {
  gulp.src(paths.fonts)
    .pipe(fontMin())
    .pipe(gulp.dest(`${paths.dest}/assets/fonts`));
});

/**
* compile and minify JS
*/
gulp.task('babel', () => {
  gulp.src(paths.js)
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
* default task -- uses run-equence to build everything on the 'gulp' cmd
*/
gulp.task('default', (done) => {
  seq('build', 'serve', 'watch', done);
});