'use strict';

var Subject = require('rx-lite').Subject;

var LocationFactory = function LocationFactory(_window) {
  _window = _window || {};
  var history = _window.history;

  var location = new Subject();

  var Location = {};

  Location.navigate = function (path, pushState) {
    if (history && pushState !== false) {
      history.pushState({ path: path }, null, path);
    }
    location.onNext(path);
  };

  Location.redirect = function (path) {
    if (history) {
      history.replaceState({ path: path }, null, path);
    }
    location.onNext(path);
  };

  Location.subscribe = function () {
    location.subscribe.apply(location, arguments);
  };

  if (_window) {
    _window.onpopstate = function (event) {
      if (event.state && event.state.path) {
        location.onNext(event.state.path);
      }
    };
  }

  return Location;
};

module.exports = LocationFactory;