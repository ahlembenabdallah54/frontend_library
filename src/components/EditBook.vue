<template>
  <div class="page">

        <div class="card">

      <div class="header">
        <h2 class="title">Edit Book</h2>
        <p class="subtitle">Update your book details</p>
      </div>

        <form @submit.prevent="updateBook" class="form">

          <input v-model="book.title" placeholder="Title" />
          <input v-model="book.year" placeholder="Year" />
          <input v-model="book.editor" placeholder="Author" />

           <button type="submit" :disabled="loading">
          {{ loading ? "Saving..." : "Save Changes" }}
        </button>
        </form>
      </div>
      </div>
  </template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const book = ref({
  title: "",
  year: "",
  editor: ""
})

// GET BOOK BY ID
const fetchBook = async () => {
  try {
    const id = route.params.id
    const token = localStorage.getItem("token")
    const res = await axios.get(`http://localhost:3000/books/search/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = Array.isArray(res.data) ? res.data[0] : res.data

    book.value = {
      title: data.title,
      year: data.year,
      editor: data.editor
    }
  } catch (err) {
    console.error("FETCH ERROR:", err)
  }
}

// UPDATE BOOK
const updateBook = async () => {
  loading.value = true

  try {
    const id = route.params.id

    await axios.put(
      `http://localhost:3000/books/edit/${id}`,
      book.value,
      {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
      }
    )

// set flash message
sessionStorage.setItem("book-toast", JSON.stringify({
  type: "success",
  message: "Book updated successfully"
}))

router.push("/books")

  } catch (err) {
    router.push({
      path: "/books",
      state: { updated: false },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

  } finally {
    loading.value = false
  }
}

onMounted(fetchBook)
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

/* CARD */
.card {
  width: 420px;
  padding: 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(220, 155, 80, 0.15);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

/* HEADER */
.header {
  text-align: center;
  margin-bottom: 25px;
}

.title {
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  color: #FAF0D8;
}

.subtitle {
  font-size: 13px;
  color: rgba(200, 155, 100, 0.6);
  margin-top: 6px;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* INPUTS */
input {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(220, 155, 80, 0.2);
  background: rgba(255, 255, 255, 0.04);
  color: #FAF0D8;
  outline: none;
  transition: 0.2s;
}

input::placeholder {
  color: rgba(200, 155, 100, 0.4);
}

input:focus {
  border-color: #FF7A2F;
  box-shadow: 0 0 0 3px rgba(255, 122, 47, 0.15);
}

/* BUTTON */
button {
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FF7A2F, #E8521A);
  transition: 0.2s;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(232, 82, 26, 0.35);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>