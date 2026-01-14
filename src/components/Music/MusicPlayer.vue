<!-- src/components/Music/MusicPlayer.vue -->
<template>
  <div class="music-player">
    <div class="player-header">
      <h3>Sons Ambiente</h3>
      <button type="button" class="toggle-btn" @click="togglePlayer">
        {{ isPlaying ? 'Pausar' : 'Tocar' }}
      </button>
    </div>

    <!-- Now Playing -->
    <div v-if="currentSoundscape" class="now-playing" :class="{ playing: isPlaying }">
      <div class="soundscape-icon">
        {{ currentSoundscape.icon }}
      </div>
      <div class="soundscape-info">
        <span class="soundscape-name">{{ currentSoundscape.name }}</span>
        <span class="soundscape-desc">{{ currentSoundscape.description }}</span>
      </div>
      <div class="visualizer" v-if="isPlaying">
        <div class="bar" v-for="i in 5" :key="i" :style="getBarStyle(i)"></div>
      </div>
    </div>

    <!-- Soundscape Selection -->
    <div class="soundscape-grid">
      <button
        type="button"
        v-for="soundscape in soundscapes"
        :key="soundscape.id"
        :class="[
          'soundscape-item',
          {
            active: currentSoundscape?.id === soundscape.id,
            locked: !isUnlocked(soundscape.id)
          }
        ]"
        @click="selectSoundscape(soundscape)"
        :disabled="!isUnlocked(soundscape.id)"
      >
        <span class="item-icon">{{ soundscape.icon }}</span>
        <span class="item-name">{{ soundscape.name }}</span>
        <span v-if="!isUnlocked(soundscape.id)" class="item-cost">
          {{ soundscape.cost }} ⭐
        </span>
        <span v-else-if="currentSoundscape?.id === soundscape.id && isPlaying" class="playing-indicator">
          ♪
        </span>
      </button>
    </div>

    <!-- Classical Music Section -->
    <div class="classical-section">
      <h4>Músicas Clássicas</h4>
      <p class="info-text">Curiosidades sobre compositores famosos</p>
      <div class="track-list">
        <div
          v-for="track in classicalMusic"
          :key="track.id"
          class="track-item"
          @click="showTrackInfo(track)"
        >
          <span class="track-emoji">{{ getInstrumentEmoji(track.instrument) }}</span>
          <div class="track-details">
            <span class="track-name">{{ track.title }}</span>
            <span class="track-author">{{ track.composer }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Track Info Modal -->
    <div v-if="selectedTrack" class="track-modal" @click.self="selectedTrack = null">
      <div class="track-modal-content">
        <div class="modal-icon">{{ getInstrumentEmoji(selectedTrack.instrument) }}</div>
        <h3>{{ selectedTrack.title }}</h3>
        <p class="composer">{{ selectedTrack.composer }}</p>
        <div class="info-row">
          <span class="label">Instrumento:</span>
          <span class="value">{{ selectedTrack.instrument }}</span>
        </div>
        <div class="fun-fact">
          <span class="label">Curiosidade:</span>
          <p>{{ selectedTrack.funFact }}</p>
        </div>
        <button type="button" class="close-modal-btn" @click="selectedTrack = null">
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { soundscapes, getSoundscape } from '../../data/ambientSoundscapes'
import { classicalMusic } from '../../data/classicalMusic'
import { useTimerStore } from '../../stores/timer'
import { useSettingsStore } from '../../stores/settings'
import { useProfilesStore } from '../../stores/profiles'
import { getAmbientEngine } from '../../utils/ambientAudio'

const timer = useTimerStore()
const settings = useSettingsStore()
const profiles = useProfilesStore()

const currentSoundscape = ref(soundscapes[0])
const selectedTrack = ref(null)
const isPlaying = ref(false)

const ambientEngine = getAmbientEngine()

function isUnlocked(soundscapeId) {
  // Check for dev mode
  if (settings.devMode) return true

  const soundscape = getSoundscape(soundscapeId)
  if (soundscape.cost === 0) return true
  return profiles.activeProfile?.unlockedSoundscapes?.includes(soundscapeId) || false
}

function togglePlayer() {
  if (isPlaying.value) {
    pauseMusic()
  } else {
    playMusic()
  }
}

function playMusic() {
  ambientEngine.play(currentSoundscape.value.id)
  isPlaying.value = true
}

function pauseMusic() {
  ambientEngine.stop()
  isPlaying.value = false
}

function selectSoundscape(soundscape) {
  if (!isUnlocked(soundscape.id)) return

  currentSoundscape.value = soundscape

  if (isPlaying.value) {
    ambientEngine.switchSoundscape(soundscape.id)
  }
}

function showTrackInfo(track) {
  selectedTrack.value = track
}

function getInstrumentEmoji(instrument) {
  const emojis = {
    'Violino': '🎻',
    'Piano': '🎹',
    'Violoncelo': '🎻',
    'Orquestra': '🎼',
    'Orquestra de Cordas': '🎼',
    'Flauta': '🪈',
  }
  return emojis[instrument] || '🎵'
}

function getBarStyle(index) {
  const config = currentSoundscape.value?.config || { lfoRate: 0.1 }
  const baseHeight = 30 + (index * 10)
  const delay = index * 0.15
  const speed = 0.8 + (config.lfoRate * 2)

  return {
    height: `${baseHeight}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${speed}s`,
  }
}

// Auto-play based on settings and timer status
watch(() => timer.status, (status) => {
  if (settings.musicPreference === 'classical') {
    if (status === 'working' && !isPlaying.value) {
      playMusic()
    } else if (status !== 'working' && isPlaying.value) {
      pauseMusic()
    }
  }
})

onMounted(() => {
  // Initialize with first unlocked soundscape
  const unlocked = soundscapes.find(s => isUnlocked(s.id))
  if (unlocked) {
    currentSoundscape.value = unlocked
  }
})

onUnmounted(() => {
  if (isPlaying.value) {
    ambientEngine.stop()
  }
})
</script>

<style scoped>
.music-player {
  padding: 16px;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.player-header h3 {
  font-size: 18px;
  color: var(--color-text, #333);
}

.toggle-btn {
  padding: 8px 20px;
  background: var(--color-primary, #4CAF50);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: var(--color-primary-dark, #388E3C);
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  margin-bottom: 16px;
  transition: all 0.3s;
}

.now-playing.playing {
  background: var(--color-primary-light, #E8F5E9);
  border-color: var(--color-primary, #4CAF50);
}

.soundscape-icon {
  font-size: 36px;
}

.soundscape-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.soundscape-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.soundscape-desc {
  font-size: 13px;
  color: var(--color-text-secondary, #666);
}

.visualizer {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 30px;
}

.bar {
  width: 4px;
  background: var(--color-primary, #4CAF50);
  border-radius: 2px;
  animation: pulse-bar 0.8s ease-in-out infinite alternate;
}

@keyframes pulse-bar {
  0% { transform: scaleY(0.4); }
  100% { transform: scaleY(1); }
}

.soundscape-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 24px;
}

.soundscape-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.soundscape-item:hover:not(:disabled) {
  border-color: var(--color-primary, #4CAF50);
  transform: translateY(-2px);
}

.soundscape-item.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.soundscape-item.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.item-icon {
  font-size: 24px;
}

.item-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text, #333);
  text-align: center;
}

.item-cost {
  font-size: 10px;
  color: var(--color-warning, #FF9800);
  font-weight: 600;
}

.playing-indicator {
  font-size: 12px;
  color: var(--color-primary, #4CAF50);
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.classical-section {
  border-top: 1px solid var(--color-border, #e0e0e0);
  padding-top: 16px;
}

.classical-section h4 {
  font-size: 16px;
  color: var(--color-text, #333);
  margin-bottom: 4px;
}

.info-text {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
  margin-bottom: 12px;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: all 0.2s;
}

.track-item:hover {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.track-emoji {
  font-size: 20px;
}

.track-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.track-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.track-author {
  font-size: 11px;
  color: var(--color-text-secondary, #666);
}

/* Track Info Modal */
.track-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.track-modal-content {
  background: var(--color-surface, white);
  padding: 28px;
  border-radius: var(--border-radius-large, 20px);
  max-width: 320px;
  width: 90%;
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.track-modal-content h3 {
  font-size: 20px;
  color: var(--color-text, #333);
  margin-bottom: 4px;
}

.composer {
  font-size: 14px;
  color: var(--color-text-secondary, #666);
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
}

.info-row .label {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}

.info-row .value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.fun-fact {
  margin-top: 16px;
  padding: 12px;
  background: var(--color-primary-light, #E8F5E9);
  border-radius: var(--border-radius, 8px);
  text-align: left;
}

.fun-fact .label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-primary-dark, #388E3C);
  display: block;
  margin-bottom: 4px;
}

.fun-fact p {
  font-size: 13px;
  color: var(--color-text, #333);
  margin: 0;
}

.close-modal-btn {
  margin-top: 20px;
  padding: 10px 24px;
  background: var(--color-primary, #4CAF50);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
</style>
