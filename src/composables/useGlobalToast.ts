import type { ToastOptions } from '@wot-ui/ui/components/wd-toast/types'
import { defineStore } from 'pinia'
import { onScopeDispose, ref } from 'vue'
import { getCurrentPath } from '@/router'

const defaultOptions: ToastOptions = { duration: 2000, show: false }

export const useGlobalToast = defineStore('global-toast', () => {
  const toastOptions = ref<ToastOptions>({ ...defaultOptions })
  const currentPage = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  function clearTimer() {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
  }
  function close() {
    clearTimer()
    toastOptions.value = { ...defaultOptions }
    currentPage.value = ''
  }
  function show(option: ToastOptions | string) {
    clearTimer()
    currentPage.value = getCurrentPath()
    const options = { ...defaultOptions, ...(typeof option === 'string' ? { msg: option } : option) }
    toastOptions.value = { ...options, show: true, position: options.position || 'middle' }
    if (options.duration && options.duration > 0) timer = setTimeout(close, options.duration)
  }
  function success(option: ToastOptions | string) {
    show({ iconName: 'success', duration: 1500, ...(typeof option === 'string' ? { msg: option } : option) })
  }
  function error(option: ToastOptions | string) {
    show({ iconName: 'error', direction: 'vertical', ...(typeof option === 'string' ? { msg: option } : option) })
  }
  function info(option: ToastOptions | string) {
    show({ iconName: 'info', ...(typeof option === 'string' ? { msg: option } : option) })
  }
  function warning(option: ToastOptions | string) {
    show({ iconName: 'warning', ...(typeof option === 'string' ? { msg: option } : option) })
  }
  onScopeDispose(clearTimer)
  return { toastOptions, currentPage, show, success, error, info, warning, close }
})
