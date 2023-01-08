<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageLoad } from './$types';
	import { storeFormation, storePlay, getPlay, getFormation, search,storeInstall } from '../../utils/stores';
	import playCard from '../../components/playCard.svelte';
	import type {Player, Formation, Install} from "../../utils/objects"
	import PptxGenJS from 'pptxgenjs';
	import PlayCard from '../../components/playCard.svelte';
	import { db } from '../../lib/firebase';
	export let data: PageLoad;
	let allPlays = [];
	let installPlays = new Map();
	let installPlaysArray = [];
	let installFormations = new Map;
	let installFormationArray = [];
	let searchedPlays = [];
	let searchedFormations = [];
	let searchedPlay = '';
	let searchedFormation = '';
	let installName = '';
	let scriptNotify = true;
    let numberpasses = 0
    let numberruns = 0;
	let formations = new Map();
	let progress = {
		installName: "",
		plays: "",
		templates: "",
		publish: "",
	}
	let canvas;
	let ctx;
	let players = []
	let img:HTMLImageElement
	

	// onMount load all of the plays into the allPlays array
	onMount(async () => {	
		allPlays = data.props.plays;
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
	});

	// change the searched plays
	function changeSearchPlays(searchedName, array) {
		searchedPlays = search(searchedName, array);
		console.log(searchedPlays);
	}
	// change the searched formations
	function changeSearchFormations(searchedName, array) {
		searchedFormations = search(searchedName, array);
	}
	// function to add a clicked play to the installPlays
	function addPlay(play) {
		if (play.run_pass == "Pass" && installPlays.has(play) == false) {
            numberpasses = numberpasses + 1
        } else if (play.run_pass == "Run" && installPlays.has(play) == false) {
            numberruns = numberruns + 1
        }
		installPlays.set(play, 1);
		formations.set(play.formation.toLowerCase(), 1);
		formations = formations;
        installPlays = installPlays
		installPlaysArray = Array.from(installPlays.keys());
		changeProgress()
		searchedPlay = '';
		searchedFormation = '';
	}
	// function to add a clicked formation to the scriptFormations
	function addFormation(formation) {
		installFormations.set(formation, 1);
		installFormationArray = Array.from(installFormations.keys());
		changeProgress()
		searchedFormation = '';
		searchedPlay = '';
	}
    // a function to change the progress of the install
	function changeProgress() {
		if (installName != null && installName != '') {
			progress.installName = "step-secondary"
		}
		if (installPlays.size > 0) {
			progress.plays = "step-secondary"
		}
		if (installFormations.size > 0) {
			progress.templates = "step-secondary"
		}
		if (installName != null && installName != '' && installPlays.size > 0 && installFormations.size > 0) {
			progress.publish = "step-secondary"
		}
	}

	// a function to publish the install to the database
	async function publishInstall(name, plays, formations) {
		// create the install
		let install = await createInstall(name, plays, formations);
		// save the install to the database
		await storeInstall(install, data.props.user.uid, db);
		// save the install to a pptx
		savePPTX(installPlaysArray, installFormationArray);
	}

	// function to create an Install from the following name, plays, formation, and time
	async function createInstall(name, plays, formations) {
		// get the current time
		let date =  await (new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear());
		let install: Install = {
			name: name,
			plays: plays,
			formations: formations,
			timeStamp: date,
		}
		return await install
	}

	// function to save every play in the install into a PowerPoint Presentation pptx
	function savePPTX(plays, formations) {
		if (installPlays.size < 1) {
			// throw error
			throw new Error("No Plays in Install");
		} else {
		// create a new pptx
		var pptx = new PptxGenJS();
		// loop through every play in the install
		plays.forEach((play) => {
			players = play.players
			// the url for the given play
			let url = drawPDF()
			// create a new slide
			var slide = pptx.addSlide();
			// add the play name to the slide
			slide.addText(play.name, { x: 0, y: 0, w: 10, h: 1, align: 'center', fontSize: 24 });
			// add the play formation to the slide
			// add the play image to the slide
			slide.addImage({ path: url, x: 2, y: 0.82, w: 6, h: 4.8 });
		});
		// save the pptx
		pptx.writeFile();
	}
}

	// function drawPDF draws the play on the canvas and then exports the data as a url
	function drawPDF() {
		// clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// draw the background image
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		// draw the players
		drawPlayers();
		// return the data url
		return canvas.toDataURL();
	}

	function drawPlayers() {
		// draw the players
		for (let i = 0; i < players.length; i++) {
			let currPlayer = players[i];
			// draw a oval at the player's position
			if (currPlayer.adjmatrix.firstAdded != null) {
				currPlayer.x = currPlayer.adjmatrix.firstAdded.data.x;
				currPlayer.y = currPlayer.adjmatrix.firstAdded.data.y;
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
		}
        // iterate through the players and add the ovals last
		players.forEach((currPlayer) => {
				drawOval(currPlayer.x, currPlayer.y, currPlayer.color, currPlayer);
		});
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
	

</script>

<!-- svelte-ignore a11y-missing-attribute -->
<html data-theme="emerald">
	<div class="h-full min-h-screen w-screen bg-gradient-to-r from-slate-800 to-slate-700">
		<div class="grid grid-cols-4 h-full min-h-screen">
			<ul class="steps steps-vertical col-span-1 mx-auto">
				<li class="step {progress.installName} text-white">Name Install</li>
				<li class="step {progress.plays} text-white">Add Plays and Formations</li>
				<li class="step text-white">Choose templates</li>
				<li class="step text-white">Publish!</li>
			</ul>
			<div class="stats shadow h-48 my-auto col-start-2 col-span-2">
				<div class="stat place-items-center ">
					<div class="stat-title">Total Passes</div>
					<div class="stat-value text-indigo-700">{numberpasses}</div>
					<div class="stat-desc"># NEW</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Total Runs</div>
					<div class="stat-value text-indigo-700">{numberruns}</div>
					<div class="stat-desc"># NEW</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Total Formations</div>
					<div class="stat-value text-indigo-700">{formations.size}</div>
					<div class="stat-desc"># NEW</div>
				</div>
			</div>
			<div class="card bg-slate-900 col-start-1 col-span-2 mx-12 max-h-64">
				<div class="card card-title text-white font-bold tracking-tight mt-10">Install Name:</div>
				<div class="card card-body">
					<input
						type="text"
						class="input input-bordered w-full"
						placeholder="Enter a name for your install"
						bind:value={installName}
						on:keydown={changeProgress}
					/>
					<div class="card-actions">
						<label class="cursor-pointer label">
							<span class="label-text text-white mx-2">Notify Team</span>
							<input type="checkbox" class="toggle toggle-secondary" checked />
						</label>
					</div>
				</div>
			</div>
			<div class="card bg-slate-900 col-start-3 col-span-2 mx-12 max-h-64">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="card card-title text-white font-bold tracking-tight mt-10">
					Search for Plays & Formations:
				</div>
				<div class="card card-body">
					<input
						type="text"
						placeholder="Play"
						class="input input-bordered input-secondary w-full max-w-s"
						on:keydown={() => changeSearchPlays(searchedPlay, data.props.plays)}
						bind:value={searchedPlay}
					/>
					{#if searchedPlay != null && searchedPlay != '' && data.props.plays != null}
						<ul class="p-2 bg-gray-200 rounded-b w-full max-h-32 max-w-xs text-center z-50 absolute mt-10">
							{#each searchedPlays as play}
								<!-- svelte-ignore a11y-missing-attribute -->
								<li>
									<a
										class="text-black font-bold hover:cursor-pointer hover:text-gray-600 text-center"
										on:click={() => addPlay(play)}>{play.name}</a
									>
								</li>
							{/each}
						</ul>
					{/if}
					<input
						type="text"
						placeholder="Formation"
						class="input input-bordered input-secondary w-full max-w-s"
						on:keydown={() => changeSearchFormations(searchedFormation, data.props.plays)}
						bind:value={searchedFormation}
					/>
					{#if searchedFormation != null && searchedFormation != '' && data.props.plays != null}
						<ul class="p-2 bg-gray-200 rounded-b w-full max-h-32 max-w-xs text-center z-50 absolute mt-24">
							{#each searchedFormations as play}
								<!-- svelte-ignore a11y-missing-attribute -->
								<li>
									<a
										class="text-black font-bold hover:cursor-pointer hover:text-gray-600 text-center"
										on:click={() => addFormation(play)}>{play.formation}</a
									>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
			<div class="col-start-1 col-span-2 mx-12 mt-8">
				<div class="overflow-x-auto my-auto">
					<!--if the user's scripts plays are not empty  -->
					{#if installPlaysArray.length > 0 || installFormationArray.length > 0}
					<table
						class="table table-compact table-zebra w-full self-center text-center text-slate-900"
					>
						<thead>
							<tr>
								<th>Play</th>
								<th>Formation</th>
								<th>Personnel</th>
							</tr>
						</thead>
						<tbody>
							{#each installFormationArray as formation}
								<tr class="text-slate-800">
									<th class="text-lg font-semibold"></th>
									<th class="text-lg font-semibold">{formation.name}</th>
									<th class="text-lg font-semibold"></th>
								</tr>
							{/each}
							{#each installPlaysArray as play}
								<tr class="text-slate-800">
									<th class="text-lg font-semibold">{play.name}</th>
									<td class="text-lg font-semibold">{play.formation}</td>
									<td class="text-lg font-semibold">{play.personnel}</td>
								</tr>
							{/each}
						</tbody>
					</table>
					{/if}
				</div>
			</div>
			<div class = "col-start-3 col-span-2 mx-16 mt-8 h-full justify-center">
				{#if installPlaysArray.length > 0}
				<div class="carousel rounded-box border-8 border-white">
					{#each installPlaysArray as play}
						<div class="carousel-item w-full">
						<PlayCard data = {play} />
						</div>
						{/each}
					</div>	
				{/if}
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label for="publish-modal" class = "btn bg-indigo-700 text-white btn-block mb-0 mt-10">Publish</label>
	</div>
	<input type="checkbox" id="publish-modal" class="modal-toggle" />
<label for="publish-modal" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
	<div class="flex flex-col items-center">
		<label class="cursor-pointer label">
			<span class="label-text mx-2 text-slate-900 font-bold tracking-tight text-xl">Export to PPTX</span> 
			<input type="checkbox" class="toggle toggle-secondary" checked />
		  </label>
		  <label class="cursor-pointer label">
			<span class="label-text mx-2 text-slate-900 font-bold tracking-tight text-xl">Export to PDF</span> 
			<input type="checkbox" class="toggle toggle-secondary" checked />
		  </label>
		  <!-- svelte-ignore a11y-click-events-have-key-events -->
		  <btn class = "btn bg-indigo-700 text-white btn-block mb-0 mt-10" on:click={() => publishInstall(installName,installPlaysArray, installFormationArray)}>Publish</btn>
	</div>
   </label>
</label>
	<canvas
      bind:this={canvas}
      width="2600"
      height="2600"
      style="width:600px; height:450px;"
      class="mx-auto hidden"
      id="canvas"
    />
	</html
>

