import { beforeEach, describe, expect, it, vi } from 'vitest'
import router from '@/router/router'

vi.mock('@/pages.json', () => ({
  pages: [
    { path: 'pages/index/index', type: 'home' },
    { path: 'pages/private', needLogin: true }
  ],
  subPackages: [{ root: 'pages-sub', pages: [{ path: 'login/login' }, { path: '404/index' }] }]
}))
vi.mock('@/stores/userStore.ts', () => ({ userStore: () => ({ hasLogin: () => false }) }))

describe('router and guard integration', () => {
  const navigate = vi.fn()
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('getApp', () => ({ globalData: {} }))
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])
    vi.stubGlobal('uni', { navigateTo: navigate, redirectTo: navigate })
  })
  it('redirects a protected page once without recursion', () => {
    router.push('/pages/private')
    expect(navigate).toHaveBeenCalledOnce()
    expect(navigate.mock.calls[0]?.[0].url).toBe('/pages-sub/login/login?redirect=%2Fpages%2Fprivate')
  })
  it('redirects an unknown page once without recursion', () => {
    router.push('/missing')
    expect(navigate).toHaveBeenCalledOnce()
    expect(navigate.mock.calls[0]?.[0].url).toBe('/pages-sub/404/index')
  })
})
