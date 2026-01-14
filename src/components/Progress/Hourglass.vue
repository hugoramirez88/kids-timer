<!-- src/components/Progress/Hourglass.vue -->
<template>
  <div class="hourglass-container">
    <svg viewBox="0 0 100 160" class="hourglass-svg">
      <!-- Hourglass frame -->
      <path
        d="M 15 10 L 85 10 L 85 20 L 55 75 L 55 85 L 85 140 L 85 150 L 15 150 L 15 140 L 45 85 L 45 75 L 15 20 Z"
        fill="none"
        stroke="var(--color-text, #333)"
        stroke-width="3"
      />

      <!-- Top sand (remaining) -->
      <clipPath id="topClip">
        <path d="M 20 15 L 80 15 L 80 20 L 52 72 L 48 72 L 20 20 Z"/>
      </clipPath>
      <rect
        x="15"
        :y="topSandY"
        width="70"
        :height="topSandHeight"
        :fill="sandColor"
        clip-path="url(#topClip)"
      />

      <!-- Bottom sand (elapsed) -->
      <clipPath id="bottomClip">
        <path d="M 48 88 L 52 88 L 80 140 L 80 145 L 20 145 L 20 140 Z"/>
      </clipPath>
      <rect
        x="15"
        :y="bottomSandY"
        width="70"
        :height="bottomSandHeight"
        :fill="sandColor"
        clip-path="url(#bottomClip)"
      />

      <!-- Falling sand stream (when active) -->
      <line
        v-if="isActive"
        x1="50" y1="75"
        x2="50" y2="85"
        :stroke="sandColor"
        stroke-width="3"
        class="sand-stream"
      />

      <!-- Sand particles falling (animated) -->
      <g v-if="isActive" class="particles">
        <circle
          v-for="i in 3"
          :key="i"
          cx="50"
          :cy="75 + (i * 3)"
          r="2"
          :fill="sandColor"
          :style="{ animationDelay: `${i * 0.2}s` }"
          class="particle"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../../stores/timer'

const timer = useTimerStore()

const isActive = computed(() => {
  return timer.status === 'working' || timer.status === 'break'
})

const sandColor = computed(() => {
  if (timer.status === 'break') return 'var(--color-secondary, #2196F3)'
  return '#D4A574' // Sand color
})

// Top sand decreases as progress increases
const topSandHeight = computed(() => {
  return 60 * (1 - timer.progress)
})

const topSandY = computed(() => {
  return 15 + (60 * timer.progress)
})

// Bottom sand increases as progress increases
const bottomSandHeight = computed(() => {
  return 60 * timer.progress
})

const bottomSandY = computed(() => {
  return 145 - bottomSandHeight.value
})
</script>

<style scoped>
.hourglass-container {
  width: 120px;
  height: 180px;
}

.hourglass-svg {
  width: 100%;
  height: 100%;
}

.sand-stream {
  animation: pulse 0.5s ease-in-out infinite;
}

.particle {
  animation: fall 0.6s ease-in infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes fall {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}
</style>
