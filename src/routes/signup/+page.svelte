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
    <div class = "w-full h-screen">
        <!-- a hero div containing a form for the user to login -->
        <div class="min-h-screen flex flex-row  justify-center mx-0">
            
            <div class="flex justify-center self-center z-10 w-fit">
              <div class="p-12  mx-auto rounded-2xl bg-base-300 ">
                  <div class="mb-4">
                    <h3 class="font-semibold text-2xl text-gray-800">Sign Up </h3>
                    <p class="text-gray-500">Please sign up for an account.</p>
                  </div>
                  <div class="space-y-5">
                              <div class="space-y-2">
                                    <!-- svelte-ignore a11y-label-has-associated-control -->
                                    <label class="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                    <input class=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="" placeholder="mail@gmail.com" bind:value={email}>
                    </div>
                                <div class="space-y-2">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="mb-5 text-sm font-medium text-gray-700 tracking-wide ">
                      Password
                    </label>
                    <input class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="password" placeholder="Enter your password" bind:value={password}>
                  </div>
                  {#if password.length > 0}
                  <div class="space-y-2">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="mb-5 text-sm font-medium text-gray-700 tracking-wide ">
                      One more time
                    </label>
                    <input class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="password" placeholder="Enter your password again" bind:value={password2}>
                  </div>
                  {/if}
                    <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded">
                      <label for="remember_me" class="ml-2 block text-sm text-gray-800">
                        Remember me
                      </label>
                    </div>
                    <div class="text-sm">
                      <a href="#" class="text-blue-400 hover:text-blue-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button class="w-full flex justify-center btn btn-primary  shadow-lg cursor-pointer" on:click={() => attemptCreateUser(email, password)}>
                      Sign Up
                    </button>
                  </div>
                  </div>
                  
              </div>
            </div>
        </div>
    
    
    </div>
    
        
    