import type {
  AxiosRequestConfig,
  AxiosInterceptorManager,
  AxiosResponse
} from 'axios'
import axios from 'axios'

type HttpAxiosInterceptorRequestManager<D = any> = AxiosInterceptorManager<AxiosRequestConfig<D>>
type HttpAxiosInterceptorResponseManager = AxiosInterceptorManager<AxiosResponse>

export type HttpAxiosRequestConfig<D = any> = AxiosRequestConfig<D> & {
  // 自定义请求拦截器
  interceptorsRequest?: (manager: HttpAxiosInterceptorRequestManager<D>) => void
  interceptorsResponse?: (manager: HttpAxiosInterceptorResponseManager) => void
}

export type Response<T> = {
  msg?: string
  code: string
  data: T
}

export class Http {
  private options
  private instance

  constructor (options: HttpAxiosRequestConfig) {
    this.options = options
    this.instance = axios.create(this.options)

    // 初始化拦截器
    this._initInterceptors(this.options)
  }

  private _initInterceptors (options: HttpAxiosRequestConfig) {
    const {
      interceptorsRequest,
      interceptorsResponse
    } = options

    const { request, response } = this.instance.interceptors

    interceptorsRequest
      ? interceptorsRequest(request)
      : this._interceptorsRequest(request)
    interceptorsResponse
      ? interceptorsResponse(response)
      : this._interceptorsResponse(response)
  }

  private _interceptorsRequest (manager: HttpAxiosInterceptorRequestManager) {
    manager.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  private _interceptorsResponse (manager: HttpAxiosInterceptorResponseManager) {
    manager.use(
      (response) => response,
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  public request <T>(): Promise<Response<T>> {
    return new Promise((resolve, reject) => {
      this.instance.request(this.options).then()
    })
  }
}

// 初始化一个通用请求实例
// T 自定义的返回数据，D 自定义请求参数
const requset = <T = any, D = any>(options: HttpAxiosRequestConfig<D>) => {
  return new Http(options).request<T>()
}

export default requset
