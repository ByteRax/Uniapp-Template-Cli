import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGlobalToast } from '@/composables/useGlobalToast'

vi.mock('@/router', () => ({ getCurrentPath: () => 'pages/index/index' }))

describe('global toast lifetime', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())
  it('clears Store state after the configured duration', () => {
    const store = useGlobalToast()
    store.show('first')
    vi.advanceTimersByTime(2000)
    expect(store.toastOptions.show).toBe(false)
    expect(store.currentPage).toBe('')
  })
  it('replaces the older timeout without closing the newer toast', () => {
    const store = useGlobalToast()
    store.show({ msg: 'first', duration: 100 })
    vi.advanceTimersByTime(50)
    store.show({ msg: 'second', duration: 200 })
    vi.advanceTimersByTime(50)
    expect(store.toastOptions.msg).toBe('second')
    expect(store.toastOptions.show).toBe(true)
    vi.advanceTimersByTime(150)
    expect(store.toastOptions.show).toBe(false)
  })
  it('keeps duration zero visible and clears timers on close and disposal', () => {
    const store = useGlobalToast()
    store.show({ msg: 'persistent', duration: 0 })
    vi.advanceTimersByTime(10000)
    expect(store.toastOptions.show).toBe(true)
    store.close()
    expect(vi.getTimerCount()).toBe(0)
    store.show('timed')
    store.$dispose()
    expect(vi.getTimerCount()).toBe(0)
  })
})
