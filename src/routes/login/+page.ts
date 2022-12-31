// imports
import {goto} from "$app/navigation";
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// check if their is a current user, if so redirect back to "/"
// if not, render the login page
export const load: PageLoad = ({session}) => {
    if (session) {
        goto('/');
    }
    return {};
}
