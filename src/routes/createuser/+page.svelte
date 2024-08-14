<script>
    import { user, login, logout } from '$lib/auth/auth.js'
  </script>
  
  {#if $user}
    <p>Welcome, {$user.userDetails}</p>
    <button on:click={() => logout()}>Log out</button>
  {:else}
    <button on:click={() => login('aad')}>Log in with Microsoft</button>
  {/if}