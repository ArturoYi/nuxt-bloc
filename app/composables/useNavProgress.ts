let trickleTimer: ReturnType<typeof setInterval> | null = null

export function useNavProgress() {
  const active = useState('app-nav-progress-active', () => false)
  const value = useState('app-nav-progress-value', () => 0)

  const clearTrickle = () => {
    if (trickleTimer) {
      clearInterval(trickleTimer)
      trickleTimer = null
    }
  }

  const start = () => {
    clearTrickle()
    active.value = true
    value.value = 0.06
    trickleTimer = setInterval(() => {
      const v = value.value
      if (v >= 0.9)
        return
      value.value = Math.min(0.9, v + 0.02 + Math.random() * 0.04)
    }, 340)
  }

  const finish = () => {
    clearTrickle()
    value.value = 1
    setTimeout(() => {
      active.value = false
      setTimeout(() => {
        value.value = 0
      }, 200)
    }, 220)
  }

  return { active, value, start, finish }
}
