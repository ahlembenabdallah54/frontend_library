import { createRouter, createWebHistory } from 'vue-router'

import AddBook from '../components/AddBook.vue'
import BookList from '../components/GetAllBooks.vue'
import EditBook from '../components/EditBook.vue'

const routes = [
  { path: '/addBook', component: AddBook },
  { path: '/books', component: BookList },
  {path: '/edit/:id',component: EditBook}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router