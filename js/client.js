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
		startRenderer(message);
	};

})(window);

$(function() {
	setTimeout(start, 500);
});
