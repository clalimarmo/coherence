# Coherence

A safety oriented Flux Store factory

## Usage

### Defining a Store

```javascript
var Coherence = require('coherence');

function AnimalStore(dependencies) {
  var animalData = dependencies.animalData;

  var store = Coherence(dependencies.dispatcher, function(router, actions, expose) {
    // exposed data, as Rx.BehaviorSubject
    const words = expose('words');
    const currentAnimal = expose('currentAnimal');

    router.register('/animals/:animalId', showAnimal);
    actions.register('speak', speak);

    // action handler
    function speak(action) {
      words.onNext(action.words);
    }

    // route handler
    function show(path, params) {
      animalData.fetch(params.animalId).then(function(animal) {
        currentAnimal.onNext(animal);
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
    this.coherenceSubscriptions = animalStore.subscribe(this, {
      animalData: 'animalData',
      words: 'animalSays',
    });
  },
  componentWillUnmount: function() {
    this.coherenceSubscriptions.unsubscribe();
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

    - var subject = __expose(attributeName)__
      - Instantiates and returns an
        [Rx.BehaviorSubject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md),
        which components may be bound to via `store.subscribe`.
        `subject.onNext(nextValue)` will push the `nextValue` to subscribed components.

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
