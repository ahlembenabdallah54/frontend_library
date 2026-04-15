import { ref } from 'vue'

export const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'))

export function setUser(userData) {
  localStorage.setItem('user', JSON.stringify(userData))
  currentUser.value = userData
}

export function clearUser() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  currentUser.value = null
}