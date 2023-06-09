// // imports
// import {auth, db, } from "../../lib/firebase"
// import type { PageLoad } from './$types';
// import {getFormationNames, getPlayNames} from "../../utils/stores"
// import { onAuthStateChanged } from "firebase/auth";
// import { onMount } from "svelte";

// // this is the page load function
// let user = auth.currentUser;
// let userLoaded = false;


//   onAuthStateChanged(auth, (user) => {
//   if (user) {
//     userLoaded = true;
//     // ...
//   } else {
//     // we are not logged in
//   }
// });

// export const load = (async ({ params }) => {
//     // if we have a user then we want to pass the user to the page
//     if (userLoaded && user.uid != null) {
//         let formations = await getFormationNames(user.uid, db);
//         let plays = await getPlayNames(user.uid, db);
//         return { props: { user, formations, plays
//          } };
//     }
// }) as PageLoad;



