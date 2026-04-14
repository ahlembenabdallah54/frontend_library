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

<template>
  <div class="home">

    <!-- ───────────── HERO ───────────── -->
    <section class="hero">
      <h1 class="hero-title">Découvrez des livres pour tous les goûts</h1>
      <p class="hero-sub">
        Des classiques intemporels aux derniers best-sellers, trouvez votre prochaine lecture ici.
      </p>
      <button class="btn-primary" @click="scrollToCatalogue">
        Explorer le catalogue
      </button>
    </section>

    <!-- ───────────── POPULAR BOOKS ───────────── -->
    <section id="catalogue" class="popular">
      <h2 class="section-title">Livres populaires</h2>

      <div class="books-grid">
        <div v-for="book in books" :key="book.id" class="book-card">
          <div class="book-cover">
            <img :src="book.image" :alt="book.title" />
          </div>
          <div class="book-body">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-desc">{{ book.description || 'Découvrez pourquoi ce livre est un best-seller.' }}</p>
            <button class="btn-secondary">Voir plus</button>
          </div>
        </div>

        <!-- Fallback cards if no data yet -->
        <template v-if="books.length === 0">
          <div v-for="n in 3" :key="n" class="book-card skeleton">
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

    <!-- ───────────── FOOTER CTA ───────────── -->
    <section class="cta-footer">
      <h2>Besoin d'aide ?</h2>
      <p>Contactez-nous pour toute question ou assistance.</p>
      <button class="btn-primary">Contactez-nous</button>
    </section>

  </div>
</template>

<style scoped>
/* ── Base ── */
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
  color: #1a1a2e;
}

/* ── Hero ── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 24px 100px;
  position: relative;
  background-image: url('/images/homebook.jpg');
  background-size: cover;
  background-position: center;
  color: #fff;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}

.hero > * {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  margin-bottom: 14px;
  max-width: 700px;
  line-height: 1.3;
  color: #fff;
}

.hero-sub {
  color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
  margin-bottom: 28px;
  max-width: 520px;
}

/* ── Buttons ── */
.btn-primary {
  background: #1a3a6b;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #0f2548; }

.btn-secondary {
  background: #1a3a6b;
  color: #fff;
  border: none;
  padding: 9px 20px;
  border-radius: 5px;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: auto;
  align-self: flex-start;
  transition: background 0.2s;
}
.btn-secondary:hover { background: #0f2548; }

/* ── Popular Section ── */
.popular {
  flex: 1;
  padding: 48px 40px;
  background: #e8e8e8;
}

.section-title {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 32px;
  color: #1a1a2e;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Book Card ── */
.book-card {
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.book-cover {
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #ddd;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.book-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
  background: transparent;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.book-desc {
  font-size: 0.82rem;
  color: #666;
  margin: 0 0 10px;
  flex: 1;
}

/* ── Skeleton ── */
.skeleton-cover {
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  margin-bottom: 8px;
}
.w40 { width: 40%; }
.w60 { width: 60%; }
.w80 { width: 80%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Footer CTA ── */
.cta-footer {
  background: #1e2235;
  color: #fff;
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cta-footer h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.cta-footer p {
  color: rgba(255,255,255,0.7);
  margin: 0;
  font-size: 0.9rem;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .popular { padding: 32px 16px; }
  .hero { padding: 60px 16px 40px; }
}
</style>