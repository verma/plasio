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


	w.start = function() {
		startRenderer($("#container").get(0), message);
	};

})(window);

$(function() {
	setTimeout(function() {
		var isChromium = window.chrome,
		vendorName = window.navigator.vendor;
		console.log(isChromium, vendorName);

		if(isChromium !== undefined && vendorName === "Google Inc.") {
			$(".fullscreen").fadeOut(200);
			start();
		}
		else {
			$("#no-support").css("opacity", 1.0);
		}
	}, 1000);
});
