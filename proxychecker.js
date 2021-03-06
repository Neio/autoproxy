
var fs = require('fs');
var request = require('request');


var checkProxy = function(proxy, options, callback) {
    var proxyRequest = request.defaults({
        proxy: "http://" + proxy
    });
    var start = new Date();
    var requestOption = { url: options.url, time: true};
    proxyRequest(requestOption, function(err, res) {
        if( err ) {
            callback(false, 500, -1, err);
        } else if( res.statusCode != 200 ) {
            callback(false, res.statusCode, -1 ,err);
        } else if( !res.body || (options.regex && !options.regex.exec(res.body)) ) {
            callback(false, res.statusCode, -1, "Body doesn't match the regex " + options.regex + ".");
        } else {
            callback(true, res.statusCode, new Date() - start);
        }
    });
}

module.exports = {
  check_proxy: checkProxy
};
