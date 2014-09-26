// util.js
// Utility functions
//


var $ = require("jquery");
var m = require('mori');

(function(scope) {
	"use strict";

	scope.withRefresh = function(f) {
		// return f wrapped around with a call to renderer.needRefresh
		return function() {
			var r = f.apply(this, arguments);
			$.event.trigger({
				type: 'plasio.renderer.needRefresh'
			});

			return r;
		};
	};

    // Borrowed without shame from here: http://www.abeautifulsite.net/parsing-urls-in-javascript/
    var parseURL = function (url) {
        var parser = document.createElement('a'),
            searchObject = {},
            queries, split, i;

        // Let the browser do the work
        parser.href = url;
        // Convert query string to object
        queries = parser.search.split('&');

        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }

        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    };

    scope.parseGHComponents = function(url) {
        // needs to be one of the supported URL formats
        var parts = parseURL(url);
        console.log(parts);
        var pipeline = parts.pathname.match(/\/([a-zA-Z0-9]+)$/);
        if (!pipeline)
            return null;


        pipeline = pipeline[1];

        return {
            server: parts.host,
            pipelineId: pipeline
        };
    };

    var RateCompute = function() {
        this.dl = 0;
        this.start = Date.now();
        this.ts = [];
        this.message = "NA";
    };

    RateCompute.prototype.push = function(count) {
        if (this.ts.length > 5)
            this.ts = this.ts.slice(1);

        this.dl += count;
        this.ts.push([Date.now(), this.dl]);

        this._updateRate();
    };

    RateCompute.prototype._updateRate = function() {
        // running average of last five time slots
        if (this.ts.length < 2) return; // need two samples

        var rate = m.pipeline(
            this.ts,
            function(v) { return m.partition(2, 1, v); },
            function(v) {
                return m.reduce(function(acc, v) {
                    var a = m.first(v),
                        b = m.first(m.rest(v));

                    var td = (b[0] - a[0]) / 1000.0; // time difference in seconds
                    var dd = b[1] - a[1];

                    return m.conj(acc, dd / td);
                }, m.vector(), v);
            },
            function(v) {
                return m.reduce(m.sum, v) / m.count(v);
            });

        this.message = this._makePrettyMessage(rate);
    };

    RateCompute.prototype._makePrettyMessage = function(r) {
        if (r < 1024) return r.toFixed(0) + "B/s";
        if (r < 1024*1024) return (r/1024).toFixed(1) + "KB/s";
        if (r < 1024*1024*1024) return (r/(1024 * 1024)).toFixed(1) + "MB/s";
        return (r/(1024 * 1024 * 1024)).toFixed(1) + "GB/s WOAH!";
    };

    scope.RateCompute = RateCompute;
    scope.parseURL = parseURL;
})(module.exports);
