// imports
import {auth, db } from "../../lib/firebase"
import { getAuth } from "firebase/auth";
import type { PageLoad } from './$types';
import {getFormationNames, getPlayNames, getPlay, getInstallNames} from "../../utils/stores"
import { onAuthStateChanged } from "firebase/auth";
import { onMount } from "svelte";

// this is the page load function
let user = getAuth()?.currentUser;
let userLoaded = false;


  onAuthStateChanged(auth, (user) => {
  if (user) {
    userLoaded = true;
    // timeout to allow the page to load
  } else {
  }
});

export const load = (async ({ params }) => {
    // if we have a user then we want to pass the user to the page
    if (userLoaded && user.uid != null) {
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
        return { props: { user: null
          } };
    }
}) as PageLoad;
