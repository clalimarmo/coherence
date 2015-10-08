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
      beforeEach(() => {
        mocks.actionHandler = (action) => {
          mocks.actionHandler.handledAction = action;
        };

        mocks.launch3MissilesAction = {
          type: 'launch-missiles',
          count: 3,
        };
        mocks.launch5MissilesAction = {
          type: 'launch-missiles',
          count: 5,
        };
        mocks.milk3GoatsAction = {
          type: 'milk-goats',
          count: 3,
        };
      });

      it('calls action handlers that match a dispatched action', () => {
        storeDefinition.handleAction('launch-missiles', mocks.actionHandler);

        mocks.dispatcher.dispatch(mocks.launch3MissilesAction);
        expect(mocks.actionHandler.handledAction).to.eq(mocks.launch3MissilesAction);
      });

      it('calls action handlers that match a dispatched action', () => {
        storeDefinition.handleAction('launch-missiles', mocks.actionHandler);

        mocks.dispatcher.dispatch(mocks.launch5MissilesAction);
        expect(mocks.actionHandler.handledAction).to.eq(mocks.launch5MissilesAction);
      });

      it('does not call action handlers that do not match a dispatched action', () => {
        storeDefinition.handleAction('launch-missiles', mocks.actionHandler);

        mocks.dispatcher.dispatch(mocks.milk3GoatsAction);
        expect(mocks.actionHandler.handledAction).to.not.eq(mocks.milk3GoatsAction);
      });
    });

    context('data mutation', () => {
    });
  });
});
