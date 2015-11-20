'use strict';

require('core-js');
var expect = require('chai').expect;
var sinon = require('sinon');
var Coherence = require('./coherence');

describe('Coherence.LocationFactory:', function () {
  var Location;
  var crushedEnemiesPaths;

  beforeEach(function () {
    Location = Coherence.LocationFactory();

    crushedEnemiesPaths = [];

    Location.subscribe(function (path) {
      crushedEnemiesPaths.push(path);
    });
  });

  context('navigate', function () {
    it('yields path to subscribers', function () {
      Location.navigate('/enemies/jeff');
      Location.navigate('/enemies/kate');

      expect(crushedEnemiesPaths).to.include('/enemies/jeff');
      expect(crushedEnemiesPaths).to.include('/enemies/kate');
    });
  });

  context('redirect', function () {
    it('yields path to subscribers', function () {
      Location.redirect('/enemies/jeff');
      Location.redirect('/enemies/kate');

      expect(crushedEnemiesPaths).to.include('/enemies/jeff');
      expect(crushedEnemiesPaths).to.include('/enemies/kate');
    });
  });

  context('with window', function () {
    var mocks;
    beforeEach(function () {
      mocks = {};
      mocks.window = {};
      mocks.window.history = {};
      mocks.window.history.pushState = sinon.spy();
      mocks.window.history.replaceState = sinon.spy();

      Location = Coherence.LocationFactory(mocks.window);
    });

    context('navigate', function () {
      it('uses history.pushState', function () {
        Location.navigate('/foo');
        expect(mocks.window.history.pushState.args[0][0].path).to.eq('/foo');
        expect(mocks.window.history.pushState.args[0][2]).to.eq('/foo');
      });

      it('does not navigate without history.pushState, with false option', function () {
        Location.navigate('/foo', false);
        expect(mocks.window.history.pushState.args.length).to.eq(0);
      });
    });

    context('redirect', function () {
      it('uses history.replaceState', function () {
        Location.redirect('/foo');
        expect(mocks.window.history.replaceState.args[0][0].path).to.eq('/foo');
        expect(mocks.window.history.replaceState.args[0][2]).to.eq('/foo');
      });
    });

    context('browser back (window.onpopstate)', function () {
      beforeEach(function () {
        mocks.backEvent = {
          state: {
            path: '/enemies/larry'
          }
        };
      });

      it('yields to subscribers', function () {
        Location.subscribe(function (path) {
          crushedEnemiesPaths.push(path);
        });
        mocks.window.onpopstate(mocks.backEvent);
        expect(crushedEnemiesPaths).to.include('/enemies/larry');
      });
    });
  });
});