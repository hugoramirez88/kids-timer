<!-- src/components/UI/Toast.vue -->
<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="currentToast" class="toast" @click="dismiss">
        <span class="toast-icon">{{ currentToast.icon }}</span>
        <div class="toast-content">
          <div class="toast-title">Conquista Desbloqueada!</div>
          <div class="toast-message">{{ currentToast.message }}</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { badges } from '../../data/rewards'

const currentToast = ref(null)
const queue = ref([])
let dismissTimeout = null

function showToast(badgeId) {
  const badge = badges.find(b => b.id === badgeId)
  if (!badge) return

  const toast = {
    icon: badge.icon,
    message: badge.name
  }

  if (currentToast.value) {
    queue.value.push(toast)
  } else {
    displayToast(toast)
  }
}

function displayToast(toast) {
  currentToast.value = toast
  dismissTimeout = setTimeout(dismiss, 4000)
}

function dismiss() {
  if (dismissTimeout) {
    clearTimeout(dismissTimeout)
    dismissTimeout = null
  }
  currentToast.value = null

  // Show next in queue after delay
  if (queue.value.length > 0) {
    setTimeout(() => {
      const next = queue.value.shift()
      displayToast(next)
    }, 500)
  }
}

function handleBadgeEarned(e) {
  showToast(e.detail.badgeId)
}

onMounted(() => {
  window.addEventListener('badge-earned', handleBadgeEarned)
})

onUnmounted(() => {
  window.removeEventListener('badge-earned', handleBadgeEarned)
  if (dismissTimeout) {
    clearTimeout(dismissTimeout)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--color-surface, white);
  border: 3px solid var(--color-primary, #4CAF50);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 200;
  max-width: 90%;
}

.toast-icon {
  font-size: 32px;
  line-height: 1;
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary, #4CAF50);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toast-message {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text, #333);
}

/* Transition animations */
.toast-enter-active {
  animation: toast-in 300ms ease-out;
}

.toast-leave-active {
  animation: toast-out 200ms ease-in;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}
</style>
