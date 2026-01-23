<!-- src/components/Settings/SettingsPanel.vue -->
<template>
  <div class="settings-panel">
    <h2 @click="handleHeaderTap">Configuracoes</h2>

    <!-- Theme Selection -->
    <section class="settings-section">
      <h3>Tema</h3>
      <div class="theme-grid">
        <button
          type="button"
          v-for="theme in availableThemes"
          :key="theme.id"
          :class="['theme-btn', { active: settings.theme === theme.id, locked: !isUnlocked('theme', theme.id) }]"
          @click="selectTheme(theme.id)"
          :disabled="!isUnlocked('theme', theme.id)"
        >
          <span class="theme-preview" :style="getThemePreviewStyle(theme.id)"></span>
          <span class="theme-name">{{ theme.name }}</span>
          <span v-if="!isUnlocked('theme', theme.id)" class="lock-icon">&#128274;</span>
        </button>
      </div>
    </section>

    <!-- Progress Indicator Selection -->
    <section class="settings-section">
      <h3>Indicador de Progresso</h3>
      <div class="indicator-grid">
        <button
          type="button"
          v-for="indicator in indicators"
          :key="indicator.id"
          :class="['indicator-btn', { active: settings.progressIndicator === indicator.id }]"
          @click="selectIndicator(indicator.id)"
        >
          <span class="indicator-icon">{{ indicator.icon }}</span>
          <span class="indicator-name">{{ indicator.name }}</span>
        </button>
      </div>
    </section>

    <!-- Sound Settings -->
    <section class="settings-section">
      <h3>Som</h3>

      <div class="setting-row">
        <label>Efeitos sonoros</label>
        <button
          type="button"
          :class="['toggle-btn', { active: settings.soundEffectsEnabled }]"
          @click="settings.soundEffectsEnabled = !settings.soundEffectsEnabled"
        >
          {{ settings.soundEffectsEnabled ? 'Ligado' : 'Desligado' }}
        </button>
      </div>

      <div class="setting-row">
        <label>Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          v-model.number="settings.masterVolume"
        />
      </div>
    </section>

    <!-- Music Settings -->
    <section class="settings-section">
      <h3>Musica</h3>
      <div class="music-options">
        <button
          type="button"
          v-for="option in musicOptions"
          :key="option.id"
          :class="['music-btn', { active: settings.musicPreference === option.id }]"
          @click="selectMusicPreference(option.id)"
        >
          <span class="music-icon">{{ option.icon }}</span>
          <span class="music-name">{{ option.name }}</span>
        </button>
      </div>
      <MusicPlayer v-if="settings.musicPreference === 'music'" />
      <YouTubePlayer v-if="settings.musicPreference === 'youtube'" />
    </section>

    <!-- Alert Settings -->
    <section class="settings-section">
      <h3>Alertas de Tempo</h3>

      <div class="setting-row">
        <label>1 minuto restante</label>
        <button
          type="button"
          :class="['toggle-btn', { active: settings.alerts.oneMinute }]"
          @click="settings.alerts.oneMinute = !settings.alerts.oneMinute"
        >
          {{ settings.alerts.oneMinute ? 'Ligado' : 'Desligado' }}
        </button>
      </div>

      <div class="setting-row">
        <label>5 minutos restantes</label>
        <button
          type="button"
          :class="['toggle-btn', { active: settings.alerts.fiveMinutes }]"
          @click="settings.alerts.fiveMinutes = !settings.alerts.fiveMinutes"
        >
          {{ settings.alerts.fiveMinutes ? 'Ligado' : 'Desligado' }}
        </button>
      </div>

      <div class="setting-row">
        <label>50% do tempo</label>
        <button
          type="button"
          :class="['toggle-btn', { active: settings.alerts.fiftyPercent }]"
          @click="settings.alerts.fiftyPercent = !settings.alerts.fiftyPercent"
        >
          {{ settings.alerts.fiftyPercent ? 'Ligado' : 'Desligado' }}
        </button>
      </div>

      <div class="setting-row">
        <label>25% do tempo</label>
        <button
          type="button"
          :class="['toggle-btn', { active: settings.alerts.twentyFivePercent }]"
          @click="settings.alerts.twentyFivePercent = !settings.alerts.twentyFivePercent"
        >
          {{ settings.alerts.twentyFivePercent ? 'Ligado' : 'Desligado' }}
        </button>
      </div>
    </section>

    <!-- Developer Mode (for testing) -->
    <section v-if="devModeVisible" class="settings-section dev-section">
      <h3>Modo Desenvolvedor</h3>
      <p class="dev-hint">Para testar funcionalidades</p>

      <div class="setting-row">
        <label>Desbloquear tudo</label>
        <button
          type="button"
          :class="['toggle-btn', { active: settings.devMode }]"
          @click="settings.devMode = !settings.devMode"
        >
          {{ settings.devMode ? 'Ligado' : 'Desligado' }}
        </button>
      </div>

      <div class="dev-actions">
        <button type="button" class="dev-btn" @click="addTestPoints(50)">
          +50 pontos
        </button>
        <button type="button" class="dev-btn" @click="addTestPoints(200)">
          +200 pontos
        </button>
        <button type="button" class="dev-btn danger" @click="resetProfile">
          Resetar perfil
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '../../stores/settings'
import { useProfilesStore } from '../../stores/profiles'
import { useAudioStore } from '../../stores/audio'
import { themes } from '../../data/rewards'
import MusicPlayer from '../Music/MusicPlayer.vue'
import YouTubePlayer from '../Music/YouTubePlayer.vue'

const settings = useSettingsStore()
const profiles = useProfilesStore()
const audio = useAudioStore()

// Dev mode visibility (hidden behind secret gesture)
const devModeVisible = ref(false)
const tapCount = ref(0)
let tapTimer = null

function handleHeaderTap() {
  tapCount.value++

  // Clear previous timer
  if (tapTimer) clearTimeout(tapTimer)

  // Reset after 2 seconds
  tapTimer = setTimeout(() => {
    tapCount.value = 0
  }, 2000)

  // Unlock after 7 taps
  if (tapCount.value >= 7) {
    devModeVisible.value = true
    tapCount.value = 0
  }
}

const availableThemes = themes

const musicOptions = [
  { id: 'none', name: 'Desligado', icon: '🔇' },
  { id: 'music', name: 'Música', icon: '🎵' },
  { id: 'youtube', name: 'YouTube', icon: '🎬' },
]

const indicators = [
  { id: 'circular', name: 'Circulo', icon: '⭕' },
  { id: 'animal-path', name: 'Caminho', icon: '🐰' },
  { id: 'hourglass', name: 'Ampulheta', icon: '⏳' },
  { id: 'progress-bar', name: 'Barra', icon: '📊' },
]

function isUnlocked(type, id) {
  // Dev mode unlocks everything
  if (settings.devMode) return true

  if (!profiles.activeProfile) return false
  if (type === 'theme') {
    return profiles.activeProfile.unlockedThemes.includes(id)
  }
  return true
}

function addTestPoints(amount) {
  if (profiles.activeProfile) {
    profiles.addPoints(amount)
  }
}

function resetProfile() {
  if (!profiles.activeProfile) return
  if (!confirm('Isso vai resetar todos os pontos e desbloqueios. Continuar?')) return

  profiles.updateProfile(profiles.activeProfileId, {
    points: 0,
    totalPomodoros: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    unlockedThemes: ['divertido', 'minimalista'],
    unlockedAvatars: ['rabbit'],
    unlockedAnimals: ['rabbit'],
    unlockedSoundscapes: ['piano-calmo', 'anoitecer'],
    badges: [],
    triedIndicators: [],
  })
}

function selectTheme(themeId) {
  if (!isUnlocked('theme', themeId)) return
  settings.setTheme(themeId)
  if (profiles.activeProfile) {
    profiles.updateProfile(profiles.activeProfileId, { theme: themeId })
  }
}

function selectIndicator(indicatorId) {
  settings.progressIndicator = indicatorId
  if (profiles.activeProfile) {
    profiles.updateProfile(profiles.activeProfileId, { progressIndicator: indicatorId })
    // Track for explorer badge
    if (!profiles.activeProfile.triedIndicators.includes(indicatorId)) {
      profiles.activeProfile.triedIndicators.push(indicatorId)
    }
  }
}

function getThemePreviewStyle(themeId) {
  const colors = {
    divertido: '#FF6B6B',
    minimalista: '#2D3436',
    floresta: '#27AE60',
    espaco: '#2C3E50',
    oceano: '#3498DB',
    doces: '#E91E63',
  }
  return { backgroundColor: colors[themeId] || '#ccc' }
}

function selectMusicPreference(preference) {
  // Stop any playing audio when switching to 'none'
  if (preference === 'none') {
    audio.stop()
  }
  settings.musicPreference = preference
}
</script>

<style scoped>
.settings-panel {
  padding: 24px;
  max-width: 500px;
  margin: 0 auto;
}

.settings-panel h2 {
  font-size: 28px;
  margin-bottom: 24px;
  color: var(--color-text, #333);
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text, #333);
}

.theme-grid, .indicator-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.theme-btn, .indicator-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.theme-btn:hover:not(:disabled), .indicator-btn:hover {
  border-color: var(--color-primary, #4CAF50);
}

.theme-btn.active, .indicator-btn.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.theme-btn.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.theme-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.theme-name, .indicator-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.indicator-icon {
  font-size: 24px;
}

.lock-icon {
  font-size: 12px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
}

.setting-row label {
  font-size: 16px;
  color: var(--color-text, #333);
}

.toggle-btn {
  padding: 8px 16px;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  background: var(--color-surface, white);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text-secondary, #666);
}

.toggle-btn.active {
  background: var(--color-primary, #4CAF50);
  border-color: var(--color-primary, #4CAF50);
  color: white;
}

input[type="range"] {
  width: 120px;
  cursor: pointer;
}

.music-options {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.music-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.music-btn:hover {
  border-color: var(--color-primary, #4CAF50);
}

.music-btn.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.music-icon {
  font-size: 24px;
}

.music-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text, #333);
}

/* Developer Mode Section */
.dev-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px dashed var(--color-border, #e0e0e0);
}

.dev-hint {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
  margin-bottom: 16px;
}

.dev-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.dev-btn {
  padding: 8px 16px;
  background: var(--color-secondary, #2196F3);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.dev-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.dev-btn.danger {
  background: var(--color-danger, #f44336);
}
</style>
