<!-- src/components/Music/MusicPlayer.vue -->
<template>
  <div class="music-player">
    <!-- Now Playing Bar -->
    <div v-if="audio.currentTrackId" class="now-playing" :class="{ playing: audio.isPlaying }">
      <div class="now-playing-icon">
        {{ currentIcon }}
      </div>
      <div class="now-playing-info">
        <span class="now-playing-title">{{ currentTitle }}</span>
        <span class="now-playing-type">{{ currentTypeLabel }}</span>
      </div>
      <div class="now-playing-controls">
        <button type="button" class="control-btn" @click="audio.toggle()" :disabled="audio.isLoading">
          {{ audio.isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button type="button" class="control-btn stop-btn" @click="audio.stop()">
          ⏹️
        </button>
      </div>
      <div class="visualizer" v-if="audio.isPlaying">
        <div class="bar" v-for="i in 5" :key="i"></div>
      </div>
    </div>

    <!-- Loading/Error State -->
    <div v-if="audio.isLoading" class="status-message loading">
      Carregando música...
    </div>
    <div v-if="audio.error" class="status-message error">
      {{ audio.error }}
    </div>

    <!-- Ambient Soundscapes Section -->
    <section class="music-section">
      <h3>🎧 Sons Ambiente</h3>
      <p class="section-desc">Músicas relaxantes para ajudar na concentração</p>

      <div class="track-grid">
        <button
          type="button"
          v-for="soundscape in soundscapes"
          :key="soundscape.id"
          :class="[
            'track-card',
            {
              active: audio.currentTrackId === soundscape.id && audio.currentType === 'ambient',
              playing: audio.currentTrackId === soundscape.id && audio.isPlaying,
              locked: !isUnlocked(soundscape.id)
            }
          ]"
          @click="playSoundscape(soundscape)"
          :disabled="!isUnlocked(soundscape.id)"
        >
          <span class="track-icon">{{ soundscape.icon }}</span>
          <span class="track-name">{{ soundscape.name }}</span>
          <span v-if="!isUnlocked(soundscape.id)" class="track-cost">
            {{ soundscape.cost }} ⭐
          </span>
          <span v-else-if="audio.currentTrackId === soundscape.id && audio.isPlaying" class="playing-badge">
            ♪
          </span>
        </button>
      </div>
    </section>

    <!-- Classical Music Section -->
    <section class="music-section">
      <h3>🎼 Música Clássica</h3>
      <p class="section-desc">Obras famosas de grandes compositores</p>

      <div class="track-list">
        <div
          v-for="track in classicalMusic"
          :key="track.id"
          :class="[
            'classical-track',
            {
              active: audio.currentTrackId === track.id,
              playing: audio.currentTrackId === track.id && audio.isPlaying
            }
          ]"
        >
          <button type="button" class="track-play-btn" @click="playClassical(track)">
            <span v-if="audio.currentTrackId === track.id && audio.isPlaying">⏸️</span>
            <span v-else>▶️</span>
          </button>
          <div class="track-info" @click="showTrackInfo(track)">
            <span class="track-emoji">{{ getInstrumentEmoji(track.instrument) }}</span>
            <div class="track-details">
              <span class="track-title">{{ track.title }}</span>
              <span class="track-composer">{{ track.composer }}</span>
            </div>
          </div>
          <button type="button" class="info-btn" @click="showTrackInfo(track)" title="Ver curiosidade">
            ℹ️
          </button>
        </div>
      </div>
    </section>

    <!-- Volume Control -->
    <section class="volume-section">
      <label>🔊 Volume</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        :value="audio.volume"
        @input="audio.setVolume(parseFloat($event.target.value))"
      />
    </section>

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
        <div class="modal-actions">
          <button type="button" class="play-modal-btn" @click="playClassical(selectedTrack); selectedTrack = null">
            ▶️ Tocar
          </button>
          <button type="button" class="close-modal-btn" @click="selectedTrack = null">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { soundscapes, getSoundscape } from '../../data/ambientSoundscapes'
import { classicalMusic } from '../../data/classicalMusic'
import { useAudioStore } from '../../stores/audio'
import { useSettingsStore } from '../../stores/settings'
import { useProfilesStore } from '../../stores/profiles'

const audio = useAudioStore()
const settings = useSettingsStore()
const profiles = useProfilesStore()

const selectedTrack = ref(null)

// Current track info for Now Playing bar
const currentIcon = computed(() => {
  if (audio.currentType === 'ambient') {
    const soundscape = getSoundscape(audio.currentTrackId)
    return soundscape?.icon || '🎵'
  }
  if (audio.currentType === 'classical') {
    const track = classicalMusic.find(t => t.id === audio.currentTrackId)
    return getInstrumentEmoji(track?.instrument)
  }
  return '🎵'
})

const currentTitle = computed(() => {
  if (audio.currentType === 'ambient') {
    const soundscape = getSoundscape(audio.currentTrackId)
    return soundscape?.name || 'Música'
  }
  if (audio.currentType === 'classical') {
    const track = classicalMusic.find(t => t.id === audio.currentTrackId)
    return track?.title || 'Música'
  }
  return 'Música'
})

const currentTypeLabel = computed(() => {
  if (audio.currentType === 'ambient') return 'Som Ambiente'
  if (audio.currentType === 'classical') return 'Música Clássica'
  return ''
})

function isUnlocked(soundscapeId) {
  if (settings.devMode) return true
  const soundscape = getSoundscape(soundscapeId)
  if (soundscape.cost === 0) return true
  return profiles.activeProfile?.unlockedSoundscapes?.includes(soundscapeId) || false
}

function playSoundscape(soundscape) {
  if (!isUnlocked(soundscape.id)) return

  // If same track is playing, toggle pause
  if (audio.currentTrackId === soundscape.id && audio.currentType === 'ambient') {
    audio.toggle()
    return
  }

  audio.play(soundscape.id, 'ambient', soundscape.audioUrl)
}

function playClassical(track) {
  // If same track is playing, toggle pause
  if (audio.currentTrackId === track.id && audio.currentType === 'classical') {
    audio.toggle()
    return
  }

  audio.play(track.id, 'classical', track.audioUrl)
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
</script>

<style scoped>
.music-player {
  padding: 16px 0;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  margin-bottom: 20px;
  transition: all 0.3s;
}

.now-playing.playing {
  background: var(--color-primary-light, #E8F5E9);
  border-color: var(--color-primary, #4CAF50);
}

.now-playing-icon {
  font-size: 28px;
}

.now-playing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.now-playing-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.now-playing-type {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}

.now-playing-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--color-primary, #4CAF50);
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stop-btn {
  background: var(--color-neutral, #e0e0e0);
}

.visualizer {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
}

.bar {
  width: 4px;
  height: 100%;
  background: var(--color-primary, #4CAF50);
  border-radius: 2px;
  animation: pulse-bar 0.6s ease-in-out infinite alternate;
}

.bar:nth-child(2) { animation-delay: 0.1s; height: 70%; }
.bar:nth-child(3) { animation-delay: 0.2s; height: 85%; }
.bar:nth-child(4) { animation-delay: 0.3s; height: 60%; }
.bar:nth-child(5) { animation-delay: 0.4s; height: 75%; }

@keyframes pulse-bar {
  0% { transform: scaleY(0.5); }
  100% { transform: scaleY(1); }
}

.status-message {
  padding: 12px;
  border-radius: var(--border-radius, 8px);
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.status-message.loading {
  background: var(--color-primary-light, #E8F5E9);
  color: var(--color-primary-dark, #388E3C);
}

.status-message.error {
  background: #FFEBEE;
  color: var(--color-danger, #f44336);
}

.music-section {
  margin-bottom: 24px;
}

.music-section h3 {
  font-size: 16px;
  color: var(--color-text, #333);
  margin-bottom: 4px;
}

.section-desc {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
  margin-bottom: 12px;
}

.track-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
}

.track-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.track-card:hover:not(:disabled) {
  border-color: var(--color-primary, #4CAF50);
  transform: translateY(-2px);
}

.track-card.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.track-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.track-icon {
  font-size: 24px;
}

.track-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text, #333);
  text-align: center;
}

.track-cost {
  font-size: 10px;
  color: var(--color-warning, #FF9800);
  font-weight: 600;
}

.playing-badge {
  font-size: 12px;
  color: var(--color-primary, #4CAF50);
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
}

.classical-track {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  transition: all 0.2s;
}

.classical-track:hover {
  border-color: var(--color-primary, #4CAF50);
}

.classical-track.active {
  background: var(--color-primary-light, #E8F5E9);
  border-color: var(--color-primary, #4CAF50);
}

.track-play-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-primary, #4CAF50);
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.track-play-btn:hover {
  transform: scale(1.1);
}

.track-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.track-emoji {
  font-size: 20px;
}

.track-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.track-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.track-composer {
  font-size: 11px;
  color: var(--color-text-secondary, #666);
}

.info-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}

.info-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--color-border, #e0e0e0);
}

.volume-section label {
  font-size: 14px;
  color: var(--color-text, #333);
}

.volume-section input[type="range"] {
  flex: 1;
  cursor: pointer;
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

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.play-modal-btn, .close-modal-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.play-modal-btn {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.close-modal-btn {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text, #333);
}
</style>
