import { writable } from 'svelte/store';

function getAuthToken(): string | null {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

export const user = writable<{ token: string } | null>(null);

if (typeof window !== 'undefined') {
  const token = getAuthToken();
  if (token) {
    user.set({ token });
  }
}