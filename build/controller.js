'use strict';

var ActionHandler = require('./action_handler');
var Router = require('dumb-router');
var NAVIGATE = require('./navigate_action_type');

var Controller = function Controller(dispatcher, configure) {
  var self = {};

  var router = Router();
  var actionHandler = ActionHandler();

  self.path = router.path;

  function initialize() {
    actionHandler.register(NAVIGATE, navigate);
    dispatcher.register(actionHandler.execute);
    configure(router, actionHandler);
  }

  function navigate(action) {
    router.execute(action.path);
  }

  initialize();
  return self;
};

module.exports = Controller;