export type CookieInput = Record<string, string> | [string, string][]

/**
 * 批量生成符合 HTTP 请求头标准的 Cookie 字符串。
 */
export const buildUniRequestCookieString = (cookies: CookieInput): string => {
  let cookiePairs: string[] = []
  if (Array.isArray(cookies)) {
    cookiePairs = cookies.map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
  } else {
    cookiePairs = Object.entries(cookies).map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
  }
  return cookiePairs.join('; ')
}

export interface CookieOptions {
  expires?: number | Date | string
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export function setCookie(nameOrObject: string | Record<string, string>, valueOrOptions?: string | CookieOptions, options?: CookieOptions): void {
  let itemsToSet: Record<string, string>
  let configOptions: CookieOptions = {}

  if (typeof nameOrObject === 'object' && nameOrObject !== null) {
    itemsToSet = nameOrObject
    configOptions = (valueOrOptions as CookieOptions) || {}
  } else {
    itemsToSet = { [nameOrObject]: valueOrOptions as string }
    configOptions = options || {}
  }

  Object.entries(itemsToSet).forEach(([name, value]) => {
    if (typeof value !== 'string') {
      console.warn(`Cookie 值必须为字符串，键名 "${name}" 的值被忽略。`)
      return
    }

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

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

    cookieString += `; path=${configOptions.path || '/'}`
    if (configOptions.domain) cookieString += `; domain=${configOptions.domain}`
    if (configOptions.secure) cookieString += '; secure'
    if (configOptions.sameSite) cookieString += `; samesite=${configOptions.sameSite}`

    document.cookie = cookieString
  })
}
