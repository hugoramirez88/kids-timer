// src/data/rewards.js
// Progression balanced for:
// - Some unlocks achievable on day 1 (1-2 pomodoros)
// - Full unlock after ~30 pomodoros
// - Average ~20 points per pomodoro (base 15 + bonuses)

export const avatars = [
  { id: 'rabbit', name: 'Coelho', cost: 0, unlocked: true },
  { id: 'turtle', name: 'Tartaruga', cost: 25, unlocked: false },  // Day 1 achievable
  { id: 'fox', name: 'Raposa', cost: 25, unlocked: false },        // Day 1 achievable
  { id: 'owl', name: 'Coruja', cost: 45, unlocked: false },
  { id: 'cat', name: 'Gato', cost: 65, unlocked: false },
  { id: 'dog', name: 'Cachorro', cost: 65, unlocked: false },
]

export const pathAnimals = [
  { id: 'rabbit', name: 'Coelho', cost: 0, unlocked: true },
  { id: 'turtle', name: 'Tartaruga', cost: 35, unlocked: false },  // Early unlock
  { id: 'fox', name: 'Raposa', cost: 50, unlocked: false },
  { id: 'snail', name: 'Caracol', cost: 70, unlocked: false },
]

export const themes = [
  { id: 'divertido', name: 'Divertido', cost: 0, unlocked: true },
  { id: 'minimalista', name: 'Minimalista', cost: 0, unlocked: true },
  { id: 'floresta', name: 'Floresta', cost: 60, unlocked: false },
  { id: 'espaco', name: 'Espaço', cost: 80, unlocked: false },
  { id: 'oceano', name: 'Oceano', cost: 100, unlocked: false },
  { id: 'doces', name: 'Doces', cost: 120, unlocked: false },
]

export const badges = [
  { id: 'primeiro-passo', name: 'Primeiro Passo', description: 'Complete seu primeiro pomodoro', icon: '🌟' },
  { id: 'cinco-seguidos', name: 'Cinco Seguidos', description: 'Complete 5 pomodoros em um dia', icon: '🔥' },
  { id: 'maratonista', name: 'Maratonista', description: 'Complete 10 pomodoros em um dia', icon: '🏃' },
  { id: 'consistente', name: 'Consistente', description: 'Mantenha uma sequência de 7 dias', icon: '📅' },
  { id: 'dedicado', name: 'Dedicado', description: 'Mantenha uma sequência de 30 dias', icon: '💪' },
  { id: 'centuriao', name: 'Centurião', description: 'Complete 100 pomodoros no total', icon: '💯' },
  { id: 'explorador', name: 'Explorador', description: 'Experimente todos os indicadores de progresso', icon: '🧭' },
  { id: 'fashionista', name: 'Fashionista', description: 'Desbloqueie 3 temas', icon: '🎨' },
]

export const points = {
  completeWork: 10,
  completePomodoro: 15,  // Base points per completed work session
  dailyStreak: 5,        // Bonus for maintaining streak
  firstOfDay: 5,         // Bonus for first pomodoro of day
}

// Total unlockable cost: 225 + 155 + 360 = 740 points
// At ~20 points/pomodoro average = 37 pomodoros for everything
// First unlock possible after just 1-2 pomodoros
