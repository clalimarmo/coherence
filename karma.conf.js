module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'mocha', 'chai'],
    preprocessors: {
      'build/**/*_spec.js': ['browserify'],
    },
    files: [
      'build/**/*_spec.js',
    ],
    browserify: {
      debug: true,
      transform: ['babelify'],
    },
  });
};
