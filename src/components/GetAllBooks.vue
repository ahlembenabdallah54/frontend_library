<template>
  <div class="container">
    <div class="header">
      <h2 class="title">Book List</h2>
      <button class="add-btn" @click="goToAdd">
        + Add Book
      </button>
    </div>

    <div v-if="loading && books.length === 0" class="loading">
      Loading books...
    </div>
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>

    <table class="book-table" v-if="books.length">
      <thead>
        <tr>
          <th>Title</th>
          <th>Year</th>
          <th>Author</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.year }}</td>
          <td>{{ book.editor }}</td>
          <td>
            <img
              :src="getImageUrl(book.image)"
              alt="Book cover"
              class="book-img"
            />
          </td>
          <td class="actions">
            <button class="btn btn-edit" @click="editBook(book.id)">
              Edit
            </button>
            <button class="btn btn-delete" @click="askDelete(book.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!--modal of delete confirmation-->
          <div v-if="showConfirm" class="modal-overlay">
            <div class="modal">
              <h3>Delete Book</h3>
              <p>Are you sure you want to delete this book?</p>

              <div class="modal-actions">
                <button class="btn-cancel" @click="showConfirm = false">
                  Cancel
                </button>
              <button class="btn btn-delete" @click="confirmDelete">
                Delete
              </button>
              </div>
            </div>
          </div>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const books = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()
const route = useRoute()

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

// Convert image path to full URL
const getImageUrl = (image) => {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `http://localhost:3000/${image}`
}

// Fetch all books
const fetchBooks = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books/all')
    books.value = res.data.listeBooks || []
  } catch (err) {
    console.error('Error fetching books:', err)
    error.value = 'Failed to load books. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Navigate to add book page
const goToAdd = () => {
  router.push('/addBook')
}

// Delete book
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
    showToast("Book deleted successfully", "success")
  } catch (err) {
    books.value = previousBooks
    showToast("Failed to delete book", "error")
  }
}

// Edit book
const editBook = (id) => {
  router.push(`/edit/${id}`)
}

onMounted(async () => {
  await fetchBooks()

  const toastData = sessionStorage.getItem("book-toast")

  if (toastData) {
    const toast = JSON.parse(toastData)

    showToast(toast.message, toast.type)

    sessionStorage.removeItem("book-toast")
  }
})
</script>
<!--chwaya style -->
<style scoped>
.container {
  padding: 40px;
  background: linear-gradient(135deg, var(--soft-bg), #ffffff);
  min-height: 100vh;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  color: var(--secondary);
  font-size: 26px;
  font-weight: 700;
}

/* ADD BUTTON */
.add-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 18px rgba(234, 82, 111, 0.25);
  margin-left: auto;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(234, 82, 111, 0.35);
}

/* TABLE */
.book-table {
  width: 80%;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0 10px;
}

/* HEADER ROW */
th {
  background: var(--primary);
  color: white;
  padding: 14px;
  text-align: left;
  font-weight: 600;
}

/* BODY ROWS */
tbody tr {
  background: white;
  box-shadow: 0 6px 18px rgba(255, 138, 91, 0.1);
  border-radius: 12px;
  transition: all 0.2s ease;
}

tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 138, 91, 0.2);
}

td {
  padding: 14px;
  border: none;
}

/* Rounded corners for rows */
tbody tr td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

tbody tr td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* IMAGE */
.book-img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ffe6d1;
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* EDIT */
.btn-edit {
  background: var(--secondary);
  color: white;
}

.btn-edit:hover {
  background: #d64560;
}

/* DELETE */
.btn-delete {
  background: #ff6b6b;
  color: white;
}

.btn-delete:hover {
  background: #e55050;
}

.loading {
  text-align: center;
  font-size: 1.1rem;
  color: var(--primary);
  padding: 40px;
}

.error-message {
  text-align: center;
  color: #e74c3c;
  margin-top: 20px;
  font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    gap: 15px;
  }

  .book-table {
    font-size: 13px;
  }

  .book-img {
    width: 50px;
    height: 70px;
  }
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 14px 18px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  animation: slideIn 0.1s ease;
  z-index: 9999;
}

.toast.success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 14px;
  width: 320px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-cancel {
  background: #ddd;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
}

.btn-confirm {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
}
</style>