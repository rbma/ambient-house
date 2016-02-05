'use strict';

const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;

class Kaleido {
	
	constructor(){

		this.offsetRotation = 0.0;
		this.offsetScale = 1.0;
		this.offsetX = 0.0;
		this.offsetY = 0.0;
		this.radius = 260;
		this.slice = 12;
		this.zoom = 1.0;

		this.cx = window.innerWidth / 2;
  		this.cy = window.innerHeight / 2;
                
		this.dx = 0;
		this.dy = 0;
		    
		this.hx = this.dx - 0.5;
		this.hy = this.dy - 0.5;
		    
		this.tx = this.hx * this.radius * -2;
		this.ty = this.hy * this.radius * 2;
		this.tr = Math.atan2(this.hy, this.hx);

		this.domElement = document.createElement('canvas');
		this.ctx = this.domElement.getContext('2d');
		this.image = document.createElement('img');

	}

	draw(){
		const self = this;

		this.domElement.width = this.domElement.height = this.radius * 12;

		this.domElement.style.position = 'absolute';
		this.domElement.style.marginLeft = -kaleidoscope.radius + 'px';
		this.domElement.style.marginTop = -kaleidoscope.radius + 'px';
		this.domElement.style.left = '50%';
		this.domElement.style.top = '50%';

		document.body.appendChild(this.domElement);

		this.ctx.fillStyle = this.context.createPattern(this.image, 'repeat');

		let scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
		let step = TWO_PI / this.slices;
		let cx = this.image.width / 2;

		for (let i = 0; i < this.slices.length; i++ ){
			self.ctx.save();
			self.ctx.translate(self.radius, self.radius);
			self.ctx.rotate(i * step);

			self.ctx.beginPath();
			self.ctx.moveTo(-0.5, -0.5);
			self.ctx.arc(0, 0, self.radius, step * -0.51, step * 0.51);
			self.ctx.lineTo(0.5, 0.5);
			self.ctx.closePath();

			self.ctx.rotate(HALF_PI);
			self.ctx.scale(scale, scale);
			self.ctx.scale([-1,1][i % 2], 1);
			self.ctx.translate(self.offsetX - cx, self.offsetY);
			self.ctx.rotate(self.offsetRotation);
			self.ctx.scale(self.offsetScale, self.offsetScale);

			self.ctx.fill();
			self.ctx.restore();

		}
	}

	onMouseMove(ev){
		const self = this;

		self.cx = window.innerWidth / 2;
		self.cy = window.innerHeight / 2;
		self.dx = ev.pageX / window.innerWidth;
		self.dy = ev.pageY / window.innerHeight;
		self.hx = self.dx - 0.5;
		self.hy = self.dy - 0.5;
		self.tx = self.hx - self.radius * -2;
		self.ty = self.hy - self.radius * 2;
		self.tr = Math.atan2(self.hx, self.hy);


	}
}


  
image = new Image
image.onload = => do kaleidoscope.draw
image.src = 'http://cl.ly/image/1X3e0u1Q0M01/cm.jpg'

kaleidoscope = new Kaleidoscope
  image: image
  slices: 20


  
# Init drag & drop

dragger = new DragDrop ( data ) -> kaleidoscope.image.src = data
  
# Mouse events
  
tx = kaleidoscope.offsetX
ty = kaleidoscope.offsetY
tr = kaleidoscope.offsetRotation
  
onMouseMoved = ( event ) =>

                
  tx = hx * kaleidoscope.radius * -2
  ty = hy * kaleidoscope.radius * 2
  tr = Math.atan2 hy, hx

window.addEventListener 'mousemove', onMouseMoved, no
                
# Init
  
options =
  interactive: yes
  ease: 0.1
                
do update = =>
                
  if options.interactive

    delta = tr - kaleidoscope.offsetRotation
    theta = Math.atan2( Math.sin( delta ), Math.cos( delta ) )
                
    kaleidoscope.offsetX += ( tx - kaleidoscope.offsetX ) * options.ease
    kaleidoscope.offsetY += ( ty - kaleidoscope.offsetY ) * options.ease
    kaleidoscope.offsetRotation += ( theta - kaleidoscope.offsetRotation ) * options.ease
    
    do kaleidoscope.draw
  
  setTimeout update, 1000/60
    

onChange = =>

  kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px'
  kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px'
    
  options.interactive = no
    
  do kaleidoscope.draw
