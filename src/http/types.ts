/**
 * 请求配置项Meta类型定义
 */
export interface RequestMeta {
  // 是否显示loading
  loading?: boolean
  // 是否跳过 401 时的 logout / 跳登录页副作用
  skipUnauthorizedLogout?: boolean
  // 是否跳过自动刷新 token
  skipTokenRefresh?: boolean
  // 鉴权失败后是否已经自动重试过一次
  authRetried?: boolean
  // 请求唯一标识
  requestKey?: string
  [key: string]: any
}

/**
 * 请求配置项类型定义
 */
export interface RequestConfig {
  baseUrl?: string
  header?: Record<string, any>
  method?: string
  dataType?: string
  responseType?: string
  timeout: number
  meta?: RequestMeta
}

export type IRequestOptions = Omit<UniApp.RequestOptions, 'url'> & {
  url?: string
  header?: Record<string, any>
  meta?: RequestMeta
  timeout?: number
}

/** 文件上传请求配置，沿用 HTTP 拦截器补齐鉴权和设备信息。 */
export interface IUploadRequestOptions {
  /** 自定义请求头。 */
  header?: Record<string, any>
  /** 单次请求 meta 控制项。 */
  meta?: RequestMeta
  /** 上传超时时间。 */
  timeout?: number
}

/** 内部请求配置，兼容普通请求和上传请求的运行时字段。 */
type RequestOptionsInit = IRequestOptions &
  Record<string, any> & {
    filePath?: string
    formData?: Record<string, any>
    name?: string
  }

/**
 * 请求参数类型定义
 */
export class RequestOptions implements IRequestOptions {
  url: string = ''
  header: Record<string, any> = {}
  data?: string | AnyObject | ArrayBuffer | Record<string, any>
  filePath?: string
  formData?: Record<string, any>
  name?: string
  complete?: (response: any) => void
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

  dataType?: string
  responseType?: string
  timeout?: number
  meta?: RequestMeta
  task?: UniApp.RequestTask | UniApp.UploadTask
  cancelFlag?: boolean // 取消请求的标记，如果task已经取消，则此标志位为true 否则false

  constructor(options: RequestOptionsInit) {
    Object.assign(this, options)
  }

  /**
   * 取消请求
   */
  cancel() {
    if (this.cancelFlag) {
      return
    }
    this.cancelFlag = true
    this.task?.abort()
  }
}

/**
 * 请求拦截器类型定义
 */
export interface RequestInterceptor {
  request?: (options: RequestOptions) => RequestOptions | Promise<RequestOptions>
  response?: <T = any>(options: RequestOptions, response: ResponseResult) => Promise<ResponseData<T>>
}

export interface ResponseResult extends UniApp.RequestSuccessCallbackResult {
  config: RequestOptions
  errMsg?: string
}

export class ResponseData<T> {
  code: number = 0
  msg: string = ''
  data?: T
  request?: RequestOptions
  constructor(code?: number, msg?: string, data?: T) {
    this.code = code ?? 0
    this.msg = msg ?? ''
    this.data = data
  }

  isOK(showTips: boolean = true, showDialog: boolean = false, defaultMessage: string = '') {
    const success = this.code === 0
    if (!success && showTips) {
      let errorMsg = this.msg
      if (isEmpty(errorMsg)) {
        errorMsg = defaultMessage
      }
      if (isNotEmpty(errorMsg)) {
        if (showDialog) {
          Apis.showAlert('提示', errorMsg)
        } else {
          Apis.showToast({
            icon: 'error',
            title: errorMsg
          })
        }
      }
    }
    return success
  }
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 分页响应数据
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
