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

		this.svg = null;
		this.data = null;
		this.height = 0;
		this.width = 0;
		this.transitionRun = false;
		this.duration = 750;
		this.tree = null;
		this.diagonal = null;
		this.waypoint = null;
		this.nodes = [];
		this.i = 0;
		this.initChart();


	}



	// -------------------------------------------------
	//
	// Set up chart with sizing + main functions
	// 
	// -------------------------------------------------
	
	initChart(){
		let self = this;
		let root = null;


		// ------------------------------------------------
		// Collapse function
		//
		
		function collapse(d){
			if (d.children){
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}



		function update(source){


			let nodes = tree.nodes(root).reverse();
			let links = tree.links(nodes);

			// ------------------------------------------------
			// Normalize for fixed depth
			//
			nodes.forEach(function(d){
				console.log(d);
				d.y = d.depth * 100;
			});

			// ------------------------------------------------
			// Declare nodes
			//
			let node = svg.selectAll('g.node')
				.data(nodes, function(d){
					return d.id || (d.id = ++self.i);
				});

			// ------------------------------------------------
			// Enter nodes
			//
			let nodeEnter = node.enter().append('g')
				.attr('class', 'node')
				.attr('transform', function(d){
					return 'translate(' + source.x0 + ',' + source.y0 + ')';
				})
				.on('click', nodeClick);

			// ------------------------------------------------
			// Circle
			//
			nodeEnter.append('circle')
				.attr('r', 10)
				.attr('stroke', function(d){
					return d.children || d._chilren ? 'yellow' : 'rgba(0,255,0,1)';
				});

			// ------------------------------------------------
			// Text
			//
			nodeEnter.append('text')
				.attr('y', function(d){
					return d.children || d._children ? -18 : 18;
				})
				.attr('dy', '.35em')
				.attr('text-anchor', 'middle')
				.text(function(d){
					return d.name;
				})
				.style('fill-opacity', 1e-6);

			// ------------------------------------------------
			// Transition to new pos
			//
			let nodeUpdate = node.transition()
				.duration(self.duration)
				.attr('transform', function(d){
					return 'translate(' + d.x + ',' + d.y + ')';
				});

			nodeUpdate.select('circle')
				.attr('r', 10);

			nodeUpdate.select('text')
				.style('fill-opacity', 1);


			// ------------------------------------------------
			// Exits
			//
			let nodeExit = node.exit()
				.transition()
				.duration(self.duration)
				.attr('transform', function(d){
					return 'translate(' + source.x + ',' + source.y + ')';
				})
				.remove();

			nodeExit.select('circle')
				.attr('r', 1e-6);

			nodeExit.select('text')
				.style('fill-opacity', 1e-6);

			
			// ------------------------------------------------
			// Add links
			//
			
			let link = svg.selectAll('path.link')
				.data(links, function(d){
					return d.target.id;
				});

			// ------------------------------------------------
			// Enter
			//
			link.enter()
				.insert('path', 'g')
				.attr('class', 'link')
				.attr('d', function(d){
					let o = {
						x: source.x0,
						y: source.y0
					};
					return diagonal({
						source: 0,
						target: 0
					});
				});

			link.transition()
				.duration(self.duration)
				.attr('d', diagonal);


			link.exit()
				.transition()
				.duration(self.duration)
				.attr('d', function(d){
					let o = {
						x: source.x,
						y: source.y
					};

					return diagonal({
						source: o,
						target: o
					});
				})
				.remove();


			// ------------------------------------------------
			// Stash old pos
			//
			nodes.forEach(function(d){
				d.x0 = d.x;
				d.y0 = d.y;
			});
		}


		function nodeClick(d){
			if (d.children){
				d._children = d.children;
				d.children = null;
			}

			else{
				d.children = d._children;
				d._children = null;
			}

			update(d);
		}

		

		// ------------------------------------------------
		// Size chart
		//
		this.setChartDimensions();

		// ------------------------------------------------
		// Set chart as tree
		//
		let tree = d3.layout.tree()
			.size([self.width, self.height]);

		let diagonal = d3.svg.diagonal()
			.projection(function(d){
				return [d.x, d.y];
			});

		// ------------------------------------------------
		// Add SVG
		//
		let svg = d3.select('.family-tree')
			.append('svg')
			.attr('width', self.width + self.margin.right + self.margin.left)
			.attr('height', self.height + self.margin.top + self.margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');

		// ------------------------------------------------
		// Bring in Data
		//

		d3.json('data/tree.json', function(err, data){

			if (err){
				throw err;
			}

			// hideChildren(data);
			
			root = data;
			root.children.forEach(collapse);
			update(root);
		});
		

	}


	// -------------------------------------------------
	//
	// Set Chart Dimensions
	// 
	// -------------------------------------------------
	
	setChartDimensions(){

		// ------------------------------------------------
		// Get width of parent DOM element
		//
		let column = d3.select('.family-tree').node().getBoundingClientRect();
		this.width = column.width - this.margin.left - this.margin.right;
		this.height = window.innerHeight * 1.5;

	}



	// -------------------------------------------------
	//
	// Update cycle
	// 
	// -------------------------------------------------
	
	update(data){

		let self = this;

		// ------------------------------------------------
		// Compute new tree layout
		//
		//NOTE: using full data on self.nodes, not data passed in
		self.nodes = self.tree.nodes(self.data).reverse();
		let links = self.tree.links(self.nodes);
		

		
		// ------------------------------------------------
		// Set distance between nodes
		//
		self.nodes.forEach(function(d){
			d.y = d.depth * 150;
		});

		

		// ------------------------------------------------
		// Update the nodes
		//
		let node = self.svg.selectAll('g.node')
			.data(self.nodes, function(d, i){
				return d.id || (d.id = ++i);
		});



		// ------------------------------------------------
		// Enter any new nodes at parent's previous position
		//
		let nodeEnter = node.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', function(d){
				return 'translate(' + data.x + ',' + data.y + ')';
			})
			// ------------------------------------------------
			// Collapse data
			//

			.on('click', function(d){
				self.click(d);
			});


		// ------------------------------------------------
		// Set image for each incoming node
		//
		nodeEnter.append('image')
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
			});


		

		// ------------------------------------------------
		// Add background fill
		//
		
		// node.append('rect')
		// 	.attr('y', function(d){
		// 		return 50;
		// 	})
		// 	.attr('x', -50)
		// 	.attr('width', 100)
		// 	.attr('height', 20)
		// 	.attr('fill', 'white');

		

		node.append('text')
			.attr('y', function(d){
				return d.children || d._children ? -50 : 50;
			})
			.attr('x', 0)
			.attr('dy', '.35em')
			.attr('text-anchor', 'middle')
			.text(function(d){
				return d.name;
			})
			.style('fill-opacity', 0);


		// ------------------------------------------------
		// Transition nodes to new position
		//
		let nodeUpdate = node.transition()
			.duration(self.duration)
			.attr('transform', function(d){
				return 'translate(' + d.x + ',' + d.y + ')';
			});


		// ------------------------------------------------
		// Show text
		//
		nodeUpdate.select('text')
			.style('fill-opacity', 1);

		
		// ------------------------------------------------
		// Transition exiting nodes to parent's new position
		//
		let nodeExit = node.exit()
			.transition()
			.duration(self.duration)
			.attr('transform', function(d){
				return 'translate(' + data.x + ', ' + data.y + ')';
			})
			.remove();

		// ------------------------------------------------
		// Remove text on exit
		//
		nodeExit.select('text')
			.style('fill-opacity', 0);


		// ------------------------------------------------
		// Remove image on exit
		//
		nodeExit.select('image')
			.transition()
			.duration(self.duration)
			.attr('width', 0)
			.attr('height', 0)
			.remove();
		
		
		// ------------------------------------------------
		// Update node links
		//
		let link = self.svg.selectAll('path.link')
			.data(links, function(d){
				return d.target.id;
		});

		link.enter().insert('path', 'g')
			.attr('class', 'link')
			.attr('d', function(d){
				var o = {x: data.x, y: data.y};
				return self.diagonal({source: o, target: o});
		});

		// ------------------------------------------------
		// Transition links to new position
		//
		link.transition()
			.duration(self.duration)
			.attr('d', self.diagonal);

		// ------------------------------------------------
		// Transition exiting nodes
		//
		link.exit()
			.transition()
			.duration(self.duration)
			.attr('d', function(d){
				let o = {x: data.x, y: data.y};
				return self.diagonal({source: o, target: o});
			})
			.remove();


		// ------------------------------------------------
		// Stash old positions for transition
		//
		self.nodes.forEach(function(d){
			d.x0 = d.x;
			d.y0 = d.y;
		});
		

		
		
		
		
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


};


// this.waypoint = new Waypoint({
		// 	element: document.getElementById('family-tree'),
		// 	offset: '50%',
		// 	handler: function(direction){
		// 		if (direction === 'down'){
		// 			self.runTransition();
		// 		}
		// 	}
		// });

module.exports = Tree;