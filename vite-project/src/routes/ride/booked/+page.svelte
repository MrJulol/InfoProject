<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let bookings: any[] = [];
  let loading = true;

  onMount(async () => {
    const token = $user?.token;

    if (!token) {
      goto('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3500/booking/userBookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Fehler beim Laden der Buchungen');

      bookings = await res.json();
    } catch (err) {
      console.error(err);
      goto('/login');
    } finally {
      loading = false;
    }
  });
</script>

<style>
  .booking-card {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
  }

  .title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .info {
    color: #555;
  }
</style>

<h1 class="text-2xl font-bold mb-4">Gebuchte Fahrten</h1>

{#if loading}
  <p>Lade gebuchte Fahrten...</p>
{:else if bookings.length > 0}
  {#each bookings as booking}
    <div class="booking-card">
      <div class="title">{booking.ride?.title}</div>
      <div class="info">Von: {booking.ride?.start} → Nach: {booking.ride?.dest}</div>
      <div class="info">Datum: {booking.ride?.date}</div>
    </div>
  {/each}
{:else}
  <p>Keine Fahrten gebucht.</p>
{/if}