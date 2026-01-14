import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './themes/base.css'
import './themes/divertido.css'
import './themes/minimalista.css'

import { setupAudioListeners } from './utils/audio'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

// Setup audio after app is mounted
setupAudioListeners()
