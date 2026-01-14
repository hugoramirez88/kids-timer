// src/data/classicalMusic.js
export const classicalMusic = [
  {
    id: 'vivaldi-primavera',
    title: 'Primavera',
    composer: 'Antonio Vivaldi',
    instrument: 'Violino',
    duration: 210,
    file: 'vivaldi-primavera.mp3',
    funFact: 'Faz parte de "As Quatro Estações", composta em 1723'
  },
  {
    id: 'beethoven-fur-elise',
    title: 'Für Elise',
    composer: 'Ludwig van Beethoven',
    instrument: 'Piano',
    duration: 180,
    file: 'beethoven-fur-elise.mp3',
    funFact: 'Ninguém sabe quem era Elise!'
  },
  {
    id: 'bach-cello-suite',
    title: 'Suíte para Violoncelo Nº 1',
    composer: 'Johann Sebastian Bach',
    instrument: 'Violoncelo',
    duration: 240,
    file: 'bach-cello-suite.mp3',
    funFact: 'Escrita há mais de 300 anos'
  },
  {
    id: 'mozart-eine-kleine',
    title: 'Eine kleine Nachtmusik',
    composer: 'Wolfgang Amadeus Mozart',
    instrument: 'Orquestra',
    duration: 330,
    file: 'mozart-eine-kleine.mp3',
    funFact: 'Mozart tinha apenas 31 anos quando compôs'
  },
  {
    id: 'debussy-clair-de-lune',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    instrument: 'Piano',
    duration: 300,
    file: 'debussy-clair-de-lune.mp3',
    funFact: 'O nome significa "Luz da Lua" em francês'
  },
  {
    id: 'tchaikovsky-swan-lake',
    title: 'O Lago dos Cisnes',
    composer: 'Piotr Tchaikovsky',
    instrument: 'Orquestra',
    duration: 180,
    file: 'tchaikovsky-swan-lake.mp3',
    funFact: 'É um balé sobre uma princesa transformada em cisne'
  },
  {
    id: 'pachelbel-canon',
    title: 'Canon em Ré',
    composer: 'Johann Pachelbel',
    instrument: 'Orquestra de Cordas',
    duration: 300,
    file: 'pachelbel-canon.mp3',
    funFact: 'Uma das músicas mais tocadas em casamentos'
  },
  {
    id: 'grieg-morning-mood',
    title: 'Manhã (Peer Gynt)',
    composer: 'Edvard Grieg',
    instrument: 'Flauta',
    duration: 240,
    file: 'grieg-morning-mood.mp3',
    funFact: 'A flauta imita o canto dos pássaros ao amanhecer'
  },
  {
    id: 'saint-saens-swan',
    title: 'O Cisne',
    composer: 'Camille Saint-Saëns',
    instrument: 'Violoncelo',
    duration: 210,
    file: 'saint-saens-swan.mp3',
    funFact: 'Faz parte de "O Carnaval dos Animais"'
  },
  {
    id: 'handel-water-music',
    title: 'Música Aquática',
    composer: 'Georg Friedrich Händel',
    instrument: 'Orquestra',
    duration: 180,
    file: 'handel-water-music.mp3',
    funFact: 'Foi tocada pela primeira vez em um barco no rio Tâmisa'
  }
]

export function getRandomTrack(excludeIds = []) {
  const available = classicalMusic.filter(t => !excludeIds.includes(t.id))
  if (available.length === 0) return classicalMusic[0]
  return available[Math.floor(Math.random() * available.length)]
}
