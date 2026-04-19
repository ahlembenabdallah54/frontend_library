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
            <span :class="favorites[book.id] ? 'heart active' : 'heart'">♥</span>
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
const favorites = ref({})
const token = localStorage.getItem("token")

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

// check favorites for all books
const checkFavorites = async () => {
  try {
    for (const book of books.value) {
      const res = await axios.get(
        `http://localhost:3000/books/favorites/${book.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      favorites.value[book.id] = res.data.isFavorite
    }
  } catch (err) {
    console.error('Error checking favorites:', err)
  }
}
// toggle favorite
const toggleFavorite = async (book) => {
  const id = book.id

  try {
    if (favorites.value[id]) {
      await axios.delete(`http://localhost:3000/books/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      showToast('Removed from favorites')
    } else {
      await axios.post(
        `http://localhost:3000/books/favorites/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showToast('Added to favorites')
    }

    // update UI instantly
    favorites.value[id] = !favorites.value[id]

  } catch (err) {
    console.error('Failed to toggle favorite:', err)
    showToast('Failed to update favorites')
  }
}
// toast
const showToast = (message) => {
  const toast = document.createElement('div')
  toast.className = 'toast success'
  toast.textContent = message

  toast.style.position = 'fixed'
  toast.style.bottom = '20px'
  toast.style.left = '50%'
  toast.style.transform = 'translateX(-50%)'
  toast.style.padding = '14px 24px'
  toast.style.borderRadius = '10px'
  toast.style.background = '#10b981'
  toast.style.color = 'white'
  toast.style.zIndex = '99999'

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 300)
  }, 2500)
}
onMounted(async () => {
  await fetchBooks()
  await checkFavorites()
})
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
  transition: all 0.25s ease;
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
  background: rgba(0, 0, 0, 0.6);
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.15);
  background: rgba(0, 0, 0, 0.8);
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
.heart {
  font-size: 18px;
  color: #aaa;
  transition: all 0.2s ease;
}

.heart.active {
  color: #ff4d6d;
  transform: scale(1.2);
  text-shadow: 0 0 10px rgba(255, 77, 109, 0.6);
}
</style>