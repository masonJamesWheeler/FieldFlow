<script lang = 'ts'>
  import "../app.css";
	import NavBar from "../components/NavBar.svelte";
  import {auth} from "../lib/firebase";
  import {onMount} from "svelte";
  import {onAuthStateChanged} from "firebase/auth";
  export let user;
  
  let userLoaded = false;

  onMount(async () => {
    user = await auth.currentUser;
  });

  onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    userLoaded = true;
    // ...
  } else {
    // we are not logged in
  }
});


  </script>
  <NavBar/>
  {#if !userLoaded}
    <div class="flex justify-center items-center h-screen">
      <div class="text-2xl">Loading...</div>
    </div>
  {:else}
    <slot />
  {/if}
