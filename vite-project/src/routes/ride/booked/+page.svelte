<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let bookings: any[] = [];
  let loading = true;

  let fetchBookings = async (user: any) => {
    try {
      console.log('Fetching bookings for user:', user.username);
      const res = await fetch('http://localhost:3500/booking/userBookings?userName='+user.username, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      });

      if (!res.ok) throw new Error('Fehler beim Laden der Buchungen');

      bookings = await res.json();


      console.log('Fetched bookings:', bookings);
    } catch (err) {
      console.error(err);
      goto('/login');
    } finally {
      loading = false;
    }
  }


  onMount(async () => {
    const token = $user?.token;

    if (!token) {
      goto('/login');
      return;
    }

    await fetchBookings($user);
    
  });

  let showLoginModal = false;

  function openModal(ride: any) {
    if ($user?.token) {
      // User is logged in
      bookings = ride;
    } else {
      // User is not logged in
      showLoginModal = true;
    }
  }

  function closeModal() {

  }
 
  function closeLoginModal() {
    showLoginModal = false;
  }


   async function cancelRide(booking: any) {
    console.log("Canceling ride:", booking.ID);
    if (booking && $user?.token) {
      try {
        await fetch("http://localhost:3500/booking/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${$user.token}`
          },
          body: JSON.stringify({
            rideId: booking.ID,
            userName: $user.username
          })
        });
      } catch (err) {
        console.error("Error booking ride:", err);
      }
      await fetchBookings($user);
    }
    closeModal();
  }
</script>

<style>
  .booking-card {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
    margin: 1rem auto;
    text-align: center;
  }

  .title {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .info {
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
  }

  .center {
    text-align: center;
  }

  .booking-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 2rem;
  }
</style>

<div class="booking-container">
  <h1 class="title">Gebuchte Fahrten</h1>

  {#if loading}
    <p class="info">Lade gebuchte Fahrten...</p>
  {:else if bookings.length > 0}
  {#each bookings as booking}
    <div class="booking-card">
      <div class="info">Von: {booking.StartPlaceName}</div>
      <div class="info">Nach: {booking.FinishPlaceName}</div>
      <div class="info">Datum: {new Date(booking.start).toLocaleString()}</div>
      <div class="info">Fahrer: {booking.Driver}</div>
      <button class="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500" on:click={() => cancelRide(booking)}>Fahrt stornieren</button>
    </div>
  {/each}
  {:else}
    <p class="info">Keine Fahrten gebucht.</p>
  {/if}
</div>