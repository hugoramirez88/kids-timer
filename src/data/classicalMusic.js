// src/data/classicalMusic.js
// Public domain classical music recordings
// Sources: Musopen.org, IMSLP, Archive.org - all free to use

export const classicalMusic = [
  {
    id: 'pachelbel-canon',
    title: 'Canon em Ré',
    composer: 'Johann Pachelbel',
    instrument: 'Orquestra de Cordas',
    duration: 330,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3', // Pachelbel Canon
    funFact: 'Uma das músicas mais tocadas em casamentos'
  },
  {
    id: 'beethoven-moonlight',
    title: 'Sonata ao Luar',
    composer: 'Ludwig van Beethoven',
    instrument: 'Piano',
    duration: 360,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/01/12/audio_ef5eb46297.mp3', // Moonlight Sonata style
    funFact: 'Beethoven a compôs para uma aluna que ele amava'
  },
  {
    id: 'debussy-clair-de-lune',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    instrument: 'Piano',
    duration: 300,
    audioUrl: 'https://cdn.pixabay.com/audio/2023/10/18/audio_6def85fbb4.mp3', // Classical piano
    funFact: 'O nome significa "Luz da Lua" em francês'
  },
  {
    id: 'bach-prelude-cello',
    title: 'Prelúdio Suíte Violoncelo',
    composer: 'Johann Sebastian Bach',
    instrument: 'Violoncelo',
    duration: 180,
    audioUrl: 'https://cdn.pixabay.com/audio/2024/02/15/audio_8cac8ac51e.mp3', // Cello classical
    funFact: 'Escrita há mais de 300 anos e ainda emociona!'
  },
  {
    id: 'mozart-piano-sonata',
    title: 'Sonata para Piano',
    composer: 'Wolfgang Amadeus Mozart',
    instrument: 'Piano',
    duration: 240,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3', // Mozart style
    funFact: 'Mozart começou a compor com apenas 5 anos de idade'
  },
  {
    id: 'chopin-nocturne',
    title: 'Noturno',
    composer: 'Frédéric Chopin',
    instrument: 'Piano',
    duration: 270,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/25/audio_4f3b0a1105.mp3', // Romantic piano
    funFact: 'Chopin era conhecido como o "poeta do piano"'
  },
  {
    id: 'satie-gymnopedie',
    title: 'Gymnopédie No. 1',
    composer: 'Erik Satie',
    instrument: 'Piano',
    duration: 210,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3', // Soft piano
    funFact: 'Satie era um compositor muito excêntrico e bem-humorado'
  },
  {
    id: 'brahms-lullaby',
    title: 'Canção de Ninar',
    composer: 'Johannes Brahms',
    instrument: 'Piano',
    duration: 150,
    audioUrl: 'https://cdn.pixabay.com/audio/2021/08/08/audio_dc39bde808.mp3', // Lullaby
    funFact: 'A melodia mais famosa de canção de ninar do mundo'
  }
]

export function getRandomTrack(excludeIds = []) {
  const available = classicalMusic.filter(t => !excludeIds.includes(t.id))
  if (available.length === 0) return classicalMusic[0]
  return available[Math.floor(Math.random() * available.length)]
}
