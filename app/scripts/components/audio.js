'use strict';

import {Howl, Howler} from 'howler';


const Audio = {
	alreadyInit: false,
	type: '',

	init: function(){

		let self = this;

		if (self.alreadyInit){
			return;
		}

		else{

			self.hover = new Howl({
				urls: ['audio/click_digi_02.mp3'],
				volume: 0.2
			});


			self.click = new Howl({
				urls: ['audio/zap_future.mp3'],
				volume: 0.1
			});

			self.clickOff = new Howl({
				urls: ['audio/pad_space_fade.mp3'],
				volume: 0.1
			});

			self.clickOff2 = new Howl({
				urls: ['audio/pad_space_select.mp3'],
				volume: 0.1
			});
		}
	},

	onHover: function(){
		this.hover.play();
		return true;
	},

	onClick: function(){
		this.click.play();
		return true;
	},

	offClick: function(){
		this.clickOff.play();
		return true;
	},

	offClick2: function(){
		this.clickOff2.play();
		return true;
	}
}


module.exports = Audio;