// src/stores/timer.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProfilesStore } from './profiles'
import { useSettingsStore } from './settings'
import { storage } from '../utils/storage'
import { points as pointValues } from '../data/rewards'

export const useTimerStore = defineStore('timer', () => {
  // Timer state
  const status = ref('idle') // 'idle' | 'working' | 'break' | 'paused'
  const timeRemaining = ref(0)
  const totalTime = ref(0)
  const targetEndTime = ref(null)

  // Session config
  const workDuration = ref(25)
  const breakDuration = ref(5)

  // Session tracking
  const completedPomodorosToday = ref(0)
  const isFirstOfDay = ref(true)

  // Internal
  let intervalId = null
  let pausedStatus = null

  // Presets
  const presets = [
    { id: '25-5', name: 'Curto', work: 25, break: 5 },
    { id: '50-10', name: 'Longo', work: 50, break: 10 },
    { id: 'custom', name: 'Personalizado', work: null, break: null },
  ]

  // Computed
  const progress = computed(() => {
    if (totalTime.value === 0) return 0
    return 1 - (timeRemaining.value / totalTime.value)
  })

  const displayTime = computed(() => {
    const mins = Math.floor(timeRemaining.value / 60)
    const secs = timeRemaining.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  const progressPercent = computed(() => {
    return Math.round(progress.value * 100)
  })

  // Alert checks
  function checkAlerts(remaining, total) {
    const settings = useSettingsStore()
    const alerts = settings.alerts

    const triggers = []

    if (alerts.oneMinute && remaining === 60) {
      triggers.push('oneMinute')
    }
    if (alerts.fiveMinutes && remaining === 300) {
      triggers.push('fiveMinutes')
    }
    if (alerts.fiftyPercent && remaining === Math.floor(total * 0.5)) {
      triggers.push('fiftyPercent')
    }
    if (alerts.twentyFivePercent && remaining === Math.floor(total * 0.25)) {
      triggers.push('twentyFivePercent')
    }

    return triggers
  }

  // Timer tick
  function tick() {
    const now = Date.now()
    const remaining = Math.max(0, Math.round((targetEndTime.value - now) / 1000))
    timeRemaining.value = remaining

    // Check for alerts
    const alerts = checkAlerts(remaining, totalTime.value)
    if (alerts.length > 0) {
      // Emit event for sound system to handle
      window.dispatchEvent(new CustomEvent('timer-alert', { detail: { alerts } }))
    }

    if (remaining <= 0) {
      handleTimerComplete()
    }
  }

  function handleTimerComplete() {
    clearInterval(intervalId)
    intervalId = null

    if (status.value === 'working') {
      // Work session complete - THIS IS THE POMODORO COMPLETION!
      const profiles = useProfilesStore()

      // Award points for completing work
      profiles.addPoints(pointValues.completePomodoro)
      if (isFirstOfDay.value) {
        profiles.addPoints(pointValues.firstOfDay)
        isFirstOfDay.value = false
      }
      if (profiles.activeProfile?.currentStreak > 0) {
        profiles.addPoints(pointValues.dailyStreak)
      }

      profiles.recordPomodoroComplete(workDuration.value)
      completedPomodorosToday.value++

      // Check daily badges
      checkDailyBadges()

      // Record to session history
      recordSession()

      window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'work-complete' } }))
      window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'pomodoro-complete' } }))

      // Start break
      startBreak()
    } else if (status.value === 'break') {
      // Break complete - just return to idle
      window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'break-complete' } }))

      status.value = 'idle'
      timeRemaining.value = 0
      totalTime.value = 0
    }
  }

  function checkDailyBadges() {
    const profiles = useProfilesStore()
    if (!profiles.activeProfile) return

    if (completedPomodorosToday.value >= 5 && !profiles.activeProfile.badges.includes('cinco-seguidos')) {
      profiles.awardBadge('cinco-seguidos')
    }
    if (completedPomodorosToday.value >= 10 && !profiles.activeProfile.badges.includes('maratonista')) {
      profiles.awardBadge('maratonista')
    }
  }

  function recordSession() {
    const data = storage.load()
    const profiles = useProfilesStore()

    data.sessionHistory.push({
      profileId: profiles.activeProfileId,
      date: new Date().toISOString(),
      type: 'pomodoro',
      workDuration: workDuration.value,
      breakDuration: breakDuration.value,
      completed: true,
    })

    storage.save(storage.pruneOldHistory(data))
  }

  // Public methods
  function setPreset(presetId) {
    const preset = presets.find(p => p.id === presetId)
    if (preset && preset.work) {
      workDuration.value = preset.work
      breakDuration.value = preset.break
    }
  }

  function setCustomDurations(work, breakMins) {
    workDuration.value = work
    breakDuration.value = breakMins
  }

  function startWork() {
    status.value = 'working'
    totalTime.value = workDuration.value * 60
    timeRemaining.value = totalTime.value
    targetEndTime.value = Date.now() + (totalTime.value * 1000)

    window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'work-start' } }))

    intervalId = setInterval(tick, 1000)
  }

  function startBreak() {
    status.value = 'break'
    totalTime.value = breakDuration.value * 60
    timeRemaining.value = totalTime.value
    targetEndTime.value = Date.now() + (totalTime.value * 1000)

    window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'break-start' } }))

    intervalId = setInterval(tick, 1000)
  }

  function pause() {
    if (status.value !== 'working' && status.value !== 'break') return

    pausedStatus = status.value
    status.value = 'paused'
    clearInterval(intervalId)
    intervalId = null
  }

  function resume() {
    if (status.value !== 'paused') return

    status.value = pausedStatus
    targetEndTime.value = Date.now() + (timeRemaining.value * 1000)
    intervalId = setInterval(tick, 1000)
  }

  function stop() {
    clearInterval(intervalId)
    intervalId = null
    status.value = 'idle'
    timeRemaining.value = 0
    totalTime.value = 0
    targetEndTime.value = null
    pausedStatus = null
  }

  function skipBreak() {
    if (status.value !== 'break') return

    clearInterval(intervalId)
    intervalId = null

    window.dispatchEvent(new CustomEvent('timer-event', { detail: { type: 'break-skipped' } }))

    status.value = 'idle'
    timeRemaining.value = 0
    totalTime.value = 0
    targetEndTime.value = null
  }

  // Handle tab visibility
  function handleVisibilityChange() {
    if (document.hidden) return
    if (!targetEndTime.value) return
    if (status.value === 'paused' || status.value === 'idle') return

    // Recalculate on tab focus
    tick()
  }

  // Initialize visibility listener
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Check if new day for first-of-day bonus
  function checkNewDay() {
    const lastDate = localStorage.getItem('kids-timer-last-date')
    const today = new Date().toISOString().split('T')[0]

    if (lastDate !== today) {
      completedPomodorosToday.value = 0
      isFirstOfDay.value = true
      localStorage.setItem('kids-timer-last-date', today)
    }
  }

  checkNewDay()

  return {
    status,
    timeRemaining,
    totalTime,
    workDuration,
    breakDuration,
    progress,
    progressPercent,
    displayTime,
    presets,
    completedPomodorosToday,
    setPreset,
    setCustomDurations,
    startWork,
    pause,
    resume,
    stop,
    skipBreak,
  }
})
