'use strict';

const d3 = require('d3');


class CloudImage {

	constructor(imageSrc, parent){
		this.imageSrc = imageSrc;
		this.img = null;

		this.cloud = null;

		this.parent = parent;
		this.width = 0;
		this.height = 0;

		this.domElement = null;
		this.ctx = null;
		this.cloudX = 0;
		this.cloudY = 0;
		this.z = 1;

		this.init();
	}

	init(){

		let self = this;

		this.width = this.parent.offsetWidth;
		this.height = window.innerHeight;
		
		//load image
		this.img = new Image();

		this.img.onload = function(){
			self.addCanvas();
		};

		//load cloud
		this.cloud = new Image();
		this.cloud.onload = function(){
			self.cloud.width = 400;
			self.cloud.height = 300;
		}
		this.cloud.src = 'images/cloud.png';

		this.img.src = this.imageSrc;
	}



	addCanvas(){

		let self = this;

		this.domElement = document.createElement('canvas');
		this.domElement.width = this.width;
		this.domElement.height = this.height;
		
		this.ctx = this.domElement.getContext('2d');
		this.ctx.fillStyle = '#000000';
		this.ctx.globalCompositeOperation = 'xor';

		this.parent.appendChild(this.domElement);

		this.cloudX = Math.floor(Math.random() * this.domElement.width);
		this.cloudY = Math.floor(Math.random() * this.domElement.height);

		d3.timer(function(t){
			self.draw(t);
		});

		
	}

	draw(t){

		let self = this;
		
		this.ctx.clearRect(0, 0, this.domElement.width, this.domElement.height);
		

		//this.drawCircle(this.z);

		let circles = d3.range(50).map(function(i){
			return (10 * (50 - i)) + 5 * Math.sin(t / 100 + ( 620 / 200) * i);
		})
		.sort(d3.descending);


		circles.forEach(function(d, i){
			self.ctx.beginPath();
			self.ctx.arc(self.domElement.width / 2, self.domElement.height / 2, d, 0, 2 * Math.PI, false);
			self.ctx.fill();
		});

		this.ctx.drawImage(this.img, 0, 0);


		// requestAnimationFrame(function(){
		// 	self.draw();
		// });


	}
}


module.exports = CloudImage;