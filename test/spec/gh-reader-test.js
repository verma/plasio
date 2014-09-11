var gh = require('../../js/greyhound');


describe("Schema", function() {
    it("should be empty by itself", function() {
        expect(gh.Schema()).toEqual([]);
    });

    it("should have correct items in added order", function() {
        var s = gh.Schema().X().Y().Z();
        expect(s.length).toBe(3);
        expect(s[0]).toEqual({name: "X", type:"floating", size: 4});
        expect(s[1]).toEqual({name: "Y", type:"floating", size: 4});
        expect(s[2]).toEqual({name: "Z", type:"floating", size: 4});
    });

    it("should add using the correct type and size", function() {
        var s = gh.Schema().X("unsigned", 2).Red("floating", 8);

        expect(s.length).toBe(2);
        expect(s[0]).toEqual({name: "X", type: "unsigned", size: 2});
        expect(s[1]).toEqual({name: "Red", type: "floating", size: 8});
    });

    it("should have a standard layout with default fields", function() {
        var s = gh.Schema.standard();

        expect(s.length).toBe(7);
        expect(s[0]).toEqual({name: "X", type:"floating", size: 4});
        expect(s[1]).toEqual({name: "Y", type:"floating", size: 4});
        expect(s[2]).toEqual({name: "Z", type:"floating", size: 4});
        expect(s[3]).toEqual({name: "Intensity", type:"unsigned", size: 2});
        expect(s[4]).toEqual({name: "Red", type:"unsigned", size: 2});
        expect(s[5]).toEqual({name: "Green", type:"unsigned", size: 2});
        expect(s[6]).toEqual({name: "Blue", type:"unsigned", size: 2});
    });

    it("should have a XYZ only schema", function() {
        var s = gh.Schema.XYZ();

        expect(s.length).toBe(3);
        expect(s[0]).toEqual({name: "X", type:"floating", size: 4});
        expect(s[1]).toEqual({name: "Y", type:"floating", size: 4});
        expect(s[2]).toEqual({name: "Z", type:"floating", size: 4});
    });
});

describe("GreyhoundReader", function() {
    it("should error if no host is provided", function() {
        var f = function() {
            new gh.GreyhoundReader();
        };

        expect(f).toThrowError('Need hostname to initialize reader');
    });

    it("should correctly store passed hostname", function() {
        var s = new gh.GreyhoundReader("localhost");

        expect(s.getHost()).toBe("localhost");
    });

    it("should not accept hostname if it specified protocol", function() {
        var f1 = function() {
            var s = new gh.GreyhoundReader("ws://localhost");
        };

        var f2 = function() {
            var s = new gh.GreyhoundReader("http://localhost");
        };

        expect(f1).toThrowError("Protocol specified, need bare hostname");
        expect(f2).toThrowError("Protocol specified, need bare hostname");
    });

    it("should correctly decipher port", function() {
        var s = new gh.GreyhoundReader("localhost");
        expect(s.getPort()).toBe(80);

        var s1 = new gh.GreyhoundReader("localhost:9822");
        expect(s1.getPort()).toBe(9822);
    });

    it("should handle host name and port correctly if invalid port is specified", function() {
        var s =  new gh.GreyhoundReader("localhost:hello");

        expect(s.getHost()).toBe("localhost");
        expect(s.getPort()).toBe(80);
    });

    describe(".createSession", function() {
        it("should fail inline when no pipeline is specified", function() {
            var f = function() {
                var s = new gh.GreyhoundReader("localhost");
                s.createSession();
            };

            expect(f).toThrowError('Invalid pipeline');
        });

        it("should come back with an error when the host was invalid", function(done) {
            var s = new gh.GreyhoundReader("localhost.greyhound");
            s.createSession("1234", function(err) {
                expect(err).toBeTruthy();
                done();
            });
        });

        it("should successfully open a valid pipeline", function(done) {
            var s = new gh.GreyhoundReader("localhost:8080");
            s.createSession("58a6ee2c990ba94db936d56bd42aa703", function(err, session) {
                expect(err).toBeFalsy();
                expect(session.length).toBeGreaterThan(0);
                done();
            });
        });
    });

    var withSession = function(cb, final_cb) {
        var s = new gh.GreyhoundReader("localhost:8080");
        s.createSession("58a6ee2c990ba94db936d56bd42aa703", function(err, session) {
            if (err) return cb(err);
            var done = function() {
                s.destroy(session, final_cb);
            };

            cb(null, s, session, done);
        });
    };

    describe(".read", function() {
        it("should throw an exception inline if invalid pipeline is supplied", function() {
            var f = function() {
                var s = new gh.GreyhoundReader("localhost:8080");
                s.read();
            };

            var f1 = function() {
                var s = new gh.GreyhoundReader("localhost:8080");
                s.read(function() {});
            };

            expect(f).toThrowError("Invalid session parameter");
            expect(f1).toThrowError("Invalid session parameter");
        });

        it("should handle invalid pipeline in the callback", function(done) {
            var s = new gh.GreyhoundReader("localhost:8080");
            s.read("invalid-pipeline", function(err) {
                expect(err.message).toBe("Affinity not found");
                done();
            });
        });

        it("should correctly read default state data", function(done) {
            var s = new gh.GreyhoundReader("localhost:8080");
            s.createSession("58a6ee2c990ba94db936d56bd42aa703", function(err, session) {
                expect(err).toBeFalsy();

                s.read(session, function(err, data) {
                    expect(err).toBeFalsy();
                    expect(data.numPoints).toBe(10653);
                    expect(data.numBytes).toBe(20 * data.numPoints);
                    expect(data.data.length).toBeGreaterThan(0);
                    done();
                });
            });
        });

        it("should regard the schema specification", function(done) {
            withSession(function(err, s, sessionId, finish) {
                s.read(sessionId, {
                    schema: gh.Schema.XYZ()
                }, function(err, res) {
                    expect(err).toBeFalsy();
                    expect(res.numPoints * 12).toBe(res.numBytes);
                    expect(res.data.length).toBe(res.numBytes);
                    finish();
                });
            }, done);

        });
    });

    describe(".destroy", function() {
        it("should report error inline if invalid session parameter is passed", function() {
            var s = new gh.GreyhoundReader("localhost:8080")
            var f = function() {
                s.destroy();
            }
            var f1 = function() {
                s.destroy(function(){});
            };

            expect(f).toThrowError("Invalid session parameter");
            expect(f1).toThrowError("Invalid session parameter");
        });

        it("should correctly report an error if the provided session is invalid", function(done) {
            var s = new gh.GreyhoundReader("localhost:8080");
            s.destroy("junk", function(err) {
                expect(err).toBeTruthy();
                done();
            });
        });
    });
});
