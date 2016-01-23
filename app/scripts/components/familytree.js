'use strict';

const d3 = require('d3');
const d3tip = require('d3-tip');
const Audio = require('./audio');
d3tip(d3);


const Tree = function(){

	// ------------------------------------------------
	// Data placeholder
	//
	let root = null;

	let initialTextVisible = true;
	let infoActive = false;

	

	// ------------------------------------------------
	// Sizing
	//
	let margin = {
		top: 60,
		right: 20,
		left: 20,
		bottom: 20
	};

	const column = d3.select('.family-tree').node().getBoundingClientRect();
	let width = column.width - margin.left - margin.right;
	let height = window.innerHeight * 1;

	// ------------------------------------------------
	// Transition duration
	//
	const duration = 750;
	
	// ------------------------------------------------
	// Counter
	//
	let i = 0;
	let timeout = null;
	

	// ------------------------------------------------
	// Layout
	//
	const tree = d3.layout.tree()
		.size([width, height]);

	// ------------------------------------------------
	// Diagonal function
	//
	const diagonal = d3.svg.diagonal()
		.projection(function(d){
			return [d.x, d.y];
		});


	// ------------------------------------------------
	// Add SVG
	//
	const svg = d3.select('.family-tree')
		.append('svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

	const tip = d3.tip().attr('class', 'd3-tip')
		.html(function(d){
			return '<h4>' + d.name + '</h4><p>' + d.bio + '</p>';
		});



	svg.call(tip);


	// ------------------------------------------------
	// Initial collapse of data
	//	
	function collapse(d){
		if (d.children){
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	// ------------------------------------------------
	// Fetch data
	//
	d3.json('data/tree.json', function(err, data){
		if (err){
			throw err;
		}
		root = data;
		root.children.forEach(collapse);
		update(root);
	});


	function addInfo(d){


		if (!infoActive){
			d3.select('.fixed-tree-container')
				.classed('active', true);

			infoActive = true;
		}

		if (timeout){
			clearTimeout(timeout);
		}

		let infoBox = d3.select('.fixed-tree-container');
		
		infoBox.select('.artist')
			.style('opacity', 0)
			.transition()
			.duration(duration)
			.style('opacity', 1)
			.text(function(){
				return d.name;
			});

		infoBox.select('.bio')
			.style('opacity', 0)
			.transition()
			.duration(duration)
			.style('opacity', 1)
			.text(function(){
				return d.bio;
			});


	}

	function removeInfo(){

		let infoBox = d3.select('.fixed-tree-container');

		infoBox.select('.artist')
			.style('opacity', 1)
			.transition()
			.duration(duration * 2)
			.style('opacity', 0);

		infoBox.select('.bio')
			.style('opacity', 1)
			.transition()
			.duration(duration * 2)
			.style('opacity', 0);

		timeout = setTimeout(function(){
			infoBox.classed('active', false);
			infoActive = false;
		}, 1500);


	}


	// ------------------------------------------------
	// Main update function
	//
	function update(source){


		let nodes = tree.nodes(root).reverse();
		let links = tree.links(nodes);

		// ------------------------------------------------
		// Set fixed y depth
		//
		nodes.forEach(function(d){
			d.y = d.depth * 120;
		});

		let node = svg.selectAll('g.node')
			.data(nodes, function(d){
				return d.id || (d.id = ++i);
		});

		// ------------------------------------------------
		// Enter nodes
		//
		let nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {

				if (source.x0){
					return "translate(" + source.x0 + "," + source.y0 + ")";
				}

				else{
					return 'translate(' + source.x + ',' + source.y + ')';				}
			})
			.on("click", nodeclick)
			.on('mouseenter', function(d){
				// addInfo(d);
				tip.show(d);


				Audio.onHover();
			})
			.on('mouseleave', tip.hide);



		// ------------------------------------------------
		// Set arc around node
		//
		let arc = d3.svg.arc()
			.innerRadius(25)
			.outerRadius(27)
			.startAngle(Math.PI / 180)
			.endAngle(2);
		
		// ------------------------------------------------
		// Set circles around nodes
		//
		nodeEnter.append('path')
			.attr('d', arc)
			.style('fill', 'red');

		

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
		// Add artist names
		//
		nodeEnter.append('text')
			.attr('y', function(d){
				return 40;
			})
			.attr('dy', '.35em')
			.attr('text-anchor', 'middle')
			.text(function(d){
				return d.name;
			})
			.style('fill-opacity', 1e-6);


		


		// ------------------------------------------------
		// Update cycle
		//
		let nodeUpdate = node.transition()
			.duration(duration)
			.attr('transform', function(d){
				return 'translate(' + d.x + ',' + d.y + ')';
			});

		nodeUpdate.select('text')
			.style('fill-opacity', 1);


		// ------------------------------------------------
		// Exit cycle
		//
		let nodeExit = node.exit()
			.transition()
			.duration(duration)
			.attr('transform', function(d){
				return 'translate(' + source.x + ',' + source.y + ')';
			})
			.remove();

		// ------------------------------------------------
		// Remove image on exit
		//
		nodeExit.select('image')
			.remove();

		nodeExit.select('text')
			.style('fill-opacity', 1e-6);


		// ------------------------------------------------
		// Add link paths
		//
		
		let link = svg.selectAll('path.link')
			.data(links, function(d){
				return d.target.id;
			});

		link.enter()
			.insert('path', 'g')
			.attr('class', 'link')
			.attr('d', function(d){

				if (source.x0){
					var o = {
						x: source.x0,
						y: source.y0
					};

					return diagonal({
						source: o,
						target: o
					});
				}

				else{
					return diagonal(d);
				}
				
			});

		link.transition()
			.duration(duration)
			.attr('d', diagonal);

		link.exit()
			.transition()
			.duration(duration)
			.attr('d', function(d){
				var o = {
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
		// Save old pos
		//
		nodes.forEach(function(d){
			d.x0 = d.x;
			d.y0 = d.y;
		});

	}


	function nodeclick(d){
		if (initialTextVisible){
			d3.select('.initial-text')
				.transition()
				.duration(duration)
				.style('opacity', 0)
				.remove();

			initialTextVisible = false;
		}


		if (d.children){
			d._children = d.children;
			d.children = null;
			Audio.offClick();
		}
		else{
			if (d._children){
				d.children = d._children;
				d._children = null;
				Audio.onClick();
			}

			else{
				Audio.offClick2();
			}
			
		}

		update(d);

		
	}
    
};


module.exports = Tree;