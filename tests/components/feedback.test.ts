import type { Component } from 'vue'
import type { ToastOptions } from '@wot-ui/ui/components/wd-toast/types'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { createRenderer, nextTick, ref, ssrContextKey, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as CommonUtil from '@wot-ui/ui/common/util'
import GlobalToast from '@/components/common/GlobalToast.vue'
import GlobalLoading from '@/components/common/GlobalLoading.vue'
import GlobalMessage from '@/components/common/GlobalMessage.vue'
import { useGlobalToast } from '@/composables/useGlobalToast'
import { useGlobalLoading } from '@/composables/useGlobalLoading'
import { useGlobalMessage } from '@/composables/useGlobalMessage'

const page = vi.hoisted(() => ({ path: 'pages/index/index' }))
vi.mock('@/router', () => ({ getCurrentPath: () => page.path }))

const renderer = createRenderer<object, object>({
  createElement: () => ({}),
  createText: () => ({}),
  createComment: () => ({}),
  insert: () => {},
  remove: () => {},
  setText: () => {},
  setElementText: () => {},
  parentNode: () => null,
  nextSibling: () => null,
  patchProp: () => {}
})

describe('global feedback containers', () => {
  const toast = { show: vi.fn(), loading: vi.fn(), close: vi.fn() }
  const dialog = { show: vi.fn(), close: vi.fn() }
  let unmount: (() => void) | undefined
  function mount(component: Component) {
    const app = renderer.createApp(component)
    app.config.warnHandler = () => {}
    app.provide(ssrContextKey, { modules: new Set() })
    app.mount({})
    unmount = () => app.unmount()
  }
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.useFakeTimers()
    page.path = 'pages/index/index'
    for (const [name, value] of Object.entries({ storeToRefs, ref, nextTick, watch, CommonUtil, useGlobalToast, useGlobalLoading, useGlobalMessage, useToast: () => toast, useDialog: () => dialog, getCurrentPath: () => page.path })) vi.stubGlobal(name, value)
  })
  afterEach(() => {
    unmount?.()
    unmount = undefined
    vi.useRealTimers()
  })
  it('uses one timer and ignores an older toast close callback', async () => {
    mount(GlobalToast)
    const store = useGlobalToast()
    store.show('first')
    await nextTick()
    const first = toast.show.mock.calls[0]?.[0] as ToastOptions
    expect(first.duration).toBe(0)
    store.show('second')
    await nextTick()
    first.closed?.()
    expect(store.toastOptions.msg).toBe('second')
    expect(store.toastOptions.show).toBe(true)
    unmount?.()
    unmount = undefined
    expect(store.toastOptions.show).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('keeps a page-owned loading and clears it on unmount', async () => {
    mount(GlobalLoading)
    const store = useGlobalLoading()
    store.show('first')
    await nextTick()
    const first = toast.loading.mock.calls[0]?.[0] as ToastOptions
    store.show('second')
    await nextTick()
    first.closed?.()
    expect(store.loadingOptions.msg).toBe('second')
    unmount?.()
    unmount = undefined
    expect(store.loadingOptions.show).toBe(false)
  })
  it.each(['confirm', 'cancel'] as const)('forwards a message %s result and clears its Store state', async (action) => {
    const result = { action }
    dialog.show.mockImplementationOnce(() => (action === 'confirm' ? Promise.resolve(result) : Promise.reject(result)))
    mount(GlobalMessage)
    const callback = vi.fn()
    useGlobalMessage().confirm({ title: 'test', success: callback, fail: callback })
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(callback).toHaveBeenCalledWith(result)
    expect(useGlobalMessage().messageOptions).toBeNull()
  })
  it('closes an externally dismissed message without inventing a user cancellation', async () => {
    dialog.show.mockReturnValueOnce(new Promise(() => {}))
    mount(GlobalMessage)
    const callback = vi.fn()
    useGlobalMessage().confirm({ title: 'test', success: callback, fail: callback })
    await nextTick()
    useGlobalMessage().close()
    await nextTick()
    expect(dialog.close).toHaveBeenCalled()
    expect(callback).not.toHaveBeenCalled()
  })
})
