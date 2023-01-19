<script lang="ts">
	import type { PageData } from './$types';
	import PlayCard from '../../components/playCard.svelte';
	import { search } from '../../utils/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {clickedInstall, clickedPlay} from "../../lib/stores"
	import { redirect } from '@sveltejs/kit';

	export let data: PageData;


	let play = []
	let install = []
	//subscribe to the clickedPlay store
	$: clickedPlay.subscribe(value => {
		play = value
	})
	$: clickedInstall.subscribe(value => {
		install = value
	})
	

	// create an array of the names of the user's selected plays
	let searchedPlays = [];
	let searchPlay = '';
	let selectedFormations = [];
	let selectedDowns = [];
	let selectedPersonnel = [];

	onMount(async () => {
		let searchedPlays = [];
		console.log(selectedDowns);
	});

	function changeSearchedPlays(searchTerm, data) {
		searchedPlays = search(searchTerm, data);
	}

	// function to go to the viewplay page
	 function goToPlay(play) {
		// update the status of clickedPlay
		clickedPlay.set(play)
		//goto the viewplay page
		goto('/viewplay')		
		console.log(goto('/viewplay'))
	}
	// function to go to the viewinstall page
	function goToInstall(install) {
		// update the status of clickedPlay
		clickedInstall.set(install)
		//goto the viewplay page
		goto('/viewinstall')		
		console.log(goto('/viewinstall'))
	}
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<html data-theme="emerald">
	<div class="h-full w-screen bg-gray-900">
		<section class="pt-10 pb-10 lg:pt-[60px] lg:pb-20 mx-6">
			<div class=" container mx-auto justify-center place-items-center">
				<h2 class="text-white text-4xl font-extrabold tracking">Most Recent Installs</h2>
				<div class="flex flex-col m-auto p-auto">
					<div
						class="flex overflow-x-scroll pb-10 hide-scroll-bar bg-slate-800 border-8 border-white rounded-2xl"
					>
						<div class="flex flex-nowrap md:ml-6 ml-4 ">
							{#each data.props.installNames as install}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="inline-block px-3" on:click={() => goToInstall(install)}>
								<div class="flex-col w-40 overflow-hidden">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="white"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="white"
										class="w-24 h-24 mt-10 mx-10 hover:opacity-90 hover:cursor-pointer"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
										/>
									</svg>
									<h2
										class="text-white font-bold tracking-tight mx-auto text-center overflow-hidden h-12 overflow-x-auto"
									>
										{install}
									</h2>
								</div>
							</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<div class="">
				<div
					class="grid grid-rows-1 xl:grid-cols-3 grid-flow-row lg:grid-flow-col gap-4 mb-6 rounded-xl z-50"
				>
					<div class="col-span-1 mx-4 ">
						<h2 class="text-white text-4xl font-extrabold tracking-tight mt-8 text-center">
							Search for a play?
						</h2>
						<div
							class="card shadow-2xl bg-indigo-700 mb-4 mx-auto mt-2 border-8 border-white w-96  "
						>
							<div class="card-body">
								<div class="flex flex-col items-center">
									<input
										type="text"
										placeholder="Play Name"
										class="input input-bordered input-secondary w-full max-w-s"
										bind:value={searchPlay}
										on:keydown={() => changeSearchedPlays(searchPlay, data.props.plays)}
									/>
									{#if searchPlay != null && searchPlay != '' && data.props.plays != null}
										<ul class="p-2 bg-gray-200 rounded-b w-full max-h-32 max-w-xs text-center">
											{#each searchedPlays as play}
												<!-- svelte-ignore a11y-missing-attribute -->
												<li>
													<!-- svelte-ignore a11y-click-events-have-key-events -->
													<a on:click|preventDefault={() => goToPlay(play)}
														class="text-black font-bold hover:cursor-pointer hover:text-gray-600 text-center"
														>{play.name}</a
													>
												</li>
											{/each}
										</ul>
									{/if}
								</div>
							</div>
						</div>
                        <h2 class="text-white text-4xl font-extrabold tracking-tight mt-8 text-center">
							Create Scripts and More
						</h2>
						<div
							class="card shadow-2xl bg-indigo-700 mb-4 mx-auto mt-2 border-8 border-white w-96  "
						>
							<div class="card-body">
								<div class="grid flex-row-2 items-center gap-4">
									<a class = "btn  bg-slate-800 text-white" href = "create_install">Installs</a>
                                    <a class = "btn  bg-slate-800 text-white">Scripts</a>
                                    <a class = "btn  bg-slate-800 text-white ">Call Sheets</a>

								</div>
							</div>
                            </div>
					</div>
                    
					<div class="mx-auto xl:col-span-2 hidden xl:block ">
						<h2 class="text-white text-4xl font-extrabold tracking-tight mt-8">All Plays</h2>
						<div class="flex">
							<div class=" w-full h-full">
								<div class="mx-auto w-5xl px-4 lg:w-7xl">
									<div
										class="mt-2 grid grid-cols-2 gap-y-10 gap-x-6 xl:gap-x-8 bg-slate-900 px-8 py-8 rounded-2xl border-8 border-white"
									>
										{#each data.props.plays as play}
											<PlayCard data={play} />
										{/each}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<div class="bg-gray-100">
			<div class="relative overflow-hidden">
				<div class="absolute inset-0">
					<div class="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
				</div>
				<div class="relative mx-auto">
					<div class="bg-indigo-700 py-16 px-4 ">
						<div class="max-w-lg mx-auto">
							<h2 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
								<span class="block">Ready to dive in?</span>
								<span class="block">Start your free trial today.</span>
							</h2>
							<p class="mt-3 text-lg leading-6 text-indigo-200">
								Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing
								sagittis vel nulla nec.
							</p>
							<form class="mt-8 sm:flex">
								<div class="min-w-0 flex-1">
									<label for="email" class="sr-only">Email address</label>
									<input
										id="email"
										type="email"
										required
										class="w-full px-5 py-3 border border-transparent rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
										placeholder="Enter your email"
									/>
								</div>
								<div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
									<button
										type="submit"
										class="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
									>
										Get started
									</button>
								</div>
							</form>
							<p class="mt-3 text-sm text-indigo-200">
								Start your free trial, no credit card necessary.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- create a play editing canvas environment as a demo for the homepage -->
	</div>
	<!--  a background div made of a modern design with a few lines separating different colors -->
</html>
