
var fs = require('fs');
var stream = require('stream');
var request = require('request');


var checkProxy = function(proxy, options, callback) {
    var proxyRequest = request.defaults({
        proxy: "http://" + proxy
    });
    var requestOption = { url: options.url, time: true};
    proxyRequest(requestOption, function(err, res) {
        if( err ) {
            callback(proxy, false, 500, -1, err);
        } else if( res.statusCode != 200 ) {
            callback(proxy, false, res.statusCode, -1 ,err);
        } else if( !res.body || (options.regex && !options.regex.exec(res.body)) ) {
            callback(proxy, false, res.statusCode, -1, "Body doesn't match the regex " + options.regex + ".");
        } else {
            callback(proxy, true, res.statusCode, res.elapsedTime);
        }
    });
}

module.exports = {
  check_proxy: checkProxy
};
