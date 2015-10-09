var gulp = require('gulp');
var del = require('del');

gulp.task('build', function() {
  return del(['build/**/*']);
});
