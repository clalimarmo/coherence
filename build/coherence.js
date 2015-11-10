'use strict';

require('core-js');

var setImmutableAttribute = require('./util/set_immutable_attribute');

var ActionHandler = require('./action_handler');
var Exposer = require('./exposer');
var Router = require('dumb-router');
var ReactSubscriber = require('./react_subscriber');

var NAVIGATE_ACTION_TYPE = 'navigate';

var Coherence = function Coherence(dispatcher, configure) {
  var self = {};

  var router = Router();
  var actionHandler = ActionHandler();
  var exposer = Exposer();
  var reactSubscriber = ReactSubscriber(exposer);

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