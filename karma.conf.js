module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'mocha', 'chai'],
    preprocessors: {
      'src/**/*_spec.js': ['browserify'],
    },
    files: [
      'src/**/*_spec.js',
    ],
    browserify: {
      debug: true,
      transform: ['babelify'],
    },
  });
};
