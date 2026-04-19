<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const favorites = ref([])
const loading = ref(true)

const token = localStorage.getItem('token')

const fetchFavorites = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    })
    favorites.value = res.data
  } catch (err) {
    console.error('Failed to load favorites:', err)
  } finally {
    loading.value = false
  }
}

const getImageUrl = (image) => {
  if (!image) return ''
  return image.startsWith('http')
    ? image
    : `http://localhost:3000/${image}`
}

onMounted(fetchFavorites)
</script>

<template>
  <div class="fav-container">

    <!-- Header -->
    <div class="fav-header">
      <h1>Your personal collection of favorite books</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Loading your favorites...
    </div>

    <!-- Empty state -->
    <div v-else-if="favorites.length === 0" class="empty">
      <div class="empty-box">
        <div class="icon">📚</div>
        <h2>No favorites yet</h2>
        <p>Start exploring and add books you love</p>
      </div>
    </div>

    <!-- Grid -->
    <div v-else class="grid">
      <div v-for="book in favorites" :key="book.id" class="card">

        <div class="cover">
          <img :src="getImageUrl(book.image)" :alt="book.title" />
        </div>

        <div class="info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.editor }} • {{ book.year }}</p>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.fav-container {
  min-height: 100vh;
  background: #0f0d0b;
  color: #FAF0D8;
  padding: 100px 40px 60px;
  font-family: 'Segoe UI', sans-serif;
}

/* HEADER */
.fav-header {
  text-align: center;
  margin-bottom: 50px;
}

.fav-header h1 {
  font-size: 2.6rem;
  font-family: Georgia, serif;
  color: #FF8C42;
}

.fav-header p {
  color: #c89b64;
  margin-top: 8px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
}

/* CARD */
.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 140, 66, 0.15);
  border-radius: 14px;
  overflow: hidden;
  transition: 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 140, 66, 0.4);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.cover {
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.4s ease;
}

.card:hover img {
  transform: scale(1.05);
}

/* INFO */
.info {
  padding: 14px;
}

.info h3 {
  font-size: 1rem;
  margin-bottom: 6px;
}

.info p {
  font-size: 0.85rem;
  color: #c89b64;
}

/* EMPTY STATE */
.empty {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.empty-box {
  text-align: center;
  padding: 40px;
  border: 1px dashed rgba(255, 140, 66, 0.3);
  border-radius: 16px;
  max-width: 400px;
}

.empty .icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.empty h2 {
  color: #FF8C42;
}

/* LOADING */
.loading {
  text-align: center;
  color: #c89b64;
}
</style>