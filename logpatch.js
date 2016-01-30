var util = require('util');
var Logger = require('le_node');
var winston = require('winston');
require('winston-papertrail').Papertrail;
var lelog = null;

if (process.env.LE_NODE_SECRET){
    console.log("Using logentries log with secret :" + process.env.LE_NODE_SECRET);
    lelog = new Logger({
        token: process.env.LE_NODE_SECRET
    });
}

var ptlog = null
if (process.env.PT_LOG_HOST && process.env.PT_LOG_PORT){
    console.log("Using papertrail log with host :" + process.env.PT_LOG_HOST);
    var ptlog = new winston.Logger({
        transports: [
            new winston.transports.Papertrail({
                host: process.env.PT_LOG_HOST,
                port: process.env.PT_LOG_PORT,
                program: "auto-proxy",
                level: "debug"
            })
        ]
    });
}

var funcs = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
};

module.exports = patch;

function patch() {
  Object.keys(funcs).forEach(function(k) {
    console.log("Patching " + k);
    (function(key){
      console[key] = function() {
        if (lelog){
            // Additional logs if possible
            lelog.log(arguments[0]);
        }
        if (ptlog){
            var loglevel = key === 'log' ? 'debug' : key;
            ptlog.log(loglevel, arguments[0]);
        }
        var s = '[' + new Date().toISOString() + ']';
        arguments[0] = util.format(s, arguments[0]);
        funcs[key].apply(console, arguments);
      };
    })(k);
  });
}

patch();

module.exports = patch;
