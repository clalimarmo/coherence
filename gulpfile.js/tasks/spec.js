var gulp = require('gulp');
var karma = require('karma');

var configFile = __dirname + '/../../karma.conf.js';

gulp.task('spec', function(done) {
  var server = new karma.Server({
    singleRun: true,
    configFile: configFile,
  });
  server.on('run_complete', function (browsers, results) {
    done(results.error ? 'tests failed' : null);
  });
  server.start();
});
