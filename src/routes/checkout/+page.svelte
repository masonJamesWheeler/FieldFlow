<script>
  import { onMount } from 'svelte';
  import {subscribe} from "./subscribe"
</script>

<btn on:click={() => subscribe()}>hello world</btn>