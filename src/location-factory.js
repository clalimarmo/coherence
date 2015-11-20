const Subject = require('rx-lite').Subject;

const LocationFactory = function(_window) {
  _window = _window || {};
  const history = _window.history;

  const location = new Subject();

  const Location = {};

  Location.navigate = function(path, pushState) {
    if (history && pushState !== false) {
      history.pushState({path: path}, null, path);
    }
    location.onNext(path);
  };

  Location.redirect = function(path) {
    if (history) {
      history.replaceState({path: path}, null, path);
    }
    location.onNext(path);
  };

  Location.subscribe = function(...args) {
    location.subscribe(...args);
  };

  if (_window) {
    _window.onpopstate = function(event) {
      if (event.state && event.state.path) {
        location.onNext(event.state.path);
      }
    };
  }

  return Location;
};

module.exports = LocationFactory;
