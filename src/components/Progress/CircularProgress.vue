<!-- src/components/Progress/CircularProgress.vue -->
<template>
  <div class="circular-progress">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- Background circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
      />
      <!-- Progress circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="progress-ring"
        :class="{ pulse: shouldPulse }"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../../stores/timer'

const props = defineProps({
  size: { type: Number, default: 280 },
  strokeWidth: { type: Number, default: 16 },
})

const timer = useTimerStore()

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const dashOffset = computed(() => {
  const progress = timer.progress
  return circumference.value * (1 - progress)
})

const bgColor = computed(() => 'var(--color-progress-bg, #e0e0e0)')

const progressColor = computed(() => {
  const percent = timer.progressPercent
  if (timer.status === 'break') return 'var(--color-secondary, #2196F3)'
  if (percent >= 75) return 'var(--color-danger, #f44336)'
  if (percent >= 50) return 'var(--color-warning, #FF9800)'
  return 'var(--color-primary, #4CAF50)'
})

const shouldPulse = computed(() => {
  return timer.timeRemaining <= 60 && timer.timeRemaining > 0 && timer.status !== 'paused'
})
</script>

<style scoped>
.circular-progress {
  display: flex;
  align-items: center;
  justify-content: center;
}

.circular-progress svg {
  transform: rotate(-90deg);
}

.progress-ring {
  transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
}

.progress-ring.pulse {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
