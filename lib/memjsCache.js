
var MemJS = require("memjs").Client;

memjs = MemJS.create();

var cache_manager = require('cache-manager');

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

        this.cache.get(req.url, function (err, result) {
            if (!err && result) {
                res.sendContent(result);
            } else {
                next();
            }
        });
    },

    afterPhantomRequest: function(phantom, context, next) {
        var cache = this.cache;
        context.getContent(function (content) {
            cache.set(context.request.url, content);
            next();
        });
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
