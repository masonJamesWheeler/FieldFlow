<script lang="ts">
	import { onMount } from 'svelte';
	import { drawPlayers } from '../utils/drawing';
	import {clickedPlay} from "../lib/stores";
	import {goto} from '$app/navigation';
	import type { Player } from '../utils/objects';
	export let data;
	console.log(data)
	//subscribe to the clickedPlay store
	

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let img;


	onMount(async () => {
		console.log(data);
		// image of the field
		img = new Image();
		img.src = 'background.png';
		ctx = canvas.getContext('2d');
		// draw the image of the field
		ctx.drawImage(img, 0, 0, 2600, 2600);
		drawPlayers(
			data.players,
			ctx,
			canvas,
			img,
			null,
			null,
			false,
			false,
			null,
			null,
			false,
			null,
			null,
			null,
			null
		);
	});
	// function to go to the viewplay page
	function goToPlay(play) {
		// update the status of clickedPlay
		clickedPlay.set(play)
		//goto the viewplay page
		goto('/viewplay')		
		console.log(goto('/viewplay'))
	}
</script>

<!--  for each player array on the data -->
<!-- draw the players on the canvas with the drawPlayers function -->
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="h-full aspect-h-1 w-full  hover:opacity-95  hover:cursor-pointer shadow-xl flex" on:click|preventDefault={() => goToPlay(data)}>
	<div class="card rounded-b-2xl w-full">
		<figure>
			<canvas
				bind:this={canvas}
				width="2600"
				height="2600"
				style="width:400px; height:330px;"
				class="mx-auto justify-center mt-2"
				id="canvas"
			/>
		</figure>
		<div class="card-body bg-slate-700 rounded-b-2xl">
			<h2 class="card-title text-white">
				{data.name}
			</h2>

			<div class="card-actions justify-end">
				<div class="badge bg-violet-600 text-white">{data.down_dist}</div>
				<div class="badge bg-red-500 text-white border-none">{data.personnel}</div>
			</div>
		</div>
	</div>
</div>
