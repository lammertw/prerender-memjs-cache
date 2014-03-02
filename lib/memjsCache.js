
var MemJS = require("memjs").Client;

memjs = MemJS.create();

var cache_manager = require('cache-manager');

console.log('using memjs cache');

module.exports = {
    init: function() {
        this.cache = cache_manager.caching({
            store: memjs_cache
        });
    },

    beforePhantomRequest: function(req, res, next) {
        if(req.method !== 'GET') {
            return next();
        }

        this.cache.get(req.prerender.url, function (err, result) {
            if (!err && result) {
                res.send(200, result);
            } else {
                next();
            }
        });
    },

    afterPhantomRequest: function(phantom, context, next) {
        this.cache.set(context.request.url, context.response.documentHTML);
        next();
    }
};


var memjs_cache = {
    get: function(key, callback) {
      memjs.get(key, function(err, value) {
        var stringValue = value ? value.toString() : null;
        callback(err, stringValue);
      });
    },
    set: function(key, value, callback) {
      memjs.set(key, value, callback);
    }
};