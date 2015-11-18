'use strict';

var Exposer = require('./exposer');
var Bindings = require('./bindings');

var METHOD_BLACKLIST = ['ReactBindings'];

var Model = function Model(configurer) {
  var model = {};
  var exposer = Exposer();

  model.ReactBindings = function (component, bindMap) {
    return Bindings(component, bindMap, exposer);
  };

  configurer(exposer.expose, def);

  function def(methodName, method) {
    if (METHOD_BLACKLIST.includes(methodName)) {
      throw new Error(methodName + ' is a reserved method for Coherence.Model');
    }
    model[methodName] = method;
  }

  return model;
};

module.exports = Model;