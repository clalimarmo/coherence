'use strict';

require('core-js');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var Coherence = require('./coherence');

describe('React integration:', function () {
  var greetingStore, dispatcher, Greeting, greetingDOMNode;
  var greetingObservable;

  function navigate(path) {
    dispatcher.dispatch({
      type: Coherence.NAVIGATE_ACTION_TYPE,
      path: path
    });
  }

  function componentOutput() {
    return greetingDOMNode.textContent;
  }

  function runExamples() {
    it('initializes the component with initial subject values', function () {
      expect(componentOutput()).to.include('...');
    });

    it('updates on actions', function () {
      dispatcher.dispatch({ type: 'say-hello' });
      expect(componentOutput()).to.include('hello');

      dispatcher.dispatch({ type: 'say-goodbye' });
      expect(componentOutput()).to.include('goodbye');
    });

    it('updates on navigate', function () {
      navigate(greetingStore.path('logout'));
      expect(componentOutput()).to.include('you are logged out');
    });
  }

  beforeEach(function () {
    dispatcher = {
      register: function register(callback) {
        dispatcher.callbacks.push(callback);
      },
      dispatch: function dispatch(payload) {
        dispatcher.callbacks.forEach(function (cb) {
          cb(payload);
        });
      }
    };
    dispatcher.callbacks = [];

    greetingStore = Coherence(dispatcher, function (router, actions, expose) {
      var greeting = expose('greetingText', '...');

      //for test assertion purposes
      greetingObservable = greeting;

      actions.register('say-goodbye', function () {
        greeting.onNext('goodbye');
      });

      actions.register('say-hello', function () {
        greeting.onNext('hello');
      });

      router.register('/logout', function () {
        greeting.onNext('you are logged out');
      });
    });
  });

  context('component binding with default state mappings', function () {
    beforeEach(function () {
      Greeting = React.createClass({
        displayName: 'Greeting',

        componentWillMount: function componentWillMount() {
          this.subscriptions = greetingStore.subscribe(this, ['greetingText']);
        },
        componentWillUnmount: function componentWillUnmount() {
          this.subscriptions.dispose();
        },
        getInitialState: function getInitialState() {
          return {};
        },
        render: function render() {
          return React.createElement(
            'p',
            null,
            this.state.greetingText
          );
        }
      });

      var greetingElement = React.createElement(Greeting, {});
      var greetingComponent = ReactTestUtils.renderIntoDocument(greetingElement, {});
      greetingDOMNode = ReactDOM.findDOMNode(greetingComponent);
    });

    runExamples();
  });

  context('component binding with custom state mappings', function () {
    beforeEach(function () {
      Greeting = React.createClass({
        displayName: 'Greeting',

        componentWillMount: function componentWillMount() {
          this.subscriptions = greetingStore.subscribe(this, {
            greetingText: 'greeting'
          });
        },
        componentWillUnmount: function componentWillUnmount() {
          this.subscriptions.dispose();
        },
        getInitialState: function getInitialState() {
          return {};
        },
        render: function render() {
          return React.createElement(
            'p',
            null,
            this.state.greeting
          );
        }
      });

      var greetingElement = React.createElement(Greeting, {});
      var greetingComponent = ReactTestUtils.renderIntoDocument(greetingElement, {});
      greetingDOMNode = ReactDOM.findDOMNode(greetingComponent);
    });

    runExamples();
  });
});