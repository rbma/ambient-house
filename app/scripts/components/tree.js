'use strict';

const d3 = require('d3');

class Tree {

	constructor(){
		this.margin = {
			top: 60,
			right: 20,
			bottom: 20,
			left: 20
		};

		this.modalActive = false;

		this.svg = null;
		this.data = null;
		this.height = 0;
		this.width = 0;
		this.transitionRun = false;
		this.duration = 750;

		this.tree = null;
		this.diagonal = null;
		this.waypoint = null;

		this.init();
	}

	init(){
		let self = this;


		d3.json('data/family.json', function(err, data){
			self.data = data[0];
			self.data.x0 = 0;
			self.data.y0 = self.width / 2;
			self.initChart();
		});

		let column = document.getElementsByClassName('family-tree')[0];

		this.width = column.offsetWidth - this.margin.left - this.margin.right;
		this.height = window.innerHeight * 2;
	}

	initChart(){
		let self = this;


		// ------------------------------------------------
		// Collapse children
		//
		function collapse(d){
			console.log(d.children);
			if (d.children){
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}



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


		// ------------------------------------------------
		// Collapse data
		//
		
		// self.data.children.forEach(collapse);
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

		let nodes = self.tree.nodes(data).reverse();
		let links = self.tree.links(nodes);
		

		//distance between nodes
		nodes.forEach(function(d){
			
			if (d.depth === 0 || d.depth === 1){
				d.y = d.depth * 120;
			}


			else{
				d.y = d.depth * 180;
			}

		});

		//declare nodes + enter
		let node = self.svg.selectAll('g.node')
			.data(nodes, function(d, i){
				return d.id || (d.id = ++i);
			});

		// ------------------------------------------------
		// Enter any new nodes at parent's previous position
		//
		
		let nodeEnter = node.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', function(d){
				console.log(data.y0);
				return 'translate(' + data.y0 + ',' + data.x0 + ')';
			});;



		node.append('image')
			.attr('xlink:href', function(d){
				return d.image;
			})
			.attr('x', '-25px')
			.attr('y', '-25px')
			.attr('width', '50px')
			.attr('height', '50px')
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
					.attr('width', '50px')
					.attr('height', '50px')
					.attr('x', '-25px')
					.attr('y', '-25px');
			})
			.on('click', self.handleClick);


		

		//add background fill
		node.append('rect')
			.attr('y', function(d){
				return 50;
			})
			.attr('x', -50)
			.attr('width', 100)
			.attr('height', 20)
			.attr('fill', 'white');

		

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
					return i * 100;
				})
				.duration(200)
				.attr('width', 100)
				.attr('height', 100)
				.attr('x', '-50px')
				.attr('y', '-50px')
				.transition()
				.duration(200)
				.attr('x', '-25px')
				.attr('y', '-25px')
				.attr('width', '50px')
				.attr('height', '50px');

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
			.attr('d', self.diagonal);
	}

};

module.exports = Tree;