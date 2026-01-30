// src/data/ambientSoundscapes.js
// Ambient music from Calm Pills collection on Archive.org (CC0 license)
// All tracks are free to use without restrictions
// Note: Calm Pills tracks are long-form ambient mixes (45-90 minutes each)

export const soundscapes = [
  // Default unlocked tracks
  {
    id: 'piano-calmo',
    name: 'Piano Calmo',
    description: 'Melodias suaves de piano para concentração',
    icon: '🎹',
    cost: 0,
    unlocked: true,
    mood: 'calm',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_1_-_Still_Habitat.mp3',
    duration: 3600, // ~60 min ambient mix
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
    duration: 3600, // ~60 min ambient mix
  },
  // Unlockable tracks
  {
    id: 'meditacao-zen',
    name: 'Meditação Zen',
    description: 'Música ambiente para meditação',
    icon: '🧘',
    cost: 40,
    unlocked: false,
    mood: 'meditation',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_3_-_Lullaby_for_Grownups.mp3',
    duration: 3600, // ~60 min ambient mix
  },
  {
    id: 'sonho-tranquilo',
    name: 'Sonho Tranquilo',
    description: 'Sons suaves como um sonho',
    icon: '💭',
    cost: 60,
    unlocked: false,
    mood: 'dreamy',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_4_-_The_Safest_Place.mp3',
    duration: 3600, // ~60 min ambient mix
  },
  {
    id: 'foco-suave',
    name: 'Foco Suave',
    description: 'Melodia gentil para manter o foco',
    icon: '📚',
    cost: 80,
    unlocked: false,
    mood: 'focus',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_5_-_Clair_de_Lune.mp3',
    duration: 3600, // ~60 min ambient mix
  },
  // NEW: Long focus tracks - designed for extended study sessions
  {
    id: 'ceu-celestial',
    name: 'Céu Celestial',
    description: 'Música celestial para longas sessões de foco',
    icon: '✨',
    cost: 100,
    unlocked: false,
    mood: 'focus',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_21_-_Heaven_Sings.mp3',
    duration: 4200, // ~70 min ambient mix
  },
  {
    id: 'fluxo-pensamento',
    name: 'Fluxo de Pensamento',
    description: 'Ambiente sonoro para fluir com as ideias',
    icon: '🌊',
    cost: 100,
    unlocked: false,
    mood: 'focus',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_28_-_Stream_of_Thought.mp3',
    duration: 4200, // ~70 min ambient mix
  },
  {
    id: 'mundo-refratado',
    name: 'Mundo Refratado',
    description: 'Sons etéreos para concentração profunda',
    icon: '🔮',
    cost: 120,
    unlocked: false,
    mood: 'meditation',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_27_-_Refracted_World.mp3',
    duration: 4200, // ~70 min ambient mix
  },
  {
    id: 'luz-amanha',
    name: 'Luz do Amanhã',
    description: 'Melodias esperançosas para estudo',
    icon: '🌅',
    cost: 120,
    unlocked: false,
    mood: 'calm',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_37_-_Tomorrows_Lights.mp3',
    duration: 4200, // ~70 min ambient mix
  },
  {
    id: 'sem-peso',
    name: 'Sem Peso',
    description: 'Sensação de leveza para relaxar estudando',
    icon: '☁️',
    cost: 140,
    unlocked: false,
    mood: 'dreamy',
    audioUrl: 'https://archive.org/download/CalmPills/Uplifting_Pills_-_Calm_Pill_38_-_Weightless.mp3',
    duration: 4500, // ~75 min ambient mix
  },
]

export function getSoundscape(id) {
  return soundscapes.find(s => s.id === id) || soundscapes[0]
}
