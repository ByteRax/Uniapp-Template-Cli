import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/pages.json', () => ({ pages: [{ path: 'pages/index/index', type: 'home' }] }))
vi.mock('@/router/interceptor.ts', () => ({ navigateToInterceptor: { invoke: () => true } }))
vi.mock('@/router', () => ({ getCurrentPage: () => undefined }))

describe('navigation callbacks', () => {
  let router: (typeof import('@/router/router'))['default']
  let app: { globalData: Record<string, unknown> }
  let navigate: ReturnType<typeof vi.fn>
  beforeEach(async () => {
    vi.resetModules()
    app = { globalData: {} }
    navigate = vi.fn()
    vi.stubGlobal('getApp', () => app)
    vi.stubGlobal('uni', { navigateTo: navigate, redirectTo: navigate })
    router = (await import('@/router/router')).default
  })
  it('releases the lock and forwards the caller complete callback', () => {
    const complete = vi.fn()
    router.push({ url: '/first', complete })
    navigate.mock.calls[0]?.[0].complete({ errMsg: 'ok' })
    router.push('/second')
    expect(complete).toHaveBeenCalledOnce()
    expect(navigate).toHaveBeenCalledTimes(2)
  })
  it('releases the lock even when a caller callback throws', () => {
    router.push({
      url: '/first',
      success: () => {
        throw new Error('caller')
      }
    })
    expect(() => navigate.mock.calls[0]?.[0].success({ errMsg: 'ok' })).toThrow('caller')
    router.push('/second')
    expect(navigate).toHaveBeenCalledTimes(2)
  })
  it('releases the lock on native failure and synchronous throw', () => {
    router.push('/first')
    navigate.mock.calls[0]?.[0].fail({ errMsg: 'fail' })
    navigate.mockImplementationOnce(() => {
      throw new Error('native')
    })
    expect(() => router.push('/second')).toThrow('native')
    router.push('/third')
    expect(navigate).toHaveBeenCalledTimes(3)
  })
  it('keeps same URL deduplication and in-flight mutual exclusion', () => {
    router.push('/first')
    router.push('/second')
    expect(navigate).toHaveBeenCalledOnce()
    navigate.mock.calls[0]?.[0].complete({ errMsg: 'ok' })
    router.push('/first')
    expect(navigate).toHaveBeenCalledOnce()
  })
  it('does not unlock a newer navigation when the older complete follows success', () => {
    router.push({ url: '/first', success: () => router.push('/second') })
    const first = navigate.mock.calls[0]?.[0]
    first.success({ errMsg: 'ok' })
    first.complete({ errMsg: 'ok' })
    router.push('/third')
    expect(navigate).toHaveBeenCalledTimes(2)
  })
})
