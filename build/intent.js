'use strict';

var Subject = require('rx-lite').Subject;

var Intent = function Intent(yieldPayload) {
  var subject = new Subject();

  var Intentor = function Intentor() {
    subject.onNext(yieldPayload.apply(undefined, arguments));
  };

  Intentor.subscribe = function () {
    subject.subscribe.apply(subject, arguments);
  };

  return Intentor;
};

module.exports = Intent;