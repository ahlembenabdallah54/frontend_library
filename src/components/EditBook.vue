<template>
  <div class="container">
    <h2>Edit Book</h2>

    <form @submit.prevent="updateBook" class="form">

      <input v-model="book.title" placeholder="Title" />
      <input v-model="book.year" placeholder="Year" />
      <input v-model="book.editor" placeholder="Author" />

      <button type="submit">Save Changes</button>
    </form>
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
    const res = await axios.get(`http://localhost:3000/books/search/${id}`)

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
      book.value
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
      state: { updated: false }
    })

  } finally {
    loading.value = false
  }
}

onMounted(fetchBook)
</script>

<style scoped>
.container {
  max-width: 520px;
  margin: 70px auto;
  padding: 30px;
  background: linear-gradient(145deg, #ffffff, #f9fafb);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f1f1;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 22px;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.5px;
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
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  background: #fff;
}

input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

/* BUTTON */
button {
  margin-top: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.25);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>