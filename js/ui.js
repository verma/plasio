// ui.js
// All UI stuff goes here
//

var Promise = require("bluebird"),
	$ = require('jquery'),
	render = require("./render"),
	laslaz = require('./laslaz');


	require("jqueryui");
	require("jquery-layout");
	require("jquery-nouislider");
	require("bootstrap");

(function(scope) {
	"use strict";

	// some globals we need
	//
	var fileLoadInProgress = false;

	// Start UI
	$(document).on("plasio.startUI", function() {
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
				render.doRenderResize();
			}});


		setupFileOpenHandlers();
		setupSliders();
		setupComboBoxActions();
		setupCameraActions();
		setupNaclErrorHandler();
		setupWebGLStateErrorHandler();
		setupDragHandlers();
		makePanelsSlidable();
		setupLoadHandlers();
	});

	var showProgress = function(percent, msg) {
		if (msg)
			$("#loaderProgress p").html(msg);

		$("#loaderProgress .progress-bar").attr('aria-valuenow', percent).width(percent);
	};

	var numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	var getBinary = function(url, cb) {
		var oReq = new XMLHttpRequest();
		return new Promise(function(resolve, reject) {
			oReq.open("GET", url, true);
			oReq.responseType = "arraybuffer";

			oReq.onprogress = function(e) {
				cb(e.loaded / e.totalSize);
			};

			oReq.onload = function(oEvent) {
				if (oReq.status == 200) {
					console.log(oReq.getAllResponseHeaders());
					return resolve(oReq.response);
				}
				reject(new Error("Could not get binary data"));
			};

			oReq.send();
		}).cancellable().catch(Promise.CancellationError, function(e) {
			oReq.abort();
			throw e;
		});
	};

	var getBinaryLocal = function(file, cb) {
		var fr = new FileReader();
		return new Promise(function(resolve, reject) {
			fr.onprogress = function(e) {
				cb(e.loaded / e.total);
			};
			fr.onload = function(e) {
				resolve(e.target.result);
			};
			fr.readAsArrayBuffer(file);
		}).cancellable().catch(Promise.CancellationError, function(e) {
			fr.abort();
			throw e;
		});
	};


	var setupLoadHandlers = function() {
		// setup handlers which listens for notifications on how to do things
		//
		// Actions to trigger file loading
		//
		$(document).on("plasio.loadfile.local", function(e) {
			cancellableLoad(function(cb) {
				return getBinaryLocal(e.file, cb);
			}, e.name);
		});

		$(document).on("plasio.loadfile.remote", function(e) {
			cancellableLoad(function(cb) {
				return getBinary(e.url, cb);
			}, e.name);
		});

		$(document).on("plasio.load.started", function() {
			showProgress(0);

			$("#loaderProgress").show();
			$("#loadError").html("").hide();

			$("#browse button").attr("disabled", true);

			fileLoadInProgress = true;
		});

		$(document).on("plasio.load.progress", function(e) {
			showProgress(e.percent, e.message);
		});

		var cleanup = function() {
			$("#loaderProgress").hide();
			$("#browse button").attr("disabled", false);
			fileLoadInProgress = false;
		};

		$(document).on("plasio.load.completed", function(e) {
			var batcher = e.batcher;
			var header = e.header;

			// load the batcher
			render.loadBatcher(batcher);
			console.log(batcher);

			var batcherHasColor =
				(batcher.cx.r - batcher.cn.r) > 0.0 ||
				(batcher.cx.g - batcher.cn.g) > 0.0 ||
				(batcher.cx.b - batcher.cn.b) > 0.0;

			var batcherHasIntensity =
				(batcher.in_x - batcher.in_y) > 0.0;

			console.log('Has color:', batcherHasColor);
			console.log('Has intensity:', batcherHasIntensity);

			if (batcherHasColor && batcherHasIntensity) {
				// enable both intensity and color, and set blend to 50
				$("#rgb").trigger("click");
				$("#intensity").trigger("click");
				$("#blending").val(50, true);
			}
			else if (batcherHasColor && !batcherHasIntensity) {
				$("#rgb").trigger("click");
				$("#blending").val(0, true);
			}
			else if (!batcherHasColor && batcherHasIntensity) {
				$("#intensity").click();
				$("#blending").val(100, true);
			}
			else {
				// no color, no intensity
				$(".default-if-no-color").trigger("click");
				$("#blending").val(0, true);
			}

			var maxColorComponent = Math.max(batcher.cx.r, batcher.cx.g, batcher.cx.b);
			console.log('Max color component', maxColorComponent);
			$.event.trigger({
				type: "plasio.maxColorComponent",
				maxColorComponent: maxColorComponent
			});

			// Set properties
			$(".props").html(
				"<tr><td>Name</td><td>" + header.name + "</td></tr>" +
				"<tr><td>File Version</td><td>" + header.versionAsString + "</td></tr>" +
				"<tr><td>Compressed?</td><td>" + (header.isCompressed ? "Yes" : "No") + "</td></tr>" +
				"<tr><td>Total Points</td><td>" + numberWithCommas(header.pointsCount) + " (" +
				numberWithCommas(header.totalRead) + ") " + "</td></tr>" +
				"<tr><td>Point Format ID</td><td>" + header.pointsFormatId + "</td></tr>" +
				"<tr><td>Point Record Size</td><td>" + header.pointsStructSize + "</td></tr>").show();

			cleanup();
		});

		$(document).on("plasio.load.cancelled", function(e) {
			$("#loadError").html(
				'<div class="alert alert-info alert-dismissable">' +
				'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
				'The file load operation was cancelled' +
				'</div>').show();

			console.log("Operation cancelled!!");
			cleanup();
		});

		$(document).on("plasio.load.failed", function(e) {
			$("#loadError").html(
				'<div class="alert alert-danger alert-dismissable">' +
				'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
				'<strong>Error!</strong> ' + e.error +
				'</div>').show();

			cleanup();
		});
	};
	

	var loadData = function(buffer, progress) {
		var lf = new laslaz.LASFile(buffer);

		return Promise.resolve(lf).cancellable().then(function(lf) {
			return lf.open().then(function() {
				lf.isOpen = true;
				return lf;
			})
			.catch(Promise.CancellationError, function(e) {
				// open message was sent at this point, but then handler was not called
				// because the operation was cancelled, explicitly close the file
				return lf.close().then(function() {
					throw e;
				});
			});
		}).then(function(lf) {
			return lf.getHeader().then(function(h) {
				return [lf, h];
			});
		}).then(function(v) {
			var lf = v[0];
			var header = v[1];

			var batcher = new render.ParticleSystemBatcher(
				$("#vertexshader").text(),
				$("#fragmentshader").text());

				var skip = Math.round((10 - currentLoadFidelity()));
				var totalRead = 0;
				var totalToRead = (skip <= 1 ? header.pointsCount : header.pointsCount / skip);
				var reader = function() {
					var p = lf.readData(1000000, 0, skip);
					return p.then(function(data) {
						batcher.push(new laslaz.LASDecoder(data.buffer,
														   header.pointsFormatId,
														   header.pointsStructSize,
														   data.count,
														   header.scale,
														   header.offset));

						totalRead += data.count;
						progress(totalRead / totalToRead);

						if (data.hasMoreData)
							return reader();
						else {

							header.totalRead = totalRead;
							header.versionAsString = lf.versionAsString;
							header.isCompressed = lf.isCompressed;
							return [lf, header, batcher];
						}
					});
				};

				// return the lead reader
				return reader();
		}).then(function(v) {
			var lf = v[0];
			// we're done loading this file
			//
			progress(100);

			// Close it
			return lf.close().then(function() {
				lf.isOpen = false;
				// Delay this a bit so that the user sees 100% completion
				//
				return Promise.delay(200).cancellable();
			}).then(function() {
				// trim off the first element (our LASFile which we don't really want to pass to the user)
				//
				return v.slice(1);
			});
		}).catch(Promise.CancellationError, function(e) {
			// If there was a cancellation, make sure the file is closed, if the file is open
			// close and then fail
			if (lf.isOpen) 
				return lf.close().then(function() {
					lf.isOpen = false;
					console.log("File was closed");
					throw e;
				});
			throw e;
		});
	};

	var setupFileOpenHandlers = function() {
		$("#loaderProgress").hide();
		$("#loaderProgress button").on("click", function() {
			$.event.trigger({
				type: "plasio.load.cancel"
			});
		});

		$(document).on('change', '.btn-file :file', function(e) {
			e.preventDefault();

			var input = $(this);
			var file = input.get(0).files[0];

			$.event.trigger({
				type: "plasio.loadfile.local",
				file: file,
				name: file.name
			});
		});

		$("#browse").on("click", "a", function(e) {
			e.preventDefault();

			var target = $(this).attr("href");

			// if we don't have LAZ available, we download the LAS version
			//
			if (!laslaz.LASModuleWasLoaded)
				target = target.replace(/\.laz$/, ".las");

			console.log("Will load", target);

			var name = target.substring(target.lastIndexOf('/')+1);

			$.event.trigger({
				type: "plasio.loadfile.remote",
				url: target,
				name: name
			});
		});
	};

	var cancellableLoad = function(fDataLoader, name) {
		//  fDataLoader should be a function that when called returns a promise which
		//  can be cancelled, the fDataLoader should resolve to an array buffer of loaded file
		//  and should correctly handle cancel requets.
		//
		var progress = function(pc, msg) {
			var obj = {
				type: "plasio.load.progress",
				percent: Math.round(pc * 100)
			};

			if (msg !== undefined) obj.message = msg;
			$.event.trigger(obj);
		};
		
		var loaderPromise = null;
		$(document).on("plasio.load.cancel", function() {
			if (loaderPromise === null) return;

			var a = loaderPromise;
			loaderPromise = null;

			progress(100, "Cancelling...");
			setTimeout(function() {
				a.cancel();
			}, 0);
		});

		$.event.trigger({
			type: "plasio.load.started"
		});

		progress(0, "Fetching " + name + "...");
		loaderPromise = fDataLoader(progress)
			.then(function(data) {
				progress(100);
				return Promise.delay(200).cancellable().then(function() {
					progress(0, "Decoding...");
					return loadData(data, progress);
				});
			})
			.then(function(v) {
				var header = v[0];
				var batcher = v[1];

				// add name to header
				header.name = name;

				$.event.trigger({
					type: "plasio.load.completed",
					batcher: batcher,
					header: header
				});
			})
			.catch(Promise.CancellationError, function(e) {
				console.log("Cancel", e);
				console.log(e.stack);

				$.event.trigger({
					type: "plasio.load.cancelled",
				});
			})
			.catch(function(e) {
				console.log("Error", e);
				console.log(e.stack);

				$.event.trigger({
					type: "plasio.load.failed",
					error: e.message
				});
			})
			.finally(function() {
				loaderPromise = null;
			});
	};

	var setupSliders = function() {
		$("#loadFidelity").noUiSlider({
			range: [1, 9],
			start: 5,
			handles: 1,
			connect: "lower",
			step: 1
		});

		$("#fov").noUiSlider({
			range: [30, 110],
			start: 60,
			handles: 1,
			connect: "lower",
			slide: function() {
				$.event.trigger({
					type: 'plasio.cameraFOVChanged'
				});
			}
		});

		$("#intensity").noUiSlider({
			range: [0, 100],
			start: [0, 100],
			connect: true,
			slide: function() {
				$.event.trigger({
					type: 'plasio.intensityClampChanged'
				});
			}
		});

		var blendUpdate = function() {
			$.event.trigger({
				type: 'plasio.intensityBlendChanged'
			});
		};

		$("#blending").noUiSlider({
			range: [0, 100],
			start: 0,
			handles: 1,
			slide: blendUpdate,
			set: blendUpdate
		});

		$("#pointsize").noUiSlider({
			range: [1, 15],
			start: 3,
			handles: 1,
			step: 1,
			slide: function() {
				$.event.trigger({
					type: 'plasio.pointSizeChanged'
				});
			}
		});

		scope.currentFOV = function() {
			return $("#fov").val();
		};

		scope.currentLoadFidelity = function() {
			return $("#loadFidelity").val();
		};

		scope.currentIntensityClamp = function() {
			return $("#intensity").val();
		};

		scope.currentIntensityBlend = function() {
			return $("#blending").val();
		};

		scope.currentPointSize = function() {
			return $("#pointsize").val();
		};
	};

	var setupComboBoxActions = function() {
		$("#colorsource").on("click", "a", function(e) {
			e.preventDefault();
			var $a = $(this);
			console.log($a);

			var option = $a.text();
			var target = $a.attr("href").substring(1);
			$("#colorsource").find("button")
				.html(option + "&nbsp;<span class='caret'></span>")
				.attr("target", target);

			$.event.trigger({
				type: "plasio.colorsourceChanged"
			});
		});

		$("#intensitysource").on("click", "a", function(e) {
			e.preventDefault();
			var $a = $(this);
			console.log($a);

			var option = $a.text();
			var target = $a.attr("href").substring(1);
			$("#intensitysource").find("button")
				.html(option + "&nbsp;<span class='caret'></span>")
				.attr("target", target);

			$.event.trigger({
				type: "plasio.intensitysourceChanged"
			});
		});


		$("#colormap").on("click", "a", function(e) {
			e.preventDefault();
			var $a = $(this);

			var $img = $a.find("img");
			var imageUrl = $img.attr("src");

			var $target = $("#colormap").find("button img");
			$target.attr("src", imageUrl);

			$.event.trigger({
				type: "plasio.colormapChanged"
			});
		});

		scope.currentColorSource = function() {
			var source = $("#colorsource button").attr('target');
			return source;
		};

		scope.currentIntensitySource = function() {
			var source = $("#intensitysource button").attr('target');
			return source;
		};

		scope.currentColorMap = function() {
			var $target = $("#colormap").find("button img");
			return $target.attr("src");
		};
	};

	var setupCameraActions = function() {
		$("#perspective").on("click", function() {
			$.event.trigger({
				type: 'plasio.camera.perspective'
			});
		});

		$("#ortho").on("click", function() {
			$.event.trigger({
				type: 'plasio.camera.ortho'
			});
		});

		$("#top-view").on("click", function() {
			$.event.trigger({
				type: 'plasio.camera.topView'
			});
		});

		$("#camera-reset").on("click", function() {
			$.event.trigger({
				type: 'plasio.camera.reset'
			});
		});
		
	};

	var setupNaclErrorHandler = function() {
		$(document).on("plasio.nacl.error", function(err) {
			console.log(err);
			$("#naclerror").html("<div class='alert alert-warning'><span class='glyphicon glyphicon-info-sign'></span>&nbsp;" +
								 "<strong>LASzip not available!</strong><br>" + err.message + "</div>");
			$("#naclerror").show();
		});
	};

	var setupWebGLStateErrorHandler = function() {
		$(document).on("plasio.webglIsExperimental", function() {
			$("#webglinfo").html("<div class='alert alert-warning'>" +
								"<span class='glyphicon glyphicon-info-sign'></span>&nbsp;" +
								 "<strong>Experimental WebGL!</strong><br>" + 
								 "Your browser reports that its WebGL support is experimental." +
								 "  You may experience rendering problems.</div>");
			$("#webglinfo").show();
		});
	};

	var setupDragHandlers = function() {
		var ignore = function(e) {
			e.originalEvent.stopPropagation();
			e.originalEvent.preventDefault();
		};

		var dragEnter = function() {
			$(".drag-and-drop").show();
		};

		var dragLeave = function() {
			console.log("Outside");
			$(".drag-and-drop").hide();
		};

		var hideto = null;
		$("body").on("dragover", function(e) {
			ignore(e);

			// no drag drop indication when file load is in progress
			if (fileLoadInProgress)
				return;

			if (hideto === null)
				dragEnter();
			else
				clearTimeout(hideto);

			hideto = setTimeout(function() {
				dragLeave();
				hideto = null;
			}, 100);
		});

		$("body").on("dragenter", ignore);
		$("body").on("dragleave", ignore);

		$("body").on("drop", function(e) {
			ignore(e);
			if (fileLoadInProgress)
				return;

			var dt = e.originalEvent.dataTransfer;
			var droppedFiles = dt.files;


			$.event.trigger({
				type: "plasio.loadfile.local",
				file: droppedFiles[0],
				name: droppedFiles[0].name
			});
		});
	};

	var makePanelsSlidable = function() {
		// find all panel headers and add make them into slidable widgets
		//
		$(".p-head")
			.addClass("clearfix p-collapse-open")
			.css("cursor", "pointer")
			.append("<div class='toggle-control'>" +
					"<span class='glyphicon glyphicon-chevron-up'></span></div>");
		$(".p-head h3").css("float", "left");


		$("body").on("click", ".p-head", function() {
			var $control = $(this);
			var isOpen = $control.hasClass("p-collapse-open");
			var $scroller = $control.next(".p-body");
			var $span = $control.find(".toggle-control span");
			if (isOpen)
				$scroller.slideUp(200, function() {
					$control
						.removeClass("p-collapse-open")
						.addClass("p-collapse-close");

					$span.attr("class", "glyphicon glyphicon-chevron-down");
				});
			else {
				// when scrolling down appply styles first, for awesomeness effect
				$control
					.removeClass("p-collapse-close")
					.addClass("p-collapse-open");

				$span.attr("class", "glyphicon glyphicon-chevron-up");
				$scroller.slideDown(200);
			}
		});
	};
})(window);

