// src/data/classicalMusic.js
// Public domain classical music from Musopen collection on Archive.org
// All recordings are public domain (CC0 or pre-1929)

export const classicalMusic = [
  // Shorter tracks (good for shorter focus sessions)
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
    id: 'schubert-sonata',
    title: 'Sonata em Lá Maior - Andante',
    composer: 'Franz Schubert',
    instrument: 'Piano',
    duration: 300,
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Schubert_SonataInAMajorD.664/FranzSchubert-SonataInAMajorD.664-02-Andante.mp3',
    funFact: 'Schubert compôs mais de 600 canções em sua curta vida!'
  },
  // Medium-length tracks
  {
    id: 'beethoven-eroica',
    title: 'Sinfonia No. 3 "Eroica" - 2º Mov.',
    composer: 'Ludwig van Beethoven',
    instrument: 'Orquestra',
    duration: 960, // ~16 min funeral march
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Beethoven_SymphonyNo.3Eroica/LudwigVanBeethoven-SymphonyNo.3InEFlatMajorEroicaOp.55-02-MarciaFunebreAdagioAssai.mp3',
    funFact: 'Beethoven dedicou esta sinfonia a Napoleão, mas rasgou a dedicatória quando ele se coroou imperador!'
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
  // NEW: Longer tracks for extended focus sessions
  {
    id: 'beethoven-eroica-1',
    title: 'Sinfonia Eroica - 1º Mov. Allegro',
    composer: 'Ludwig van Beethoven',
    instrument: 'Orquestra',
    duration: 1020, // ~17 min
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Beethoven_SymphonyNo.3Eroica/LudwigVanBeethoven-SymphonyNo.3InEFlatMajorEroicaOp.55-01-AllegroConBrio.mp3',
    funFact: 'Este movimento é duas vezes mais longo que as sinfonias anteriores de Beethoven!'
  },
  {
    id: 'brahms-symphony-1-4',
    title: 'Sinfonia No. 1 - Finale',
    composer: 'Johannes Brahms',
    instrument: 'Orquestra',
    duration: 1080, // ~18 min
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Brahms_SymphonyNo.1inCMinor/JohannesBrahms-SymphonyNo.1InCMinorOp.68-04-AdagioPiuAndanteAllegroNonTroppaMaConBrio.mp3',
    funFact: 'Brahms levou 21 anos para terminar esta sinfonia porque queria que fosse perfeita!'
  },
  {
    id: 'brahms-symphony-1-1',
    title: 'Sinfonia No. 1 - 1º Mov.',
    composer: 'Johannes Brahms',
    instrument: 'Orquestra',
    duration: 960, // ~16 min
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Brahms_SymphonyNo.1inCMinor/JohannesBrahms-SymphonyNo.1InCMinorOp.68-01-UnPocoSostenutoAllegro.mp3',
    funFact: 'As pessoas chamavam esta de "Décima Sinfonia de Beethoven" pelo estilo grandioso!'
  },
  {
    id: 'brahms-symphony-2-1',
    title: 'Sinfonia No. 2 - 1º Mov.',
    composer: 'Johannes Brahms',
    instrument: 'Orquestra',
    duration: 1020, // ~17 min
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Brahms_SymphonyNo.2inDMajor/JohannesBrahms-SymphonyNo.2InDMajorOp.73-01-AllegroNonTroppo.mp3',
    funFact: 'Brahms escreveu esta sinfonia durante férias de verão e ela é muito mais alegre!'
  },
  {
    id: 'tchaikovsky-pathetique-1',
    title: 'Sinfonia Patética - 1º Mov.',
    composer: 'Pyotr Tchaikovsky',
    instrument: 'Orquestra',
    duration: 1140, // ~19 min
    audioUrl: 'https://archive.org/download/MusopenCollectionAsFlac/Tchaikovsky_SymphonyPathetique/PyotrIlyichTchaikovsky-SymphonyNo.6InBMinorOpposth.74Pathtique-01-AdagioAllegroNonTroppo.mp3',
    funFact: 'Esta foi a última sinfonia de Tchaikovsky, escrita com muita emoção!'
  },
]

export function getRandomTrack(excludeIds = []) {
  const available = classicalMusic.filter(t => !excludeIds.includes(t.id))
  if (available.length === 0) return classicalMusic[0]
  return available[Math.floor(Math.random() * available.length)]
}
