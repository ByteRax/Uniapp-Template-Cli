import { ref, onUnmounted } from 'vue'

interface CountdownOptions {
  interval?: number
  onFinish?: () => void
}

export const useCountdown = (initialCount = 60, options: CountdownOptions = {}) => {
  const { interval = 1000, onFinish } = options
  const count = ref(initialCount)
  const isActive = ref(false)
  let timerId: number | null = null

  const stop = () => {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
    isActive.value = false
  }

  const start = () => {
    if (isActive.value) return
    isActive.value = true
    timerId = setInterval(() => {
      count.value--
      if (count.value <= 0) {
        stop()
        onFinish?.()
      }
    }, interval) as unknown as number
  }

  const reset = () => {
    stop()
    count.value = initialCount
  }

  onUnmounted(() => stop())

  return { count, isActive, start, stop, reset }
}
