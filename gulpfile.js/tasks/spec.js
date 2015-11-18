var babel = require('gulp-babel');
var gutil = require('gulp-util');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var del = require('del');
var argv = require('yargs').argv;

gulp.task('spec', ['spec:build'], function(done) {
  var testFilePattern = argv.files || '**/*spec.js';
  return gulp.src('.tmp/compiled_tests/' + testFilePattern)
    .pipe(mocha())
    .once('error', function() {
      process.exit(1);
      done();
    })
    .once('end', function() {
      process.exit();
      done();
    })
    ;
});

gulp.task('spec:build', ['lint', 'spec:clean'], function(done) {
  return gulp.src('src/**/*.js')
    .pipe(
      babel().on('error', function(err) {
        gutil.log(gutil.colors.red(err));
        this.emit('end');
      })
    )
    .pipe(gulp.dest('./.tmp/compiled_tests/'));
});

gulp.task('spec:clean', function() {
  return del([
    '.tmp/compiled_tests',
  ]);
});

gulp.task('spec:watch', function() {
  gulp.watch(['src/**/*'], ['spec']);
});
