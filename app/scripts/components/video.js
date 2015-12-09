'use strict';


const querystring = require('querystring');

class Video {

	constructor(target, src){

		this.target = target;
		this.src = src;

		this.init();
	}


	init(){
		
		let self = this;

		let options = {
			autoplay: 1,
			controls: 0,
			showinfo: 0,
			modestbranding: 1,
			hd: 1,
			iv_load_policy: 3,
			rel: 0
		};

		const params = querystring.stringify(options);
		const url = this.src + '?' + params;

		// ------------------------------------------------
		// Create iframe
		//
		let frame = document.createElement('iframe');
		frame.setAttribute('scrolling', 'no');
		frame.setAttribute('frameborder', '0');
		frame.setAttribute('seamless', 'seamless');
		frame.setAttribute('allowFullScreen', 'allowFullScreen');
		frame.setAttribute('width', '640');
		frame.setAttribute('height', '360');
		frame.setAttribute('src', url);

		// ------------------------------------------------
		// Append iframe
		//
		this.target.appendChild(frame);

		// ------------------------------------------------
		// Remove poster
		//
		let parent = this.target.parentNode;
		let poster = parent.getElementsByClassName('video-poster');
		poster[0].remove();
		
		
		
	}

};


module.exports = Video;