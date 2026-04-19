import { createRouter, createWebHistory } from 'vue-router'

import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

// Components
import AddBook from '../components/AddBook.vue'
import BookList from '../components/GetAllBooks.vue'
import EditBook from '../components/EditBook.vue'
import ExploreBooks from '../components/ExploreBooks.vue'

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

  // Admin Routes
  {
    path: '/addBook',
    name: 'AddBook',
    component: AddBook
  },
  {
    path: '/books',
    name: 'ManageBooks',
    component: BookList
  },
  {
    path: '/edit/:id',
    name: 'EditBook',
    component: EditBook
  },

  // Normal User Routes
  {
    path: '/explore',
    name: 'Explore',
    component: ExploreBooks
  },
{
  path: '/favorites', // route to user's favorite books
  component: () => import('../components/Favorites.vue')
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router