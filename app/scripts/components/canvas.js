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

        document.body.addEventListener('touchstart', function(ev){
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

        if (window.innerWidth > 1024){
            d3.select('#title-canvas')
                .style('width', w + 'px')
                .style('height', h + 'px')
                .select('canvas')
                .attr('width', window.innerWidth / 1.5 + 'px')
                .attr('height', window.innerHeight / 1.5 + 'px')
                .style('position', 'absolute')
                .style('left', w / 6 + 'px')
                .style('top', h / 6 + 'px');
        }

        else{
            d3.select('#title-canvas')
                .style('width', w + 'px')
                .style('height', h + 'px')
                .select('canvas')
                .attr('width', window.innerWidth + 'px')
                .attr('height', window.innerHeight + 'px')
                .style('position', 'absolute')
                .style('left', '0px')
                .style('top', '0px');
        }

        


    }

    onMouseMove(ev){

        let x;
        let y;

        if (ev.changedTouches){

            x = ev.changedTouches[0].pageX / (window.innerWidth / 2);
            y = ev.changedTouches[0].pageY / (window.innerHeight / 2);
        }

        else{
           x = ev.pageX / window.innerWidth;
           y = ev.pageY / window.innerHeight; 
        }


        

        this.scope.angleTarget = x;
        this.scope.zoomTarget = 0.25 + (0.5 * y);


    }
        
}


module.exports = Kaleidoscope;