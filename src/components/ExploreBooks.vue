<template>
  <div class="explore-container">
    <div class="section-header">
      <h2 class="section-title">Explore Our Collection</h2>
      <p class="section-subtitle">Find your next great read</p>
    </div>

    <div v-if="loading" class="loading">Loading books...</div>

    <div class="books-grid" v-else-if="books.length">
      <div v-for="book in books" :key="book.id" class="book-card">
        <div class="book-cover">
          <img :src="getImageUrl(book.image)" :alt="book.title" />

          <!-- Favorite Emoji -->
          <button 
            class="favorite-btn"
            @click.stop="toggleFavorite(book)"
          >
            {{ book.isFavorite ? '❤️' : '♡' }}
          </button>

          <div class="actions-overlay">
            <!-- View Details button removed as requested -->
          </div>
        </div>

        <div class="book-body">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-meta">{{ book.editor }} • {{ book.year }}</p>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>No books found in the library yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const loading = ref(true)

const getImageUrl = (image) => {
  if (!image) return ''
  return image.startsWith('http') ? image : `http://localhost:3000/${image}`
}

const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books/all')
    books.value = res.data.listeBooks || []
  } catch (err) {
    console.error('Failed to fetch books:', err)
  } finally {
    loading.value = false
  }
}

/* Favorite Toggle */
const toggleFavorite = (book) => {
  book.isFavorite = !book.isFavorite
  // You can add API call here later if needed
}

/* INIT */
onMounted(fetchBooks)
</script>

<style scoped>
.explore-container {
  min-height: 100vh;
  background: #0f0d0b;
  color: #FAF0D8;
  padding: 90px 40px 60px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-family: Georgia, serif;
  font-size: 2.4rem;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #c89b64;
  font-size: 1.15rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.book-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(220, 155, 80, 0.12);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.book-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 140, 66, 0.4);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.book-cover {
  position: relative;
  aspect-ratio: 2 / 3;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.book-card:hover img {
  transform: scale(1.08);
}

/* Favorite Button */
.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.75);
  border: none;
  font-size: 1.6rem;
  padding: 4px 10px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.3);
}

/* Overlay (kept empty as requested) */
.actions-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .actions-overlay {
  opacity: 1;
}

.book-body {
  padding: 16px;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.3;
}

.book-meta {
  font-size: 0.85rem;
  color: rgba(200, 155, 100, 0.65);
}

.loading, .empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #FF8C42;
  font-size: 1.1rem;
}
</style>