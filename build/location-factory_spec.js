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

  context('Navigate', function () {
    it('yields path to subscribers', function () {
      Location.Navigate('/enemies/jeff');
      Location.Navigate('/enemies/kate');

      expect(crushedEnemiesPaths).to.include('/enemies/jeff');
      expect(crushedEnemiesPaths).to.include('/enemies/kate');
    });
  });

  context('Redirect', function () {
    it('yields path to subscribers', function () {
      Location.Redirect('/enemies/jeff');
      Location.Redirect('/enemies/kate');

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

    context('Navigate', function () {
      it('uses history.pushState', function () {
        Location.Navigate('/foo');
        expect(mocks.window.history.pushState.args[0][0].path).to.eq('/foo');
        expect(mocks.window.history.pushState.args[0][2]).to.eq('/foo');
      });

      it('does not try to use history.pushState, if it is not there', function () {
        delete mocks.window.history.pushState;
        expect(function () {
          Location.Navigate('/foo');
        }).to.not['throw'](Error);
      });
    });

    context('Redirect', function () {
      it('uses history.replaceState', function () {
        Location.Redirect('/foo');
        expect(mocks.window.history.replaceState.args[0][0].path).to.eq('/foo');
        expect(mocks.window.history.replaceState.args[0][2]).to.eq('/foo');
      });

      it('does not try to use history.replaceState, if it is not there', function () {
        delete mocks.window.history.replaceState;
        expect(function () {
          Location.Redirect('/foo');
        }).to.not['throw'](Error);
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