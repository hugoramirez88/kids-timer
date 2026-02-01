// src/stores/profiles.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { useSettingsStore } from './settings'
import { DEFAULT_UNLOCKED } from '../data/defaults'

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
      unlockedThemes: [...DEFAULT_UNLOCKED.themes],
      unlockedAvatars: [...DEFAULT_UNLOCKED.avatars],
      unlockedAnimals: [...DEFAULT_UNLOCKED.animals],
      unlockedSoundscapes: [...DEFAULT_UNLOCKED.soundscapes],
      unlockedEnergeticTracks: [...DEFAULT_UNLOCKED.energeticTracks],
      unlockedIllustrationStyles: [...DEFAULT_UNLOCKED.illustrationStyles],
      illustrationStyle: 'default',
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
      case 'soundscape':
        if (!profile.unlockedSoundscapes) {
          profile.unlockedSoundscapes = [...DEFAULT_UNLOCKED.soundscapes]
        }
        if (!profile.unlockedSoundscapes.includes(itemId)) {
          profile.unlockedSoundscapes.push(itemId)
        }
        break
      case 'energetic':
        if (!profile.unlockedEnergeticTracks) {
          profile.unlockedEnergeticTracks = [...DEFAULT_UNLOCKED.energeticTracks]
        }
        if (!profile.unlockedEnergeticTracks.includes(itemId)) {
          profile.unlockedEnergeticTracks.push(itemId)
        }
        break
      case 'illustrationStyle':
        if (!profile.unlockedIllustrationStyles) {
          profile.unlockedIllustrationStyles = [...DEFAULT_UNLOCKED.illustrationStyles]
        }
        if (!profile.unlockedIllustrationStyles.includes(itemId)) {
          profile.unlockedIllustrationStyles.push(itemId)
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
    window.dispatchEvent(new CustomEvent('badge-earned', {
      detail: { badgeId }
    }))
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
    const earnBadge = (badgeId) => {
      if (!profile.badges.includes(badgeId)) {
        profile.badges.push(badgeId)
        window.dispatchEvent(new CustomEvent('badge-earned', {
          detail: { badgeId }
        }))
      }
    }

    if (profile.totalPomodoros >= 1) {
      earnBadge('primeiro-passo')
    }
    if (profile.totalPomodoros >= 100) {
      earnBadge('centuriao')
    }
    if (profile.currentStreak >= 7) {
      earnBadge('consistente')
    }
    if (profile.currentStreak >= 30) {
      earnBadge('dedicado')
    }
    if (profile.unlockedThemes.length >= 3) {
      earnBadge('fashionista')
    }
    if (profile.triedIndicators.length >= 4) {
      earnBadge('explorador')
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

  function logout() {
    activeProfileId.value = null
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
    logout,
    addPoints,
    spendPoints,
    unlockItem,
    awardBadge,
    recordPomodoroComplete,
  }
})
