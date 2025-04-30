<script lang="ts">
  import { page } from '$app/stores';

  let menuOpen = false;

  // Simulate user login state (replace with your actual auth logic later)
  let user: { id: number; name: string } | null = null; // Simulate user login state (replace with your actual auth logic later)

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function logout() {
    user = null;
    menuOpen = false;
    // Add your logout logic here (e.g., remove token, redirect, etc.)
  }
</script>

<nav class="bg-gray-900 text-white px-6 py-4 shadow-md relative z-10">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="text-xl font-bold tracking-tight text-yellow-400 hover:text-yellow-300">
      Ride-Hare 
    </a>

    <!-- Nav Links -->
    <div class="hidden md:flex space-x-6">
      <a
        href="/"
        class="hover:text-yellow-300 transition-colors duration-200"
        class:selected={$page.url.pathname === '/' ? 'text-yellow-400 font-semibold' : ''}
      >
        Home
      </a>
      <a
        href="/ride/create"
        class="hover:text-yellow-300 transition-colors duration-200"
        class:selected={$page.url.pathname === '/create-ride' ? 'text-yellow-400 font-semibold' : ''}
      >
        Fahrt Erstellen
      </a>
      <a
        href="/settings"
        class="hover:text-yellow-300 transition-colors duration-200"
        class:selected={$page.url.pathname === '/settings' ? 'text-yellow-400 font-semibold' : ''}
      >
        Einstellungen
      </a>
    </div>

    <!-- User Icon (Hamburger Dropdown) -->
    <div class="relative ml-4">
      <button on:click={toggleMenu} class="focus:outline-none">
        <svg class="w-8 h-8 text-yellow-400 hover:text-yellow-300" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M5.121 17.804A4.5 4.5 0 018.5 15h7a4.5 4.5 0 013.379 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {#if menuOpen}
        <div class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-20">
          {#if user}
            <a href="/profile" class="block px-4 py-2 hover:bg-yellow-100">Profil</a>
            <a href="/settings" class="block px-4 py-2 hover:bg-yellow-100">Einstellungen</a>
            <button on:click={logout} class="w-full text-left px-4 py-2 hover:bg-yellow-100">Ausloggen</button>
          {:else}
            <a href="/login" class="block px-4 py-2 hover:bg-yellow-100">Login</a>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</nav>

<style>
  a.selected {
    border-bottom: 2px solid yellow;
  }
</style>