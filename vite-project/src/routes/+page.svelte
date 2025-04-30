<script lang="ts">
  import { onMount } from "svelte";

    onMount(() => {
      fetchrides().then((data) => {
        rides = data;
        console.log("Fetched rides:", rides);
      });
    });
    let fetchrides = async () => {
      try {
        const response = await fetch("http://localhost:3500/rides/open");
        const data = await response.json();
        return data;
      } catch (err) {
        console.error("Error fetching rides:", err);
        return [];
      }
    };
  
    let rides: any[] = [];
    let filterStart = '';
    let filterDest = '';
  
    //Reactive filtered rides
    $: filteredRides = rides.filter((ride) =>
      ride.StartPlaceName.toLowerCase().includes(filterStart.toLowerCase()) &&
      ride.FinishPlaceName.toLowerCase().includes(filterDest.toLowerCase())
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
                <p class="text-lg font-semibold text-gray-700">{ride.StartPlaceName} → {ride.FinishPlaceName}</p>
                <p class="text-sm text-gray-500">{ride.StartTime} — {ride.Seats} Plätze</p>
                <p class="text-sm text-gray-500">{ride.Driver}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500 text-center mt-10">Keine Fahrten gefunden!</p>
    {/if}
  </div>