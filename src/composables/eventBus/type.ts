/**
 * 统一事件名称常量
 */
export const EventNames = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_PROFILE_UPDATED: 'USER_PROFILE_UPDATED',
  NETWORK_STATUS_CHANGED: 'NETWORK_STATUS_CHANGED'
} as const

/**
 * 事件名称类型
 */
export type EventName = (typeof EventNames)[keyof typeof EventNames]

/**
 * 事件回调函数类型
 */
export interface EventCallback {
  (...args: any[]): void
}

/**
 * 事件映射表类型
 */
interface EventMap {
  [key: string]: EventCallback[]
}

/**
 * useEventBus 返回值类型
 */
export interface UseEventBusReturn {
  EventNames: typeof EventNames
  on: (event: EventName, callback: EventCallback) => () => void
  once: (event: EventName, callback: EventCallback) => () => void
  off: (event: EventName, callback?: EventCallback) => void
  emit: (event: EventName, ...args: any[]) => boolean
  getListenerCount: (event: EventName) => number
}

/**
 * EventBus 类
 */
class EventBus {
  private events: EventMap = {}

  /**
   * 监听事件
   * @param event 事件名称
   * @param callback 事件回调函数
   * @returns 返回取消监听的函数
   */
  on(event: EventName, callback: EventCallback): () => void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
    return () => this.off(event, callback)
  }

  /**
   * 移除事件监听
   * @param event 事件名称
   * @param callback 可选，指定的回调函数，不传则移除该事件的所有监听器
   */
  off(event: EventName, callback?: EventCallback): void {
    if (!this.events[event]) return

    if (callback) {
      const index = this.events[event].indexOf(callback)
      if (index > -1) {
        this.events[event].splice(index, 1)
        // 如果该事件没有监听器了，删除事件键
        if (this.events[event].length === 0) {
          delete this.events[event]
        }
      }
    } else {
      delete this.events[event]
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给监听器的参数
   * @returns 返回是否成功执行（无错误）
   */
  emit(event: EventName, ...args: any[]): boolean {
    if (!this.events[event] || this.events[event].length === 0) {
      return false
    }

    // 复制回调数组，防止在遍历时修改
    const callbacks = [...this.events[event]]
    let hasError = false

    callbacks.forEach((callback) => {
      try {
        callback(...args)
      } catch (error) {
        console.error(`事件 ${event} 的回调执行出错:`, error)
        hasError = true
      }
    })

    return !hasError
  }

  /**
   * 只监听一次事件
   * @param event 事件名称
   * @param callback 事件回调函数
   * @returns 返回取消监听的函数
   */
  once(event: EventName, callback: EventCallback): () => void {
    const onceWrapper = (...args: any[]) => {
      callback(...args)
      this.off(event, onceWrapper)
    }
    return this.on(event, onceWrapper)
  }

  /**
   * 获取指定事件的监听器数量
   * @param event 事件名称
   * @returns 监听器数量
   */
  getListenerCount(event: EventName): number {
    return this.events[event]?.length || 0
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.events = {}
  }
}

// 全局事件总线实例（单例）
export const eventBus = new EventBus()
