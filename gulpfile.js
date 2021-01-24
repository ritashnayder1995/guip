var gulp = require('gulp');
var server = require("browser-sync").create();
var sourcemap = require('gulp-sourcemaps');
//css
var sass = require('gulp-sass');
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
//
var rename = require("gulp-rename");
var del = require ("del");
//svg
var svgstore = require("gulp-svgstore");
//img
var imagemin = require('gulp-imagemin');
var webp = require("gulp-webp");

gulp.task("sass", function () {
  return gulp.src('source/scss/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([
      autoprefixer()
    ]))
  .pipe(gulp.dest('build/css'))
  //minify
  .pipe(csso())
  .pipe(rename("style.min.css"))
  .pipe(sourcemap.write("."))
  .pipe(gulp.dest('build/css'))

  .pipe(server.stream());
});

gulp.task("copy-html", function() {
  return gulp.src('source/index.html')
  .pipe(gulp.dest('build'))

});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// gulp.task("", function () {});

gulp.task("optiimages", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true})    
      ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));

});

gulp.task("serv", function () { 
  server.init({ 
    server: "./build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  
  });

gulp.watch("./source/scss/**/*.{scss,sass}", gulp.series("sass"));
gulp.watch("./source/*.html").on("change", server.reload);
});

gulp.task("del", function () {
  return del ("build");
});

gulp.task ("build", gulp.series(
  "del",
  "copy-html",
  "sass",
  "sprite",
  "optiimages",
  "webp"
));

gulp.task("start", gulp.series("build","serv"));