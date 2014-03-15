// ui.js
// All UI stuff goes here
//

var Promise = require("bluebird"),
	$ = require('jquery'),
	render = require("./render"),
	laslaz = require('./laslaz'),
	Nanobar = require('nanobar');


	require("jqueryui");
	require("jquery-layout");
	require("jquery-nouislider");
	require("bootstrap");

(function(scope) {
	"use strict";

	var withRefresh = function(f) {
		// return f wrapped around with a call to renderer.needRefresh
		return function() {
			var r = f.apply(this, arguments);
			$.event.trigger({
				type: 'plasio.renderer.needRefresh'
			});

			return r;
		};
	};

	// some globals we need
	//
	var fileLoadInProgress = false;
	var allBatches = []; // all the loaded batches

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
		setupProjectionHandlers();
	});

	var neobar = null;

	var startProgress = function() {
		if (neobar === null) {
			neobar = new Nanobar({
				bg: '#3FB8AF',
				target: document.getElementById('body'),
				id: 'loaderNano'
			});
		}
	};

	var showProgress = function(percent, msg) {
		if (neobar !== null) {
			neobar.go(percent);
			if (msg)
				$("#loadingStatus").html(msg);
		}
	};

	var hideProgress = function() {
		if (neobar !== null) {
			neobar.go(100);
			neobar = null;
		}

		$("#loadingStatus").html("");
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
		var p = Promise.defer();

		fr.onprogress = function(e) {
			p.progress(e.loaded / e.total);
		};
		fr.onload = function(e) {
			p.resolve(e.target.result);
		};

		fr.readAsArrayBuffer(file);

		return p.promise.cancellable().catch(Promise.CancellationError, function(e) {
			fr.abort();
			throw e;
		});
	};

	var loadFileInformation = function(header) {
		$(".props table").html(
			"<tr><td>Name</td><td>" + header.name + "</td></tr>" +
			"<tr><td>File Version</td><td>" + header.versionAsString + "</td></tr>" +
			"<tr><td>Compressed?</td><td>" + (header.isCompressed ? "Yes" : "No") + "</td></tr>" +
			//"<tr><td>Color?</td><td>" + (batcherHasColor ? "Yes" : "No") + "</td></tr>" +
			//"<tr><td>Intensity?</td><td>" + (batcherHasIntensity ? "Yes" : "No") + "</td></tr>" +
			"<tr><td>Total Points</td><td>" + numberWithCommas(header.pointsCount) + " (" +
			numberWithCommas(header.totalRead) + ") " + "</td></tr>" +
			"<tr><td>Point Format ID</td><td>" + header.pointsFormatId + "</td></tr>" +
			"<tr><td>Point Record Size</td><td>" + header.pointsStructSize + "</td></tr>").show();
	};

	var setupLoadHandlers = function() {
		// setup handlers which listens for notifications on how to do things
		//
		// Actions to trigger file loading
		//
		$(document).on("plasio.loadfiles.local", function(e) {
			cancellableLoad(getBinaryLocal, e.files);
		});

		$(document).on("plasio.loadfiles.remote", function(e) {
			cancellableLoad(function(cb) {
				return getBinary(e.url, cb);
			}, e.name);
		});

		$(document).on("plasio.load.started", function() {
			startProgress();
			showProgress(0);

			$("#loadError").html("").hide();
			$("#browse button").attr("disabled", true);
			$("#browse").hide();
			$("#browseCancel").show();

			fileLoadInProgress = true;
		});

		$(document).on("plasio.load.progress", function(e) {
			showProgress(e.percent, e.message);
		});

		var cleanup = function() {
			hideProgress();
			$("#browseCancel").hide();
			$("#browse button").attr("disabled", false);
			$("#browse").show();
			fileLoadInProgress = false;
		};

		var getScaleFromUser = function() {
			var p = Promise.defer();
			var $modal = $("#scalesPage");

			$modal.modal();
			$modal.on('hidden.bs.modal', function (e) {
				var chosen = $modal.attr("data-selection");
				var proj = null;
				switch(chosen) {
					case "0": proj = new THREE.Vector3(1, 1, 1); break;
					case "1": proj = new THREE.Vector3(111000, 111000, 1); break;
					case "2": proj = new THREE.Vector3(111000, 111000, 3.28084); break;
				}

				return p.resolve(proj);
			});

			return p.promise;
		};

		$(document).on("plasio.load.completed", function(e) {
			console.log(e.batches);

			console.log('Loaded batches:', e.batches);
			var batcherHasColor = false,
				batcherHasIntensity = false,
				batcherInSmallRange = false;

			for (var i = 0, il = e.batches.length ; i < il; i ++) {
				var batcher = e.batches[i].batcher;

				batcherHasColor = batcherHasColor ||
					(batcher.cx.r - batcher.cn.r) > 0.0 ||
					(batcher.cx.g - batcher.cn.g) > 0.0 ||
					(batcher.cx.b - batcher.cn.b) > 0.0;

				batcherHasIntensity = batcherHasIntensity ||
					(batcher.in_x - batcher.in_y) > 0.0;

				batcherInSmallRange = batcherInSmallRange ||
					(batcher.mn.x > -180.0 && batcher.mx.x < 180.0) &&
					(batcher.mn.y > -180.0 && batcher.mx.y < 180.0);
			}

			console.log('Has color:', batcherHasColor);
			console.log('Has intensity:', batcherHasIntensity);
			console.log('Has in range:', batcherInSmallRange);

			var p = batcherInSmallRange ? getScaleFromUser() : Promise.resolve(new THREE.Vector3(1, 1, 1));

			p.then(function(scale) {
				// load the batcher
				//
				var maxColorComponent = 0.0;

				var b = [];
				for (var i = 0, il = e.batches.length ; i < il ; i ++) {
					var batcher = e.batches[i].batcher;
					var header = e.batches[i].header;

					console.log('Loading batch:', batcher);
					maxColorComponent = Math.max(maxColorComponent,
												 batcher.cx.r, batcher.cx.g, batcher.cx.b);
					batcher.scale = scale;
					b.push({
						batcher: batcher,
						header: header
					});
				}

				allBatches = b;
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

				console.log('Max color component', maxColorComponent);

				$.event.trigger({
					type: "plasio.maxColorComponent",
					maxColorComponent: maxColorComponent
				});

				$.event.trigger({
					type: "plasio.newBatches"
				});


				// Set properties

				cleanup();
			});
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
	

	var loadData = function(buffer) {
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
						//progress(totalRead / totalToRead);

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
			//progress(100);

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
		$("#browseCancel button").on("click", withRefresh(function() {
			$.event.trigger({
				type: "plasio.load.cancel"
			});
		}));

		$(document).on('change', '.btn-file :file', withRefresh(function(e) {
			e.preventDefault();

			var input = $(this);
			var file = input.get(0).files[0];

			$.event.trigger({
				type: "plasio.loadfiles.local",
				file: file,
				name: file.name
			});
		}));

		$("#browse").on("click", "a", withRefresh(function(e) {
			e.preventDefault();

			var target = $(this).attr("href");

			// if we don't have LAZ available, we download the LAS version
			//
			if (!laslaz.LASModuleWasLoaded)
				target = target.replace(/\.laz$/, ".las");

			console.log("Will load", target);

			var name = target.substring(target.lastIndexOf('/')+1);

			$.event.trigger({
				type: "plasio.loadfiles.remote",
				url: target,
				name: name
			});
		}));
	};

	var cancellableLoad = function(fDataLoader, files, name) {
		//  fDataLoader should be a function that when called returns a promise which
		//  can be cancelled, the fDataLoader should resolve to an array buffer of loaded file
		//  and should correctly handle cancel requets.
		//
		var progress = function(pc, msg) {
			console.log("progress: ", pc, msg);
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

		loaderPromise =
		Promise.reduce(files, function(sofar, fname) {
			return fDataLoader(fname).then(loadData).then(function(r) {
				console.log('BATCH LOADED', r);
				console.log('FNAME', fname);

				var ret = {
					header: r[0],
					batcher: r[1]
				};

				ret.header.name = fname.name;
				return sofar.concat([ret]);
			});
		}, [])
		.then(function(v) {
			$.event.trigger({
				type: "plasio.load.completed",
				batches: v
			});
		})
		.progressed(progress)
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
			slide: withRefresh(function() {
				$.event.trigger({
					type: 'plasio.cameraFOVChanged'
				});
			})
		});

		$("#intensity").noUiSlider({
			range: [0, 100],
			start: [0, 100],
			connect: true,
			slide: withRefresh(function() {
				$.event.trigger({
					type: 'plasio.intensityClampChanged'
				});
			})
		});

		var setCurrentBatcher = function(index, resetCamera) {
			console.log('Setting active batcher at index:', index);

			var b = allBatches[index];
			render.loadBatcher(b.batcher, resetCamera);
			loadFileInformation(b.header);

			$.event.trigger({
				type: "plasio.needRefresh"
			});
		}

		$(document).on("plasio.newBatches", function() {
			// New batches have arrived, set the range accordingly on our slider and
			// set start to 0
			console.log('Got new batches!');

			var $h5 = $(".props h5");
			$h5.html("");

			if (allBatches.length > 1) {
				$("#multi-files").html("<div></div>");
				var $slider = $("#multi-files div");

				$h5.html("Use slider to switch between data sets and view data properties.");

				$slider.noUiSlider({
					range: [0, allBatches.length - 1],
					start: 0,
					handles: 1,
					step: 1,
					slide: function() {
						setCurrentBatcher(parseInt($slider.val()));
					},
				});
			}

			setCurrentBatcher(0, true);
			$(".props").show();
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
			slide: withRefresh(blendUpdate),
			set: withRefresh(blendUpdate)
		});

		$("#pointsize").noUiSlider({
			range: [1, 15],
			start: 3,
			handles: 1,
			step: 1,
			slide: withRefresh(function() {
				$.event.trigger({
					type: 'plasio.pointSizeChanged'
				});
			})
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
		$("#colorsource").on("click", "a", withRefresh(function(e) {
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
		}));

		$("#intensitysource").on("click", "a", withRefresh(function(e) {
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
		}));


		$("#colormap").on("click", "a", withRefresh(function(e) {
			e.preventDefault();
			var $a = $(this);

			var $img = $a.find("img");
			var imageUrl = $img.attr("src");

			var $target = $("#colormap").find("button img");
			$target.attr("src", imageUrl);

			$.event.trigger({
				type: "plasio.colormapChanged"
			});
		}));

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
		$("#perspective").on("click", withRefresh(function() {
			$.event.trigger({
				type: 'plasio.camera.perspective'
			});
		}));

		$("#ortho").on("click", withRefresh(function() {
			$.event.trigger({
				type: 'plasio.camera.ortho'
			});
		}));

		$("#top-view").on("click", withRefresh(function() {
			$.event.trigger({
				type: 'plasio.camera.topView'
			});
		}));

		$("#camera-reset").on("click", withRefresh(function() {
			$.event.trigger({
				type: 'plasio.camera.reset'
			});
		}));
		
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

		$("body").on("drop", withRefresh(function(e) {
			ignore(e);
			if (fileLoadInProgress)
				return;

			var dt = e.originalEvent.dataTransfer;
			var droppedFiles = dt.files;

			// convert from array like object to an array
			var toArray = function(m) {
				var a = [];
				for (var i = 0, il = m.length ; i < il ; i ++) {
					a.push(m[i]);
				}
				return a;
			};


			$.event.trigger({
				type: "plasio.loadfiles.local",
				files: toArray(droppedFiles),
				name: (droppedFiles.length === 1? droppedFiles[0].name : "Multiple Files")
			});
		}));
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

	var setupProjectionHandlers = function() {
		$("#scalesPage").on("click", "button", function(e) {
			e.preventDefault();

			var $button = $(this);
			var $modal = $(this).closest(".modal");

			$modal.attr("data-selection", $button.attr("data-value"));
			$modal.modal('hide');
		});
	};
})(window);

