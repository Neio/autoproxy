var util = require('util');
var logprefix = require('log-prefix');


function patch(fn) {
  logprefix(function(){
    return '[' + new Date().toISOString() + ']';
  });
}

patch();

module.exports = patch;
