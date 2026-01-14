// src/data/ambientSoundscapes.js
// Ambient music for focus and relaxation
// Using free looping tracks from Free Music Archive and similar sources

export const soundscapes = [
  {
    id: 'piano-calmo',
    name: 'Piano Calmo',
    description: 'Melodias suaves de piano para concentração',
    icon: '🎹',
    cost: 0,
    unlocked: true,
    mood: 'calm',
    // Calm piano ambient from Archive.org
    audioUrl: 'https://ia800505.us.archive.org/27/items/RelaxingPianoMusic_201901/Relaxing%20Piano%20Music.mp3',
    duration: 300,
  },
  {
    id: 'natureza-serena',
    name: 'Natureza Serena',
    description: 'Sons relaxantes da natureza',
    icon: '🌿',
    cost: 0,
    unlocked: true,
    mood: 'nature',
    // Nature sounds from Archive.org
    audioUrl: 'https://ia800500.us.archive.org/16/items/NatureSounds_201903/Forest%20Ambience.mp3',
    duration: 600,
  },
  {
    id: 'meditacao-zen',
    name: 'Meditação Zen',
    description: 'Música ambiente para meditação',
    icon: '🧘',
    cost: 40,
    unlocked: false,
    mood: 'meditation',
    // Meditation ambient from Archive.org
    audioUrl: 'https://ia800501.us.archive.org/1/items/MeditationMusic_201902/Meditation%20Ambient.mp3',
    duration: 480,
  },
  {
    id: 'chuva-suave',
    name: 'Chuva Suave',
    description: 'Som relaxante de chuva',
    icon: '🌧️',
    cost: 60,
    unlocked: false,
    mood: 'rain',
    // Rain sounds from Archive.org
    audioUrl: 'https://ia800503.us.archive.org/29/items/RainSoundsForSleeping/Rain%20Sounds.mp3',
    duration: 600,
  },
  {
    id: 'lo-fi-estudo',
    name: 'Lo-Fi Estudo',
    description: 'Batidas suaves para estudar',
    icon: '📚',
    cost: 80,
    unlocked: false,
    mood: 'lofi',
    // Lo-fi style ambient from Archive.org
    audioUrl: 'https://ia800502.us.archive.org/18/items/LofiHipHopBeats/Lofi%20Study%20Beats.mp3',
    duration: 360,
  }
]

export function getSoundscape(id) {
  return soundscapes.find(s => s.id === id) || soundscapes[0]
}
