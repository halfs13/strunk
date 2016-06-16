'use strict';

var Promise = require('bluebird');

var gulp = require('gulp');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var serve = require('gulp-serve');

var tasks = {};

tasks.less = function() {
    return gulp.src(['client/app/app.less', 'client/app/shared/**/*.less'])
    .pipe(less({
        dumpLineNumbers: "comments"
    }))
    .pipe(gulp.dest('./'));
};

tasks.cleanBower = function() {
    return del(['client/lib/vendor/*']);
};

tasks.buildBower = function() {
    return tasks.cleanBower()
    .then(function() {
        return gulp.src(mainBowerFiles(['**/*.css', '**/*.js', '**/*.min.js']))
        .pipe(gulp.dest('client/lib/vendor'));
    })
    .then(function() {
        return tasks.buildFonts();
    });
};

tasks.cleanFonts = function() {
    return del(['client/fonts/*']);
};

tasks.buildFonts = function() {
    return tasks.cleanFonts()
    .then(function() {
        return gulp.src(mainBowerFiles(['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff']))
        .pipe(gulp.dest('client/fonts'));
    });
};

tasks.deleteBowerComponents = function() {
    return Promise.promisify(del)(['bower_components']);
};

gulp.task('bower', function() {
    return tasks.buildBower();
});

gulp.task('less', tasks.less);
gulp.task('serve', serve('.'));

gulp.task('default', ['bower', 'serve']);