// util.js
// Utility functions
//


var $ = require("jquery");

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

    scope.parseURL = parseURL;
})(module.exports);
