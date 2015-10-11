'use strict';

var EventEmitter = require('events').EventEmitter;

/*
 * A simple key-value store, with subscribe/unsubscribe methods.  Whenever the
 * set method is called, change listeners are fired.
 *
 * The intention is to mutate state exclusively via the set method, so that
 * change listeners are always fired (e.g. when Flux Store data changes.
 */
var CHANGE_EVENT = 'change';

var Data = function Data() {
  var self = {};
  var data = {};
  var events = new EventEmitter();

  self.addChangeListener = function (callback) {
    events.addListener(CHANGE_EVENT, callback);
  };

  self.removeChangeListener = function (callback) {
    events.removeListener(CHANGE_EVENT, callback);
  };

  self.data = function () {
    return data;
  };

  self.set = function (newData) {
    Object.keys(newData).forEach(function (key) {
      var newValue = newData[key];
      data[key] = newValue;
    });
    events.emit(CHANGE_EVENT);
  };

  return self;
};

module.exports = Data;