// src/utils/audio.js

class AudioManager {
  constructor() {
    this.audioContext = null
    this.masterVolume = 0.8
    this.enabled = true
    this.hapticEnabled = true
    this.sounds = {}

    // Initialize on first user interaction
    this.initialized = false
  }

  // Haptic feedback methods
  vibrate(pattern) {
    if (!this.hapticEnabled || !navigator.vibrate) return
    navigator.vibrate(pattern)
  }

  setHapticEnabled(enabled) {
    this.hapticEnabled = enabled
  }

  init() {
    if (this.initialized) return
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.initialized = true
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  setEnabled(enabled) {
    this.enabled = enabled
  }

  // Generate simple tones using Web Audio API
  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext) {
      this.init()
    }
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Predefined sound effects
  playStart() {
    if (!this.enabled) return
    // Pleasant ascending chime
    this.playTone(523.25, 0.15) // C5
    setTimeout(() => this.playTone(659.25, 0.15), 100) // E5
    setTimeout(() => this.playTone(783.99, 0.2), 200) // G5
    // 3 short pulses
    this.vibrate([50, 50, 50])
  }

  playBreak() {
    if (!this.enabled) return
    // Cheerful ding
    this.playTone(783.99, 0.3) // G5
    setTimeout(() => this.playTone(1046.50, 0.4), 150) // C6
    // 2 medium pulses
    this.vibrate([100, 50, 100])
  }

  playComplete() {
    if (!this.enabled) return
    // Celebration sound
    this.playTone(523.25, 0.1) // C5
    setTimeout(() => this.playTone(659.25, 0.1), 80) // E5
    setTimeout(() => this.playTone(783.99, 0.1), 160) // G5
    setTimeout(() => this.playTone(1046.50, 0.3), 240) // C6
    // Celebration pattern
    this.vibrate([50, 30, 50, 30, 50, 30, 100])
  }

  playWarning() {
    if (!this.enabled) return
    // Gentle alert
    this.playTone(440, 0.2) // A4
    setTimeout(() => this.playTone(440, 0.2), 300)
    // Alert pattern
    this.vibrate([100, 100, 100])
  }

  playTick() {
    if (!this.enabled) return
    // Subtle tick
    this.playTone(800, 0.05, 'square')
  }
}

export const audioManager = new AudioManager()

// Event handlers (stored for cleanup)
let timerEventHandler = null
let timerAlertHandler = null

// Setup event listeners for timer events
export function setupAudioListeners() {
  // Load haptic setting from storage
  try {
    const saved = JSON.parse(localStorage.getItem('kids-timer') || '{}')
    audioManager.setHapticEnabled(saved.globalSettings?.hapticEnabled ?? true)
  } catch (e) {
    // Ignore parse errors, use default
  }

  timerEventHandler = (e) => {
    const { type } = e.detail
    switch (type) {
      case 'work-start':
        audioManager.playStart()
        break
      case 'work-complete':
      case 'break-start':
        audioManager.playBreak()
        break
      case 'pomodoro-complete':
        audioManager.playComplete()
        break
    }
  }

  timerAlertHandler = (e) => {
    const { alerts } = e.detail
    if (alerts.length > 0) {
      audioManager.playWarning()
    }
  }

  window.addEventListener('timer-event', timerEventHandler)
  window.addEventListener('timer-alert', timerAlertHandler)
}

// Cleanup function for removing event listeners
export function cleanupAudioListeners() {
  if (timerEventHandler) {
    window.removeEventListener('timer-event', timerEventHandler)
    timerEventHandler = null
  }
  if (timerAlertHandler) {
    window.removeEventListener('timer-alert', timerAlertHandler)
    timerAlertHandler = null
  }
}
