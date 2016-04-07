
var MemJS = require("memjs").Client;

memjs = MemJS.create();

var cache_manager = require('cache-manager');

var pageTTL = process.env.PAGE_TTL || 0;

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

    afterPhantomRequest: function(req, res, next) {
        this.cache.set(req.prerender.url, req.prerender.documentHTML, function(err,val){}, pageTTL);
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
    set: function(key, value, callback, ttl) {
      memjs.set(key, value, callback, ttl);
    }
};
