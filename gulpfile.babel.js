/**
* Import necessary plugins
*/
import gulp from 'gulp';
import sass from 'gulp-sass';
import browser from 'browser-sync';
import htmlMin from 'gulp-htmlmin';
import imgMin from 'gulp-imagemin';
import fontMin from 'gulp-fontmin';
import jsMin from 'gulp-uglify';
import runSeq from 'run-sequence';
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
* compile sass
*/
gulp.task("sass", () => {
  gulp.src(paths.css)
      .pipe(sass())
      .pipe(gulp.dest("dist/css"))
      .pipe(browser.reload({
        stream: true
      }));
});

/**
* Minify images
*/
gulp.task('images', () => {
  gulp.src(paths.images)
    .pipe(imageMin())
    .pipe(gulp.dest(`${paths.dest}/assets/images`));
});

/**
* Minify font
*/
gulp.task('font', () => {
  gulp.src(paths.fonts)
    .pipe(fontMin())
    .pipe(gulp.dest(`${paths.dest}/assets/fonts`));
});

/**
* Compile and minify JS
*/
gulp.task('babel', function() {
  gulp.src(paths.js)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.dest}/js`));
});

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