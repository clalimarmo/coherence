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

  context('route registration:', () => {
    beforeEach(() => {
      mocks.routeHandler = (route, params) => {
        mocks.routeHandler.handledRoute = route;
        mocks.routeHandler.handledParams = params;
      };
    });

    it('adds handlers to be called for a matching "navigate" action', () => {
      coherence.registerRoute('/users/:userId', mocks.routeHandler);

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
      coherence.handleAction('launch-missiles', mocks.actionHandler);

      mocks.dispatcher.dispatch(mocks.launch3MissilesAction);
      expect(mocks.actionHandler.handledAction).to.eq(mocks.launch3MissilesAction);
    });

    it('calls action handlers that match a dispatched action', () => {
      coherence.handleAction('launch-missiles', mocks.actionHandler);

      mocks.dispatcher.dispatch(mocks.launch5MissilesAction);
      expect(mocks.actionHandler.handledAction).to.eq(mocks.launch5MissilesAction);
    });

    it('does not call action handlers that do not match a dispatched action', () => {
      coherence.handleAction('launch-missiles', mocks.actionHandler);

      mocks.dispatcher.dispatch(mocks.milk3GoatsAction);
      expect(mocks.actionHandler.handledAction).to.not.eq(mocks.milk3GoatsAction);
    });
  });

  context('data mutation', () => {
    beforeEach(() => {
      mocks.listener = () => {
        mocks.listener.callCount++;
      }
      mocks.listener.callCount = 0;
    });

    it('updates the exposed data', () => {
      coherence.setData('mode', 'stun');
      expect(coherence.fluxSafe().data()).to.deep.eq({
        mode: 'stun',
      });
    });

    it('fires change listeners', () => {
      coherence.fluxSafe().addChangeListener(mocks.listener);
      coherence.setData('power level', 9007);
      expect(mocks.listener.callCount).to.eq(1);
    });

    it('does not fire de-registered change listeners', () => {
      coherence.fluxSafe().addChangeListener(mocks.listener);
      coherence.fluxSafe().removeChangeListener(mocks.listener);
      coherence.setData('power level', 9007);
      expect(mocks.listener.callCount).to.eq(0);
    });
  });

  context('fluxSafe methods:', () => {
    var fluxSafe;

    beforeEach(() => {
      fluxSafe = coherence.fluxSafe();
    });

    context('path:', () => {
      beforeEach(() => {
        mocks.routeHandler = () => {};
        coherence.registerRoute('/users/:userId', mocks.routeHandler);
        coherence.registerRoute('/api', null, (router) => {
          router.register('/foods', mocks.routeHandler);
        });
      });

      it('returns paths that match routes with handlers', () => {
        expect(fluxSafe.path('users', 6)).to.eq('/users/6');
        expect(fluxSafe.path('users', 'jimmy')).to.eq('/users/jimmy');
        expect(fluxSafe.path('api', 'foods')).to.eq('/api/foods');
      });

      it('throws errors for paths scoping routes, without handlers', () => {
        expect(() => { fluxSafe.path('api'); }).to.throw(Error);
      });

      it('throws errors for paths that do not match routes', () => {
        expect(() => { fluxSafe.path('users'); }).to.throw(Error);
        expect(() => { fluxSafe.path('gremlins'); }).to.throw(Error);
      });
    });
  });
});
