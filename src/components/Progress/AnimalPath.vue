<!-- src/components/Progress/AnimalPath.vue -->
<template>
  <div class="animal-path">
    <svg viewBox="0 0 300 200" class="path-svg">
      <!-- Winding path -->
      <path
        :d="pathD"
        fill="none"
        stroke="var(--color-progress-bg, #e0e0e0)"
        stroke-width="8"
        stroke-linecap="round"
      />
      <!-- Progress path -->
      <path
        :d="pathD"
        fill="none"
        :stroke="progressColor"
        stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="pathLength"
        :stroke-dashoffset="dashOffset"
        class="progress-path"
      />

      <!-- Start marker (home) -->
      <circle cx="20" cy="100" r="12" fill="var(--color-primary-light, #E8F5E9)" stroke="var(--color-primary, #4CAF50)" stroke-width="2"/>
      <text x="20" y="104" text-anchor="middle" font-size="12">🏠</text>

      <!-- End marker (goal) -->
      <circle cx="280" cy="100" r="12" fill="var(--color-warning, #FFE66D)" stroke="var(--color-warning, #FF9800)" stroke-width="2"/>
      <text x="280" y="104" text-anchor="middle" font-size="12">⭐</text>

      <!-- Animal (flipped to face right/forward) -->
      <g :transform="`translate(${animalX}, ${animalY})`">
        <circle r="16" fill="var(--color-surface, white)" stroke="var(--color-primary, #4CAF50)" stroke-width="2"/>
        <text y="5" text-anchor="middle" font-size="16" transform="scale(-1, 1)" class="animal-emoji">{{ animalEmoji }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../../stores/timer'
import { useSettingsStore } from '../../stores/settings'

const timer = useTimerStore()
const settings = useSettingsStore()

// Winding path definition
const pathD = "M 20 100 Q 80 40 140 100 Q 200 160 260 100 L 280 100"
const pathLength = 340 // Approximate path length

const dashOffset = computed(() => {
  return pathLength * (1 - timer.progress)
})

const progressColor = computed(() => {
  if (timer.status === 'break') return 'var(--color-secondary, #2196F3)'
  return 'var(--color-primary, #4CAF50)'
})

// Quadratic bezier interpolation: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
function quadraticBezier(t, p0, p1, p2) {
  const mt = 1 - t
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2
}

// Path segments with their approximate length ratios
// Segment 1: (20,100) -> Q(80,40) -> (140,100) ~= 140px
// Segment 2: (140,100) -> Q(200,160) -> (260,100) ~= 140px
// Segment 3: (260,100) -> (280,100) = 20px line
// Total ~= 300px, ratios: 0.467, 0.467, 0.066

const animalPosition = computed(() => {
  const p = timer.progress

  if (p <= 0.467) {
    // First bezier curve: (20,100) -> Q(80,40) -> (140,100)
    const t = p / 0.467
    return {
      x: quadraticBezier(t, 20, 80, 140),
      y: quadraticBezier(t, 100, 40, 100)
    }
  } else if (p <= 0.934) {
    // Second bezier curve: (140,100) -> Q(200,160) -> (260,100)
    const t = (p - 0.467) / 0.467
    return {
      x: quadraticBezier(t, 140, 200, 260),
      y: quadraticBezier(t, 100, 160, 100)
    }
  } else {
    // Final line segment: (260,100) -> (280,100)
    const t = (p - 0.934) / 0.066
    return {
      x: 260 + t * 20,
      y: 100
    }
  }
})

const animalX = computed(() => animalPosition.value.x)
const animalY = computed(() => animalPosition.value.y)

const animalEmoji = computed(() => {
  const animals = {
    rabbit: '🐰',
    turtle: '🐢',
    fox: '🦊',
    snail: '🐌',
  }
  return animals[settings.pathAnimal] || '🐰'
})
</script>

<style scoped>
.animal-path {
  width: 100%;
  max-width: 450px;
}

.path-svg {
  width: 100%;
  height: auto;
}

.progress-path {
  transition: stroke-dashoffset 0.5s ease;
}

/* Flip animal emoji to face the direction of travel (right) */
.animal-emoji {
  transform-origin: center;
}
</style>
