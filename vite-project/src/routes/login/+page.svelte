<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation'; 

  let username = '';
  let password = '';
  let rePassword = '';
  let email = '';
  let showModal = false;

  // Set a cookie
  function setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue}; ${expires}; Secure; SameSite=Strict`;
  }

  // Login
  async function login_click() {
    if (!username || !password) {
      console.error('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3500/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.error('Login failed:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);
      setCookie('token', data.token, 7);
      user.set({ token: data.token, username: username }); // ✅ Update store
      goto('/'); // Redirect to home page
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  // Registration
  async function register_click() {
    if (!username || !password || !email || password !== rePassword) {
      console.error('Please fill in all fields and ensure passwords match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3500/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        console.error('Registration failed:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setCookie('authToken', data.token, 7);
      user.set({ token: data.token, username: data.username }); // ✅ Update store
      goto('/');
      closeModal();
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>

<!-- Original CSS retained -->
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  .navbar {
    background-color: #333;
    color: white;
    width: 100%;
    padding: 1rem;
    text-align: center;
    font-size: 1.2rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .loginField {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loginField input {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .loginField button {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s ease;
  }

  .loginField button:hover {
    background-color: #0056b3;
  }

  footer {
    margin-top: auto;
    padding: 1rem;
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }

  /* Modal styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    width: 300px;
  }

  .modal-content input {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .modal-content button {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s ease;
  }

  .modal-content button:hover {
    background-color: #0056b3;
  }

  .close-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #ccc;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .close-btn:hover {
    background-color: #999;
  }
</style>

<!-- Original Layout -->
<div class="content">
  <div class="loginField">
    <h2>Login</h2>
    <input id="username" type="text" placeholder="Username" bind:value={username} />
    <input id="password" type="password" placeholder="Password" bind:value={password} />
    <button id="loginButton" on:click={login_click} >Login</button>
    <p>or</p>
    <button id="registerButton" on:click={openModal}>Register</button>
  </div>
</div>

{#if showModal}
  <div class="modal" role="dialog" aria-modal="true" tabindex="0" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()}>
    <div class="modal-content" role="document" on:click|stopPropagation>
      <h2>Register</h2>
      <input type="text" placeholder="Username" bind:value={username} />
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <input type="password" placeholder="Reenter Password" bind:value={rePassword} />
      <button on:click={register_click}>Submit</button>
      <button class="close-btn" on:click={closeModal}>Close</button>
    </div>
  </div>
{/if}

<footer>
  <p>&copy; 2025 Ride-Share. All rights reserved.</p>
</footer>