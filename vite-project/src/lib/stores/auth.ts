import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';

function getAuthToken(): string | null {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

// Typ des JWT-Claims definieren (z. B. wenn dein Token `username` enthält)
interface DecodedToken {
  username: string;
}

export const user = writable<{ token: string; username: string } | null>(null);

if (typeof window !== 'undefined') {
  const token = getAuthToken();
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      user.set({ token, username: decoded.username }); // ✅ beides übergeben
    } catch (err) {
      console.error('Invalid token', err);
    }
  }
}