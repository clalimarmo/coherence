# Coherence

A safety oriented Flux Store factory

## Usage

### Defining a Store

```javascript
var Coherence = require('coherence');

function AnimalStore(dependencies) {
  var animalData = dependencies.animalData;

  var store = Coherence(dependencies.dispatcher, function(router, actions, state) {
    router.register('/animals/:animalId', showAnimal);
    actions.register('speak', speak);

    // action handler
    function speak(action) {
      state.set({words: action.words});
    }

    // route handler
    function show(path, params) {
      animalData.fetch(params.animalId).then(function(animal) {
        state.set({showAnimal: animal});
      });
    }
  });

  return store;
};

AnimalStore.instance = AnimalStore({
  dispatcher: require('./my-app-dispatcher'),
  animalData: require('./my-animal-data'),
});

module.exports = AnimalStore;
```

### Using your Store

#### In your controller components

```javascript
var animalStore = require('./animal_store').instance;
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

### Defining a Store

```javascript
var store = Coherence(dispatcher, function(router, actions, state) {
  /* define store behavior here */
});
```
The Coherence function takes two arguments:

- __dispatcher__
  - must define a `register` method that conforms to the semantics described by
    Flux

- __configurer__
  - a callback, that accepts three arguments, used together to define the
    behavior of the returned store instance

    - __router.register(routeString, routeHandler)__
      - binds a handler function that gets called when a matching "navigate"
        action is dispatched - see
        [dumb-router](https://github.com/clalimarmo/dumb-router#dumb-router)
        for more information
      - the handler function receives two params: the matching `path` string,
        and a `params` object

    - __actions.register(actionType, actionHandler)__
      - binds a handler function that gets called when a matching action is dispatched
      - the handler function receives the action payload object

    - __state.set(newValues)__
      - updates the values returned by the public method `store.data()`, and triggers the event
        handlers bound by `store.addChangeListener()`

### Public Instance Methods

- __store.addChangeListener(callback)__
  - binds the callback to be invoked, whenever `coherence.set` is called,
    for use when mounting controller components

- __store.removeChangeListener(callback)__
  - removes the change callbacks, for use when unmounting controller components

- __store.data()__
  - returns any data set by `state.set`

- __store.path(...pathParts)__
  - returns a path string, if the parts match one of the routes registered by
    `router.register` - see
    [dumb-router](https://github.com/clalimarmo/dumb-router#dumb-router) for
    more information

## Development

Add or modify tests to reflect the change you want.

Run them with `npm test`, and update the code in `src/` till your tests pass.

Running the tests will run `npm run compile`, which outputs the code as ES5,
polyfilled via `core-js`.
