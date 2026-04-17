<template>
  <div class="book-detail-container">
    <!-- Back Button -->
    <button class="back-btn" @click="goBack">
      ← Back to Explore
    </button>

    <div v-if="loading" class="loading">Loading book details...</div>

    <div v-else-if="book" class="book-detail">
      <div class="book-cover-large">
        <img :src="getImageUrl(book.image)" :alt="book.title" />
      </div>

      <div class="book-info">
        <h1 class="book-title">{{ book.title }}</h1>
        
        <div class="book-meta-info">
          <p><strong>Author/Editor:</strong> {{ book.editor }}</p>
          <p><strong>Year:</strong> {{ book.year }}</p>
          <p v-if="book.isbn"><strong>ISBN:</strong> {{ book.isbn }}</p>
          <p v-if="book.pages"><strong>Pages:</strong> {{ book.pages }}</p>
        </div>

        <div class="book-description" v-if="book.description">
          <h3>Description</h3>
          <p>{{ book.description }}</p>
        </div>

        <div class="book-actions">
          <button class="btn-favorite" @click="toggleFavorite">
            ❤️ Add to Favourites
          </button>
          <button class="btn-primary" @click="showToast('Book borrowed successfully! (Demo)')">
            Borrow Book
          </button>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Book not found</h2>
      <button class="btn-primary" @click="goBack">Return to Explore</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const book = ref(null)
const loading = ref(true)

const getImageUrl = (image) => {
  if (!image) return ''
  return image.startsWith('http') ? image : `http://localhost:3000/${image}`
}

const fetchBook = async () => {
  const id = route.params.id
  try {
    const res = await axios.get(`http://localhost:3000/books/${id}`)
    book.value = res.data
  } catch (err) {
    console.error('Failed to fetch book:', err)
    book.value = null
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/explore')
}

const toggleFavorite = () => {
  // TODO: Connect to real favorites API later
  showToast('Added to your favourites ❤️')
}

const showToast = (message) => {
  // Simple toast for demo
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

onMounted(fetchBook)
</script>

<style scoped>
.book-detail-container {
  min-height: 100vh;
  background: #0f0d0b;
  color: #FAF0D8;
  padding: 100px 40px 60px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.back-btn {
  position: absolute;
  top: 90px;
  left: 40px;
  background: none;
  border: none;
  color: #c89b64;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255, 140, 66, 0.1);
  color: #FF8C42;
}

.book-detail {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 60px;
  align-items: start;
}

.book-cover-large {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  aspect-ratio: 2 / 3;
  max-width: 380px;
  margin: 0 auto;
}

.book-cover-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info h1 {
  font-family: Georgia, serif;
  font-size: 2.4rem;
  line-height: 1.2;
  margin-bottom: 20px;
}

.book-meta-info {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #e8d5b8;
  margin-bottom: 30px;
}

.book-meta-info strong {
  color: #FF8C42;
}

.book-description {
  margin-bottom: 40px;
}

.book-description h3 {
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #FF8C42;
}

.book-description p {
  font-size: 1.02rem;
  line-height: 1.7;
  color: #d4b68a;
}

.book-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-favorite {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.08);
  color: #FF8C42;
  border: 1px solid rgba(255, 140, 66, 0.4);
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-favorite:hover {
  background: rgba(255, 60, 60, 0.15);
  border-color: #ff4444;
  color: #ff6666;
}

.btn-primary {
  padding: 12px 32px;
  background: linear-gradient(135deg, #FF7A2F, #E8521A);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1.05rem;
}

.loading, .not-found {
  text-align: center;
  padding: 100px 20px;
  color: #FF8C42;
  font-size: 1.2rem;
}

.not-found h2 {
  color: #FAF0D8;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 900px) {
  .book-detail {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .book-cover-large {
    max-width: 280px;
  }
}
</style>