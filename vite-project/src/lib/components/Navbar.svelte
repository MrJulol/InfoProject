<script>
    import { page } from '$app/stores';
  </script>
  
  <nav class="bg-gray-900 text-white px-6 py-4 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <a href="/" class="text-xl font-bold tracking-tight text-yellow-400 hover:text-yellow-300">
        RideHare
      </a>
  
      <!-- Nav Links -->
      <div class="flex space-x-6">
        <a
          href="/"
          class="hover:text-yellow-300 transition-colors duration-200"
          class:selected={$page.url.pathname === '/' ? 'text-yellow-400 font-semibold' : ''}
        >
          Home
        </a>
        <a
          href="/login"
          class="hover:text-yellow-300 transition-colors duration-200"
          class:selected={$page.url.pathname === '/login' ? 'text-yellow-400 font-semibold' : ''}
        >
          Login
        </a>
        <a
          href="/settings"
          class="hover:text-yellow-300 transition-colors duration-200"
          class:selected={$page.url.pathname === '/settings' ? 'text-yellow-400 font-semibold' : ''}
        >
          Settings
        </a>
      </div>
    </div>
  </nav>
  
  <style>
    a.selected {
      border-bottom: 2px solid yellow;
    }
  </style>