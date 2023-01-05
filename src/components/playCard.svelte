<script lang="ts">
	import { onMount } from 'svelte';
	import { drawPlayers } from '../utils/drawing';
	import type { Player } from '../utils/objects';
	export let data: Player[];
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
			data,
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
</script>

<!--  for each player array on the data -->
<!-- draw the players on the canvas with the drawPlayers function -->
<div class="h-full aspect-h-1 w-full  hover:opacity-95  hover:cursor-pointer shadow-xl flex">
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
				"test"
			</h2>

			<div class="card-actions justify-end">
				<div class="badge badge-primary">"test"</div>
				<div class="badge bg-orange-500 text-white border-none">"test"</div>
			</div>
		</div>
	</div>
</div>
