var net = require('net');
var url = require('url');
var util = require('util');
var http = require('http');
var utils = require('./utils.js');
var PacProxyAgent = require('pac-proxy-agent');
var proxyChecker = require('./proxychecker.js');
var db = require('./db.js');
require('datejs');

require('./logpatch.js');

var proxy_checker_param = {url: "http://www.ip138.com", regex: /ip/};

var PacApp = function(){

      //  Scope.
    var self = this;

    self.update_proxy_status = function(){
      console.log("update_proxy_status...");
      db.Proxy.find({ updated: {$lt: new Date().addMinutes(-30)}}).sort({updated: 1}).limit(5).exec(function(err, proxies){
          if (err){
              console.log("Failed to get data.");
              return;
          }
          for(var i = 0; i < proxies.length; i++){
              var proxy = proxies[i];
              console.log( "checking proxy status :" + proxy.name);

              proxyChecker.check_proxy(proxy.name, proxy_checker_param, function(p, result, statusCode, elapsedTime, err){
                  if (err){
                      console.log("Proxy Status update: " + p + ": online = " + result + ' Error: '  + err);
                  }
                  else{
                      console.log("Proxy Status update: " + p + ": online = " + result + ' ping = '  + elapsedTime + 'ms');
                  }

                  proxy.online = result;
                  proxy.updated = new Date();
                  proxy.updatedDisplayInfo = new Date().toISOString();
                  proxy.ping = elapsedTime;
                  proxy.save();


              });
          }
      });
    }

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

        if (client_request.url === '/update') {
            self.update_proxy_status();
            var result = '<a href="/proxies"> Check Status </a>';
            client_response.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': result.length,
                'Cache-Control': 'public, max-age=10'
            });
            client_response.end(result);
            return;
        }
        if (client_request.url === "/proxies"){
            db.Proxy.find({}).sort({ping: 1}).exec(function(err, proxies){
                client_response.write(JSON.stringify(proxies, null, 4));
                client_response.end();
            });

            return;
        }
        var requrl = url.parse(client_request.url, true);
        if (requrl.pathname === "/proxy.pac"){
            var content_type = 'application/x-ns-proxy-autoconfig';
            if (requrl.query.debug || client_request.headers['user-agent'] !== undefined &&
                  client_request.headers['user-agent'].indexOf('PhantomJS') !== -1) {
                content_type = 'text/plain';
            }
            if (db.connected){
              console.log('using db proxy data...');
              db.Proxy.find({online: true}).sort({ping: 1}).limit(3).exec( function(err, proxies){
                  if (err){
                      console.log("Error: " + err);
                      client_response.end("ERROR");
                      return;
                  }
                  var live_content = utils.pac_content_generator(proxies);
                  client_response.writeHead(200, {
                      'Content-Type': content_type,
                      'Content-Length': live_content.length.toString(),
                      'Cache-Control': 'public, max-age=60'
                  });
                  client_response.end( live_content);
              });
            }
            else{
                client_response.write("HTTP/" + client_request.httpVersion + " 500 Connection error\r\n\r\n");
                client_response.end();
            }
            return;
        }

        if (requrl.pathname === "/addproxy" && requrl.query.proxy){
            console.log('Adding proxy : ' + requrl.query.proxy);
            db.Proxy.findOne({name: requrl.query.proxy}, function(err, proxy){
                if (err){
                    console.log("Error occurred when checking if proxy exists.");
                    client_response.end("Connection failed");
                    return;
                }
                if (proxy){
                    console.log("Proxy is already exists");
                    client_response.end("Proxy is already exists");
                    return ;
                }
                console.log("Checking proxy status for " + requrl.query.proxy);
                proxyChecker.check_proxy(requrl.query.proxy, proxy_checker_param, function(p, result, statusCode, elapsedTime){
                    console.log("Proxy Status confirmed: " + p + ": online = " + result + ' ping = '  + elapsedTime + 'ms');
                    var proxy = new db.Proxy();
                    proxy.name = requrl.query.proxy;
                    proxy.online = result;
                    proxy.updated = new Date();
                    proxy.type = "HTTP";
                    proxy.updatedDisplayInfo = new Date().toISOString();
                    proxy.ping = elapsedTime;
                    proxy.save();
                    client_response.end("Proxy "  + requrl.query.proxy + "Added");
                });


            })


            return;
        }

        console.log("Cannot response to: " +client_request.url);
        client_response.end('OK');

    }


    self.schedule_proxy_status_update = function(){

        setTimeout(function(){ self.update_proxy_status(); }, 1000);
        setInterval(function(){
            self.update_proxy_status();
        }, 1000 * 60 * (Math.random() + 1));
    };

    self.start = function(pacIp, pacPort){
      var server = http.createServer();
      server.on('request', self.response_handler);
      server.listen(pacPort, pacIp).on('error', function(err) {
          if (err.code === 'EADDRINUSE') {
              console.error('[auto proxy] Port number is already in use! Exiting now...');
              process.exit();
          }
      });
      console.log("Listening to port: " + pacPort);
    };

    self.start_debug = function(pacPort, proxyPort){
        // URI to a PAC proxy file to use (the "pac+" prefix is stripped)
        var proxy = 'pac+http://127.0.0.1:' +pacPort +  '/proxy.pac';
        // create an instance of the `PacProxyAgent` class with the PAC file location
        var agent = new PacProxyAgent(proxy);
        console.log('using PAC proxy proxy file at %j', proxy);

        var server = http.createServer(function(req, resp) {

            // utils.check_if_in_filters(req.url)
            var endpoint = req.url;
            console.log('REQUEST: [%j] %j', req.method, endpoint);
            console.log('REQUEST HEADERS: ' + JSON.stringify(req.headers));
            var opts = url.parse(endpoint);
            opts.agent = agent;
            opts.headers = req.headers;
            opts.method = req.method;

            var requestProxy = http.request(opts, function (res){
                /*if (res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') != -1)
                {
                    res.on('data', function (chunk)  {
                      console.log('==============\r\n$%j\r\n JSON RESPONSE BODY for: \r\n%j \r\n=====================', endpoint, chunk);
                    });
                }*/
                resp.statusCode = res.statusCode;
                for(name in res.headers){
                   resp.setHeader(name, res.headers[name]);
                }
                res.pipe(resp);
            });

            req.pipe(requestProxy);
        });

        var regex_hostport = /^([^:]+)(:([0-9]+))?$/;
        server.addListener('connect', function(req, socket, bodyhead){
            console.log("Proxying HTTPS request for:", req.url);
            var pair = [req.url, 443];
            if (req.url.indexOf(':') > 0){
                pairs = req.url.split(':');
            }

            var proxySocket = new net.Socket();
            proxySocket.connect(pairs[1], pairs[0], function () {
                proxySocket.write(bodyhead);
                socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
              }
            );

            proxySocket.on('data', function (chunk) {
              socket.write(chunk);
            });

            proxySocket.on('end', function () {
              socket.end();
            });

            proxySocket.on('error', function () {
              socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
              socket.end();
            });

            socket.on('data', function (chunk) {
              proxySocket.write(chunk);
            });

            socket.on('end', function () {
              proxySocket.end();
            });

            socket.on('error', function () {
              proxySocket.end();
            });
        });

        server.listen(proxyPort);
    }
}


exports.PacApp = PacApp;
