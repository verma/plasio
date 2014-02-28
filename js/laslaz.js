// laslaz.js
// LAS/LAZ loading

(function(scope) {
	"use strict";

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
	scope.handleMessage = function(message_event) {
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
		if (!scope.LASModuleWasLoaded)
			throw new Error("LAZ Decoder is not available");

		this.arrayb = buffer;
	};

	AsyncLAZBuffer.prototype.open = function(cb) {
		doExchange({
			command: 'open',
			target: 'myfile',
			buffer: this.arrayb
		}, cb);
	};

	AsyncLAZBuffer.prototype.getHeader = function(cb) {
		doExchange({ command: 'getheader'}, cb);
	};

	AsyncLAZBuffer.prototype.readData = function(count, cb) {
		doExchange({
			command: 'read',
			count: count
		}, cb);
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
	};

	LASWrapper.prototype.getPoint = function(index) {
		if (index < 0 || index >= this.pointsCount)
			throw new Error("Point index out of range");

		var dv = new DataView(this.arrayb, index * this.pointSize, this.pointSize);
		return this.decoder(dv);
	};

	// NACL Module support
	// Called by the common.js module.
	//
	window.domContentLoaded = function(name, tc, config, width, height) {
		console.log("Requesting persistent memory");

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
		LASModuleWasLoaded = true;
	}


	scope.AsyncLAZBuffer = AsyncLAZBuffer;
	scope.LASWrapper = LASWrapper;
	scope.LASBuffer = LASBuffer;
	scope.LASModuleWasLoaded = false;
})(window);

