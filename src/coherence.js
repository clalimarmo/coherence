require('core-js');

const setImmutableAttribute = require('./util/set_immutable_attribute');

const ActionHandler = require('./action_handler');
const Data = require('./data');
const Router = require('dumb-router');

const NAVIGATE_ACTION_TYPE = 'navigate';

const Coherence = function(dispatcher, configure) {
  const router = Router();
  const state = Data();
  const actionHandler = ActionHandler();

  configure(router, actionHandler, state);

  const storeMethods = {
    path: router.path,
    data: state.data,
    addChangeListener: state.addChangeListener,
    removeChangeListener: state.removeChangeListener,
  };

  actionHandler.register(NAVIGATE_ACTION_TYPE, navigate);
  dispatcher.register(actionHandler.execute);

  return storeMethods;

  function navigate(action) {
    router.execute(action.path);
  };
};

setImmutableAttribute(Coherence, 'NAVIGATE_ACTION_TYPE', NAVIGATE_ACTION_TYPE);
module.exports = Coherence;
