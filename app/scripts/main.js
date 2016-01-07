'use strict';

const Headroom = require('headroom.js');
const Canvas = require('./components/canvas');
const Tree = require('./components/familytree');
const BGImages = require('./components/bg-images');


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

		img.src = 'images/fractal.jpg';


		//add tree
		let tree = Tree();

		//let bgImages = new BGImages();

	}


	addClouds(){

		let clouds = document.getElementsByClassName('cloud-image');

		for (let i = 0; i < clouds.length; i++ ){

			let img = clouds[i].getAttribute('data-src');
			let parent = clouds[i];

			let cloud = new CloudImage(img, parent);
 
		}

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