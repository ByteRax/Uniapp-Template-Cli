import type { IRequestOptions, IUploadRequestOptions, RequestConfig, RequestInterceptor, ResponseData } from '@/http/types.ts'
import { RequestOptions } from '@/http/types.ts'

/**
 * HTTP 请求类
 */
export class Request {
  public config: RequestConfig
  public interceptor: RequestInterceptor
  public options?: RequestOptions

  constructor() {
    this.config = {
      baseUrl: '', // 请求的根域名
      header: {}, // 默认的请求头
      method: 'POST', // 请求方式
      dataType: 'json', // 设置为json，返回后uni.request会对数据进行一次JSON.parse
      responseType: 'text', // 此参数无需处理，因为5+和支付宝小程序不支持，默认为text即可
      timeout: 60000,
      meta: {
        loading: true // 是否显示加载中
      }
    }
    this.interceptor = {}
  }

  /**
   * 设置全局默认配置
   * @param customConfig 自定义配置
   */
  setConfig(customConfig: RequestConfig): void {
    this.config = Object.assign(this.config, customConfig)
  }

  /**
   * 设置拦截器
   * @param interceptor 拦截器对象
   */
  setInterceptor(interceptor: RequestInterceptor) {
    this.interceptor = interceptor
  }

  /**
   * GET 请求
   */
  get<T>(url: string, data?: Record<string, any>, options: IRequestOptions = {}) {
    const requestOptions = new RequestOptions({
      method: 'GET',
      url,
      data,
      ...options
    })
    return this.request<T>(requestOptions)
  }

  /**
   * POST 请求
   */
  post<T>(url: string, data?: Record<string, any>, options: IRequestOptions = {}) {
    const requestOptions = new RequestOptions({
      method: 'POST',
      url,
      data,
      ...options
    })
    return this.request<T>(requestOptions)
  }

  /**
   * 文件上传
   */
  upload<T>(url: string, filePath: string, formData?: Record<string, any>, options: IUploadRequestOptions = {}) {
    const requestOptions = new RequestOptions({
      method: 'POST',
      url,
      data: formData,
      filePath,
      formData,
      name: 'file',
      ...options
    })
    return this.uploadFile<T>(requestOptions)
  }

  request<T>(options: RequestOptions): Promise<ResponseData<T>> {
    options.meta = {
      ...this.config.meta,
      ...options.meta
    }
    options.dataType = options.dataType || this.config.dataType
    options.responseType = options.responseType || this.config.responseType
    options.url = this.getUrl(options)
    options.data = options.data || {}
    options.header = Object.assign({}, this.config.header || {}, options.header || {})
    options.method = (options.method || this.config.method) as RequestOptions['method']
    options.timeout = options.timeout || this.config.timeout
    return this.sendRequest(options, (requestOptions, complete) =>
      uni.request({
        ...requestOptions,
        withCredentials: true,
        enableCookie: true,
        complete
      })
    )
  }

  /**
   * 发起上传请求，复用普通请求的 URL、meta 和拦截器处理。
   */
  async uploadFile<T>(options: RequestOptions): Promise<ResponseData<T>> {
    options.meta = {
      ...this.config.meta,
      ...options.meta
    }
    options.url = this.getUrl(options)
    options.data = options.data || {}
    options.formData = options.formData || (options.data as Record<string, any>)
    options.header = Object.assign({}, this.config.header || {}, options.header || {})
    options.method = 'POST'
    options.timeout = options.timeout || this.config.timeout
    // multipart 边界由运行时生成，避免沿用 JSON 请求头导致服务端无法解析文件。
    delete options.header['content-type']
    delete options.header['Content-Type']
    return this.sendRequest(options, (requestOptions, complete) =>
      uni.uploadFile({
        url: requestOptions.url,
        filePath: requestOptions.filePath || '',
        name: requestOptions.name || 'file',
        formData: requestOptions.formData,
        header: requestOptions.header,
        timeout: requestOptions.timeout,
        complete
      })
    )
  }

  private sendRequest<T>(initialOptions: RequestOptions, createTask: (options: RequestOptions, complete: (response: any) => void) => UniApp.RequestTask | UniApp.UploadTask): Promise<ResponseData<T>> {
    return new Promise<ResponseData<T>>((resolve, reject) => {
      let options = initialOptions
      let settled = false
      const callerComplete = initialOptions.complete
      const finish = async (response: any) => {
        if (settled) return
        settled = true
        options.onCancel = undefined
        try {
          this.interceptor.complete?.(options)
          response.config = options
          const result = this.interceptor.response ? await this.interceptor.response<T>(options, response) : response
          callerComplete?.(response)
          if (options.cancelFlag) reject(result)
          else resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      const onCancel = () => {
        void finish({ statusCode: 0, data: '', header: {}, cookies: [], errMsg: 'request:fail abort' })
      }

      options.onCancel = onCancel
      if (options.cancelFlag) {
        onCancel()
        return
      }

      void (async () => {
        try {
          if (this.interceptor.request) options = await this.interceptor.request(options)
          this.options = options
          if (settled) return
          options.onCancel = onCancel
          options.complete = finish
          options.task = createTask(options, finish)
          if (options.cancelFlag) options.task.abort()
        } catch (error) {
          if (!settled) {
            settled = true
            options.onCancel = undefined
            try {
              this.interceptor.complete?.(options)
            } finally {
              reject(error)
            }
          }
        }
      })()
    })
  }

  getUrl(options: RequestOptions): string {
    let url = ''
    if (options.url.startsWith('http')) {
      return options.url
    }
    // #ifdef H5
    if (import.meta.env['VITE_APP_PROXY_ENABLE'] === 'true') {
      url = (import.meta.env['VITE_APP_PROXY_PREFIX'] || '') + options.url
    } else {
      url = this.config.baseUrl + options.url
    }
    // #endif

    // #ifndef H5
    url = this.config.baseUrl + options.url
    // #endif
    return url
  }
}

// 插件化导出
export const httpInstance = new Request()
