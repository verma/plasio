// client.js
// Client side stuffs for greyhound web viewer
//
function endsWith(str, s) {
	return str.indexOf(s) === (str.length - s.length);
}

(function(w) {
	"use strict";

	// show an error message to the user
	//
	var errorOut = function(msg) {
		$("#messages").html("<p class='error'>" + msg + "</p>");
		console.log('Error : ' + msg);
	};

	// show a status message to the user
	var message = function(msg) {
		$("#messages").html("<p class='message'>" + msg + "</p>");
		console.log('Status: ' + msg);
	};

	$(document).on("plasio.start", function() {
		startRenderer($("#container").get(0), message);
	});

})(window);

$(function() {
	setTimeout(function() {
		var isChromium = window.chrome,
		vendorName = window.navigator.vendor;

		// if we're good to go, trigger the plasio.start event, all initializers
		// should be hooked to this event, and not DOMContentLoaded
		//
		if(isChromium !== undefined && vendorName === "Google Inc.") {
			$(".fullscreen").fadeOut(200);
			$.event.trigger({
				type: "plasio.start"
			});
		}
		else {
			$("#no-support").css("opacity", 1.0);
		}
	}, 1000);
});
