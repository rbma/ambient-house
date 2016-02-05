'use strict';

import d3 from 'd3';
import Kaleidoscope from './graph';


class Canvas {

    constructor(){

        this.kaleidoscope = null;
        this.container = null;
        this.scrollListener = null;
        this.mouseListener = null;
        this.scrollBody = document.getElementById('body-wrapper');
        this.init();
    }


    init(){
        let self = this;

        this.container = document.getElementById('title-canvas');
        this.container.style.width = window.innerWidth + 'px';
        this.container.style.height = window.innerHeight + 'px';
        
        // ------------------------------------------------
        // Container, zoomTarget, angleTarget
        //
        
        const kaleidoOptions = {
            zoomTarget: 0.5,
            angleTarget: 0.8,
            easeEnabled: false
        };

        this.kaleidoscope = new Kaleidoscope(this.container, kaleidoOptions);

        let image = new Image();

        image.onload = function(){
            let loader = document.getElementById('loader');
            loader.classList.add('gone');
            self.kaleidoscope.setImage(image);
            self.kaleidoscope.animate();
        }

        image.src = 'images/sky-cloud.jpg';


        this.kaleidoscope.resize();

        this.mouseListener = window.addEventListener('mousemove', self.onMouseMove.bind(this), false);

        // ------------------------------------------------
        // Listen for resize events
        //
        window.addEventListener('resize', function(){
            self.onResize();
        }, false);

        // ------------------------------------------------
        // Listen for scroll so we can disable canvas once past it
        //
        this.scrollListener = this.scrollBody.addEventListener('scroll', self.onScroll.bind(this), false); 
        

        self.onResize();
    }

    onScroll(ev){
        let self = this;
        this.scrollTop = ev.target.scrollTop;

        if (this.scrollTop > window.innerHeight + 100){
            this.kaleidoscope.destroy();
            this.scrollBody.removeEventListener(this.scrollListener);
            window.removeEventListener(self.mouseListener);

        }
    }



    onResize(){


        let w = window.innerWidth;
        let h = window.innerHeight;

        d3.select('#title-canvas')
            .style('width', w + 'px')
            .style('height', h + 'px')
            .select('canvas')
            .attr('width', window.innerWidth / 1.5 + 'px')
            .attr('height', window.innerHeight / 1.5 + 'px')
            .style('position', 'absolute')
            .style('left', w / 6 + 'px')
            .style('top', h / 6 + 'px');

        this.kaleidoscope.resize();


    }

    onMouseMove(ev){

        let x = ev.pageX / window.innerWidth;
        let y = ev.pageY / window.innerHeight;

        this.kaleidoscope.updateAngle(x);
        this.kaleidoscope.updateZoom(0.25 + (0.5 * y));
        
    }
        
}


export default Canvas;

