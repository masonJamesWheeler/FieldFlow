<script lang="ts"> 
import {app, auth} from "../../lib/firebase";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { goto } from '$app/navigation';


let email = "";
let password = "";


// function to attempt to log in the user
async function attemptLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        goto('/');
    } catch (error) { 
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
    }
}

</script>

    <!-- a firebase styled login page -->
    <!-- user's can log in with an email and password, or a gmail account-->
    <div class = "w-full h-screen bg-slate-700">
        <!-- a hero div containing a form for the user to login -->
        <div class="min-h-screen flex flex-row  justify-center mx-0">
            
            <div class="flex justify-center self-center z-10 w-fit">
              <div class="p-12  mx-auto rounded-2xl bg-indigo-700 ">
                  <div class="mb-4">
                    <h3 class="font-semibold text-2xl text-white">Sign In </h3>
                    <p class="text-white">Please sign in to your account.</p>
                  </div>
                  <div class="space-y-5">
                              <div class="space-y-2">
                                    <!-- svelte-ignore a11y-label-has-associated-control -->
                                    <label class="text-sm font-medium text-white tracking-wide">Email</label>
                    <input class=" w-full text-black px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="" placeholder="mail@gmail.com" bind:value={email}>
                    </div>
                                <div class="space-y-2">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="mb-5 text-sm font-medium text-white tracking-wide">
                      Password
                    </label>
                    <input class="w-full content-center text-black px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-violet-400" type="" placeholder="Enter your password" bind:value={password}>
                  </div>
                    <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded">
                      <label for="remember_me" class="ml-2 block text-sm text-white">
                        Remember me
                      </label>
                    </div>
                    <div class="text-sm">
                      <a href="#" class="text-white hover:text-blue-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button class="w-full flex justify-center btn bg-slate-800 text-white  shadow-lg cursor-pointer" on:click={() => attemptLogin(email, password)}>
                      Sign in
                    </button>
                  </div>
                  <!-- a link to redirect to create an account if user does not have one yet -->
                  <div class = "flex justify-end">
                  <a class = "link text-white" href = "/signup">Need to create an account?</a>
                </div>  
                </div>
                  
              </div>
            </div>
        </div>
    
    
    </div>
    
        
    