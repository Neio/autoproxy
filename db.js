var mongodb = require('mongoose');
var mongodburl = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || process.env.MONGODB_URI|| "mongodb://localhost/proxy"
console.log("Connecting to " + mongodburl);
mongodb.connect(mongodburl);
var db = mongodb.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.info('connected to mongodb.');
    exports.connected = true;
});

var proxySchema = mongodb.Schema({
    name: String,
    online: Boolean,
    ping: Number,
    type: String,
    updatedDisplayInfo: String,
    updated: Date,
    lastLive: Date
});

var Proxy = mongodb.model('Proxy', proxySchema);

exports.Proxy = Proxy;
exports.ProxySchema = proxySchema;
