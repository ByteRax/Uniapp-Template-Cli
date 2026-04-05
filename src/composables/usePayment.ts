// src/composables/usePayment.ts

import PLATFORM from '@/utils/platform.ts'

/**
 * 检查当前平台是否支持微信支付
 */
const isWechatPaySupported = (): boolean => {
  return PLATFORM.isMpWeixin || PLATFORM.isWechatOfficialH5 || PLATFORM.isApp
}

/**
 * 检查当前平台是否支持支付宝支付
 */
const isAlipayPaySupported = (): boolean => {
  return PLATFORM.isMpAlipay || PLATFORM.isAlipayOfficialH5 || PLATFORM.isH5 || PLATFORM.isApp
}

/**
 * 检查当前平台是否支持余额支付
 */
const isBalancePaySupported = (): boolean => {
  return true // 所有平台都支持余额支付
}
