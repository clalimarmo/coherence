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

  context('navigate', () => {
    it('yields path to subscribers', () => {
      Location.navigate('/enemies/jeff');
      Location.navigate('/enemies/kate');

      expect(crushedEnemiesPaths).to.include('/enemies/jeff');
      expect(crushedEnemiesPaths).to.include('/enemies/kate');
    });
  });

  context('redirect', () => {
    it('yields path to subscribers', () => {
      Location.redirect('/enemies/jeff');
      Location.redirect('/enemies/kate');

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

    context('navigate', () => {
      it('uses history.pushState', () => {
        Location.navigate('/foo');
        expect(mocks.window.history.pushState.args[0][0].path).to.eq('/foo');
        expect(mocks.window.history.pushState.args[0][2]).to.eq('/foo');
      });

      it('does not navigate without history.pushState, with false option', () => {
        Location.navigate('/foo', false);
        expect(mocks.window.history.pushState.args.length).to.eq(0);
      });
    });

    context('redirect', () => {
      it('uses history.replaceState', () => {
        Location.redirect('/foo');
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
