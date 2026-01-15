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
    id: 'beethoven-eroica',
    title: 'Sinfonia No. 3 "Eroica" - 2º Mov.',
    composer: 'Ludwig van Beethoven',
    instrument: 'Orquestra',
    duration: 360,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Beethoven_SymphonyNo.3Eroica/LudwigVanBeethoven-SymphonyNo.3InEFlatMajorEroicaOp.55-02-MarciaFunebreAdagioAssai.mp3',
    funFact: 'Beethoven dedicou esta sinfonia a Napoleão, mas rasgou a dedicatória quando ele se coroou imperador!'
  },
  {
    id: 'grieg-morning',
    title: 'Manhã (Peer Gynt)',
    composer: 'Edvard Grieg',
    instrument: 'Orquestra',
    duration: 240,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Greig_PeerGynt/EdvardGrieg-PeerGyntSuiteNo.1Op.46-01-Morning.mp3',
    funFact: 'A flauta imita o canto dos pássaros ao amanhecer!'
  },
  {
    id: 'grieg-hall-mountain-king',
    title: 'Na Caverna do Rei da Montanha',
    composer: 'Edvard Grieg',
    instrument: 'Orquestra',
    duration: 150,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Greig_PeerGynt/EdvardGrieg-PeerGyntSuiteNo.1Op.46-04-InTheHallOfTheMountainKing.mp3',
    funFact: 'Esta música começa devagar e vai ficando cada vez mais rápida e emocionante!'
  },
  {
    id: 'mozart-symphony-40',
    title: 'Sinfonia No. 40 - 1º Mov.',
    composer: 'Wolfgang Amadeus Mozart',
    instrument: 'Orquestra',
    duration: 480,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Mozart_SymphonyNo.40inGMinor/WolfgangAmadeusMozart-SymphonyNo.40InGMinorK.550-01-MoltoAllegro.mp3',
    funFact: 'Mozart começou a compor com apenas 5 anos!'
  },
  {
    id: 'schubert-sonata',
    title: 'Sonata em Lá Maior - Andante',
    composer: 'Franz Schubert',
    instrument: 'Piano',
    duration: 300,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Schubert_SonataInAMajorD.664/FranzSchubert-SonataInAMajorD.664-02-Andante.mp3',
    funFact: 'Schubert compôs mais de 600 canções em sua curta vida!'
  }
]

export function getRandomTrack(excludeIds = []) {
  const available = classicalMusic.filter(t => !excludeIds.includes(t.id))
  if (available.length === 0) return classicalMusic[0]
  return available[Math.floor(Math.random() * available.length)]
}
