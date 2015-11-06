const ActionHandler = function() {
  const self = {};

  const actionHandlers = {};

  self.register = function(actionType, handler) {
    actionHandlers[actionType] = handler;
  };

  self.execute = function(action) {
    const handler = actionHandlers[action.type];
    if (handler) {
      handler(action);
    }
  };

  return self;
};

module.exports = ActionHandler;
