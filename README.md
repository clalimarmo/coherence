# Coherence

Flux inspired Models and Controllers, for your React app.

## Usage

### Defining view state models

```javascript
// animals-model.js
var Model = require('coherence').Model;

var Animals = function(dependencies) {
  var getAnimalAsync = dependencies.getAnimalAsync;

  var model = Model(function(expose, def) {
    // define bindable state
    var currentAnimal = expose('currentAnimal');
    var said = expose('said');

    // define methods to change that state
    def('select', function(animalId) {
      getAnimalAsync.then(function(animal) {
        currentAnimal.onNext(animal);
      });
    });

    def('say', function(words) {
      said.onNext(words);
    });
  });

  return model;
};

Animals.instance = Animals({
  getAnimalsAsync: require('...'),
});

module.exports = Animals;
```

### Defining action and route handlers

```javascript
// animals-controller.js

var Controller = require('coherence').Controller;

function AnimalsController(dependencies) {
  var animals = dependencies.animals;

  var manager = Controller(dependencies.dispatcher, function(router, intents) {
    router.register('/animals/:animalId', showAnimal);
    intents.register('speak', speak);

    // action handler
    function speak(action) {
      dependencies.animals.say(action.words);
    }

    // route handler
    function show(path, params) {
      dependencies.animals.select(params.animalId);
    });

  return store;
};

AnimalStore.instance = AnimalStore({
  dispatcher: require('./my-app-dispatcher'),
  animals: require('./animals-model').instance,
});

module.exports = AnimalStore;
```

### Using your Store

#### In your controller components

```javascript
var animalStore = require('./animal_store').instance;
var AnimalView = React.createClass({
  componentWillMount: function() {
    var animals = require('./animals-model').instance;
    this.animalBindings = animals.ReactBindings(this, animals, {
      animalData: 'currentAnimal',
      animalSays: 'says',
    });
  },
  componentWillUnmount: function() {
    this.animalBindings.unbind();
  },
  render: function() {
    return (
      <div>
        <AnimalData data={this.state.animalData} />
        <p>Animal says: {this.state.animalSays}</p>
      </div>
    );
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

For pushState and replaceState hooks, so your navigate actions update the
browser URL, and works with browser "back", see
[coherence-pushstate](https://github.com/clalimarmo/coherence-pushstate).

## API

### Coherence

- __Coherence.NAVIGATE_ACTION_TYPE__
  - the action type to which registered routes will respond

### Defining a Store

```javascript
var store = Coherence(dispatcher, function(router, intents) {
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

### Public Instance Methods

Within the context of a React class definition:

- this.subscriptions = __store.subscribe(this, bindingNames)__
  - binds the component to update its state, whenever `subject.set` is called.
  - `this` is the React component
  - `bindingNames` can be either be
    - an object, mapping exposed subject names, to component state properties
    - or it can just be an array of exposed subject names, if you don't need
      to use different names for your subjects, inside your component.

- __this.subscriptions.unsubscribe()__
  - cleans up the subscriptions set up by `store.subscribe`. Call this from
    `componentWillUnmount`

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
