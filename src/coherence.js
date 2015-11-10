require('core-js');

const setImmutableAttribute = require('./util/set_immutable_attribute');

const ActionHandler = require('./action_handler');
const Exposer = require('./exposer');
const Router = require('dumb-router');
const ReactSubscriber = require('./react_subscriber');

const NAVIGATE_ACTION_TYPE = 'navigate';

const Coherence = function(dispatcher, configure) {
  const self = {};

  const router = Router();
  const actionHandler = ActionHandler();
  const exposer = Exposer();
  const reactSubscriber = ReactSubscriber(exposer);

  self.path = router.path;

  self.subscribe = reactSubscriber.subscribe;

  initialize();
  return self;

  function initialize() {
    actionHandler.register(NAVIGATE_ACTION_TYPE, navigate);
    dispatcher.register(actionHandler.execute);
    configure(router, actionHandler, exposer.expose);
  }

  function navigate(action) {
    router.execute(action.path);
  };
};

setImmutableAttribute(Coherence, 'NAVIGATE_ACTION_TYPE', NAVIGATE_ACTION_TYPE);
module.exports = Coherence;
