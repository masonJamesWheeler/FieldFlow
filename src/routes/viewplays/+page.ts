// imports
import {auth, db } from "../../lib/firebase"
import { getAuth } from "firebase/auth";
import type { PageLoad } from './$types';
import {getFormationNames, getPlayNames, getPlay, getInstallNames} from "../../utils/stores"
import { onAuthStateChanged } from "firebase/auth";
import { onMount } from "svelte";
import { goto } from "$app/navigation";

// this is the page load function
let user = getAuth()?.currentUser;
let userLoaded = false;


  onAuthStateChanged(auth, (user) => {
    console.log(user)
  if (user != null) {
    userLoaded = true;
  } else {
    // set a timeout to give the user time to see the error message
  }
});

export const load = (async ({ params }) => {
    // if we have a user then we want to pass the user to the page
    console.log(user)
    if (userLoaded) {
        let formations = await getFormationNames(user.uid, db);
        let playNames = await getPlayNames(user.uid, db);
        let installNames = await getInstallNames(user.uid, db);
        // sort the install names by the most recent dates
        installNames.sort((a, b) => {
            return (a.timeStamp < b.timeStamp) ? 1 : -1;
        });
        // get all of the Player[] for each play
        let plays = await Promise.all(playNames.map(async (playName) => {
            return (await getPlay(user.uid, playName, db));
        }));
        return { props: { user, formations, playNames, plays, installNames
         } };
    } else {
      // set a timeout to give the user time to see the error message
      setTimeout(() => {
        return { props: { user: null, formations: [], playNames: [], plays: [], installNames: [] } };
      }, 2000);
    }
}) as PageLoad;
