import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './themes/base.css'
import './themes/divertido.css'
import './themes/minimalista.css'
import './themes/floresta.css'
import './themes/espaco.css'
import './themes/oceano.css'
import './themes/doces.css'

import { setupAudioListeners } from './utils/audio'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

// Setup audio after app is mounted
setupAudioListeners()

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {
      // Service worker registration failed - app still works without it
    })
  })
}
