<script lang = 'ts'>
	import '../app.css';
	import NavBar from '../components/NavBar.svelte';
	import { auth } from '../lib/firebase';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth'
	export let user;

	let userLoaded = false;
	let timeout = false
	onMount(async () => {
		user = await auth.currentUser;
	});

	onAuthStateChanged(auth, (user) => {
		if (user) {
			const uid = user.uid;
			userLoaded = true;
		} else {
			// we are not logged in
			// set a timeout to prevent the loading screen from flashing
			setTimeout(() => {
				timeout = true;
			}, 500);
		}
	});
</script>

<NavBar />
{#if !userLoaded && !timeout}
	<div class="flex justify-center items-center h-screen bg-slate-200">
		<div class="text-2xl font-extrabold">Loading...</div>
		<div
			class="items-center justify-center rounded-full w-14 h-14 bg-gradient-to-tr from-indigo-500 to-pink-500 animate-spin flex"
		>
			<div class="h-9 w-9 rounded-full bg-slate-800" />
		</div>
	</div>
{:else}
	<slot />
{/if}
