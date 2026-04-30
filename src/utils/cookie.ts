export type CookieInput = Record<string, string> | [string, string][]
/**
 * 批量生成符合 HTTP 请求头标准的 Cookie 字符串
 * @param cookies 键值对对象 或 二维数组
 * @returns 拼接好的 Cookie 字符串，如 "token=abc; lang=zh"
 */
export const buildUniRequestCookieString = (cookies: CookieInput): string => {
  let cookiePairs: string[] = []
  // 统一将输入转化为数组进行处理
  if (Array.isArray(cookies)) {
    cookiePairs = cookies.map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
  } else {
    cookiePairs = Object.entries(cookies).map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
  }
  // 使用 "; " 进行连接，这是 HTTP 请求头中多 Cookie 的强制规范
  return cookiePairs.join('; ')
}

// 定义 Cookie 设置选项的接口
export interface CookieOptions {
  expires?: number | Date | string
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// ==========================================
// 2. 函数具体实现
// ==========================================
export function setCookie(nameOrObject: string | Record<string, string>, valueOrOptions?: string | CookieOptions, options?: CookieOptions): void {
  let itemsToSet: Record<string, string>
  let configOptions: CookieOptions = {}

  // 核心逻辑：判断是批量设置还是单个设置
  if (typeof nameOrObject === 'object' && nameOrObject !== null) {
    // 批量设置模式
    itemsToSet = nameOrObject
    configOptions = (valueOrOptions as CookieOptions) || {}
  } else {
    // 单个设置模式
    itemsToSet = { [nameOrObject]: valueOrOptions as string }
    configOptions = options || {}
  }

  // 遍历并写入 Cookie
  Object.entries(itemsToSet).forEach(([name, value]) => {
    if (typeof value !== 'string') {
      console.warn(`Cookie 值必须为字符串，键名 "${name}" 的值被忽略。`)
      return // 跳过非字符串的值，保证代码健壮性
    }

    // 基础 URI 编码
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    // 处理过期时间
    if (configOptions.expires) {
      if (typeof configOptions.expires === 'number') {
        const expiresDate = new Date()
        expiresDate.setTime(expiresDate.getTime() + configOptions.expires * 24 * 60 * 60 * 1000)
        cookieString += `; expires=${expiresDate.toUTCString()}`
      } else if (configOptions.expires instanceof Date) {
        cookieString += `; expires=${configOptions.expires.toUTCString()}`
      } else if (typeof configOptions.expires === 'string') {
        cookieString += `; expires=${configOptions.expires}`
      }
    }

    // 其他配置项
    cookieString += `; path=${configOptions.path || '/'}`
    if (configOptions.domain) cookieString += `; domain=${configOptions.domain}`
    if (configOptions.secure) cookieString += '; secure'
    if (configOptions.sameSite) cookieString += `; samesite=${configOptions.sameSite}`

    document.cookie = cookieString
  })
}
