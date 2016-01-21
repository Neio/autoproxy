var net = require('net');
var url = require('url');
var util = require('util');
var domain = require('domain');
var cluster = require('cluster');
var http = require('http');
var hoxy = require('hoxy');
var utils = require('./utils.js');

var local_port = 8888;
var debug_port = 8899;
var pac_content = utils.pac_content_generator();
var debug_pac_content = utils.pac_content_generator("PROXY 10.0.1.202:" + debug_port)

http.globalAgent.maxSockets = Infinity;

process.on('uncaughtException', function(err) {
    console.error('[auto proxy] Caught uncaughtException: ' + err, err.stack);
    process.exit(213);
});

function static_responses(client_request, client_response) {
    if (client_request.url === '/crossdomain.xml') {
        client_response.writeHead(200, {
            'Content-Type': 'text/xml',
            'Content-Length': '113',
            'Cache-Control': 'public, max-age=2592000'
        });
        client_response.end('<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<cross-domain-policy><allow-access-from domain="*"/></cross-domain-policy>');
        return;
    }

    if (client_request.url === '/status') {
        var status_text = 'OK';

        client_response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': status_text.length.toString(),
            'Cache-Control': 'public, max-age=3600'
        });
        client_response.end(status_text);
        return;
    }
    if (client_request.url === '/test.pac') {
        client_response.end(pac_content);
        return;
    }
    if (client_request.url === '/proxy.pac') {
        var content_type = 'application/x-ns-proxy-autoconfig';
        if (client_request.headers['user-agent'] !== undefined &&
                client_request.headers['user-agent'].indexOf('PhantomJS') !== -1) {
            content_type = 'text/plain';
        }
        client_response.writeHead(200, {
            'Content-Type': content_type,
            'Content-Length': pac_content.length.toString(),
            'Cache-Control': 'public, max-age=14400'
        });
        client_response.end(pac_content);
        return;
    }
    if (client_request.url === '/debug.test') {

        client_response.end(debug_pac_content);
        return;
    }
    if (client_request.url === '/debug.pac') {
        var content_type = 'application/x-ns-proxy-autoconfig';
        if (client_request.headers['user-agent'] !== undefined &&
                client_request.headers['user-agent'].indexOf('PhantomJS') !== -1) {
            content_type = 'text/plain';
        }
        client_response.writeHead(200, {
            'Content-Type': content_type,
            'Content-Length': debug_pac_content.length.toString(),
            'Cache-Control': 'public, max-age=14400'
        });
        client_response.end(debug_pac_content);
        return;
    }
    console.log(client_request.url);
}



if (cluster.isMaster) {
    var num_CPUs = require('os').cpus().length;

    var i;
    for (i = 0; i < num_CPUs; i++) {
        cluster.fork();
    }

    cluster.on('listening', function(worker, addr_port) {
      console.log('[auto proxy] Worker ' + worker.process.pid
                  + ' is now connected to ' + addr_port.address + ':' + addr_port.port);
    });

    cluster.on('exit', function(worker, code, signal) {
        if (signal) {
            console.log('[auto proxy] Worker ' + worker.process.pid
                          + ' was killed by signal: ' + signal);
        } else if (code !== 0) {
            console.error('[auto proxy] Worker ' + worker.process.pid
                          + ' exited with error code: ' + code);
            // respawn a worker process when one dies
            cluster.fork();
        } else {
            console.error('[auto proxy] Worker ' + worker.process.pid + ' exited.');
        }
    });

    console.log('The auto proxy server is running...');


} else if (cluster.isWorker) {

    var server = http.createServer();
    server.on('request', static_responses);
    server.listen(local_port, '0.0.0.0').on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            console.error('[auto proxy] Port number is already in use! Exiting now...');
            process.exit();
        }
    });
    var proxy = hoxy.createServer().listen(debug_port, function() {
      console.log('The proxy is listening on port ' + debug_port + '.');
    });
    proxy.intercept('request', function(req, resp, cycle){  console.log( "DEBUG:  >> [" + req.method + "]" + req.hostname + '/' + req.url); });
}
