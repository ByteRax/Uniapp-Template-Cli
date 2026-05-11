import type { PageMetaDatum } from '@uni-helper/vite-plugin-uni-pages'
import { pages } from '@/pages.json' with { type: 'json' }
import { getLastPage } from '@/router'
/**
 * 首页路径，通过 page.json 里面的 type 为 home 的页面获取，如果没有，则默认是第一个页面
 * 通常为 /pages/index/index
 */
export const HOME_PAGE = `/${(pages as PageMetaDatum[]).find((page) => page.type === 'home')?.path || (pages as PageMetaDatum[])[0]?.path || 'pages/index/index'}`

export const LOGIN_PAGE: _LocationUrl = '/pages-sub/login/login'

export const NOT_FOUND_PAGE: _LocationUrl = '/pages-sub/404/index'

const LOCK_KEY = '__router_lock__'
let lastUrl: string | string.PageURIString = ''
let lastAt = 0

export default {
  push(options: UniApp.NavigateToOptions | _LocationUrl | string, isReplace: boolean = false) {
    const url = typeof options === 'string' ? options : options.url
    const now = Date.now()

    // 300ms 内重复跳同一地址，直接拦截
    if (now - lastAt < 300 && url === lastUrl) {
      console.warn('[router] blocked duplicate:', url)
      return
    }

    const app = getApp<{ globalData: Record<string, any> }>()
    if (app.globalData[LOCK_KEY]) {
      console.warn('[router] locked, ignore:', url)
      return
    }
    app.globalData[LOCK_KEY] = true

    lastUrl = url
    lastAt = now

    const done = () => {
      app.globalData[LOCK_KEY] = false
    }
    const fail = (e: any) => {
      console.error('[router] fail:', url, e)
    }

    if (isReplace) {
      uni.redirectTo({
        url,
        complete: done,
        ...(typeof options === 'object' ? options : {})
      })
    } else {
      uni.navigateTo({
        url,
        complete: done,
        fail,
        ...(typeof options === 'object' ? options : {})
      })
    }
  },
  home() {
    this.push(
      {
        url: HOME_PAGE
      },
      true
    )
  },
  notFound() {
    this.push({
      url: NOT_FOUND_PAGE
    })
  },
  /**
   * 查询参数
   * @example '?redirect=/pages/home/index'
   */
  login(queryString: string = '') {
    const url = `${LOGIN_PAGE}${queryString}`
    // 获取当前页面路径
    const currentPage = getLastPage()
    const currentPath = `/${currentPage.route}`
    // 如果已经在登录页，则不跳转
    if (currentPath === LOGIN_PAGE) {
      return
    }
    this.push({
      url
    })
  }
}
