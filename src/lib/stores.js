// a store to keep track of a user's clicked play or clicked install
// so that we can access it when we navigate to another page

import { writable } from 'svelte/store';

export const clickedPlay = writable([]);
export const clickedInstall = writable([]);
