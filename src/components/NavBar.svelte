<script lang="ts">
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';
import {auth} from '../lib/firebase'
import { error } from '@sveltejs/kit';
import {onAuthStateChanged} from 'firebase/auth'


let user = auth?.currentUser

// onAuth state change
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        user = auth.currentUser
    }
})

// subscribe to the auth store
// if the user is null, redirect to the login page
// if the user is not null, redirect to the viewplays page

// function to check if the user is null
// if the user is null, redirect to the login page
// if the user is not null, redirect to the viewplays page
function gotoPlays() {
  console.log(user)
  goto('/viewplays')
}
</script>


<!-- navbar component -->
<!-- a daisyui navbar component -->

<!-- svelte-ignore a11y-missing-attribute -->
<html data-theme ="emerald">
  
<div class = "flex ">
<div class="navbar bg-slate-800 w-full">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl text-white" href="/">
      <img src = "FieldFlowAccent.png" class = "w-20 h-12"alt="FieldFlow"/>
      </a>
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
            <li><btn class = "text-white tracking-tight font-bold hover:bg-slate-800" on:click={() => gotoPlays()}>Plays</btn></li>
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