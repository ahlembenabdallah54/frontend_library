<template>
  <div class="page">
    <div class="card">
      <div class="header">
        <h2>Add New Book</h2>
        <p class="subtitle">Fill in the book details below</p>
      </div>

      <form @submit.prevent="addBook" novalidate>
        <!-- title -->
        <div class="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            v-model.trim="form.title"
            type="text"
            placeholder="The Great Gatsby"
            required
          />
        </div>

        <!-- year & author -->
        <div class="form-row">
          <div class="form-group">
            <label for="year">Publication Year</label>
            <input
              id="year"
              v-model.number="form.year"
              type="number"
              min="1000"
              max="2100"
              placeholder="1925"
              required
            />
          </div>

          <div class="form-group">
            <label for="editor">Author</label>
            <input
              id="editor"
              v-model.trim="form.editor"
              type="text"
              placeholder="F. Scott Fitzgerald"
              required
            />
          </div>
        </div>

        <!-- Cover Image -->
        <div class="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            @change="handleFile"
            accept="image/*"
          />
        </div>

        <!-- SUBMIT BUTTON -->
        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? "Adding Book..." : "Add Book" }}
        </button>
      </form>

      <!-- MESSAGES -->
      <div v-if="successMessage" class="message success">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="message error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

// Reactive form data
const form = reactive({
  title: "",
  year: null,
  editor: ""
})

// File handling
const file = ref(null)
const token = localStorage.getItem("token")
// UI states
const successMessage = ref("")
const errorMessage = ref("")
const isLoading = ref(false)

// Router for redirection
const router = useRouter()

// Handle file selection
const handleFile = (event) => {
  file.value = event.target.files[0]
}

// Add new book
const addBook = async () => {
  // Clear previous messages
  successMessage.value = ""
  errorMessage.value = ""

  const title = form.title.trim()
  const editor = form.editor.trim()
  const year = Number(form.year)

  // Basic validation
  if (!title || !editor || !year || isNaN(year)) {
    errorMessage.value = "Please fill all required fields correctly"
    return
  }

  if (isLoading.value) return
  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("year", year)
    formData.append("editor", editor)

    if (file.value) {
      formData.append("image", file.value)
    }

    // Send request to backend
    await axios.post("http://localhost:3000/books/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    })

    // Success
    successMessage.value = "Book added successfully!"

    // Reset form
    form.title = ""
    form.year = null
    form.editor = ""
    file.value = null

    // Reset file input visually
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ""

    // Redirect to All Books page after short delay
    setTimeout(() => {
      router.push("/books")     // ← Change this path if your All Books route is different
    }, 1500)

  } catch (error) {
    console.error("Add book error:", error)
    errorMessage.value = 
      error.response?.data?.message || 
      "Failed to add book. Please try again."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #0f0d0b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.card {
  width: 450px;
  padding: 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(220, 155, 80, 0.15);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.header {
  text-align: center;
  margin-bottom: 25px;
}

h2 {
  font-family: Georgia, serif;
  font-size: 28px;
  color: #FAF0D8;
  font-weight: 400;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 13px;
  color: rgba(200, 155, 100, 0.6);
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group label {
  color: rgba(250, 200, 140, 0.8);
  font-size: 13px;
  margin-bottom: 6px;
  display: block;
}

input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(220, 155, 80, 0.2);
  background: rgba(255, 255, 255, 0.04);
  color: #FAF0D8;
  outline: none;
}

input::placeholder {
  color: rgba(200, 155, 100, 0.4);
}

input:focus {
  border-color: #FF7A2F;
  box-shadow: 0 0 0 3px rgba(255,122,47,0.15);
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
}

.submit-btn {
  margin-top: 10px;
  padding: 13px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FF7A2F, #E8521A);
  transition: 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(232, 82, 26, 0.35);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 12px;
  text-align: center;
  font-weight: 500;
}

.success {
  color: #34d399;
}

.error {
  color: #f87171;
}
</style>