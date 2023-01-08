// need to complete later
import {Graph} from "./adjMatrix"
import {Graph as graphType} from "./adjMatrix"
import {Formation, Node} from "./objects"
import {Player} from "./objects"
import { getFormation } from "./stores"
import {db} from "../lib/firebase"
// function to draw a line between two points
// function to draw a straight line between two points

// constantly update the
export function drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    dashed: boolean,
    ctx
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

// function draw arrowhead
// draw an arrowhead at the end of a line segment
	export function drawArrowhead(x1:number, y1:number, x2:number, y2:number, color:string, ctx:CanvasRenderingContext2D) {
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
	export function drawBlocking(x1:number, y1:number, x2:number, y2:number, color:string, ctx:CanvasRenderingContext2D) {
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
	export function drawBezier(x1:number, y1:number, x2:number, y2:number, cx:number, cy:number, color:string, ctx:CanvasRenderingContext2D) {
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.bezierCurveTo(cx, cy, cx, cy, x2, y2);
		ctx.stroke();
	}

	//function to draw an oval when the mouse is clicked on the canvas
	export function drawOval(x1:number, y1:number, color:string, currPlayer:Player, ctx:CanvasRenderingContext2D, players:Player[]) {
		if (ctx != null) {
			if (currPlayer != null) {
				if (currPlayer.position == 'C' || currPlayer.position == 'c') {
					if (players.length == 1) {
						let graph: Graph<Node>;
						// create the rest of the offensive line
						
						let i = new Node(currPlayer.x-250, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, i);
						let a = new Player(currPlayer.x-250 ,currPlayer.y,'Black', 'LT', 'route/job', graph, null, true)
						a.adjmatrix.addNewNode(i);
						players.push(a);

						let j = new Node(currPlayer.x-125, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, j);
					    let b = new Player(currPlayer.x-125 ,currPlayer.y,'Black', 'LG', 'route/job', graph, null, true)
						b.adjmatrix.addNewNode(j);
						players.push(b);

						let k = new Node(currPlayer.x+125, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, k);
						let c = new Player(currPlayer.x+125 ,currPlayer.y,'Black', 'RG', 'route/job', graph, null, true)
						c.adjmatrix.addNewNode(k);
						players.push(c);

						let m = new Node(currPlayer.x+250, currPlayer.y, null, null, 'black', false, false, false, false);						
						graph = new Graph<Node>(comparator, m);
						let d = new Player(currPlayer.x+250 ,currPlayer.y,'Black', 'RT', 'route/job', graph, null, true)
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
			// if the player's position is not 'pos', null, or "" than draw the player's position
			// inside of the oval
			if (currPlayer != null) {
				if (currPlayer.position != 'pos' && currPlayer.position != null && currPlayer.position != '' && currPlayer.position != 'C' && currPlayer.position != 'c'
			&& currPlayer.position != 'LT' && currPlayer.position != 'LG' && currPlayer.position != 'RG' && currPlayer.position != 'RT') {
				if (currPlayer.position.length > 1) {
                    ctx.font = "45px Georgia bold"
                } else {
                ctx.font = '65px Georgia bold';
                }
				ctx.fillStyle = 'black';
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
				ctx.fillStyle = 'black';
			}
		}
		}
	}


	// // function to draw a node at the end of a line segment
	export function drawNode(x:number, y:number, color:string, ctx:CanvasRenderingContext2D) {
		// set the color of the node
		ctx.fillStyle = color;
		// draw the node
		ctx.beginPath();
		ctx.arc(x, y, 15, 0, 2 * Math.PI);
		ctx.fill();
	}
	// function to draw all the nodes of a player
	export function drawNodes(player:Player, ctx:CanvasRenderingContext2D, ) {
		// traverse the adjacency matrix
		player.adjmatrix.nodes.forEach((node) => {
			// check that the node is not the first node
			if (node != player.adjmatrix.firstAdded) {
				// draw the node
				drawNode(node.data.x, node.data.y, node.data.color, ctx);
			}
		});
	}

	// function to use as a comparator
	export function comparator(a: Node, b: Node) {
		return null;
	}

	// function to check if we're clicking near a line and returns the given line
	export function checkLine(x: number, y: number, players: Player[], editingPlayer: Player,ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, current_player:Player, img:HTMLImageElement, currentNode:Node, drawing:boolean, editing:boolean, m2, editNode:Node, typing:boolean, magnetX:boolean, magnetY:boolean, magnetCoords) {
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
			escape(players, editingPlayer, ctx, current_player, currentNode, drawing, editing, m2, editNode, typing, canvas, magnetX, magnetY, magnetCoords, img);
			// clear canvas
			clearCanvas(ctx, canvas, img);
			// redraw the players
			drawPlayers(players, ctx, canvas, img, current_player, currentNode, drawing, editing, m2, editNode, typing, magnetX, magnetY, magnetCoords, editingPlayer);
		}
	}

	//function to delete a player
	export function deletePlayer(players:Player[], editingPlayer:Player, ctx:CanvasRenderingContext2D, current_player:Player, currentNode:Node, drawing:boolean, editing:boolean, m2, editNode:Node, typing:boolean, canvas:HTMLCanvasElement, magnetX:boolean, magnetY:boolean, magnetCoords, img:HTMLImageElement) {
		// remove the player from the players array
		players.splice(players.indexOf(editingPlayer), 1);
		//escape
		escape(players, editingPlayer, ctx, current_player, currentNode, drawing, editing, m2, editNode, typing, canvas, magnetX, magnetY, magnetCoords, img);
		
		
	}

    // function to select and edit a player by clicking on their oval
    export function selectPlayer(x: number, y: number, editingPlayer:Player, players:Player[]) {
        let found = false;
        // traverse the players array
        for (let i = 0; i < players.length; i++) {
            // check the players x and y and see if our mouse is close to it
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
// function to add a player and start creating their path
export function addPlayer(magnetX:boolean
    , magnetY:boolean, magnetCoords, m, players:Player[], editingPlayer:Player, ctx:CanvasRenderingContext2D, current_player:Player, currentNode:Node, drawing:boolean, editing:boolean, m2, defense:boolean) {
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
        p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, defense); 
    } else if (magnetX) {
        n = new Node(magnetCoords.x, m.y, null, null, 'black', false, false, false, defense);
        graph = new Graph<Node>(comparator, n);
        p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, defense);
    } else if (magnetY) {
        n = new Node(m.x, magnetCoords.y, null, null, 'black', false, false, false, defense);
        graph = new Graph<Node>(comparator, n);
        p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, defense);
    } else {
        n = new Node(m.x, m.y, null, null, 'black', false, false, false, defense);
        graph = new Graph<Node>(comparator, n);
        p = new Player(m.x, m.y, 'black', 'pos', 'route/job', graph, null, defense);
    }
    // create the graph
    // create a new player
    // add the player to the players array
    players.push(p);
    // add a line segment to the player's path
    current_player = players[players.length - 1];
    currentNode = n;
    p.adjmatrix.addNewNode(n);
    drawing = true;
    editing = false;
    angleLock(drawing, m, m2, currentNode, length, ctx, current_player);
}

    // function to only show multiple angles of 15 degrees from the projected line
	// i.e angle-lock when we are holding in the shift key
export function angleLock(drawing:boolean, m, m2, currentNode:Node, length:number, ctx:CanvasRenderingContext2D, current_player:Player) {
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

    // function to escape currently drawing a player's path
export function escape(players:Player[], editingPlayer:Player, ctx:CanvasRenderingContext2D, current_player:Player, currentNode:Node, drawing:boolean, editing:boolean, m2, editNode:Node, typing:boolean, canvas:HTMLCanvasElement, magnetX:boolean, magnetY:boolean, magnetCoords, img:HTMLImageElement) {
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
			// set the current node to null
			currentNode = null;
			// set the editing player to null
			editingPlayer = null;
			// set the edit node to null
			editNode = null;
		}
		typing = false
		// clear the canvas
		clearCanvas(ctx, canvas, img);
		// draw the player's path
		drawPlayers(players, ctx, canvas, img, current_player, currentNode, drawing, editing, m2, editNode, typing, magnetX, magnetY, magnetCoords, editingPlayer);
		console.log(players)
	}

	// function to clear the canvas and replace it with just the background
	export function clearCanvas(ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, img:HTMLImageElement) {
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


// function to draw the players on the canvas by traversing the adjacnecy matrix and drawing the path
	// between each node and it's adjacent nodes
	export function drawPlayers(players:Player[], ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, img:HTMLImageElement, current_player:Player, currentNode:Node, drawing:boolean, editing:boolean, m2, editNode:Node, typing:boolean, magnetX:boolean, magnetY:boolean, magnetCoord, editingPlayer:Player ) {
			// draw the players
			for (let i = 0; i < players.length; i++) {
				let currPlayer = players[i];
				// draw a oval at the player's position
				if (currPlayer.adjmatrix.firstAdded != null) {
					currPlayer.x = currPlayer.adjmatrix.firstAdded.data.x;
					currPlayer.y = currPlayer.adjmatrix.firstAdded.data.y;
				}
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
											currPlayer.color, ctx
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
											currPlayer.color, ctx
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
									currPlayer.color, ctx
								);
							} else {
							drawBezier(
								node.data.x,
								node.data.y,
								adjNode.data.x,
								adjNode.data.y,
								adjNode.data.cpx,
								adjNode.data.cpy,
								currPlayer.color, ctx
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
									adjNode.data.dashed, ctx
								);
									} else {
										// draw a bezier curve from the node to the adj node
										drawLine(
									node.data.x-45,
									node.data.y,
									adjNode.data.x,
									adjNode.data.y,
									currPlayer.color,
									adjNode.data.dashed, ctx
								);
									}
								} else {
								drawLine(
									node.data.x,
									node.data.y-45,
									adjNode.data.x,
									adjNode.data.y,
									currPlayer.color,
									adjNode.data.dashed, ctx
								);
							} 
						}else {
							drawLine(
								node.data.x,
								node.data.y,
								adjNode.data.x,
								adjNode.data.y,
								currPlayer.color,
								adjNode.data.dashed,ctx
							);
						}
					}
						// if the player is the current player, draw the nodes and control points
						if (editingPlayer == currPlayer) {
							// and it isn't the first node
							drawNodes(currPlayer, ctx);
							drawNode(currPlayer.x, currPlayer.y, currPlayer.color, ctx);
						}
						if (adjNode.data.arrow) {
							if (adjNode.data.cp) {
								drawArrowhead(
									adjNode.data.cpx,
									adjNode.data.cpy,
									adjNode.data.x,
									adjNode.data.y,
									currPlayer.color,
									ctx
								);
							} else {
								drawArrowhead(
									node.data.x,
									node.data.y,
									adjNode.data.x,
									adjNode.data.y,
									currPlayer.color,
									 ctx
								);
							}
						} else if (adjNode.data.blocking) {
							if (adjNode.data.cp) {
								drawBlocking(
									adjNode.data.cpx,
									adjNode.data.cpy,
									adjNode.data.x,
									adjNode.data.y,
									currPlayer.color,
									ctx
								);
							} else {
								drawBlocking(
									node.data.x,
									node.data.y,
									adjNode.data.x,
									adjNode.data.y,
									currPlayer.color,
									ctx
								);
							}
						}
					});
				});
				if (currPlayer.progression != null) {
					drawProgression(currPlayer, ctx);
				}
			}
			// iterate through the players and add the ovals last
			players.forEach((currPlayer) => {
					drawOval(currPlayer.x, currPlayer.y, currPlayer.color, currPlayer,ctx, players);
			});
			
		}
	

    // a function to draw the formation of a given Formation object
    export async function drawFormation(formation:string, ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, img:HTMLImageElement, auth:string) {
        let players = await getFormation(db, auth, formation); 
        drawPlayers(players, ctx, canvas, img, null,null, false, false, null, null, false, false, false, null, null);
		// once players is no longer a promise then return the players
		return players;
    }

	// function to draw the progression of a player
	function drawProgression(player:Player, ctx:CanvasRenderingContext2D) {
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

    // a function to make a formation from the given Player objects in the players array
    export function makeFormation(players:Player[], name:string) {
        let formation = new Formation(null,null,null,null,null,null,null,null,null,null,null,null,name, []);
        // make sure that there is 11 players
        if (players.length != 11) {
            console.log("Error: there are not 11 players in the formation");
    } else {
        // make a new formation object
        // iterate through the players array
        // searching for each position
        
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.position == "Qb" || player.position == "QB" || player.position == "qb" || player.position == "Q" || player.position == "q") {
                formation.qb = player;
                // else if the player is a Center
            } else if (player.position == "C" || player.position == "c") {
                formation.c = player;
            } else if (player.position == "Lt" || player.position == "LT" || player.position == "lt") {
                if (formation.lt == null) {
                    formation.lt = player;
                }
            } else if (player.position == "Lg" || player.position == "LG" || player.position == "lg") {
                formation.lg = player;
            } else if (player.position == "Rg" || player.position == "RG" || player.position == "rg") {
                formation.rg = player;
            } else if (player.position == "Rt" || player.position == "RT" || player.position == "rt") {
                formation.rt = player;
            } // now iterate through the skill players to fill the skill positions
            else {
                if (formation.skill1 == null) {
                    formation.skill1 = player;
                } else if (formation.skill2 == null) {
                    formation.skill2 = player;
                }
                else if (formation.skill3 == null) {
                    formation.skill3 = player;
                }
                else if (formation.skill4 == null) {
                    formation.skill4 = player;
                }
                else if (formation.skill5 == null) {
                    formation.skill5 = player;
                }
            }

        }
    }
    if (formation.qb == null || formation.c == null || formation.lt == null || formation.lg == null || formation.rg == null || formation.rt == null || formation.skill1 == null || formation.skill2 == null || formation.skill3 == null || formation.skill4 == null || formation.skill5 == null) {
        console.log("Error: there is a missing player in the formation");
        return null;
    }
    return formation;
    }

	export function showProjection(players:Player[], ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, img:HTMLImageElement, drawing:boolean, keysPressed, current_player:Player, currentNode:Node, m, m2, length:number, editingPlayer:Player, editing:boolean, editNode:Node, typing:boolean, magnetX:boolean, magnetY:boolean, magnetCoords) {
		// if the user is currently drawing
		if (drawing) {
			if (keysPressed['Shift']) {
				clearCanvas(ctx, canvas, img);
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
								keysPressed['a'], ctx
							);
						} else {
							drawLine(
								currentNode.x - 45,
								currentNode.y,
								currentNode.x + m2.x * length,
								currentNode.y + m2.y * length,
								'black',
								keysPressed['a'], ctx
							);
						}
					} else {
						drawLine(
							currentNode.x,
							currentNode.y - 45,
							currentNode.x + m2.x * length,
							currentNode.y + m2.y * length,
							'black',
							keysPressed['a'], ctx
						);
					}
				 } else {
				drawLine(
					currentNode.x,
					currentNode.y,
					currentNode.x + m2.x * length,
					currentNode.y + m2.y * length,
					'black',
					keysPressed['a'], ctx
				);
					}
					drawPlayers(players, ctx, canvas, img, current_player, currentNode, drawing, editing, m2, editNode, typing, magnetX, magnetY, magnetCoords, editingPlayer);
			} else {
				clearCanvas(ctx, canvas, img);
				if (currentNode.cp && currentNode.cpx == null) {
					if (current_player.adjmatrix.secondLastAdded == current_player.adjmatrix.firstAdded) {
						drawBezier(
						current_player.adjmatrix.secondLastAdded.data.x,
						current_player.adjmatrix.secondLastAdded.data.y-45,
						currentNode.x,
						currentNode.y,
						m.x,
						m.y,
						'black', ctx
						);
						} else {
					drawBezier(
						current_player.adjmatrix.secondLastAdded.data.x,
						current_player.adjmatrix.secondLastAdded.data.y,
						currentNode.x,
						currentNode.y,
						m.x,
						m.y,
						'black', ctx
					);
						}
						drawPlayers(players, ctx, canvas, img, current_player, currentNode, drawing, editing, m2, editNode, typing, magnetX, magnetY, magnetCoords, editingPlayer);
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
								keysPressed['a'], ctx
							);
						} else {
							drawLine(
								currentNode.x - 45,
								currentNode.y,
								m.x,
								m.y,
								'black',
								keysPressed['a'], ctx
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
							keysPressed['a'], ctx
						);
					  }
					 } else {
					// draw a straight line between the current node and the mouse
					// the current node is currentNode
					drawLine(currentNode.x, currentNode.y, m.x, m.y, 'black', keysPressed['a'], ctx);
					}
					// then draw the players
					drawPlayers(players, ctx, canvas, img, current_player, currentNode, drawing, editing, m2, editNode, typing, magnetX, magnetY, magnetCoords, editingPlayer);
				}
			}
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

// a function that takes in a players array and then draws them on a canvas
// purpose is to create an Html element so that we can convert it to a power 
