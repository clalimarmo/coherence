require('core-js');
const expect = require('chai').expect;
const sinon = require('sinon');
const Coherence = require('./coherence');

describe('Coherence.LocationFactory:', () => {
  var Location;
  var crushedEnemiesPaths;

  beforeEach(() => {
    Location = Coherence.LocationFactory();

    crushedEnemiesPaths = [];

    Location.subscribe((path) => {
      crushedEnemiesPaths.push(path);
    });
  });

  context('Navigate', () => {
    it('yields path to subscribers', () => {
      Location.Navigate('/enemies/jeff');
      Location.Navigate('/enemies/kate');

      expect(crushedEnemiesPaths).to.include('/enemies/jeff');
      expect(crushedEnemiesPaths).to.include('/enemies/kate');
    });
  });

  context('Redirect', () => {
    it('yields path to subscribers', () => {
      Location.Redirect('/enemies/jeff');
      Location.Redirect('/enemies/kate');

      expect(crushedEnemiesPaths).to.include('/enemies/jeff');
      expect(crushedEnemiesPaths).to.include('/enemies/kate');
    });
  });

  context('with window', () => {
    var mocks;
    beforeEach(() => {
      mocks = {};
      mocks.window = {};
      mocks.window.history = {};
      mocks.window.history.pushState = sinon.spy();
      mocks.window.history.replaceState = sinon.spy();

      Location = Coherence.LocationFactory(mocks.window);
    });

    context('Navigate', () => {
      it('uses history.pushState', () => {
        Location.Navigate('/foo');
        expect(mocks.window.history.pushState.args[0][0].path).to.eq('/foo');
        expect(mocks.window.history.pushState.args[0][2]).to.eq('/foo');
      });

      it('does not Navigate without history.pushState, with false option', () => {
        Location.Navigate('/foo', false);
        expect(mocks.window.history.pushState.args.length).to.eq(0);
      });
    });

    context('Redirect', () => {
      it('uses history.replaceState', () => {
        Location.Redirect('/foo');
        expect(mocks.window.history.replaceState.args[0][0].path).to.eq('/foo');
        expect(mocks.window.history.replaceState.args[0][2]).to.eq('/foo');
      });
    });

    context('browser back (window.onpopstate)', () => {
      beforeEach(() => {
        mocks.backEvent = {
          state: {
            path: '/enemies/larry',
          },
        };
      });

      it('yields to subscribers', () => {
        Location.subscribe((path) => {
          crushedEnemiesPaths.push(path);
        });
        mocks.window.onpopstate(mocks.backEvent);
        expect(crushedEnemiesPaths).to.include('/enemies/larry');
      });
    });
  });
});
