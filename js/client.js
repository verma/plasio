// client.js
// Client side stuffs for greyhound web viewer
//

var isLAZDecoderAvailable = false;

var pointFormatReaders = {
	1: function(dv) {
		return {
			"position": [ dv.getInt32(0, true), dv.getInt32(4, true), dv.getInt32(8, true)],
			"intensity": dv.getUint16(12, true),
			"classification": dv.getUint8(16, true)
		};
	},
	2: function(dv) {
		return {
			"position": [ dv.getInt32(0, true), dv.getInt32(4, true), dv.getInt32(8, true)],
			"intensity": dv.getUint16(12, true),
			"classification": dv.getUint8(16, true),
			"color": [dv.getUint16(20, true), dv.getUint16(22, true), dv.getUint16(24, true)]
		};
	},
	3: function(dv) {
		return {
			"position": [ dv.getInt32(0, true), dv.getInt32(4, true), dv.getInt32(8, true)],
			"intensity": dv.getUint16(12, true),
			"classification": dv.getUint8(16, true),
			"color": [dv.getUint16(28, true), dv.getUint16(30, true), dv.getUint16(32, true)]
		};
	}
};


var LASBuffer = function(arraybuffer) {
	this.arrayb = arraybuffer;
	if (!this.isMagicValid())
		throw new Error("Invalid file magic header");

	this.version = this.parseVersion();
	this.versionAsString = (this.version/10).toFixed(0) + "." + (this.version % 10).toFixed(0);

	console.log("Magic is valid");
	console.log("LAS file version:", this.versionAsString);

	// make sure the file version is < 12
	if (this.version >= 13)
		throw new Error("Only LAS files version <= 1.2 are supported");

	this.readHeader();
	this.validatePointStore();
};

LASBuffer.prototype.isMagicValid = function() {
	var validMagic = "LASF";

	var mLength = validMagic.length;
	var magic = new Int8Array(this.arrayb, 0, mLength);

	for (var i = 0 ; i < mLength ; i ++) {
		if (magic[i] != validMagic.charCodeAt(i))
			return false;
	}

	return true;
};

LASBuffer.prototype.parseVersion = function() {
	var ver = new Int8Array(this.arrayb, 24, 2);

	return ver[0] * 10 + ver[1];
};

function readAs(buf, Type, offset, count) {
	count = (count === undefined || count === 0 ? 1 : count);
	var sub = buf.slice(offset, offset + Type.BYTES_PER_ELEMENT * count);

	var r = new Type(sub);
	if (count === undefined || count === 1)
		return r[0];

	var ret = []
	for (var i = 0 ; i < count ; i ++) {
		ret.push(r[i]);
	}

	return ret;
}

LASBuffer.prototype.readHeader = function() {
	this.pointsOffset = readAs(this.arrayb, Uint32Array, 32*3);
	this.pointsFormatId = readAs(this.arrayb, Uint8Array, 32*3+8);
	this.pointsStructSize = readAs(this.arrayb, Uint16Array, 32*3+8+1);
	this.pointsCount = readAs(this.arrayb, Uint32Array, 32*3 + 11);

	this.formatReader = pointFormatReaders[this.pointsFormatId];

	console.log("Points offset: ", this.pointsOffset);
	console.log("Points Id: ", this.pointsFormatId);
	console.log("Points Size: ", this.pointsStructSize);
	console.log("Points Count: ", this.pointsCount);


	var start = 32*3 + 35;
	this.scale = readAs(this.arrayb, Float64Array, start, 3); start += 24; // 8*3
	this.offset = readAs(this.arrayb, Float64Array, start, 3); start += 24;

	console.log("Scale: ", this.scale);
	console.log("Offset: ", this.offset);

	var bounds = readAs(this.arrayb, Float64Array, start, 6); start += 48; // 8*6;
	this.maxs = [bounds[0], bounds[2], bounds[4]];
	this.mins = [bounds[1], bounds[3], bounds[5]];

	console.log("Bounds min:", this.mins);
	console.log("Bounds max:", this.maxs);
};

LASBuffer.prototype.pointStride = function() {
	if (this.pointsStructSize !== 0)
		return this.pointsStructSize;

	switch(this.pointsFormatId) {
		case 1: return 28;
		case 2: return 26;
		case 3: return 26+8;
	}

	throw new Error("Could not determine point stride");
};

LASBuffer.prototype.validatePointStore = function() {
	// make sure the sizes we determine for points and what the file reports are correct
	//
	var diff = this.arrayb.byteLength - this.pointsOffset;

	if (diff % this.pointStride() !== 0)
		throw new Error("Point store size is not a multiple of point size");

	if (diff / this.pointStride() !== this.pointsCount)
		throw new Error("Computed point count is not the same as point count in file header");
};

LASBuffer.prototype.getPoint = function(index) {
	if (index < 0 || index >= this.pointsCount)
		throw new Error("Point index out of range");

	var dv = new DataView (this.arrayb, this.pointsOffset + this.pointStride() * index, this.pointStride());
	return this.formatReader(dv);
};

// only one waiting command at a time
// 
var waitingHandler = null;
function handleMessage(message_event) {
	var msg = message_event.data;
	common.logMessage("From module: " + msg);

	if (waitingHandler === null)
		return console.log("Got a message but there is no waiting handler");

	waitingHandler(msg);
}

var doExchange = function(cmd, callback) {
	waitingHandler = function(msg) {
		// call the callback in a separate context, make sure we've cleaned our
		// state out before the callback is invoked since it may queue more doExchanges
		console.log(msg);
		setTimeout(function() { 
			if (msg.status !== undefined && msg.status === false)
				return callback(new Error(msg.message || "Unknown Error"));
			callback(null, msg);
		}, 0);
	}
	nacl_module.postMessage(cmd);
}

var AsyncLAZBuffer = function(buffer) {
	if (!isLAZDecoderAvailable)
		throw new Error("LAZ Decoder is not available");

	this.arrayb = buffer;
};

AsyncLAZBuffer.prototype.open = function(cb) {
	doExchange({
		'command': 'open',
		'target': 'myfile',
		'buffer': this.arrayb
	}, cb);
};

AsyncLAZBuffer.prototype.getHeader = function(cb) {
	doExchange({ command: 'getheader'}, cb);
};

AsyncLAZBuffer.prototype.readData = function(buf, cb) {
	doExchange({
		command: 'read',
		buffer: buf
	}, cb);
}

function endsWith(str, s) {
	return str.indexOf(s) === (str.length - s.length);
}

// ducktype compatible with LASBuffer
//
var LASWrapper = function(buffer, pointFormatID, pointSize, pointsCount, scale, offset) {
	this.arrayb = buffer;
	this.decoder = pointFormatReaders[pointFormatID];
	this.pointsCount = pointsCount;
	this.pointSize = pointSize;
	this.scale = scale;
	this.offset = offset;

	console.log('decoder', this.decoder);
};

LASWrapper.prototype.getPoint = function(index) {
	if (index < 0 || index >= this.pointsCount)
		throw new Error("Point index out of range");

	var dv = new DataView(this.arrayb, index * this.pointSize, this.pointSize);
	return this.decoder(dv);
};

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

							// finally get the data out
							var pointCount = Math.min(header.point_count, 100000);
							var arr = new ArrayBuffer(pointCount * header.point_record_length);
							lf.readData(arr, function(err, res) {
								console.log(err, res);

								var view = new Uint8Array(res.buffer);
								for (var i = 0 ; i < 100 ; i ++) {
									console.log(view[i]);
									loadLASBuffer(new LASWrapper(res.buffer,
																 header.point_format_id,
																 header.point_record_length,
																 pointCount,
																 header.scales,
																 header.offsets));
									 message("Load complete. Now viewing " + file.name);
								}
							});
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

// Called by the common.js module.
window.domContentLoaded = function(name, tc, config, width, height) {
	navigator.webkitPersistentStorage.requestQuota(2048 * 2048, function(bytes) {
		common.updateStatus(
			'Allocated ' + bytes + ' bytes of persistant storage.');
			common.attachDefaultListeners();
			common.createNaClModule(name, tc, config, width, height);
	},
	function(e) { alert('Failed to allocate space') });
};

window.moduleDidLoad = function() {
	common.hideModule();
	isLAZDecoderAvailable = true;
}

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
