import type { App } from 'vue'
import { httpInterceptor, httpRequestConfig } from '@/http/interceptor.ts'
import { httpInstance } from './request.ts'

export { httpInstance, Request } from './request.ts'

export function setupHttp(app: App<Element>) {
  httpInstance.setInterceptor(httpInterceptor)
  httpInstance.setConfig(httpRequestConfig)
  app.config.globalProperties['$http'] = httpInstance
}
