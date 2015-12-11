'use strict';

var Subject = require('rx-lite').Subject;

var Intent = function Intent(yieldPayload) {
  var subject = new Subject();

  var Intentor = function Intentor() {
    if (yieldPayload) {
      subject.onNext(yieldPayload.apply(undefined, arguments));
    } else {
      subject.onNext(undefined);
    }
  };

  Intentor.subscribe = function () {
    subject.subscribe.apply(subject, arguments);
  };

  return Intentor;
};

module.exports = Intent;