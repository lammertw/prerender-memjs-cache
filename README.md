prerender-memjs-cache
=======================

Prerender plugin for memjs caching, to be used with the prerender node application from https://github.com/prerender/prerender.

How it works
------------

This plugin will store all prerendered pages into a memjs service ([MemCachier](http://memcachier.com/)). There is currently no expiration functionality, which means that once a page is stored, future requests for prerendering a page will always be served from from the cache if it's available and the page caches are never updated.

To get a fresh cache, you will have to delete the cache in the manually or from another process.

How to use
----------

In your local prerender project run:

    $ npm install prerender-memjs-cache --save

Then in the server.js that initializes the prerender:

    server.use(require('prerender-memjs-cache'));

Configuration
-------------

The plugin uses the memjs module. It's configuration is explained at https://github.com/alevy/memjs/blob/master/README.md.