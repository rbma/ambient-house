'use strict';

const d3 = require('d3');

class Tree {

	constructor(){
		this.margin = {
			top: 60,
			right: 0,
			bottom: 20,
			left: 0
		};

		this.modalActive = false;

		this.svg = null;
		this.data = null;
		this.height = 0;
		this.width = 0;
		this.transitionRun = false;

		this.tree = null;
		this.diagonal = null;
		this.waypoint = null;

		this.init();
	}

	init(){
		let self = this;


		d3.json('data/family.json', function(err, data){
			self.data = data[0];
			self.initChart();
		});

		let column = document.getElementsByClassName('body-container')[0];

		this.width = column.offsetWidth - this.margin.left - this.margin.right;
		this.height = window.innerHeight;
	}

	initChart(){
		let self = this;

		self.tree = d3.layout.tree()
			.size([self.width, self.height]);

		self.diagonal = d3.svg.diagonal()
			.projection(function(d){
				return [d.x, d.y];
			});

		this.svg = d3.select('.family-tree')
			.append('svg')
			.attr('width', self.width + self.margin.right + self.margin.left)
			.attr('height', self.height + self.margin.top + self.margin.bottom)
			.append('g')
			.attr('transform', 'translate(0,' + self.margin.top + ')');


		self.update(self.data);

		//add waypoint
		this.waypoint = new Waypoint({
			element: document.getElementById('family-tree'),
			offset: '50%',
			handler: function(direction){
				if (direction === 'down'){
					self.runTransition();
				}
			}
		});


	}

	update(data){

		let self = this;

		let nodes = self.tree.nodes(data);
		let links = self.tree.links(nodes);
		

		//distance between nodes
		nodes.forEach(function(d){
			d.y = d.depth * 150;
		});

		//declare nodes + enter
		let node = self.svg.selectAll('g.node')
			.data(nodes, function(d, i){
				return d.id || (d.id = ++i);
			})
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', function(d){
				return 'translate(' + d.x + ',' + d.y + ')';
			});;



		node.append('image')
			.attr('xlink:href', function(d){
				return d.image;
			})
			.attr('x', '-35px')
			.attr('y', '-35px')
			.attr('width', '70px')
			.attr('height', '70px')
			.on('mouseover', function(d){
				d3.select(this)
					.transition()
					.duration(300)
					.attr('width', '80px')
					.attr('height', '80px')
					.attr('x', '-40px')
					.attr('y', '-40px');
			})
			.on('mouseout', function(d){
				d3.select(this)
					.transition()
					.duration(300)
					.attr('width', '60px')
					.attr('height', '60px')
					.attr('x', '-30px')
					.attr('y', '-30px');
			})
			.on('click', self.handleClick);


		

		//add background fill
		node.append('rect')
			.attr('y', function(d){
				return 50;
			})
			.attr('x', -75)
			.attr('width', 150)
			.attr('height', 20)
			.attr('fill', 'black');

		

		node.append('text')
			.attr('y', function(d){
				return 60;
			})
			.attr('x', 0)
			.attr('dy', '.35em')
			.attr('text-anchor', 'middle')
			.text(function(d){
				return d.name;
			})
			.style('fill-opacity', 1);


		// ------------------------------------------------
		// Add links between nodes
		//
		self.addNodeLinks(links);
		
	}


	runTransition(){

		let self = this;

		if (!self.transitionRun){

			let images = self.svg.selectAll('image');

			images.transition()
				.delay(function(d,i){
					return i * 200;
				})
				.duration(400)
				.attr('width', 100)
				.attr('height', 100)
				.attr('x', '-50px')
				.attr('y', '-50px')
				.transition()
				.duration(400)
				.attr('x', '-35px')
				.attr('y', '-35px')
				.attr('width', '70px')
				.attr('height', '70px');

			self.transitionRun = true;

		}

		else{
			return null;
		}

		
	}


	handleClick(d){

		let linkData = d.links;

		d3.select('.family-info').classed('active', true);

		d3.select('#name')
			.text(d.name);
		d3.select('#bio')
			.text(d.bio);

		let links = d3.select('.info-links')
			.selectAll('li')
			.data(linkData);

		links.enter()
			.append('li')
			.insert('a')
			.attr('href', function(d){
				return d.url;
			})
			.text(function(d){
				return d.text;
			});

		links.exit().remove();





		
	}


	addNodeLinks(links){
		let self = this;
		let link = self.svg.selectAll('path.link')
			.data(links, function(d){
				return d.target.id;
			})
			.enter()
			.insert('path', 'g')
			.attr('class', 'link')
			.attr('d', self.diagonal)
			.style('stroke', 'black')
			.style('stroke-width', '1px');
	}

};

module.exports = Tree;