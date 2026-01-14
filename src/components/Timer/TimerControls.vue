<!-- src/components/Timer/TimerControls.vue -->
<template>
  <div class="timer-controls">
    <!-- Preset buttons (only when idle) -->
    <div v-if="timer.status === 'idle'" class="presets">
      <button
        type="button"
        v-for="preset in timer.presets"
        :key="preset.id"
        :class="['preset-btn', { active: selectedPreset === preset.id }]"
        @click="selectPreset(preset.id)"
      >
        {{ preset.name }}
        <span v-if="preset.work" class="preset-time">{{ preset.work }}/{{ preset.break }}</span>
      </button>
    </div>

    <!-- Custom duration inputs -->
    <div v-if="timer.status === 'idle' && selectedPreset === 'custom'" class="custom-inputs">
      <div class="input-group">
        <label>Trabalho (min)</label>
        <input
          type="number"
          v-model.number="customWork"
          min="1"
          max="120"
        />
      </div>
      <div class="input-group">
        <label>Intervalo (min)</label>
        <input
          type="number"
          v-model.number="customBreak"
          min="1"
          max="60"
        />
      </div>
    </div>

    <!-- Main action buttons -->
    <div class="actions">
      <button
        type="button"
        v-if="timer.status === 'idle'"
        class="btn btn-primary btn-large"
        @click="start"
      >
        Começar
      </button>

      <button
        type="button"
        v-if="timer.status === 'working' || timer.status === 'break'"
        class="btn btn-warning"
        @click="timer.pause()"
      >
        Pausar
      </button>

      <button
        type="button"
        v-if="timer.status === 'paused'"
        class="btn btn-primary"
        @click="timer.resume()"
      >
        Continuar
      </button>

      <button
        type="button"
        v-if="timer.status !== 'idle'"
        class="btn btn-danger"
        @click="timer.stop()"
      >
        Parar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTimerStore } from '../../stores/timer'

const timer = useTimerStore()

const selectedPreset = ref('25-5')
const customWork = ref(25)
const customBreak = ref(5)

function selectPreset(presetId) {
  selectedPreset.value = presetId
  if (presetId !== 'custom') {
    timer.setPreset(presetId)
  }
}

function start() {
  if (selectedPreset.value === 'custom') {
    timer.setCustomDurations(customWork.value, customBreak.value)
  }
  timer.startWork()
}
</script>

<style scoped>
.timer-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 400px;
}

.presets {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  border: 2px solid var(--color-border, #ddd);
  border-radius: var(--border-radius, 12px);
  background: var(--color-surface, white);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.preset-btn:hover {
  border-color: var(--color-primary, #4CAF50);
}

.preset-btn.active {
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.preset-time {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-secondary, #666);
  margin-top: 4px;
}

.custom-inputs {
  display: flex;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.input-group input {
  width: 80px;
  padding: 8px 12px;
  border: 2px solid var(--color-border, #ddd);
  border-radius: var(--border-radius, 8px);
  font-size: 18px;
  font-family: inherit;
  text-align: center;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-primary, #4CAF50);
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: var(--border-radius, 12px);
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-large {
  padding: 18px 48px;
  font-size: 22px;
}

.btn-primary {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark, #388E3C);
}

.btn-warning {
  background: var(--color-warning, #FF9800);
  color: white;
}

.btn-warning:hover {
  background: #F57C00;
}

.btn-danger {
  background: var(--color-danger, #f44336);
  color: white;
}

.btn-danger:hover {
  background: #D32F2F;
}
</style>
