var urls = require('./urls.js');
var net = require('net');
var url = require('url');
var util = require('util');
var domain = require('domain');
var cluster = require('cluster');
//var globToRegExp = require('glob-to-regexp');

var generatePacContent = function(default_fallback){
  var result = "function FindProxyForURL(url, host) {\r\n";
  result += "  var proxy = 'PROXY 120.198.231.21:80; PROXY 120.198.231.23:80; PROXY 120.198.231.24:80';\r\n";
  urls.filters.forEach(function(filter){
    result += '  if(shExpMatch(url, "'+ filter  +'")){ return proxy;}\r\n';
  });
  if (default_fallback){
    result += '  return "' + default_fallback + '";\r\n}\r\n';
  }else{
    result += '  return "DIRECT";\r\n}\r\n';
  }

  return result;
}

/*var check_if_in_filters = function(url){
  var arrayLength = urls.filters.length;
  for (var i = 0; i < arrayLength; i++) {
      var filter = urls.filters[i];
      if (globToRegExp(filter).test(url))
      {
          return true;
      }
  }
  return false;
}*/


var respawnable_start = function(start_func){
  if (cluster.isMaster) {
      var num_CPUs = require('os').cpus().length;

      var i;
      for (i = 0; i < num_CPUs; i++) {
          cluster.fork();
      }

      cluster.on('listening', function(worker, addr_port) {
        console.log('Worker ' + worker.process.pid  + ' is now connected to ' + addr_port.address + ':' + addr_port.port);
      });

      cluster.on('exit', function(worker, code, signal) {
          if (signal) {
              console.log('Worker ' + worker.process.pid + ' was killed by signal: ' + signal);
          } else if (code !== 0) {
              console.error('Worker ' + worker.process.pid + ' exited with error code: ' + code);
              // respawn a worker process when one dies
              cluster.fork();
          } else {
              console.error('Worker ' + worker.process.pid + ' exited.');
          }
      });


  } else if (cluster.isWorker) {
      start_func();
  }
}
exports.respawnable_start  = respawnable_start;
exports.pac_content_generator = generatePacContent;
//exports.check_if_in_filters = check_if_in_filters;
