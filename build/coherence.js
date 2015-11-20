'use strict';

require('core-js');

var Coherence = {};

Coherence.Intent = require('./intent');
Coherence.Model = require('./model');
Coherence.Bindings = require('./bindings');
Coherence.LocationFactory = require('./location-factory');

module.exports = Coherence;