import type { ToastOptions } from '@wot-ui/ui/components/wd-toast/types'
import { isShowLoadingOptions, isToastOptions } from '@/utils/is.ts'
import { getValue } from '@/utils/object.ts'

export type ToastIcon = 'success' | 'loading' | 'error' | 'none' | 'fail' | 'exception'
export type ToastOption = UniApp.ShowToastOptions | ToastOptions | string
export type ShowLoadingOption = UniApp.ShowLoadingOptions | ToastOptions | string
export default {
  /**
   * 显示消息提示框
   * 兼容 uni.showToast 和 Wot Design Toast
   * @param option 提示内容或配置项
   */
  showToast(option: ToastOption, icon?: ToastIcon) {
    if (isToastOptions(option)) {
      uni.showToast(option).then()
    } else if (typeof option === 'string') {
      uni.showToast({ title: option, icon }).then()
    } else {
      useGlobalToast().show(option)
    }
  },

  /**
   * 显示加载提示框
   * 兼容 uni.showLoading 和 Wot Design Loading
   * @param option 加载提示内容或配置项
   */
  showLoading(option: ShowLoadingOption) {
    if (isShowLoadingOptions(option)) {
      uni.showLoading(option).then()
    } else if (typeof option === 'string') {
      uni.showLoading({ title: option }).then()
    } else {
      useGlobalLoading().loading(option)
    }
  },

  hideLoading(isSystem: boolean = true) {
    if (isSystem) {
      uni.hideLoading()
    } else {
      useGlobalLoading().close()
    }
  },

  showAlert(title: string, msg: string) {
    useGlobalMessage().alert({
      title,
      msg
    })
  },

  /**
   * 兼容微信小程序端获取系统信息的方法
   * 在微信小程序端使用新的API替代getSystemInfoSync，在其他端仍然使用getSystemInfoSync
   * @returns 系统信息对象
   */
  getSystemInfo(): UniApp.GetSystemInfoResult {
    let systemInfo: UniApp.GetSystemInfoResult
    // #ifdef MP-WEIXIN
    try {
      // const systemSetting = uni.getSystemSetting() // 暂时不需要
      const deviceInfo = uni.getDeviceInfo()
      const windowInfo = uni.getWindowInfo()
      const appBaseInfo = uni.getAppBaseInfo()
      systemInfo = {
        browserName: '',
        browserVersion: '',
        osName: deviceInfo.platform,
        osVersion: getValue(deviceInfo, 'osVersion', ''),
        ua: '',
        uniCompileVersion: getValue(appBaseInfo, 'uniCompileVersion', ''),
        uniPlatform: getValue(appBaseInfo, 'uniPlatform', ''),
        uniRuntimeVersion: getValue(appBaseInfo, 'uniRuntimeVersion', ''),
        ...deviceInfo,
        ...windowInfo,
        ...appBaseInfo
      }
    } catch (error) {
      console.warn('获取系统信息失败，降级使用uni.getSystemInfoSync:', error)
      // 降级处理，使用原来的方法
      systemInfo = uni.getSystemInfoSync()
    }
    // #endif
    // #ifndef MP-WEIXIN
    systemInfo = uni.getSystemInfoSync()
    // #endif
    return systemInfo
  }
}
