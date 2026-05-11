import type { ToastOptions } from '@wot-ui/ui/components/wd-toast/types'

import { defineStore } from 'pinia'

interface GlobalLoading {
  loadingOptions: ToastOptions
  currentPage: string
}

const defaultOptions: ToastOptions = {
  show: false
}
export const useGlobalLoading = defineStore('global-loading', {
  state: (): GlobalLoading => ({
    loadingOptions: defaultOptions,
    currentPage: ''
  }),
  getters: {},
  actions: {
    // 加载提示
    loading(option: ToastOptions | string = '加载中...') {
      this.currentPage = getCurrentPath()
      this.loadingOptions = CommonUtil.deepMerge(
        {
          iconName: 'loading',
          loadingType: 'circular',
          loadingColor: '#777777',
          duration: 0,
          cover: true,
          position: 'middle',
          direction: 'vertical',
          show: true
        },
        typeof option === 'string' ? { msg: option } : option
      ) as ToastOptions
    },
    show(option: ToastOptions | string = '加载中...') {
      this.loading(option)
    },
    // 关闭Toast
    close() {
      this.loadingOptions = defaultOptions
      this.currentPage = ''
    }
  }
})
