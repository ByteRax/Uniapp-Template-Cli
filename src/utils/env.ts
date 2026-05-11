/** 是否为开发环境（Vite 运行时） */
export const isDev = import.meta.env.DEV

/** 是否为生产环境（Vite 运行时） */
export const isProd = import.meta.env.PROD

/** 是否为调试环境，当前与开发环境保持一致 */
export const isDebug = isDev
