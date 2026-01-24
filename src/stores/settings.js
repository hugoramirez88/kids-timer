// src/stores/settings.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '../utils/storage'

export const useSettingsStore = defineStore('settings', () => {
  const data = storage.load()

  // Global settings
  const masterVolume = ref(data.globalSettings?.masterVolume ?? 0.8)
  const soundEffectsEnabled = ref(data.globalSettings?.soundEffectsEnabled ?? true)
  const hapticEnabled = ref(data.globalSettings?.hapticEnabled ?? true)
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

  // Developer mode (unlocks all features for testing)
  const devMode = ref(false)

  function saveSettings() {
    const current = storage.load()
    current.globalSettings = {
      masterVolume: masterVolume.value,
      soundEffectsEnabled: soundEffectsEnabled.value,
      hapticEnabled: hapticEnabled.value,
      defaultPreset: defaultPreset.value,
    }
    storage.save(current)
  }

  // Auto-save on changes
  watch([masterVolume, soundEffectsEnabled, hapticEnabled, defaultPreset], saveSettings)

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
    hapticEnabled,
    defaultPreset,
    alerts,
    musicPreference,
    youtubeUrl,
    progressIndicator,
    theme,
    pathAnimal,
    devMode,
    setTheme,
    initTheme,
    saveSettings,
  }
})
