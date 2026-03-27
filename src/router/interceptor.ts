/**
 * 路由拦截，通常也是登录拦截
 */
import { getAllPages, getLastPage, parseUrlToObj } from '@/router'
import { HOME_PAGE, LOGIN_PAGE } from '@/router/router.ts'
import { useToken } from '@/stores/useToken.ts'

export const FG_LOG_ENABLE = false

export function judgeIsNeedLoginPath(path: string) {
  const allExcludeLoginPages = getAllPages('needLogin') // dev 环境下，需要每次都重新获取，否则新配置就不会生效
  return allExcludeLoginPages.some((page) => page.path === path)
}

export const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  // 增加对相对路径的处理，BY 网友 @ideal
  invoke({ url, query }: { url: string; query?: Record<string, string> }) {
    if (url === undefined) {
      return
    }
    let { path, query: _query } = parseUrlToObj(url)
    if (FG_LOG_ENABLE) console.log('\n\n路由拦截器:-------------------------------------')
    if (FG_LOG_ENABLE) console.log('路由拦截器 1: url->', url, ', query ->', query)
    const myQuery = { ..._query, ...query }
    // /pages/route-interceptor/index?name=feige&age=30
    if (FG_LOG_ENABLE) console.log('路由拦截器 2: path->', path, ', _query ->', _query)
    if (FG_LOG_ENABLE) console.log('路由拦截器 3: myQuery ->', myQuery)
    // 处理相对路径
    if (!path?.startsWith('/')) {
      const currentPath = getLastPage()?.route || ''
      const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
      const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
      path = `${baseDir}/${path}`
    }
    // 处理路由不存在的情况
    if (path !== '/' && !getAllPages().some((page) => `/${page.path}` === path)) {
      console.warn('路由不存在:', path)
      router.notFound()
      return false // 明确表示阻止原路由继续执行
    }
    const tokenStore = useToken()
    if (FG_LOG_ENABLE) console.log('tokenStore.hasLogin:', tokenStore.hasLogin())
    // 不管黑白名单，登录了就直接去吧（但是当前不能是登录页）
    if (tokenStore.hasLogin()) {
      if (path !== LOGIN_PAGE) {
        return true // 明确表示允许路由继续执行
      } else {
        console.log('已经登录，但是还在登录页', myQuery['redirect'])
        const url = myQuery['redirect'] || HOME_PAGE
        uni.navigateTo({ url }).then()
        return false // 明确表示阻止原路由继续执行
      }
    }
    let fullPath = path
    if (Object.keys(myQuery).length) {
      fullPath += `?${Object.keys(myQuery)
        .map((key) => `${key}=${myQuery[key]}`)
        .join('&')}`
    }
    const redirectQuery = `?redirect=${encodeURIComponent(fullPath)}`
    if (judgeIsNeedLoginPath(path)) {
      if (FG_LOG_ENABLE) console.log('2 isNeedLogin(黑名单策略) url:', fullPath)
      router.login(redirectQuery)
      return false // 修改为false，阻止原路由继续执行
    }
    return true // 明确表示允许路由继续执行
  }
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)
  }
}
