'use strict';

require('core-js');
var expect = require('chai').expect;

var Exposer = require('./exposer');

describe('Exposer', function () {
  it('defines attributes whose values can be inspected', function () {
    var exposer = Exposer();
    var attribute = exposer.expose('attribute');
    attribute.push('a value');
    expect(attribute.value()).to.eq('a value');
  });

  it('defines attributes whose values can be subscribed to', function (done) {
    var exposer = Exposer();
    var attribute = exposer.expose('attribute');
    attribute.push('a value');
    exposer.subscribe('attribute', function (value) {
      expect(value).to.eq('a value');
      done();
    });
  });
});