<template>
  <nav class="navbar">
    <div class="nav-container">
      <h1 class="logo"></h1>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/register" class="nav-link">Register</router-link>
        <router-link to="/login" class="nav-link">Login</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
/* 🔥 TRANSPARENT NAVBAR */
.navbar {
  position: absolute; /* 👈 important */
  top: 0;
  width: 100%;
  z-index: 1000;

  background: rgba(255, 255, 255, 0.05); /* light transparent */
  backdrop-filter: blur(10px); /* glass effect 😍 */
}

/* CONTAINER */
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LOGO */
.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
}

/* LINKS */
.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

/* HOVER */
.nav-link:hover,
.router-link-active {
  background: rgba(20, 184, 166, 0.8);
  color: white;
}
</style>