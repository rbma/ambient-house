'use strict';


class BGImages {

	constructor(){
		this.container = null;
		this.currentImage = null;
		this.currentIndex = 0;
		this.bgImageArray = [];
		this.init();
	}

	init(){
		let self = this;


		this.container = document.getElementById('bgImage');

		//grab all bg-image blocks
		this.bgImageArray = document.getElementsByClassName('bg-image');

		//loop through and add unique ids
		for (let i = 0; i < self.bgImageArray.length; i++ ){
			
			self.bgImageArray[i].setAttribute('id', 'bgImage' + i);
			



			// let waypoint = new Waypoint({
			// 	element: document.getElementById('bgImage' + i),
			// 	offset: '100%',
			// 	handler: function(direction){
			// 		if (direction === 'down'){
			// 			self.swapImage();

			// 		}
			// 	}
			// });
		}
	}

	//load and add image
	swapImage(){
		let self = this;

		let img = new Image();
		let imgSrc = self.bgImageArray[self.currentIndex].getAttribute('data-img');

		img.onload = function(){

			self.container.style.background = 'url(' + imgSrc + ')';
			self.currentIndex++;

		};

		img.src = imgSrc;


	}

}


module.exports = BGImages;