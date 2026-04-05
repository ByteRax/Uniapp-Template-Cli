import { onUnmounted } from 'vue'
import { EventNames, eventBus } from './eventBus/type'
import type { EventCallback, EventName, UseEventBusReturn } from './eventBus/type'

export function useEventBus(): UseEventBusReturn {
  // 存储当前组件注册的所有取消函数
  const unsubscribers: (() => void)[] = []

  /**
   * 自动清理版本的事件监听
   * 组件卸载时会自动清理此监听器
   */
  const on = (event: EventName, callback: EventCallback) => {
    const unsubscribe = eventBus.on(event, callback)
    unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  /**
   * 自动清理版本的一次性事件监听
   * 组件卸载时会自动清理此监听器（如果还未触发）
   */
  const once = (event: EventName, callback: EventCallback) => {
    const unsubscribe = eventBus.once(event, callback)
    unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  // 组件卸载时自动清理所有监听器
  onUnmounted(() => {
    unsubscribers.forEach((fn) => fn())
    unsubscribers.length = 0
  })

  return {
    EventNames,
    on,
    once,
    off: eventBus.off.bind(eventBus),
    emit: eventBus.emit.bind(eventBus),
    getListenerCount: eventBus.getListenerCount.bind(eventBus)
  }
}
