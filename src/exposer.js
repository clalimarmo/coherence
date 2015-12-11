const BehaviorSubject = require('rx-lite').BehaviorSubject;

const Exposer = function() {
  const self = {};
  const observables = {};

  self.expose = function(name, initialValue) {
    if (observables[name]) {
      throw new Error(`${name} has already been exposed`);
    }
    observables[name] = new BehaviorSubject(initialValue);
    return Exposed(observables[name]);
  };

  self.subscribe = function(name, ...observerArgs) {
    if (!observables[name]) {
      throw new Error(`${name} has not been exposed`);
    }
    return observables[name].subscribe(...observerArgs);
  };

  self.exposed = function() {
    return Object.keys(observables);
  };

  return self;
};

const Exposed = function(subject) {
  return {
    push: function(...args) {
      subject.onNext(...args);
    },

    value: function() {
      return subject.getValue();
    },
  };
};

module.exports = Exposer;
