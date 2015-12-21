'use strict';

const d3 = require('d3');


class Kaleidoscope {

    constructor(){

        this.scope = null;
        this.container = null;
        this.init();
    }


    init(){
        let self = this;

        this.container = document.getElementById('title-canvas');
        this.container.style.width = window.innerWidth + 'px';
        this.container.style.height = window.innerHeight + 'px';
        
        this.scope = new Graphemescope(this.container);

        let image = new Image();

        image.onload = function(){
            let loader = document.getElementById('loader');
            loader.classList.add('gone');
            self.scope.setImageDirect(image);
        }

        image.src = 'images/fractal.jpg';

        this.scope.easeEnabled = true;
        this.scope.zoomTarget = 2.0;
        this.scope.angleTarget = 0.5;
        this.scope.resizeHandler();

        window.addEventListener('mousemove', function(ev){
            self.onMouseMove(ev);
        }, false);

        window.addEventListener('resize', function(){
            self.onResize();
        }, false);

        self.onResize();
    }


    onResize(){

        console.log('resize');

        let w = window.innerWidth;
        let h = window.innerHeight;

        d3.select('#title-canvas')
            .style('width', w + 'px')
            .style('height', h + 'px')
            .select('canvas')
            .attr('width', window.innerWidth / 2 + 'px')
            .attr('height', window.innerHeight / 2+ 'px')
            .style('position', 'absolute')
            .style('left', w / 4 + 'px')
            .style('top', h / 4 + 'px');


    }

    onMouseMove(ev){


        let x = ev.pageX / window.innerWidth;
        let y = ev.pageY / window.innerHeight;

        this.scope.angleTarget = x;
        this.scope.zoomTarget = 0.25 + (0.5 * y);


    }
        
}


module.exports = Kaleidoscope;