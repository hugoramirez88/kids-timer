// src/data/classicalMusic.js
// Public domain classical music recordings from Archive.org and Musopen
// All recordings are in the public domain or Creative Commons

export const classicalMusic = [
  {
    id: 'bach-cello-suite-1',
    title: 'Suíte para Violoncelo No. 1',
    composer: 'Johann Sebastian Bach',
    instrument: 'Violoncelo',
    duration: 142,
    // Musopen recording - public domain
    audioUrl: 'https://ia800501.us.archive.org/6/items/BachCelloSuiteNo.1InGMajorBwv1007/01.Prelude.mp3',
    funFact: 'Bach escreveu 6 suítes para violoncelo solo - esta é a mais famosa!'
  },
  {
    id: 'beethoven-fur-elise',
    title: 'Für Elise',
    composer: 'Ludwig van Beethoven',
    instrument: 'Piano',
    duration: 180,
    // Archive.org public domain recording
    audioUrl: 'https://ia800504.us.archive.org/15/items/FurElise_261/fur_elise_beethoven.mp3',
    funFact: 'Ninguém sabe quem era a misteriosa Elise!'
  },
  {
    id: 'debussy-clair-de-lune',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    instrument: 'Piano',
    duration: 300,
    // Archive.org public domain
    audioUrl: 'https://ia800302.us.archive.org/26/items/ClairDeLune_644/DebussyClairDeLune.mp3',
    funFact: 'O nome significa "Luz da Lua" em francês'
  },
  {
    id: 'mozart-eine-kleine',
    title: 'Eine kleine Nachtmusik',
    composer: 'Wolfgang Amadeus Mozart',
    instrument: 'Orquestra',
    duration: 330,
    // Archive.org public domain
    audioUrl: 'https://ia800501.us.archive.org/35/items/EineKleineNachtmusik_757/01EineKleineNachtmusikAllegro.mp3',
    funFact: 'Mozart tinha apenas 31 anos quando compôs esta obra!'
  },
  {
    id: 'chopin-nocturne-op9-2',
    title: 'Noturno Op. 9 No. 2',
    composer: 'Frédéric Chopin',
    instrument: 'Piano',
    duration: 270,
    // Archive.org public domain
    audioUrl: 'https://ia800500.us.archive.org/31/items/ChopinNocturneNo.2/NocturneOp.9No.2.mp3',
    funFact: 'Chopin era conhecido como o "poeta do piano"'
  },
  {
    id: 'pachelbel-canon',
    title: 'Canon em Ré',
    composer: 'Johann Pachelbel',
    instrument: 'Orquestra de Cordas',
    duration: 330,
    // Archive.org public domain
    audioUrl: 'https://ia800504.us.archive.org/9/items/PachelbelCanonInD_201704/Pachelbel%20-%20Canon%20in%20D.mp3',
    funFact: 'Uma das músicas mais tocadas em casamentos no mundo todo!'
  },
  {
    id: 'satie-gymnopedie-1',
    title: 'Gymnopédie No. 1',
    composer: 'Erik Satie',
    instrument: 'Piano',
    duration: 210,
    // Archive.org public domain
    audioUrl: 'https://ia800501.us.archive.org/11/items/ErikSatie-Gymnopedie/gymnopedie1.mp3',
    funFact: 'Satie era um compositor muito excêntrico e bem-humorado!'
  },
  {
    id: 'vivaldi-primavera',
    title: 'A Primavera (As Quatro Estações)',
    composer: 'Antonio Vivaldi',
    instrument: 'Violino',
    duration: 210,
    // Archive.org public domain
    audioUrl: 'https://ia800500.us.archive.org/8/items/VivaldiSpring/01VivaldiSpring.mp3',
    funFact: 'Faz parte de "As Quatro Estações", composta em 1723'
  }
]

export function getRandomTrack(excludeIds = []) {
  const available = classicalMusic.filter(t => !excludeIds.includes(t.id))
  if (available.length === 0) return classicalMusic[0]
  return available[Math.floor(Math.random() * available.length)]
}
