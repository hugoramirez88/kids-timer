// src/data/energeticMusic.js
// Energetic/upbeat tracks for kids who prefer stimulating music
// All tracks from Archive.org "Happy Background Music" collection
// License: CC0 1.0 Universal (no attribution required)

export const energeticTracks = [
  {
    id: 'happy-ukulele',
    name: 'Ukulele Feliz',
    description: 'Melodia alegre de ukulele',
    icon: '🎸',
    cost: 0,
    mood: 'energetic',
    audioUrl: 'https://archive.org/download/happy-background-music/upbeat-ukulele-kids.mp3',
    duration: 180,
  },
  {
    id: 'adventure-theme',
    name: 'Tema de Aventura',
    description: 'Música empolgante para exploradores',
    icon: '🗺️',
    cost: 0,
    mood: 'energetic',
    audioUrl: 'https://archive.org/download/happy-background-music/children-song-happy.mp3',
    duration: 200,
  },
  {
    id: 'fun-beats',
    name: 'Batidas Divertidas',
    description: 'Ritmo animado para estudar',
    icon: '🥁',
    cost: 50,
    mood: 'energetic',
    audioUrl: 'https://archive.org/download/happy-background-music/energy-kids.mp3',
    duration: 240,
  },
  {
    id: 'sunny-day',
    name: 'Dia Ensolarado',
    description: 'Música alegre como um dia de sol',
    icon: '☀️',
    cost: 70,
    mood: 'energetic',
    audioUrl: 'https://archive.org/download/happy-background-music/sunny-day.mp3',
    duration: 220,
  },
  {
    id: 'dance-party',
    name: 'Festa Dançante',
    description: 'Para quem gosta de movimento',
    icon: '💃',
    cost: 90,
    mood: 'energetic',
    audioUrl: 'https://archive.org/download/happy-background-music/playground-fun.mp3',
    duration: 260,
  },
]

export function getEnergeticTrack(id) {
  return energeticTracks.find(t => t.id === id)
}
