// src/stores/audio.js
// Global audio manager that persists across all views
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  // State
  const isPlaying = ref(false)
  const currentTrackId = ref(null)
  const currentType = ref(null) // 'ambient' | 'classical' | 'youtube'
  const volume = ref(0.5)
  const isLoading = ref(false)
  const error = ref(null)

  // Audio element (singleton)
  let audioElement = null

  function getAudioElement() {
    if (!audioElement) {
      audioElement = new Audio()
      audioElement.loop = true
      audioElement.volume = volume.value

      audioElement.addEventListener('canplaythrough', () => {
        isLoading.value = false
        error.value = null
      })

      audioElement.addEventListener('error', (e) => {
        isLoading.value = false
        error.value = 'Erro ao carregar música'
        console.error('Audio error:', e)
      })

      audioElement.addEventListener('ended', () => {
        // This shouldn't fire with loop=true, but just in case
        if (audioElement.loop) {
          audioElement.play()
        }
      })
    }
    return audioElement
  }

  function play(trackId, type, url) {
    const audio = getAudioElement()

    // If same track, just resume
    if (currentTrackId.value === trackId && audio.src) {
      audio.play()
      isPlaying.value = true
      return
    }

    // New track
    isLoading.value = true
    currentTrackId.value = trackId
    currentType.value = type

    audio.src = url
    audio.load()
    audio.play().catch(err => {
      console.error('Playback error:', err)
      error.value = 'Não foi possível reproduzir'
      isPlaying.value = false
    })

    isPlaying.value = true
  }

  function pause() {
    const audio = getAudioElement()
    audio.pause()
    isPlaying.value = false
  }

  function stop() {
    const audio = getAudioElement()
    audio.pause()
    audio.currentTime = 0
    isPlaying.value = false
    currentTrackId.value = null
    currentType.value = null
  }

  function setVolume(newVolume) {
    volume.value = newVolume
    if (audioElement) {
      audioElement.volume = newVolume
    }
  }

  function toggle() {
    if (isPlaying.value) {
      pause()
    } else if (currentTrackId.value && audioElement?.src) {
      audioElement.play()
      isPlaying.value = true
    }
  }

  // Watch volume changes
  watch(volume, (newVol) => {
    if (audioElement) {
      audioElement.volume = newVol
    }
  })

  return {
    isPlaying,
    currentTrackId,
    currentType,
    volume,
    isLoading,
    error,
    play,
    pause,
    stop,
    toggle,
    setVolume,
  }
})
