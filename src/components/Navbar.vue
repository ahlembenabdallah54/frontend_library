<template>
  <nav class="navbar">
    <div class="nav-inner">

      <!-- LOGO -->
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <span class="logo-text">Library</span>
      </router-link>

      <!-- CENTER LINKS -->
      <nav class="nav-links" v-if="!isMobile">
        <router-link v-for="link in navLinks" 
                     :key="link.path"
                     :to="link.path"
                     class="nav-link">{{ link.name }}</router-link>
      </nav>

      <!-- RIGHT SIDE -->
      <div class="nav-right">

        <!-- Search -->
        <button class="icon-btn" title="Search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        <!-- Logged in -->
        <template v-if="currentUser">
          <div class="profile-wrap" ref="profileWrap">
            <div class="profile-btn" @click.stop="ddOpen = !ddOpen">
              <div class="avatar">{{ userInitial }}</div>
              <span class="profile-name">{{ currentUser.name }}</span>
              <svg class="chevron" :class="{ open: ddOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            <Transition name="dropdown">
              <div class="dropdown" v-if="ddOpen">
                <div class="dd-header">
                  <div class="dd-name">{{ currentUser.name }}</div>
                  <div class="dd-email">{{ currentUser.email || '' }}</div>
                </div>

                <!-- ONLY Admin sees Manage Books -->
                <div v-if="isAdmin" class="dd-item" @click="goToManageBooks">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Manage Books
                </div>

                <div class="dd-divider" v-if="isAdmin" />

                <!-- Logout for everyone -->
                <div class="dd-item danger" @click="logout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log out
                </div>
              </div>
            </Transition>
          </div>
        </template>

        <!-- Not logged in -->
        <template v-else>
          <router-link to="/register" class="nav-link">Register</router-link>
          <router-link to="/login" class="nav-btn">Sign in</router-link>
        </template>

        <!-- Hamburger -->
        <button class="hamburger" @click="mobileOpen = !mobileOpen" v-if="isMobile">
          <span :class="{ open: mobileOpen }"/>
          <span :class="{ open: mobileOpen }"/>
          <span :class="{ open: mobileOpen }"/>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div class="mobile-menu" v-if="isMobile && mobileOpen">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="mobile-link" @click="mobileOpen = false">
          {{ link.name }}
        </router-link>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, clearUser, setUser } from '../stores/auth'

const router = useRouter()

const ddOpen = ref(false)
const mobileOpen = ref(false)
const isMobile = ref(window.innerWidth <= 700)
const profileWrap = ref(null)

const userInitial = computed(() => currentUser.value?.name?.charAt(0)?.toUpperCase() || '?')

const isAdmin = computed(() => currentUser.value?.role === 'admin')

// Debug: Watch currentUser to see if role updates
watch(currentUser, (newVal) => {
  console.log(' Current User changed:', newVal)
  console.log('Is Admin?', newVal?.role === 'admin')
}, { immediate: true })

const goToManageBooks = () => {
  ddOpen.value = false
  router.push('/books')
}

const logout = () => {
  clearUser()
  ddOpen.value = false
  router.push('/login')
}

const handleResize = () => { isMobile.value = window.innerWidth <= 700 }

const handleClickOutside = (e) => {
  if (profileWrap.value && !profileWrap.value.contains(e.target)) {
    ddOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({
        name: payload.username || payload.name,
        role: payload.role
      })
      console.log(' Token decoded and user set:', payload)
    } catch (err) {
      console.error(" Invalid token", err)
      clearUser()
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})

const navLinks = computed(() => {
  if (isAdmin.value) {
    return [
      { name: 'Home', path: '/' },
      { name: 'Manage Books', path: '/books' },
      { name: 'Manage Authors', path: '/authors' }
    ]
  }
  return [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Favourites', path: '/favourites' }
  ]
})
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; }

.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: rgba(15, 8, 3, 0.75); border-bottom: 1px solid rgba(255, 140, 60, 0.12);
  backdrop-filter: blur(20px); }

.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 2rem; }

.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
.logo-icon { width: 34px; height: 34px; background: rgba(255, 130, 50, 0.15);
  border: 1px solid rgba(255, 130, 50, 0.3); border-radius: 10px;
  display: flex; align-items: center; justify-content: center; }
.logo-text { font-family: Georgia, serif; font-size: 19px; font-weight: 500;
  color: #FAF0D8; letter-spacing: 0.3px; }

.nav-links { display: flex; align-items: center; gap: 4px; }

.nav-link { position: relative; text-decoration: none; color: rgba(220, 180, 130, 0.7);
  font-size: 14px; font-weight: 500; padding: 7px 14px; border-radius: 8px;
  transition: color 0.2s, background 0.2s; white-space: nowrap; }
.nav-link:hover { color: #FAF0D8; background: rgba(255, 140, 60, 0.08); }
.nav-link.router-link-active { color: #FF8C42; background: rgba(255, 140, 60, 0.1); }

.nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

.icon-btn { width: 34px; height: 34px; border: 1px solid rgba(255, 140, 60, 0.2);
  background: rgba(255,255,255,0.04); border-radius: 8px; display: flex;
  align-items: center; justify-content: center; cursor: pointer;
  color: rgba(220, 180, 130, 0.6); }
.icon-btn:hover { background: rgba(255, 140, 60, 0.1); color: #FF8C42; }

.nav-btn { text-decoration: none; background: linear-gradient(135deg, #FF7A2F, #E8521A);
  color: #fff; font-size: 13.5px; font-weight: 600; padding: 7px 16px;
  border-radius: 8px; }

.profile-wrap { position: relative; }
.profile-btn { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255, 140, 60, 0.18); border-radius: 100px;
  padding: 5px 12px 5px 5px; cursor: pointer; }
.profile-btn:hover { background: rgba(255, 140, 60, 0.1); }

.avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #FF7A2F, #E8521A);
  display: flex; align-items: center; justify-content: center; font-size: 12px;
  font-weight: 600; color: #fff; }
.profile-name { font-size: 13.5px; font-weight: 500; color: rgba(240, 210, 170, 0.9); }

.chevron { width: 14px; height: 14px; color: rgba(200, 160, 110, 0.5); transition: transform 0.25s; }
.chevron.open { transform: rotate(180deg); }

.dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 200px;
  background: rgba(18, 10, 4, 0.96); border: 1px solid rgba(255, 140, 60, 0.18);
  border-radius: 14px; padding: 6px; backdrop-filter: blur(20px); }
.dd-header { padding: 10px 12px 8px; border-bottom: 1px solid rgba(255, 140, 60, 0.1); margin-bottom: 4px; }
.dd-name { font-size: 13px; font-weight: 500; color: rgba(240, 210, 160, 0.9); }
.dd-email { font-size: 11.5px; color: rgba(180, 130, 80, 0.6); margin-top: 2px; }

.dd-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: 8px; cursor: pointer; color: rgba(210, 170, 120, 0.8);
  font-size: 13.5px; transition: background 0.15s, color 0.15s; }
.dd-item svg { width: 15px; height: 15px; flex-shrink: 0; opacity: 0.65; }
.dd-item:hover { background: rgba(255, 140, 60, 0.1); color: #FAF0D8; }
.dd-divider { height: 1px; background: rgba(255, 140, 60, 0.1); margin: 4px 0; }
.dd-item.danger { color: rgba(255, 120, 100, 0.8); }
.dd-item.danger:hover { background: rgba(220, 60, 40, 0.12); color: #FF8888; }

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

.hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none;
  cursor: pointer; padding: 6px; border-radius: 8px; }
.hamburger span { display: block; width: 20px; height: 2px; background: rgba(220, 170, 110, 0.7);
  border-radius: 2px; transition: all 0.25s; }
.hamburger span:nth-child(1).open { transform: translateY(7px) rotate(45deg); }
.hamburger span:nth-child(2).open { opacity: 0; }
.hamburger span:nth-child(3).open { transform: translateY(-7px) rotate(-45deg); }

.mobile-menu { display: flex; flex-direction: column; gap: 2px; padding: 8px 12px 12px;
  border-top: 1px solid rgba(255, 140, 60, 0.1); }
.mobile-link { padding: 10px 12px; border-radius: 8px; color: rgba(210, 170, 120, 0.8);
  font-size: 14px; font-weight: 500; text-decoration: none; }
.mobile-link:hover, .mobile-link.router-link-active { background: rgba(255, 140, 60, 0.1); color: #FF8C42; }

@media (max-width: 700px) {
  .nav-links, .profile-name { display: none; }
  .nav-inner { padding: 0 1.2rem; }
}
</style>