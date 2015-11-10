const ReactSubscriber = function(exposer) {
  const self = {};

  self.subscribe = function(component, bindingNames) {
    bindingNames = cleanBindingNames(bindingNames);

    const subscriptions = ReactSubscriptions();
    Object.keys(bindingNames).forEach((exposedName) => {
      const subscription = exposer.subscribe(
        exposedName,
        (nextVal) => {
          const nextState = {};
          nextState[bindingNames[exposedName]] = nextVal;
          component.setState(nextState);
        }
      );
      subscriptions.add(subscription);
    });
    return subscriptions;
  };

  function cleanBindingNames(bindingNames) {
    if (!((bindingNames instanceof Array) || typeof bindingNames === 'object')) {
      throw new Error('subscribe expects bindingNames to be either an Array of exposedNames, object, mapping exposed names, to component state property names');
    }

    if (bindingNames instanceof Array) {
      const exposedNames = bindingNames;
      bindingNames = {};
      exposedNames.forEach((name) => {
        bindingNames[name] = name;
      });
    }

    return bindingNames;
  }

  return self;
};

const ReactSubscriptions = function() {
  const self = {};
  const subscriptions = [];

  self.add = function(subscription) {
    subscriptions.push(subscription);
  };

  self.unsubscribe = function() {
    subscriptions.forEach((subscription) => {
      subscription.dispose();
    });
  };

  return self;
};

module.exports = ReactSubscriber;
