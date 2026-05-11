import { createSSRApp } from 'vue'
import { setupHttp } from '@/http'
import { setupRoute } from '@/router'
import { setupStore } from '@/stores'
import App from './App.vue'
import 'virtual:uno.css'
import '@/styles/common.scss'
import '@/styles/variable.scss'

export function createApp() {
  const app = createSSRApp(App)
  // 挂载状态管理
  setupStore(app)
  // 路由拦截器
  setupRoute(app)
  // 网络请求
  setupHttp(app)
  return {
    app
  }
}

uni.$zp = {
  config: {
    // 配置分页默认pageSize为20
    'default-page-size': 20,
    // 配置空数据图默认描述文字为：空空如也~~
    'empty-view-text': '空空如也~~',
    'safe-area-inset-bottom': true,
    'use-safe-area-placeholder': true
  }
}
