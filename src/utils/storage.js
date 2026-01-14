// src/utils/storage.js
const STORAGE_KEY = 'kids-timer-data'

const defaultData = {
  version: 1,
  profiles: [],
  activeProfileId: null,
  globalSettings: {
    masterVolume: 0.8,
    soundEffectsEnabled: true,
    defaultPreset: '25-5'
  },
  sessionHistory: []
}

export const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return { ...defaultData }
      const data = JSON.parse(raw)
      return this.migrate(data)
    } catch (e) {
      console.error('Failed to load storage:', e)
      return { ...defaultData }
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (e) {
      console.error('Failed to save storage:', e)
      return false
    }
  },

  migrate(data) {
    // Future migrations go here
    // if (data.version === 1) { migrate to 2 }
    return data
  },

  exportData() {
    const data = this.load()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kids-timer-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.version) {
            this.save(this.migrate(data))
            resolve(data)
          } else {
            reject(new Error('Invalid backup file'))
          }
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  },

  pruneOldHistory(data, daysToKeep = 30) {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    data.sessionHistory = data.sessionHistory.filter(s =>
      new Date(s.date).getTime() > cutoff
    )
    return data
  }
}
