<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageLoad } from './$types';
	import { drawPlayers } from '../../utils/drawing';
	import type { Player } from '../../utils/objects';
    import {addNotesToPlay} from '../../utils/stores';
	import { db } from '$lib/firebase';
	export let data;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let img;

	let qbNotes = '';
	let rbNotes = '';
	let wrNotes = '';
	let teNotes = '';
	let olNotes = '';

	onMount(async () => {
		console.log(data);
		// image of the field
		img = new Image();
		img.src = 'background.png';
		ctx = canvas.getContext('2d');
		// draw the image of the field
		ctx.drawImage(img, 0, 0, 2600, 2600);
		drawPlayers(
			data.props.play.players,
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
        // set the notes equal to the notes in the database
		if (data.props.play.qbNotes != null) {
			qbNotes = data.props.play.qbNotes;
		} 
        if (data.props.play.rbNotes != null) {
            rbNotes = data.props.play.rbNotes;
        }
        if (data.props.play.wrNotes != null) {
            wrNotes = data.props.play.wrNotes;
        }
        if (data.props.play.teNotes != null) {
            teNotes = data.props.play.teNotes;
        }
        if (data.props.play.olNotes != null) {
            olNotes = data.props.play.olNotes;
        }
        
	});
</script>

{#await data then data}
	<div class="bg-gradient-to-r from-slate-200 to-slate-100 min-h-screen">
		<div class="grid grid-col-1 w-full lg:grid-cols-2">
			<div class=" my-auto mx-auto">
				<div class="card bg-base-100 shad max-w-[500px] my-10 mb-10 rounded-3xl shadow-2xl">
					<figure>
						<canvas
							bind:this={canvas}
							width="2600"
							height="2600"
							style="width:750px; height:450px;"
							class="mx-auto justify-center mt-2"
							id="canvas"
						/>
					</figure>
					<div class="card-body bg-slate-700 rounded-b-3xl">
						<h2 class="card-title text-white font-extrabold text-2xl">{data.props.play.name}</h2>
						<div class="card-actions justify-end">
							<div class="badge bg-indigo-700 text-white">{data.props.play.down_dist}</div>
							<div class="badge bg-red-500 text-white border-none">{data.props.play.formation}</div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="grid flex-grow card rounded-box place-items-start mx-auto my-10 min-h-96 bg-white shadow-2xl shad w-4/6"
			>
				<div class="form-control w-full">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mx-auto">
						<span class="label-text text-black font-bold">QB Notes</span>
					</label>
					<textarea
						class="textarea textarea-bordered h-24 mx-10"
						placeholder="Places notes here"
						bind:value={qbNotes}
					/>
				</div>

				<div class="form-control w-full">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mx-auto">
						<span class="label-text text-black font-bold">O-line Notes</span>
					</label>
					<textarea
						class="textarea textarea-bordered h-24 mx-10"
						placeholder="Places notes here"
						bind:value={olNotes}
					/>
				</div>

				<div class="form-control w-full">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mx-auto">
						<span class="label-text text-black font-bold">Wide-Reciever Notes</span>
					</label>
					<textarea
						class="textarea textarea-bordered h-24 mx-10"
						placeholder="Places notes here"
						bind:value={wrNotes}
					/>
				</div>

				<div class="form-control w-full">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mx-auto">
						<span class="label-text text-black font-bold">Tailback Notes</span>
					</label>
					<textarea
						class="textarea textarea-bordered h-24 mx-10"
						placeholder="Places notes here"
						bind:value={rbNotes}
					/>
				</div>

				<div class="form-control w-full mb-4">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mx-auto">
						<span class="label-text text-black font-bold">Tight-end Notes</span>
					</label>
					<textarea
						class="textarea textarea-bordered h-24 mx-10"
						placeholder="Places notes here"
						bind:value={teNotes}
					/>
				</div>
				<button class="btn my-4 mx-auto" on:click={() => addNotesToPlay(data.props.play.name, data.props.user.uid, db, qbNotes, rbNotes, olNotes, teNotes, wrNotes)}>Update</button>
			</div>
		</div>
	</div>
{/await}
