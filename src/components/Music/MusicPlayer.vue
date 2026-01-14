<!-- src/components/Music/MusicPlayer.vue -->
<template>
  <div class="music-player">
    <div class="player-header">
      <h3>Musica para Estudar</h3>
      <button type="button" class="toggle-btn" @click="togglePlayer">
        {{ isPlaying ? 'Pausar' : 'Tocar' }}
      </button>
    </div>

    <!-- Now Playing -->
    <div v-if="currentTrack" class="now-playing">
      <div class="track-icon">
        {{ getInstrumentEmoji(currentTrack.instrument) }}
      </div>
      <div class="track-info">
        <span class="track-title">{{ currentTrack.title }}</span>
        <span class="track-composer">{{ currentTrack.composer }}</span>
      </div>
      <div class="visualizer" v-if="isPlaying">
        <div class="bar" v-for="i in 5" :key="i" :style="getBarStyle(i)"></div>
      </div>
    </div>

    <!-- Educational Info -->
    <div v-if="currentTrack" class="educational-info">
      <div class="info-card">
        <span class="info-label">Instrumento</span>
        <span class="info-value">{{ currentTrack.instrument }}</span>
      </div>
      <div class="info-card fun-fact">
        <span class="info-label">Curiosidade</span>
        <span class="info-value">{{ currentTrack.funFact }}</span>
      </div>
    </div>

    <!-- Track List -->
    <div class="track-list">
      <button
        type="button"
        v-for="track in classicalMusic"
        :key="track.id"
        :class="['track-item', { active: currentTrack?.id === track.id }]"
        @click="selectTrack(track)"
      >
        <span class="track-emoji">{{ getInstrumentEmoji(track.instrument) }}</span>
        <div class="track-details">
          <span class="track-name">{{ track.title }}</span>
          <span class="track-author">{{ track.composer }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { classicalMusic } from '../../data/classicalMusic'
import { useTimerStore } from '../../stores/timer'
import { useSettingsStore } from '../../stores/settings'

const timer = useTimerStore()
const settings = useSettingsStore()

const currentTrack = ref(classicalMusic[0])
const isPlaying = ref(false)
let audioContext = null
let oscillators = []
let gainNode = null

// Music frequencies for different "styles" to simulate different pieces
const trackFrequencies = {
  'vivaldi-primavera': [329.63, 392.00, 493.88], // E4, G4, B4 - bright
  'beethoven-fur-elise': [329.63, 349.23, 392.00], // E4, F4, G4 - melodic
  'bach-cello-suite': [196.00, 246.94, 293.66], // G3, B3, D4 - deep
  'mozart-eine-kleine': [261.63, 329.63, 392.00], // C4, E4, G4 - happy
  'debussy-clair-de-lune': [261.63, 311.13, 392.00], // C4, Eb4, G4 - dreamy
  'tchaikovsky-swan-lake': [246.94, 293.66, 349.23], // B3, D4, F4 - dramatic
  'pachelbel-canon': [293.66, 349.23, 440.00], // D4, F4, A4 - peaceful
  'grieg-morning-mood': [392.00, 493.88, 587.33], // G4, B4, D5 - bright morning
  'saint-saens-swan': [220.00, 261.63, 329.63], // A3, C4, E4 - gentle
  'handel-water-music': [261.63, 329.63, 440.00], // C4, E4, A4 - flowing
}

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    gainNode = audioContext.createGain()
    gainNode.gain.value = 0
    gainNode.connect(audioContext.destination)
  }
}

function createAmbientTones() {
  stopAmbientTones()

  const frequencies = trackFrequencies[currentTrack.value.id] || [261.63, 329.63, 392.00]

  frequencies.forEach((freq, i) => {
    const osc = audioContext.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    // Add slight detuning for richness
    const detune = (i - 1) * 3
    osc.detune.value = detune

    osc.connect(gainNode)
    osc.start()
    oscillators.push(osc)
  })

  // Fade in
  gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 2)
}

function stopAmbientTones() {
  oscillators.forEach(osc => {
    try {
      osc.stop()
      osc.disconnect()
    } catch (e) {}
  })
  oscillators = []
}

function togglePlayer() {
  if (isPlaying.value) {
    pauseMusic()
  } else {
    playMusic()
  }
}

function playMusic() {
  initAudio()
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  createAmbientTones()
  isPlaying.value = true
}

function pauseMusic() {
  if (gainNode) {
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)
  }
  setTimeout(() => {
    stopAmbientTones()
  }, 600)
  isPlaying.value = false
}

function selectTrack(track) {
  currentTrack.value = track
  if (isPlaying.value) {
    // Fade out, switch, fade in
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3)
    setTimeout(() => {
      stopAmbientTones()
      createAmbientTones()
    }, 400)
  }
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
  const heights = [40, 60, 80, 60, 40]
  const delays = [0, 0.1, 0.2, 0.3, 0.4]
  return {
    height: `${heights[index - 1]}%`,
    animationDelay: `${delays[index - 1]}s`,
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
  // Select random track on mount
  const randomIndex = Math.floor(Math.random() * classicalMusic.length)
  currentTrack.value = classicalMusic[randomIndex]
})

onUnmounted(() => {
  if (isPlaying.value) {
    stopAmbientTones()
  }
  if (audioContext) {
    audioContext.close()
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
  background: var(--color-primary-light, #E8F5E9);
  border-radius: var(--border-radius, 12px);
  margin-bottom: 16px;
}

.track-icon {
  font-size: 36px;
}

.track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.track-composer {
  font-size: 14px;
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
  0% { transform: scaleY(0.5); }
  100% { transform: scaleY(1); }
}

.educational-info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.info-card {
  padding: 12px 16px;
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
}

.info-card.fun-fact {
  grid-column: span 2;
}

.info-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary, #666);
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: var(--color-text, #333);
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
  gap: 12px;
  padding: 10px 12px;
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: all 0.2s;
}

.track-item:hover {
  border-color: var(--color-primary, #4CAF50);
}

.track-item.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.track-emoji {
  font-size: 24px;
}

.track-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.track-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.track-author {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}
</style>
