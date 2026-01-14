// src/utils/ambientAudio.js
// Ambient music engine that creates pleasant, evolving soundscapes

export class AmbientMusicEngine {
  constructor() {
    this.audioContext = null
    this.masterGain = null
    this.isPlaying = false
    this.scheduledNotes = []
    this.scheduleInterval = null
    this.currentConfig = null
  }

  init() {
    if (this.audioContext) return

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

    // Master gain with limiter
    this.masterGain = this.audioContext.createGain()
    this.masterGain.gain.value = 0

    // Add a compressor to prevent distortion
    this.compressor = this.audioContext.createDynamicsCompressor()
    this.compressor.threshold.value = -24
    this.compressor.knee.value = 30
    this.compressor.ratio.value = 12
    this.compressor.attack.value = 0.003
    this.compressor.release.value = 0.25

    this.masterGain.connect(this.compressor)
    this.compressor.connect(this.audioContext.destination)
  }

  // Play a single note with envelope
  playNote(frequency, startTime, duration, velocity = 0.3) {
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    // Soft sine wave
    osc.type = 'sine'
    osc.frequency.value = frequency

    // Low-pass filter to soften
    filter.type = 'lowpass'
    filter.frequency.value = 2000
    filter.Q.value = 0.5

    // ADSR envelope for smooth sound
    const attackTime = 0.1
    const decayTime = 0.2
    const sustainLevel = velocity * 0.7
    const releaseTime = duration * 0.4

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(velocity, startTime + attackTime)
    gain.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime)
    gain.gain.setValueAtTime(sustainLevel, startTime + duration - releaseTime)
    gain.gain.linearRampToValueAtTime(0, startTime + duration)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(startTime)
    osc.stop(startTime + duration + 0.1)

    return { osc, gain }
  }

  // Schedule notes based on soundscape config
  scheduleNotes() {
    if (!this.isPlaying || !this.currentConfig) return

    const now = this.audioContext.currentTime
    const config = this.currentConfig

    // Schedule notes for the next 2 seconds
    const scheduleAhead = 2

    config.patterns.forEach((pattern, patternIndex) => {
      pattern.notes.forEach((noteIndex, i) => {
        const frequency = config.scale[noteIndex % config.scale.length]
        const baseTime = now + (i * pattern.interval) + (patternIndex * 0.1)

        // Add randomness for organic feel
        const timeOffset = (Math.random() - 0.5) * 0.1
        const startTime = baseTime + timeOffset

        if (startTime > now && startTime < now + scheduleAhead) {
          const duration = pattern.noteDuration + (Math.random() * 0.3)
          const velocity = pattern.velocity * (0.8 + Math.random() * 0.4)

          this.playNote(frequency, startTime, duration, velocity)
        }
      })
    })
  }

  play(soundscapeId) {
    this.init()

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    this.currentConfig = SOUNDSCAPE_CONFIGS[soundscapeId] || SOUNDSCAPE_CONFIGS['jardim-tranquilo']
    this.isPlaying = true

    // Fade in master volume
    this.masterGain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 2)

    // Start scheduling notes
    this.scheduleNotes()
    this.scheduleInterval = setInterval(() => this.scheduleNotes(), 1500)
  }

  stop() {
    if (!this.isPlaying) return

    this.isPlaying = false

    if (this.scheduleInterval) {
      clearInterval(this.scheduleInterval)
      this.scheduleInterval = null
    }

    // Fade out
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1)
    }
  }

  switchSoundscape(soundscapeId) {
    if (this.isPlaying) {
      // Crossfade
      this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5)

      setTimeout(() => {
        this.currentConfig = SOUNDSCAPE_CONFIGS[soundscapeId] || SOUNDSCAPE_CONFIGS['jardim-tranquilo']
        this.masterGain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 1)
      }, 600)
    } else {
      this.currentConfig = SOUNDSCAPE_CONFIGS[soundscapeId]
    }
  }

  destroy() {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Musical scales (frequencies in Hz)
const SCALES = {
  // C major pentatonic - very pleasant, no dissonance
  cMajorPentatonic: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],
  // A minor pentatonic - slightly melancholic but peaceful
  aMinorPentatonic: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33],
  // F major - warm and comfortable
  fMajor: [174.61, 196.00, 220.00, 233.08, 261.63, 293.66, 329.63, 349.23],
  // G major - bright and happy
  gMajor: [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 369.99, 392.00],
  // D minor - contemplative
  dMinor: [146.83, 164.81, 174.61, 196.00, 220.00, 233.08, 261.63, 293.66],
}

// Soundscape configurations with musical patterns
const SOUNDSCAPE_CONFIGS = {
  'jardim-tranquilo': {
    name: 'Jardim Tranquilo',
    scale: SCALES.cMajorPentatonic,
    patterns: [
      // Slow arpeggio pattern
      { notes: [0, 2, 4, 2], interval: 1.2, noteDuration: 1.5, velocity: 0.15 },
      // Higher melody notes (sparse)
      { notes: [4, 5, 4, 2], interval: 2.4, noteDuration: 2.0, velocity: 0.1 },
      // Bass notes
      { notes: [0, 0, 0, 0], interval: 4.8, noteDuration: 3.0, velocity: 0.12 },
    ]
  },

  'brisa-suave': {
    name: 'Brisa Suave',
    scale: SCALES.gMajor,
    patterns: [
      // Light ascending pattern
      { notes: [0, 1, 2, 3, 4, 3, 2, 1], interval: 0.8, noteDuration: 1.0, velocity: 0.12 },
      // Sparse high notes like wind chimes
      { notes: [5, 6, 7, 6], interval: 3.2, noteDuration: 1.8, velocity: 0.08 },
    ]
  },

  'floresta-magica': {
    name: 'Floresta Mágica',
    scale: SCALES.aMinorPentatonic,
    patterns: [
      // Mysterious pattern
      { notes: [0, 3, 2, 4, 1, 3], interval: 1.0, noteDuration: 1.4, velocity: 0.14 },
      // Deep forest bass
      { notes: [0, 0, 1, 0], interval: 3.0, noteDuration: 2.5, velocity: 0.15 },
      // Ethereal high notes
      { notes: [5, 7, 6, 5], interval: 4.0, noteDuration: 2.0, velocity: 0.08 },
    ]
  },

  'noite-estrelada': {
    name: 'Noite Estrelada',
    scale: SCALES.dMinor,
    patterns: [
      // Slow, dreamy pattern
      { notes: [0, 2, 4, 5, 4, 2], interval: 1.5, noteDuration: 2.0, velocity: 0.12 },
      // Twinkling stars (high sparse notes)
      { notes: [6, 7, 6, 5], interval: 2.5, noteDuration: 1.2, velocity: 0.06 },
      // Deep space drone
      { notes: [0], interval: 6.0, noteDuration: 4.0, velocity: 0.1 },
    ]
  },

  'energia-focada': {
    name: 'Energia Focada',
    scale: SCALES.fMajor,
    patterns: [
      // Steady, rhythmic pattern for focus
      { notes: [0, 2, 0, 4, 0, 2, 0, 3], interval: 0.6, noteDuration: 0.8, velocity: 0.13 },
      // Supporting harmony
      { notes: [2, 4, 3, 5], interval: 1.8, noteDuration: 1.5, velocity: 0.1 },
      // Grounding bass
      { notes: [0, 0, 2, 0], interval: 2.4, noteDuration: 2.0, velocity: 0.12 },
    ]
  }
}

// Singleton instance
let engineInstance = null

export function getAmbientEngine() {
  if (!engineInstance) {
    engineInstance = new AmbientMusicEngine()
  }
  return engineInstance
}
