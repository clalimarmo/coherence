const Bindings = function(component, bindMap, exposer) {
  bindMap = cleanedBindMap(bindMap);

  const self = {};
  const componentStateNames = Object.keys(bindMap);

  const bindings = componentStateNames.map((stateName) => {
    const modelAttr = bindMap[stateName];
    return Binding(component, stateName, exposer, modelAttr);
  });

  self.unbind = function() {
    bindings.forEach((binding) => {
      binding.unsubscribe();
    });
  };

  return self;

  function cleanedBindMap(bindMap) {
    const cleaned = bindMap || {};

    if (!bindMap) {
      exposer.exposed().forEach((modelAttr) => {
        cleaned[modelAttr] = modelAttr;
      });
    }

    return cleaned;
  };
};

const Binding = function(component, stateName, exposer, modelAttr) {
  return exposer.subscribe(modelAttr, (nextValue) => {
    component.setState({[stateName]: nextValue});
  });
};

module.exports = Bindings;
