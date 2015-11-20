const Intent = require('./intent');

const LocationFactory = function(_window) {
  _window = _window || {};
  const history = _window.history;

  const ChangeLocation = new Intent((path) => {
    return path;
  });

  const Location = {};

  Location.Navigate = function(path) {
    if (history && history.pushState) {
      history.pushState({path: path}, null, path);
    }
    ChangeLocation(path);
  };

  Location.Redirect = function(path) {
    if (history && history.replaceState) {
      history.replaceState({path: path}, null, path);
    }
    ChangeLocation(path);
  };

  Location.subscribe = function(...args) {
    ChangeLocation.subscribe(...args);
  };

  if (_window) {
    _window.onpopstate = function(event) {
      if (event.state && event.state.path) {
        ChangeLocation(event.state.path);
      }
    };
  }

  return Location;
};

module.exports = LocationFactory;
