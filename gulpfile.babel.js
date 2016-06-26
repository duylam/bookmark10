import gulp from 'gulp'
import {join} from 'path'

const $ = require('gulp-load-plugins')()
const PATHS = {
  JS_SRC: './src/**/*.js',
  BUILD: './build'
}

gulp.task('copy', function() {
  return gulp.src(['./src/**/*.wav', './package.json'])
    .pipe(gulp.dest(PATHS.BUILD))
})

gulp.task('build', ['copy'], function() {
  return gulp.src(PATHS.JS_SRC)
    .pipe($.babel())
    .pipe(gulp.dest(PATHS.BUILD))
})

gulp.task('clean', function() {
  return gulp.src(PATHS.BUILD, {read: false})
    .pipe($.clean())
})
