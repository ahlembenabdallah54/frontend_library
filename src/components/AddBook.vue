<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <h2>Add New Book</h2>
        <p class="subtitle">Fill in the book details below</p>
      </div>

      <form @submit.prevent="addBook" novalidate>
        <!-- TITLE -->
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

        <!-- YEAR + EDITOR -->
        <div class="form-row">
          <div class="form-group">
            <label for="year">Publication Year</label>
            <input
              id="year"
              v-model.number="form.year"
              type="number"
              placeholder="1925"
              min="1000"
              max="2100"
              required
            />
          </div>

          <div class="form-group">
            <label for="editor">Author</label>
            <input
              id="editor"
              v-model.trim="form.editor"
              type="text"
              placeholder="Scribner"
              required
            />
          </div>
        </div>

        <!-- COVER IMAGE -->
        <div class="form-group">
          <label for="image">Cover Image URL </label>
          <input
            id="image"
            v-model.trim="form.image"
            type="url"
            placeholder="https://example.com/book-cover.jpg"
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

const form = reactive({
  title: "",
  year: null,
  editor: "",
  image: ""
})

const successMessage = ref("")
const errorMessage = ref("")
const isLoading = ref(false)

const addBook = async () => {
  successMessage.value = ""
  errorMessage.value = ""

  const title = form.title.trim()
  const editor = form.editor.trim()
  const year = Number(form.year)

  // Client-side validation
  if (!title || !editor || !year || isNaN(year) || year < 1000 || year > 2100) {
    errorMessage.value = "Please fill all required fields correctly"
    return
  }

  if (isLoading.value) return

  isLoading.value = true

  try {
    const payload = {
      title,
      year,
      editor,
      image: form.image ? form.image.trim() : null
    }

    await axios.post("http://localhost:3000/books/new", payload)

    successMessage.value = "Book added successfully!"

    // Reset form
    Object.assign(form, {
      title: "",
      year: null,
      editor: "",
      image: ""
    })

  } catch (error) {
    console.error("Add book error:", error)

    if (Array.isArray(error.response?.data?.message)) {
      errorMessage.value = error.response.data.message.join(", ")
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        "Failed to add the book. Please try again."
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f4f0, #f0e6d9);
  padding: 20px;
  font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.card {
  background: white;
  padding: 40px 70px;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid #f5e6d3;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 45px rgba(234, 82, 111, 0.12);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

h2 {
  color: #e85a6f;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #777;
  font-size: 15px;
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 7px;
  font-weight: 600;
  color: #444;
  font-size: 14.5px;
}

input {
  width: 100%;
  padding: 13px 15px;
  border: 2px solid #f5d9c4;
  border-radius: 12px;
  font-size: 16px;
  background: #fffaf5;
  transition: all 0.25s ease;
  color: #333;
}

input:focus {
  outline: none;
  border-color: #e85a6f;
  background: white;
  box-shadow: 0 0 0 4px rgba(232, 90, 111, 0.15);
}

small {
  display: block;
  margin-top: 6px;
  color: #888;
  font-size: 13px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  margin-top: 12px;
  background: linear-gradient(135deg, #e85a6f, #f47c8c);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(232, 90, 111, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.submit-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.message {
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  font-size: 15px;
}

.success {
  background: #d4f4e6;
  color: #0f766e;
  border: 1px solid #a1e4c9;
}

.error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #f5b8b8;
}

@media (max-width: 500px) {
  .card {
    padding: 30px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>