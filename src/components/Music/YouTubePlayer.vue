<!-- src/components/Music/YouTubePlayer.vue -->
<template>
  <div class="youtube-player">
    <div class="player-header">
      <h3>YouTube Music</h3>
    </div>

    <!-- URL Input -->
    <div class="url-input-group">
      <input
        type="text"
        v-model="videoUrl"
        placeholder="Cole o link do YouTube..."
        @keyup.enter="loadVideo"
      />
      <button type="button" class="load-btn" @click="loadVideo" :disabled="!videoUrl.trim()">
        Carregar
      </button>
    </div>

    <!-- Player Container -->
    <div v-if="currentVideoId" class="player-container">
      <div class="video-wrapper">
        <iframe
          :src="`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&loop=1&playlist=${currentVideoId}`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="video-controls">
        <button type="button" class="clear-btn" @click="clearVideo">
          Remover
        </button>
      </div>
    </div>

    <!-- Saved Videos -->
    <div v-if="savedVideos.length > 0" class="saved-videos">
      <h4>Videos Salvos</h4>
      <div class="video-list">
        <div
          v-for="video in savedVideos"
          :key="video.id"
          :class="['video-item', { active: currentVideoId === video.id }]"
          @click="playVideo(video.id)"
        >
          <span class="video-thumbnail">
            <img :src="`https://img.youtube.com/vi/${video.id}/default.jpg`" :alt="video.title" />
          </span>
          <span class="video-title">{{ video.title }}</span>
          <button type="button" class="remove-video-btn" @click.stop="removeVideo(video.id)">
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Suggestions -->
    <div class="suggestions">
      <h4>Sugestoes</h4>
      <p class="suggestion-hint">Pesquise no YouTube por:</p>
      <div class="suggestion-tags">
        <span class="tag">lofi beats</span>
        <span class="tag">study music</span>
        <span class="tag">relaxing piano</span>
        <span class="tag">nature sounds</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTimerStore } from '../../stores/timer'
import { useSettingsStore } from '../../stores/settings'
import { storage } from '../../utils/storage'

const timer = useTimerStore()
const settings = useSettingsStore()

const videoUrl = ref('')
const currentVideoId = ref('')
const savedVideos = ref([])

// Load saved videos from storage
onMounted(() => {
  const data = storage.load()
  if (data.savedYoutubeVideos) {
    savedVideos.value = data.savedYoutubeVideos
  }
})

function extractVideoId(url) {
  if (!url) return null

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

function loadVideo() {
  const id = extractVideoId(videoUrl.value.trim())
  if (!id) {
    alert('Link invalido. Cole um link do YouTube ou ID do video.')
    return
  }

  currentVideoId.value = id

  // Save to list if not already saved
  if (!savedVideos.value.find(v => v.id === id)) {
    const newVideo = {
      id,
      title: `Video ${savedVideos.value.length + 1}`,
      addedAt: Date.now(),
    }
    savedVideos.value.push(newVideo)
    saveVideos()
  }

  videoUrl.value = ''
}

function playVideo(id) {
  currentVideoId.value = id
}

function clearVideo() {
  currentVideoId.value = ''
}

function removeVideo(id) {
  savedVideos.value = savedVideos.value.filter(v => v.id !== id)
  if (currentVideoId.value === id) {
    currentVideoId.value = ''
  }
  saveVideos()
}

function saveVideos() {
  const data = storage.load()
  data.savedYoutubeVideos = savedVideos.value
  storage.save(data)
}

// Auto-pause when timer stops (if we had more control)
watch(() => timer.status, (status) => {
  // YouTube iframe doesn't allow direct control without API
  // The user can manually pause/play
})
</script>

<style scoped>
.youtube-player {
  padding: 16px;
}

.player-header h3 {
  font-size: 18px;
  color: var(--color-text, #333);
  margin-bottom: 16px;
}

.url-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.url-input-group input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  font-size: 14px;
  font-family: inherit;
}

.url-input-group input:focus {
  outline: none;
  border-color: var(--color-primary, #4CAF50);
}

.load-btn {
  padding: 10px 20px;
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

.load-btn:disabled {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text-secondary, #666);
  cursor: not-allowed;
}

.load-btn:not(:disabled):hover {
  background: var(--color-primary-dark, #388E3C);
}

.player-container {
  margin-bottom: 16px;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: var(--border-radius, 12px);
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.clear-btn {
  padding: 6px 16px;
  background: var(--color-danger, #f44336);
  color: white;
  border: none;
  border-radius: var(--border-radius, 6px);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.saved-videos {
  margin-bottom: 16px;
}

.saved-videos h4 {
  font-size: 14px;
  color: var(--color-text-secondary, #666);
  margin-bottom: 8px;
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
}

.video-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: all 0.2s;
}

.video-item:hover {
  border-color: var(--color-primary, #4CAF50);
}

.video-item.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.video-thumbnail {
  width: 60px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-title {
  flex: 1;
  font-size: 13px;
  color: var(--color-text, #333);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-video-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary, #666);
  cursor: pointer;
  font-size: 14px;
  border-radius: 50%;
}

.remove-video-btn:hover {
  background: var(--color-danger, #f44336);
  color: white;
}

.suggestions {
  padding: 12px;
  background: var(--color-primary-light, #E8F5E9);
  border-radius: var(--border-radius, 12px);
}

.suggestions h4 {
  font-size: 14px;
  color: var(--color-text, #333);
  margin-bottom: 8px;
}

.suggestion-hint {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
  margin-bottom: 8px;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 10px;
  background: white;
  border-radius: 12px;
  font-size: 12px;
  color: var(--color-text, #333);
}
</style>
