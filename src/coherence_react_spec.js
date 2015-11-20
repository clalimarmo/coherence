require('core-js');
const expect = require('chai').expect;

const jsdom = require('mocha-jsdom');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');

const Coherence = require('./coherence');

describe('React integration:', () => {
  jsdom();

  var greeter;
  var Announce;
  var greetingComponent;
  var GreetingView;
  var greetingDOMNode;
  var Location = Coherence.LocationFactory();

  beforeEach(() => {
    greeter = Coherence.Model(function(expose, def) {
      const greeting = expose('greeting', '...');

      def('say', function(words) {
        greeting.push(words);
      });
    });

    Announce = Coherence.Intent((words) => {
      return words;
    });

    Announce.subscribe((words) => {
      greeter.say(words);
    });

    Location.subscribe((path) => {
      if (path === '/logout') {
        greeter.say('see you next time');
      }
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
          this.coherenceBindings.unbind();
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
      greetingComponent = ReactTestUtils.renderIntoDocument(greetingElement, {});
      greetingDOMNode = ReactDOM.findDOMNode(greetingComponent);
    });

    runExamples();
  });

  function componentOutput() {
    return greetingDOMNode.textContent;
  }

  function runExamples() {
    it('initializes the component with initial subject values', () => {
      expect(componentOutput()).to.include('...');
    });

    it('updates on actions', () => {
      Announce('hello');
      expect(componentOutput()).to.include('hello');

      Announce('goodbye');
      expect(componentOutput()).to.include('goodbye');
    });

    it('updates on Location.Navigate', () => {
      Location.Navigate('/logout');
      expect(componentOutput()).to.include('see you next time');
    });

    it('updates on Location.Redirect', () => {
      Location.Redirect('/logout');
      expect(componentOutput()).to.include('see you next time');
    });

    it('unmounts', () => {
      expect(() => {
        greetingComponent.componentWillUnmount();
      }).to.not.throw(Error);
    });
  }
});
