const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const htmlmin = require("gulp-htmlmin");
const inlinesource = require("gulp-inline-source");
const imagemin = require("gulp-imagemin");

gulp.task("scripts-dist", function() {
  gulp
    .src("js/**/*.js")
    // .pipe(
    //   babel({
    //     presets: ["@babel/env"]
    //   }).on("error", console.log)
    // )
    // .pipe(uglify().on("error", console.log))
    // .pipe(concat("bundle.js").on("error", console.log))
    .pipe(gulp.dest("./docs/js"));
  return (
    gulp
      .src("sw.js")
      // .pipe(
      //   babel({
      //     presets: ["@babel/env"]
      //   }).on("error", console.log)
      // )
      // .pipe(uglify().on("error", console.log))
      .pipe(gulp.dest("./docs"))
  );
});

gulp.task("copy-html", function() {
  return gulp
    .src(["./index.html", "./restaurant.html"])
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("./docs"));
});

gulp.task("copy-manifest", function() {
  return gulp.src("manifest.json").pipe(gulp.dest("./docs"));
});

gulp.task("inline", function() {
  return gulp
    .src(["./docs/index.html", "./docs/restaurant.html"], { base: "./docs" })
    .pipe(inlinesource())
    .pipe(gulp.dest("./docs"));
});

gulp.task("copy-images", function() {
  return gulp.src("img/**/*")
  .pipe(
    imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 })
    ])
  ).pipe(gulp.dest("./docs/img"));
});

gulp.task("styles", function() {
  return gulp
    .src("css/*")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./docs/css"));
});

gulp.task(
  "default",
  gulp.parallel(
    "copy-images",
    "copy-manifest",
    "styles",
    "scripts-dist",
    gulp.series("copy-html", "inline")
  )
);
