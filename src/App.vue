<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: 'Segoe UI', system-ui, sans-serif;
}
</style>
