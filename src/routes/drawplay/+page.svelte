<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Graph } from './adjMatrix';
	import { Player, Node } from "../../utils/objects"
	import type { Graph as GraphType } from './adjMatrix';
	import type {PageData} from '$lib/types';
	import { storeFormation, storePlay, getPlay, getFormation} from '../../utils/stores';
	import {drawFormation, makeFormation} from '../../utils/drawing';
	import { db } from '../../lib/firebase';
	import {getDefensivePlayers, getOffensiveStrength, frontRules, DefensiveFormation} from '../../utils/defObjects'
 
	// get the user as a props
	export let data: PageData;
	console.log(data.props)

	// intialize a variable for a div to hold the canvas
	let canvasDiv: number;
	//initialize the canvas
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let img: HTMLImageElement;
	let rect: DOMRect;
	let players: Player[] = [];
	let defensivePlayers: Player[] = [];
	let keysPressed = {};
	let originalFormations:string[] = [];
	let formationInput:string = ""
	let playInput:string = ""
	let ogColor:string = "black"
	let formationName:string = "";
	let playName:string = "";
	let chosenFront:string = "";
	let chosenCoverage:string = "";
	// intialize variables to hold the current player being edited
	let current_player: Player = null;
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
	let addingDefense: boolean = false;
	// initialize the tabs
	let tabs = [ 'Player-Editor', 'Ctrls', 'Search']
	let activeTabIndex = 1

	// selected values for when storing the play
	let name = '';
	let run_or_pass = '';
	let run = 'Run';
	let pass = 'Pass';
	let rpo = 'RPO';
	let long = 'Third and Long';
	let medium = 'Third and Medium';
	let short = 'Third and Short';
	let inches = 'Third and Inches';
	let extralong = 'Third and Extra-Long';
	let twobytwo = '2x2';
	let threebyone = '3x1';
	let quads = 'Quads';
	let ten = '10';
	let eleven = '11';
	let twelve = '12';
	let thirteen = '13';
	let twentone = '21';
	let twentytwo = '22';
	let twentythree = '23';
	let twenty = '20';
	let personnel = '';
	let formation = '';
	let shift = '';
	let concept = '';
	let numXnum = '';
	let down_dist = '';
	let answer = '';

	



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
		// // add an event listener to know when a is released
		// document.addEventListener('keydown', function (event) {
		// 	if (event.key == 'a') {
		// 		motion = true;
		// 	}
		// });
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
   		delete keysPressed[event.key]
	});
	console.log(data.props.user)
	console.log(data.props.plays)
	
});

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
			ogColor = currPlayer.color;
			if (currPlayer == editingPlayer) {
				currPlayer.color = 'gray';
			}
			// traverse the adjacency matrix
			currPlayer.adjmatrix.nodes.forEach((node) => {

				// draw the path between each node and it's adjacent nodes
				node.adjNodes.forEach((adjNode) => {
					// if the node is a bezier node, draw a bezier curve
					if (adjNode.data.cp && adjNode.data.cpx != null && adjNode.data.cpy != null) {
						if (currPlayer.adjmatrix.firstAdded == node) {
							// if the control point is within 80 vertical pixels of the player draw the start of the line from the side
							// of the player instead of the top
							if (adjNode.data.cpy - currPlayer.y < 80) {
								// if we are to the left of the node draw the line from the left side of the player
								if (adjNode.data.cpx - currPlayer.x < 0) {
									drawBezier(
										node.data.x,
										node.data.y,
										adjNode.data.x,
										adjNode.data.y,
										adjNode.data.cpx,
										adjNode.data.cpy,
										currPlayer.color
									);
								} else {
									// if we are to the right of the node draw the line from the right side of the player
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
							} else 
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
					if (editingPlayer == currPlayer) {
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
			if (currPlayer.progression != null) {
				drawProgression(currPlayer);
			}
			if (currPlayer == editingPlayer) {
				editingPlayer.color = ogColor
				ogColor = "black"
			}
		}
        // iterate through the players and add the ovals last
		players.forEach((currPlayer) => {
				drawOval(currPlayer.x, currPlayer.y, currPlayer.color, currPlayer);
		});
		
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
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, addingDefense); 
		} else if (magnetX) {
			n = new Node(magnetCoords.x, m.y, null, null, 'black', false, false, false, false);
			graph = new Graph<Node>(comparator, n);
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, addingDefense);
		} else if (magnetY) {
			n = new Node(m.x, magnetCoords.y, null, null, 'black', false, false, false, false);
			graph = new Graph<Node>(comparator, n);
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, addingDefense);
		} else {
			n = new Node(m.x, m.y, null, null, 'black', false, false, false, false);
			graph = new Graph<Node>(comparator, n);
			p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, addingDefense);
		}
		// create the graph
		// create a new player
		// add the player to the players array
		p.adjmatrix.addNewNode(n);
		players.push(p);
		// add a line segment to the player's path
		current_player = players[players.length - 1];
		currentNode = n;
		drawing = true;
		// change the tab to the player's tab
		activeTabIndex = 0

		editing = false;
		angleLock();
	}

	function handleclick() {
		// if the user is currently drawing
		let l;
		let n;
		let dashed = keysPressed["a"];
		console.log(dashed)
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
					current_player.color,
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
					current_player.color,
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
					let n = new Node(m.x, m.y, null, null, current_player.color, dashed, true, false, false);
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
					
					let n = new Node(m.x, m.y, null, null, current_player.color, dashed, false, false, false);
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
						const originalLocation = {x: node.data.x, y: node.data.y};
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
		// reset length
		length = 0;
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
			if (keysPressed['Shift']) {
				clearCanvas(ctx);
				if (current_player.adjmatrix.firstAdded.data == currentNode) {
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
		
		// if the user is currently drawing
		if (drawing) {
			// set current player's color to black if it is not null
			if (current_player != null) {
				current_player.color = ogColor;
			}
			// if the editing player is not null
			if (editingPlayer != null) {
				// set the editing player's color to black
				editingPlayer.color = ogColor
			}
			// set editing to false
			editing = false;
			// set drawing to false
                // set drawing to false
            drawing = false;
			// set the current player to null
			current_player = null;
			// set the current node to null
			currentNode = null;
			// set the editing player to null
			editingPlayer = null;
			// set the edit node to null
			editNode = null;
		}
		if (editing) {
			// set current player's color to black if it is not null
			// if editingplayer is not null
			if (editingPlayer != null) {
				// set the editing player's color to black
				editingPlayer.color = ogColor
			}
			// set editing to false
			editing = false;
			// set the current player to null
			current_player = null;
			// set the current node to null
			currentNode = null;
			// set the editing player to null
			editingPlayer = null;
			// set the edit node to null
			editNode = null;
		}
		// reset the ogColor value
		ogColor = "black"
		// reset the magnet values 
		typing = false
		// reset length
		length = 0;
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
			if (currPlayer != null && !currPlayer.defense) {
				if (currPlayer.position == 'C' || currPlayer.position == 'c'|| currPlayer.position == 'Center' || currPlayer.position == 'center') {
					if (players.length == 1) {
						let graph: Graph<Node>;
						// create the rest of the offensive line
						let i = new Node(currPlayer.x-250, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, i);
						let a = new Player(currPlayer.x-250 ,currPlayer.y,'Black', 'LT', 'route/job', graph, null, false)
						a.adjmatrix.addNewNode(i);
						players.push(a);

						let j = new Node(currPlayer.x-125, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, j);
					    let b = new Player(currPlayer.x-125 ,currPlayer.y,'Black', 'LG', 'route/job', graph, null, false)
						b.adjmatrix.addNewNode(j);
						players.push(b);

						let k = new Node(currPlayer.x+125, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, k);
						let c = new Player(currPlayer.x+125 ,currPlayer.y,'Black', 'RG', 'route/job', graph, null, false)
						c.adjmatrix.addNewNode(k);
						players.push(c);

						let m = new Node(currPlayer.x+250, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, m);
						let d = new Player(currPlayer.x+250 ,currPlayer.y,'Black', 'RT', 'route/job', graph, null, false)
						d.adjmatrix.addNewNode(m);
						players.push(d);
					}
					// make a hollow rectangle instead of an oval
					// fill the inside of the rectangle with the color white
					ctx.fillStyle = 'white';
					ctx.beginPath();
					ctx.rect(x1 - 40, y1 - 40, 80, 80);
					ctx.fill();
					// draw the rectangle
					ctx.fillStyle = color
					ctx.strokeStyle = color;
					ctx.lineWidth = 10;
					ctx.beginPath();
					ctx.rect(x1 - 40, y1 - 40, 80, 80);
					ctx.stroke();
				} else {
			// fill the inside of the oval with the color white
			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.ellipse(x1, y1, 40, 40, 0, 0, 2 * Math.PI);
			ctx.fill();
			// draw the oval
			ctx.fillStyle = color
			ctx.strokeStyle = color;
			ctx.lineWidth = 12;
			ctx.beginPath();
			ctx.ellipse(x1, y1, 40, 40, 0, 0, 2 * Math.PI);
			ctx.stroke();
				}
			} else if (players.length == 0 || currPlayer == null)  {
				ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.ellipse(x1, y1, 40, 40, 0, 0, 2 * Math.PI);
			ctx.fill();
			// draw the oval
			ctx.fillStyle = color
			ctx.strokeStyle = color;
			ctx.lineWidth = 12;
			ctx.beginPath();
			ctx.ellipse(x1, y1, 40, 40, 0, 0, 2 * Math.PI);
			ctx.stroke();
			}
			// if the player's position is not 'pos', null, or "" than draw the player's position
			// inside of the oval
			if (currPlayer != null) {
				if (currPlayer.position != 'pos' && currPlayer.position != null && currPlayer.position != '' && currPlayer.position != 'C' && currPlayer.position != 'c'
			&& currPlayer.position != 'LT' && currPlayer.position != 'LG' && currPlayer.position != 'RG' && currPlayer.position != 'RT' && currPlayer.position != 'Center' && currPlayer.position != 'center') {
				if (currPlayer.position.length > 1) {
                    ctx.font = "45px Georgia bold"
                } else {
				if (currPlayer.defense) {
					ctx.font = '80px Georgia bold';
				} else {
                ctx.font = '65px Georgia bold';
                }
			}
				ctx.fillStyle = color;
                if (currPlayer.position.length > 1) {
                    ctx.fillText(currPlayer.position, x1 - 30, y1 + 18);
                } else {
				ctx.fillText(currPlayer.position, x1 - 23, y1 + 18);
                }
			}
			// if the player's job isn't null or "" or 'route/job' than draw the player's job
			// below the oval
			if (currPlayer.job != null && currPlayer.job != '' && currPlayer.job != 'route/job') {
				ctx.font = '65px Georgia bold';
				ctx.fillStyle = 'blue';
				ctx.fillText(currPlayer.job, x1 - 62, y1 + 120);
				ctx.fillStyle = color;
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
						if (editingPlayer != null) {
							editingPlayer.color = ogColor;
						}
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
						if (editingPlayer != null) {
							editingPlayer.color = ogColor;
						}
						editingPlayer = currPlayer;
					}
				});
			});
		}
		// if success is false, then we didn't click on a line
		if (!success) {
			console.log(editingPlayer)
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
		if (editingPlayer != null) {
		players.splice(players.indexOf(editingPlayer), 1);
		//escape
		magnetX = false;
		magnetY = false;
		magnetCoords.x = m.x
		magnetCoords.y = m.y
		escape();
		
		}
	}

    // function to select and edit a player by clicking on their oval
    function selectPlayer(x: number, y: number) {
        let found = false;
        // traverse the players array
        for (let i = 0; i < players.length; i++) {
            // check the players x and y and see if our mouse is close to it
            if (Math.sqrt(Math.pow(players[i].x - x, 2) + Math.pow(players[i].y - y, 2)) < 75) {
				
                // set the editing player to the player we clicked on
				if (editingPlayer != null) {
							editingPlayer.color = ogColor;
							ogColor = "black"
							editingPlayer = players[i];
						} else {
							editingPlayer = players[i];
							ogColor = editingPlayer.color
							editingPlayer.color = "gray"
						}
				
				// change the tab to the editingPlayers tab
				activeTabIndex = 0
                // set found to true
                found = true;
                // break out of the loop
                break;
            }
        }
    }

    // if a player is selected then we want to display the players position below their oval
    function showName() {
        // check if the editing player is null
        if (editingPlayer != null) {
            // set the font
            ctx.font = "60px Helvetica";
            // set the color
            ctx.fillStyle = "black";
            // draw the text
            ctx.fillText(editingPlayer.position, editingPlayer.x -75, editingPlayer.y +70);
        }
    }
    // if we click on a player's name then we want to be able to edit it
	function userTyping () {
		typing = true
	}
	
	// a function to load the formation and draw it upon request
	async function loadFormation(formation, ctx, canvas, img, auth) {
		players = await drawFormation(formation, ctx, canvas, img, auth);
	}

	async function loadPlay(auth, name, db) {
		players = await getPlay(auth, name, db);
		// clear the canvas
		clearCanvas(ctx);
		// draw the players
		drawPlayers();
	}

	// function to draw the progression of a player
	function drawProgression(player:Player) {
		// we will draw the text of whatever the player's progression value is
		// we will place this 50 pixels vertically over the last node
		// set the font
		ctx.font = "75px Helvetica";
		// set the color
		ctx.fillStyle = "red";
		// draw the text
		// case where the player ends in a bezier curve
		if (player.adjmatrix.secondLastAdded.data.cp) {
			ctx.fillText(player.progression, player.adjmatrix.secondLastAdded.data.x - 80, player.adjmatrix.secondLastAdded.data.y - 70);
		} else {
		ctx.fillText(player.progression, player.adjmatrix.lastAdded.data.x - 80, player.adjmatrix.lastAdded.data.y - 70);
		}
	}
	async function debugDefense () {
	let form = new DefensiveFormation("3-4", "base", frontRules["42 Over G"])
	console.log(data.props.formations[0])
	let offForm = makeFormation(players, "testing")
	defensivePlayers = getDefensivePlayers(form, offForm)
	players = players.concat(defensivePlayers)
	// clear the canvas
	clearCanvas(ctx);
	// draw the players
	drawPlayers();
	} 
	function clearPlay () {
		players = []
		// reset all the variables
		editingPlayer = null
		editNode = null
		currentNode = null
		current_player = null
		// clear the canvas
		clearCanvas(ctx);
		// draw the players
		drawPlayers();
	}

	function changeColor (color) {
		if (editingPlayer != null) {
			editingPlayer.color = color
			editingPlayer = null
			current_player = null
			editing = false
			drawing = false
			clearCanvas(ctx);
			drawPlayers();
		}
	}
    
	
</script>

<div class=" flex "
bind:clientWidth={canvasDiv}
>
<!-- a side bar to display some text content -->
	<div class="h-screen  mx-auto bg-gradient-to-r from-white to-gray-100 rounded-b-xl border-r-4 border-slate-800 z-50">
		<div class="tabs w-96 justify-center">
			{#each tabs as tab, index}
			  <!-- svelte-ignore a11y-click-events-have-key-events -->
			  <!-- svelte-ignore a11y-missing-attribute -->
			  <a
				class="tab tab-lg tab-bordered" class:tab-active={activeTabIndex == index}
				on:click={()=>activeTabIndex = index}
			  >
				{tab}
			  </a>
			{/each}
		  </div>
		  
		  
		  
		  {#if activeTabIndex == 1}
				<!-- a visual description of the keys' i.e controls of drawing on the canvas -->
				<!-- a div with 10 rows of content that is centered in the tab -->
				<div class="flex flex-col items-center">
					<h1 class="text-3xl font-bold text-center my-5 text-transparent bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text">Controls</h1>
					<div class="flex flex-col items-center">
						<div class = "">
						<kbd class="kbd">shift</kbd>
						+
						<kbd class="kbd">click</kbd>
						=
						Add Player	 </div>
						<div>
							<h2 class="text-3xl font-bold text-center my-5 text-transparent bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text">Drawing</h2>
							
							<kbd class="kbd">shift</kbd>
							=
							Angle-Lock 
						</div>		
						<div class = my-5>							
							<kbd class="kbd">d</kbd>
							+
							<kbd class="kbd">click</kbd>
							=
							Start making a curve 
						</div>		
						<div>							
							<kbd class="kbd">dbl-click</kbd>
							=
							Draw line with a arrow 
						</div>
						<div class = "my-5">						
							<kbd class="kbd">a</kbd>
							=
							Make Dashed-Line 
						</div>						
						<h2 class="text-3xl font-bold text-center text-transparent bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text">Editing</h2>
						<div class = "my-5">
						<kbd class="kbd">s</kbd>
							+
							<kbd class="kbd">click on node</kbd>
							=
							Add Option 
						</div>
						<div>							
							<kbd class="kbd">hold-click on node</kbd>
							=
							Drag Node
						</div>
						<div>						
							<kbd class="kbd my-5">delete</kbd>
							=
							Delete player
						</div>

					</div>
				</div>
		  {/if}
		  
		  {#if activeTabIndex == 0}
			<div>
				<div class="flex flex-col items-center">
					<h1 class="text-3xl font-bold text-center my-5">Player Editor</h1>
					{#if editingPlayer != null}
					<div class="flex flex-col items-center">
						<h2 class="text-xl font-bold text-center my-5">Position</h2>
						<input type="text" class="border-2 border-black rounded-md" bind:value={editingPlayer.position}
						on:click={userTyping}
						 />
					</div>
					<div class="flex flex-col items-center">
						<h2 class="text-xl font-bold text-center my-5">Route/Job Notes</h2>
						<input type="text" class="border-2 border-black rounded-md" bind:value={editingPlayer.job}
						on:click={userTyping} />
					</div>
					<div class="flex flex-col items-center">
						<h2 class="text-xl font-bold text-center my-5">Alert/Read Progression</h2>
						<input type="text" class="border-2 border-black rounded-md" bind:value={editingPlayer.progression} />
					</div>
					<div class="flex flex-col items-center">
						<h2 class="text-xl font-bold text-center my-5">Player Color</h2>
						<!-- a row of 4 colors for a user to click on -->
						<div class="flex flex-row">
							<div class="flex flex-row items-center gap-x-4">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="w-10 h-10 rounded-full bg-red-500" on:click={() => changeColor("red")}></div>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="w-10 h-10 rounded-full bg-blue-500" on:click={() => changeColor("blue")}></div>
							
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="w-10 h-10 rounded-full bg-green-500" on:click={() => changeColor("green")}></div>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="w-10 h-10 rounded-full bg-black" on:click={() => changeColor("black")}></div>
							</div>
					</div>
					</div>
					<h2 class="text-xl font-bold text-center my-5">Select a player to edit</h2>
					
					<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-5" on:click={addPlayer}>Add Player</button>
					<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-5" on:click={deletePlayer}>Delete Player</button>
					{:else}
					<h2 class="text-xl font-bold text-center my-5">Select a player to edit</h2>
					{/if}
				</div>
			</div>
		  {/if}
		  
		  {#if activeTabIndex == 2}
		  <div>
			<div class="flex flex-col items-center">
				<h1 class="text-3xl font-bold text-center my-5">Search By</h1>
				<div class="flex flex-col items-center">
					<h2 class="text-xl font-bold text-center my-2">Formations</h2>					
					<input type="text" placeholder="Formation" class="input input-bordered input-secondary w-full max-w-s" bind:value={formationInput}
					on:click={userTyping}
					>
					{#if formationInput != null && formationInput != "" && data.props.formations != null}
					<ul class="p-2 bg-gray-200 rounded-b w-full max-h-32 max-w-xs text-center">				
						{#each data.props.formations as formation}
						<!-- svelte-ignore a11y-missing-attribute -->
						<li><a class = "text-black font-bold hover:cursor-pointer hover:text-gray-600 text-center" on:click={() => loadFormation(formation, ctx, canvas, img, data.props.user.uid)}>{formation}</a></li>
						{/each}
					</ul>
					{/if}
					
				</div>
				<div class="flex flex-col items-center">
					<h2 class="text-xl font-bold text-center my-5">Play Name</h2>
					<input type="text" placeholder="Formation" class="input input-bordered input-secondary w-full max-w-s" bind:value={playInput}
					on:click={userTyping}
					>
					{#if playInput != null && playInput != "" && data.props.plays != null}
					<ul class="p-2 bg-gray-200 rounded-b w-full max-h-32 max-w-xs overflow-y-auto text-center">				
						{#each data.props.plays as play}
						<!-- svelte-ignore a11y-missing-attribute -->
						<li><a class = "text-black font-bold hover:text-gray-600 text-center hover:cursor-pointer"  on:click={() => loadPlay(data.props.user.uid, play, db)}>{play}</a></li>
						{/each}
					</ul>
					{/if}
				</div>
				<div class="flex flex-col items-center">
					<h2 class="text-xl font-bold text-center my-5">Auto Align D-Front</h2>
					<input type="text" placeholder="Choose Front" class="input input-bordered input-secondary w-full max-w-s" bind:value={chosenFront}
					on:click={userTyping}
					>
					{#if chosenFront != null && chosenFront != ""}
					<ul class="p-2 bg-gray-200 rounded-b w-full max-h-32 max-w-xs overflow-y-auto text-center">				
						{#each data.props.plays as front}
						<!-- svelte-ignore a11y-missing-attribute -->
						<li><a class = "text-black font-bold hover:text-gray-600 text-center hover:cursor-pointer"  on:click={() => console.log("hello")}>{front}</a></li>
						{/each}
					</ul>
					{/if}
				</div>
				
				
				
				<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-5" on:click={() => debugDefense()}>Auto Align 42 Over G</button>

			</div>
		</div>
			 
		  {/if}
		  </div>
	
	<div class = "relative grid justify-center w-full z-0 overflow-x-auto">	
	<canvas
		bind:this={canvas}
		on:mousemove={handleMousemove}
		on:dblclick={handleDoubleClick}
		on:mousedown={handleclick}
		on:mousemove={showProjection}
		width="2600"
		height="2600"
		style="width:750px; height:615px;"
		class="mx-auto justify-center mt-2"
		id="canvas"
	/>
    <!-- a control center that is aligned horizontally below the canvas, below it -->
	<div class="card w-full bg-base-300 text-neutral-content mb-4 h-36 overflow-x-auto">
		<div class="card-body items-center text-center">
		  <div class="flex flex-row">
			<div class="flex flex-row items-center gap-12">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<btn class = "btn bg-red-500 text-white" on:click={() => clearPlay()}>Clear</btn>
				<label for="my-modal-4" class="btn bg-indigo-700">Save Formation</label>
				<label for="my-modal-5" class="btn bg-indigo-700">Save Play</label>
				<btn class = "btn bg-green-600 text-white">Add to a install or group?</btn>

			</div>
		</div>
		</div>
	  </div>

</div>
</div>
<!-- show the user the mouses coordinates -->
<div class="mx-auto justify-center my-10">
	<p>Mouse coordinates: {m.x}, {m.y}</p>
</div>

<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
	<div class="flex flex-col items-center">
		<h2 class="text-2xl font-bold text-center my-2">Formation Name</h2>
		<input type="text" class="input input-primary" bind:value={formationName}
		on:click={userTyping} />
	</div>
	<div class="modal-action">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label for="my-modal-4" class="btn btn-indigo-700 text-white" on:click={() => storeFormation(players, formationName, data.props.user.uid, db)}>Submit</label>
	  </div>
   </label>
</label>
<input type="checkbox" id="my-modal-5" class="modal-toggle" />
<label for="my-modal-5" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
	<div class="flex flex-col items-center">
		<h2 class="text-2xl font-bold text-center my-2">Play Name</h2>
		<input type="text" class="input input-secondary" placeholder="Play" bind:value={playName}
		on:click={userTyping} />
		{#if playName != null && playName != ""}
		<h2 class="text-xl font-semibold text-center my-2">Formation Name</h2>
		<input type="text" class="input input-secondary" placeholder= "Formation" bind:value={formationName}
		on:click={userTyping} />
		<h2 class = "text-m text-center">note: leaving blank will negate filterable features</h2>
		<div class = "grid grid-col-1 w-full gap-y-2 ">
		<select
					class="select select-secondary w-full"
					bind:value={down_dist}
					on:change|preventDefault={() => (answer = '')}
				>
					<option value="" selected data-default disabled>Third-Down Preference</option>
					<option>{inches}</option>
					<option>{short}</option>
					<option>{medium}</option>
					<option>{long}</option>
					<option>{extralong}</option>
				</select>
				<select
					class="select select-secondary w-full col-span-1 text-l font-bold text-slate-800"
					bind:value={personnel}
					on:change|preventDefault={() => (answer = '')}
				>
					<option value="" selected data-default disabled>personnel</option>
					<option>{ten}</option>
					<option>{eleven}</option>
					<option>{twelve}</option>
					<option>{thirteen}</option>
					<option>{twenty}</option>
					<option>{twentone}</option>
					<option>{twentytwo}</option>
					<option>{twentythree}</option>
				</select>
				<select
					class="select select-secondary w-full col-span-1 text-l font-bold text-slate-800"
					bind:value={numXnum}
					on:change|preventDefault={() => (answer = '')}
				>
					<option value="" selected data-default disabled>Skill Alignment</option>
					<option>{twobytwo}</option>
					<option>{threebyone}</option>
					<option>{quads}</option>
				</select>
				<select
					class="select select-secondary w-full col-span-1 text-l font-bold text-slate-800"
					bind:value={run_or_pass}
					on:change|preventDefault={() => (answer = '')}
				>
					<option value="" selected data-default disabled>Run or Pass</option>
					<option>{run}</option>
					<option>{pass}</option>
					<option>{rpo}</option>
				</select>
		</div>
		{/if}
	</div>
	<div class="modal-action">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label for="my-modal-5" class="btn btn-indigo-700 text-white" on:click={() => storePlay(db, data.props.user.uid, playName, players, formationName,run_or_pass, personnel, numXnum, down_dist)}
			>Submit</label>
	  </div>
   </label>
</label>