import type { App } from 'vue'
import type { IRequestOptions, RequestConfig, RequestInterceptor, ResponseData } from '@/http/types.ts'
import { httpInterceptor, httpRequestConfig } from '@/http/interceptor.ts'
import { RequestOptions } from '@/http/types.ts'

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
   * @param interceptor
   */
  setInterceptor(interceptor: RequestInterceptor) {
    this.interceptor = interceptor
  }

  /**
   * GET 请求
   * @param url 后台地址
   * @param data
   * @param options
   * @returns
   */
  get<T>(url: string, data?: Record<string, any>, options: IRequestOptions = {}) {
    const requestOptions = new RequestOptions({
      method: 'GET',
      url,
      data,
      ...options
    })
    requestOptions.meta = options.meta
    return this.request<T>(requestOptions)
  }

  /**
   * POST 请求
   * @param url 后台地址
   * @param data 请求body参数
   * @param data 请求query参数，post请求也支持query，很多微信接口都需要
   * @param options 请求头，默认为json格式
   * @returns
   */
  post<T>(url: string, data?: Record<string, any>, options: IRequestOptions = {}) {
    const requestOptions = new RequestOptions({
      method: 'POST',
      url,
      data,
      ...options
    })
    requestOptions.meta = options.meta
    return this.request<T>(requestOptions)
  }

  request<T>(options: RequestOptions): Promise<ResponseData<T>> {
    // 合并 meta 配置，优先级：单次请求 > 全局
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
      this.options = this.interceptor.request(options)
    }
    return new Promise<ResponseData<T>>((resolve, reject) => {
      options.complete = async (response: any) => {
        // 拦截器处理，加入request的配置参数
        response.config = options
        // 判断是否存在拦截器
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
      options.task = uni.request({ ...options, complete: options.complete })
    })
  }

  getUrl(options: RequestOptions): string {
    let url = ''
    if (options.url.startsWith('http')) {
      return options.url
    }
    // #ifdef H5
    if (JSON.parse(import.meta.env['VITE_APP_PROXY_ENABLE'] || 'false')) {
      // 自动拼接代理前缀
      url = (import.meta.env['VITE_APP_PROXY_PREFIX'] || '') + options.url
    } else {
      url = this.config.baseUrl + options.url
    }
    // #endif

    // 非H5正常拼接
    // #ifndef H5
    url = this.config.baseUrl + options.url
    // #endif
    return url
  }
}

// 插件化导出
export const httpInstance = new Request()

export function setupHttp(app: App<Element>) {
  httpInstance.setInterceptor(httpInterceptor)
  httpInstance.setConfig(httpRequestConfig)
  app.config.globalProperties['$http'] = httpInstance
}
