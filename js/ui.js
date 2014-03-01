// ui.js
// All UI stuff goes here
//

(function(scope) {
	"use strict";

	// Start UI
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

		// bind open action to show popup
		$("#fileOpenAction").on("click", function() {
			$("#fileOpen").modal();
		});


		setupFileOpenHandlers();
	});


	scope.startUpload = function() {
	};

	scope.uploadProgress = function(p) {
	};

	scope.uploadComplete = function() {
	};

	var setupFileOpenHandlers = function() {
		$(document).on('change', '.btn-file :file', function(e) {
			var input = $(this);
			var file = input.get(0).files[0];

			e.preventDefault();

			//message("Loading " + file.name + " ...");

			var fr = new FileReader();
			fr.onload = function(e) {
				var d = e.target.result;
				var lf = new LASFile(d);

				console.log('Compressed?', lf.isCompressed);
				lf.open().then(function() {
					return lf.getHeader();
				}).then(function(header) {
					console.log('Got', header);

					var batcher = new ParticleSystemBatcher(
						$("#vertexshader").text(),
						$("#fragmentshader").text());

					var reader = function() {
						return lf.readData(1000000, 0, 0).then(function(data) {
							batcher.push(new LASDecoder(data.buffer,
														header.pointsFormatId,
														header.pointsStructSize,
														data.count,
														header.scale,
														header.offset));

							console.log('Got data', data.count);
							if (data.hasMoreData)
								return reader();
							else
								loadBatcher(batcher);
						});
					};
					return reader();
				}).then(function() {
					console.log('Done');
				});
			};
			/*
			fr.onload = function(e) {
				var buf = e.target.result;
				console.log("Data read complete: ", buf.byteLength);

				try {
					if (endsWith(file.name.toLowerCase(), ".las")) {
						var lf = new LASBuffer(buf);
						var batcher = new ParticleSystemBatcher(
							$("#vertexshader").text(),
							$("#fragmentshader").text());

							batcher.push(lf);
							loadBatcher(batcher);
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

								var batcher = new ParticleSystemBatcher(
									$("#vertexshader").text(),
									$("#fragmentshader").text());

									var readSoFar = 0;
									var totalToRead = header.point_count;

									var loadPoints = function() {
										lf.readData(1000000, 100, function(err, res, count, hasMore) {
											if (err) return console.log('Error loading data:', err);

											readSoFar += count;
											uploadProgress(readSoFar / totalToRead);

											batcher.push(new LASWrapper(res,
																		header.point_format_id,
																		header.point_record_length,
																		count,
																		header.scales,
																		header.offsets));
																		if (hasMore)
																			loadPoints();
																		else {
																			console.log('Done reading data');
																			loadBatcher(batcher);

																			uploadComplete();
																		}
										});
									};

									startUpload();
									loadPoints();
							});
						});
					}
				}
				catch(e) {
					errorOut(e.message);
				}
			};*/

			fr.readAsArrayBuffer(file);
		});
	};


})(window);

