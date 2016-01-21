var urls = require('./urls.js');

var generatePacContent = function(default_fallback){
  var result = "function FindProxyForURL(url, host) {\r\n";
  result += "  var proxy = 'PROXY 120.198.231.23:80';\r\n";
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

exports.pac_content_generator = generatePacContent;
