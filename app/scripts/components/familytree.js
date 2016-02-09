'use strict';

import d3 from 'd3';
import d3tip from 'd3-tip';


d3tip(d3);


const Tree = function(){

	// ------------------------------------------------
	// Data placeholder
	//
	let root = null;

	let initialTextVisible = true;
	let infoActive = false;
	const imageWidth = 60;
	const halfImageWidth = 30;
	const hoverImageWidth = 80;
	const halfHoverImageWidth = 40;

	

	// ------------------------------------------------
	// Sizing
	//
	let margin = {
		top: 60,
		right: 50,
		left: 50,
		bottom: 20
	};

	const column = d3.select('.family-tree').node().getBoundingClientRect();
	let width = column.width - 100;
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
		.attr('class', 'svg-container')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

	const tip = d3.tip().attr('class', 'd3-tip')
		.html(function(d){
			return '<h4>' + d.name + '</h4><p>' + d.bio + '</p>';
		});


	// ------------------------------------------------
	// Initialize tooltip
	//
	svg.call(tip);


	// ------------------------------------------------
	// Initial collapse of data (leave three rows initially)
	//	
	function collapse(d){
		if (d.children){
			if (d.expandChildren === false){
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
			else{
				d.children.forEach(collapse);
			}
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
		//collapse(root);
		update(root);
	});





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
				tip.offset([-20, 0]);
				tip.show(d);


			})
			.on('mouseleave', tip.hide);



		// ------------------------------------------------
		// Set image for each incoming node
		//
		nodeEnter.append('image')
			.attr('xlink:href', function(d){
				return d.image;
			})
			.attr('x', -halfImageWidth + 'px')
			.attr('y', -halfImageWidth + 'px')
			.attr('width', imageWidth + 'px')
			.attr('height', imageWidth + 'px')
			.on('mouseover', function(d){
				d3.select(this)
					.transition()
					.duration(300)
					.attr('width', hoverImageWidth + 'px')
					.attr('height', hoverImageWidth + 'px')
					.attr('x', -halfHoverImageWidth +'px')
					.attr('y', -halfHoverImageWidth + 'px');
			})
			.on('mouseout', function(d){
				d3.select(this)
					.transition()
					.duration(300)
					.attr('width', imageWidth + 'px')
					.attr('height', imageWidth + 'px')
					.attr('x', -halfImageWidth + 'px')
					.attr('y', -halfImageWidth + 'px');
			});

		// ------------------------------------------------
		// Add artist names
		//
		nodeEnter.append('text')
			.attr('y', function(d){
				return 50;
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
		}
		else{
			if (d._children){
				d.children = d._children;
				d._children = null;
			}
			
		}

		update(d);

		
	}
    
};


module.exports = Tree;