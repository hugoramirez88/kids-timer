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

      <!-- Animal -->
      <g :transform="`translate(${animalX}, ${animalY})`">
        <circle r="16" fill="var(--color-surface, white)" stroke="var(--color-primary, #4CAF50)" stroke-width="2"/>
        <text y="5" text-anchor="middle" font-size="16">{{ animalEmoji }}</text>
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

// Animal position along path (simplified linear interpolation)
const animalX = computed(() => {
  return 20 + (260 * timer.progress)
})

const animalY = computed(() => {
  const p = timer.progress
  // Approximate Y position based on path curves
  if (p < 0.33) {
    // First curve: goes up
    const t = p / 0.33
    return 100 - 60 * Math.sin(t * Math.PI)
  } else if (p < 0.66) {
    // Second curve: goes down
    const t = (p - 0.33) / 0.33
    return 100 + 60 * Math.sin(t * Math.PI)
  } else {
    // Final stretch
    return 100
  }
})

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
  max-width: 300px;
}

.path-svg {
  width: 100%;
  height: auto;
}

.progress-path {
  transition: stroke-dashoffset 0.5s ease;
}
</style>
