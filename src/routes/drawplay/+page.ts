// imports
import {auth, db, } from "../../lib/firebase"
import type { PageLoad } from './$types';
import {getFormationNames, getPlayNames} from "../../utils/stores"
 
export const load = (async ({ params }) => {
    // if we have a user then we want to pass the user to the page
    let user = auth.currentUser;
    if (user) {
        let formations = await getFormationNames(user.uid, db);
        let plays = await getPlayNames(user.uid, db);
        return { props: { user,
                            formations, plays
         } };
    }
    // if we don't have a user then we want to pass nothing
    return { props: {} };
}) as PageLoad;



