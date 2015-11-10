require('core-js');

const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');

const Coherence = require('./coherence');

describe('React integration:', () => {
  var greetingStore, dispatcher, Greeting, greetingDOMNode;
  var greetingObservable;

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
      navigate(greetingStore.path('logout'));
      expect(componentOutput()).to.include('you are logged out');
    });
  }

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

    greetingStore = Coherence(dispatcher, (router, actions, expose) => {
      const greeting = expose('greetingText', '...');

      //for test assertion purposes
      greetingObservable = greeting;

      actions.register('say-goodbye', () => {
        greeting.onNext('goodbye');
      });

      actions.register('say-hello', () => {
        greeting.onNext('hello');
      });

      router.register('/logout', () => {
        greeting.onNext('you are logged out');
      });
    });
  });

  context('component binding with default state mappings', () => {
    beforeEach(() => {
      Greeting = React.createClass({
        componentWillMount: function() {
          this.subscriptions = greetingStore.subscribe(this, ['greetingText']);
        },
        componentWillUnmount: function() {
          this.subscriptions.dispose();
        },
        getInitialState: function() {
          return {};
        },
        render: function() {
          return (
            <p>{this.state.greetingText}</p>
          );
        },
      });

      const greetingElement = React.createElement(Greeting, {});
      const greetingComponent = ReactTestUtils.renderIntoDocument(greetingElement, {});
      greetingDOMNode = ReactDOM.findDOMNode(greetingComponent);
    });

    runExamples();
  });

  context('component binding with custom state mappings', () => {
    beforeEach(() => {
      Greeting = React.createClass({
        componentWillMount: function() {
          this.subscriptions = greetingStore.subscribe(this, {
            greetingText: 'greeting',
          });
        },
        componentWillUnmount: function() {
          this.subscriptions.dispose();
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

      const greetingElement = React.createElement(Greeting, {});
      const greetingComponent = ReactTestUtils.renderIntoDocument(greetingElement, {});
      greetingDOMNode = ReactDOM.findDOMNode(greetingComponent);
    });

    runExamples();
  });
});
