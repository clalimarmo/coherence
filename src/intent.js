const Subject = require('rx-lite').Subject;

const Intent = function(yieldPayload) {
  const subject = new Subject();

  const Intentor = function(...yieldArgs) {
    if (yieldPayload) {
      subject.onNext(yieldPayload(...yieldArgs));
    } else {
      subject.onNext(undefined);
    }
  };

  Intentor.subscribe = function(...args) {
    subject.subscribe(...args);
  };

  return Intentor;
};

module.exports = Intent;
