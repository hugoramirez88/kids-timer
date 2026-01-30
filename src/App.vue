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
        <div class="profile-section">
          <button class="profile-badge" @click="showProfileSwitch = true">
            <img
              :src="`${baseUrl}images/avatars/${profiles.activeProfile.avatar}.svg`"
              :alt="profiles.activeProfile.name"
              class="profile-badge-avatar"
            />
            <span>{{ profiles.activeProfile.name }}</span>
          </button>
          <button class="edit-profile-btn" @click="openEditProfile" title="Editar perfil">
            ✏️
          </button>
        </div>

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

      <ErrorBoundary>
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
      </ErrorBoundary>
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
            <img :src="`${baseUrl}images/avatars/${profile.avatar}.svg`" :alt="profile.name" />
            <span>{{ profile.name }}</span>
          </button>
          <!-- Add new profile option -->
          <button class="profile-list-item add-new" @click="showCreateProfile = true; showProfileSwitch = false">
            <span class="add-icon">+</span>
            <span>Novo Perfil</span>
          </button>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showProfileSwitch = false">Fechar</button>
          <button class="btn btn-danger" @click="logout">Sair</button>
        </div>
      </div>
    </div>

    <!-- Create New Profile Modal -->
    <div v-if="showCreateProfile" class="modal-overlay" @click.self="showCreateProfile = false">
      <div class="modal">
        <h3>Criar Novo Perfil</h3>
        <div class="form-group">
          <label>Nome</label>
          <input
            v-model="newProfileName"
            type="text"
            placeholder="Digite o nome..."
            @keyup.enter="createNewProfile"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showCreateProfile = false">Cancelar</button>
          <button class="btn btn-primary" @click="createNewProfile" :disabled="!newProfileName.trim()">Criar</button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="modal-overlay" @click.self="showEditProfile = false">
      <div class="modal">
        <h3>Editar Perfil</h3>

        <div class="form-group">
          <label>Nome</label>
          <input
            v-model="editProfileName"
            type="text"
            maxlength="20"
            placeholder="Digite o nome..."
          />
        </div>

        <div class="form-group">
          <label>Avatar</label>
          <div class="avatar-grid">
            <button
              v-for="avatar in unlockedAvatars"
              :key="avatar.id"
              :class="['avatar-option', { selected: editProfileAvatar === avatar.id }]"
              @click="editProfileAvatar = avatar.id"
              type="button"
            >
              <img :src="`${baseUrl}images/avatars/${avatar.id}.svg`" :alt="avatar.name" />
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showEditProfile = false">Cancelar</button>
          <button
            class="btn btn-primary"
            @click="saveProfileEdit"
            :disabled="!editProfileName.trim()"
          >
            Salvar
          </button>
        </div>
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

    <!-- Hidden YouTube Player (persists across views) -->
    <div class="hidden-youtube-player">
      <div id="youtube-player-global"></div>
    </div>

    <!-- Toast Notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTimerStore } from './stores/timer'
import { useProfilesStore } from './stores/profiles'
import { useSettingsStore } from './stores/settings'
import { useAudioStore } from './stores/audio'
import { useYoutubeStore } from './stores/youtube'

import { cleanupAudioListeners } from './utils/audio'
import ErrorBoundary from './components/ErrorBoundary.vue'
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
import Toast from './components/UI/Toast.vue'
import { avatars } from './data/rewards'

const baseUrl = import.meta.env.BASE_URL

const timer = useTimerStore()
const profiles = useProfilesStore()
const settings = useSettingsStore()
const audio = useAudioStore()
const youtube = useYoutubeStore()

const showProfileSwitch = ref(false)
const showSettings = ref(false)
const showRewardsShop = ref(false)
const showBadges = ref(false)
const showCreateProfile = ref(false)
const newProfileName = ref('')
const showEditProfile = ref(false)
const editProfileName = ref('')
const editProfileAvatar = ref('')

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

// Unlocked avatars for profile editing
const unlockedAvatars = computed(() => {
  if (!profiles.activeProfile) return []
  return avatars.filter(a => profiles.activeProfile.unlockedAvatars.includes(a.id))
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

function createNewProfile() {
  if (!newProfileName.value.trim()) return
  const profile = profiles.createProfile(newProfileName.value.trim())
  profiles.selectProfile(profile.id)
  newProfileName.value = ''
  showCreateProfile.value = false
}

function logout() {
  if (timer.status !== 'idle') {
    timer.stop()
  }
  profiles.logout()
  showProfileSwitch.value = false
}

function openEditProfile() {
  if (!profiles.activeProfile) return
  editProfileName.value = profiles.activeProfile.name
  editProfileAvatar.value = profiles.activeProfile.avatar
  showEditProfile.value = true
}

function saveProfileEdit() {
  if (!editProfileName.value.trim()) return
  profiles.updateProfile(profiles.activeProfileId, {
    name: editProfileName.value.trim(),
    avatar: editProfileAvatar.value
  })
  showEditProfile.value = false
}

onMounted(() => {
  if (profiles.activeProfile) {
    settings.initTheme()
    // Restore other profile settings that aren't part of theme
    settings.progressIndicator = profiles.activeProfile.progressIndicator
    settings.musicPreference = profiles.activeProfile.musicPreference
    settings.pathAnimal = profiles.activeProfile.pathAnimal
  }
  // Initialize YouTube
  youtube.init()
  youtube.initApi()
  youtube.setPlayerElement('youtube-player-global')
})

onUnmounted(() => {
  // Clean up event listeners to prevent memory leaks
  timer.cleanup()
  cleanupAudioListeners()
})

// Pause music when timer pauses/stops/ends
watch(() => timer.status, (newStatus, oldStatus) => {
  // Pause music when timer is paused or stopped
  if (newStatus === 'paused' || newStatus === 'idle') {
    if (audio.isPlaying) {
      audio.pause()
    }
    if (youtube.isPlaying) {
      youtube.pause()
    }
  }

  // Resume music when starting work or resuming from pause
  if ((oldStatus === 'paused' || oldStatus === 'idle') && newStatus === 'working') {
    if (audio.currentTrackId && !audio.isPlaying) {
      audio.toggle()
    }
    if (youtube.currentVideoId && !youtube.isPlaying) {
      youtube.toggle()
    }
  }

  // Also resume when transitioning to break
  if (oldStatus === 'paused' && newStatus === 'break') {
    if (audio.currentTrackId && !audio.isPlaying) {
      audio.toggle()
    }
    if (youtube.currentVideoId && !youtube.isPlaying) {
      youtube.toggle()
    }
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
  overflow-x: hidden;
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
  min-width: 44px;
  min-height: 44px;
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
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
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

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-danger {
  background: var(--color-danger, #f44336);
  color: white;
}

.btn-danger:hover {
  background: #d32f2f;
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

.profile-list-item.add-new {
  border-style: dashed;
}

.profile-list-item .add-icon {
  font-size: 24px;
  color: var(--color-primary, #4CAF50);
  width: 40px;
  text-align: center;
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

.hidden-youtube-player {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-profile-btn {
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  background: var(--color-surface, white);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-profile-btn:hover {
  border-color: var(--color-primary, #4CAF50);
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.avatar-option {
  width: 70px;
  height: 70px;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  background: var(--color-surface, white);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.avatar-option:hover {
  border-color: var(--color-primary, #4CAF50);
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.avatar-option img {
  width: 50px;
  height: 50px;
}
</style>
