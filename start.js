#!/bin/env node

    console.info('bootstrap app');
    var pac     = require('./pac.js');
    var ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
    var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8888;
    var pacApp = new pac.PacApp();
    pacApp.start(ip, port);

