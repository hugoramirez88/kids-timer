<!-- src/components/Progress/ProgressBar.vue -->
<template>
  <div class="progress-bar-container">
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${timer.progressPercent}%`, backgroundColor: progressColor }"
      ></div>

      <!-- Character riding on top -->
      <div
        class="character"
        :style="{ left: `${timer.progressPercent}%` }"
      >
        <span class="character-emoji">{{ characterEmoji }}</span>
      </div>
    </div>

    <!-- Markers -->
    <div class="markers">
      <span class="marker start">🚀</span>
      <span class="marker quarter">25%</span>
      <span class="marker half">50%</span>
      <span class="marker three-quarter">75%</span>
      <span class="marker end">🎯</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimerStore } from '../../stores/timer'

const timer = useTimerStore()

const progressColor = computed(() => {
  const percent = timer.progressPercent
  if (timer.status === 'break') return 'var(--color-secondary, #2196F3)'
  if (percent >= 75) return 'var(--color-danger, #f44336)'
  if (percent >= 50) return 'var(--color-warning, #FF9800)'
  return 'var(--color-primary, #4CAF50)'
})

const characterEmoji = computed(() => {
  const percent = timer.progressPercent
  if (percent >= 90) return '🏃'
  if (percent >= 50) return '🚶'
  return '⭐'
})
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  max-width: 450px;
  padding: 20px 0;
}

.progress-track {
  position: relative;
  height: 24px;
  background: var(--color-progress-bg, #e0e0e0);
  border-radius: 12px;
  overflow: visible;
}

.progress-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease, background-color 0.3s ease;
}

.character {
  position: absolute;
  top: -20px;
  transform: translateX(-50%);
  transition: left 0.5s ease;
}

.character-emoji {
  font-size: 28px;
  display: inline-block;
  transform: scaleX(-1); /* Flip to face right (forward) */
  animation: bounce 0.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: scaleX(-1) translateY(0); }
  50% { transform: scaleX(-1) translateY(-5px); }
}

.markers {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 4px;
}

.marker {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}

.marker.start, .marker.end {
  font-size: 16px;
}
</style>
