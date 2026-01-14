// src/data/breakSuggestions.js
export const breakSuggestions = {
  movement: [
    { text: "Levante e se espreguice bem alto!", image: "stretch.svg" },
    { text: "Faça 10 polichinelos!", image: "jumping-jacks.svg" },
    { text: "Dance sua música favorita!", image: "dance.svg" },
    { text: "Toque os dedos dos pés 5 vezes!", image: "touch-toes.svg" },
    { text: "Gire os braços como um moinho!", image: "arm-circles.svg" },
    { text: "Pule como um sapo 5 vezes!", image: "frog-jump.svg" },
  ],
  rest: [
    { text: "Feche os olhos e respire fundo 3 vezes.", image: "breathe.svg" },
    { text: "Olhe pela janela e encontre algo verde.", image: "window.svg" },
    { text: "Sente-se e relaxe os ombros.", image: "relax.svg" },
    { text: "Boceje bem grande!", image: "yawn.svg" },
  ],
  hydration: [
    { text: "Beba um copo de água!", image: "drink-water.svg" },
    { text: "Hora de beber água. Você já bebeu hoje?", image: "water-glass.svg" },
    { text: "Leve sua garrafinha de água para encher.", image: "water-bottle.svg" },
  ],
  eyes: [
    { text: "Olhe para algo bem longe por 20 segundos.", image: "look-far.svg" },
    { text: "Pisque os olhos 10 vezes bem devagar.", image: "blink.svg" },
    { text: "Feche os olhos e conte até 20.", image: "eyes-closed.svg" },
  ],
  fun: [
    { text: "Faça uma careta engraçada!", image: "funny-face.svg" },
    { text: "Dê um abraço em alguém da sua casa!", image: "hug.svg" },
    { text: "Conte uma piada para você mesmo!", image: "joke.svg" },
    { text: "Sorria bem grande para o espelho!", image: "smile.svg" },
  ]
}

export const categoryIcons = {
  movement: '🏃',
  rest: '😌',
  hydration: '💧',
  eyes: '👀',
  fun: '😄'
}

export function getRandomSuggestion(excludeCategories = [], recentTexts = []) {
  const categories = Object.keys(breakSuggestions).filter(c => !excludeCategories.includes(c))
  if (categories.length === 0) return getRandomSuggestion([], recentTexts)

  const category = categories[Math.floor(Math.random() * categories.length)]
  const suggestions = breakSuggestions[category].filter(s => !recentTexts.includes(s.text))

  if (suggestions.length === 0) {
    return getRandomSuggestion([...excludeCategories, category], recentTexts)
  }

  const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
  return { ...suggestion, category, icon: categoryIcons[category] }
}
