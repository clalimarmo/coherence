var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function(done) {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint({
      env: ['browser', 'commonjs', 'mocha'],
      globals: {
        'expect': true,
      },
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    ;
});
