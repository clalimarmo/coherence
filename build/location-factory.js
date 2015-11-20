'use strict';

var Intent = require('./intent');

var LocationFactory = function LocationFactory(_window) {
  _window = _window || {};
  var history = _window.history;

  var ChangeLocation = new Intent(function (path) {
    return path;
  });

  var Location = {};

  Location.Navigate = function (path, pushState) {
    if (history && pushState !== false) {
      history.pushState({ path: path }, null, path);
    }
    ChangeLocation(path);
  };

  Location.Redirect = function (path) {
    if (history) {
      history.replaceState({ path: path }, null, path);
    }
    ChangeLocation(path);
  };

  Location.subscribe = function () {
    ChangeLocation.subscribe.apply(ChangeLocation, arguments);
  };

  if (_window) {
    _window.onpopstate = function (event) {
      if (event.state && event.state.path) {
        ChangeLocation(event.state.path);
      }
    };
  }

  return Location;
};

module.exports = LocationFactory;