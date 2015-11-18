require('core-js');
const expect = require('chai').expect;

const jsdom = require('mocha-jsdom');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');

const Coherence = require('./coherence');

describe('React integration:', () => {
  jsdom();

  var greetingController;
  var dispatcher;
  var greeter;
  var GreetingView;
  var greetingDOMNode;

  beforeEach(() => {
    dispatcher = {
      register: (callback) => {
        dispatcher.callbacks.push(callback);
      },
      dispatch: (payload) => {
        dispatcher.callbacks.forEach((cb) => {
          cb(payload);
        });
      },
    };
    dispatcher.callbacks = [];

    greeter = Coherence.Model(function(expose, def) {
      const greeting = expose('greeting', '...');

      def('say', function(words) {
        greeting.onNext(words);
      });
    });

    greetingController = Coherence.Controller(dispatcher, (router, actions) => {
      actions.register('say-goodbye', () => {
        greeter.say('goodbye');
      });

      actions.register('say-hello', () => {
        greeter.say('hello');
      });

      router.register('/logout', () => {
        greeter.say('you are logged out');
      });
    });
  });

  context('component binding', () => {
    beforeEach(() => {
      GreetingView = React.createClass({
        componentWillMount: function() {
          this.coherenceBindings = greeter.ReactBindings(this, {
            greeting: 'greeting',
          })
        },
        componentWillUnmount: function() {
          this.coherenceBindings.unsubscribe();
        },
        getInitialState: function() {
          return {};
        },
        render: function() {
          return (
            <p>{this.state.greeting}</p>
          );
        },
      });

      const greetingElement = React.createElement(GreetingView, {});
      const greetingComponent = ReactTestUtils.renderIntoDocument(greetingElement, {});
      greetingDOMNode = ReactDOM.findDOMNode(greetingComponent);
    });

    runExamples();
  });

  function navigate(path) {
    dispatcher.dispatch({
      type: Coherence.NAVIGATE_ACTION_TYPE,
      path: path,
    });
  }

  function componentOutput() {
    return greetingDOMNode.textContent;
  }

  function runExamples() {
    it('initializes the component with initial subject values', () => {
      expect(componentOutput()).to.include('...');
    });

    it('updates on actions', () => {
      dispatcher.dispatch({type: 'say-hello'});
      expect(componentOutput()).to.include('hello');

      dispatcher.dispatch({type: 'say-goodbye'});
      expect(componentOutput()).to.include('goodbye');
    });

    it('updates on navigate', () => {
      navigate(greetingController.path('logout'));
      expect(componentOutput()).to.include('you are logged out');
    });
  }
});
