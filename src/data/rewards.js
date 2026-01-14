// src/data/rewards.js
export const avatars = [
  { id: 'rabbit', name: 'Coelho', cost: 0, unlocked: true },
  { id: 'turtle', name: 'Tartaruga', cost: 100, unlocked: false },
  { id: 'fox', name: 'Raposa', cost: 100, unlocked: false },
  { id: 'owl', name: 'Coruja', cost: 150, unlocked: false },
  { id: 'cat', name: 'Gato', cost: 150, unlocked: false },
  { id: 'dog', name: 'Cachorro', cost: 150, unlocked: false },
]

export const pathAnimals = [
  { id: 'rabbit', name: 'Coelho', cost: 0, unlocked: true },
  { id: 'turtle', name: 'Tartaruga', cost: 150, unlocked: false },
  { id: 'fox', name: 'Raposa', cost: 150, unlocked: false },
  { id: 'snail', name: 'Caracol', cost: 150, unlocked: false },
]

export const themes = [
  { id: 'divertido', name: 'Divertido', cost: 0, unlocked: true },
  { id: 'minimalista', name: 'Minimalista', cost: 0, unlocked: true },
  { id: 'floresta', name: 'Floresta', cost: 200, unlocked: false },
  { id: 'espaco', name: 'Espaço', cost: 200, unlocked: false },
  { id: 'oceano', name: 'Oceano', cost: 200, unlocked: false },
  { id: 'doces', name: 'Doces', cost: 200, unlocked: false },
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
  completePomodoro: 15,
  dailyStreak: 5,
  firstOfDay: 5,
}
