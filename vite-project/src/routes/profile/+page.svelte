<script lang="ts">
    import { onMount } from 'svelte';
    import { user } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
  
    let profileData: { username: string; email: string } | null = null;
    let activeRides: any[] = [];
    let archivedRides: any[] = [];
    let loading = true;
  
    onMount(async () => {
      const token = $user?.token;
  
      if (!token) {
        goto('/login');
        return;
      }
  
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        // Fetch profile info
        // const profileRes = await fetch('http://localhost:3500/users/profile', { headers });
        // if (!profileRes.ok) throw new Error('Profil konnte nicht geladen werden');
        // profileData = await profileRes.json();
  
        // Fetch rides
        const ridesRes = await fetch('http://localhost:3500/rides/open', { headers });
        if (!ridesRes.ok) throw new Error('Fahrten konnten nicht geladen werden');
        const rides = await ridesRes.json();

        const archivedRidesRes = await fetch('http://localhost:3500/rides/archive', { headers });
        if (!archivedRidesRes.ok) throw new Error('Archivierte Fahrten konnten nicht geladen werden');
        const archivedRidesData = await archivedRidesRes.json();
  
        activeRides = rides.filter((r: any) => !r.archived);
        archivedRides = archivedRidesData.filter((r: any) => r.archived);
      } catch (err) {
        console.error(err);
        goto('/login');
      } finally {
        loading = false;
      }
    });
  </script>
  
  <style>
    .section {
      margin-top: 2rem;
    }
  
    .ride-card {
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
  
  {#if loading}
    <p>Lade Profil...</p>
  {:else if profileData}
    <h1>Profil</h1>
    <!-- <p><strong>Benutzername:</strong> {profileData.username}</p>
    <p><strong>Email:</strong> {profileData.email}</p> -->
  
    <div class="section">
      <h2>Aktive Fahrten</h2>
      {#if activeRides.length > 0}
        {#each activeRides as ride}
          <div class="ride-card">
            <div class="title">{ride.title}</div>
            <div class="info">Von: {ride.start} → Nach: {ride.dest}</div>
            <div class="info">Datum: {ride.date}</div>
          </div>
        {/each}
      {:else}
        <p>Keine aktiven Fahrten vorhanden.</p>
      {/if}
    </div>
  
    <div class="section">
      <h2>Archivierte Fahrten</h2>
      {#if archivedRides.length > 0}
        {#each archivedRides as ride}
          <div class="ride-card">
            <div class="title">{ride.title}</div>
            <div class="info">Von: {ride.start} → Nach: {ride.dest}</div>
            <div class="info">Datum: {ride.date}</div>
          </div>
        {/each}
      {:else}
        <p>Keine archivierten Fahrten vorhanden.</p>
      {/if}
    </div>
  {:else}
    <p>Benutzerdaten konnten nicht geladen werden.</p>
  {/if}