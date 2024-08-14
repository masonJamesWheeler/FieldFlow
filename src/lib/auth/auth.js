// src/lib/auth/auth.js
import { writable } from 'svelte/store';

export const user = writable(null);

export async function loadUser() {
  const res = await fetch('/.auth/me');
  const data = await res.json();
  if (data && data.clientPrincipal) {
    user.set(data.clientPrincipal);
  }
}

export function login(provider) {
  window.location.href = `/.auth/login/${provider}`;
}

export function logout() {
  window.location.href = '/.auth/logout';
}