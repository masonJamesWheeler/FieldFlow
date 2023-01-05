<!-- navbar component -->
<!-- a daisyui navbar component -->

<!-- svelte-ignore a11y-missing-attribute -->
<html data-theme ="emerald">
  
<div class = "flex ">
<div class="navbar bg-slate-800 w-full">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl text-white" href="/">Field Flow</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <!-- svelte-ignore a11y-missing-attribute -->
        <li><a class = "text-white tracking-tight font-bold btn-ghost" href = /login>Login</a></li>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <li tabindex="0" class = "z-40">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class = "text-white tracking-tight font-bold btn-ghost" >
            View
            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
          </a>
          <ul class="p-2 bg-slate-600">

            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a class = "text-white tracking-tight font-bold hover:bg-slate-800"href="/viewplays">Plays</a></li>
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a class = "text-white tracking-tight font-bold hover:bg-slate-800" >Installs</a></li>
          </ul>
        </li>
        <!-- svelte-ignore a11y-missing-attribute -->
        <li><a class = "text-white tracking-tight font-bold" href="/drawplay">Draw A Play</a></li>
    </ul>
    </div>
  </div>
  </div>
  </html>