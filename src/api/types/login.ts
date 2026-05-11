// 单Token响应类型
export interface ISingleTokenRes {
  token: string
  expiresIn: number // 有效期(秒)
}

/**
 * 登录返回的信息，其实就是 token 信息
 */
export type IAuthLoginRes = ISingleTokenRes

/**
 * 登录表单
 */
export interface ILoginForm {
  username: string
  password: string
}

/**
 * 用户信息
 */
export interface IUserInfoRes {
  userId: number
  name: string
  nickname: string
  avatar?: string
  [key: string]: any // 允许其他扩展字段
}
