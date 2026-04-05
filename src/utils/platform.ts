/**
 * 平台类型
 */
export type PlatformType = 'app' | 'mp-weixin' | 'mp-alipay' | 'mp-toutiao' | 'mp-baidu' | 'mp-qq' | 'h5' | 'quickapp-webview' | ''
export const platform = __UNI_PLATFORM__ //当前平台标识字符串
const isH5Platform = __UNI_PLATFORM__ === 'h5'
export const isApp = __UNI_PLATFORM__ === 'app' //是否 App 平台
export const isMp = __UNI_PLATFORM__.startsWith('mp-') //是否小程序平台
export const isMpWeixin = __UNI_PLATFORM__.startsWith('mp-weixin') //是否微信小程序
export const isMpAlipay = __UNI_PLATFORM__.startsWith('mp-alipay') //是否支付宝小程序
export const isMpToutiao = __UNI_PLATFORM__.startsWith('mp-toutiao') //是否头条/抖音小程序
export const isHarmony = __UNI_PLATFORM__.startsWith('app-harmony') //是否是鸿蒙系统
/**
 * 安全的 User Agent 检测 - 兼容所有平台
 */
const safeGetUserAgent = (): string => {
  // 小程序环境没有 navigator，返回空字符串
  if (isMp || isApp) {
    return ''
  }

  // H5 环境才获取 navigator.userAgent
  try {
    return typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent.toLowerCase() : ''
  } catch (error) {
    console.warn('获取 userAgent 失败:', error)
    return ''
  }
}

// 判断是否在微信公众号内的H5
export const isWechatOfficialH5 = (() => {
  if (__UNI_PLATFORM__ !== 'h5') return false

  const ua = safeGetUserAgent()
  // 包含 micromessenger 但不包含 miniprogram（排除小程序 webview）
  return ua.includes('micromessenger') && !ua.includes('miniprogram')
})()

// 判断是否在支付宝内的H5
export const isAlipayOfficialH5 = (() => {
  if (__UNI_PLATFORM__ !== 'h5') return false

  const ua = safeGetUserAgent()
  return ua.includes('alipayclient')
})()

// 普通H5 (排除在微信、支付宝等容器内的H5)
const isH5 = __UNI_PLATFORM__ === 'h5' && !isWechatOfficialH5 && !isAlipayOfficialH5

// 检测特定浏览器
const ua = safeGetUserAgent()

// 检测 iOS Safari
const isIOSSafari = ua.includes('iphone') && ua.includes('safari') && !ua.includes('crios')

// 检测 Chrome
const isChrome = ua.includes('chrome') && !ua.includes('edg')

// 检测移动端
const isMobileUA = /mobile|android|iphone|ipad|ipod/.test(ua)

/**
 * 检查是否在微信环境中
 * 微信小程序	isMpWeixin === true	true
 * 微信公众号H5	UA 含 micromessenger	true
 * 微信内置浏览器	UA 含 micromessenger	true
 * App 内嵌微信	需要额外配置	false
 * 其他环境	-	false
 */
export const isWechatEnvironment = (): boolean => {
  // 微信小程序
  if (isMpWeixin) {
    return true
  }

  // H5 环境检查 User Agent
  if (__UNI_PLATFORM__ === 'h5') {
    const ua = safeGetUserAgent()
    return ua.includes('micromessenger')
  }

  // APP 环境暂时返回 false
  return false
}

/**
 * 检查是否在支付宝环境中 - 兼容所有平台
 */
export const isAlipayEnvironment = (): boolean => {
  // 支付宝小程序
  if (isMpAlipay) {
    return true
  }

  // H5 环境检查 User Agent
  if (__UNI_PLATFORM__ === 'h5') {
    const ua = safeGetUserAgent()
    return ua.includes('alipayclient')
  }

  return false
}

// 判断是否是任意 H5 环境
const isAnyH5 = isH5 || isWechatOfficialH5 || isAlipayOfficialH5

/**
 * 安全的 WeixinJSBridge 检测 - 仅 H5 环境有效
 */
export const hasWeixinJSBridge = (): boolean => {
  // 非 H5 环境直接返回 false
  if (__UNI_PLATFORM__ !== 'h5') {
    return false
  }

  try {
    // oxlint-disable-next-line typescript/ban-ts-comment
    // @ts-ignore
    return typeof window !== 'undefined' && typeof window['WeixinJSBridge'] !== 'undefined'
  } catch (error) {
    return false
  }
}

/**
 * 检查是否在开发环境或微信开发者工具中
 */
export const isInDevTools = (): boolean => {
  // 小程序环境的开发者工具判断
  if (isMp) {
    try {
      // #ifdef MP
      const accountInfo = uni.getAccountInfoSync()
      return accountInfo.miniProgram.envVersion === 'develop'
      // #endif
    } catch (error) {
      console.warn('获取小程序环境信息失败:', error)
    }
    return false
  }

  // APP 环境通常没有开发者工具的概念
  if (isApp) {
    return false
  }

  // H5 环境的开发者工具判断 - 主要检测微信开发者工具
  if (__UNI_PLATFORM__ === 'h5') {
    const ua = safeGetUserAgent()

    // 检查是否在微信开发者工具中
    if (ua.includes('wechatdevtools')) {
      return true
    }

    // 检查是否在支付宝开发者工具中
    if (ua.includes('alipaydevtools')) {
      return true
    }
  }

  return false
}

/**
 * 判断是否是移动设备
 */
export const isMobileDevice = (): boolean => {
  if (!isH5) {
    // 非 H5 环境（App、小程序）都是移动端
    return true
  }

  // H5 环境通过 User Agent 判断
  const ua = navigator.userAgent.toLowerCase()
  return /mobile|android|iphone|ipad|ipod|blackberry|windows phone/.test(ua)
}

/**
 * 获取设备类型
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isTabletDevice()) return 'tablet'
  if (isMobileDevice()) return 'mobile'
  return 'desktop'
}

/**
 * 判断是否是平板设备
 */
export const isTabletDevice = (): boolean => {
  if (!isH5) {
    const systemInfo = uni.getSystemInfoSync()
    // 根据屏幕尺寸判断
    return systemInfo.screenWidth >= 768
  }

  const ua = navigator.userAgent.toLowerCase()
  return /ipad|android(?!.*mobile)/.test(ua)
}

/**
 * 获取操作系统类型
 */
export const getOSType = (): 'ios' | 'android' | 'other' => {
  // 小程序和 App 使用 uni API
  if (!isH5) {
    const systemInfo = uni.getSystemInfoSync()
    const platform = systemInfo.platform?.toLowerCase() || ''

    if (platform === 'ios' || platform.includes('iphone')) {
      return 'ios'
    }
    if (platform === 'android') {
      return 'android'
    }
    return 'other'
  }

  // H5 使用 User Agent
  const ua = navigator.userAgent.toLowerCase()

  if (/iphone|ipad|ipod|ios/.test(ua)) {
    return 'ios'
  }
  if (/android/.test(ua)) {
    return 'android'
  }

  return 'other'
}

/**
 * 判断是否是 Android 设备
 */
export const isAndroid = getOSType() === 'android'

/**
 * 判断是否是 iOS 设备
 */
export const isIOS = getOSType() === 'ios'

const PLATFORM = {
  platform,
  isH5,
  isAnyH5,
  isApp,
  isMp,
  isMpWeixin,
  isMpAlipay,
  isMpToutiao,
  isHarmony,
  isWechatOfficialH5,
  isAlipayOfficialH5,
  hasWeixinJSBridge,
  isInDevTools,
  isMobileDevice,
  getDeviceType,
  isTabletDevice,
  getOSType,
  isAndroid,
  isIOS,
  ua,
  isIOSSafari,
  isChrome,
  isMobileUA
}
export default PLATFORM
