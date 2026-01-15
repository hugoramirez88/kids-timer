// src/stores/youtube.js
// Global YouTube audio manager
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '../utils/storage'

export const useYoutubeStore = defineStore('youtube', () => {
  const isPlaying = ref(false)
  const currentVideoId = ref(null)
  const currentVideoTitle = ref('')
  const savedVideos = ref([])
  const isReady = ref(false)

  let player = null
  let playerElement = null

  // Load saved videos from storage
  function init() {
    const data = storage.load()
    if (data.savedYoutubeVideos) {
      savedVideos.value = data.savedYoutubeVideos
    }
  }

  // Set the player element ID (called from App.vue)
  function setPlayerElement(elementId) {
    playerElement = elementId
  }

  // Initialize YouTube API
  function initApi() {
    if (window.YT && window.YT.Player) {
      isReady.value = true
      return
    }

    if (!document.getElementById('youtube-api-script')) {
      const tag = document.createElement('script')
      tag.id = 'youtube-api-script'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }

    window.onYouTubeIframeAPIReady = () => {
      isReady.value = true
    }
  }

  function createPlayer(videoId) {
    if (!playerElement || !isReady.value) return

    if (player) {
      player.destroy()
    }

    player = new window.YT.Player(playerElement, {
      height: '1',
      width: '1',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: videoId,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          player.playVideo()
          isPlaying.value = true
        },
        onStateChange: (event) => {
          // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
          if (event.data === 1) {
            isPlaying.value = true
          } else if (event.data === 2 || event.data === 0) {
            isPlaying.value = false
          }
        },
      },
    })
  }

  function extractVideoId(url) {
    if (!url) return null
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  function loadVideo(url) {
    const id = extractVideoId(url)
    if (!id) return false

    currentVideoId.value = id
    currentVideoTitle.value = `YouTube - ${id.substring(0, 8)}...`

    // Save to list if not already saved
    if (!savedVideos.value.find(v => v.id === id)) {
      savedVideos.value.push({
        id,
        title: currentVideoTitle.value,
        addedAt: Date.now(),
      })
      saveVideos()
    }

    if (isReady.value) {
      createPlayer(id)
    }
    return true
  }

  function playVideo(video) {
    currentVideoId.value = video.id
    currentVideoTitle.value = video.title

    if (isReady.value) {
      createPlayer(video.id)
    }
  }

  function toggle() {
    if (!player) return

    if (isPlaying.value) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  function pause() {
    if (player && isPlaying.value) {
      player.pauseVideo()
    }
  }

  function stop() {
    if (player) {
      player.stopVideo()
    }
    currentVideoId.value = null
    currentVideoTitle.value = ''
    isPlaying.value = false
  }

  function removeVideo(id) {
    savedVideos.value = savedVideos.value.filter(v => v.id !== id)
    if (currentVideoId.value === id) {
      stop()
    }
    saveVideos()
  }

  function saveVideos() {
    const data = storage.load()
    data.savedYoutubeVideos = savedVideos.value
    storage.save(data)
  }

  return {
    isPlaying,
    currentVideoId,
    currentVideoTitle,
    savedVideos,
    isReady,
    init,
    initApi,
    setPlayerElement,
    loadVideo,
    playVideo,
    toggle,
    pause,
    stop,
    removeVideo,
  }
})
