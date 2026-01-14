// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './themes/base.css'
import './themes/divertido.css'
import './themes/minimalista.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
