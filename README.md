# Coherence

Models and Intents, for your React app. Inspired by Flux.

## Usage

### Installation

```bash
npm install coherence
```

```javascript
var Coherence = require('coherence');
```

Coherence is provided as a Node module, and has been used with Browserify for
client-side code. If you've used another bundling tool for client-side usage,
let me know!

### Intents

Intents describe things that somebody wants to happen in your app.  "Somebody"
might be you, the programmer, or the user. "Things" might be choosing a
background color, sending a message, opening a form, or pre-fetching data from
the server.

Intents in Coherence are analogous to Actions _and_ the Dispatcher(s) of Flux.

Intents are defined by a yielding function, which defines any input, and the
output payload provided to the intent's subscribers, whenever the Intent is
declared.

An popular pattern within the Flux community seems to be of "Action creators".
These are a middle ground between Intents, and using a bare Dispatcher, and, I
think, a step in the right direction. However, I think they don't go far enough.

Coherence eschews a Dispatcher, and Action creators, in favor of individually
subscribable Intents, for the following reasons:

- The main advantage of a the Dispatcher is that it can resolve inter-store
  dependencies. However, I disagree that an Action emitter (Dispatcher) is the
  right place to encode state dependencies. Coherence is designed to let you
  you implement models outside its purview, which resolve internal state
  dependencies, and still expose those models' state to your view layer, with
  `Coherence.Model`s.
- Having stores switching on Action "type" strings is error-prone, without some
  boilerplate safety around it. On the other hand, you can't subscribe to an
  Intent that hasn't been defined. This is only partially addressed by the
  Action creators, in that they make it less likely to create the wrong
  actions, but no more likely that stores respond to the right ones.

#### Defining Intents

```javascript
// speak.js

var Coherence = require('coherence');

var Speak = Coherence.Intent((words) => {
  return words;
});

module.exports = Speak;
```

```javascript
// choose-animal.js
var Coherence = require('coherence');

var ChooseAnimal = Coherence.Intent((animalId) => {
  return animalId;
});

module.exports = ChooseAnimal;
```

#### Declaring Intents

When something should actually happen in your app, you _declare_ an Intent.

```javascript
// react component ...
  speak: function() {
    Speak(this.state.words);
  },
```

#### Responding to Intents

Intent subscriptions are the implementations of your application's behavior, in
response to Intent declarations.

```javascript
Speak.subscribe((words) => {
  // say something
});
```

### Coherence.LocationFactory: Optional pushState and replaceState support

If you'd like to use path-based Intents, you can use
`Coherence.LocationFactory` to define Intents that will update history, and the
URL, for you.

This allows your app to handle deep-linking, and browser back/forward, using
the same patterns used for any other activity in your application.

```javascript
// navigate.js
var Coherence = require('coherence');

// passing in window enables pushState, replaceState, and onpopstate support,
// for browsers that support those features
var Location = Coherence.Location(window);

module.exports = Location;
```

- __Location.Navigate(path)__
  - Yields `path` to subscribers, and updates the URL via pushState, if enabled.
  - `path` should be a string.

- __Location.Redirect(path)__
  - Yields `path` to subscribers, and updates the URL via replaceState, if enabled.
  - `path` should be a string.

- __Location.subscribe(subscription)__
  - adds a subscriber, which is called whenever Location changes via calls to
    `Navigate` or `Redirect`. Subscription is passed a single argument: whatever
    `path` is passed to `Navigate` or `Redirect`.

Location Intents yield the path to subscribers, so that you can
bring your preferred routing solution.

### Defining view state models

Models define component-bindable information. You can house your business logic
here, but anything complex should probably be pushed into classes of your own
creation.

For Intent declarations to effect changes in your views:

  - your views should be bound to Models
  - Intent subscriptions should eventually call your Models' methods
  - your Models' methods should modify view-exposed state

```javascript
// animals-model.js
var Model = require('coherence').Model;
var Speak = require('./speak');

var Animals = function(dependencies) {
  var getAnimalAsync = dependencies.getAnimalAsync;

  var model = Model(function(expose, def) {
    // define bindable state
    var currentAnimal = expose('currentAnimal');
    var said = expose('said');

    // define methods to change that state
    def('select', function(animalId) {
      getAnimalAsync.then(function(animal) {
        currentAnimal.push(animal);
      });
    });

    def('say', function(words) {
      said.push(words);
    });
  });

  // Intent subscriptions can be set up when you instantiate your model, or
  // where ever else it is convenient
  Speak.subscribe((words) => {
    model.say(words);
  });

  return model;
};

module.exports = Animals;
```

### Integrating Coherence Intents and Models with React

```javascript
var animalStore = require('./animal_store').instance;
var Speak = require('./speak');

var animals = require('./animals-model').instance;

var AnimalView = React.createClass({
  componentWillMount: function() {
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
        <button onClick={this.saySomething}>Make Animal Say "something"</button>
        <AnimalData data={this.state.animalData} />
        <p>Animal says: {this.state.animalSays}</p>
      </div>
    );
  },
  saySomething: function() {
    Speak('something');
  },
});
```

## Features

### Binding a Model to a React component

Within the context of a React class definition:

- this.bindings = __model.ReactBindings(this, bindMap)__
  - binds the component to update its state, whenever values are pushed to exposed
    state.
  - `this` is the React component
  - `bindMap` can be either be
    - an object, mapping exposed subject names, to component state properties
    - or it can be omitted, to bind all of the model's attributes to the component,
      with the names defined by `expose`
  - be careful to avoid binding naming collisions, we currently don't do anything
    to protect against that

- __this.bindings.unbind()__
  - cleans up the bindings set up by `model.ReactBindings`. Call this from
    `componentWillUnmount`

## Development

Add or modify tests to reflect the change you want.

Run them with `npm test`, and update the code in `src/` till your tests pass.

Running the tests will run `npm run compile`, which outputs the code as ES5,
polyfilled via `core-js`.
