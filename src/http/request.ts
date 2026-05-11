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

  async request<T>(options: RequestOptions): Promise<ResponseData<T>> {
    options.meta = {
      ...this.config.meta,
      ...(options.meta || {})
    }
    options.dataType = options.dataType || this.config.dataType
    options.responseType = options.responseType || this.config.responseType
    options.url = this.getUrl(options)
    options.data = options.data || {}
    options.header = Object.assign({}, this.config.header || {}, options.header || {})
    options.method = (options.method || this.config.method) as RequestOptions['method']
    options.timeout = options.timeout || this.config.timeout
    if (this.interceptor?.request) {
      this.options = await this.interceptor.request(options)
      options = this.options
    }
    return new Promise<ResponseData<T>>((resolve, reject) => {
      options.complete = async (response: any) => {
        response.config = options
        if (this.interceptor?.response) {
          const resInterceptors = await this.interceptor.response<T>(options, response)
          if (options.cancelFlag) {
            reject(resInterceptors)
          } else {
            resolve(resInterceptors)
          }
        } else {
          resolve(response)
        }
      }
      options.task = uni.request({
        ...options,
        withCredentials: true,
        enableCookie: true,
        complete: options.complete
      })
    })
  }

  /**
   * 发起上传请求，复用普通请求的 URL、meta 和拦截器处理。
   */
  async uploadFile<T>(options: RequestOptions): Promise<ResponseData<T>> {
    options.meta = {
      ...this.config.meta,
      ...(options.meta || {})
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
    if (this.interceptor?.request) {
      this.options = await this.interceptor.request(options)
      options = this.options
    }
    return new Promise<ResponseData<T>>((resolve, reject) => {
      options.complete = async (response: any) => {
        response.config = options
        if (this.interceptor?.response) {
          const resInterceptors = await this.interceptor.response<T>(options, response)
          if (options.cancelFlag) {
            reject(resInterceptors)
          } else {
            resolve(resInterceptors)
          }
        } else {
          resolve(response)
        }
      }
      options.task = uni.uploadFile({
        url: options.url,
        filePath: options.filePath || '',
        name: options.name || 'file',
        formData: options.formData,
        header: options.header,
        timeout: options.timeout,
        complete: options.complete
      })
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
