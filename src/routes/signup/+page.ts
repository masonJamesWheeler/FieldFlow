// imports
import {auth} from "../../lib/firebase"
import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
    // if we have a user then we want to pass the user to the page
    let user = auth.currentUser;
    if (user) {
        return { props: { user } };
    }
    // if we don't have a user then we want to pass nothing
    return { props: {} };
}) as PageLoad;


 
  