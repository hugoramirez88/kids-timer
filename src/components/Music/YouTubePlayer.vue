<!-- src/components/Music/YouTubePlayer.vue -->
<!-- YouTube controls that use the global YouTube store -->
<template>
  <div class="youtube-player">
    <div class="player-header">
      <h3>YouTube (Apenas Áudio)</h3>
      <p class="header-hint">O vídeo fica oculto - só o áudio toca</p>
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

    <!-- Now Playing -->
    <div v-if="youtube.currentVideoId" class="now-playing-yt" :class="{ playing: youtube.isPlaying }">
      <div class="yt-thumbnail">
        <img :src="`https://img.youtube.com/vi/${youtube.currentVideoId}/mqdefault.jpg`" alt="Video thumbnail" />
        <div class="audio-only-badge">Áudio</div>
      </div>
      <div class="yt-info">
        <span class="yt-title">{{ youtube.currentVideoTitle }}</span>
        <span class="yt-status">{{ youtube.isPlaying ? 'Tocando...' : 'Pausado' }}</span>
      </div>
      <div class="yt-controls">
        <button type="button" class="yt-btn play" @click="youtube.toggle()">
          {{ youtube.isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button type="button" class="yt-btn stop" @click="youtube.stop()">
          ⏹️
        </button>
      </div>
    </div>

    <!-- Saved Videos -->
    <div v-if="youtube.savedVideos.length > 0" class="saved-videos">
      <h4>Vídeos Salvos</h4>
      <div class="video-list">
        <div
          v-for="video in youtube.savedVideos"
          :key="video.id"
          :class="['video-item', { active: youtube.currentVideoId === video.id }]"
          @click="playVideo(video)"
        >
          <span class="video-thumbnail">
            <img :src="`https://img.youtube.com/vi/${video.id}/default.jpg`" :alt="video.title" />
          </span>
          <span class="video-title">{{ video.title }}</span>
          <button type="button" class="remove-video-btn" @click.stop="youtube.removeVideo(video.id)">
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Suggestions -->
    <div class="suggestions">
      <h4>Sugestões para Estudar</h4>
      <p class="suggestion-hint">Pesquise no YouTube por:</p>
      <div class="suggestion-tags">
        <span class="tag">lofi hip hop radio</span>
        <span class="tag">study music playlist</span>
        <span class="tag">relaxing piano music</span>
        <span class="tag">classical music for studying</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useYoutubeStore } from '../../stores/youtube'
import { useAudioStore } from '../../stores/audio'

const youtube = useYoutubeStore()
const audio = useAudioStore()

const videoUrl = ref('')

function loadVideo() {
  if (!videoUrl.value.trim()) return

  // Stop any file-based audio
  audio.stop()

  const success = youtube.loadVideo(videoUrl.value.trim())
  if (!success) {
    alert('Link inválido. Cole um link do YouTube.')
    return
  }
  videoUrl.value = ''
}

function playVideo(video) {
  // Stop any file-based audio
  audio.stop()
  youtube.playVideo(video)
}
</script>

<style scoped>
.youtube-player {
  padding: 16px 0;
}

.player-header h3 {
  font-size: 16px;
  color: var(--color-text, #333);
  margin-bottom: 4px;
}

.header-hint {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
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

.now-playing-yt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  margin-bottom: 16px;
  transition: all 0.3s;
}

.now-playing-yt.playing {
  border-color: var(--color-danger, #f44336);
  background: #FFEBEE;
}

.yt-thumbnail {
  position: relative;
  width: 80px;
  height: 45px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.yt-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audio-only-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 9px;
  border-radius: 4px;
}

.yt-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.yt-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #333);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.yt-status {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}

.yt-controls {
  display: flex;
  gap: 6px;
}

.yt-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.yt-btn.play {
  background: var(--color-danger, #f44336);
}

.yt-btn.stop {
  background: var(--color-neutral, #e0e0e0);
}

.yt-btn:hover {
  transform: scale(1.1);
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
  transition: all 0.2s;
}

.video-item:hover {
  border-color: var(--color-primary, #4CAF50);
}

.video-item.active {
  border-color: var(--color-danger, #f44336);
  background: #FFEBEE;
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
  background: #FFF3E0;
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
