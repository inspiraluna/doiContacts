'use strict';

const gulp = require('gulp');
const insert = require('gulp-insert');
const fs= require('fs');

const remap = fs.readFileSync('src/common/src/cordova-remap.js', 'utf-8');

function webpack(config, callback){
  const exec = require('child_process').exec;
  exec(__dirname + '/node_modules/.bin/webpack --config ' + config, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    callback(error);
  });
}

const prepackTask = (cb) => {
  webpack('webpack.prepack.config.js', cb);
}

const webpackCordovaTask = (cb) => {
  webpack('webpack.cordova.config.js', cb);
}

const distTask = (cb) => {
  webpack('webpack.library.config.js', cb);
}

const remapTask = () => {
  return gulp.src(['dist/plugin.min.js', 'dist/www.min.js'])
      .pipe(insert.prepend(remap))
      .pipe(gulp.dest('dist'));
}

const pluginTask = () => {
    return gulp.src(['dist/plugin.min.js'])
        .pipe(gulp.dest('src/browser'));
}

const wwwTask = () => {
  return gulp.src(['dist/www.min.js'])
      .pipe(gulp.dest('www'));
}

gulp.task('prepack',prepackTask)
gulp.task('webpack-cordova',gulp.series(prepackTask,webpackCordovaTask))
gulp.task('dist',gulp.series(prepackTask,distTask))
gulp.task('remap',gulp.series(webpackCordovaTask,remapTask))
gulp.task('plugin',gulp.series(remapTask,pluginTask))
gulp.task('www',gulp.series(remapTask,wwwTask))
gulp.task('default',gulp.series(distTask,pluginTask,wwwTask))