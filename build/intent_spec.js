'use strict';

require('core-js');
var expect = require('chai').expect;

var Intent = require('./intent');

describe('Intent:', function () {
  it('defines an subscribable, which yields payloads', function () {
    var crushedEnemies = [];

    var Crush = Intent(function (enemy) {
      return enemy;
    });

    Crush.subscribe(function (enemy) {
      crushedEnemies.push(enemy);
    });

    Crush('jeff');
    Crush('Giga-Fear');
    Crush('soda pop');

    expect(crushedEnemies).to.include('jeff');
    expect(crushedEnemies).to.include('Giga-Fear');
    expect(crushedEnemies).to.include('soda pop');
  });

  it('yields undefined payloads by default', function (done) {
    var FinishTest = Intent();
    FinishTest.subscribe(function (payload) {
      expect(payload).to.be.undefined;
      done();
    });
    FinishTest();
  });
});