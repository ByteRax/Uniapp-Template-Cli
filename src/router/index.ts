import type { App } from 'vue'
import { routeInterceptor } from '@/router/interceptor.ts'

export function setupRoute(app: App<Element>) {
  app.use(routeInterceptor)
}

export * from './utils.ts'
