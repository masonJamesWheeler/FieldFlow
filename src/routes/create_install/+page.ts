// imports
import {auth, db } from "../../lib/firebase"
import { getAuth } from "firebase/auth";
import type { PageLoad } from './$types';
import {getFormationNames, getPlayNames, getPlay} from "../../utils/stores"
import { onAuthStateChanged } from "firebase/auth";
import { onMount } from "svelte";
import { goto } from "$app/navigation";

// this is the page load function
let user = getAuth()?.currentUser;
let userLoaded = false;


  onAuthStateChanged(auth, (user) => {
  if (user) {
    userLoaded = true;
  } else {
    // we are not logged in
  }
});

export const load = (async ({ params }) => {
    // if we have a user then we want to pass the user to the page
    if (userLoaded && user.uid != null) {
        let formations = await getFormationNames(user.uid, db);
        let playNames = await getPlayNames(user.uid, db);
        // get all of the Player[] for each play
        let plays = await Promise.all(playNames.map(async (playName) => {
            return (await getPlay(user.uid, playName, db));
        }));
        return { props: { user,db, formations, playNames, plays
         } };
    }
}) as PageLoad;