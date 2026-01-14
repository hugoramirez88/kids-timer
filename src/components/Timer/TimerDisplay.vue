<!-- src/components/Timer/TimerDisplay.vue -->
<template>
  <div class="timer-display">
    <div class="timer-status">
      <span v-if="timer.status === 'idle'" class="status-badge idle">Pronto</span>
      <span v-else-if="timer.status === 'working'" class="status-badge working">Trabalhando</span>
      <span v-else-if="timer.status === 'break'" class="status-badge break">Intervalo</span>
      <span v-else-if="timer.status === 'paused'" class="status-badge paused">Pausado</span>
    </div>

    <div class="timer-time">
      {{ timer.displayTime }}
    </div>

    <div class="timer-info" v-if="timer.status !== 'idle'">
      {{ timer.progressPercent }}% completo
    </div>
  </div>
</template>

<script setup>
import { useTimerStore } from '../../stores/timer'

const timer = useTimerStore()
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.timer-status {
  min-height: 32px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-badge.idle {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text, #333);
}

.status-badge.working {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.status-badge.break {
  background: var(--color-secondary, #2196F3);
  color: white;
}

.status-badge.paused {
  background: var(--color-warning, #FF9800);
  color: white;
}

.timer-time {
  font-size: 96px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--color-text, #333);
}

.timer-info {
  font-size: 18px;
  color: var(--color-text-secondary, #666);
}
</style>
