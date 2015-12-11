'use strict';

var BehaviorSubject = require('rx-lite').BehaviorSubject;

var Exposer = function Exposer() {
  var self = {};
  var observables = {};

  self.expose = function (name, initialValue) {
    if (observables[name]) {
      throw new Error(name + ' has already been exposed');
    }
    observables[name] = new BehaviorSubject(initialValue);
    return Exposed(observables[name]);
  };

  self.subscribe = function (name) {
    var _observables$name;

    if (!observables[name]) {
      throw new Error(name + ' has not been exposed');
    }

    for (var _len = arguments.length, observerArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      observerArgs[_key - 1] = arguments[_key];
    }

    return (_observables$name = observables[name]).subscribe.apply(_observables$name, observerArgs);
  };

  self.exposed = function () {
    return Object.keys(observables);
  };

  return self;
};

var Exposed = function Exposed(subject) {
  return {
    push: function push() {
      subject.onNext.apply(subject, arguments);
    },

    value: function value() {
      return subject.getValue();
    }
  };
};

module.exports = Exposer;