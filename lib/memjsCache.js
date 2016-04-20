
var MemJS = require("memjs").Client;

var memjs = MemJS.create();

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
    if (req.method !== 'GET') {
      return next();
    }
    //console.log('[memjs cache] gettting page from cache with an URL ', req.prerender.url);

    this.cache.get(req.prerender.url, function(err, result) {
      if (!err && result) {
        //console.log('[memjs cache] successfully got page from cache');
        res.send(200, result);
      } else {
        //console.log('[memjs cache] no such page in cache');
        next();
      }
    });
  },

  afterPhantomRequest: function(req, res, next) {
    // Cache only pages with status code 200. This is to avoid caching of 3xx/4xx/5xx status codes
    if (req.prerender.statusCode === 200) {
      //console.log('[memjs cache] saving page with  pageTTL ', pageTTL, ' and URL ', req.prerender.url);
      this.cache.set(req.prerender.url, req.prerender.documentHTML, function(err, val) {}, pageTTL);
    }
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
