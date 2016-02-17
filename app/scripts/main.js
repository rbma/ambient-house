'use strict';

import Headroom from 'headroom.js';
import { FastClick } from 'fastclick';
import MobileDetect from 'mobile-detect';


// import Canvas from './components/canvas';
import Tree from './components/familytree';
import Video from './components/video';
import ThreeScene from './components/three-scope';



class Piece {
	constructor(){
		this.tree = null;
		this.scene = null;
		this.init();
	}

	// ------------------------------------------------
	// Kick off
	//
	
	init(){

		const md = new MobileDetect();
		const self = this;
		let mobile = false;
		

		// ------------------------------------------------
		// Set up listeners
		//
		this.bindSocials();
		this.setupNav();
		this.bindVideo();

		// ------------------------------------------------
		// Sorry, device sniffing
		//
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			mobile = true;
		}

		// ------------------------------------------------
		// Desktop
		//
		if (!mobile){
			this.scene = new ThreeScene();
		}

		// ------------------------------------------------
		// Mobile
		//
		else{

			// ------------------------------------------------
			// Attach fastclick
			//
			if ('addEventListener' in document) {
				document.addEventListener('DOMContentLoaded', function() {
					FastClick.attach(document.body);
				}, false);
			}

		}

		// ------------------------------------------------
		// Add chart just in case, even though we don't display on mobile
		//
		this.tree = Tree();

		// ------------------------------------------------
		// Add waypoints
		//
		let wDown = new Waypoint({
			element: document.getElementById('break'),
			context: document.getElementById('body-wrapper'),
			offset: '100%',
			handler: function(direction){
				if (direction === 'down'){
					this.element.classList.add('grow');

					if (self.scene){
						self.scene.stop();
					}
				}
			}
		});

		let wUp = new Waypoint({
			element: document.getElementById('break'),
			context: document.getElementById('body-wrapper'),
			offset: '100%',
			handler: function(direction){
				if (direction === 'up'){
					self.scene.start();
				}
			}
		});


		// ------------------------------------------------
		// If user sizes up from mobile, make sure chart is ready
		//
		window.addEventListener('resize', function(){
			if (window.innerWidth > 1024 || !self.tree){
				self.tree = Tree();
			}
			if (window.innerWidth <= 1024 || self.tree){
				self.tree = null;
			}
		});

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
		const wrapper = document.getElementById('body-wrapper');
		const header = document.getElementById('nav');
		Headroom.options.scroller = wrapper;

		const headroom = new Headroom(header);
		headroom.init();
	}


	// ------------------------------------------------
	// Watch for clicks on video
	//
	bindVideo(){
		let self = this;
		let videos = document.getElementsByClassName('video-inner');

		for (let i = 0; i < videos.length; i++ ){
			videos[i].addEventListener('click', self.playVideo, false);
		}
	}

	// ------------------------------------------------
	// Instantiate new video
	//
	playVideo(){
		const target = this;
		const src = target.getAttribute('data-src');
		let host = target.getAttribute('data-host');

		if (target.getAttribute('data-host')){
			host = target.getAttribute('data-host');
			
		}

		const video = new Video(target, src, host);

		
	}
	
	
};




// ------------------------------------------------
// Fire it up
//

const piece = new Piece();



