<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let startPlace = '';
  let finishPlace = '';
  let start = '';
  let seats = 0;

  let error = '';
  let success = false;

  const createRide = async () => {
    error = '';
    success = false;

    if (!$user) {
      error = 'Du musst eingeloggt sein, um eine Fahrt zu erstellen.';
      return;
    }

    const rideData = {
      startPlace,
      finishPlace,
      start,
      seats,
      driver: $user.username
    };

    try {
      const res = await fetch('http://localhost:3500/rides/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$user.token}`
        },
        body: JSON.stringify(rideData)

      });
      console.log(rideData);
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Fehler beim Erstellen der Fahrt');
      }

      success = true;
      // Optional: Weiterleitung
      goto('/profile');
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'Unbekannter Fehler beim Erstellen der Fahrt';
      }
    }
  };
</script>

<div class="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
  <h1 class="text-2xl font-bold mb-6 text-gray-800">Erstelle eine Fahrt</h1>

  {#if error}
    <div class="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
  {/if}

  {#if success}
    <div class="bg-green-100 text-green-700 p-2 rounded mb-4">Fahrt erfolgreich erstellt!</div>
  {/if}

  <form on:submit|preventDefault={createRide} class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Beginn</label>
      <input bind:value={startPlace} type="text" required
        class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Ende</label>
      <input bind:value={finishPlace} type="text" required
        class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Datum</label>
      <input bind:value={start} type="date" required
        class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Freie Plätze</label>
      <input bind:value={seats} type="number" min="1" required
        class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
    </div>
    <button type="submit"
      class="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition">
      Fahrt erstellen
    </button>
  </form>
</div>