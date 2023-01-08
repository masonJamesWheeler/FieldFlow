// a store to keep track of a user's clicked play or clicked install
// so that we can access it when we navigate to another page

import { writable } from 'svelte/store';
export const PUBLIC_STRIPE_KEY = writable('pk_live_51MO4VQH4tqBFeYcelvXv9DEMt7u3yWnDxjIjI5oQc85q7sOgPheOs8eR7oPGDl8aL4SLt4XfjXFob1hhQLds8iob00gKVuGqec');
export const clickedPlay = writable([]);
export const clickedInstall = writable([]);
