/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, any>
  export default component
}

interface ImportMetaEnv {
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string
  /** 服务端口号 */
  readonly VITE_APP_PORT: string
  /** UniApp 应用 appid */
  readonly VITE_UNI_APPID: string
  /** 微信小程序 appid */
  readonly VITE_WX_APPID: string
  /** 国际化兜底语言 */
  readonly VITE_FALLBACK_LOCALE: string
  /** H5 public base */
  readonly VITE_APP_PUBLIC_BASE: string
  /** 后台接口地址 */
  readonly VITE_SERVER_BASEURL: string
  /** 可选请求头 AppKey */
  readonly VITE_APP_KEY?: string
  /** H5 代理开关 */
  readonly VITE_APP_PROXY_ENABLE?: 'true' | 'false'
  /** H5 代理前缀 */
  readonly VITE_APP_PROXY_PREFIX?: string
  /** 用户态构建模式标识 */
  readonly VITE_USER_NODE_ENV?: 'development' | 'test' | 'production'
  /** 是否去除 console/debugger */
  readonly VITE_DELETE_CONSOLE?: 'true' | 'false'
  /** 是否开启 sourcemap */
  readonly VITE_SHOW_SOURCEMAP?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __UNI_PLATFORM__: 'app' | 'h5' | 'mp-alipay' | 'mp-baidu' | 'mp-kuaishou' | 'mp-lark' | 'mp-qq' | 'mp-tiktok' | 'mp-weixin' | 'mp-xiaochengxu'
declare const __APP_VERSION__: string
declare const __APP_BUILD_DATE__: string
declare const __APP_GIT_HASH__: string
declare const __VITE_APP_PROXY__: 'true' | 'false'
