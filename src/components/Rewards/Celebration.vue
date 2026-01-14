<!-- src/components/Rewards/Celebration.vue -->
<template>
  <Teleport to="body">
    <div v-if="showCelebration" class="celebration-overlay" @click="dismiss">
      <!-- Confetti particles -->
      <div class="confetti-container">
        <div
          v-for="i in 50"
          :key="i"
          class="confetti"
          :style="getConfettiStyle(i)"
        ></div>
      </div>

      <!-- Message -->
      <div class="celebration-content">
        <div class="celebration-emoji">🎉</div>
        <h2 class="celebration-title">Parabéns!</h2>
        <p class="celebration-message">{{ message }}</p>
        <div class="points-earned" v-if="pointsEarned > 0">
          +{{ pointsEarned }} ⭐
        </div>
        <button type="button" class="dismiss-btn" @click="dismiss">
          Continuar
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showCelebration = ref(false)
const message = ref('')
const pointsEarned = ref(0)

function celebrate(msg, points = 0) {
  message.value = msg
  pointsEarned.value = points
  showCelebration.value = true
}

function dismiss() {
  showCelebration.value = false
}

function getConfettiStyle(index) {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA']
  const color = colors[index % colors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 3 + Math.random() * 2
  const size = 8 + Math.random() * 8

  return {
    '--confetti-color': color,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
  }
}

function handleTimerEvent(e) {
  const { type } = e.detail
  if (type === 'pomodoro-complete') {
    celebrate('Você completou um Pomodoro!', 15)
  }
}

onMounted(() => {
  window.addEventListener('timer-event', handleTimerEvent)
})

onUnmounted(() => {
  window.removeEventListener('timer-event', handleTimerEvent)
})

// Expose for external use
defineExpose({ celebrate })
</script>

<style scoped>
.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confetti-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.confetti {
  position: absolute;
  top: -20px;
  background: var(--confetti-color);
  border-radius: 2px;
  animation: confetti-fall linear forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.celebration-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px;
  background: var(--color-surface, white);
  border-radius: var(--border-radius-large, 24px);
  text-align: center;
  animation: scaleIn 0.3s ease;
  z-index: 1;
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.celebration-emoji {
  font-size: 64px;
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.celebration-title {
  font-size: 32px;
  color: var(--color-text, #333);
}

.celebration-message {
  font-size: 18px;
  color: var(--color-text-secondary, #666);
}

.points-earned {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-warning, #FF9800);
  animation: pulse 1s ease infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.dismiss-btn {
  padding: 12px 32px;
  background: var(--color-primary, #4CAF50);
  color: white;
  border: none;
  border-radius: var(--border-radius, 12px);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.dismiss-btn:hover {
  background: var(--color-primary-dark, #388E3C);
}
</style>
