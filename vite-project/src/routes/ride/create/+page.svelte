<script lang="ts">
    let start = '';
    let destination = '';
    let date = '';
    let seats = 0;

    const createRide = () => {
        console.log('Creating ride with:', { start, destination, date, seats });

    };
  </script>
  
  <div class="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Erstelle eine Fahrt</h1>
  
    <form on:submit|preventDefault={createRide} class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700">Beginn</label>
            <input bind:value={start} type="text" required
              class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
          </div>
        <div>
        <label class="block text-sm font-medium text-gray-700">Ende</label>
        <input bind:value={destination} type="text" required
          class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Datum</label>
        <input bind:value={date} type="date" required
          class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Freie Plätze</label>
        <input bind:value={seats} type="number" min="1" required
          class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-yellow-400" />
      </div>
  
      <button type="submit"
        class="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition">
        Create Ride
      </button>
    </form>
  </div>