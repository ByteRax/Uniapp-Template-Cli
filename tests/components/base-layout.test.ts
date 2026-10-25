import { createRenderer, nextTick, ssrContextKey } from 'vue'
import { describe, expect, it } from 'vitest'
import BaseLayout from '@/components/layout/BaseLayout.vue'

interface Node {
  text: string
  children: Node[]
  props: Record<string, unknown>
}
const node = (): Node => ({ text: '', children: [], props: {} })
const renderer = createRenderer<Node, Node>({
  createElement: node,
  createText: (text) => ({ ...node(), text }),
  createComment: node,
  insert: (child, parent) => {
    if (!parent.children.includes(child)) parent.children.push(child)
  },
  remove: () => {},
  setText: (el, text) => {
    el.text = text
  },
  setElementText: (el, text) => {
    el.text = text
  },
  parentNode: () => null,
  nextSibling: () => null,
  patchProp: (el, key, _prev, value) => {
    el.props[key] = value
  }
})

describe('BaseLayout retry', () => {
  for (const result of ['success', 'error'] as const) {
    it(`preserves a synchronous ${result} result`, async () => {
      const root = node()
      const app = renderer.createApp(BaseLayout)
      app.provide(ssrContextKey, { modules: new Set() })
      app.config.warnHandler = () => {}
      const layout = app.mount(root) as unknown as BaseLayoutRef
      layout.showError('initial', () => (result === 'success' ? layout.showSuccess() : layout.showError('retry failed', () => {})))
      await nextTick()
      const instance = (layout as unknown as { $: { setupState: { handleRetry: () => void; success: boolean; state: { errorStr: string } } } }).$.setupState
      instance.handleRetry()
      await nextTick()
      expect(instance.success).toBe(result === 'success')
      if (result === 'error') expect(instance.state.errorStr).toBe('retry failed')
      app.unmount()
    })
  }
  it('stays loading until an asynchronous retry finishes', async () => {
    const app = renderer.createApp(BaseLayout)
    app.config.warnHandler = () => {}
    app.provide(ssrContextKey, { modules: new Set() })
    const layout = app.mount(node()) as unknown as BaseLayoutRef
    let finish: (() => void) | undefined
    const response = new Promise<void>((resolve) => {
      finish = resolve
    })
    layout.showError('initial', () => {
      void response.then(() => layout.showSuccess())
    })
    const state = (layout as unknown as { $: { setupState: { handleRetry: () => void; success: boolean; state: { showLoading: boolean } } } }).$.setupState
    state.handleRetry()
    expect(state.state.showLoading).toBe(true)
    finish?.()
    await response
    await nextTick()
    expect(state.success).toBe(true)
    app.unmount()
  })
})
