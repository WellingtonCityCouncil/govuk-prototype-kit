/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in `/gulp`. Any files in that directory
  get automatically required below.
  To add a new task, simply add a new task file that directory.
*/

const gulp = require('gulp')
const requireDir = require('require-dir')
const { watch } = require('gulp')
const config = require('./app/config.js')
const nunjucksRender = require('gulp-nunjucks-render')

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp', { recurse: true })


const assets = function (cb) {
  gulp.series(
    'clean',
    'sass-extensions',
    gulp.parallel(
      'sass',
      'copy-assets'
    )
  )();
  cb();
};

const html = function (cb) {
  gulp.src('app/views/*.html')
  // Adding data to Nunjucks
  .pipe(nunjucksRender({
    path: ['node_modules/govuk-frontend/','app/views/'],
    envOptions: { 
      autoescape: true
    },
    data: config
  }))
  .pipe(gulp.dest('public'))
  cb();
};


const copyuk = function(cb) {
  gulp.src(['node_modules/govuk-frontend/govuk/assets/fonts/*']).pipe(gulp.dest('public/govuk/assets/fonts/'));
  gulp.src(['node_modules/govuk-frontend/govuk/all.js']).pipe(gulp.dest('public/govuk/'));
  cb();
}

const watcher = function(){
  watch(['app/**/*.*'], gulp.parallel(assets, html));
}


exports.html = html;
exports.assets = assets;
exports.copyuk = copyuk;
exports.watch = watcher;
exports.default = gulp.series(assets, html, copyuk);