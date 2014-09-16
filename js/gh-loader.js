// gh-loader.js
// point loader abstraction for loading stuff off of a greyhound buffer, provides the same interface as laslaz.
//

(function(scope) {
    "use strict";

    var GHLoader = function(arraybuffer, numPoints, schema) {
        this.arraybuffer = (arraybuffer instanceof Uint8Array) ?
            arraybuffer.buffer : arraybuffer;
        this.numPoints = numPoints;
        this.schema = schema;
    };

    GHLoader.prototype.open = function() {
        this.readOffset = 0;
        return new Promise(function(res, rej) {
            setTimeout(res);
        });
    };

    GHLoader.prototype.getHeader = function() {
        var o = this;
        return new Promise(function(res, rej) {
            setTimeout(function() {
                // made up stuff we can figure out from our schema and stuff
                var schemaSize = o.schema.reduce(function(acc, i) {
                    return acc + i.size;
                }, 0);

                console.log(schemaSize);

                var header = {
                    pointsOffset: 0,
                    scale: [1, 1, 1],
                    offset: [0, 0, 0],
                    pointsCount: o.numPoints,
                    pointsStructSize: schemaSize, // TODO: use schema to figure this
                    schema: o.schema
                };
                o.header = header;

                res(header);
            });
        });
    };

    GHLoader.prototype.readData = function(count, offset, skip) {
        var o = this;

        return new Promise(function(res, rej) {
            setTimeout(function() {
				var start;
				if (skip <= 1) {
					count = Math.min(count, o.header.pointsCount - o.readOffset);
					start = o.header.pointsOffset + o.readOffset * o.header.pointsStructSize;
					var end = start + count * o.header.pointsStructSize;
					console.log(start, end);
					res({
						buffer: o.arraybuffer.slice(start, end),
						count: count,
						hasMoreData: o.readOffset + count < o.header.pointsCount});
					o.readOffset += count;
				}
				else {
					var pointsToRead = Math.min(count * skip, o.header.pointsCount - o.readOffset);
					var bufferSize = Math.ceil(pointsToRead / skip);
					var pointsRead = 0;

					var buf = new Uint8Array(bufferSize * o.header.pointsStructSize);
					console.log("Destination size:", buf.byteLength);
					for (var i = 0 ; i < pointsToRead ; i ++) {
						if (i % skip === 0) {
							start = o.header.pointsOffset + o.readOffset * o.header.pointsStructSize;
							var src = new Uint8Array(o.arraybuffer, start, o.header.pointsStructSize);

							buf.set(src, pointsRead * o.header.pointsStructSize);
							pointsRead ++;
						}

						o.readOffset ++;
					}

					res({
						buffer: buf.buffer,
						count: pointsRead,
						hasMoreData: o.readOffset < o.header.pointsCount
					});
				}
			}, 0);
		});
    };

    GHLoader.prototype.close = function() {
        var o = this;

        return new Promise(function(res) {
            o.arraybuffer = null;
            setTimeout(res);
        });
    };


    var PointDecomp = function(buffer, len, header) {
        // point decompressor
        this.arrayb = buffer;
        this.header = header;
        this.pointSize = header.pointsStructSize;
        this.pointsCount = len;
        this.scale = header.scale;
        this.offset = header.offset;
        this.mins = [0, 0, 0];
        this.maxs = [0, 0, 0];
    };

    var decodeWithSchema = (function() {
        var fs = {
            "floating": {
                4: DataView.prototype.getFloat32,
                8: DataView.prototype.getFloat64
            },
            "unsigned": {
                1: DataView.prototype.getUint8,
                2: DataView.prototype.getUint16,
                4: DataView.prototype.getUint32
            }
        };

        var safe_fs = function(type, size) {
            if(!fs[type]) return undefined;
            return fs[type][size];
        };

        return function(dv, schema) {
            var obj = {};
            var off = 0;

            schema.forEach(function(i) {
                var f = safe_fs(i.type, i.size);
                obj[i.name] = f.call(dv, off, true);
                off += i.size;
            });


            // coerce into what we want the decoder to return
            var r = {};
            if (obj.X || obj.Y || obj.Z) {
                r.position = [obj.X, obj.Y, obj.Z];
            }

            if (obj.Red || obj.Green || obj.Red) {
                r.color = [obj.Red, obj.Green, obj.Red];
            }

            r.intensity = obj.Intensity;

            return r;
        };
    })();

    PointDecomp.prototype.getPoint = function(index) {
        // based on the schema, decode this point!
		if (index < 0 || index >= this.pointsCount)
			throw new Error("Point index out of range");

		var dv = new DataView(this.arrayb, index * this.pointSize, this.pointSize);
		return decodeWithSchema(dv, this.header.schema);
    };

    GHLoader.prototype.getUnpacker = function() {
        return PointDecomp;
    };

    scope.GHLoader = GHLoader;
})(module.exports);



