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

	w.loadLASBuffer = function(lasBuffer) {
		var geometry = new THREE.BufferGeometry();
		var count = lasBuffer.pointsCount;

		geometry.addAttribute( 'position', Float32Array, count * 3, 3 );
		geometry.addAttribute( 'color', Float32Array, count * 3, 3 );

		var positions = geometry.attributes.position.array;
		var colors = geometry.attributes.color.array;

		var mx = lasBuffer.maxs;
		var mn = lasBuffer.mins;

		var mid = [
			mn[0] + (mx[0] - mn[0])/2,
			mn[1] + (mx[1] - mn[1])/2,
			mn[2] + (mx[2] - mn[2])/2];

		console.log(mid);

		for ( var i = 0; i < count; i ++) {
			var p = lasBuffer.getPoint(i);

			var x = p.position[0] * lasBuffer.scale[0] + lasBuffer.offset[0];
			var y = p.position[1] * lasBuffer.scale[1] + lasBuffer.offset[1];
			var z = p.position[2] * lasBuffer.scale[2] + lasBuffer.offset[2];


			positions[ 3*i ]     = x - mid[0];
			positions[ 3*i + 1 ] = z - mid[2];
			positions[ 3*i + 2 ] = y - mid[1]; 

			var r, g, b;

			if (p.color) {
				r = p.color[0] / 255.0;
				g = p.color[1] / 255.0;
				b = p.color[2] / 255.0;
			}
			else {
				var c = (z - lasBuffer.mins[2]) / (float)(lasBuffer.maxs[2] - lasBuffer.mins[2]);
				r = g = b = c;
			}

			colors[ 3*i ] = r;
			colors[ 3*i + 1 ] = g;
			colors[ 3*i + 2 ] = b;
		}

		var material = new THREE.ParticleSystemMaterial({ vertexColors: true, size: 5 });
		var ps = new THREE.ParticleSystem(geometry, material);

		console.log(ps, material, geometry);

		scene.add(ps);
		camera.position.set(200, 200, 200);
		camera.lookAt(new THREE.Vector3(0, 0, 0));
	}

	var numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	function init() {
		camera = new THREE.PerspectiveCamera(60,
			window.innerWidth / window.innerHeight, 1, 10000);
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

		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setClearColor("#111");
		renderer.setSize( window.innerWidth, window.innerHeight - 200 );

		container = document.getElementById( 'container' );
		container.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );

		$("#pointCount").html("No Points");
		$("#stats").show();
	}

	function onWindowResize() {
		var h = window.innerHeight - 200;
		camera.aspect = window.innerWidth / h;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, h);

		controls.handleResize();
		render();

	}

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
