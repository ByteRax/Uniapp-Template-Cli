import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Request } from '@/http'
import { httpInterceptor, httpRequestConfig } from '@/http/interceptor'
import router from '@/router/router'
import { RequestOptions } from '@/http/types'

const session = vi.hoisted(() => ({
  tokenInfo: { token: 'test', expiresIn: 60 },
  validToken: 'test',
  logout: vi.fn(),
  clearSession: vi.fn()
}))
vi.mock('@/stores/userStore.ts', () => ({ userStore: () => session }))
vi.mock('@/router/router', () => ({ default: { login: vi.fn() } }))

describe('request lifecycle', () => {
  let client: Request
  let calls: Array<Omit<UniApp.RequestOptions, 'complete'> & { complete?: (response: unknown) => void | Promise<void> }>
  let nativeRequest: ReturnType<typeof vi.fn>
  const response = { statusCode: 200, data: { code: 0, data: 'ok' }, header: {}, cookies: [], errMsg: 'request:ok' }
  beforeEach(() => {
    calls = []
    nativeRequest = vi.fn((options: (typeof calls)[number]) => {
      calls.push(options)
      return { abort: vi.fn() }
    })
    vi.stubGlobal('uni', { request: nativeRequest })
    vi.stubGlobal('Apis', { showLoading: vi.fn(), hideLoading: vi.fn(), showToast: vi.fn() })
    vi.stubGlobal('isNull', (value: unknown) => value == null)
    vi.stubGlobal('router', { login: vi.fn() })
    session.tokenInfo = { token: 'test', expiresIn: 60 }
    vi.clearAllMocks()
    session.validToken = 'test'
    session.clearSession.mockImplementation(() => {
      session.tokenInfo = { token: '', expiresIn: 0 }
      session.validToken = ''
    })
    client = new Request()
    client.setConfig(httpRequestConfig)
    client.setInterceptor(httpInterceptor)
  })
  it('settles cancelled requests even without a native abort callback', async () => {
    const first = client.get('/same').catch((error: unknown) => error)
    const second = client.get('/same')
    await calls[1]?.complete?.(response)
    expect(await second).toMatchObject({ code: 0 })
    expect(await first).toMatchObject({ code: -1 })
    expect(Apis.hideLoading).toHaveBeenCalledOnce()
  })
  it('does not delete a newer pending request when an old callback arrives', async () => {
    const first = client.get('/race').catch((error: unknown) => error)
    const second = client.get('/race').catch((error: unknown) => error)
    await calls[0]?.complete?.(response)
    const third = client.get('/race')
    await calls[2]?.complete?.(response)
    expect(await second).toMatchObject({ code: -1 })
    expect(await first).toMatchObject({ code: -1 })
    await third
    expect(Apis.hideLoading).toHaveBeenCalled()
  })
  it('rejects and cleans loading if native request creation throws', async () => {
    nativeRequest.mockImplementationOnce(() => {
      throw new Error('native')
    })
    await expect(client.get('/throw')).rejects.toThrow('native')
    expect(Apis.hideLoading).toHaveBeenCalledOnce()
  })
  it('rejects if the response interceptor throws instead of hanging', async () => {
    client.setInterceptor({
      ...httpInterceptor,
      response: async () => {
        throw new Error('response')
      }
    })
    const promise = client.get('/response').catch((error: unknown) => error)
    await calls[0]?.complete?.(response)
    expect(await promise).toBeInstanceOf(Error)
    expect(Apis.hideLoading).toHaveBeenCalledOnce()
  })
  it('clears a session once for parallel 401 responses without a remote logout', async () => {
    const first = client.get('/a')
    const second = client.get('/b')
    await calls[0]?.complete?.({ ...response, statusCode: 401 })
    await calls[1]?.complete?.({ ...response, statusCode: 401 })
    await Promise.all([first, second])
    expect(session.clearSession).toHaveBeenCalledOnce()
    expect(session.logout).not.toHaveBeenCalled()
    expect(router.login).toHaveBeenCalledOnce()
  })
  it('ignores an old session 401 after a new login', async () => {
    const promise = client.get('/late')
    session.tokenInfo = { token: 'new', expiresIn: 60 }
    session.validToken = 'new'
    await calls[0]?.complete?.({ ...response, statusCode: 401 })
    await promise
    expect(session.clearSession).not.toHaveBeenCalled()
    expect(router.login).not.toHaveBeenCalled()
  })
  it('cleans loading when the request interceptor throws after registration', async () => {
    client.setInterceptor({
      ...httpInterceptor,
      request: (options) => {
        httpInterceptor.request?.(options)
        throw new Error('request interceptor')
      }
    })
    await expect(client.get('/interceptor')).rejects.toThrow('request interceptor')
    expect(nativeRequest).not.toHaveBeenCalled()
    expect(Apis.hideLoading).toHaveBeenCalledOnce()
  })
  it('settles cancellation before the native task is assigned', async () => {
    nativeRequest.mockImplementationOnce((options: (typeof calls)[number]) => {
      client.options?.cancel()
      return { abort: vi.fn(() => options.complete?.(response)) }
    })
    await expect(client.get('/early-cancel')).rejects.toMatchObject({ code: -1 })
    expect(Apis.hideLoading).toHaveBeenCalledOnce()
  })
  it('does not show loading for a quiet request and settles only once', async () => {
    const complete = vi.fn()
    const promise = client.get('/quiet', undefined, { meta: { loading: false }, complete })
    await calls[0]?.complete?.(response)
    await calls[0]?.complete?.(response)
    await promise
    expect(complete).toHaveBeenCalledOnce()
    expect(Apis.showLoading).not.toHaveBeenCalled()
    expect(Apis.hideLoading).not.toHaveBeenCalled()
  })
  it('does not dispatch a request that was already cancelled', async () => {
    const options = new RequestOptions({ url: '/cancelled' })
    options.cancel()
    await expect(client.request(options)).rejects.toMatchObject({ code: -1 })
    expect(nativeRequest).not.toHaveBeenCalled()
    expect(Apis.showLoading).not.toHaveBeenCalled()
  })
  it('settles cancellation when an interceptor returns a replacement options object', async () => {
    client.setInterceptor({ request: (options) => new RequestOptions({ url: options.url }) })
    const promise = client.get('/replacement').catch((error: unknown) => error)
    client.options?.cancel()
    expect(await promise).toMatchObject({ statusCode: 0 })
  })
  it('rejects native throws after an interceptor replaces options', async () => {
    client.setInterceptor({ request: (options) => new RequestOptions({ url: options.url }) })
    nativeRequest.mockImplementationOnce(() => {
      throw new Error('replacement native error')
    })
    await expect(client.get('/replacement-throw')).rejects.toThrow('replacement native error')
  })
})
