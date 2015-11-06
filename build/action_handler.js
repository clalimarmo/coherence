"use strict";

var ActionHandler = function ActionHandler() {
  var self = {};

  var actionHandlers = {};

  self.register = function (actionType, handler) {
    actionHandlers[actionType] = handler;
  };

  self.execute = function (action) {
    var handler = actionHandlers[action.type];
    if (handler) {
      handler(action);
    }
  };

  return self;
};

module.exports = ActionHandler;