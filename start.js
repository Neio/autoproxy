#!/bin/env node

process.on('uncaughtException', function(err) {
    console.error('[auto proxy] Caught uncaughtException: ' + err, err.stack);
});


console.info('bootstrap app');
var pac = require('./pac.js');
var ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8888;
var pacApp = new pac.PacApp();
pacApp.start(ip, port);
