<template>
  <div class="home">

    <!-- ───────────── HERO ───────────── -->
    <section class="hero">
      <img src="/images/homebook.jpg" alt="" class="hero-bg" />
      <div class="hero-overlay" />
      <div class="hero-content">
        <p class="hero-eyebrow">Your next great read awaits</p>
        <h1 class="hero-title">A world of stories,<br />at your fingertips.</h1>
        <p class="hero-sub">
          Explore timeless classics and modern bestsellers — curated for every kind of reader.
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="scrollToCatalogue">Explore catalogue</button>
          <router-link to="/register" class="btn-ghost">Join for free →</router-link>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-num">10K+</span>
          <span class="stat-label">Readers</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-num">5K+</span>
          <span class="stat-label">Books</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-num">50+</span>
          <span class="stat-label">Genres</span>
        </div>
      </div>
    </section>

    <!-- ───────────── POPULAR BOOKS ───────────── -->
    <section id="catalogue" class="popular">
      <div class="section-header">
        <div>
          <p class="section-eyebrow">Curated picks</p>
          <h2 class="section-title">Popular right now</h2>
        </div>
      </div>

      <div class="books-grid">
        <div v-for="book in books" :key="book.id" class="book-card">
          <div class="book-cover">
            <img :src="book.image" :alt="book.title" />
            <div class="book-cover-overlay">
              <button class="btn-see-more">Voir plus</button>
            </div>
          </div>
          <div class="book-body">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-desc">{{ book.description || 'Découvrez pourquoi ce livre est un best-seller.' }}</p>
          </div>
        </div>

        <template v-if="books.length === 0">
          <div v-for="n in 6" :key="n" class="book-card skeleton">
            <div class="book-cover skeleton-cover" />
            <div class="book-body">
              <div class="skeleton-line w60" />
              <div class="skeleton-line w80" />
              <div class="skeleton-line w40" />
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- ───────────── CTA BANNER ───────────── -->
    <section class="cta-banner">
      <div class="cta-inner">
        <div class="cta-text">
          <h2 class="cta-title">Start your reading journey today.</h2>
          <p class="cta-sub">Join thousands of readers and discover your next favourite book.</p>
        </div>
        <div class="cta-actions">
          <router-link to="/register" class="btn-primary">Create account</router-link>
          <router-link to="/login" class="btn-outline">Sign in</router-link>
        </div>
      </div>
    </section>

    <!-- ───────────── FOOTER ───────────── -->
    <footer class="footer">
      <div class="footer-logo">
        <div class="logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <span class="logo-text">Library</span>
      </div>
      <p class="footer-copy">© 2025 Library. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/books')
    books.value = res.data
  } catch (e) {
    console.log('Error loading books')
  }
})

const scrollToCatalogue = () => {
  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0f0d0b;
  color: #FAF0D8;
}

/* ── HERO ── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(6, 3, 1, 0.96) 0%,
    rgba(10, 5, 2, 0.88) 40%,
    rgba(8, 4, 1, 0.6) 65%,
    rgba(4, 2, 0, 0.2) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 620px;
  padding: 0 60px;
  margin-top: -40px;
}

.hero-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #FF8C42;
  margin-bottom: 20px;
}

.hero-title {
  font-family: Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 400;
  color: #FAF0D8;
  line-height: 1.15;
  margin-bottom: 20px;
}

.hero-sub {
  font-size: 1.05rem;
  color: rgba(200, 160, 110, 0.8);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 13px 28px;
  background: linear-gradient(135deg, #FF7A2F 0%, #E8521A 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 4px 20px rgba(232, 82, 26, 0.4);
  font-family: inherit;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(232, 82, 26, 0.55);
  opacity: 0.95;
}

.btn-ghost {
  font-size: 15px;
  font-weight: 600;
  color: rgba(250, 200, 140, 0.85);
  text-decoration: none;
  transition: color 0.2s;
  letter-spacing: 0.2px;
}

.btn-ghost:hover { color: #FFD090; }

/* Hero Stats */
.hero-stats {
  position: absolute;
  bottom: 48px;
  left: 60px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 28px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: #FAF0D8;
}

.stat-label {
  font-size: 11.5px;
  color: rgba(200, 155, 100, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(220, 155, 80, 0.2);
}

/* ── POPULAR SECTION ── */
.popular {
  background: #0f0d0b;
  padding: 80px 60px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
}

.section-eyebrow {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #FF8C42;
  margin-bottom: 8px;
}

.section-title {
  font-family: Georgia, serif;
  font-size: 1.9rem;
  font-weight: 400;
  color: #FAF0D8;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 28px;
  max-width: 1200px;
}

/* ── BOOK CARD ── */
.book-card {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(220, 155, 80, 0.1);
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.book-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 140, 66, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.book-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s;
}

.book-card:hover .book-cover-overlay {
  opacity: 1;
}

.btn-see-more {
  padding: 10px 22px;
  background: linear-gradient(135deg, #FF7A2F, #E8521A);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transform: translateY(8px);
  transition: transform 0.25s;
}

.book-card:hover .btn-see-more {
  transform: translateY(0);
}

.book-body {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
}

.book-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #FAF0D8;
  margin: 0;
  line-height: 1.4;
}

.book-desc {
  font-size: 0.8rem;
  color: rgba(200, 155, 100, 0.6);
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

/* ── SKELETON ── */
.skeleton-cover {
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.skeleton-line {
  height: 11px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  margin-bottom: 8px;
}

.w40 { width: 40%; }
.w60 { width: 60%; }
.w80 { width: 80%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── CTA BANNER ── */
.cta-banner {
  background: linear-gradient(135deg, rgba(255, 122, 47, 0.12) 0%, rgba(232, 82, 26, 0.06) 100%);
  border-top: 1px solid rgba(255, 140, 66, 0.15);
  border-bottom: 1px solid rgba(255, 140, 66, 0.15);
  padding: 72px 60px;
}

.cta-inner {
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.cta-title {
  font-family: Georgia, serif;
  font-size: 1.9rem;
  font-weight: 400;
  color: #FAF0D8;
  margin-bottom: 10px;
}

.cta-sub {
  font-size: 0.95rem;
  color: rgba(200, 155, 100, 0.7);
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.btn-outline {
  padding: 13px 28px;
  background: transparent;
  color: rgba(250, 200, 140, 0.85);
  border: 1px solid rgba(220, 155, 80, 0.3);
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  font-family: inherit;
}

.btn-outline:hover {
  border-color: rgba(255, 140, 66, 0.6);
  color: #FFD090;
  background: rgba(255, 140, 66, 0.06);
}

/* ── FOOTER ── */
.footer {
  background: #080604;
  padding: 32px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
  gap: 16px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 140, 66, 0.1);
  border: 1px solid rgba(255, 140, 66, 0.25);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 500;
  color: #FAF0D8;
  letter-spacing: 0.3px;
}

.footer-copy {
  font-size: 13px;
  color: rgba(200, 155, 100, 0.4);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero-content { padding: 0 24px; }
  .hero-stats { left: 24px; bottom: 32px; gap: 20px; }
  .popular { padding: 56px 24px; }
  .cta-banner { padding: 56px 24px; }
  .cta-inner { flex-direction: column; }
  .footer { padding: 28px 24px; }
  .books-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
}
</style>