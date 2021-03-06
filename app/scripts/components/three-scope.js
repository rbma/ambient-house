'use strict';


class Kaleido {

	constructor(){

		this.renderer = null;
		this.scene = null;
		this.camera = null;
		this.geometry = null;
		this.material = null;
		this.mesh = null;
		this.group = null;
		this.light = null;
		this.animation = null;
		this.destroyed = false;
		this.parent = document.getElementById('title-canvas');

		// ------------------------------------------------
		// Config
		//
		this.number = 10;
		this.boundaries = 10;
		this.size = 6;
		this.kaleidoscope = true;
		this.sides = 4;
		this.angle = 45;
		this.colorshift = false;
		this.flatshading = false;
		this.wireframe = false;
		

		this.loadThree();

	}



	loadThree(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const threeScript = document.createElement('script');

		headTag.appendChild(threeScript);

		threeScript.onload = function(){
			self.loadCopyShader();
		};

		threeScript.src = 'https://ajax.googleapis.com/ajax/libs/threejs/r69/three.min.js';
	}

	loadCopyShader(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const cScript = document.createElement('script');

		headTag.appendChild(cScript);

		cScript.onload = function(){
			self.loadKaleidoShader();
		};

		cScript.src = 'lib/CopyShader.js';
	}

	loadKaleidoShader(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const kScript = document.createElement('script');

		headTag.appendChild(kScript);

		kScript.onload = function(){
			self.loadRGBShader();
		};

		kScript.src = 'lib/KaleidoShader.js';
	}


	

	loadRGBShader(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const rScript = document.createElement('script');

		headTag.appendChild(rScript);

		rScript.onload = function(){
			self.loadEffectShader();
		};

		rScript.src = 'lib/RGBShiftShader.js';
	}

	loadEffectShader(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const eScript = document.createElement('script');

		headTag.appendChild(eScript);

		eScript.onload = function(){
			self.loadRenderPass();
		};

		eScript.src = 'lib/EffectComposer.js';
	}

	loadRenderPass(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const pScript = document.createElement('script');

		headTag.appendChild(pScript);

		pScript.onload = function(){
			self.loadMaskPass();
		};

		pScript.src = 'lib/RenderPass.js';
	}

	loadMaskPass(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const mScript = document.createElement('script');

		headTag.appendChild(mScript);

		mScript.onload = function(){
			self.loadShaderPass();
		};

		mScript.src = 'lib/MaskPass.js';
	}

	loadShaderPass(){
		const self = this;
		const headTag = document.getElementsByTagName('head')[0];
		const sScript = document.createElement('script');

		headTag.appendChild(sScript);

		sScript.onload = function(){
			self.init();
		};

		sScript.src = 'lib/ShaderPass.js';
	}

	init(){
		const self = this;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
		this.renderer.setSize(window.innerWidth, window.innerHeight);


		
		this.parent.appendChild(this.renderer.domElement);
		this.renderer.domElement.setAttribute('id', 'three-canvas');

		this.geometry = new THREE.IcosahedronGeometry(this.size, 0);
		this.geometry.computeFaceNormals();

		// ------------------------------------------------
		// Material
		//
		this.material = new THREE.MeshNormalMaterial({
			wireframe: self.wireframe,
			shading: self.flatshading ? THREE.FlatShading : THREE.SmoothShading
		});

		this.group = new THREE.Object3D();

		for (let i = 0; i < self.number; i++ ){

			self.mesh = new THREE.Mesh(self.geometry, self.material);
			let b = self.boundaries;
			self.mesh.position.set(
				THREE.Math.randInt(-b, b),
				THREE.Math.randInt(-b, b),
				THREE.Math.randInt(-b, b)
			);

			self.group.add(self.mesh);

		}

		this.scene.add(this.group);

		this.light = new THREE.DirectionalLight(0xFFFFFF);
		this.light.position.set(0,0,250);
		this.scene.add(this.light);

		this.camera.position.set(0,0,20);

		// ------------------------------------------------
		// Post processing
		//
		if (this.kaleidoscope || this.colorshift){
			let renderTarget = new THREE.WebGLRenderTarget(
				window.innerWidth,
				window.innerWidth,
				{
					minFilter: THREE.LinearFilter,
					magFilter: THREE.LinearFilter,
					format: THREE.RGBAFormat,
					stencilBuffer: false
				}
			);

			this.composer = new THREE.EffectComposer(this.renderer, renderTarget);
			this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

		}

		if (this.kaleidoscope){
			var effect = new THREE.ShaderPass(THREE.KaleidoShader);
			effect.uniforms['sides'].value = this.sides;
			effect.uniforms['angle'].value = this.angle * Math.PI / 180;
			this.composer.addPass(effect);
		}

		if (this.colorshift){
			var effect = new THREE.ShaderPass(THREE.RGBShiftShader);
			effect.uniforms['amount'].value = 0.005;
			this.composer.addPass(effect);
		}

		if (this.kaleidoscope || this.colorshift){
			effect.renderToScreen = true;
		}

		// ------------------------------------------------
		// Resize
		//
		
		window.addEventListener('resize', function(e){
			self.camera.updateProjectionMatrix();

			self.renderer.setSize(window.innerWidth, window.innerHeight);
		}, false);

		

		this.animate();
	}


	animate(){
		const self = this;

		this.animation = requestAnimationFrame(function(){
			self.animate();
		});

		this.group.rotation.x += 0.01;
		this.group.rotation.y += 0.01;
		this.group.rotation.z += 0.01;


		this.render();
	}

	start(){
		
		if (this.destroyed){
			this.destroyed = false;
			this.animate();
		}

		else{
			return null;
		}

	}

	stop(){
		if (this.destroyed === false){
			cancelAnimationFrame(this.animation);
			this.destroyed = true;
			let canvas = document.getElementById('three-canvas');
			canvas.style.zIndex = '-1';
		}

		else{
			return null;
		}
		
	}


	render(){
		if (this.kaleidoscope || this.colorshift){
			this.composer.render();
		}
		else{
			this.renderer.render(this.scene, this.camera);
		}
	}

}

export default Kaleido;