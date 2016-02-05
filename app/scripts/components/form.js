'use strict';


class Form {

	constructor(){
		this.colors = {
			a1: '#ff2d5d',
			a2: '#42dc8e',
			a3: '#2e43eb',
			a4: '#ffe359',
			b1: '#96bfed',
			b2: '#f5ead6',
			b3: '#f1f3f7',
			b4: '#e2e6ef'
		};

		this.rects = [];
		this.cells = 10;


		this.space = new Pt.CanvasSpace('body-canvas', this.colors.b4).display('body');
		console.log(this.space);
		this.form = new Pt.Form(this.space);
		this.form.stroke(false);

		this.init();
	}


	init(){
		const self = this;
		// ------------------------------------------------
		// Create elements
		//
		let unit = new Pt.Vector(this.space.size.$divide(this.cells));
		let labA = 50;
		let labB = 50;

		for (let i = 0; i < this.cells; i++ ){
			for (let c = 0; c < self.cells; c++ ){
				let pos = unit.$multiply(c, i);
				let rect = new Pt.Rectangle(pos).to(pos.$add(unit).add(0.5));
				let _ps = rect.corners();
				let tri = new Pt.Triangle(_ps.topLeft).to(_ps.bottomLeft, _ps.bottomRight);
				self.rects.push({a: rect, b: tri});
			}
		}

		// ------------------------------------------------
		// Visualize
		//
		this.space.add({
			animate: function(time, fps, context){
				for (let r = 0; r < self.cells; r++ ){
					for (let c = 0; c < self.cells; c++ ){
						let i = r * self.cells + c;
						let lab = new Pt.Color(
							58,
							r / self.cells * 128 - 128 + labA,
							c / self.cells * 128 - 128 + labB,
							1,
							'lab'
						);

						self.form.fill(lab.rgb());
						self.form.rect(self.rects[i].a);

						lab.x = i / self.rects.length * 15 + 60;
						self.form.fill(lab.rgb());
						self.form.triangle(self.rects[i].b);
					}
				}
			},

			onMouseAction: function(type, x, y, evt){
				console.log(x,y);
				if (type === 'move'){
					labA = x / self.space.size.x * 127;
					labB = y / self.space.size.y * 127;
				}
			}
		});


		self.space.bindMouse();
		self.space.play();
		
		
	}

};


export default Form;

