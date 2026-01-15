<!-- src/components/Music/MiniPlayer.vue -->
<!-- Floating mini player that shows on the main timer screen -->
<template>
  <div v-if="isActive" class="mini-player" :class="{ playing: isPlaying }">
    <div class="mini-player-info">
      <span class="mini-icon">{{ currentIcon }}</span>
      <span class="mini-title">{{ currentTitle }}</span>
    </div>
    <div class="mini-controls">
      <button type="button" class="mini-btn" @click="togglePlay" :disabled="audio.isLoading">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </button>
      <button type="button" class="mini-btn stop" @click="stopPlay">
        ⏹️
      </button>
    </div>
    <div v-if="isPlaying" class="mini-visualizer">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAudioStore } from '../../stores/audio'
import { useYoutubeStore } from '../../stores/youtube'
import { getSoundscape } from '../../data/ambientSoundscapes'
import { classicalMusic } from '../../data/classicalMusic'

const audio = useAudioStore()
const youtube = useYoutubeStore()

// Check if anything is playing or has content
const isActive = computed(() => {
  return audio.currentTrackId || youtube.currentVideoId
})

const isPlaying = computed(() => {
  return audio.isPlaying || youtube.isPlaying
})

const currentIcon = computed(() => {
  // YouTube
  if (youtube.currentVideoId) {
    return '📺'
  }
  // Audio store
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
  // YouTube
  if (youtube.currentVideoId) {
    return youtube.currentVideoTitle || 'YouTube'
  }
  // Audio store
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

function togglePlay() {
  if (youtube.currentVideoId) {
    youtube.toggle()
  } else {
    audio.toggle()
  }
}

function stopPlay() {
  if (youtube.currentVideoId) {
    youtube.stop()
  }
  if (audio.currentTrackId) {
    audio.stop()
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
</script>

<style scoped>
.mini-player {
  position: fixed;
  top: 80px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 50;
  transition: all 0.3s;
}

.mini-player.playing {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.mini-player-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-icon {
  font-size: 20px;
}

.mini-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #333);
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-controls {
  display: flex;
  gap: 6px;
}

.mini-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-primary, #4CAF50);
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.mini-btn:hover {
  transform: scale(1.1);
}

.mini-btn:disabled {
  opacity: 0.5;
}

.mini-btn.stop {
  background: var(--color-neutral, #e0e0e0);
}

.mini-visualizer {
  display: flex;
  gap: 3px;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--color-primary, #4CAF50);
  border-radius: 50%;
  animation: pulse-dot 0.6s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.6); opacity: 0.5; }
}
</style>
