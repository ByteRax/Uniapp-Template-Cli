/**
 * 函数防抖
 * 防抖确保在指定时间内多次调用只执行最后一次，适用于搜索输入、表单验证等。
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number = 300, immediate: boolean = false): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = function (this: any, ...args: Parameters<T>) {
    // oxlint-disable-next-line typescript/no-this-alias
    const context = this
    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)

    if (callNow) func.apply(context, args)
  }

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

/**
 * 函数节流
 * 节流确保在指定时间内函数最多执行一次，适用于滚动、鼠标移动等高频事件。
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, wait: number = 300, options: { leading?: boolean; trailing?: boolean } = {}): ((...args: Parameters<T>) => ReturnType<T>) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0
  let args: Parameters<T> | null = null
  let context: any = null

  const leading = options.leading !== false
  const trailing = options.trailing !== false

  const throttled = function (this: any, ...currentArgs: Parameters<T>) {
    const now = Date.now()
    // oxlint-disable-next-line typescript/no-this-alias
    context = this
    args = currentArgs

    if (!previous && !leading) previous = now

    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
      context = args = null
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0
        timeout = null
        // oxlint-disable-next-line typescript/ban-ts-comment
        // @ts-ignore
        func.apply(context, args)
        context = args = null
      }, remaining)
    }
  }

  throttled.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    previous = 0
    args = context = null
  }

  return throttled as unknown as (...args: Parameters<T>) => ReturnType<T>
}
