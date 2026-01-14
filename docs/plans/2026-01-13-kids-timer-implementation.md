# Kids Pomodoro Timer - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fun, educational Pomodoro timer web app for children with visual progress indicators, gamification, and music integration.

**Architecture:** Vue 3 SPA using Composition API and Pinia for state management. All data persisted to localStorage. Theming via CSS custom properties. Audio via Web Audio API + YouTube IFrame API.

**Tech Stack:** Vue 3, Vite, Pinia, CSS custom properties, YouTube IFrame API

---

## Phase 1: Project Foundation

### Task 1: Initialize Vue 3 + Vite Project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`

**Step 1: Initialize npm project and install dependencies**

Run:
```bash
cd /home/in/kids-timer
npm init -y
npm install vue@latest pinia@latest
npm install -D vite @vitejs/plugin-vue
```

**Step 2: Create vite.config.js**

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000
  }
})
```

**Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Timer Pomodoro - Crianças</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Step 4: Create src/main.js**

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

**Step 5: Create src/App.vue**

```vue
<!-- src/App.vue -->
<template>
  <div class="app">
    <h1>Timer Pomodoro</h1>
    <p>Em construção...</p>
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Nunito', sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}
</style>
```

**Step 6: Update package.json scripts**

Add to package.json:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Step 7: Verify app runs**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000, shows "Timer Pomodoro" heading

**Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Vue 3 + Vite project"
```

---

### Task 2: Create Directory Structure

**Files:**
- Create: `src/stores/.gitkeep`
- Create: `src/components/.gitkeep`
- Create: `src/themes/.gitkeep`
- Create: `src/data/.gitkeep`
- Create: `src/utils/.gitkeep`
- Create: `public/sounds/.gitkeep`
- Create: `public/images/.gitkeep`

**Step 1: Create all directories**

Run:
```bash
cd /home/in/kids-timer
mkdir -p src/stores src/components/Timer src/components/Progress src/components/Profiles src/components/Settings src/components/Music src/components/Rewards src/components/Break
mkdir -p src/themes src/data src/utils
mkdir -p public/sounds public/images
touch src/stores/.gitkeep src/themes/.gitkeep src/data/.gitkeep src/utils/.gitkeep
touch public/sounds/.gitkeep public/images/.gitkeep
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: create directory structure"
```

---

## Phase 2: Data Layer

### Task 3: Create Storage Utility

**Files:**
- Create: `src/utils/storage.js`

**Step 1: Create storage utility**

```javascript
// src/utils/storage.js
const STORAGE_KEY = 'kids-timer-data'

const defaultData = {
  version: 1,
  profiles: [],
  activeProfileId: null,
  globalSettings: {
    masterVolume: 0.8,
    soundEffectsEnabled: true,
    defaultPreset: '25-5'
  },
  sessionHistory: []
}

export const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return { ...defaultData }
      const data = JSON.parse(raw)
      return this.migrate(data)
    } catch (e) {
      console.error('Failed to load storage:', e)
      return { ...defaultData }
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (e) {
      console.error('Failed to save storage:', e)
      return false
    }
  },

  migrate(data) {
    // Future migrations go here
    // if (data.version === 1) { migrate to 2 }
    return data
  },

  exportData() {
    const data = this.load()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kids-timer-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.version) {
            this.save(this.migrate(data))
            resolve(data)
          } else {
            reject(new Error('Invalid backup file'))
          }
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  },

  pruneOldHistory(data, daysToKeep = 30) {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    data.sessionHistory = data.sessionHistory.filter(s =>
      new Date(s.date).getTime() > cutoff
    )
    return data
  }
}
```

**Step 2: Commit**

```bash
git add src/utils/storage.js
git commit -m "feat: add localStorage utility with export/import"
```

---

### Task 4: Create Data Files

**Files:**
- Create: `src/data/breakSuggestions.js`
- Create: `src/data/rewards.js`
- Create: `src/data/classicalMusic.js`

**Step 1: Create break suggestions data**

```javascript
// src/data/breakSuggestions.js
export const breakSuggestions = {
  movement: [
    { text: "Levante e se espreguice bem alto!", image: "stretch.svg" },
    { text: "Faça 10 polichinelos!", image: "jumping-jacks.svg" },
    { text: "Dance sua música favorita!", image: "dance.svg" },
    { text: "Toque os dedos dos pés 5 vezes!", image: "touch-toes.svg" },
    { text: "Gire os braços como um moinho!", image: "arm-circles.svg" },
    { text: "Pule como um sapo 5 vezes!", image: "frog-jump.svg" },
  ],
  rest: [
    { text: "Feche os olhos e respire fundo 3 vezes.", image: "breathe.svg" },
    { text: "Olhe pela janela e encontre algo verde.", image: "window.svg" },
    { text: "Sente-se e relaxe os ombros.", image: "relax.svg" },
    { text: "Boceje bem grande!", image: "yawn.svg" },
  ],
  hydration: [
    { text: "Beba um copo de água!", image: "drink-water.svg" },
    { text: "Hora de beber água. Você já bebeu hoje?", image: "water-glass.svg" },
    { text: "Leve sua garrafinha de água para encher.", image: "water-bottle.svg" },
  ],
  eyes: [
    { text: "Olhe para algo bem longe por 20 segundos.", image: "look-far.svg" },
    { text: "Pisque os olhos 10 vezes bem devagar.", image: "blink.svg" },
    { text: "Feche os olhos e conte até 20.", image: "eyes-closed.svg" },
  ],
  fun: [
    { text: "Faça uma careta engraçada!", image: "funny-face.svg" },
    { text: "Dê um abraço em alguém da sua casa!", image: "hug.svg" },
    { text: "Conte uma piada para você mesmo!", image: "joke.svg" },
    { text: "Sorria bem grande para o espelho!", image: "smile.svg" },
  ]
}

export const categoryIcons = {
  movement: '🏃',
  rest: '😌',
  hydration: '💧',
  eyes: '👀',
  fun: '😄'
}

export function getRandomSuggestion(excludeCategories = [], recentTexts = []) {
  const categories = Object.keys(breakSuggestions).filter(c => !excludeCategories.includes(c))
  if (categories.length === 0) return getRandomSuggestion([], recentTexts)

  const category = categories[Math.floor(Math.random() * categories.length)]
  const suggestions = breakSuggestions[category].filter(s => !recentTexts.includes(s.text))

  if (suggestions.length === 0) {
    return getRandomSuggestion([...excludeCategories, category], recentTexts)
  }

  const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
  return { ...suggestion, category, icon: categoryIcons[category] }
}
```

**Step 2: Create rewards data**

```javascript
// src/data/rewards.js
export const avatars = [
  { id: 'rabbit', name: 'Coelho', cost: 0, unlocked: true },
  { id: 'turtle', name: 'Tartaruga', cost: 100, unlocked: false },
  { id: 'fox', name: 'Raposa', cost: 100, unlocked: false },
  { id: 'owl', name: 'Coruja', cost: 150, unlocked: false },
  { id: 'cat', name: 'Gato', cost: 150, unlocked: false },
  { id: 'dog', name: 'Cachorro', cost: 150, unlocked: false },
]

export const pathAnimals = [
  { id: 'rabbit', name: 'Coelho', cost: 0, unlocked: true },
  { id: 'turtle', name: 'Tartaruga', cost: 150, unlocked: false },
  { id: 'fox', name: 'Raposa', cost: 150, unlocked: false },
  { id: 'snail', name: 'Caracol', cost: 150, unlocked: false },
]

export const themes = [
  { id: 'divertido', name: 'Divertido', cost: 0, unlocked: true },
  { id: 'minimalista', name: 'Minimalista', cost: 0, unlocked: true },
  { id: 'floresta', name: 'Floresta', cost: 200, unlocked: false },
  { id: 'espaco', name: 'Espaço', cost: 200, unlocked: false },
  { id: 'oceano', name: 'Oceano', cost: 200, unlocked: false },
  { id: 'doces', name: 'Doces', cost: 200, unlocked: false },
]

export const badges = [
  { id: 'primeiro-passo', name: 'Primeiro Passo', description: 'Complete seu primeiro pomodoro', icon: '🌟' },
  { id: 'cinco-seguidos', name: 'Cinco Seguidos', description: 'Complete 5 pomodoros em um dia', icon: '🔥' },
  { id: 'maratonista', name: 'Maratonista', description: 'Complete 10 pomodoros em um dia', icon: '🏃' },
  { id: 'consistente', name: 'Consistente', description: 'Mantenha uma sequência de 7 dias', icon: '📅' },
  { id: 'dedicado', name: 'Dedicado', description: 'Mantenha uma sequência de 30 dias', icon: '💪' },
  { id: 'centuriao', name: 'Centurião', description: 'Complete 100 pomodoros no total', icon: '💯' },
  { id: 'explorador', name: 'Explorador', description: 'Experimente todos os indicadores de progresso', icon: '🧭' },
  { id: 'fashionista', name: 'Fashionista', description: 'Desbloqueie 3 temas', icon: '🎨' },
]

export const points = {
  completeWork: 10,
  completePomodoro: 15,
  dailyStreak: 5,
  firstOfDay: 5,
}
```

**Step 3: Create classical music data**

```javascript
// src/data/classicalMusic.js
export const classicalMusic = [
  {
    id: 'vivaldi-primavera',
    title: 'Primavera',
    composer: 'Antonio Vivaldi',
    instrument: 'Violino',
    duration: 210,
    file: 'vivaldi-primavera.mp3',
    funFact: 'Faz parte de "As Quatro Estações", composta em 1723'
  },
  {
    id: 'beethoven-fur-elise',
    title: 'Für Elise',
    composer: 'Ludwig van Beethoven',
    instrument: 'Piano',
    duration: 180,
    file: 'beethoven-fur-elise.mp3',
    funFact: 'Ninguém sabe quem era Elise!'
  },
  {
    id: 'bach-cello-suite',
    title: 'Suíte para Violoncelo Nº 1',
    composer: 'Johann Sebastian Bach',
    instrument: 'Violoncelo',
    duration: 240,
    file: 'bach-cello-suite.mp3',
    funFact: 'Escrita há mais de 300 anos'
  },
  {
    id: 'mozart-eine-kleine',
    title: 'Eine kleine Nachtmusik',
    composer: 'Wolfgang Amadeus Mozart',
    instrument: 'Orquestra',
    duration: 330,
    file: 'mozart-eine-kleine.mp3',
    funFact: 'Mozart tinha apenas 31 anos quando compôs'
  },
  {
    id: 'debussy-clair-de-lune',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    instrument: 'Piano',
    duration: 300,
    file: 'debussy-clair-de-lune.mp3',
    funFact: 'O nome significa "Luz da Lua" em francês'
  },
  {
    id: 'tchaikovsky-swan-lake',
    title: 'O Lago dos Cisnes',
    composer: 'Piotr Tchaikovsky',
    instrument: 'Orquestra',
    duration: 180,
    file: 'tchaikovsky-swan-lake.mp3',
    funFact: 'É um balé sobre uma princesa transformada em cisne'
  },
  {
    id: 'pachelbel-canon',
    title: 'Canon em Ré',
    composer: 'Johann Pachelbel',
    instrument: 'Orquestra de Cordas',
    duration: 300,
    file: 'pachelbel-canon.mp3',
    funFact: 'Uma das músicas mais tocadas em casamentos'
  },
  {
    id: 'grieg-morning-mood',
    title: 'Manhã (Peer Gynt)',
    composer: 'Edvard Grieg',
    instrument: 'Flauta',
    duration: 240,
    file: 'grieg-morning-mood.mp3',
    funFact: 'A flauta imita o canto dos pássaros ao amanhecer'
  },
  {
    id: 'saint-saens-swan',
    title: 'O Cisne',
    composer: 'Camille Saint-Saëns',
    instrument: 'Violoncelo',
    duration: 210,
    file: 'saint-saens-swan.mp3',
    funFact: 'Faz parte de "O Carnaval dos Animais"'
  },
  {
    id: 'handel-water-music',
    title: 'Música Aquática',
    composer: 'Georg Friedrich Händel',
    instrument: 'Orquestra',
    duration: 180,
    file: 'handel-water-music.mp3',
    funFact: 'Foi tocada pela primeira vez em um barco no rio Tâmisa'
  }
]

export function getRandomTrack(excludeIds = []) {
  const available = classicalMusic.filter(t => !excludeIds.includes(t.id))
  if (available.length === 0) return classicalMusic[0]
  return available[Math.floor(Math.random() * available.length)]
}
```

**Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add break suggestions, rewards, and music data"
```

---

## Phase 3: State Management (Stores)

### Task 5: Create Settings Store

**Files:**
- Create: `src/stores/settings.js`

**Step 1: Create settings store**

```javascript
// src/stores/settings.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '../utils/storage'

export const useSettingsStore = defineStore('settings', () => {
  const data = storage.load()

  // Global settings
  const masterVolume = ref(data.globalSettings?.masterVolume ?? 0.8)
  const soundEffectsEnabled = ref(data.globalSettings?.soundEffectsEnabled ?? true)
  const defaultPreset = ref(data.globalSettings?.defaultPreset ?? '25-5')

  // Sound alerts
  const alerts = ref({
    oneMinute: true,
    fiveMinutes: false,
    fiftyPercent: false,
    twentyFivePercent: false,
  })

  // Music preference: 'none' | 'classical' | 'youtube'
  const musicPreference = ref('none')
  const youtubeUrl = ref('')

  // Progress indicator: 'animal-path' | 'circular' | 'hourglass' | 'progress-bar'
  const progressIndicator = ref('circular')

  // Theme
  const theme = ref('divertido')

  // Path animal (for animal-path indicator)
  const pathAnimal = ref('rabbit')

  function saveSettings() {
    const current = storage.load()
    current.globalSettings = {
      masterVolume: masterVolume.value,
      soundEffectsEnabled: soundEffectsEnabled.value,
      defaultPreset: defaultPreset.value,
    }
    storage.save(current)
  }

  // Auto-save on changes
  watch([masterVolume, soundEffectsEnabled, defaultPreset], saveSettings)

  function setTheme(newTheme) {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    masterVolume,
    soundEffectsEnabled,
    defaultPreset,
    alerts,
    musicPreference,
    youtubeUrl,
    progressIndicator,
    theme,
    pathAnimal,
    setTheme,
    initTheme,
    saveSettings,
  }
})
```

**Step 2: Commit**

```bash
git add src/stores/settings.js
git commit -m "feat: add settings store with theme and audio preferences"
```

---

### Task 6: Create Profiles Store

**Files:**
- Create: `src/stores/profiles.js`

**Step 1: Create profiles store**

```javascript
// src/stores/profiles.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { useSettingsStore } from './settings'

export const useProfilesStore = defineStore('profiles', () => {
  const data = storage.load()

  const profiles = ref(data.profiles || [])
  const activeProfileId = ref(data.activeProfileId || null)

  const activeProfile = computed(() =>
    profiles.value.find(p => p.id === activeProfileId.value) || null
  )

  function generateId() {
    return 'profile-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  }

  function createProfile(name) {
    const profile = {
      id: generateId(),
      name,
      avatar: 'rabbit',
      theme: 'divertido',
      progressIndicator: 'circular',
      musicPreference: 'none',
      pathAnimal: 'rabbit',

      // Stats
      totalPomodoros: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,

      // Gamification
      points: 0,
      unlockedThemes: ['divertido', 'minimalista'],
      unlockedAvatars: ['rabbit'],
      unlockedAnimals: ['rabbit'],
      badges: [],

      // Tried indicators (for explorer badge)
      triedIndicators: [],
    }

    profiles.value.push(profile)
    saveProfiles()
    return profile
  }

  function selectProfile(profileId) {
    const profile = profiles.value.find(p => p.id === profileId)
    if (!profile) return

    activeProfileId.value = profileId

    // Apply profile settings
    const settings = useSettingsStore()
    settings.setTheme(profile.theme)
    settings.progressIndicator = profile.progressIndicator
    settings.musicPreference = profile.musicPreference
    settings.pathAnimal = profile.pathAnimal

    saveProfiles()
  }

  function updateProfile(profileId, updates) {
    const profile = profiles.value.find(p => p.id === profileId)
    if (!profile) return

    Object.assign(profile, updates)
    saveProfiles()
  }

  function addPoints(amount) {
    if (!activeProfile.value) return
    activeProfile.value.points += amount
    saveProfiles()
  }

  function spendPoints(amount) {
    if (!activeProfile.value) return false
    if (activeProfile.value.points < amount) return false
    activeProfile.value.points -= amount
    saveProfiles()
    return true
  }

  function unlockItem(type, itemId, cost) {
    if (!activeProfile.value) return false
    if (!spendPoints(cost)) return false

    const profile = activeProfile.value
    switch (type) {
      case 'theme':
        if (!profile.unlockedThemes.includes(itemId)) {
          profile.unlockedThemes.push(itemId)
        }
        break
      case 'avatar':
        if (!profile.unlockedAvatars.includes(itemId)) {
          profile.unlockedAvatars.push(itemId)
        }
        break
      case 'animal':
        if (!profile.unlockedAnimals.includes(itemId)) {
          profile.unlockedAnimals.push(itemId)
        }
        break
    }
    saveProfiles()
    return true
  }

  function awardBadge(badgeId) {
    if (!activeProfile.value) return
    if (activeProfile.value.badges.includes(badgeId)) return

    activeProfile.value.badges.push(badgeId)
    saveProfiles()
  }

  function recordPomodoroComplete(minutes) {
    if (!activeProfile.value) return

    const profile = activeProfile.value
    const today = new Date().toISOString().split('T')[0]

    profile.totalPomodoros++
    profile.totalMinutes += minutes

    // Update streak
    if (profile.lastActiveDate === today) {
      // Already active today, no streak change
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      if (profile.lastActiveDate === yesterday) {
        profile.currentStreak++
      } else {
        profile.currentStreak = 1
      }
      profile.lastActiveDate = today
    }

    if (profile.currentStreak > profile.longestStreak) {
      profile.longestStreak = profile.currentStreak
    }

    // Check badges
    checkBadges(profile)

    saveProfiles()
  }

  function checkBadges(profile) {
    if (profile.totalPomodoros >= 1 && !profile.badges.includes('primeiro-passo')) {
      profile.badges.push('primeiro-passo')
    }
    if (profile.totalPomodoros >= 100 && !profile.badges.includes('centuriao')) {
      profile.badges.push('centuriao')
    }
    if (profile.currentStreak >= 7 && !profile.badges.includes('consistente')) {
      profile.badges.push('consistente')
    }
    if (profile.currentStreak >= 30 && !profile.badges.includes('dedicado')) {
      profile.badges.push('dedicado')
    }
    if (profile.unlockedThemes.length >= 3 && !profile.badges.includes('fashionista')) {
      profile.badges.push('fashionista')
    }
    if (profile.triedIndicators.length >= 4 && !profile.badges.includes('explorador')) {
      profile.badges.push('explorador')
    }
  }

  function deleteProfile(profileId) {
    const index = profiles.value.findIndex(p => p.id === profileId)
    if (index === -1) return

    profiles.value.splice(index, 1)

    if (activeProfileId.value === profileId) {
      activeProfileId.value = profiles.value[0]?.id || null
    }
    saveProfiles()
  }

  function saveProfiles() {
    const current = storage.load()
    current.profiles = profiles.value
    current.activeProfileId = activeProfileId.value
    storage.save(current)
  }

  return {
    profiles,
    activeProfileId,
    activeProfile,
    createProfile,
    selectProfile,
    updateProfile,
    deleteProfile,
    addPoints,
    spendPoints,
    unlockItem,
    awardBadge,
    recordPomodoroComplete,
  }
})
```

**Step 2: Commit**

```bash
git add src/stores/profiles.js
git commit -m "feat: add profiles store with gamification and badges"
```

---

### Task 7: Create Timer Store

**Files:**
- Create: `src/stores/timer.js`

**Step 1: Create timer store**

```javascript
// src/stores/timer.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProfilesStore } from './profiles'
import { useSettingsStore } from './settings'
import { storage } from '../utils/storage'
import { points as pointValues } from '../data/rewards'

export const useTimerStore = defineStore('timer', () => {
  // Timer state
  const status = ref('idle') // 'idle' | 'working' | 'break' | 'paused'
  const timeRemaining = ref(0)
  const totalTime = ref(0)
  const targetEndTime = ref(null)

  // Session config
  const workDuration = ref(25)
  const breakDuration = ref(5)

  // Session tracking
  const completedPomodorosToday = ref(0)
  const isFirstOfDay = ref(true)

  // Internal
  let intervalId = null
  let pausedStatus = null

  // Presets
  const presets = [
    { id: '25-5', name: 'Curto', work: 25, break: 5 },
    { id: '50-10', name: 'Longo', work: 50, break: 10 },
    { id: 'custom', name: 'Personalizado', work: null, break: null },
  ]

  // Computed
  const progress = computed(() => {
    if (totalTime.value === 0) return 0
    return 1 - (timeRemaining.value / totalTime.value)
  })

  const displayTime = computed(() => {
    const mins = Math.floor(timeRemaining.value / 60)
    const secs = timeRemaining.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  const progressPercent = computed(() => {
    return Math.round(progress.value * 100)
  })

  // Alert checks
  function checkAlerts(remaining, total) {
    const settings = useSettingsStore()
    const alerts = settings.alerts

    const triggers = []

    if (alerts.oneMinute && remaining === 60) {
      triggers.push('oneMinute')
    }
    if (alerts.fiveMinutes && remaining === 300) {
      triggers.push('fiveMinutes')
    }
    if (alerts.fiftyPercent && remaining === Math.floor(total * 0.5)) {
      triggers.push('fiftyPercent')
    }
    if (alerts.twentyFivePercent && remaining === Math.floor(total * 0.25)) {
      triggers.push('twentyFivePercent')
    }

    return triggers
  }

  // Timer tick
  function tick() {
    const now = Date.now()
    const remaining = Math.max(0, Math.round((targetEndTime.value - now) / 1000))
    timeRemaining.value = remaining

    // Check for alerts
    const alerts = checkAlerts(remaining, totalTime.value)
    if (alerts.length > 0) {
      // Emit event for sound system to handle
      window.dispatchEvent(new CustomEvent('timer-alert', { detail: { alerts } }))
    }

    if (remaining <= 0) {
      handleTimerComplete()
    }
  }

  function handleTimerComplete() {
    clearInterval(intervalId)
    intervalId = null

    if (status.value === 'working') {
      // Work session complete
      window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'work-complete' } }))
      startBreak()
    } else if (status.value === 'break') {
      // Break complete - full pomodoro done
      const profiles = useProfilesStore()

      // Award points
      profiles.addPoints(pointValues.completePomodoro)
      if (isFirstOfDay.value) {
        profiles.addPoints(pointValues.firstOfDay)
        isFirstOfDay.value = false
      }
      if (profiles.activeProfile?.currentStreak > 0) {
        profiles.addPoints(pointValues.dailyStreak)
      }

      profiles.recordPomodoroComplete(workDuration.value)
      completedPomodorosToday.value++

      // Check daily badges
      checkDailyBadges()

      window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'pomodoro-complete' } }))

      // Record to session history
      recordSession()

      status.value = 'idle'
      timeRemaining.value = 0
      totalTime.value = 0
    }
  }

  function checkDailyBadges() {
    const profiles = useProfilesStore()
    if (!profiles.activeProfile) return

    if (completedPomodorosToday.value >= 5 && !profiles.activeProfile.badges.includes('cinco-seguidos')) {
      profiles.awardBadge('cinco-seguidos')
    }
    if (completedPomodorosToday.value >= 10 && !profiles.activeProfile.badges.includes('maratonista')) {
      profiles.awardBadge('maratonista')
    }
  }

  function recordSession() {
    const data = storage.load()
    const profiles = useProfilesStore()

    data.sessionHistory.push({
      profileId: profiles.activeProfileId,
      date: new Date().toISOString(),
      type: 'pomodoro',
      workDuration: workDuration.value,
      breakDuration: breakDuration.value,
      completed: true,
    })

    storage.save(storage.pruneOldHistory(data))
  }

  // Public methods
  function setPreset(presetId) {
    const preset = presets.find(p => p.id === presetId)
    if (preset && preset.work) {
      workDuration.value = preset.work
      breakDuration.value = preset.break
    }
  }

  function setCustomDurations(work, breakMins) {
    workDuration.value = work
    breakDuration.value = breakMins
  }

  function startWork() {
    status.value = 'working'
    totalTime.value = workDuration.value * 60
    timeRemaining.value = totalTime.value
    targetEndTime.value = Date.now() + (totalTime.value * 1000)

    window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'work-start' } }))

    intervalId = setInterval(tick, 1000)
  }

  function startBreak() {
    status.value = 'break'
    totalTime.value = breakDuration.value * 60
    timeRemaining.value = totalTime.value
    targetEndTime.value = Date.now() + (totalTime.value * 1000)

    window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'break-start' } }))

    intervalId = setInterval(tick, 1000)
  }

  function pause() {
    if (status.value !== 'working' && status.value !== 'break') return

    pausedStatus = status.value
    status.value = 'paused'
    clearInterval(intervalId)
    intervalId = null
  }

  function resume() {
    if (status.value !== 'paused') return

    status.value = pausedStatus
    targetEndTime.value = Date.now() + (timeRemaining.value * 1000)
    intervalId = setInterval(tick, 1000)
  }

  function stop() {
    clearInterval(intervalId)
    intervalId = null
    status.value = 'idle'
    timeRemaining.value = 0
    totalTime.value = 0
    targetEndTime.value = null
    pausedStatus = null
  }

  // Handle tab visibility
  function handleVisibilityChange() {
    if (document.hidden) return
    if (!targetEndTime.value) return
    if (status.value === 'paused' || status.value === 'idle') return

    // Recalculate on tab focus
    tick()
  }

  // Initialize visibility listener
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Check if new day for first-of-day bonus
  function checkNewDay() {
    const lastDate = localStorage.getItem('kids-timer-last-date')
    const today = new Date().toISOString().split('T')[0]

    if (lastDate !== today) {
      completedPomodorosToday.value = 0
      isFirstOfDay.value = true
      localStorage.setItem('kids-timer-last-date', today)
    }
  }

  checkNewDay()

  return {
    status,
    timeRemaining,
    totalTime,
    workDuration,
    breakDuration,
    progress,
    progressPercent,
    displayTime,
    presets,
    completedPomodorosToday,
    setPreset,
    setCustomDurations,
    startWork,
    pause,
    resume,
    stop,
  }
})
```

**Step 2: Commit**

```bash
git add src/stores/timer.js
git commit -m "feat: add timer store with alerts and session tracking"
```

---

## Phase 4: Core Components

### Task 8: Create Timer Display Component

**Files:**
- Create: `src/components/Timer/TimerDisplay.vue`

**Step 1: Create timer display component**

```vue
<!-- src/components/Timer/TimerDisplay.vue -->
<template>
  <div class="timer-display">
    <div class="timer-status">
      <span v-if="timer.status === 'idle'" class="status-badge idle">Pronto</span>
      <span v-else-if="timer.status === 'working'" class="status-badge working">Trabalhando</span>
      <span v-else-if="timer.status === 'break'" class="status-badge break">Intervalo</span>
      <span v-else-if="timer.status === 'paused'" class="status-badge paused">Pausado</span>
    </div>

    <div class="timer-time">
      {{ timer.displayTime }}
    </div>

    <div class="timer-info" v-if="timer.status !== 'idle'">
      {{ timer.progressPercent }}% completo
    </div>
  </div>
</template>

<script setup>
import { useTimerStore } from '../../stores/timer'

const timer = useTimerStore()
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.timer-status {
  min-height: 32px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-badge.idle {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text, #333);
}

.status-badge.working {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.status-badge.break {
  background: var(--color-secondary, #2196F3);
  color: white;
}

.status-badge.paused {
  background: var(--color-warning, #FF9800);
  color: white;
}

.timer-time {
  font-size: 96px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--color-text, #333);
}

.timer-info {
  font-size: 18px;
  color: var(--color-text-secondary, #666);
}
</style>
```

**Step 2: Commit**

```bash
git add src/components/Timer/TimerDisplay.vue
git commit -m "feat: add timer display component"
```

---

### Task 9: Create Timer Controls Component

**Files:**
- Create: `src/components/Timer/TimerControls.vue`

**Step 1: Create timer controls component**

```vue
<!-- src/components/Timer/TimerControls.vue -->
<template>
  <div class="timer-controls">
    <!-- Preset buttons (only when idle) -->
    <div v-if="timer.status === 'idle'" class="presets">
      <button
        v-for="preset in timer.presets"
        :key="preset.id"
        :class="['preset-btn', { active: selectedPreset === preset.id }]"
        @click="selectPreset(preset.id)"
      >
        {{ preset.name }}
        <span v-if="preset.work" class="preset-time">{{ preset.work }}/{{ preset.break }}</span>
      </button>
    </div>

    <!-- Custom duration inputs -->
    <div v-if="timer.status === 'idle' && selectedPreset === 'custom'" class="custom-inputs">
      <div class="input-group">
        <label>Trabalho (min)</label>
        <input
          type="number"
          v-model.number="customWork"
          min="1"
          max="120"
        />
      </div>
      <div class="input-group">
        <label>Intervalo (min)</label>
        <input
          type="number"
          v-model.number="customBreak"
          min="1"
          max="60"
        />
      </div>
    </div>

    <!-- Main action buttons -->
    <div class="actions">
      <button
        v-if="timer.status === 'idle'"
        class="btn btn-primary btn-large"
        @click="start"
      >
        Começar
      </button>

      <button
        v-if="timer.status === 'working' || timer.status === 'break'"
        class="btn btn-warning"
        @click="timer.pause()"
      >
        Pausar
      </button>

      <button
        v-if="timer.status === 'paused'"
        class="btn btn-primary"
        @click="timer.resume()"
      >
        Continuar
      </button>

      <button
        v-if="timer.status !== 'idle'"
        class="btn btn-danger"
        @click="timer.stop()"
      >
        Parar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTimerStore } from '../../stores/timer'

const timer = useTimerStore()

const selectedPreset = ref('25-5')
const customWork = ref(25)
const customBreak = ref(5)

function selectPreset(presetId) {
  selectedPreset.value = presetId
  if (presetId !== 'custom') {
    timer.setPreset(presetId)
  }
}

function start() {
  if (selectedPreset.value === 'custom') {
    timer.setCustomDurations(customWork.value, customBreak.value)
  }
  timer.startWork()
}
</script>

<style scoped>
.timer-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 400px;
}

.presets {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  border: 2px solid var(--color-border, #ddd);
  border-radius: var(--border-radius, 12px);
  background: var(--color-surface, white);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.preset-btn:hover {
  border-color: var(--color-primary, #4CAF50);
}

.preset-btn.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.preset-time {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-secondary, #666);
  margin-top: 4px;
}

.custom-inputs {
  display: flex;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.input-group input {
  width: 80px;
  padding: 8px 12px;
  border: 2px solid var(--color-border, #ddd);
  border-radius: var(--border-radius, 8px);
  font-size: 18px;
  font-family: inherit;
  text-align: center;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-primary, #4CAF50);
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: var(--border-radius, 12px);
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-large {
  padding: 18px 48px;
  font-size: 22px;
}

.btn-primary {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark, #388E3C);
}

.btn-warning {
  background: var(--color-warning, #FF9800);
  color: white;
}

.btn-warning:hover {
  background: #F57C00;
}

.btn-danger {
  background: var(--color-danger, #f44336);
  color: white;
}

.btn-danger:hover {
  background: #D32F2F;
}
</style>
```

**Step 2: Commit**

```bash
git add src/components/Timer/TimerControls.vue
git commit -m "feat: add timer controls with presets and custom durations"
```

---

### Task 10: Create Circular Progress Indicator

**Files:**
- Create: `src/components/Progress/CircularProgress.vue`

**Step 1: Create circular progress component**

```vue
<!-- src/components/Progress/CircularProgress.vue -->
<template>
  <div class="circular-progress">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- Background circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
      />
      <!-- Progress circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="progress-ring"
        :class="{ pulse: shouldPulse }"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../../stores/timer'

const props = defineProps({
  size: { type: Number, default: 280 },
  strokeWidth: { type: Number, default: 16 },
})

const timer = useTimerStore()

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const dashOffset = computed(() => {
  const progress = timer.progress
  return circumference.value * (1 - progress)
})

const bgColor = computed(() => 'var(--color-progress-bg, #e0e0e0)')

const progressColor = computed(() => {
  const percent = timer.progressPercent
  if (timer.status === 'break') return 'var(--color-secondary, #2196F3)'
  if (percent >= 75) return 'var(--color-danger, #f44336)'
  if (percent >= 50) return 'var(--color-warning, #FF9800)'
  return 'var(--color-primary, #4CAF50)'
})

const shouldPulse = computed(() => {
  return timer.timeRemaining <= 60 && timer.timeRemaining > 0 && timer.status !== 'paused'
})
</script>

<style scoped>
.circular-progress {
  display: flex;
  align-items: center;
  justify-content: center;
}

.circular-progress svg {
  transform: rotate(-90deg);
}

.progress-ring {
  transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
}

.progress-ring.pulse {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
```

**Step 2: Commit**

```bash
git add src/components/Progress/CircularProgress.vue
git commit -m "feat: add circular progress indicator with color changes"
```

---

### Task 11: Create Break Suggestion Component

**Files:**
- Create: `src/components/Break/BreakSuggestion.vue`

**Step 1: Create break suggestion component**

```vue
<!-- src/components/Break/BreakSuggestion.vue -->
<template>
  <div class="break-suggestion" v-if="currentSuggestion">
    <div class="suggestion-image">
      <img
        :src="`/images/break/${currentSuggestion.image}`"
        :alt="currentSuggestion.text"
        @error="handleImageError"
      />
    </div>
    <div class="suggestion-content">
      <span class="suggestion-icon">{{ currentSuggestion.icon }}</span>
      <p class="suggestion-text">{{ currentSuggestion.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTimerStore } from '../../stores/timer'
import { getRandomSuggestion } from '../../data/breakSuggestions'

const timer = useTimerStore()
const currentSuggestion = ref(null)
const recentTexts = ref([])
const lastCategory = ref(null)

let rotationInterval = null

function pickSuggestion() {
  const suggestion = getRandomSuggestion(
    lastCategory.value ? [lastCategory.value] : [],
    recentTexts.value
  )

  currentSuggestion.value = suggestion
  lastCategory.value = suggestion.category

  // Track recent to avoid repeats
  recentTexts.value.push(suggestion.text)
  if (recentTexts.value.length > 5) {
    recentTexts.value.shift()
  }
}

function handleImageError(e) {
  // Fallback to placeholder if image not found
  e.target.src = '/images/break/placeholder.svg'
}

function startRotation() {
  pickSuggestion()
  rotationInterval = setInterval(pickSuggestion, 30000)
}

function stopRotation() {
  if (rotationInterval) {
    clearInterval(rotationInterval)
    rotationInterval = null
  }
  currentSuggestion.value = null
  recentTexts.value = []
  lastCategory.value = null
}

watch(() => timer.status, (newStatus) => {
  if (newStatus === 'break') {
    startRotation()
  } else {
    stopRotation()
  }
})

onMounted(() => {
  if (timer.status === 'break') {
    startRotation()
  }
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.break-suggestion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--color-surface, white);
  border-radius: var(--border-radius-large, 20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.suggestion-image {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestion-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.suggestion-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.suggestion-icon {
  font-size: 32px;
}

.suggestion-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text, #333);
  line-height: 1.4;
}
</style>
```

**Step 2: Commit**

```bash
git add src/components/Break/BreakSuggestion.vue
git commit -m "feat: add break suggestion component with rotation"
```

---

### Task 12: Create Profile Selector Component

**Files:**
- Create: `src/components/Profiles/ProfileSelector.vue`

**Step 1: Create profile selector component**

```vue
<!-- src/components/Profiles/ProfileSelector.vue -->
<template>
  <div class="profile-selector">
    <h2>Quem vai usar o timer?</h2>

    <div class="profiles-grid">
      <button
        v-for="profile in profiles.profiles"
        :key="profile.id"
        class="profile-card"
        @click="selectProfile(profile.id)"
      >
        <div class="profile-avatar">
          <img :src="`/images/avatars/${profile.avatar}.svg`" :alt="profile.name" />
        </div>
        <span class="profile-name">{{ profile.name }}</span>
        <span class="profile-stats">{{ profile.totalPomodoros }} pomodoros</span>
      </button>

      <button class="profile-card add-new" @click="showCreateModal = true">
        <div class="profile-avatar">
          <span class="add-icon">+</span>
        </div>
        <span class="profile-name">Novo Perfil</span>
      </button>
    </div>

    <!-- Create Profile Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h3>Criar Novo Perfil</h3>
        <div class="form-group">
          <label>Nome</label>
          <input
            v-model="newProfileName"
            type="text"
            placeholder="Digite o nome..."
            @keyup.enter="createProfile"
            ref="nameInput"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showCreateModal = false">Cancelar</button>
          <button class="btn btn-primary" @click="createProfile" :disabled="!newProfileName.trim()">
            Criar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useProfilesStore } from '../../stores/profiles'

const emit = defineEmits(['profileSelected'])

const profiles = useProfilesStore()
const showCreateModal = ref(false)
const newProfileName = ref('')
const nameInput = ref(null)

watch(showCreateModal, async (show) => {
  if (show) {
    await nextTick()
    nameInput.value?.focus()
  }
})

function selectProfile(profileId) {
  profiles.selectProfile(profileId)
  emit('profileSelected')
}

function createProfile() {
  if (!newProfileName.value.trim()) return

  const profile = profiles.createProfile(newProfileName.value.trim())
  profiles.selectProfile(profile.id)

  newProfileName.value = ''
  showCreateModal.value = false
  emit('profileSelected')
}
</script>

<style scoped>
.profile-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 40px 20px;
}

.profile-selector h2 {
  font-size: 28px;
  color: var(--color-text, #333);
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  max-width: 600px;
  width: 100%;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius-large, 16px);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.profile-card:hover {
  border-color: var(--color-primary, #4CAF50);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary-light, #E8F5E9);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.profile-avatar img {
  width: 60px;
  height: 60px;
}

.add-icon {
  font-size: 40px;
  color: var(--color-primary, #4CAF50);
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.profile-stats {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}

.add-new {
  border-style: dashed;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-surface, white);
  padding: 32px;
  border-radius: var(--border-radius-large, 16px);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal h3 {
  font-size: 24px;
  color: var(--color-text, #333);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  font-size: 18px;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary, #4CAF50);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark, #388E3C);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text, #333);
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
```

**Step 2: Commit**

```bash
git add src/components/Profiles/ProfileSelector.vue
git commit -m "feat: add profile selector with create modal"
```

---

### Task 13: Create Theme CSS Files

**Files:**
- Create: `src/themes/base.css`
- Create: `src/themes/divertido.css`
- Create: `src/themes/minimalista.css`

**Step 1: Create base theme variables**

```css
/* src/themes/base.css */
:root {
  /* Default fallbacks */
  --color-primary: #4CAF50;
  --color-primary-light: #E8F5E9;
  --color-primary-dark: #388E3C;
  --color-secondary: #2196F3;
  --color-warning: #FF9800;
  --color-danger: #f44336;
  --color-neutral: #e0e0e0;

  --color-background: #f5f5f5;
  --color-surface: white;
  --color-border: #e0e0e0;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --color-progress-bg: #e0e0e0;

  --font-family: 'Nunito', sans-serif;
  --border-radius: 12px;
  --border-radius-large: 20px;

  --animation-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Step 2: Create divertido (fun) theme**

```css
/* src/themes/divertido.css */
[data-theme="divertido"] {
  --color-primary: #FF6B6B;
  --color-primary-light: #FFE5E5;
  --color-primary-dark: #E55555;
  --color-secondary: #4ECDC4;
  --color-warning: #FFE66D;
  --color-danger: #FF6B6B;
  --color-neutral: #F0F0F0;

  --color-background: linear-gradient(135deg, #FFF5F5 0%, #F5FFFA 100%);
  --color-surface: white;
  --color-border: #FFD1D1;
  --color-text: #2D3436;
  --color-text-secondary: #636E72;
  --color-progress-bg: #FFE5E5;

  --border-radius: 16px;
  --border-radius-large: 24px;
}

[data-theme="divertido"] body {
  background: linear-gradient(135deg, #FFF5F5 0%, #F5FFFA 100%);
}
```

**Step 3: Create minimalista theme**

```css
/* src/themes/minimalista.css */
[data-theme="minimalista"] {
  --color-primary: #2D3436;
  --color-primary-light: #F5F5F5;
  --color-primary-dark: #1A1A1A;
  --color-secondary: #636E72;
  --color-warning: #FDCB6E;
  --color-danger: #D63031;
  --color-neutral: #DFE6E9;

  --color-background: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-border: #DFE6E9;
  --color-text: #2D3436;
  --color-text-secondary: #636E72;
  --color-progress-bg: #DFE6E9;

  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --border-radius: 8px;
  --border-radius-large: 12px;
}

[data-theme="minimalista"] body {
  background: #FFFFFF;
}
```

**Step 4: Import themes in main.js**

Update `src/main.js`:
```javascript
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
```

**Step 5: Commit**

```bash
git add src/themes/ src/main.js
git commit -m "feat: add base and two starter themes"
```

---

### Task 14: Integrate Components in App.vue

**Files:**
- Modify: `src/App.vue`

**Step 1: Update App.vue with all components**

```vue
<!-- src/App.vue -->
<template>
  <div class="app" :class="{ 'break-mode': timer.status === 'break' }">
    <!-- Profile Selection Screen -->
    <ProfileSelector
      v-if="!profiles.activeProfile"
      @profileSelected="onProfileSelected"
    />

    <!-- Main Timer Screen -->
    <main v-else class="timer-screen">
      <header class="app-header">
        <button class="profile-badge" @click="showProfileSwitch = true">
          <img
            :src="`/images/avatars/${profiles.activeProfile.avatar}.svg`"
            :alt="profiles.activeProfile.name"
            class="profile-badge-avatar"
          />
          <span>{{ profiles.activeProfile.name }}</span>
        </button>

        <div class="header-stats">
          <span class="points">{{ profiles.activeProfile.points }} pts</span>
          <span class="today-count">Hoje: {{ timer.completedPomodorosToday }}</span>
        </div>
      </header>

      <div class="timer-main">
        <div class="progress-container">
          <CircularProgress :size="280" :stroke-width="16" />
          <div class="timer-overlay">
            <TimerDisplay />
          </div>
        </div>

        <BreakSuggestion v-if="timer.status === 'break'" />

        <TimerControls />
      </div>
    </main>

    <!-- Profile Switch Modal -->
    <div v-if="showProfileSwitch" class="modal-overlay" @click.self="showProfileSwitch = false">
      <div class="modal">
        <h3>Trocar Perfil</h3>
        <div class="profile-list">
          <button
            v-for="profile in profiles.profiles"
            :key="profile.id"
            class="profile-list-item"
            :class="{ active: profile.id === profiles.activeProfileId }"
            @click="switchProfile(profile.id)"
          >
            <img :src="`/images/avatars/${profile.avatar}.svg`" :alt="profile.name" />
            <span>{{ profile.name }}</span>
          </button>
        </div>
        <button class="btn btn-secondary" @click="showProfileSwitch = false">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTimerStore } from './stores/timer'
import { useProfilesStore } from './stores/profiles'
import { useSettingsStore } from './stores/settings'

import ProfileSelector from './components/Profiles/ProfileSelector.vue'
import TimerDisplay from './components/Timer/TimerDisplay.vue'
import TimerControls from './components/Timer/TimerControls.vue'
import CircularProgress from './components/Progress/CircularProgress.vue'
import BreakSuggestion from './components/Break/BreakSuggestion.vue'

const timer = useTimerStore()
const profiles = useProfilesStore()
const settings = useSettingsStore()

const showProfileSwitch = ref(false)

function onProfileSelected() {
  settings.initTheme()
}

function switchProfile(profileId) {
  if (timer.status !== 'idle') {
    if (!confirm('Trocar de perfil vai parar o timer. Continuar?')) {
      return
    }
    timer.stop()
  }
  profiles.selectProfile(profileId)
  showProfileSwitch.value = false
}

onMounted(() => {
  if (profiles.activeProfile) {
    settings.initTheme()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family, 'Nunito', sans-serif);
  background: var(--color-background, #f5f5f5);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  transition: background 0.3s ease;
}

.app.break-mode {
  background: linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%);
}

.timer-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.profile-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #333);
  transition: all 0.2s;
}

.profile-badge:hover {
  border-color: var(--color-primary, #4CAF50);
}

.profile-badge-avatar {
  width: 32px;
  height: 32px;
}

.header-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  font-weight: 600;
}

.points {
  color: var(--color-primary, #4CAF50);
}

.today-count {
  color: var(--color-text-secondary, #666);
}

.timer-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.progress-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-surface, white);
  padding: 32px;
  border-radius: var(--border-radius-large, 16px);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal h3 {
  font-size: 24px;
  color: var(--color-text, #333);
}

.profile-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  color: var(--color-text, #333);
  transition: all 0.2s;
}

.profile-list-item:hover {
  border-color: var(--color-primary, #4CAF50);
}

.profile-list-item.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.profile-list-item img {
  width: 40px;
  height: 40px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text, #333);
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
```

**Step 2: Verify app runs**

Run: `npm run dev`
Expected: App loads, shows profile selector, can create profile and see timer

**Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: integrate all components in App.vue"
```

---

## Phase 5: Remaining Features (Summary)

The following tasks follow the same pattern. Each creates a component or feature:

### Task 15: Animal Path Progress Indicator
- Create `src/components/Progress/AnimalPath.vue`
- SVG path with animated animal sprite

### Task 16: Hourglass Progress Indicator
- Create `src/components/Progress/Hourglass.vue`
- Animated sand particles

### Task 17: Progress Bar with Character
- Create `src/components/Progress/ProgressBar.vue`
- Horizontal bar with riding character

### Task 18: Audio Utility & Sound Effects
- Create `src/utils/audio.js`
- Handles playing sounds on timer events

### Task 19: Classical Music Player
- Create `src/components/Music/ClassicalPlayer.vue`
- Shows track info, plays embedded audio

### Task 20: YouTube Integration
- Create `src/components/Music/YouTubePlayer.vue`
- URL input, IFrame embed

### Task 21: Settings Panel
- Create `src/components/Settings/SettingsPanel.vue`
- Theme picker, sound toggles, indicator selection

### Task 22: Rewards & Shop
- Create `src/components/Rewards/RewardsShop.vue`
- Buy avatars, themes, animals with points

### Task 23: Badges Display
- Create `src/components/Rewards/BadgesDisplay.vue`
- Show earned badges

### Task 24: Celebration Animations
- Create `src/components/Rewards/Celebration.vue`
- Confetti, sounds on pomodoro complete

### Task 25: Placeholder Images
- Create SVG placeholders for avatars, break suggestions, animals
- Add to `public/images/`

### Task 26: Unlockable Themes
- Create `src/themes/floresta.css`, `espaco.css`, `oceano.css`, `doces.css`

### Task 27: Final Polish & Testing
- Test all flows manually
- Responsive design check
- Accessibility basics (focus states, ARIA)

---

## Execution Notes

- Each task is small (5-15 minutes)
- Commit after each task
- Test incrementally
- Placeholder images are fine initially - can be replaced with final art later
