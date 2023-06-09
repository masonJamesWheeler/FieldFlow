<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Team, Formation, Player, Route, Route_Node, Play} from "../../utils/objects"
	import type {PageData} from '$lib/types';
	import { db } from '../../lib/firebase';
 
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
	let keysPressed = [];
	let players: Player[] = []
	let formation: Formation = new Formation(null, null, null, null)
	let play: Play = new Play(null, null,"", null)
	let team = new Team(players, formation, play)

	
	

	


	// store the mouse position
	let m = { x: 0, y: 0 };
	// store magnets coords
	let magnetCoords = {x: 0, y: 0, connectx: 0, connecty: 0};
	// function to log the mouse position when clicked inside the canvas
	function handleMousemove(event: { clientX: number; clientY: number }) {
		rect = canvas.getBoundingClientRect();
		(m.x = (event.clientX - rect.left) * (canvas.width / rect.width)),
			(m.y = (event.clientY - rect.top) * (canvas.height / rect.height));
		
	
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

		// add an event listener to the canvas to log the mouse position
		canvas.addEventListener('mousemove', handleMousemove);
		// add an event listener to add keys pressed to the keysPressed array
		window.addEventListener('keydown', (e) => {
			keysPressed.push(e.key);
		});
		// add an event listener to remove keys released from the keysPressed array
		window.addEventListener('keyup', (e) => {
			keysPressed = keysPressed.filter((key) => key !== e.key);
		});
});

// if shift key is pressed and user clicks on the canvas then add a player to the field
function addPlayer() {
	if (keysPressed.includes('Shift')) {
		let newNode = new Route_Node(m.x, m.y, null, [])
		let newRoute = new Route(null, null, null)
		newRoute.setFirstNode(newNode)
		let newPlayer = new Player("N/A", "N/A", newRoute)
		team.addPlayer(newPlayer)
	}
}

// function to draw the players on the team
function drawPlayers() {
	// iterate through the players on the team
	for (let i = 0; i < team.numPlayers(); i++) {
		let currPlayer = team.players[i]
		// if the player has a route then draw the route
		if (currPlayer.route != null) {
			drawRoute(currPlayer.route.getFirstNode())
		}
	}
}
// helper function to draw a route, recursively
function drawRoute(node: Route_Node) {
	// if the node has a next node then draw a line from the current node to the next node
	if (node.getConnectedNodes().length > 0) {
		for (let i = 0; i < node.getConnectedNodes().length; i++) {
			let nextNode = node.getConnectedNodes()[i]
			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(node.x, node.y);
				ctx.lineTo(nextNode.x, nextNode.y);
				ctx.stroke();
				drawRoute(nextNode)
			}
		}
	}
}

		

</script>

<div class= " flex-col w-full h-screen">

	<canvas
		bind:this={canvas}
		
		width="2600"
		height="2600"
		style="width:750px; height:615px;"
		class="mx-auto justify-center mt-2"
		id="canvas"
	/>

<!-- show the user the mouses coordinates -->
<div class="mx-auto justify-center my-10">
	<p>Mouse coordinates: {m.x}, {m.y}</p>
</div>

</div>

