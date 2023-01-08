// imports
import {auth, db } from "../../lib/firebase"
import { getAuth } from "firebase/auth";
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';
import {getFormationNames, getPlayNames, getPlay, getInstallNames, getInstall} from "../../utils/stores"
import { onAuthStateChanged } from "firebase/auth";
import {clickedInstall} from "../../lib/stores"
import { onMount } from "svelte";

let install
// set play to the clicked play
clickedInstall.subscribe((value) => {
    install = value;
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
      // get the data from the install
      let installData = await getInstall(user.uid, install, db)
      console.log(installData)
        // change the window location
        return { props: { user, installData        
         } };
    }
}) as PageLoad;
