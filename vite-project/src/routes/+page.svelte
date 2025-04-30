<script lang="ts">
    // Simulated rides data (replace with backend call later)
    let rides = [
      { start: 'Berlin', destination: 'Munich', date: '2025-04-25', seats: 3},
      { start: 'Hamburg', destination: 'Berlin', date: '2025-04-26', seats: 2},
      { start: 'Cologne', destination: 'Frankfurt', date: '2025-04-27', seats: 1},
      { start: 'Berlin', destination: 'Leipzig', date: '2025-04-24', seats: 4},
    ];
  
    let filterStart = '';
    let filterDest = '';
  
    // Reactive filtered rides
    $: filteredRides = rides.filter((ride) =>
      ride.start.toLowerCase().includes(filterStart.toLowerCase()) &&
      ride.destination.toLowerCase().includes(filterDest.toLowerCase())
    );
  </script>
  
  <div class="max-w-4xl mx-auto mt-10 px-4">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Verfügbare Fahrten</h1>
  
    <!-- Filter Inputs -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        bind:value={filterStart}
        placeholder="Start"
        class="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-yellow-400"
      />
      <input
        type="text"
        bind:value={filterDest}
        placeholder="Ziel"
        class="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-yellow-400"
      />
    </div>
  
    <!-- Ride Cards -->
    {#if filteredRides.length > 0}
      <div class="grid gap-4">
        {#each filteredRides as ride}
          <div class="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-lg font-semibold text-gray-700">{ride.start} → {ride.destination}</p>
                <p class="text-sm text-gray-500">{ride.date} — {ride.seats} seat(s)</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500 text-center mt-10">Keine Fahrten gefunden!</p>
    {/if}
  </div>