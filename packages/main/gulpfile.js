const gulp = require('gulp');
const terser = require('gulp-terser');
const babel = require('gulp-babel');
const babelConfig = require('./babel.config');

function build() {
  return gulp.src('src/**/*.{js,jsx}')
    .pipe(babel(babelConfig))
    .pipe(terser({ ecma: 2016 }))
    .pipe(gulp.dest('lib'));
}

exports.default = build;