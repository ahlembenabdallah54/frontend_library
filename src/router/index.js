import { createRouter, createWebHistory } from 'vue-router'

import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import AddBook from '../components/AddBook.vue'
import BookList from '../components/GetAllBooks.vue'
import EditBook from '../components/EditBook.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home 
  },

  {
    path: '/register',
    name: 'Register',
    component: Register
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
    { path: '/addBook', component: AddBook },
  { path: '/books', component: BookList },
  {path: '/edit/:id',component: EditBook}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router