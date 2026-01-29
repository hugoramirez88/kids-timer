// src/composables/useProgressColor.js
import { computed } from 'vue'
import { useTimerStore } from '../stores/timer'

/**
 * Composable for consistent progress color across all progress indicators.
 * Returns a computed color that changes based on timer status and progress percentage.
 */
export function useProgressColor() {
  const timer = useTimerStore()

  const progressColor = computed(() => {
    const percent = timer.progressPercent
    if (timer.status === 'break') return 'var(--color-secondary, #2196F3)'
    if (percent >= 75) return 'var(--color-danger, #f44336)'
    if (percent >= 50) return 'var(--color-warning, #FF9800)'
    return 'var(--color-primary, #4CAF50)'
  })

  return { progressColor }
}
