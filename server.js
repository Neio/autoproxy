#!/bin/env node

var fs      = require('fs');
var http    = require('http');
var pac     = require('./pac.js');
var utils   = require('./utils.js');
var url     = require('url');

var Initialize = function(){
    http.globalAgent.maxSockets = Infinity;
    process.on('uncaughtException', function(err) {
        console.error('[auto proxy] Caught uncaughtException: ' + err, err.stack);
        //process.exit(213);
    });
};

var AutoProxyApp = function() {

    //  Scope.
    var self = this;

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8888;
        self.env       = process.env.NODE_ENV || "production";
        if (typeof self.ipaddress === "undefined") {
            console.warn('No OPENSHIFT_NODEJS_IP var, using 0.0.0.0');
            self.ipaddress = "0.0.0.0";
        };
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating the app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    self.start = function(){
      if (self.env === "dev"){
          utils.respawnable_start(function(){
            var pacApp = new pac.PacApp();
            pacApp.start(self.ipaddress,self.port);
            pacApp.schedule_proxy_status_update();
          });
      }
      else {
        // In production, http proxy feature is disabled.
        var pacApp = new pac.PacApp();
        pacApp.start(self.ipaddress, self.port);
        pacApp.schedule_proxy_status_update();
      }

    }

    self.initialize = function() {
        console.log('bootstrap app');
        self.setupVariables();
        self.setupTerminationHandlers();
    };



};

Initialize();
var zapp = new AutoProxyApp();
zapp.initialize();
zapp.start();
