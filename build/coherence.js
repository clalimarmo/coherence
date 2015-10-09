'use strict';

require('core-js');

var setImmutableAttribute = require('./util/set_immutable_attribute');

var Data = require('./data');
var Router = require('dumb-router');

var NAVIGATE_ACTION_TYPE = 'navigate';

var Coherence = function Coherence(dependencies) {
  var self = {};
  var router = Router();
  var data = Data();

  var actionHandlers = {};

  self.registerRoute = router.register;

  self.handleAction = function (actionType, handler) {
    actionHandlers[actionType] = handler;
  };

  self.setData = data.set;

  self.fluxSafe = function () {
    return {
      path: router.path,
      data: data.data,
      addChangeListener: data.addChangeListener,
      removeChangeListener: data.removeChangeListener
    };
  };

  dependencies.dispatcher.register(function (action) {
    var handler = actionHandlers[action.type];
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