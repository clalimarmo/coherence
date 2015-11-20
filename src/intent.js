const Subject = require('rx-lite').Subject;

const Intent = function(yieldPayload) {
  const subject = new Subject();

  const Intentor = function(...yieldArgs) {
    subject.onNext(yieldPayload(...yieldArgs));
  };

  Intentor.subscribe = function(...args) {
    subject.subscribe(...args);
  };

  return Intentor;
};

module.exports = Intent;
