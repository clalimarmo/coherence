var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var uglifyify = require('uglifyify');

var babelTransform = babel.configure({
  blacklist: [],
});

var browserified = function(opts) {
  return browserify('./src/coherence.js', opts)
    .transform(babelTransform);
};

gulp.task('build', function() {
  return browserified({
    standalone: 'coherence',
    debug: true,
  })
    .transform({global: true}, uglifyify)
    .bundle()
    .pipe(source('coherence.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});
