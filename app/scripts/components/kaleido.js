'use strict';


class Kaleido {

	constructor(parent){
		
		this.enabled = true;
		this.parent = parent || window.document.body;
		
		this.radiusFactor = 1.0;
		this.zoomFactor = 1.0;
		this.angleFactor = 0.0;

		this.zoomTarget = 1.2;
		this.angleTarget = 0.8;

		this.easeEnabled = true;
		this.ease = 0.1;

		this.alphaFactor = 1.0;
		this.alphaTarget = 1.0;

		this.domElement = null
		this.ctx = null;

		this.init();
	}


	init(){
		
		this.domElement = document.createElement('canvas');
		this.ctx = this.domElement.getContext('2d');

		this.parent.appendChild(this.domElement);

	}


	onResize(){
		this.width = this.domElement.width = this.parent.offsetWidth;
		this.height = this.domElement.height = this.parent.offsetHeight;

		this.radius = 0.5 * this.radiusFactor * Math.min(this.width, this.height);
		this.radiusHeight = 0.5 * Math.sqrt(3) * this.radius;

	}



	update(){
		if (this.easeEnabled){
			this.angleFactor += (this.angleTarget - this.angleFactor) * this.ease;
			this.zoomFactor += (this.zoomTarget - this.zoomFactor) * this.ease;
			this.alphaFactor += (this.alphaTarget - this.alphaFactor) * this.ease;
		}
		else{
			this.angleFactor = this.angleTarget;
			this.zooomFactor = this.zoomTarget;
			this.alphaFactor = this.alphaTarget;
		}
	}


	drawImage(image){

		this.ctx.save();

		let outerRadius = 2 / 3 * this.radiusHeight;
		let zoom = this.zoomFactor * outerRadius / (0.5 * Math.min(image.width, image.height));

		this.ctx.translate(0, outerRadius);
		this.ctx.scale(zoom, zoom);
		this.ctx.rotate(this.angleFactor * 2 * Math.PI);
		this.ctx.translate(-0.5 * image.width, -0.5 * image.height);
		this.ctx.fill();
		this.ctx.restor();

	}


	drawCell(image){

		let self = this;

		for (let i = 0; i < 6; i++ ){
			self.ctx.save();
			self.ctx.rotate(i * 2.0 * Math.PI / 6.0);
			self.ctx.scale([-1,1][i % 2],1);
			self.ctx.beginPath();

			self.ctx.moveTo(0,0);
			self.ctx.lineTo(-0.5 * self.radius, 1.0 * self.radiusHeight);
			self.ctx.lineTo(0.5 * self.radius, 1.0 * self.radiusHeight);
			self.ctx.closePath();

			self.drawImage(image);

			self.ctx.restore();
		}
	}


	drawLayer(image){

		let self = this;
		let ref, ref1;

		self.ctx.save();

		self.ctx.translate(0.5 * self.width, 0.5 * self.height);

		let vLimit = Math.ceil(0.5 * self.height / self.radiusHeight);
		let hLimit = Math.ceil(0.5 * self.width / (3 * self.radius));

		let hStripe = function(){
			let results = [];
			for (let i = ref = -hLimit; ref <= hLimit ? i <= hLimit : i >= hLimit; ref <= hLimit ? i++ : i-- ){
				results.push(i);
			}
			return results;
		}

		let vStripe = function(){
			let results = [];
			for (let i = ref1 = -vLimit; ref1 <= vLimit ? i <= vLimit : i >= vLimit; ref1 <= vLimit ? i++ : i--){
				results.push(i);
			}
			return results;
		}

		for (let k = 0; let len = vStripe.length; k < len; k++ ){
			let v = vStripe[k];
			self.ctx.save();
			self.ctx.translate(0, self.radiusHeight * v);

			if (Math.abs(v) % 2){
				self.ctx.translate(1.5 * self.radius, 0);
			}

			for (let l = 0; let len1 = hStripe.length; l < len1; l++ ){
				let h = hStripe[l];
				self.ctx.save();
				self.ctx.translate(3 * h * self.radius, 0);
				self.drawCell(image);
				self.ctx.restore();
			}

			self.ctx.restore();
		}
		return self.ctx.restore();
	}

	animate(){
		let self = this;
		self.update();
		self.draw();
	}

}


module.exports = Kaleido;