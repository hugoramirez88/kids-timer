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

        <div class="header-actions">
          <div class="header-stats">
            <button type="button" class="points-btn" @click="showRewardsShop = true" title="Loja">
              {{ profiles.activeProfile.points }} ⭐
            </button>
            <button type="button" class="badges-btn" @click="showBadges = true" title="Conquistas">
              🏆
            </button>
            <span class="today-count">Hoje: {{ timer.completedPomodorosToday }}</span>
          </div>
          <button type="button" class="settings-btn" @click="showSettings = true" title="Configurações">
            ⚙️
          </button>
        </div>
      </header>

      <div class="timer-main">
        <div class="progress-container">
          <!-- Dynamic Progress Indicator -->
          <component :is="progressComponent" />
          <div class="timer-overlay" v-if="settings.progressIndicator === 'circular'">
            <TimerDisplay />
          </div>
        </div>

        <!-- Timer display below for non-circular indicators -->
        <TimerDisplay v-if="settings.progressIndicator !== 'circular'" />

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

    <!-- Settings Modal -->
    <div v-if="showSettings" class="modal-overlay" @click.self="showSettings = false">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>Configurações</h3>
          <button type="button" class="close-btn" @click="showSettings = false">✕</button>
        </div>
        <SettingsPanel />
      </div>
    </div>

    <!-- Rewards Shop Modal -->
    <div v-if="showRewardsShop" class="modal-overlay" @click.self="showRewardsShop = false">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>Loja de Recompensas</h3>
          <button type="button" class="close-btn" @click="showRewardsShop = false">✕</button>
        </div>
        <RewardsShop />
      </div>
    </div>

    <!-- Badges Display Modal -->
    <div v-if="showBadges" class="modal-overlay" @click.self="showBadges = false">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>Conquistas</h3>
          <button type="button" class="close-btn" @click="showBadges = false">✕</button>
        </div>
        <BadgesDisplay />
      </div>
    </div>

    <!-- Celebration Overlay -->
    <Celebration />

    <!-- Floating Mini Player (shows when music is playing) -->
    <MiniPlayer v-if="profiles.activeProfile" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTimerStore } from './stores/timer'
import { useProfilesStore } from './stores/profiles'
import { useSettingsStore } from './stores/settings'

import ProfileSelector from './components/Profiles/ProfileSelector.vue'
import TimerDisplay from './components/Timer/TimerDisplay.vue'
import TimerControls from './components/Timer/TimerControls.vue'
import CircularProgress from './components/Progress/CircularProgress.vue'
import AnimalPath from './components/Progress/AnimalPath.vue'
import Hourglass from './components/Progress/Hourglass.vue'
import ProgressBar from './components/Progress/ProgressBar.vue'
import BreakSuggestion from './components/Break/BreakSuggestion.vue'
import SettingsPanel from './components/Settings/SettingsPanel.vue'
import RewardsShop from './components/Rewards/RewardsShop.vue'
import BadgesDisplay from './components/Rewards/BadgesDisplay.vue'
import Celebration from './components/Rewards/Celebration.vue'
import MiniPlayer from './components/Music/MiniPlayer.vue'

const timer = useTimerStore()
const profiles = useProfilesStore()
const settings = useSettingsStore()

const showProfileSwitch = ref(false)
const showSettings = ref(false)
const showRewardsShop = ref(false)
const showBadges = ref(false)

// Dynamic progress indicator component
const progressComponent = computed(() => {
  const indicators = {
    'circular': CircularProgress,
    'animal-path': AnimalPath,
    'hourglass': Hourglass,
    'progress-bar': ProgressBar,
  }
  return indicators[settings.progressIndicator] || CircularProgress
})

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
  gap: 12px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
}

.points-btn, .badges-btn {
  padding: 6px 12px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.points-btn {
  color: var(--color-primary, #4CAF50);
}

.badges-btn {
  font-size: 16px;
}

.points-btn:hover, .badges-btn:hover {
  border-color: var(--color-primary, #4CAF50);
  transform: scale(1.05);
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.settings-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  background: var(--color-surface, white);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-btn:hover {
  border-color: var(--color-primary, #4CAF50);
}

.modal-large {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-secondary, #666);
}

.close-btn:hover {
  color: var(--color-text, #333);
}
</style>
