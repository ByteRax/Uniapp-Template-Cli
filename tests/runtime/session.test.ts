import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userStore } from '@/stores/userStore'

const api = vi.hoisted(() => ({ login: vi.fn(), logout: vi.fn(), wxLogin: vi.fn(), getWxCode: vi.fn(), getUserInfo: vi.fn() }))
vi.mock('@/api/login', () => api)

describe('single token sessions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const storage = new Map<string, unknown>()
    vi.stubGlobal('uni', {
      getStorageSync: (key: string) => storage.get(key),
      setStorageSync: (key: string, value: unknown) => storage.set(key, value),
      removeStorageSync: (key: string) => storage.delete(key),
      showToast: vi.fn()
    })
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-25T00:00:00Z'))
    api.logout.mockResolvedValue({ code: 0 })
    api.getUserInfo.mockResolvedValue({ code: 0, data: { userId: 1, name: 'test', nickname: 'test' } })
  })
  it('checks expiration at access time without a reactive change', async () => {
    const store = userStore()
    store.setTokenInfo({ token: 'session', expiresIn: 1 })
    expect(store.validToken).toBe('session')
    vi.advanceTimersByTime(1000)
    expect(store.validToken).toBe('')
    expect(store.hasLogin()).toBe(false)
    expect(await store.tryGetValidToken()).toBe('')
    vi.useRealTimers()
  })
  it('does not accept invalid expiration data', () => {
    const store = userStore()
    store.setTokenInfo({ token: 'bad', expiresIn: Number.NaN })
    expect(store.hasLogin()).toBe(false)
    expect(store.validToken).toBe('')
    vi.useRealTimers()
  })
  it('fetches user information through the existing action after login', async () => {
    api.login.mockResolvedValue({ code: 0, data: { token: 'login', expiresIn: 60 } })
    await userStore().login({ username: 'test', password: 'test' })
    expect(api.getUserInfo).toHaveBeenCalled()
    vi.useRealTimers()
  })
  it('does not clear a new session when an older logout finishes', async () => {
    let finish: (() => void) | undefined
    api.logout.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finish = resolve
      })
    )
    const store = userStore()
    store.setTokenInfo({ token: 'old', expiresIn: 60 })
    const logout = store.logout()
    store.setTokenInfo({ token: 'new', expiresIn: 60 })
    finish?.()
    await logout
    expect(store.validToken).toBe('new')
    vi.useRealTimers()
  })
})
