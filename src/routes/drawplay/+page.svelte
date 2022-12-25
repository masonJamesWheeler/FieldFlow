<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { Graph } from './adjMatrix';
	import type { Graph as GraphType } from './adjMatrix';
	// intialize a variable for a div to hold the canvas
	let canvasDiv: number;
	//initialize the canvas
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let img: HTMLImageElement;
	let rect: DOMRect;
	let players: Player[] = [];
	let keysPressed = {};

	// intialize variables to hold the current player being edited
	let current_player: Player = null;
	let current_line_segment: LineSegment = null;
	let currentNode: Node = null;
	let index: number = null;
	let editNode: Node = null;
	let editingPlayer: Player = null;
	// initialize booleans to hold the state of the editor
	let drawing: boolean = false;
	let editing: boolean = false;
	let locking: boolean = false;
	let dragging: boolean = false;
	let makingBezier: boolean = false;
    let magnetX: boolean = false;
	let magnetY: boolean = false;
    let show: boolean = false;
    let addOption: boolean = false;
	let typing: boolean = false;
	let motion: boolean = false;
	// store the mouse position
	let m = { x: 0, y: 0 };
	// store magnets coords
	let magnetCoords = {x: 0, y: 0, connectx: 0, connecty: 0};
	// function to log the mouse position when clicked inside the canvas
	function handleMousemove(event: { clientX: number; clientY: number }) {
		rect = canvas.getBoundingClientRect();
		(m.x = (event.clientX - rect.left) * (canvas.width / rect.width)),
			(m.y = (event.clientY - rect.top) * (canvas.height / rect.height));
		drawPlayers();
		if (keysPressed['Shift']) {
			angleLock();
		}
        if (show) {
            projectPlayer();
        }
	}
	// store the shifted mouse position
	let m2 = { x: 0, y: 0 };
	// store the shifted length of the ray
	let length = 0;

	// onmount initialize the canvas
	onMount(() => {
		ctx = canvas.getContext('2d');
		// import the image from the folder
		img = new Image();
		img.src = 'background.png';
		// draw the image on the canvas
		img.onload = function () {
			if (ctx != null) {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			}
		};
		// add event listener to stop drawing a players path using the escape key and escape function
		document.addEventListener('keydown', function (event) {
			if (event.key == 'Escape') {
				escape();
			}
		});
		// add an event listener to know if we're holding shift or not
		document.addEventListener('keydown', function (event) {
			if (event.key == 'Shift' && !drawing) {
                show = true;
            } 
		});
		// add an event listener to know when a is released
		document.addEventListener('keydown', function (event) {
			if (event.key == 'a') {
				motion = true;
			}
		});
		// add an event listener to know when a is released
		document.addEventListener('keyup', function (event) {
			if (event.key == 'a') {
				motion = false;
			}
		});

		document.addEventListener('keyup', function (event) {
			if (event.key == 'Shift') {
				locking = false;
                show = false;
                // clear the canvas
                clearCanvas(ctx);
                // draw the players
                drawPlayers();
                // show the projection
                showProjection();
			}
		});

		// add an event listener to know when mouse comes up
		document.addEventListener('mouseup', function (event) {
			dragging = false;
			editNode = null;
		});
		// event listener to make a bezier curve
		document.addEventListener('keydown', function (event) {
			if (event.key == 'Backspace' && !typing) {
				deletePlayer();
			}
		});
		
		document.addEventListener('keydown', (event) => {
   		keysPressed[event.key] = true;
		});
		document.addEventListener('keyup', (event) => {
   		delete keysPressed[event.key];
	});

});
	// create a line segment object, the object has the following properties :
	// x1, y1, x2, y2, color, dashed, bezier, arrowhead
	// the objects or stored in the player's arrays and used to draw the path of the players
	class LineSegment {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		cx: number;
		cy: number;
		color: string;
		dashed: boolean;
		bezier: boolean;
		arrowhead: boolean;
		constructor(
			node1: Node,
			node2: Node,
			node3: Node,
			color: string,
			dashed: boolean,
			bezier: boolean,
			arrowhead: boolean
		) {
			this.x1 = node1.x;
			this.y1 = node1.y;
			if (node2 != null) {
				this.x2 = node2.x;
				this.y2 = node2.y;
			}
			if (node3 != null) {
				this.cx = node3.x;
				this.cy = node3.y;
			}
			this.color = color;
			this.dashed = dashed;
			this.bezier = bezier;
			this.arrowhead = arrowhead;
		}
	}

	// create a player object, the object has the following properties :
	// x, y, color, name, path, adjaency matrix
	// the objects or stored in the player's arrays and used to draw the path of the players
	class Player {
		x: number;
		y: number;
		color: string;
		name: string;
		job: string;
		adjmatrix: GraphType<Node>;
		constructor(
			x: number,
			y: number,
			color: string,
			name: string,
			job: string,
			adjmatrix: GraphType<Node>
		) {
			this.x = x;
			this.y = y;
			this.color = color;
			this.name = name;
			this.job = job;
			this.adjmatrix = adjmatrix;
		}
	}

	// create a node object to store the nodes of the adjacency matrix
	class Node {
		x: number;
		y: number;
		cpx: number;
		cpy: number;
		color: string;
		dashed: boolean;
		cp: boolean;
		arrow: boolean;
		blocking: boolean;
		constructor(
			x: number,
			y: number,
			cpx: number,
			cpy: number,
			color: string,
			dashed: boolean,
			cp: boolean,
			arrow: boolean,
			blocking: boolean
		) {
			this.x = x;
			this.y = y;
			this.cpx = cpx;
			this.cpy = cpy;
			this.color = color;
			this.dashed = dashed;
			this.cp = cp;
			this.arrow = arrow;
			this.blocking = blocking;
		}
	}

	// <---------      PLAYER FUNCTIONS     --------->

	// function to draw the players on the canvas by traversing the adjacnecy matrix and drawing the path
	// between each node and it's adjacent nodes
	function drawPlayers() {
		// draw the players
		for (let i = 0; i < players.length; i++) {
			let currPlayer = players[i];
			// draw a oval at the player's position
			if (currPlayer.adjmatrix.firstAdded != null) {
				currPlayer.x = currPlayer.adjmatrix.firstAdded.data.x;
				currPlayer.y = currPlayer.adjmatrix.firstAdded.data.y;
			}
			drawOval(currPlayer.x, currPlayer.y, currPlayer.color, currPlayer);
			// traverse the adjacency matrix
			currPlayer.adjmatrix.nodes.forEach((node) => {

				// draw the path between each node and it's adjacent nodes
				node.adjNodes.forEach((adjNode) => {
					// if the node is a bezier node, draw a bezier curve
					if (adjNode.data.cp && adjNode.data.cpx != null && adjNode.data.cpy != null) {
						if (currPlayer.adjmatrix.firstAdded == node) {
							drawBezier(
								node.data.x,
								node.data.y-45,
								adjNode.data.x,
								adjNode.data.y,
								adjNode.data.cpx,
								adjNode.data.cpy,
								currPlayer.color
							);
						} else {
						drawBezier(
							node.data.x,
							node.data.y,
							adjNode.data.x,
							adjNode.data.y,
							adjNode.data.cpx,
							adjNode.data.cpy,
							currPlayer.color
						);
						}
					} else if (!adjNode.data.cp) {
						if (currPlayer.adjmatrix.firstAdded == node) {
							if (adjNode.data.y > node.data.y -80) {
								// if the adj node is to the right of the node
								if (adjNode.data.x > node.data.x) {
									// draw a bezier curve from the node to the adj node
									drawLine(
								node.data.x+45,
								node.data.y,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color,
								adjNode.data.dashed
							);
								} else {
									// draw a bezier curve from the node to the adj node
									drawLine(
								node.data.x-45,
								node.data.y,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color,
								adjNode.data.dashed
							);
								}
							} else {
							drawLine(
								node.data.x,
								node.data.y-45,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color,
								adjNode.data.dashed
							);
						} 
					}else {
						drawLine(
							node.data.x,
							node.data.y,
							adjNode.data.x,
							adjNode.data.y,
							currPlayer.color,
							adjNode.data.dashed
						);
					}
				}
					// if the player is the current player, draw the nodes and control points
					if (currPlayer == current_player || editingPlayer == currPlayer) {
						// and it isn't the first node
						drawNodes(currPlayer);
						drawNode(currPlayer.x, currPlayer.y, currPlayer.color);
					}
					if (adjNode.data.arrow) {
						if (adjNode.data.cp) {
							drawArrowhead(
								adjNode.data.cpx,
								adjNode.data.cpy,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color
							);
						} else {
							drawArrowhead(
								node.data.x,
								node.data.y,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color
							);
						}
					} else if (adjNode.data.blocking) {
						if (adjNode.data.cp) {
							drawBlocking(
								adjNode.data.cpx,
								adjNode.data.cpy,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color
							);
						} else {
							drawBlocking(
								node.data.x,
								node.data.y,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color
							);
						}
					}
				});
			});
		}
        // to draw a player's name if they're being edited
        if (editingPlayer != null) {
        //showName();
        }
	}

	// function to add a player and start creating their path
	function addPlayer() {
		let n;
		let p
		let graph
		// create a new node
		// if magnetx then we create a new node at the magnetx
		// if magnety then we create a new node at the magnety
		// else we create a new node at the mouse's x and y
		if (magnetX && magnetY) {
			n = new Node(magnetCoords.x, magnetCoords.y, null, null, 'black', false, false, false, false);
			graph = new Graph<Node>(comparator, n);
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph); 
		} else if (magnetX) {
			n = new Node(magnetCoords.x, m.y, null, null, 'black', false, false, false, false);
			graph = new Graph<Node>(comparator, n);
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph);
		} else if (magnetY) {
			n = new Node(m.x, magnetCoords.y, null, null, 'black', false, false, false, false);
			graph = new Graph<Node>(comparator, n);
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph);
		} else {
			n = new Node(m.x, m.y, null, null, 'black', false, false, false, false);
			graph = new Graph<Node>(comparator, n);
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph);
		}
		// create the graph
		// create a new player
		// add the player to the players array
		players.push(p);
		// add a line segment to the player's path
		current_player = players[players.length - 1];
		current_line_segment = null;
		currentNode = n;
		p.adjmatrix.addNewNode(n);
		drawing = true;
		editing = false;
		angleLock();
	}

	function handleclick() {
		// if the user is currently drawing
		let l;
		let n;
		if (drawing) {
			// if we are currently drawing a bezier curve
			if (keysPressed['Shift']) {
				// if we are drawing the first node after creating the player
				if (current_player.adjmatrix.firstAdded == current_player.adjmatrix.lastAdded) {
					n = new Node(
					currentNode.x + m2.x * length,
					currentNode.y + m2.y * length,
					null,
					null,
					'black',
					keysPressed['a'],
					false,
					false,
					false
				);
				} else {
					n = new Node(
					currentNode.x + m2.x * length,
					currentNode.y + m2.y * length,
					null,
					null,
					'black',
					keysPressed['a'],
					false,
					false,
					false
				);
				}
				current_player.adjmatrix.addNewNode(n);
				current_player.adjmatrix.addEdge(currentNode, n);
				// adjust the current node
				currentNode = n;
			} else {
				if (keysPressed['d']) {
					let n = new Node(m.x, m.y, null, null, 'black', false, true, false, false);
					current_player.adjmatrix.addNewNode(n);
					current_player.adjmatrix.addEdge(currentNode, n);
					currentNode = n;
				} else if (
					current_player.adjmatrix.lastAdded.data.cp &&
					current_player.adjmatrix.lastAdded.data.cpx == null
				) {
					// if the last node is a control point than we need to finish it
					current_player.adjmatrix.lastAdded.data.cpx = m.x;
					current_player.adjmatrix.lastAdded.data.cpy = m.y;
				} else {
                    
					let n = new Node(m.x, m.y, null, null, 'black', keysPressed['a'], false, false, false);
					current_player.adjmatrix.addNewNode(n);
					current_player.adjmatrix.addEdge(currentNode, n);
					// adjust the current node
					currentNode = n;
				}
			}
		} else if (!editing && !drawing) {
			// check if we are clicking near a line segment
			// iterate through the adjacency matrix nodes
			checkLine(m.x, m.y);
            selectPlayer(m.x, m.y)
			console.log(editingPlayer);
			if (editingPlayer != null) {
				editing = true;
				editingPlayer.color = 'gray';
			} else if (!editing && !drawing && show) {
                // if we are not clicking on a line segment, then we are adding a new player
                addPlayer();
            } 
                
    
			//clear the canvas
			clearCanvas(ctx);
			// draw the players
			drawPlayers();
		} else if (editing) {
			// iterate through nodes
			checkLine(m.x, m.y);
			selectPlayer(m.x, m.y)
			console.log(editingPlayer)
			// if the user is clicking on a node and then let the user drag the node
			// while the mouse is down
			// iterate through nodes to see if we are clicking on a node
			if (editingPlayer != null) {
				editingPlayer.adjmatrix.nodes.forEach((node) => {
					// if addOption is true, then we are adding a new node and the editedNode is attatched to the node
					// we are clicking on
					console.log('reaching this point')
					if (inCircle(node.data.x, node.data.y, m.x, m.y) && keysPressed['s']) {
						drawing = true;
						currentNode = node.data;
						current_player = editingPlayer;
						current_player.adjmatrix.lastAdded = node
						editingPlayer = null
						clearCanvas(ctx);
						drawPlayers();


					} else if (inCircle(node.data.x, node.data.y, m.x, m.y)) {
						// if we are clicking on a node, then we are dragging
						editNode = node.data;
						dragging = true;
						// set the current node to the node we are dragging
						currentNode = node.data;
						// set the current player to the player we are editing
						current_player = editingPlayer;
						// create an event listener to set the nodes position to the mouse position until we `
						// let go of the mouse
						canvas.addEventListener('mousemove', (e) => {
							// if we are dragging
							if (dragging) {
								// set the node's position to the mouse position
								editNode.x = m.x;
								editNode.y = m.y;
								// clear the canvas
								clearCanvas(ctx);
								// draw the players
								drawPlayers();
							}
						});
					}
				});
			} else {
				if (!keysPressed['s']) {
				escape();
				}
			}
		}

		// if current player is not null
		if (current_player != null) {
		}
	}

	// function inCircle checks if our points are radially close to an origin
	function inCircle(x1: number, y1: number, x2: number, y2: number) {
		// calculate the distance between the two points
		let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
		// if the distance is less than the radius, then we are in the circle
		if (distance < 20) {
			return true;
		} else {
			return false;
		}
	}

	// function to continously draw the projection of the line segment
	function showProjection() {
		// if the user is currently drawing
		if (drawing) {
			console.log('testing')
			if (keysPressed['Shift']) {
				clearCanvas(ctx);
				if (current_player.adjmatrix.firstAdded.data == currentNode) {
					console.log('troubleshooting')
					// if the mouse is within 20 pixels of the y position of the currentNode and the cursor is to the right of the node
					if (m.y - currentNode.y > - 80) {
						// draw a line from the current node to the mouse position
						if (m.x > currentNode.x) {
							drawLine(
								currentNode.x + 45,
								currentNode.y,
								currentNode.x + m2.x * length,
								currentNode.y + m2.y * length,
								'black',
								keysPressed['a']
							);
						} else {
							drawLine(
								currentNode.x - 45,
								currentNode.y,
								currentNode.x + m2.x * length,
								currentNode.y + m2.y * length,
								'black',
								keysPressed['a']
							);
						}
					} else {
						drawLine(
							currentNode.x,
							currentNode.y - 45,
							currentNode.x + m2.x * length,
							currentNode.y + m2.y * length,
							'black',
							keysPressed['a']
						);
					}
				 } else {
				drawLine(
					currentNode.x,
					currentNode.y,
					currentNode.x + m2.x * length,
					currentNode.y + m2.y * length,
					'black',
					keysPressed['a']
				);
					}
                drawPlayers();
			} else {
				clearCanvas(ctx);
				if (currentNode.cp && currentNode.cpx == null) {
					if (current_player.adjmatrix.secondLastAdded == current_player.adjmatrix.firstAdded) {
						drawBezier(
						current_player.adjmatrix.secondLastAdded.data.x,
						current_player.adjmatrix.secondLastAdded.data.y-45,
						currentNode.x,
						currentNode.y,
						m.x,
						m.y,
						'black'
						);
						} else {
					drawBezier(
						current_player.adjmatrix.secondLastAdded.data.x,
						current_player.adjmatrix.secondLastAdded.data.y,
						currentNode.x,
						currentNode.y,
						m.x,
						m.y,
						'black'
					);
						}
					drawPlayers();
				} else {
					// if the current Node is the first node
					if (current_player.adjmatrix.firstAdded.data == currentNode) {
						if (m.y - currentNode.y > -80) {
						// draw a line from the current node to the mouse position
						if (m.x > currentNode.x) {
							drawLine(
								currentNode.x + 45,
								currentNode.y,
								m.x,
								m.y,
								'black',
								keysPressed['a']
							);
						} else {
							drawLine(
								currentNode.x - 45,
								currentNode.y,
								m.x,
								m.y,
								'black',
								keysPressed['a']
							);
						}
						}
					 	else {
						drawLine(
							currentNode.x,
							currentNode.y - 45,
							m.x,
							m.y,
							'black',
							keysPressed['a']
						);
					  }
					 } else {
					// draw a straight line between the current node and the mouse
					// the current node is currentNode
					drawLine(currentNode.x, currentNode.y, m.x, m.y, 'black', keysPressed['a']);
					}
					// then draw the players
					drawPlayers();
				}
			}
			console.log(motion)
		}
		// reset the m object
	}
    // function to project the image of the next player to add
    function projectPlayer () {
        clearCanvas(ctx);
        // if the magnet is on show the player to be added if we double click
		// check if the mouse is within 20 pixels of the any of the other players
		// if it is then make the magnet true
		for (let i = 0; i < players.length; i++) {
			if (Math.abs(m.y - players[i].y) < 20) {
				magnetY = true;
				magnetCoords.y = players[i].y;
				magnetCoords.connectx = players[i].x;
			} else {
				magnetY = false;
			}
			if (Math.abs(m.x - players[i].x) < 20) {
				magnetX = true;
				magnetCoords.x = players[i].x;
				magnetCoords.connecty = players[i].y;
			} else {
				magnetX = false;
			}
			if (magnetX || magnetY) {
				break;
			}
		}
		if (magnetX && magnetY) {
			drawOval(magnetCoords.x, magnetCoords.y, 'black', null);
			drawLine(
				magnetCoords.connectx,
				magnetCoords.connecty,
				magnetCoords.x,
				magnetCoords.y,
				'black',
				false
			);
		} else if (magnetX) {
			drawOval(magnetCoords.x, m.y, 'black', null);
			drawLine(
				magnetCoords.x,
				magnetCoords.connecty,
				magnetCoords.x,
				m.y,
				'black',
				true
			);
		} else if (magnetY) {
			drawOval(m.x, magnetCoords.y, 'black', null);
			drawLine(
				magnetCoords.connectx,
				magnetCoords.y,
				m.x,
				magnetCoords.y,
				'black',
				true
			);
		} else {
        drawOval(m.x, m.y,'black', null);
		}
        drawPlayers();
		
}



	// function to draw a straight line between two points
	function drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		color: string,
		dashed: boolean
	) {
		// set the color of the line
		if (ctx != null) {
			ctx.strokeStyle = color;
			// set the line width
			ctx.lineWidth = 14;
			// if the line is dashed
			if (dashed) {
				// set the line dash
				ctx.setLineDash([20, 20]);
			}
			// begin the path
			ctx.beginPath();
			// move to the first point
			ctx.moveTo(x1, y1);
			// draw a line to the second point
			ctx.lineTo(x2, y2);
			// stroke the line
			ctx.stroke();
			// close the path
			ctx.closePath();
		}
		// set the line dash back to normal
		ctx.setLineDash([0, 0]);
	}
	// }
	// function to clear the canvas and replace it with just the background
	function clearCanvas(ctx) {
		//suprress any error from the function
		try {
			if (ctx != null) {
				// clear the canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// draw the background
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			}
		} catch (error) {
		}
	}

	// function to escape currently drawing a player's path
	function escape() {
		// change all the players' colors to black
		for (let i = 0; i < players.length; i++) {
			players[i].color = 'black';
		}
	
		// if the user is currently drawing
		if (drawing) {
			// set current player's color to black if it is not null
			if (current_player != null) {
				current_player.color = 'black';
			}
			// if the editing player is not null
			if (editingPlayer != null) {
				// set the editing player's color to black
				editingPlayer.color = 'black';
			}
			// set editing to false
			editing = false;
			// set drawing to false
                // set drawing to false
                drawing = false;
			// set the current player to null
			current_player = null;
			// set the current line segment to null
			current_line_segment = null;
			// set the current node to null
			currentNode = null;
			// set the editing player to null
			editingPlayer = null;
			// set the edit node to null
			editNode = null;
		}
		if (editing) {
			// set current player's color to black if it is not null
			if (current_player != null) {
				current_player.color = 'black';
			}
			// if editingplayer is not null
			if (editingPlayer != null) {
				// set the editing player's color to black
				editingPlayer.color = 'black';
			}
			// set editing to false
			editing = false;
			// set the current player to null
			current_player = null;
			// set the current line segment to null
			current_line_segment = null;
			// set the current node to null
			currentNode = null;
			// set the editing player to null
			editingPlayer = null;
			// set the edit node to null
			editNode = null;
		}
		typing = false
		// clear the canvas
		clearCanvas(ctx);
		// draw the player's path
		drawPlayers();
	}

	// function to only show multiple angles of 15 degrees from the projected line
	// i.e angle-lock when we are holding in the shift key
	function angleLock() {
		// if the user is currently drawing
		if (drawing) {
			// get the mouse position
			// clear the canvas
			// draw the current player's path
			//drawPlayers();
			// get the angle between the last line segment's x2 and y2 and the current mouse position
			let angle = Math.atan2(m.y - currentNode.y, m.x - currentNode.x);
			// round the angle to the nearest 15 degrees
			angle = (Math.round((angle * 180) / Math.PI / 15) * 15 * Math.PI) / 180;
			// get the x and y components of the angle
			m2.x = Math.cos(angle);
			m2.y = Math.sin(angle);
			// calculate the length of the projected line segment
			length = Math.sqrt(Math.pow(m.x - currentNode.x, 2) + Math.pow(m.y - currentNode.y, 2));
		}
	}

	// function handle double click
	// if the click isn't near a node or a segment than add a player
	// if we are currently drawing a player's path and we double click than add a line segment with an arrowhead
	// if the click is near a node than add a line segment to that node
	// if the click is on the last node of the last segment than change that line segments arrow to true
	function handleDoubleClick() {
		// if we are currently drawing a player's path
		if (drawing) {
			// find the node that shares an edge with our current edge
			// remove the last addedNode from the adjmatrix
			current_player.adjmatrix.removeNode(current_player.adjmatrix.lastAdded.data);
			const i = current_player.adjmatrix.secondLastAdded.adjNodes.indexOf(
				current_player.adjmatrix.lastAdded
			);
			if (i > -1) {
				current_player.adjmatrix.secondLastAdded.adjNodes.splice(i, 1);
			}
			current_player.adjmatrix.secondLastAdded.data.arrow = true;
			clearCanvas(ctx);
			// draw the current player's path
			drawPlayers();
			escape();
		} else if (editing) {
			// if we're clicking on a node and it has no adjacent nodes
			// check if we are clicking near a node
			editingPlayer.adjmatrix.nodes.forEach((node) => {
				if (inCircle(node.data.x, node.data.y, m.x, m.y)) {
					// if we are clicking on a node with no adjacent nodes 
                    if (node.adjNodes.length == 0 && node.data.arrow == false) {
                    node.data.arrow = true;
					} else if (node.adjNodes.length == 0 && node.data.arrow == true) {
						node.data.arrow = false;
						node.data.blocking = true;
					}
                    else {
                        // if we are clicking on a node with adjacent nodes than we want to drawing from that node
                        // set the current node to the node we clicked on
                        currentNode = node.data;
                        editing = false;
                        drawing = true;
                        console.log(currentNode)
                    }
                    
				}
			});

			escape();
			clearCanvas(ctx);
			drawPlayers();
		} else {
			// recently changed to do nothing
            // we'll see if we want to change later
		}
		//drawPlayers();
	}

	// function draw arrowhead
	// draw an arrowhead at the end of a line segment
	function drawArrowhead(x1, y1, x2, y2, color) {
		ctx.fillStyle = color
		ctx.strokeStyle = color;
		// get the angle between the two points
		ctx.beginPath();
		let angle = Math.atan2(y2 - y1, x2 - x1);
		let x = 30 * Math.cos(angle) + x2;
		let y = 30 * Math.sin(angle) + y2;
		ctx.moveTo(x, y);
		angle += (1.0 / 3.0) * (2 * Math.PI);
		x = 30 * Math.cos(angle) + x2;
		y = 30 * Math.sin(angle) + y2;
		ctx.lineTo(x, y);
		angle += (1.0 / 3.0) * (2 * Math.PI);
		x = 30 * Math.cos(angle) + x2;
		y = 30 * Math.sin(angle) + y2;
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.fill();
	}
	// function to draw a line perpendicular to the line segment
	function drawBlocking(x1, y1, x2, y2, color) {
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(x2, y2);
		// calculate the angle between the two points
		let angle = Math.atan2(y2 - y1, x2 - x1);
		// rotate the angle 90 degrees
		angle += Math.PI / 2;
		// calculate the x and y components of the angle
		let x = 45 * Math.cos(angle) + x2;
		let y = 45 * Math.sin(angle) + y2;
		ctx.lineTo(x, y);
		// then move to the other side of the line segment
		angle += Math.PI;
		x = 45 * Math.cos(angle) + x2;
		y = 45 * Math.sin(angle) + y2;
		ctx.lineTo(x, y);
		ctx.stroke();


		
		
	}

	// function to draw a bezier curve
	function drawBezier(x1, y1, x2, y2, cx, cy, color) {
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.bezierCurveTo(cx, cy, cx, cy, x2, y2);
		ctx.stroke();
	}

	//function to draw an oval when the mouse is clicked on the canvas
	function drawOval(x1, y1, color, currPlayer) {
		if (ctx != null) {
			if (currPlayer != null) {
				if (currPlayer.name == 'C' || currPlayer.name == 'c') {
					if (players.length == 1) {
						let graph: Graph<Node>;
						// create the rest of the offensive line
						
						let i = new Node(currPlayer.x-250, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, i);
						let a = new Player(currPlayer.x-250 ,currPlayer.y,'Black', 'LT', 'route/job', graph)
						a.adjmatrix.addNewNode(i);
						players.push(a);

						let j = new Node(currPlayer.x-125, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, j);
					    let b = new Player(currPlayer.x-125 ,currPlayer.y,'Black', 'LG', 'route/job', graph)
						b.adjmatrix.addNewNode(j);
						players.push(b);

						let k = new Node(currPlayer.x+125, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, k);
						let c = new Player(currPlayer.x+125 ,currPlayer.y,'Black', 'RG', 'route/job', graph)
						c.adjmatrix.addNewNode(k);
						players.push(c);

						let m = new Node(currPlayer.x+250, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, m);
						let d = new Player(currPlayer.x+250 ,currPlayer.y,'Black', 'RT', 'route/job', graph)
						d.adjmatrix.addNewNode(m);
						players.push(d);
					}
					// make a hollow rectangle instead of an oval
					ctx.strokeStyle = color;
					ctx.lineWidth = 10;
					ctx.beginPath();
					ctx.rect(x1 - 40, y1 - 40, 80, 80);
					ctx.stroke();
				} else {
					ctx.strokeStyle = color;
			ctx.lineWidth = 12;
			ctx.beginPath();
			ctx.ellipse(x1, y1, 40, 40, 0, 0, 2 * Math.PI);
			ctx.stroke();
				}
			} else {
			ctx.strokeStyle = color;
			ctx.lineWidth = 12;
			ctx.beginPath();
			ctx.ellipse(x1, y1, 40, 40, 0, 0, 2 * Math.PI);
			ctx.stroke();
			}
			// if the player's name is not 'pos', null, or "" than draw the player's name
			// inside of the oval
			if (currPlayer != null) {
			if (currPlayer.name != 'pos' && currPlayer.name != null && currPlayer.name != '' && currPlayer.name != 'C' && currPlayer.name != 'c'
			&& currPlayer.name != 'LT' && currPlayer.name != 'LG' && currPlayer.name != 'RG' && currPlayer.name != 'RT') {
				ctx.font = '65px Georgia bold';
				
				ctx.fillStyle = 'black';
				ctx.fillText(currPlayer.name, x1 - 23, y1 + 18);
			}
			// if the player's job isn't null or "" or 'route/job' than draw the player's job
			// below the oval
			if (currPlayer.job != null && currPlayer.job != '' && currPlayer.job != 'route/job') {
				ctx.font = '65px Georgia bold';
				ctx.fillStyle = 'blue';
				ctx.fillText(currPlayer.job, x1 - 62, y1 + 120);
				ctx.fillStyle = 'black';
			}
		}
		}
	}

	// // function to draw a node at the end of a line segment
	function drawNode(x, y, color) {
		// set the color of the node
		ctx.fillStyle = color;
		// draw the node
		ctx.beginPath();
		ctx.arc(x, y, 15, 0, 2 * Math.PI);
		ctx.fill();
	}
	// function to draw all the nodes of a player
	function drawNodes(player) {
		// traverse the adjacency matrix
		player.adjmatrix.nodes.forEach((node) => {
			// check that the node is not the first node
			if (node.data != player.adjmatrix.firstAdded) {
				// draw the node
				drawNode(node.data.x, node.data.y, node.data.color);
			}
		});
	}

	// function to use as a comparator
	function comparator(a: Node, b: Node) {
		return null;
	}

	// function to check if we're clicking near a line and returns the given line
	function checkLine(x: number, y: number) {
		let success = false;
		for (let i = 0; i < players.length; i++) {
			let currPlayer: Player = players[i];
			// traverse the adjacency matrix
			currPlayer.adjmatrix.nodes.forEach((node) => {
				// traverse through the nodes adjacency matrix
				node.adjNodes.forEach((adjNode) => {
					// if we are dealing with the first Node
					if (currPlayer.adjmatrix.firstAdded == node) {
					if (
						Math.abs(
							(adjNode.data.y - (node.data.y-45)) * x -
								(adjNode.data.x - node.data.x) * y +
								adjNode.data.x * (node.data.y -45) -
								adjNode.data.y * node.data.x
						) /
							Math.sqrt(
								Math.pow(adjNode.data.y - (node.data.y-45), 2) +
									Math.pow(adjNode.data.x - node.data.x, 2)
							) <
						10
					) {
						// return the line
						success = true;
						editingPlayer = currPlayer;
					}
					} else 
					// if the click is close to the line connecting the two node and adjNode
					// the formula for the line in-between the two points is
					// checking to see if our click is within 10 pixels of the line
					if (
						Math.abs(
							(adjNode.data.y - node.data.y) * x -
								(adjNode.data.x - node.data.x) * y +
								adjNode.data.x * node.data.y -
								adjNode.data.y * node.data.x
						) /
							Math.sqrt(
								Math.pow(adjNode.data.y - node.data.y, 2) +
									Math.pow(adjNode.data.x - node.data.x, 2)
							) <
						10
					) {
						// return the line
						success = true;
						editingPlayer = currPlayer;
					}
				});
			});
		}
		// if success is false, then we didn't click on a line
		if (!success) {
			escape();
			// clear canvas
			clearCanvas(ctx);
			// redraw the players
			drawPlayers();
		}
	}

	//function to delete a player
	function deletePlayer() {
		// remove the player from the players array
		console.log(editingPlayer)
		players.splice(players.indexOf(editingPlayer), 1);
		console.log(players)
		//escape
		escape();
		
		
	}

    // function to select and edit a player by clicking on their oval
    function selectPlayer(x: number, y: number) {
		console.log('working')
        let found = false;
        // traverse the players array
        for (let i = 0; i < players.length; i++) {
            // check the players x and y and see if our mouse is close to it
			console.log(i, players[i].x, players[i].y)
            if (Math.sqrt(Math.pow(players[i].x - x, 2) + Math.pow(players[i].y - y, 2)) < 50) {
				
                // set the editing player to the player we clicked on
                editingPlayer = players[i];
                // set found to true
                found = true;
                // break out of the loop
                break;
            }
        }
    }

    // if a player is selected then we want to display the players name below their oval
    function showName() {
        // check if the editing player is null
        if (editingPlayer != null) {
            // set the font
            ctx.font = "60px Helvetica";
            // set the color
            ctx.fillStyle = "black";
            // draw the text
            ctx.fillText(editingPlayer.name, editingPlayer.x -75, editingPlayer.y +70);
        }
    }
    // if we click on a player's name then we want to be able to edit it
	function changingName () {
		typing = true
	}

	// function to calculate the distance between the edge of the window and the the canvas


    

</script>

<div class="w-full grid  items-center"
bind:clientWidth={canvasDiv}

>
	<!-- make a canvas element  -->
	<!-- bind the  -->
	<!-- center the div -->
	<div class = "relative">
	<canvas
		bind:this={canvas}
		on:mousemove={handleMousemove}
		on:dblclick={handleDoubleClick}
		on:mousedown={handleclick}
		on:mousemove={showProjection}
		width="2600"
		height="2600"
		style="width:800px; height:650px;"
		class="mx-auto justify-center my-10"
		id="canvas"
	/>
    {#if editingPlayer != null}
	<input type="text" style="z-index:101; position:absolute; top:{65+((editingPlayer.y)/(canvas.height/rect.height))}px;
	 left:{(canvasDiv-(canvas.width/rect.width))/2 + (editingPlayer.x)/(canvas.width / rect.width) -432}px;
	 text-align: center;" placeholder="{editingPlayer.name}" bind:value={editingPlayer.name}
	 class="input input-bordered input-primary  w-16"
	 on:click={changingName}/>
    {/if}
	{#if editingPlayer != null}
	<input type="text" style="z-index:101; position:absolute; top:{115+((editingPlayer.y)/(canvas.height/rect.height))}px;
	 left:{(canvasDiv-(canvas.width/rect.width))/2 + (editingPlayer.x)/(canvas.width / rect.width)-432}px;
	 text-align: center;" placeholder="{editingPlayer.job}" bind:value={editingPlayer.job}
	 class="input input-bordered input-primary  w-16"
	 on:click={changingName}/>
    {/if}

</div>
</div>
<!-- show the user the mouses coordinates -->
<div class="mx-auto justify-center my-10">
	<p>Mouse coordinates: {m.x}, {m.y}</p>
</div>
