import { beforeEach, describe, expect, it, vi } from 'vitest'
import { navigateToInterceptor } from '@/router/interceptor'

const mocks = vi.hoisted(() => ({
  hasLogin: vi.fn(() => false),
  push: vi.fn(),
  login: vi.fn(),
  notFound: vi.fn()
}))
vi.mock('@/pages.json', () => ({
  pages: [
    { path: 'pages/index/index', type: 'home' },
    { path: 'pages/private', needLogin: true }
  ],
  subPackages: [{ root: 'pages-sub', pages: [{ path: 'private', needLogin: true }, { path: 'login/login' }] }]
}))
vi.mock('@/router/router.ts', () => ({
  default: mocks,
  HOME_PAGE: '/pages/index/index',
  LOGIN_PAGE: '/pages-sub/login/login'
}))
vi.mock('@/stores/userStore.ts', () => ({ userStore: () => mocks }))

describe('route guard metadata', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.hasLogin.mockReturnValue(false)
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])
  })
  it('allows an existing public page without adding a second leading slash', () => {
    expect(navigateToInterceptor.invoke({ url: '/pages/index/index' })).toBe(true)
    expect(mocks.notFound).not.toHaveBeenCalled()
  })
  it.each(['/pages/private', '/pages-sub/private'])('redirects a protected page: %s', (url) => {
    expect(navigateToInterceptor.invoke({ url: `${url}?name=a` })).toBe(false)
    expect(mocks.login).toHaveBeenCalledWith(`?redirect=${encodeURIComponent(`${url}?name=a`)}`)
  })
  it('redirects an unknown page to 404', () => {
    expect(navigateToInterceptor.invoke({ url: '/missing' })).toBe(false)
    expect(mocks.notFound).toHaveBeenCalledOnce()
  })
  it('uses the wrapper for an authenticated login redirect and prevents a login loop', () => {
    mocks.hasLogin.mockReturnValue(true)
    navigateToInterceptor.invoke({ url: '/pages-sub/login/login?redirect=%2Fpages-sub%2Flogin%2Flogin' })
    expect(mocks.push).toHaveBeenCalledWith({ url: '/pages/index/index' }, true, true)
  })
})
