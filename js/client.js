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

	$("#lasfile").on("change", function(e) {
		e.preventDefault();

		console.log("File chosen!")

		var file = $("#lasfile").get(0).files[0];
		message("Loading " + file.name + " ...");

		var fr = new FileReader();
		fr.onload = function(e) {
			var buf = e.target.result;
			console.log("Data read complete: ", buf.byteLength);

			try {
				if (endsWith(file.name.toLowerCase(), ".las")) {
					var lf = new LASBuffer(buf);
					loadLASBuffer(lf);
					message("Load complete. Now viewing " + file.name);
				}
				else {
					var lf = new AsyncLAZBuffer(buf);
					lf.open(function(err, msg) {
						if (err) return console.log('Error:', err.message);
						console.log('Open status:', msg);

						lf.getHeader(function(err, header) {
							if (err) return console.log('Error getting header:', err.message);
							console.log('Get header status:', header);

							var toRead = header.point_count;
							var batcher = new ParticleSystemBatcher(
								$("#vertexshader").text(),
								$("#fragmentshader").text());

							var loadPoints = function() {
								var readThisFrame = Math.min(1000000, toRead);
								toRead -= readThisFrame;

								console.log('toRead:', toRead, 'readThisFrame', readThisFrame);

								lf.readData(readThisFrame, function(err, res) {
									if (err) return console.log('Error loading data:', err);

									batcher.push(new LASWrapper(res.buffer,
																header.point_format_id,
																header.point_record_length,
																readThisFrame,
																header.scales,
																header.offsets));
									if (toRead > 0) {
										console.log('Got data to read');
										loadPoints();
									}
									else {
										console.log('Done reading data');
										loadBatcher(batcher);
									}
								});
							}

							loadPoints();
						});
					});
				}
			}
			catch(e) {
				errorOut(e.message);
			}
		};

		fr.readAsArrayBuffer(file);
	});

	w.start = function() {
		startRenderer(message);
	};

})(window);

$(function() {
	var layout = $("body").layout({
		applyDefaultStyles: true,
		east: {
			resizable: true,
			resize: true,
			togglerContent_open:   "&#8250;",
			togglerContent_closed: "&#8249;",
			minSize: 200,
			maxSize: 600,
			size: 400
		},

		onresize: function() {
			doRenderResize();
		}});

	setTimeout(start, 500);
});
