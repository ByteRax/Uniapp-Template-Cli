// unplugin-auto-import-ignore
import type { Request } from '@/http'
import type { ShowLoadingOption, ToastIcon, ToastOption } from '@/utils/ui.ts'
import { httpInstance } from '@/http'

export class Apis {
  static get http(): Request {
    return httpInstance
  }

  static showToast(option: ToastOption, icon?: ToastIcon) {
    ui.showToast(option)
  }

  static showLoading(option: ShowLoadingOption) {
    ui.showLoading(option)
  }

  static hideLoading(isSystem: boolean = true) {
    ui.hideLoading(isSystem)
  }

  static showAlert(title: string, msg: string) {
    ui.showAlert(title, msg)
  }
}
