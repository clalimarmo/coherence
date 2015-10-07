var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('babelify');
var source = require('vinyl-source-stream');

var babelTransform = babel.configure({
  blacklist: [],
});

var browserified = function(opts) {
  return browserify('./src/index.js', opts)
    .transform(babelTransform);
};

gulp.task('build', function() {
  return browserified({
    debug: true,
  })
    .bundle()
    .pipe(source('dumb-router.js'))
    .pipe(gulp.dest('./build/'));
});
