<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/stores/auth"; // Assuming `user` is a store that tracks login state

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

  // Reactive filtered rides
  $: filteredRides = rides.filter((ride) =>
    ride.StartPlaceName.toLowerCase().includes(filterStart.toLowerCase()) &&
    ride.FinishPlaceName.toLowerCase().includes(filterDest.toLowerCase())
  );

  // Modal states
  let selectedRide: any = null;
  let showLoginModal = false;

  function openModal(ride: any) {
    if ($user?.token) {
      // User is logged in
      selectedRide = ride;
    } else {
      // User is not logged in
      showLoginModal = true;
    }
  }

  function closeModal() {
    selectedRide = null;
  }

  function closeLoginModal() {
    showLoginModal = false;
  }

  function bookRide() {
    console.log("Booking ride:", selectedRide);
    // Add booking logic here
    closeModal();
  }
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
        <div
          class="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition cursor-pointer"
          on:click={() => openModal(ride)}
        >
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

<!-- Booking Modal -->
{#if selectedRide}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4">Fahrt buchen</h2>
      <p class="mb-2"><strong>Von:</strong> {selectedRide.StartPlaceName}</p>
      <p class="mb-2"><strong>Nach:</strong> {selectedRide.FinishPlaceName}</p>
      <p class="mb-2"><strong>Abfahrt:</strong> {selectedRide.StartTime}</p>
      <p class="mb-4"><strong>Fahrer:</strong> {selectedRide.Driver}</p>
      <div class="flex justify-end space-x-4">
        <button
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          on:click={closeModal}
        >
          Abbrechen
        </button>
        <button
          class="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
          on:click={bookRide}
        >
          Buchen
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Login Modal -->
{#if showLoginModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4">Login erforderlich</h2>
      <p class="mb-4">Bitte melden Sie sich an, um eine Fahrt zu buchen.</p>
      <div class="flex justify-end space-x-4">
        <button
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          on:click={closeLoginModal}
        >
          Abbrechen
        </button>
        <a
          href="/login"
          class="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
        >
          Login
        </a>
      </div>
    </div>
  </div>
{/if}