import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
const app = createApp(App)

app.use(router)

// Remove or comment this line:
// import './style.css'

app.mount('#app')