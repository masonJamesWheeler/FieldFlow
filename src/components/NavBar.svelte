<!-- navbar component -->
<!-- a daisyui navbar component -->
<div class="navbar bg-base-200 shadow-2xl w-full">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl text-primary" href="/">Playbook-Tech</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <!-- svelte-ignore a11y-missing-attribute -->
        <li><a href = /login>Login</a></li>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <li tabindex="0">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a>
            View
            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
          </a>
          <ul class="p-2 bg-base-100">

            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a href="/viewplays">Plays</a></li>
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a>Installs</a></li>
          </ul>
        </li>
        <!-- svelte-ignore a11y-missing-attribute -->
        <li><a href="/drawplay">Draw A Play</a></li>
    </ul>
    </div>
  </div>