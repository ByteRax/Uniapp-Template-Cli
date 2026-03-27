import type { App } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync
    }
  })
)
// 立即激活 Pinia 实例, 这样即使在 app.use(stores)之前调用 stores 也能正常工作 （解决APP端白屏问题）
setActivePinia(store)

export function setupStore(app: App<Element>) {
  app.use(store)
}
export default store
