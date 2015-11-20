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

  var greeter;
  var Announce;
  var greetingComponent;
  var GreetingView;
  var greetingDOMNode;

  beforeEach(function () {
    greeter = Coherence.Model(function (expose, def) {
      var greeting = expose('greeting', '...');

      def('say', function (words) {
        greeting.onNext(words);
      });
    });

    Announce = Coherence.Intent(function (words) {
      return words;
    });

    Announce.subscribe(function (words) {
      greeter.say(words);
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

  function componentOutput() {
    return greetingDOMNode.textContent;
  }

  function runExamples() {
    it('initializes the component with initial subject values', function () {
      expect(componentOutput()).to.include('...');
    });

    it('updates on actions', function () {
      Announce('hello');
      expect(componentOutput()).to.include('hello');

      Announce('goodbye');
      expect(componentOutput()).to.include('goodbye');
    });

    it('unmounts', function () {
      expect(function () {
        greetingComponent.componentWillUnmount();
      }).to.not['throw'](Error);
    });
  }
});