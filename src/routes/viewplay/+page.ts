// imports
import {auth, db } from "../../lib/firebase"
import { getAuth } from "firebase/auth";
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';
import {getFormationNames, getPlayNames, getPlay, getInstallNames} from "../../utils/stores"
import { onAuthStateChanged } from "firebase/auth";
import {clickedPlay} from "../../lib/stores"
import { onMount } from "svelte";

let play
// set play to the clicked play
clickedPlay.subscribe((value) => {
    play = value;
    console.log(value)
});


// this is the page load function
let user = getAuth()?.currentUser;
let userLoaded = false;


  onAuthStateChanged(auth, (user) => {
  if (user) {
    userLoaded = true;
    // ...
  } else {
    // we are not logged in
  }
});

export const load = (async ({ params }) => {
    // if we have a user then we want to pass the user to the page
    if (userLoaded && user.uid != null) {
      console.log("HELLO")
        // change the window location
        return { props: { user, play        
         } };
    }
}) as PageLoad;
