// src/data/ambientSoundscapes.js
// 5 distinct ambient soundscapes for focus music
// Using royalty-free tracks from Pixabay and other free sources
// All tracks are designed to loop seamlessly for extended study sessions

export const soundscapes = [
  {
    id: 'jardim-tranquilo',
    name: 'Jardim Tranquilo',
    description: 'Sons suaves como um jardim calmo',
    icon: '🌸',
    cost: 0,
    unlocked: true,
    mood: 'calm',
    // Calm ambient loop - approximately 3 minutes, loops seamlessly
    audioUrl: 'https://cdn.pixabay.com/audio/2022/10/25/audio_570e7d0b6a.mp3', // "Relaxing" by Lesfm
    duration: 187, // seconds
  },
  {
    id: 'brisa-suave',
    name: 'Brisa Suave',
    description: 'Leve como uma brisa de verão',
    icon: '🍃',
    cost: 0,
    unlocked: true,
    mood: 'airy',
    // Light, airy ambient - approximately 2.5 minutes
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', // "Ambient Piano" by Lesfm
    duration: 139,
  },
  {
    id: 'floresta-magica',
    name: 'Floresta Mágica',
    description: 'Misterioso como uma floresta encantada',
    icon: '🌲',
    cost: 40,
    unlocked: false,
    mood: 'mystical',
    // Nature/forest ambient sounds
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8eede63a0e.mp3', // "Meditation" ambient
    duration: 217,
  },
  {
    id: 'noite-estrelada',
    name: 'Noite Estrelada',
    description: 'Calmo como o céu à noite',
    icon: '✨',
    cost: 60,
    unlocked: false,
    mood: 'dreamy',
    // Dreamy, space-like ambient
    audioUrl: 'https://cdn.pixabay.com/audio/2023/07/30/audio_e00581a808.mp3', // "Deep Meditation"
    duration: 309,
  },
  {
    id: 'energia-focada',
    name: 'Energia Focada',
    description: 'Suave mas com ritmo para manter o foco',
    icon: '⚡',
    cost: 80,
    unlocked: false,
    mood: 'focused',
    // Slightly more upbeat study music
    audioUrl: 'https://cdn.pixabay.com/audio/2022/11/22/audio_a1e8d01ce5.mp3', // "Lofi Study"
    duration: 147,
  }
]

export function getSoundscape(id) {
  return soundscapes.find(s => s.id === id) || soundscapes[0]
}
