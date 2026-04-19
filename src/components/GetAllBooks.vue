<template>
  <div class="container">

    <!-- HEADER -->
    <div class="section-header">
      <h2 class="section-title">Manage Books</h2>
      <button class="btn-primary" @click="goToAdd">
        + Add Book
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading && books.length === 0" class="loading">
      Loading books...
    </div>

    <!-- TOAST -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>

    <!-- BOOK GRID -->
    <div class="books-grid" v-if="books.length">
      <div v-for="book in books" :key="book.id" class="book-card">

        <div class="book-cover">
          <img :src="getImageUrl(book.image)" :alt="book.title" />


          <!-- ACTIONS OVERLAY -->
          <div class="actions-overlay">
            <button class="btn-edit" @click="editBook(book.id)">
              Edit
            </button>
            <button class="btn-delete" @click="askDelete(book.id)">
              Delete
            </button>
          </div>
        </div>

        <div class="book-body">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-meta">
            {{ book.editor }} • {{ book.year }}
          </p>
        </div>

      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="!loading && books.length === 0" class="empty">
      No books found.
    </div>

    <!-- DELETE MODAL -->
    <div v-if="showConfirm" class="modal-overlay">
      <div class="modal">
        <h3>Delete Book</h3>
        <p>Are you sure you want to delete this book?</p>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showConfirm = false">
            Cancel
          </button>
          <button class="btn-delete" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- ERROR -->
    <p v-if="error" class="error-message">{{ error }}</p>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const books = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

/* TOAST */
const toast = ref({
  show: false,
  message: "",
  type: "success"
})

const showToast = (message, type = "success") => {
  toast.value.message = message
  toast.value.type = type
  toast.value.show = true

  setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

/* IMAGE */
const getImageUrl = (image) => {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `http://localhost:3000/${image}`
}

/* FETCH */
const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books/all')
    books.value = res.data.listeBooks || []
  } catch (err) {
    error.value = 'Failed to load books.'
  } finally {
    loading.value = false
  }
}


/* NAVIGATION */
const goToAdd = () => router.push('/addBook')
const editBook = (id) => router.push(`/edit/${id}`)

/* DELETE */
const showConfirm = ref(false)
const selectedId = ref(null)

const askDelete = (id) => {
  selectedId.value = id
  showConfirm.value = true
}

const confirmDelete = async () => {
  const id = selectedId.value
  showConfirm.value = false

  const previousBooks = [...books.value]
  books.value = books.value.filter(b => b.id !== id)

  try {
    await axios.delete(`http://localhost:3000/books/delete/${id}`)
    showToast("Book deleted successfully")
  } catch (err) {
    books.value = previousBooks
    showToast("Failed to delete book", "error")
  }
}

/* INIT */
onMounted(async () => {
  await fetchBooks()

  const toastData = sessionStorage.getItem("book-toast")
  if (toastData) {
    const t = JSON.parse(toastData)
    showToast(t.message, t.type)
    sessionStorage.removeItem("book-toast")
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #0f0d0b;
  color: #FAF0D8;
  padding: 90px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* HEADER */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-title {
  font-family: Georgia, serif;
  font-size: 2rem;
  font-weight: 400;
}

/* GRID */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 28px;
}

/* CARD */
.book-card {
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(220, 155, 80, 0.1);
  transition: 0.25s;
}

.book-card:hover {
  transform: translateY(-6px);
}

/* COVER */
.book-cover {
  position: relative;
  aspect-ratio: 2/3;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.35s;
}

.book-card:hover img {
  transform: scale(1.05);
}

/* Favorite Button */
.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px 9px;
  border-radius: 50%;
  z-index: 10;
  transition: 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.25);
}

/* OVERLAY */
.actions-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: 0.25s;
}

.book-card:hover .actions-overlay {
  opacity: 1;
}

/* BODY */
.book-body {
  padding: 16px;
}

.book-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.book-meta {
  font-size: 0.8rem;
  color: rgba(200,155,100,0.6);
}

/* BUTTONS */
.btn-primary {
  padding: 12px 22px;
  background: linear-gradient(135deg, #FF7A2F, #E8521A);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-edit {
  background: #3b82f6;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
}

.btn-delete {
  background: #ef4444;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #1a140f;
  color: #FAF0D8;
  padding: 25px;
  border-radius: 14px;
  width: 320px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-cancel {
  background: #555;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
}

/* TOAST */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 14px;
  border-radius: 10px;
  color: white;
  z-index: 99999;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

/* STATES */
.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #FF8C42;
}

.error-message {
  text-align: center;
  color: #ef4444;
}
</style>