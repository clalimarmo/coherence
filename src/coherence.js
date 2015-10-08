const setImmutableAttribute = require('./util/set_immutable_attribute');

const Data = require('./data');
const Router = require('dumb-router');

const NAVIGATE_ACTION_TYPE = 'navigate';

const Coherence = function(dependencies) {
  const self = {};
  const router = Router();
  const data = Data();

  const actionHandlers = {};

  self.registerRoute = router.register;

  self.handleAction = function(actionType, handler) {
    actionHandlers[actionType] = handler;
  };

  self.setData = data.set;

  self.fluxSafe = function() {
    return {
      path: router.path,
      data: data.data,
      addChangeListener: data.addChangeListener,
      removeChangeListener: data.removeChangeListener,
    };
  };

  dependencies.dispatcher.register(function(action) {
    const handler = actionHandlers[action.type];
    if (handler) {
      handler(action);
    }
  });

  self.handleAction(NAVIGATE_ACTION_TYPE, navigate);

  return self;

  function navigate(action) {
    router.execute(action.path);
  };
};

setImmutableAttribute(Coherence, 'NAVIGATE_ACTION_TYPE', NAVIGATE_ACTION_TYPE);
module.exports = Coherence;
