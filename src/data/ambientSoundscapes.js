// src/data/ambientSoundscapes.js
// 5 distinct ambient soundscapes for focus music
// 2 default, 3 unlockable via shop

export const soundscapes = [
  {
    id: 'jardim-tranquilo',
    name: 'Jardim Tranquilo',
    description: 'Sons suaves como um jardim calmo',
    icon: '🌸',
    cost: 0,
    unlocked: true,
    mood: 'calm',
    // Soft major chord with gentle volume
    config: {
      baseFreq: 220, // A3
      frequencies: [1, 1.25, 1.5], // A, C#, E (A major)
      waveType: 'sine',
      volume: 0.06,
      lfoRate: 0.1,
      lfoDepth: 3,
    }
  },
  {
    id: 'brisa-suave',
    name: 'Brisa Suave',
    description: 'Leve como uma brisa de verão',
    icon: '🍃',
    cost: 0,
    unlocked: true,
    mood: 'airy',
    // Higher, airy tones with more movement
    config: {
      baseFreq: 330, // E4
      frequencies: [1, 1.2, 1.5, 2], // E, G, B, E (E minor suspended)
      waveType: 'sine',
      volume: 0.05,
      lfoRate: 0.15,
      lfoDepth: 5,
    }
  },
  {
    id: 'floresta-magica',
    name: 'Floresta Mágica',
    description: 'Misterioso como uma floresta encantada',
    icon: '🌲',
    cost: 40,
    unlocked: false,
    mood: 'mystical',
    // Rich, layered with forest feel
    config: {
      baseFreq: 196, // G3
      frequencies: [1, 1.189, 1.498, 1.782], // G, Bb, D, F (Gm7)
      waveType: 'triangle',
      volume: 0.07,
      lfoRate: 0.08,
      lfoDepth: 4,
    }
  },
  {
    id: 'noite-estrelada',
    name: 'Noite Estrelada',
    description: 'Calmo como o céu à noite',
    icon: '✨',
    cost: 60,
    unlocked: false,
    mood: 'dreamy',
    // Ethereal, space-like sounds
    config: {
      baseFreq: 174.61, // F3
      frequencies: [1, 1.26, 1.5, 2.0, 2.52], // F, Ab, C, F, Ab (Fm add9)
      waveType: 'sine',
      volume: 0.05,
      lfoRate: 0.05,
      lfoDepth: 2,
    }
  },
  {
    id: 'energia-focada',
    name: 'Energia Focada',
    description: 'Suave mas com ritmo para manter o foco',
    icon: '⚡',
    cost: 80,
    unlocked: false,
    mood: 'focused',
    // Slightly more present/energetic but still calm
    config: {
      baseFreq: 261.63, // C4
      frequencies: [1, 1.25, 1.5, 1.875], // C, E, G, Bb (C7)
      waveType: 'sine',
      volume: 0.06,
      lfoRate: 0.25, // Faster LFO for subtle rhythm
      lfoDepth: 6,
    }
  }
]

export function getSoundscape(id) {
  return soundscapes.find(s => s.id === id) || soundscapes[0]
}
