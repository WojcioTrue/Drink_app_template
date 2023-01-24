const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCss = require("gulp-clean-css");
const terser = require("gulp-terser");
var concat = require('gulp-concat');
const browsersync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');

function scssTask() {
  return src("src/scss/*.scss")
    .pipe(sass())
    .pipe(dest("src/css/single/"))
    .pipe(autoprefixer())
    .pipe(concat(`style.css`))
    .pipe(cleanCss())
    .pipe(dest("src/css"));
}

function jsTask() {
  return src("src/my_js/*.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("src/js/", { sourcemaps: "." }));
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

function watchTask() {
  watch("./*.html", browsersyncReload);
  watch(
    ["src/scss/*.scss", "src/my_js/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

exports.watch = series(scssTask, jsTask, browsersyncServe, watchTask);
