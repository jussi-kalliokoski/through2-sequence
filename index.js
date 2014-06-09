"use strict";

var through = require("through2");
var createSequence = require("./lib/createSequence");

module.exports = createSequence(through);
module.exports.obj = createSequence(through.obj);
