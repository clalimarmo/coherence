const ActionHandler = require('./action_handler');
const Router = require('dumb-router');
const NAVIGATE = require('./navigate_action_type');

const Controller = function(dispatcher, configure) {
  const self = {};

  const router = Router();
  const actionHandler = ActionHandler();

  self.path = router.path;

  initialize();
  return self;

  function initialize() {
    actionHandler.register(NAVIGATE, navigate);
    dispatcher.register(actionHandler.execute);
    configure(router, actionHandler);
  }

  function navigate(action) {
    router.execute(action.path);
  };
};

module.exports = Controller;
