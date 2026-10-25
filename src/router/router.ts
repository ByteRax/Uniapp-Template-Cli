import type { PageMetaDatum } from '@uni-helper/vite-plugin-uni-pages'
import { pages } from '@/pages.json' with { type: 'json' }
import { getCurrentPage } from '@/router/utils.ts'

/**
 * 首页路径，通过 page.json 里面的 type 为 home 的页面获取，如果没有，则默认是第一个页面
 * 通常为 /pages/index/index
 */
export const HOME_PAGE = `/${(pages as PageMetaDatum[]).find((page) => page['type'] === 'home')?.path || (pages as PageMetaDatum[])[0]?.path || 'pages/index/index'}`

export const LOGIN_PAGE: _LocationUrl = '/pages-sub/login/login'

export const NOT_FOUND_PAGE: _LocationUrl = '/pages-sub/404/index'

const LOCK_KEY = '__router_lock__'
let lastUrl: string | string.PageURIString = ''
let lastAt = 0

export default {
  push(options: UniApp.NavigateToOptions | _LocationUrl | string, isReplace: boolean = false, isRedirect: boolean = false) {
    const url = typeof options === 'string' ? options : options.url
    const now = Date.now()

    // 300ms 内重复跳同一地址，直接拦截
    if (now - lastAt < 300 && url === lastUrl) {
      console.warn('[router] blocked duplicate:', url)
      return
    }

    const app = getApp<{ globalData: Record<string, any> }>()
    if (app.globalData[LOCK_KEY] && !isRedirect) {
      console.warn('[router] locked, ignore:', url)
      return
    }
    app.globalData[LOCK_KEY] = true

    lastUrl = url
    lastAt = now

    let finished = false
    const done = () => {
      if (finished) return
      finished = true
      app.globalData[LOCK_KEY] = false
    }
    const callbacks: Partial<UniApp.NavigateToOptions> = typeof options === 'object' ? options : {}
    const navigationOptions: UniApp.NavigateToOptions = {
      ...callbacks,
      url,
      success(res) {
        done()
        callbacks.success?.(res)
      },
      fail(res) {
        done()
        console.error('[router] fail:', url, res)
        callbacks.fail?.(res)
      },
      complete(res) {
        done()
        callbacks.complete?.(res)
      }
    }
    try {
      if (isReplace) uni.redirectTo(navigationOptions)
      else uni.navigateTo(navigationOptions)
    } catch (error) {
      done()
      throw error
    }
  },
  home() {
    this.push({ url: HOME_PAGE }, true)
  },
  notFound() {
    this.push({ url: NOT_FOUND_PAGE }, false, true)
  },
  /**
   * 查询参数
   * @example '?redirect=/pages/home/index'
   */
  login(queryString: string = '') {
    const url = `${LOGIN_PAGE}${queryString}`
    const currentPath = `/${getCurrentPage()?.route || ''}`
    if (currentPath === LOGIN_PAGE) return

    // 登录页使用 replace，避免回退到需要登录的页面；内部重定向可覆盖当前导航锁。
    this.push({ url }, true, true)
  },
  aiChat() {
    this.push({
      url: '/pages-sub/ai/chat'
    })
  }
}
