// composables/useDebounceThrottle.ts
import { onUnmounted } from 'vue'

export const useDebounce = <T extends (...args: any[]) => any>(fn: T, delay = 300) => {
  let timerId: number | null = null

  const debouncedFn = (...args: Parameters<T>) => {
    if (timerId !== null) clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay) as unknown as number
  }

  onUnmounted(() => {
    if (timerId !== null) clearTimeout(timerId)
  })
  return debouncedFn
}

export const useThrottle = <T extends (...args: any[]) => any>(fn: T, delay = 300) => {
  let lastTime = 0

  const throttledFn = (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn(...args)
      lastTime = now
    }
  }

  return throttledFn
}
