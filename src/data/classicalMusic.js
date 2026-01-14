// src/data/classicalMusic.js
// Public domain classical music from Musopen collection on Archive.org
// All recordings are public domain (CC0 or pre-1929)

export const classicalMusic = [
  {
    id: 'bach-goldberg-aria',
    title: 'Variações Goldberg - Ária',
    composer: 'Johann Sebastian Bach',
    instrument: 'Piano',
    duration: 240,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Bach_GoldbergVariations/JohannSebastianBach-01-GoldbergVariationsBwv.988-Aria.mp3',
    funFact: 'Bach compôs esta música para ajudar um conde com insônia!'
  },
  {
    id: 'beethoven-moonlight-1',
    title: 'Sonata ao Luar - 1º Mov.',
    composer: 'Ludwig van Beethoven',
    instrument: 'Piano',
    duration: 360,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Beethoven_PianoSonataNo.14/LudwigVanBeethoven-01-PianoSonataNo.14InC-SharpMinorOp.27No.2MoonlightI.AdagioSostenuto.mp3',
    funFact: 'Beethoven a compôs para uma aluna que ele amava!'
  },
  {
    id: 'chopin-nocturne-op9-2',
    title: 'Noturno Op. 9 No. 2',
    composer: 'Frédéric Chopin',
    instrument: 'Piano',
    duration: 270,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Chopin_NocturnesOp.9/FredericChopin-02-NocturneInE-FlatMajorOp.9No.2.mp3',
    funFact: 'Chopin era conhecido como o "poeta do piano"'
  },
  {
    id: 'debussy-arabesque-1',
    title: 'Arabesque No. 1',
    composer: 'Claude Debussy',
    instrument: 'Piano',
    duration: 240,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Debussy_DeuxArabesques/ClaudeDebussy-01-DeuxArabesquesL.66No.1InEMajorAndantinoConMoto.mp3',
    funFact: 'Debussy criou um novo estilo chamado "impressionismo musical"'
  },
  {
    id: 'mozart-sonata-16',
    title: 'Sonata No. 16 em Dó Maior',
    composer: 'Wolfgang Amadeus Mozart',
    instrument: 'Piano',
    duration: 180,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Mozart_PianoSonataNo.16/WolfgangAmadeusMozart-01-PianoSonataNo.16InCMajorK.545SonataFacileI.Allegro.mp3',
    funFact: 'Mozart começou a compor com apenas 5 anos!'
  },
  {
    id: 'schubert-impromptu-3',
    title: 'Impromptu Op. 90 No. 3',
    composer: 'Franz Schubert',
    instrument: 'Piano',
    duration: 360,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Schubert_FourImpromptusOp.90/FranzSchubert-03-FourImpromptusOp.90D.899No.3InG-FlatMajorAndante.mp3',
    funFact: 'Schubert compôs mais de 600 canções em sua curta vida!'
  },
  {
    id: 'brahms-waltz-15',
    title: 'Valsa Op. 39 No. 15',
    composer: 'Johannes Brahms',
    instrument: 'Piano',
    duration: 120,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Brahms_WaltzesOp.39/JohannesBrahms-15-16WaltzesOp.39No.15InA-FlatMajor.mp3',
    funFact: 'Esta é uma das valsas mais conhecidas de Brahms!'
  },
  {
    id: 'grieg-morning-mood',
    title: 'Manhã (Peer Gynt)',
    composer: 'Edvard Grieg',
    instrument: 'Orquestra',
    duration: 240,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Grieg_PeerGyntSuiteNo.1/EdvardGrieg-01-PeerGyntSuiteNo.1Op.46I.MorningMood.mp3',
    funFact: 'A flauta imita o canto dos pássaros ao amanhecer!'
  }
]

export function getRandomTrack(excludeIds = []) {
  const available = classicalMusic.filter(t => !excludeIds.includes(t.id))
  if (available.length === 0) return classicalMusic[0]
  return available[Math.floor(Math.random() * available.length)]
}
