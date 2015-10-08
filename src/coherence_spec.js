require('babelify/polyfill');

const Coherence = require('./coherence');

describe('Coherence:', () => {
  var mocks;
  var coherence;

  beforeEach(() => {
    mocks = {};
    mocks.dispatcher = {
      register: (callback) => {
        mocks.dispatcher.dispatch = callback;
      },
    };
    coherence = Coherence({dispatcher: mocks.dispatcher});
  });

  context('store definition:', () => {
    var storeDefinition;

    beforeEach(() => {
      storeDefinition = coherence;
    });

    context('route registration:', () => {
      beforeEach(() => {
        mocks.routeHandler = (route, params) => {
          mocks.routeHandler.handledRoute = route;
          mocks.routeHandler.handledParams = params;
        };
      });

      it('adds handlers to be called for a matching "navigate" action', () => {
        storeDefinition.registerRoute('/users/:userId', mocks.routeHandler);

        mocks.dispatcher.dispatch({
          type: Coherence.NAVIGATE_ACTION_TYPE,
          path: '/users/5',
        });
        expect(mocks.routeHandler.handledRoute).to.eq('/users/5');
        expect(mocks.routeHandler.handledParams).to.be.instanceof(Object);
        expect(mocks.routeHandler.handledParams.userId).to.eq('5');
      });
    });

    context('action handling:', () => {
    });

    context('data mutation', () => {
    });
  });
});
