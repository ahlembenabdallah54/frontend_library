<template>
  <div class="container">
    <div class="header">
      <h2 class="title">Book List</h2>
      <button class="add-btn" @click="goToAdd">
        + Add Book
      </button>
    </div>

    <div v-if="loading" class="loading">Loading books...</div>

    <table v-else class="book-table">
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
            <button class="btn btn-delete" @click="deleteBook(book.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

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
const deleteBook = async (id) => {
  if (!confirm('Are you sure you want to delete this book?')) return

  try {
    await axios.delete(`http://localhost:3000/books/${id}`)
    // Optimistic update
    books.value = books.value.filter((book) => book.id !== id)
  } catch (err) {
    console.error('Error deleting book:', err)
    error.value = 'Failed to delete the book.'
  }
}

// Edit book
const editBook = (id) => {
  router.push(`/edit/${id}`)
}

onMounted(() => {
  fetchBooks()
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
</style>