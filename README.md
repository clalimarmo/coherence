# Coherence

A Flux Store implementation, designed for ease and safety.

## Usage

### Defining a Store

```javascript
var Coherence = require('coherence');

function AnimalStore(dependencies) {
  var coherence = Coherence({dispatcher: dependencies.dispatcher});
  var animalData = MyAnimalDataSource();

  coherence.registerHandler('speak', speak);
  coherence.registerRoute('/animals/:animalId', show);

  function speak(action) {
    coherence.set('words', action.words);
  }

  function show(path, params) {
    animalData.fetch(params.animalId)
      .then(function(animal) {
        coherence.set('currentAnimal', animal);
      });
  }

  return coherence.fluxSafe();
}

AnimalStore.singleton = AnimalStore({dispatcher: appDispatcher});

module.exports = AnimalStore;
```

### Using your Store

#### In your controller components

```javascript
var animalStore = require('./animal_store').singleton;
var AnimalView = React.createClass({
  componentWillMount: function() {
    animalStore.addChangeListener(this.updateState);
  },
  componentWillUnmount: function() {
    animalStore.removeChangeListener(this.updateState);
  },
  updateState: function() {
    this.setState({animalData: animalStore.data()});
  },
  render: function() {
    return (<div>...</div>);
  }
});
```

#### When dispatching

## Features

Coherence exposes a two-layered API.

The first layer exposes "unsafe" methods, that should only be used inside your
Store class, to define the behavior of your Store, in terms of routes and route
handlers, actions and action handlers, and state mutations.

The second layer is comprised of the methods returned by `fluxSafe`,
which are data getters, and event subscribe/unsubscribe methods, to be used
by your Store's consumers.

### API

#### var coherence = Coherence()

returns the coherence instance, with the following methods

##### coherence.registerRoute(routeString, routeHandler)

binds a handler function that gets called when a matching "navigate" action is
dispatched (see below for routing) - see
[dumb-router](https://github.com/clalimarmo/dumb-router) for more information

##### coherence.handleAction(actionType, actionHandler)

binds a handler function that gets called when a matching action is dispatched

##### coherence.setData(key, value)

updates the values returned by `coherence.fluxSafe().data()`, and triggers the
event handlers bound by `coherence.fluxSafe().addChangeListener()`

#### var yourStore = coherence.fluxSafe()

returns the following "Flux Safe" methods

##### yourStore.addChangeListener(callback)

binds the callback to be invoked, whenever `coherence.setData` is called, for use
when mounting controller components

##### yourStore.removeChangeListener(callback)

removes the change callbacks, for use when unmounting controller components

##### yourStore.data()

returns any data set by `coherence.setData`

##### yourStore.path(...pathParts)

returns a path string, if the parts match one of the routes registered by
`coherence.registerRoute` - see [dumb-router](https://github.com/clalimarmo/dumb-router)
for more information
