'use strict';

require('babelify/polyfill');

var Coherence = require('./coherence');

describe('Coherence:', function () {
  var mocks;

  beforeEach(function () {
    mocks = {};
    mocks.dispatcher = {
      register: function register(callback) {
        mocks.dispatcher.dispatch = callback;
      }
    };
  });

  context('route registration:', function () {
    beforeEach(function () {
      mocks.routeHandler = function (route, params) {
        mocks.routeHandler.handledRoute = route;
        mocks.routeHandler.handledParams = params;
      };
    });

    it('adds handlers to be called for a matching "navigate" action', function () {
      Coherence(mocks.dispatcher, function (router, actionHandler, state) {
        router.register('/users/:userId', mocks.routeHandler);
      });

      mocks.dispatcher.dispatch({
        type: Coherence.NAVIGATE_ACTION_TYPE,
        path: '/users/5'
      });
      expect(mocks.routeHandler.handledRoute).to.eq('/users/5');
      expect(mocks.routeHandler.handledParams).to.be['instanceof'](Object);
      expect(mocks.routeHandler.handledParams.userId).to.eq('5');
    });
  });

  context('action handling:', function () {
    beforeEach(function () {
      mocks.actionHandler = function (action) {
        mocks.actionHandler.handledAction = action;
      };

      mocks.launch3MissilesAction = {
        type: 'launch-missiles',
        count: 3
      };
      mocks.launch5MissilesAction = {
        type: 'launch-missiles',
        count: 5
      };
      mocks.milk3GoatsAction = {
        type: 'milk-goats',
        count: 3
      };

      Coherence(mocks.dispatcher, function (router, actionHandler, state) {
        actionHandler.register('launch-missiles', mocks.actionHandler);
      });
    });

    it('calls action handlers that match a dispatched action', function () {
      mocks.dispatcher.dispatch(mocks.launch3MissilesAction);
      expect(mocks.actionHandler.handledAction).to.eq(mocks.launch3MissilesAction);
    });

    it('calls action handlers that match a dispatched action', function () {
      mocks.dispatcher.dispatch(mocks.launch5MissilesAction);
      expect(mocks.actionHandler.handledAction).to.eq(mocks.launch5MissilesAction);
    });

    it('does not call action handlers that do not match a dispatched action', function () {
      mocks.dispatcher.dispatch(mocks.milk3GoatsAction);
      expect(mocks.actionHandler.handledAction).to.not.eq(mocks.milk3GoatsAction);
    });
  });

  context('state changes', function () {
    beforeEach(function () {
      mocks.listener = function () {
        mocks.listener.callCount++;
      };
      mocks.listener.callCount = 0;
    });

    it('updates the exposed data', function () {
      var store = Coherence(mocks.dispatcher, function (router, actionHandler, state) {
        state.set({ mode: 'stun' });
      });

      expect(store.data()).to.deep.eq({
        mode: 'stun'
      });
    });

    it('fires change listeners', function () {
      var changeData;
      var store = Coherence(mocks.dispatcher, function (router, actionHandler, state) {
        changeData = function () {
          state.set({ mode: 'stun' });
        };
      });

      store.addChangeListener(mocks.listener);
      changeData();
      expect(mocks.listener.callCount).to.eq(1);
    });

    it('does not fire de-registered change listeners', function () {
      var changeData;
      var store = Coherence(mocks.dispatcher, function (router, actionHandler, state) {
        changeData = function () {
          state.set({ mode: 'stun' });
        };
      });

      store.addChangeListener(mocks.listener);
      store.removeChangeListener(mocks.listener);
      changeData();
      expect(mocks.listener.callCount).to.eq(0);
    });
  });

  context('public store methods:', function () {
    var store;

    context('path:', function () {
      beforeEach(function () {
        mocks.routeHandler = function () {};
        store = Coherence(mocks.dispatcher, function (router, actionHandler, state) {
          router.register('/users/:userId', mocks.routeHandler);
          router.register('/api', null, function (router) {
            router.register('/foods', mocks.routeHandler);
          });
        });
      });

      it('returns paths that match routes with handlers', function () {
        expect(store.path('users', 6)).to.eq('/users/6');
        expect(store.path('users', 'jimmy')).to.eq('/users/jimmy');
        expect(store.path('api', 'foods')).to.eq('/api/foods');
      });

      it('throws errors for paths scoping routes, without handlers', function () {
        expect(function () {
          store.path('api');
        }).to['throw'](Error);
      });

      it('throws errors for paths that do not match routes', function () {
        expect(function () {
          store.path('users');
        }).to['throw'](Error);
        expect(function () {
          store.path('gremlins');
        }).to['throw'](Error);
      });
    });
  });
});