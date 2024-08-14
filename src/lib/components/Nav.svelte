<!-- src/lib/components/Nav.svelte -->
<script>
    import { isAuthenticated } from "$lib/auth/store";
  </script>
  
  <nav>
    <a href="/">Home</a>
    {#if $isAuthenticated}
      <a href="/dashboard">Dashboard</a>
    {:else}
      <a href="/login">Login</a>
    {/if}
  </nav>