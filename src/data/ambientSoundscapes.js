// src/data/ambientSoundscapes.js
// Ambient music from Calm Pills collection on Archive.org (CC0 license)
// All tracks are free to use without restrictions

export const soundscapes = [
  {
    id: 'piano-calmo',
    name: 'Piano Calmo',
    description: 'Melodias suaves de piano para concentração',
    icon: '🎹',
    cost: 0,
    unlocked: true,
    mood: 'calm',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_1_-_Still_Habitat.mp3',
    duration: 300,
  },
  {
    id: 'anoitecer',
    name: 'Anoitecer',
    description: 'Sons relaxantes para o fim do dia',
    icon: '🌅',
    cost: 0,
    unlocked: true,
    mood: 'evening',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_2_-_Slowly_Dusk.mp3',
    duration: 300,
  },
  {
    id: 'meditacao-zen',
    name: 'Meditação Zen',
    description: 'Música ambiente para meditação',
    icon: '🧘',
    cost: 40,
    unlocked: false,
    mood: 'meditation',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_3_-_Lullaby_for_Grownups_462868CD-0AE8-469D-B460-63696B597AF7.mp3',
    duration: 300,
  },
  {
    id: 'sonho-tranquilo',
    name: 'Sonho Tranquilo',
    description: 'Sons suaves como um sonho',
    icon: '💭',
    cost: 60,
    unlocked: false,
    mood: 'dreamy',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_4_-_The_Safest_Place_E7398A89-465A-46D4-AC1F-4D9A2015DEE1.mp3',
    duration: 300,
  },
  {
    id: 'foco-suave',
    name: 'Foco Suave',
    description: 'Melodia gentil para manter o foco',
    icon: '📚',
    cost: 80,
    unlocked: false,
    mood: 'focus',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_5_-_Clair_de_Lune_842A6E32-AE71-4A74-A25C-A31E75E7DF7B.mp3',
    duration: 300,
  }
]

export function getSoundscape(id) {
  return soundscapes.find(s => s.id === id) || soundscapes[0]
}
