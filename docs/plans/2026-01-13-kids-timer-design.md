# Kids Pomodoro Timer - Design Document

**Date:** 2026-01-13
**Status:** Approved
**Platform:** Web App (Vue 3 + Vite)

---

## Overview

A fun, educational Pomodoro timer for children. Features customizable work/break intervals, visual progress indicators, gamification with unlockables, and background music (classical library + YouTube integration). Supports multiple child profiles with local storage.

---

## Core Features

### 1. Timer Engine

**States:** `idle` | `working` | `break` | `paused`

**Presets:**
- Curto: 25 min work / 5 min break
- Longo: 50 min work / 10 min break
- Personalizado: Custom durations

**Logic:**
- 1-second tick interval
- Stores `targetEndTime` for accuracy on tab focus loss
- Work → Break → Idle cycle with celebrations

**Time Alerts (toggleable):**
- 1 minute remaining (default: ON)
- 5 minutes remaining (default: off)
- 50% time remaining (default: off)
- 25% time remaining (default: off)

---

### 2. Visual Progress Indicators

User selects one style in settings:

1. **Animal Path** - Cute animal walks along winding path (SVG)
2. **Circular Progress** - Ring fills/depletes with color changes
3. **Hourglass** - Animated falling sand
4. **Progress Bar with Character** - Horizontal bar with riding character

All indicators receive `progress` (0-1) prop. Digital time (MM:SS) always visible alongside.

---

### 3. Theming System

**Base Themes:**
- **Divertido (Fun)** - Bright colors, rounded corners, playful font
- **Minimalista (Minimal)** - Neutral palette, clean lines, system font

**Unlockable Themes:**
- Floresta (Forest) - 200 points
- Espaço (Space) - 200 points
- Oceano (Ocean) - 200 points
- Doces (Candy) - 200 points

Themes use CSS custom properties. Profile-linked (auto-loads with profile).

---

### 4. Audio System

**Three independent layers:**

#### 4.1 Sound Effects
- Start chime, break ding, completion celebration
- Optional: ticking, time warnings
- All toggleable in settings

#### 4.2 Classical Music Library
Built-in curated playlist (~15-20 pieces):
- Displays: piece name, composer, featured instrument
- Educational fun facts
- Covers: piano, violin, cello, flute, orchestra

Example:
```
Title: "Primavera"
Composer: Antonio Vivaldi
Instrument: Violino
Fun Fact: "Faz parte de 'As Quatro Estações'"
```

#### 4.3 YouTube Integration
- Paste URL, embed via IFrame API
- Shows thumbnail for confirmation
- Respects copyright (no download)

**Priority:** YouTube > Classical > Effects only

---

### 5. Break Suggestions

**Language:** Brazilian Portuguese

**Categories:**
- Movement (polichinelos, pular, dançar)
- Rest (respirar, relaxar)
- Hydration (beber água)
- Eyes (olhar longe, piscar)
- Fun (careta, abraço, sorriso)

**Visual Support:**
- Each suggestion has an illustration
- Style: TinTin/Studio Ghibli inspired (clean lines, soft colors, expressive)
- Child character performing the action
- SVG format for crisp scaling
- Image is primary focus (supports pre-readers)

**Logic:**
- Random category + suggestion on break start
- Rotates every 30 seconds (different category)
- Avoids recent repeats (last 5 in memory)

---

### 6. Profile & Gamification

#### 6.1 Child Profiles

```javascript
{
  id: "uuid",
  name: "Maria",
  avatar: "rabbit",
  theme: "divertido",
  progressIndicator: "animal-path",
  musicPreference: "classical",

  // Stats
  totalPomodoros: 47,
  totalMinutes: 1175,
  currentStreak: 3,
  longestStreak: 12,

  // Gamification
  points: 2350,
  unlockedThemes: [...],
  unlockedAvatars: [...],
  unlockedAnimals: [...],
  badges: [...]
}
```

#### 6.2 Points System

**Earning:**
- Complete work session: +10
- Complete full pomodoro: +15
- Daily streak bonus: +5/day
- First of day: +5

**Spending:**
- Avatar: 100 points
- Theme: 200 points
- Path animal: 150 points
- Sound pack: 100 points

#### 6.3 Badges (Conquistas)

- "Primeiro Passo" - First pomodoro
- "Maratonista" - 10 in one day
- "Consistente" - 7-day streak
- "Centurião" - 100 total

---

### 7. Data Persistence

**Storage:** localStorage (single JSON object)

```javascript
{
  version: 1,
  profiles: [...],
  activeProfileId: "uuid",
  globalSettings: {
    masterVolume: 0.8,
    soundEffectsEnabled: true,
    defaultPreset: "25-5"
  },
  sessionHistory: [...]  // last 30 days, auto-pruned
}
```

**Features:**
- Version field for migrations
- Export/import as JSON file
- ~5-10MB limit (our data: few KB)

---

## Project Structure

```
kids-timer/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   ├── sounds/
│   └── images/
└── src/
    ├── main.js
    ├── App.vue
    ├── stores/
    │   ├── timer.js
    │   ├── profiles.js
    │   └── settings.js
    ├── components/
    │   ├── Timer/
    │   ├── Progress/
    │   ├── Profiles/
    │   ├── Settings/
    │   ├── Music/
    │   └── Rewards/
    ├── themes/
    ├── data/
    │   ├── breakSuggestions.js
    │   ├── classicalMusic.js
    │   └── rewards.js
    └── utils/
        ├── storage.js
        └── audio.js
```

---

## Technology Stack

- **Framework:** Vue 3 (Composition API)
- **Build:** Vite
- **State:** Pinia
- **Styling:** CSS custom properties + scoped CSS
- **Storage:** localStorage
- **YouTube:** IFrame API

---

## Design Decisions

1. **Local-only storage** - Privacy, simplicity, no backend
2. **No parental controls** - Trust-based family environment
3. **Percentage alerts** - Work with any custom duration
4. **SVG illustrations** - Crisp at any size, small file size
5. **CSS variables for themes** - Easy switching, maintainable
6. **Pinia for state** - Lightweight, Vue-native, reactive
