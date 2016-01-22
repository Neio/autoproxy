var net = require('net');
var url = require('url');
var util = require('util');
var http = require('http');
var utils = require('./utils.js');
var PacProxyAgent = require('pac-proxy-agent');

var PacApp = function(){

      //  Scope.
    var self = this;

    var pac_content = utils.pac_content_generator();

    self.response_handler = function(client_request, client_response) {
        console.log(client_request.url);
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
            client_response.end('OK');
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
                'Cache-Control': 'public, max-age=60'
            });
            client_response.end(pac_content);
            return;
        }
        console.log("Cannot response to: " +client_request.url);
    }



    self.start = function(pacPort, proxyPort){
        var server = http.createServer();
        server.on('request', self.response_handler);
        server.listen(pacPort, '0.0.0.0').on('error', function(err) {
            if (err.code === 'EADDRINUSE') {
                console.error('[auto proxy] Port number is already in use! Exiting now...');
                process.exit();
            }
        });
        console.log("Listening to port: " + pacPort);


        // URI to a PAC proxy file to use (the "pac+" prefix is stripped)
        var proxy = 'pac+http://127.0.0.1:' +pacPort +  '/proxy.pac';
        // create an instance of the `PacProxyAgent` class with the PAC file location
        var agent = new PacProxyAgent(proxy);
        console.log('using PAC proxy proxy file at %j', proxy);

        var server = http.createServer(function(req, resp) {

            // utils.check_if_in_filters(req.url)
            var endpoint = req.url;
            console.log('REQUEST: %j', endpoint);
            var opts = url.parse(endpoint);
            opts.agent = agent;
            opts.headers = req.headers;
            opts.method = req.method;

            var requestProxy = http.request(opts, function (res){
                if (res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') != -1)
                {
                    res.on('data', (chunk) => {
                      console.log(`==============\r\n${endpoint} \r\n JSON RESPONSE BODY for: \r\n${chunk} \r\n=====================`);
                    });
                }
                resp.statusCode = res.statusCode;
                for(name in res.headers){
                   resp.setHeader(name, res.headers[name]);
                }
                res.pipe(resp);
            });
            req.on('data', function(chunk) {
              requestProxy.write(chunk);
            });
            req.on('end', function(chunk) {
              requestProxy.end(chunk);
            });
        });

        server.listen(proxyPort);
    }
}


exports.PacApp = PacApp;
