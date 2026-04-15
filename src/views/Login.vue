<template>
  <div class="page">

    <img src="/images/book.jpg" alt="" class="bg-img" />
    <div class="bg-overlay" />

    <div class="layout">

      <!-- LEFT: Form Panel -->
      <div class="form-panel">

        <div class="logo">
          <div class="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <span class="logo-text">Library</span>
        </div>

        <div class="form-header">
          <p class="eyebrow">Welcome back</p>
          <h1 class="form-title">Sign in to your account</h1>
          <p class="form-sub">Pick up right where you left off</p>
        </div>

        <form @submit.prevent="handleLogin" class="form">

          <div class="field">
            <label>Email or Username</label>
            <div class="input-wrap">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input v-model="form.identifiant" type="text" placeholder="Email or username" required />
            </div>
          </div>

          <div class="field">
            <div class="label-row">
              <label>Password</label>
            </div>
            <div class="input-wrap">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                required
              />
              <button type="button" class="toggle-pw" @click="showPassword = !showPassword" tabindex="-1">
                <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="remember-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkbox-custom" />
              <span class="checkbox-text">Remember me for 30 days</span>
            </label>
          </div>

          <div v-if="error" class="error-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="!loading">Sign In</span>
            <span v-else class="loading-state">
              <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Signing in…
            </span>
          </button>

        </form>

        <div class="divider"><span>or</span></div>

        <p class="signup-link">
          Don't have an account? <router-link to="/register">Create one →</router-link>
        </p>

      </div>

      <!-- RIGHT: Image Side Panel -->
      <div class="image-panel">
        <div class="panel-content">
          <div class="quote-block">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,180,100,0.5)">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
            </svg>
            <p class="quote-text">Not all those who wander are lost — but a good book always helps you find your way.</p>
            <p class="quote-author">— J.R.R. Tolkien</p>
          </div>
          <div class="panel-badge">
            <div class="badge-dot" />
            <span>10,000+ readers</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { setUser } from '../stores/auth'   // ✅ NEW

const router = useRouter()

const form = ref({ identifiant: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await axios.post('http://localhost:3000/auth/signin', {
      identifiant: form.value.identifiant,
      password: form.value.password
    })

    const token = response.data.access_token

    // ✅ Decode JWT to extract user info
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('JWT payload:', payload) // 👈 check this in browser console once, then remove

    if (rememberMe.value) {
      localStorage.setItem('token', token)
    } else {
      sessionStorage.setItem('token', token)
    }

    // ✅ Save user name so navbar can display it
    setUser({
      name: payload.name || payload.username || payload.sub
    })

    router.push('/')

  } catch (err) {
    if (err.response?.status === 404) {
      error.value = err.response.data.message
    } else {
      error.value = 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  min-height: 100vh;
  display: flex;
  position: relative;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

.bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(8, 4, 2, 0.97) 0%,
    rgba(12, 6, 2, 0.92) 38%,
    rgba(10, 5, 2, 0.55) 55%,
    rgba(5, 2, 0, 0.15) 100%
  );
  z-index: 1;
}

.layout {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.form-panel {
  width: 480px;
  min-height: 100vh;
  padding: 48px 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 52px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 140, 66, 0.12);
  border: 1px solid rgba(255, 140, 66, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 500;
  color: #FAF0D8;
  letter-spacing: 0.3px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #FF8C42;
  margin-bottom: 12px;
}

.form-title {
  font-family: Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  color: #FAF0D8;
  line-height: 1.2;
  margin-bottom: 8px;
}

.form-sub {
  font-size: 14.5px;
  color: rgba(200, 160, 110, 0.75);
  margin-bottom: 36px;
}

.field { margin-bottom: 18px; }

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.field label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(220, 175, 120, 0.9);
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.label-row label { margin-bottom: 0; }

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: rgba(200, 150, 90, 0.55);
  pointer-events: none;
  flex-shrink: 0;
}

.input-wrap input {
  width: 100%;
  padding: 13px 42px 13px 42px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(220, 155, 80, 0.2);
  border-radius: 12px;
  font-size: 14.5px;
  color: #FAF0D8;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

.input-wrap input::placeholder { color: rgba(180, 130, 80, 0.4); }

.input-wrap input:hover {
  border-color: rgba(220, 155, 80, 0.4);
  background: rgba(255, 255, 255, 0.06);
}

.input-wrap input:focus {
  border-color: rgba(255, 140, 66, 0.65);
  background: rgba(255, 140, 66, 0.05);
  box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.12);
}

.toggle-pw {
  position: absolute;
  right: 13px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(200, 150, 90, 0.5);
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.toggle-pw:hover { color: rgba(255, 180, 100, 0.9); }

.remember-row { margin-bottom: 6px; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] { display: none; }

.checkbox-custom {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  border: 1px solid rgba(220, 155, 80, 0.35);
  background: rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  transition: all 0.2s;
  position: relative;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #FF7A2F;
  border-color: #FF7A2F;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.checkbox-text {
  font-size: 13.5px;
  color: rgba(200, 160, 110, 0.7);
}

.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  background: rgba(220, 60, 40, 0.12);
  border: 1px solid rgba(220, 60, 40, 0.3);
  border-radius: 10px;
  color: #FFAA88;
  font-size: 13.5px;
  margin-bottom: 4px;
  margin-top: 8px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  margin-top: 22px;
  background: linear-gradient(135deg, #FF7A2F 0%, #E8521A 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15.5px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(232, 82, 26, 0.4);
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(232, 82, 26, 0.55);
  opacity: 0.95;
}

.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 0.8s linear infinite; }

.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 26px 0 20px;
  color: rgba(180, 130, 80, 0.4);
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(220, 155, 80, 0.15);
}

.signup-link {
  text-align: center;
  font-size: 14px;
  color: rgba(200, 155, 100, 0.7);
}

.signup-link a {
  color: #FFAA55;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.signup-link a:hover { color: #FFD090; }

.image-panel {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding: 52px 60px;
}

.panel-content { max-width: 380px; }
.quote-block { margin-bottom: 32px; }
.quote-block svg { margin-bottom: 16px; }

.quote-text {
  font-family: Georgia, serif;
  font-size: 19px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(250, 235, 200, 0.9);
  margin-bottom: 14px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.5);
}

.quote-author {
  font-size: 13px;
  color: rgba(200, 155, 100, 0.65);
  letter-spacing: 0.5px;
}

.panel-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  font-size: 13px;
  color: rgba(240, 210, 160, 0.8);
  backdrop-filter: blur(8px);
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ADE80;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.7);
}

@media (max-width: 860px) {
  .layout { flex-direction: column; }
  .form-panel {
    width: 100%;
    min-height: auto;
    padding: 40px 28px;
  }
  .image-panel { display: none; }
}
</style>