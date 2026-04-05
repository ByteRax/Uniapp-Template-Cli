// composables/usePlatformAdapter.ts
import { isApp, isMp, isH5, isMpWeixin, isMpAlipay, isWechatOfficialH5, isAlipayOfficialH5 } from '@/utils/platform'

export const usePlatformAdapter = () => {
  /**
   * 获取当前平台名称（用于显示）
   */
  const getPlatformName = (): string => {
    if (isApp) return 'App'
    if (isMpWeixin) return '微信小程序'
    if (isMpAlipay) return '支付宝小程序'
    if (isWechatOfficialH5) return '微信公众号'
    if (isAlipayOfficialH5) return '支付宝生活号'
    if (isH5) return 'H5网页'
    return '未知平台'
  }

  /**
   * 是否支持某个功能
   */
  const isFeatureSupported = (feature: string): boolean => {
    const featureMap: Record<string, boolean> = {
      'scan': isApp || isMp,
      'share': isApp || isMpWeixin || isMpAlipay,
      'pay-wechat': isApp || isMpWeixin || isWechatOfficialH5,
      'pay-alipay': isApp || isMpAlipay || isAlipayOfficialH5,
      'location': isApp || isMp || isH5,
      'camera': isApp || isMp,
      'bluetooth': isApp || isMp,
      'nfc': isApp,
      'push': isApp
    }
    return featureMap[feature] ?? false
  }

  /**
   * 获取功能不可用的提示
   */
  const getUnsupportedMessage = (feature: string): string => {
    const messages: Record<string, string> = {
      'scan': '当前环境不支持扫码功能',
      'share': '当前环境不支持分享功能',
      'pay-wechat': '当前环境不支持微信支付',
      'pay-alipay': '当前环境不支持支付宝支付',
      'camera': '当前环境不支持相机功能'
    }
    return messages[feature] ?? '当前环境不支持此功能'
  }

  return {
    getPlatformName,
    isFeatureSupported,
    getUnsupportedMessage,
    // 直接暴露常量
    isApp,
    isMp,
    isH5,
    isMpWeixin,
    isMpAlipay,
    isWechatOfficialH5,
    isAlipayOfficialH5
  }
}
