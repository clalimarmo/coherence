const Exposer = require('./exposer');
const Bindings = require('./bindings');

const METHOD_BLACKLIST = [
  'ReactBindings',
];

const Model = function(configurer) {
  const model = {};
  const exposer = Exposer();

  model.ReactBindings = function(component, bindMap) {
    return Bindings(component, bindMap, exposer);
  };

  configurer(exposer.expose, def);

  function def(methodName, method) {
    if (METHOD_BLACKLIST.includes(methodName)) {
      throw new Error(`${methodName} is a reserved method for Coherence.Model`);
    }
    model[methodName] = method;
  }

  return model;
};

module.exports = Model;
