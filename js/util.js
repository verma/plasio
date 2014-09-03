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
})(module.exports);
