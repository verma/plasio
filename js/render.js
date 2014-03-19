// render.js
// Rendering functions
//

var THREE = require("three"),
	$ = require('jquery');

	require("trackball-controls");

(function(w) {
	"use strict";

	var container, stats;
	var camera, controls, scene, renderer;
	var activeCamera, orthoCamera, topViewCamera;

	var cross;

	w.startRenderer = function(render_container, status_cb) {
		init(render_container);
		animate();

		if(status_cb) {
			var vendor =
				renderer.context.getParameter(renderer.context.VERSION) + ", Provider: " +
				renderer.context.getParameter(renderer.context.VENDOR);
			status_cb(vendor);
		}
	};

	function removeBatcher(b) {
		// if the provided batcher is an array, remove all elements from the scene
		if( Object.prototype.toString.call(b) === '[object Array]' ) {
			for (var i in b) {
				b[i].removeFromScene(scene);
			}
		}
		else
			b.removeFromScene(scene);
	}

	function addBatcher(b) {
		// if the provided batcher is an array, add all elements to the scene
		if( Object.prototype.toString.call(b) === '[object Array]' ) {
			for (var i in b) {
				b[i].addToScene(scene);
			}
		}
		else
			b.addToScene(scene);
	}

	function determineBatcherProps(b) {
		if( Object.prototype.toString.call(b) !== '[object Array]' ) {
			return [
				b.mn, b.mx, b.cg, b.scale
			];
		}

		// the scale in all should be the same, so we don't touch it
		var mx = null, mn = null, cg = null;
		for(var i in b) {
			if (mx === null) mx = b[i].mx.clone();
			else mx.set(Math.max(mx.x, b[i].mx.x),
						Math.max(mx.y, b[i].mx.y),
						Math.max(mx.z, b[i].mx.z));

			if (mn === null) mn = b[i].mn.clone();
			else mn.set(Math.min(mn.x, b[i].mn.x),
						Math.min(mn.y, b[i].mn.y),
						Math.min(mn.z, b[i].mn.z));

			if (cg === null) cg = b[i].cg.clone();
			else mn.set((cg.x * i + b[i].cg.x) / (i+1),
						(cg.y * i + b[i].cg.y) / (i+1),
						(cg.z * i + b[i].cg.z) / (i+1));
		}

		return [mx, mn, cg, b[0].scale];
	}

	var oldBatcher = null; // the particle system which is already loaded
	var restorePoint = [];
	w.loadBatcher = function(batcher, resetCamera, overrideCG) {
		if (oldBatcher !== null)
			removeBatcher(oldBatcher);

		addBatcher(batcher);
		oldBatcher = batcher;

		var batcherProps = determineBatcherProps(batcher);
		var mn = batcherProps[0],
			mx = batcherProps[1],
			cg = overrideCG || batcherProps[2],
			scale = batcherProps[3];

		if (resetCamera === true) {
			setupView(mn, mx, cg, scale);
			restorePoint = [mn, mx, cg, scale];
		}

		// update some of the fields
		var zrange = new THREE.Vector2(mn.z, mx.z);

		var cgToUse = overrideCG || cg;

		// trigger signals for setting offsets
		$.event.trigger({
			type: 'plasio.offsetsChanged',
			offsets: cgToUse
		});

		// z-range
		$.event.trigger({
			type: 'plasio.zrangeChanged',
			zrange: zrange
		});

		// trigger a signal which will cause the intenisty range to update
		$.event.trigger({
			type: 'plasio.intensityClampChanged'
		});

		// change scale
		$.event.trigger({
			type: 'plasio.scaleChanged',
			scale: scale
		});
	};

	var setupView = function(mins, maxs, cg, scale) {
		controls.reset();

		// make sure the projection and camera is setup correctly to view the loaded data
		//
		var range = [
			(maxs.x - mins.x) * scale.x,
			(maxs.y - mins.y) * scale.y,
			(maxs.z - mins.z) * scale.z
		];

		var farPlaneDist = Math.max(range[0], range[1], range[2]);

		// TODO: we'd have to check what kind of projection mode we're in
		//
		camera.far = farPlaneDist * 4;
		orthoCamera.far = camera.far * 2;
		topViewCamera.far = orthoCamera.far;

		// find a spot for our camera
		// we are switching coords where because the data is switched the 
		// same way, y is z and z is y
		//
		camera.position.set(
			-range[0]/2,
			cg.z + range[2],
			-range[1]/2);

		camera.lookAt(new THREE.Vector3(0, 0, 0));
		orthoCamera.lookAt(new THREE.Vector3(0, 0, 0));

		var limits = Math.ceil(Math.sqrt(2*farPlaneDist*farPlaneDist));

		orthoCamera.left = -limits/2;
		orthoCamera.right = limits/2;
		orthoCamera.bottom = -limits/2;
		orthoCamera.top = limits/2;

		topViewCamera.left = -limits/2;
		topViewCamera.right = limits/2;
		topViewCamera.bottom = -limits/2;
		topViewCamera.top = limits/2;

		topViewCamera.position.set(
			0, topViewCamera.far / 2, 0);
		topViewCamera.lookAt(new THREE.Vector3(0, 0, 1));
		
		camera.updateProjectionMatrix();
		orthoCamera.updateProjectionMatrix();
		topViewCamera.updateProjectionMatrix();
	};

	var numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	var needRefresh = false; // whenever a scene re-render is needed
	function init(render_container) {
		var container = $(render_container);
		var w = container.width(),
			h = container.height();

		camera = new THREE.PerspectiveCamera(60,
			w / h, 1, 10000);
		camera.position.z = 500;

		orthoCamera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 10000);
		orthoCamera.position.set(camera.position.x,
								 camera.position.y,
								 camera.position.z);

		topViewCamera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 100000);

		activeCamera = camera;

		controls = new THREE.TrackballControls( camera, render_container );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;

		controls.noZoom = false;
		controls.noPan = false;

		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		controls.keys = [ 65, 83, 68 ];
		controls.addEventListener( 'change', function() {
			needRefresh = true;
		});

		// world
		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setClearColor("#111");
		renderer.setSize(w, h);

		container.append( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );

		$("#pointCount").html("No Points");
		$("#stats").show();

		$(document).on("plasio.cameraFOVChanged", function() {
			camera.fov = currentFOV();
			camera.updateProjectionMatrix();
		});

		$(document).on("plasio.camera.perspective", function() {
			activeCamera = camera;
		});

		$(document).on("plasio.camera.ortho", function() {
			activeCamera = orthoCamera;
		});

		$(document).on("plasio.camera.topView", function() {
			activeCamera = topViewCamera;
		});

		$(document).on("plasio.camera.reset", function() {
			// reset the perspective camera controls
			controls.reset();
			if (restorePoint.length > 0)
				setupView(restorePoint[0], restorePoint[1], restorePoint[2], restorePoint[3]);
		});

		$(document).on('plasio.renderer.needRefresh', function() {
			needRefresh = true;
		});
	}

	function onWindowResize() {
		var container = $("#container");

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
		orthoCamera.position.set(
			camera.position.x,
			camera.position.y,
			camera.position.z);
		orthoCamera.rotation.set(
			camera.rotation.x,
			camera.rotation.y,
			camera.rotation.z);

		requestAnimationFrame(animate);
		controls.update();

		if (needRefresh) {
			render();
			needRefresh = false;
		}
	}

	function render() {
		renderer.render(scene, activeCamera);
	}

	function updateColorUniformsForSource(uniforms, source) {
		uniforms.rgb_f.value = 0.0;
		uniforms.class_f.value = 0.0;
		uniforms.map_f.value = 0.0;
		uniforms.imap_f.value = 0.0;

		switch(source) {
			case "rgb": uniforms.rgb_f.value = 1.0; break;
			case "classification": uniforms.class_f.value = 1.0; break;
			case "heightmap-color": uniforms.map_f.value = 1.0; break;
			case "heightmap-color-inv": uniforms.imap_f.value = 1.0; break;
		}
	}

	function updateIntensityUniformsForSource(uniforms, source) {
		uniforms.intensity_f.value = 0.0;
		uniforms.height_f.value = 0.0;
		uniforms.iheight_f.value = 0.0;

		switch(source) {
			case "intensity": uniforms.intensity_f.value = 1.0; break;
			case "heightmap": uniforms.height_f.value = 1.0; break;
			case "heightmap-inv": uniforms.iheight_f.value = 1.0; break;
		}
	}

	function updateIntensityClampingForBatcher(uniforms, batcher) {
		var range = currentIntensityClamp();
		var n, x;
		if( Object.prototype.toString.call(batcher) !== '[object Array]' ) {
			n = batcher.in_n;
			x = batcher.in_x;
		}
		else {
			n = 9999999999; x = -9999999999;
			for (var i in batcher) {
				n = Math.min(n, batcher[i].in_n);
				x = Math.max(x, batcher[i].in_x);
			}
		}

		var f = function(v) {
			var vf = v  / 100.0;
			return n + (x - n) * vf;
		};

		var lower = f(parseFloat(range[0]));
		var higher = f(parseFloat(range[1]));

		uniforms.clampLower.value = lower;
		uniforms.clampHigher.value = Math.max(higher, lower + 0.001);
	}


	function updateColorClamping(uniforms) {
		var range = currentColorClamp();
		uniforms.colorClampLower.value = range[0];
		uniforms.colorClampHigher.value = Math.max(range[1], range[0] + 0.001);

		console.log(uniforms.colorClampLower.value,
					uniforms.colorClampHigher.value);
	}

	var shaderMaterial = null;
	function getMaterial(vs, fs) {
		if (shaderMaterial !== null)
			return shaderMaterial;

		var attributes = {
			color: { type: 'c', value: null },
			intensity: { type: 'f', value: null },
			classification: { type: 'f', value: null }
		};

		var iblend = currentIntensityClamp();
		var cclamp = currentColorClamp();

		var uniforms = {
			pointSize: { type: 'f', value: currentPointSize() },
			intensityBlend: { type: 'f', value: currentIntensityBlend() / 100.0 },
			maxColorComponent: { type: 'f', value: 1.0 },

			// colors
			rgb_f: { type: 'f', value: 1.0 },
			class_f: { type: 'f', value: 0.0 },
			map_f: { type: 'f', value: 0.0 },
			imap_f: { type: 'f', value: 0.0 },

			// intensity
			intensity_f: { type: 'f', value: 0.0 },
			height_f: { type: 'f', value: 0.0 },
			iheight_f: { type: 'f', value: 0.0 },

			xyzScale: { type: 'v3', value: new THREE.Vector3(1, 1, 1) },

			clampLower: { type: 'f', value: iblend[0] },
			clampHigher: { type: 'f', value: iblend[1] },

			colorClampLower: { type: 'f', value: cclamp[0] },
			colorClampHigher: { type: 'f', value: cclamp[1] },

			zrange: { type: 'v2', value: new THREE.Vector2(0, 0) },
			offsets: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
			map: { type: 't', value: THREE.ImageUtils.loadTexture(currentColorMap())}
		};

		updateColorUniformsForSource(uniforms, currentColorSource());
		updateIntensityUniformsForSource(uniforms, currentIntensitySource());
		if (oldBatcher !== null)
			updateIntensityClampingForBatcher(uniforms, oldBatcher);

		updateColorClamping(uniforms);

		shaderMaterial = new THREE.ShaderMaterial({
			vertexShader: vs,
			fragmentShader: fs,
			attriutes: attributes,
			uniforms: uniforms
		});

		// attach handlers for notifications
		$(document).on("plasio.colormapChanged", function() {
			var colormap = currentColorMap();

			console.log('Colormap changed to:', colormap);

			THREE.ImageUtils.loadTexture(colormap, undefined, function(tex) {
				uniforms.map.value = tex;
				uniforms.map.needsUpdate = true;
			});
		});

		$(document).on("plasio.colorsourceChanged", function() {
			updateColorUniformsForSource(uniforms, currentColorSource());
		});

		$(document).on("plasio.intensitysourceChanged", function() {
			updateIntensityUniformsForSource(uniforms, currentIntensitySource());
		});

		$(document).on("plasio.intensityClampChanged", function() {
			if (oldBatcher !== null)
				updateIntensityClampingForBatcher(uniforms, oldBatcher);
		});

		$(document).on("plasio.colorClampChanged", function() {
			updateColorClamping(uniforms);
		});

		$(document).on("plasio.intensityBlendChanged", function() {
			var f = currentIntensityBlend();
			uniforms.intensityBlend.value = f / 100.0;

		});

		$(document).on("plasio.pointSizeChanged", function() {
			var f = currentPointSize();
			uniforms.pointSize.value = f;
		});

		$(document).on("plasio.maxColorComponent", function(e) {
			uniforms.maxColorComponent.value = Math.max(0.0001, e.maxColorComponent);
		});


		$(document).on("plasio.offsetsChanged", function(e) {
			uniforms.offsets.value = e.offsets;
		});

		$(document).on("plasio.zrangeChanged", function(e) {
			uniforms.zrange.value = e.zrange;
		});

		$(document).on("plasio.scaleChanged", function(e) {
			uniforms.xyzScale.value = e.scale;
		});


		shaderMaterial.uniforms = uniforms;
		shaderMaterial.attributes = attributes;

		return shaderMaterial;
	}

	// An object that manages a bunch of particle systems
	var ParticleSystemBatcher = function(vs, fs) {
		this.material = getMaterial(vs, fs);

		this.pss = []; // particle systems in use

		this.mx = null;
		this.mn = null;
		this.cg = null;
		this.cn = null;
		this.cx = null;
		this.in_x = null;
		this.in_y = null;
		this.pointsSoFar = 0;
	};

	ParticleSystemBatcher.prototype.push = function(lasBuffer) {
		var geometry = new THREE.BufferGeometry();
		var count = lasBuffer.pointsCount;

		geometry.addAttribute( 'position', Float32Array, count, 3 );
		geometry.addAttribute( 'color', Float32Array, count, 3 );
		geometry.addAttribute( 'intensity', Float32Array, count, 1 );
		geometry.addAttribute( 'classification', Float32Array, count, 1 );

		var positions = geometry.attributes.position.array;
		var colors = geometry.attributes.color.array;
		var intensity = geometry.attributes.intensity.array;
		var classification = geometry.attributes.classification.array;

		// the running average of cg
		var cg = null;
		var mx = null;
		var mn = null;
		var cn = null, cx = null;
		var in_x = null, in_n = null;

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

			// get the color component out
			var r, g, b;
			if (p.color) {
				r = p.color[0] / 255.0;
				g = p.color[1] / 255.0;
				b = p.color[2] / 255.0;
			}
			else {
				r = g = b = 0;
			}

			if (cn === null) {
				cn = new THREE.Color();
				cn.r = r; cn.g = g; cn.b = b;
			}
			else {
				cn.r = Math.min(cn.r, r);
				cn.g = Math.min(cn.g, g);
				cn.b = Math.min(cn.b, b);
			}

			if (cx === null) {
				cx = new THREE.Color();
				cx.r = r; cx.g = g; cx.b = b;
			}
			else {
				cx.r = Math.max(cx.r, r);
				cx.g = Math.max(cx.g, g);
				cx.b = Math.max(cx.b, b);
			}

			in_n = (in_n === null)? p.intensity : Math.min(in_n, p.intensity);
			in_x = (in_x === null)? p.intensity : Math.max(in_x, p.intensity);

			positions[ 3*i ]     = x;
			positions[ 3*i + 1 ] = y;
			positions[ 3*i + 2 ] = z;

			colors[ 3*i ] = r;
			colors[ 3*i + 1 ] = g;
			colors[ 3*i + 2 ] = b;

			intensity[i] = p.intensity;
			classification[i] = p.classification;
		}

		if (this.cg === null) this.cg = cg;
		else this.cg.set(
			(this.cg.x * this.pointsSoFar + cg.x * count) / (this.pointsSoFar + count),
			(this.cg.y * this.pointsSoFar + cg.y * count) / (this.pointsSoFar + count),
			(this.cg.z * this.pointsSoFar + cg.z * count) / (this.pointsSoFar + count));

		if (this.mx === null) this.mx = mx;
		else this.mx.set(
			Math.max(mx.x, this.mx.x),
			Math.max(mx.y, this.mx.y),
			Math.max(mx.z, this.mx.z));

		if (this.mn === null) this.mn = mn;
		else this.mn.set(
			Math.min(mn.x, this.mn.x),
			Math.min(mn.y, this.mn.y),
			Math.min(mn.z, this.mn.z));

		if (this.cn === null) this.cn = cn;
		else {
			this.cn.r = Math.min(this.cn.r, cn.r);
			this.cn.g = Math.min(this.cn.g, cn.g);
			this.cn.b = Math.min(this.cn.b, cn.b);
		}

		if (this.cx === null) this.cx = cx;
		else {
			this.cx.r = Math.max(this.cx.r, cx.r);
			this.cx.g = Math.max(this.cx.g, cx.g);
			this.cx.b = Math.max(this.cx.b, cx.b);
		}

		this.in_n = (this.in_n === null)? in_n : Math.min(in_n, this.in_y);
		this.in_x = (this.in_x === null)? in_x : Math.max(in_x, this.in_x);

		var ps = new THREE.ParticleSystem(geometry, this.material);
		this.pss.push(ps);

		this.pointsSoFar += count;
	};


	ParticleSystemBatcher.prototype.addToScene = function(scene) {
		for (var i = 0, il = this.pss.length ; i < il ; i ++) {
			scene.add(this.pss[i]);
		}
	};

	ParticleSystemBatcher.prototype.removeFromScene = function(scene) {
		for (var i = 0, il = this.pss.length ; i < il ; i ++) {
			scene.remove(this.pss[i]);
		}
	};

	w.ParticleSystemBatcher = ParticleSystemBatcher;
})(module.exports);
