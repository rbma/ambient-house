'use strict';

const Headroom = require('headroom.js');
const Canvas = require('./components/canvas');


class Piece {
	constructor(){
		this.init();
	}

	// ------------------------------------------------
	// Kick off
	//
	
	init(){
		console.log('What up son?');
		this.bindSocials();
		this.setupNav();

		//add new kaleido
		let img = new Image();

		img.onload = function(){
			console.log(img, img.width);
			let canvas = new Canvas(img);
		}

		img.src = 'http://cl.ly/image/1X3e0u1Q0M01/cm.jpg';

	}




	// ------------------------------------------------
	// Listen for clicks on social sharing
	//
	bindSocials(){
		let self = this;

		let socials = document.getElementsByClassName('share-icon');

		for (let i = 0; i < socials.length; i++ ){
			socials[i].addEventListener('click', self.share, false);
		}
	}




	// ------------------------------------------------
	// Share
	//
	share(ev){
		ev.preventDefault();
		let site = this.getAttribute('data-site');

		if (site === 'twitter'){
        	var tweet = 'YOUR TEXT HERE #RBMADaily';
        	window.open('https://twitter.com/home?status=' +
	            (encodeURIComponent(tweet + ' ' +
	            window.location.href)),
	            'Twitter',
	            'toolbar=no,width=450,height=400,directories=no,status=no,scrollbars=yes,resize=no,menubar=no,top=200,left=200');
	    }

	    if (site === 'facebook'){
	        window.open('https://www.facebook.com/sharer/sharer.php?u=' +
	            (encodeURIComponent(window.location.href)),
	            'Facebook',
	            'toolbar=no,width=450,height=400,directories=no,status=no,scrollbars=yes,resize=no,menubar=no,top=200,left=200');
	    }
	}



	// ------------------------------------------------
	// Setup nav. Use headroom options to set 
	// scroll listener to div if not using window
	//http://wicky.nillia.ms/headroom.js/
	
	setupNav(){
		let header = document.getElementById('nav');
		let headroom = new Headroom(header);
		headroom.init();
	}
	
};





let piece = new Piece();