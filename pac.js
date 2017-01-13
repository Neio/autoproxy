var net = require('net');
var url = require('url');
var util = require('util');
var http = require('http');
var utils = require('./utils.js');
var dataSource = require('./data.js');
var request = require('request');
var proxyChecker = require('./proxychecker.js');
var db = require('./db.js');
var minify = require('./minify.js');
require('datejs');
require('./logpatch.js');

var remote_filter_url = process.env.REMOTE_FILTER_URL || 'https://gist.githubusercontent.com/Neio/73e038f6129d07b2cb54/raw/urls.js';

var proxy_checker_param = {
    url: "http://www.ip138.com",
    regex: /ip/
};
var filters = [];

var PacApp = function() {

    //  Scope.
    var self = this;

    self.update_from_source = function() {
        var data_tran_url = process.env.DATA_TRAN_URL;
        var data_source_url = process.env.DATA_SOURCE_URL;
        if (!data_source_url) {
            console.log("Data source url is empty");
            return;
        }
        if (!data_tran_url) {
            console.log("Data transformation url is empty");
            return;
        }
        console.log("Requesting data translator from " + data_tran_url);
        request(data_tran_url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("God data translator. ");
                dataSource.getData(data_source_url, body, function(err, rt) {
                    if (err) {
                        console.log("Error occurred when getting data source from url " + data_source_url);
                        console.log(err);
                    } else {
                        console.log("Got transformed data:");
                        console.log(rt);
                        var newData = JSON.parse(rt + " ");
                        console.log(newData);
                        newData.forEach(function(entry) {
                            if (entry) {
                                self.add_proxy(entry, function(msg) {
                                    console.log(msg);
                                });
                            }
                        });
                    }
                });
            } else if (error) {
                console.warn("Error occurred when updating data tran. Error: " + error);
            } else {
                console.warn("rror occurred when updating data tran. Status Code: " + response.statusCode)
            }
        });

    };

    self.add_proxy = function(requestedProxy, callback) {
        db.Proxy.findOne({
            name: requestedProxy
        }, function(err, proxy) {
            if (err) {
                console.info("Error occurred when checking if proxy exists.");
                callback("Connection failed");
                return;
            }
            if (proxy) {
                console.info("Proxy " + requestedProxy + " is already exists");
                callback("Proxy is already exists");
                return;
            }
            console.info("Checking proxy status for " + requestedProxy);
            proxyChecker.check_proxy(requestedProxy, proxy_checker_param, function(result, statusCode, elapsedTime) {
                console.info("Proxy Status confirmed: " + requestedProxy + ": online = " + result + ' ping = ' + elapsedTime + 'ms');
                if (result) {
                    var proxy = new db.Proxy();
                    proxy.name = requestedProxy;
                    proxy.online = result;
                    proxy.updated = new Date();
                    proxy.type = "HTTP";
                    proxy.updatedDisplayInfo = new Date().toISOString();
                    proxy.ping = elapsedTime;
                    proxy.lastLive = new Date();
                    proxy.save(function(err, result) {
                        if (err) return console.error(err);
                        console.info(result);
                    });
                    callback("Proxy " + requestedProxy + " is successfully added and alive.");
                } else {
                    callback("Proxy " + requestedProxy + " is offline and would not be added.");
                }
            });

        });
    }

    self.update_filter = function() {
        console.info("updating filters...");
        request(remote_filter_url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = minify(body);
                var result = JSON.parse(data);
                console.info("Got updated filters: " + data.substr(0, 100) + "...");

                if (result.filters) {
                    filters = result.filters;
                } else {
                    console.warn("Failed to get filters, please verify the content of " + remote_filter_url);
                }
            } else if (error) {
                console.warn("Error occurred when updating filter. Error: " + error);
            } else {
                console.warn("rror occurred when updating filter. Status Code: " + response.statusCode)
            }
        });
    };

    self.update_proxy_status = function() {
        console.info("update_proxy_status...");
        db.Proxy.find({
            updated: {
                $lt: new Date().addMinutes(-30)
            }
        }).sort({
            updated: 1
        }).limit(5).exec(function(err, proxies) {
            if (err) {
                console.warn("Failed to get data.");
                return;
            }
            for (var i = 0; i < proxies.length; i++) {

                (function(proxy) {
                    console.info("checking proxy status :" + proxy.name);
                    proxyChecker.check_proxy(proxy.name, proxy_checker_param, function(result, statusCode, elapsedTime, err) {
                        if (err) {
                            console.warn("Proxy Status update: " + proxy.name + ": online = " + result + ' Error: ' + err);
                        } else {
                            console.info("Proxy Status update: " + proxy.name + ": online = " + result + ' ping = ' + elapsedTime + 'ms');
                        }
                        var alive = result && elapsedTime < 5000
                        proxy.online = alive;
                        proxy.updated = new Date();
                        if (alive) {
                            proxy.lastLive = new Date();
                        }
                        proxy.updatedDisplayInfo = new Date().toISOString();
                        proxy.ping = elapsedTime;
                        console.info(proxy);
                        proxy.save();
                    });
                })(proxies[i]);
            }
        });
    }

    self.response_handler = function(client_request, client_response) {
        console.info(client_request.url);
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
            self.update_filter();
            self.update_from_source();
            client_response.end('Update is triggerred');
            return;
        }

        if (client_request.url === '/stat') {
            db.Proxy.count({
                online: true
            }).exec(function(err, onlineCount) {
                db.Proxy.count({
                    online: false
                }).exec(function(err, offlineCount) {
                    client_response.end("ONLINE:" + onlineCount + ", OFFLINE: " + offlineCount);
                });
            });

            return;
        }

        if (client_request.url === '/status') {
            db.Proxy.count({
                online: true
            }).exec(function(err, onlineCount) {
                if (err) {
                    client_response.writeHead(500, {"Content-Type": "text/plain"});
                    client_response.write("HTTP/" + client_request.httpVersion + " 500 DB error\r\n\r\n");
                    client_response.end();
                } else if (onlineCount > 0) {
                    client_response.end("ON");
                } else {
                    client_response.writeHead(500, {"Content-Type": "text/plain"});
                    client_response.write("HTTP/" + client_request.httpVersion + " 500 Connection error\r\n\r\n");
                    client_response.end();
                }

            });

            return;
        }

        var requrl = url.parse(client_request.url, true);

        if (client_request.url === "/proxies") {
            db.Proxy.find({}).sort({
                ping: 1
            }).exec(function(err, proxies) {
                client_response.write(JSON.stringify(proxies, null, 4));
                client_response.end();
            });

            return;
        }

        if (requrl.pathname === "/proxy.pac") {
            var content_type = 'application/x-ns-proxy-autoconfig';
            if (requrl.query.debug || client_request.headers['user-agent'] !== undefined &&
                client_request.headers['user-agent'].indexOf('PhantomJS') !== -1) {
                content_type = 'text/plain';
            }
            if (db.connected) {
                console.info('using db proxy data...');
                db.Proxy.find({
                    online: true
                }).sort({
                    ping: 1
                }).limit(3).exec(function(err, proxies) {
                    if (err) {
                        console.info("Error: " + err);
                        client_response.end("ERROR");
                        return;
                    }
                    var live_content = utils.pac_content_generator(proxies, filters);
                    client_response.writeHead(200, {
                        'Content-Type': content_type,
                        'Content-Length': live_content.length.toString(),
                        'Cache-Control': 'public, max-age=90'
                    });
                    client_response.end(live_content);
                });
            } else {
                client_response.writeHead(500, {"Content-Type": "text/plain"});
                client_response.write("HTTP/" + client_request.httpVersion + " 500 Connection error\r\n\r\n");
                client_response.end();
            }
            return;
        }

        if (requrl.pathname === "/addproxy" && requrl.query.proxy) {
            console.info('Adding proxy : ' + requrl.query.proxy);
            self.add_proxy(requrl.query.proxy, function(result) {
                client_response.end(result);
            });
            return;
        }

        if (requrl.pathname === "/cleanproxy") {
            db.Proxy.count({
                online: false
            }).remove().exec(function(err, removed) {
                client_response.end("data are removed " + removed);
            });
            return;
        }

        if (requrl.pathname === "/help"){
            client_response.write("Supported:\r\n")
            client_response.write("/proxy.pac[?debug=true]\r\n");
            client_response.write("/stat\r\n");
            client_response.write("/status\r\n");
            client_response.write("/update\r\n");
            client_response.write("/cleanproxy\r\n");
            client_response.write("/addproxy?proxy=\r\n");
            client_response.end();
            return;
        }

        if (requrl.pathname === "/"){
            client_response.end("Service is running...");
            return;
        }

        console.info("Cannot response to: " + client_request.url);
        client_response.writeHead(404, {"Content-Type": "text/plain"});
        client_response.end("404 Not found");
    }

    self.schedule_tasks = function() {
        setTimeout(function() {
            self.update_proxy_status();
        }, 1000);
        setInterval(function() {
            self.update_proxy_status();
        }, 1000 * 60 * (Math.random() * 1 + 1));

        // Filters would be auto checked every 5 minutes
        setTimeout(function() {
            self.update_filter();
        }, 500);
        setInterval(function() {
            self.update_filter();
        }, 1000 * 60 * 5);

        setTimeout(function() {
            self.update_from_source();
        }, 500);
        setInterval(function() {
            self.update_from_source();
        }, 1000 * 60 * 30);
    };

    self.start = function(pacIp, pacPort) {
        var server = http.createServer();
        server.on('request', self.response_handler);
        server.listen(pacPort, pacIp, function() {
            console.log("Listening on " + pacIp + ", server_port " + pacPort);
        }).on('error', function(err) {
            if (err.code === 'EADDRINUSE') {
                console.error('[auto proxy] Port number is already in use! Exiting now...');
                process.exit();
            }
        });
        console.info("Listening to port: " + pacPort);
        self.schedule_tasks();
    };
}


exports.PacApp = PacApp;
