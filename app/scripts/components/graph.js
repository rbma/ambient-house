'use strict';

const _ = require('lodash');

class Kaleido {
	

	constructor(parentElement, options){

    	this.init = false;	
    	this.parentElement = parentElement !== null ? parentElement : window.document.body;
	    this.enabled = true;
	    this.radiusFactor = 1.0;
	    this.zoomFactor = 1.0;
	    this.angleFactor = 0.0;
	    this.zoomTarget = options.zoomTarget || 1.2;
	    this.angleTarget = options.angleTarget || 0.8;
	    this.easeEnabled = options.easeEnabled || true;
	    this.ease = 0.2;
	    this.domElement = document.createElement('canvas');
	    this.ctx = this.domElement.getContext('2d');
	    this.alphaFactor = 1.0;
	    this.alphaTarget = 1.0;
	    this.parentElement.appendChild(this.domElement);
	    
	    this.animation = null;
	    this.pattern = null;
	    this.image = null;

	    this.width = 0;
	    this.height = 0;
  	}

  	updateAngle(angle){
  		this.angleTarget = angle;
  	}

  	updateZoom(zoom){
  		this.zoomTarget = zoom;
  	}


  	setImage(image){
    	this.image = image;
    	this.pattern = this.ctx.createPattern(this.image, 'repeat');
  	}

  	draw(){
    	this.ctx.fillStyle = this.pattern;
    	this.ctx.globalAlpha = this.alphaFactor;
    	this.drawLayer(this.image);

    	if (this.init === false){
    		this.init = true;
    		this.animate();
    	}
  	}

  	// d3.select('#title-canvas')
   //          .style('width', w + 'px')
   //          .style('height', h + 'px')
   //          .select('canvas')
   //          .attr('width', window.innerWidth / 1.5 + 'px')
   //          .attr('height', window.innerHeight / 1.5 + 'px')
   //          .style('position', 'absolute')
   //          .style('left', w / 6 + 'px')
   //          .style('top', h / 6 + 'px');


  	resize(){
    	this.width = this.parentElement.offsetWidth;
    	this.height = this.parentElement.offsetHeight;

    	this.domElement.width = window.innerWidth / 1.5;
    	this.domElement.height = window.innerHeight / 1.5;
    	this.domElement.style.position = 'absolute';
    	this.domElement.style.left = window.innerWidth / 6;
    	this.domElement.style.top = window.innerHeight / 6;

    	this.radius = 0.5 * this.radiusFactor * Math.min(this.width, this.height);
    	this.radiusHeight = 0.5 * Math.sqrt(3) * this.radius;
  	}


  	animate(){
    	let self = this;
    	this.animation = requestAnimationFrame(function(){
      		self.update();
      		self.draw();
      		self.animate();
    	});
  	}


  	destroy(){
    	let self = this;
    	cancelAnimationFrame(self.animation);
    	self.update();
    	self.draw();
  	}


  	update(){
    	if (this.easeEnabled){
      		this.angleFactor += (this.angleTarget - this.angleFactor) * this.ease;
      		this.zoomFactor += (this.zoomTarget - this.zoomFactor) * this.ease;
      		this.alphaFactor += (this.alphaTarget - this.alphaFactor) * this.ease;
    	}

    	else{
      		this.angleFactor = this.angleTarget;
      		this.zoomFactor = this.zoomTarget;
      		this.alphaFactor = this.alphaTarget;
    	}
  	}

  	drawImage(image){

  		this.ctx.save();

    	const imgW = image.width;
    	const imgH = image.height;
    	let outerRadius = 2 / 3 * this.radiusHeight;
    	let zoom = this.zoomFactor * outerRadius / (0.5 * Math.min(imgW, imgH));

    	this.ctx.translate(0, outerRadius);
    	this.ctx.scale(zoom, zoom);
    	this.ctx.rotate(this.angleFactor * 2 * Math.PI);
    	this.ctx.translate(-0.5 * imgW, -0.5 * imgH);
    	this.ctx.fill();
    	this.ctx.restore();
  	}

  	drawCell(image){

    	let cellIndex;
    	let i;
    	let results = [];

    	for (cellIndex = i = 0; i < 6; cellIndex = ++i) {
    		this.ctx.save();
    		this.ctx.rotate(cellIndex * 2.0 * Math.PI / 6.0);
    		this.ctx.scale([-1, 1][cellIndex % 2], 1);
    		this.ctx.beginPath();
    		this.ctx.moveTo(0, 0);
    		this.ctx.lineTo(-0.5 * this.radius, 1.0 * this.radiusHeight);
    		this.ctx.lineTo(0.5 * this.radius, 1.0 * this.radiusHeight);
    		this.ctx.closePath();
    		this.drawImage(image);
    		results.push(this.ctx.restore());
    	}

    }



    drawLayer(image){

    	this.ctx.save();
    	this.ctx.translate(0.5 * this.width, 0.5 * this.height);

	    let verticalLimit = Math.ceil(0.5 * this.height / this.radiusHeight);
	    let horizontalLimit = Math.ceil(0.5 * this.width / (3 * this.radius));

	    let horizontalStrype = _.range(-horizontalLimit, horizontalLimit);
	    let verticalStrype = _.range(-verticalLimit, verticalLimit);

	    for (let i = 0; i < verticalStrype.length; i++ ){

	    	let v = verticalStrype[i];
	      	this.ctx.save();
	      	this.ctx.translate(0, this.radiusHeight * v);

	      	if (Math.abs(v) % 2){
	        	this.ctx.translate(1.5 * this.radius, 0);
	      	}

	      	for (let l = 0; l < horizontalStrype.length; l++ ){
	        	let h = horizontalStrype[l];

	        	this.ctx.save();
	        	this.ctx.translate(3 * h * this.radius, 0);
	        	this.drawCell(image);
	        	this.ctx.restore();
	      	}

	      	this.ctx.restore();
	    }

	    this.ctx.restore();
  	}
};


module.exports = Kaleido;



