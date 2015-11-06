'use strict';

require('core-js');

var setImmutableAttribute = require('./util/set_immutable_attribute');

var ActionHandler = require('./action_handler');
var Data = require('./data');
var Router = require('dumb-router');

var NAVIGATE_ACTION_TYPE = 'navigate';

var Coherence = function Coherence(dispatcher, configure) {
  var router = Router();
  var state = Data();
  var actionHandler = ActionHandler();

  configure(router, actionHandler, state);

  var storeMethods = {
    path: router.path,
    data: state.data,
    addChangeListener: state.addChangeListener,
    removeChangeListener: state.removeChangeListener
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