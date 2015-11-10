'use strict';

var ReactSubscriber = function ReactSubscriber(exposer) {
  var self = {};

  self.subscribe = function (component, bindingNames) {
    bindingNames = cleanBindingNames(bindingNames);

    var subscriptions = ReactSubscriptions();
    Object.keys(bindingNames).forEach(function (exposedName) {
      var subscription = exposer.subscribe(exposedName, function (nextVal) {
        var nextState = {};
        nextState[bindingNames[exposedName]] = nextVal;
        component.setState(nextState);
      });
      subscriptions.add(subscription);
    });
    return subscriptions;
  };

  function cleanBindingNames(bindingNames) {
    if (!(bindingNames instanceof Array || typeof bindingNames === 'object')) {
      throw new Error('subscribe expects bindingNames to be either an Array of exposedNames, object, mapping exposed names, to component state property names');
    }

    if (bindingNames instanceof Array) {
      var exposedNames = bindingNames;
      bindingNames = {};
      exposedNames.forEach(function (name) {
        bindingNames[name] = name;
      });
    }

    return bindingNames;
  }

  return self;
};

var ReactSubscriptions = function ReactSubscriptions() {
  var self = {};
  var subscriptions = [];

  self.add = function (subscription) {
    subscriptions.push(subscription);
  };

  self.unsubscribe = function () {
    subscriptions.forEach(function (subscription) {
      subscription.dispose();
    });
  };

  return self;
};

module.exports = ReactSubscriber;