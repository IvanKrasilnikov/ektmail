"use strict";

// --- *** PACKAGES *** --------------------------------------------------------
const gulp = require('gulp');
const archiver = require('gulp-archiver');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const watch = require('gulp-watch');

// -----------------------------------------------------------------------------

// --- *** DIRECTORIES *** -----------------------------------------------------
const rootDir = '.';
const devDir = rootDir + '/dev';

// -----------------------------------------------------------------------------

// --- *** SETTINGS *** --------------------------------------------------------
const settings = {
	htmlMin: {collapseWhitespace: true},
  pug: {pretty: true},
  watchPug: {name: 'pug', verbose: true}
};

// -----------------------------------------------------------------------------

// --- *** SINGLE TASKS *** ----------------------------------------------------

// --- PUG AND HTML TASKS ------------------------------------------------------
gulp.task('pugHtmlUnity', () => {
  pugHtmlUnity();
});

gulp.task('pugHtmlUnity:watch', ['pugHtmlUnity'], () => {
  return watch(`${devDir}/pug/**/*.pug`, settings.watchPug, () => {
			pugHtmlUnity();
		}
	);
});

function pugHtmlUnity() {
  gulp.src(`${devDir}/pug/index.pug`)
    .pipe(plumber())
    .pipe(pug(settings.pug))
    .pipe(gulp.dest(`${devDir}/`))
		.pipe(rename('index.min.html'))
		.pipe(htmlmin(settings.htmlMin))
		.pipe(gulp.dest(`${devDir}/`));
}

// --- OTHER TASKS -------------------------------------------------------------
gulp.task('to-zip', () => {
  let curTime = new Date();
  let insertTime =
    curTime.getDate() + '-' +
    (curTime.getMonth() + 1) + '-' +
    curTime.getFullYear() + '-' +
    curTime.getTime().toString().slice(8);

  return gulp.src([
			`${devDir}/**`,
			`!${devDir}/index.html`,
			`!${devDir}/pug/`,
			`!${devDir}/pug/**`
		])
    .pipe(archiver(`prod-${insertTime}.zip`))
    .pipe(gulp.dest(rootDir));
});

// -----------------------------------------------------------------------------

// --- DEFAULT TASK ------------------------------------------------------------
gulp.task('default', ['pugHtmlUnity:watch']);

// -----------------------------------------------------------------------------
