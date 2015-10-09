# Coherence

A Flux Store implementation, designed for ease and safety

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

## Features

Coherence exposes a two-layered API.

The first layer exposes "unsafe" methods, that should only be used inside your
Store class. These methods allow you to define the behavior of your Store, in terms of:

- routes and route handlers
- actions and action handlers
- state mutations

The second layer is comprised of the methods intended for external use (e.g. by
React Components). These are returned by `fluxSafe`:

- data getters
- event subscribe/unsubscribe methods

### Routing

"Routing" with Coherence, is really just a wrapper around action handling, with
route matching and param parsing baked in (via
[dumb-router](https://github.com/clalimarmo/dumb-router)).

Registered routes listen for Actions with a type of
`Coherence.NAVIGATE_ACTION_TYPE`, and with a `path` property.

To trigger your routes:

```javascript
yourDispatcher.dispatch({
  type: Coherence.NAVIGATE_ACTION_TYPE,
  path: whereYouWantToGo,
});
```

## API

### Coherence

- __Coherence.NAVIGATE_ACTION_TYPE__
  - the action type to which registered routes will respond

### Coherence() - Store Definition Methods

- __registerRoute(routeString, routeHandler)__
  - binds a handler function that gets called when a matching "navigate" action
    is dispatched - see
    [dumb-router](https://github.com/clalimarmo/dumb-router#dumb-router) for more
    information

- __handleAction(actionType, actionHandler)__
  - binds a handler function that gets called when a matching action is dispatched

- __setData(key, value)__
  - updates the values returned by `.fluxSafe().data()`, and triggers the event
    handlers bound by `.fluxSafe().addChangeListener()`

### .fluxSafe() - Public Instance Methods

- __addChangeListener(callback)__
  - binds the callback to be invoked, whenever `coherence.setData` is called,
    for use when mounting controller components

- __removeChangeListener(callback)__
  - removes the change callbacks, for use when unmounting controller components

- __data()__
  - returns any data set by `coherence.setData`

- __path(...pathParts)__
  - returns a path string, if the parts match one of the routes registered by
    `coherence.registerRoute` - see
    [dumb-router](https://github.com/clalimarmo/dumb-router#dumb-router) for
    more information

## Development

Add or modify tests to reflect the change you want.

Run them with `npm test`, and update the code in `src/` till your tests pass.

Running the tests will run `npm run compile`, which outputs the code as ES5,
polyfilled via `core-js`.
