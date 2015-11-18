require('babelify/polyfill');

const Coherence = require('./coherence');

describe('Coherence.Controller:', () => {
  var mocks;

  beforeEach(() => {
    mocks = {};
    mocks.dispatcher = {
      register: (callback) => {
        mocks.dispatcher.dispatch = callback;
      },
    };
  });

  context('route registration:', () => {
    beforeEach(() => {
      mocks.routeHandler = (route, params) => {
        mocks.routeHandler.handledRoute = route;
        mocks.routeHandler.handledParams = params;
      };
    });

    it('adds handlers to be called for a matching "navigate" action', () => {
      Coherence.Controller(mocks.dispatcher, (router, actions, expose) => {
        router.register('/users/:userId', mocks.routeHandler);
      });

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

      Coherence.Controller(mocks.dispatcher, (router, actions, expose) => {
        actions.register('launch-missiles', mocks.actionHandler);
      });
    });

    it('calls action handlers that match a dispatched action', () => {
      mocks.dispatcher.dispatch(mocks.launch3MissilesAction);
      expect(mocks.actionHandler.handledAction).to.eq(mocks.launch3MissilesAction);
    });

    it('calls action handlers that match a dispatched action', () => {
      mocks.dispatcher.dispatch(mocks.launch5MissilesAction);
      expect(mocks.actionHandler.handledAction).to.eq(mocks.launch5MissilesAction);
    });

    it('does not call action handlers that do not match a dispatched action', () => {
      mocks.dispatcher.dispatch(mocks.milk3GoatsAction);
      expect(mocks.actionHandler.handledAction).to.not.eq(mocks.milk3GoatsAction);
    });
  });

  context('path:', () => {
    var store;
    beforeEach(() => {
      mocks.routeHandler = () => {};
      store = Coherence.Controller(mocks.dispatcher, (router, actions, expose) => {
        router.register('/users/:userId', mocks.routeHandler);
        router.register('/api', null, (router) => {
          router.register('/foods', mocks.routeHandler);
        });
      });
    });

    it('returns paths that match routes with handlers', () => {
      expect(store.path('users', 6)).to.eq('/users/6');
      expect(store.path('users', 'jimmy')).to.eq('/users/jimmy');
      expect(store.path('api', 'foods')).to.eq('/api/foods');
    });

    it('throws errors for paths scoping routes, without handlers', () => {
      expect(() => { store.path('api'); }).to.throw(Error);
    });

    it('throws errors for paths that do not match routes', () => {
      expect(() => { store.path('users'); }).to.throw(Error);
      expect(() => { store.path('gremlins'); }).to.throw(Error);
    });
  });
});
