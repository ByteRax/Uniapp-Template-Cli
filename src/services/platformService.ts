// services/platformService.ts
import { isApp, isMp, isH5, isMpWeixin, isWechatOfficialH5, hasWeixinJSBridge } from '@/utils/platform'

/**
 * 调用微信 API（自动适配不同环境）
 */
export const callWechatAPI = async <T>(apiName: string, params: Record<string, any> = {}): Promise<T> => {
  // 微信小程序
  if (isMpWeixin) {
    return new Promise((resolve, reject) => {
      // oxlint-disable-next-line typescript/ban-ts-comment
      // @ts-ignore
      wx[apiName]({
        ...params,
        success: resolve,
        fail: reject
      })
    })
  }

  // 微信公众号 H5
  if (isWechatOfficialH5) {
    // 确保 JSBridge 就绪
    if (!hasWeixinJSBridge()) {
      await new Promise<void>((resolve) => {
        document.addEventListener('WeixinJSBridgeReady', () => resolve(), { once: true })
      })
    }

    return new Promise((resolve, reject) => {
      // oxlint-disable-next-line typescript/ban-ts-comment
      // @ts-ignore
      wx[apiName]({
        ...params,
        success: resolve,
        fail: reject
      })
    })
  }

  throw new Error(`当前环境不支持微信 API: ${apiName}`)
}

/**
 * 打开地图导航
 */
export const openMapNavigation = (latitude: number, longitude: number, name: string, address: string) => {
  if (isApp || isMp) {
    uni.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18
    })
    return
  }

  if (isH5) {
    // H5 打开高德地图网页版
    const url = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodeURIComponent(name)}&coordinate=gaode&callnative=1`
    window.open(url, '_blank')
  }
}
