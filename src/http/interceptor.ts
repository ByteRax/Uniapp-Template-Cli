import type { RequestConfig, RequestInterceptor, RequestMeta, RequestOptions, ResponseResult } from '@/http/types.ts'
import { ResponseData } from '@/http/types.ts'
import router from '@/router/router.ts'
import { userStore } from '@/stores/userStore.ts'
import { buildUniRequestCookieString, setCookie } from '@/utils/cookie.ts'
import { isDebug } from '@/utils/env.ts'
import { parse, stringify } from '@/utils/json.ts'
import ui from '@/utils/ui.ts'

// 请求基准地址
const baseUrl = import.meta.env.VITE_SERVER_BASEURL
// 应用标识
const appKey = import.meta.env.VITE_APP_KEY
// 队列请求数
let requestNum = 0
// 重复请求
const pendingRequests = new Map<string, RequestOptions>()
// 401 logout lock: prevent concurrent 401 responses from triggering multiple logouts
let isLoggingOut = false
// 并发 token 刷新共用同一个 Promise，避免重复刷新
let refreshTokenPromise: Promise<boolean> | null = null

type TokenStoreReturn = ReturnType<typeof userStore>

function hasRefreshCapability(store: TokenStoreReturn): store is TokenStoreReturn & {
  refreshToken: () => Promise<ResponseData<unknown>>
} {
  return typeof (store as any).refreshToken === 'function'
}

function hasRefreshToken(store: TokenStoreReturn) {
  const tokenInfo = store.tokenInfo as unknown as { refreshToken?: string } | undefined
  return isNotEmpty(tokenInfo?.refreshToken)
}

async function refreshAccessToken() {
  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      const tokenStore = userStore()
      if (!hasRefreshCapability(tokenStore) || !hasRefreshToken(tokenStore)) {
        return false
      }
      const refreshRes = await tokenStore.refreshToken()
      return refreshRes.isOK(false) && isNotEmpty(tokenStore.validToken)
    })().finally(() => {
      refreshTokenPromise = null
    })
  }

  return refreshTokenPromise
}

async function logoutAndRedirectToLogin() {
  if (isLoggingOut) {
    return
  }
  isLoggingOut = true
  try {
    const tokenStore = userStore()
    await tokenStore.logout()
    router.login()
  } finally {
    isLoggingOut = false
  }
}

function debugLogResponse(options: RequestOptions, response: ResponseResult, detailResult: unknown, isSuccess: boolean, message?: string) {
  if (!isDebug) {
    return
  }

  const titleColor = isSuccess ? '#16a34a' : '#dc2626'
  const titleStatus = isSuccess ? 'SUCCESS' : 'ERROR'
  console.groupCollapsed(`%c[HTTP ${titleStatus}] ${options.method || 'GET'} ${options.url}`, `color: ${titleColor}; font-weight: 600;`)
  console.log('请求URL:', options.url)
  console.log('请求参数:', options.data)
  console.log('详情结果:', detailResult)
  if (message) {
    console.log('响应消息:', message)
  }
  console.groupEnd()
}

function addLoading() {
  requestNum++
  if (requestNum === 1) {
    Apis.showLoading('加载中...')
  }
}

function removeLoading() {
  requestNum = Math.max(0, requestNum - 1)
  if (requestNum === 0) {
    Apis.hideLoading()
  }
}

// 全局配置
export const httpRequestConfig: RequestConfig = {
  baseUrl,
  header: {
    'content-type': 'application/json'
  },
  timeout: 30 * 1000,
  meta: {
    originalData: false,
    toast: true,
    loading: true
  }
}

// 请求/响应拦截器
export const httpInterceptor: RequestInterceptor = {
  // 请求拦截器
  request: async (options: RequestOptions) => {
    const sys = ui.getSystemInfo()
    const meta: RequestMeta = options.meta || {}
    const { url, method, data } = options
    const requestKey = `${method}_${url}_${stringify(data)}`
    // 存在相同请求则取消前一个
    if (pendingRequests.has(requestKey)) {
      const previousRequest = pendingRequests.get(requestKey)
      previousRequest?.cancel()
    }
    pendingRequests.set(requestKey, options)
    meta.requestKey = requestKey
    if (meta.loading) addLoading()
    const tokenStore = userStore()
    if (!meta.skipTokenRefresh && !meta.skipUnauthorizedLogout && !tokenStore.hasLogin() && isNotEmpty(tokenStore.validToken)) {
      try {
        const refreshed = await refreshAccessToken()
        if (!refreshed && hasRefreshToken(tokenStore)) {
          await logoutAndRedirectToLogin()
          throw new Error('登录已过期，请重新登录')
        }
      } catch (error) {
        if (meta.loading) removeLoading()
        pendingRequests.delete(requestKey)
        await logoutAndRedirectToLogin()
        throw error
      }
    }
    const token = tokenStore.validToken
    if (token) {
      options.header['Authorization'] = `Bearer ${token}`
    }
    if (appKey) {
      options.header['AppKey'] = appKey
    }
    if (sys.appVersion) {
      options.header['Version'] = sys.appVersion
    }
    const deviceInfo = {
      platform: String(sys.uniPlatform ?? ''),
      os: `${sys.osName ?? ''}_${sys.osVersion ?? ''}`,
      device: `${sys.deviceBrand ?? ''}_${sys.deviceModel ?? ''}`,
      did: String(sys.deviceId ?? '')
    }
    // #ifdef H5
    setCookie(deviceInfo, {
      expires: 30,
      secure: true,
      sameSite: 'strict'
    })
    // #endif
    // #ifndef H5
    options.header['Cookie'] = buildUniRequestCookieString(deviceInfo)
    // #endif
    return options
  },
  // 响应拦截器
  response: async <T>(options: RequestOptions, response: ResponseResult) => {
    const meta: RequestMeta = response.config?.meta || {}
    if (meta.loading) removeLoading()
    pendingRequests.delete(meta.requestKey ?? '')
    if (options.cancelFlag) {
      return new ResponseData<T>(-1, '取消请求')
    }
    const { statusCode, data } = response
    const responseData = new ResponseData<T>()
    let responseMsg = ''
    let responseCode = -1

    // 401 未授权：清除登录状态并跳转登录页（防并发重复触发）
    if (statusCode === 401) {
      if (!meta.skipUnauthorizedLogout) {
        await logoutAndRedirectToLogin()
      }
      const expiredMessage = '登录已过期，请重新登录'
      debugLogResponse(options, response, data, false, expiredMessage)
      return new ResponseData<T>(-1, expiredMessage)
    }

    if (statusCode === 200) {
      // originalData 模式：直接返回原始响应数据，不做业务码解析
      if (meta['originalData']) {
        responseData.code = 0
        responseData.data = parse<T>(data as string) ?? undefined
        responseData.request = options
        debugLogResponse(options, response, responseData.data, true)
        return responseData
      }
      const dataObj = parse<any>(data)
      if (dataObj) {
        responseCode = dataObj?.errorCode ?? dataObj?.code ?? -1
        responseMsg = dataObj?.errorMsg ?? dataObj?.message ?? '业务异常'
        responseData.data = typeof dataObj?.data === 'string' ? parse(dataObj?.data) : dataObj?.data
        debugLogResponse(options, response, dataObj, responseCode === 0, responseMsg)
      }
    } else {
      responseMsg = handleNetworkError(statusCode, '')
      debugLogResponse(options, response, data, false, responseMsg)
    }
    responseData.code = responseCode
    responseData.msg = responseMsg
    responseData.request = options

    // toast 模式：业务码非成功时自动提示错误信息
    if (meta['toast'] && responseCode !== 0 && responseMsg) {
      Apis.showToast({ icon: 'error', title: responseMsg })
    }

    return responseData
  }
}

function handleNetworkError(status: number, defaultMessage: string) {
  if (defaultMessage) {
    return defaultMessage
  }
  let message = '未知错误'
  if (status) {
    switch (status) {
      case 400:
        message = '请求错误(400)'
        break
      case 401:
        message = '未授权，请重新登录(401)'
        break
      case 403:
        message = '拒绝访问(403)'
        break
      case 404:
        message = '请求出错(404)'
        break
      case 405:
        message = '方法不允许(405)'
        break
      case 408:
        message = '请求超时(408)'
        break
      case 500:
        message = '服务器错误(500)'
        break
      case 501:
        message = '服务未实现(501)'
        break
      case 502:
        message = '网络错误(502)'
        break
      case 503:
        message = '服务不可用(503)'
        break
      case 504:
        message = '网络超时(504)'
        break
      case 505:
        message = 'HTTP版本不受支持(505)'
        break
      default:
        message = `连接出错(${status})!`
    }
  } else {
    message = '无法连接到服务器！'
  }

  return message
}
