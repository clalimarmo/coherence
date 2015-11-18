'use strict';

require('core-js');
var expect = require('chai').expect;

var jsdom = require('mocha-jsdom');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var Coherence = require('./coherence');

describe('React integration:', function () {
  jsdom();

  var greetingController;
  var dispatcher;
  var greeter;
  var greetingComponent;
  var GreetingView;
  var greetingDOMNode;

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

    greeter = Coherence.Model(function (expose, def) {
      var greeting = expose('greeting', '...');

      def('say', function (words) {
        greeting.onNext(words);
      });
    });

    greetingController = Coherence.Controller(dispatcher, function (router, actions) {
      actions.register('say-goodbye', function () {
        greeter.say('goodbye');
      });

      actions.register('say-hello', function () {
        greeter.say('hello');
      });

      router.register('/logout', function () {
        greeter.say('you are logged out');
      });
    });
  });

  context('component binding', function () {
    beforeEach(function () {
      GreetingView = React.createClass({
        displayName: 'GreetingView',

        componentWillMount: function componentWillMount() {
          this.coherenceBindings = greeter.ReactBindings(this, {
            greeting: 'greeting'
          });
        },
        componentWillUnmount: function componentWillUnmount() {
          this.coherenceBindings.unbind();
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

      var greetingElement = React.createElement(GreetingView, {});
      greetingComponent = ReactTestUtils.renderIntoDocument(greetingElement, {});
      greetingDOMNode = ReactDOM.findDOMNode(greetingComponent);
    });

    runExamples();
  });

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
      navigate(greetingController.path('logout'));
      expect(componentOutput()).to.include('you are logged out');
    });

    it('unmounts', function () {
      expect(function () {
        greetingComponent.componentWillUnmount();
      }).to.not['throw'](Error);
    });
  }
});