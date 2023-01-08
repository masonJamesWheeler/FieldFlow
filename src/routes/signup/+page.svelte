<script lang="ts">
import {auth} from "../../lib/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import type {PageData} from './$types'
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

// load the props from the server
export let data:PageData
console.log(data)

let email = "";
let password = "";
let password2 = "";

onMount(() => {
    // if we are already logged in ask if we would like to log out
    if (auth.currentUser) {
        if (confirm("You are already logged in. Would you like to log out?")) {
            auth.signOut();
        } else {
            goto('/');
        }
    } 
})

// function to attempt to create the user
async function attemptCreateUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        goto('/login');
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    }
}
</script>

 <!-- a firebase styled login page -->
    <!-- user's can log in with an email and password, or a gmail account-->
    <div class = "w-full h-screen bg-slate-700">
        <!-- a hero div containing a form for the user to login -->
        <div class="min-h-screen flex flex-row  justify-center mx-0">
            
            <div class="flex justify-center self-center z-10 w-fit">
              <div class="p-12  mx-auto rounded-2xl bg-indigo-700  ">
                  <div class="mb-4">
                    <h3 class="font-semibold text-2xl text-white">Sign Up </h3>
                    <p class="text-white">Please sign up for an account.</p>
                  </div>
                  <div class="space-y-5">
                              <div class="space-y-2">
                                    <!-- svelte-ignore a11y-label-has-associated-control -->
                                    <label class="text-sm font-medium text-white tracking-wide">Email</label>
                    <input class=" w-full text-black px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="" placeholder="mail@gmail.com" bind:value={email}>
                    </div>
                                <div class="space-y-2">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="mb-5 text-sm font-medium text-white tracking-wide ">
                      Password
                    </label>
                    <input class="w-full content-center text-black px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="password" placeholder="Enter your password" bind:value={password}>
                  </div>
                  {#if password.length > 0}
                  <div class="space-y-2">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="mb-5 text-sm font-medium text-white tracking-wide ">
                      One more time
                    </label>
                    <input class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="password" placeholder="Enter your password again" bind:value={password2}>
                  </div>
                  {/if}
                    <div class="flex items-center justify-between">
                    <div class="flex items-center">
                    <div class="form-control">
                      <label class="label">
                        <span class="text-white mx-2">Creating a team?</span> 
                        <input type="checkbox" checked="checked" class="checkbox" />
                      </label>
                    </div>
                    </div>
                  </div>
                  <div>
                    <button class="w-full flex justify-center btn bg-slate-800 text-white  shadow-lg cursor-pointer" on:click={() => attemptCreateUser(email, password)}>
                      Sign Up
                    </button>
                  </div>
                  </div>
                  
              </div>
            </div>
        </div>
    
    
    </div>
    
        
    