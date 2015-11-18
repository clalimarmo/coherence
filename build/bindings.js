"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Bindings = function Bindings(component, bindMap, exposer) {
  bindMap = cleanedBindMap(bindMap);

  var self = {};
  var componentStateNames = Object.keys(bindMap);

  var bindings = componentStateNames.map(function (stateName) {
    var modelAttr = bindMap[stateName];
    return Binding(component, stateName, exposer, modelAttr);
  });

  self.unbind = function () {
    bindings.forEach(function (binding) {
      binding.dispose();
    });
  };

  function cleanedBindMap(bindMap) {
    var cleaned = bindMap || {};

    if (!bindMap) {
      exposer.exposed().forEach(function (modelAttr) {
        cleaned[modelAttr] = modelAttr;
      });
    }

    return cleaned;
  }

  return self;
};

var Binding = function Binding(component, stateName, exposer, modelAttr) {
  return exposer.subscribe(modelAttr, function (nextValue) {
    component.setState(_defineProperty({}, stateName, nextValue));
  });
};

module.exports = Bindings;