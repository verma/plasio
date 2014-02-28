// render.js
// Rendering functions
//

(function(w) {
	"use strict";

	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var container, stats;
	var camera, controls, scene, renderer;

	var cross;

	w.startRenderer = function(status_cb) {
		init();
		animate();

		if(status_cb) {
			var vendor =
				renderer.context.getParameter(renderer.context.VERSION) + ", Provider: " +
				renderer.context.getParameter(renderer.context.VENDOR);
			status_cb(vendor);
		}
	};

	var oldPS = null; // the particle system which is already loaded

	w.loadLASBuffer = function(lasBuffer) {
		var geometry = new THREE.BufferGeometry();
		var count = lasBuffer.pointsCount;

		geometry.addAttribute( 'position', Float32Array, count, 3 );
		geometry.addAttribute( 'color', Float32Array, count, 3 );

		var positions = geometry.attributes.position.array;
		var colors = geometry.attributes.color.array;

		// the running average of cg
		var cg = null;
		var mx = null;
		var mn = null;

		for ( var i = 0; i < count; i ++) {
			var p = lasBuffer.getPoint(i);

			var x = p.position[0] * lasBuffer.scale[0] + lasBuffer.offset[0];
			var y = p.position[1] * lasBuffer.scale[1] + lasBuffer.offset[1];
			var z = p.position[2] * lasBuffer.scale[2] + lasBuffer.offset[2];

			if (cg === null)
				cg = new THREE.Vector3(x, y, z);
			else
				cg.set((cg.x * i + x) / (i+1),
					   (cg.y * i + y) / (i+1),
					   (cg.z * i + z) / (i+1));

			if (mx === null)
				mx = new THREE.Vector3(x, y, z);
			else
				mx.set(Math.max(mx.x, x),
					   Math.max(mx.y, y),
					   Math.max(mx.z, z));

			if (mn === null)
				mn = new THREE.Vector3(x, y, z);
			else
				mn.set(Math.min(mn.x, x),
					   Math.min(mn.y, y),
					   Math.min(mn.z, z));


			positions[ 3*i ]     = x;
			positions[ 3*i + 1 ] = y;
			positions[ 3*i + 2 ] = z;

			var r, g, b;

			if (p.color) {
				r = p.color[0] / 255.0;
				g = p.color[1] / 255.0;
				b = p.color[2] / 255.0;
			}
			else {
				var c = (z - mn.z) / (mx.z - mn.z);
				r = g = b = c;
			}

			colors[ 3*i ] = r;
			colors[ 3*i + 1 ] = g;
			colors[ 3*i + 2 ] = b;
		}

		console.log('Mins:', mn);
		console.log('Maxs:', mx);
		console.log('CG:', cg);

		var attributes = {
			color: { type: 'c', value: null }
		};

		var uniforms = {
			pointSize: { type: 'f', value: 3.0 },
			blendFactor: { type: 'f', value: 0.0 },
			clampLower: { type: 'f', value: 20.0},
			clampHigher: { type: 'f', value: 150.0},
			offsets: { type: 'v3', value: cg }
		};

		//var material = new THREE.ParticleSystemMaterial({ vertexColors: true, size: 5 });
		var material = new THREE.ShaderMaterial({
			vertexShader: $("#vertexshader").text(),
			fragmentShader: $("#fragmentshader").text(),
			attriutes: attributes,
			uniforms: uniforms
		});

		var ps = new THREE.ParticleSystem(geometry, material);
		console.log(ps, material, geometry);

		if (oldPS !== null)
			scene.remove(oldPS);

		scene.add(ps);
		oldPS = ps;

		setupView(mn, mx);
	}

	var setupView = function(mins, maxs) {
		// make sure the projection and camera is setup correctly to view the loaded data
		//
		var range = [
			maxs.x - mins.x,
			maxs.y - mins.y,
			maxs.z - mins.z ];

		var farPlaneDist = Math.max(range[0], range[1], range[2]);
		console.log('Far plane distance', farPlaneDist);

		// TODO: we'd have to check what kind of projection mode we're in
		//
		camera.far = farPlaneDist * 4;

		// find a spot for our camera
		// we are switching coords where because the data is switched the 
		// same way, y is z and z is y
		//
		camera.position.set(
			-range[0]/2,
			2000,
			-range[1]/2);

		console.log('Camera position set to:', camera.position);

		camera.lookAt(new THREE.Vector3(0, 0, 0));
		camera.updateProjectionMatrix();
	}

	var numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	function init() {
		var container = $('#container');
		var w = container.width(),
			h = container.height();

		camera = new THREE.PerspectiveCamera(60,
			w / h, 1, 10000);
		camera.position.z = 500;

		controls = new THREE.TrackballControls( camera );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;

		controls.noZoom = false;
		controls.noPan = false;

		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		controls.keys = [ 65, 83, 68 ];
		controls.addEventListener( 'change', render );

		// world
		scene = new THREE.Scene();

		// setup material to use vertex colors
		// renderer
		//
		console.log(container);
		var w = container.width(),
			h = container.height();

		console.log("Setting render size to: ", w, h);

		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setClearColor("#111");
		renderer.setSize(w, h);

		container.append( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );

		$("#pointCount").html("No Points");
		$("#stats").show();
	}

	function onWindowResize() {
		var container = $("#container");
		console.log('Container is:', container);
		console.log(container.width(), container.height());

		var w =	container.width();
		var h = container.height();

		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		controls.handleResize();

		render();
	}

	w.doRenderResize = onWindowResize;

	function animate() {
		requestAnimationFrame(animate);
		controls.update();

		render();
	}

	var t = function() {
		return (new Date()).getTime();
	}

	var timeSinceLast = null;
	var frames = 0;
	function render() {
		var thisTime = t();
		if (timeSinceLast === null)
			timeSinceLast = thisTime;
		else {
			if (thisTime - timeSinceLast > 1000) {
				$("#fps").html (frames + "fps");
				frames = 0;
				timeSinceLast = thisTime;
			}
		}
		
		frames ++;
		renderer.render(scene, camera);
	}
})(window);
