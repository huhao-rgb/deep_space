/**
 * 网易云api接口，请求核心逻辑来自 https://github.com/Binaryify/NeteaseCloudMusicApi
 * useWymApi接受一个参数，该参数为请求方法，返回一个实例对象
 * 返回的实例对象中可以传入请求参数，以及fetch配置项
 * 项目运行逻辑： 加入缓存机制，将上次的请求的结果进行缓存，可以设置缓存时间
 * 接口方法：单独配置，使用时引入传给useWymApi hooks，hooks内部做逻辑处理
 */
import { useMemo } from 'react'

// 请求的方式
export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// 加密的方式
export type CryptoType = 'weapi' | 'linuxapi' | 'eapi'

export interface WymApiOptions {
  url: string
  method?: FetchMethod
  crypto: CryptoType
  proxy?: any
  realIP?: string
  baseURL?: string
}

type UA = 'mobile' | 'pc' | undefined

export const HOST = 'https://music.163.com'

const chooseUserAgent = (ua: UA) => {
  const userAgentList = {
    mobile: [
      // iOS 13.5.1 14.0 beta with safari
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.',
      // iOS with qq micromsg
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML like Gecko) Mobile/14A456 QQ/6.5.7.408 V1_IPH_SQ_6.5.7_1_APP_A Pixel/750 Core/UIWebView NetType/4G Mem/103',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f27) NetType/WIFI Language/zh',
      // Android -> Huawei Xiaomi
      'Mozilla/5.0 (Linux; Android 9; PCT-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.64 HuaweiBrowser/10.0.3.311 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; U; Android 9; zh-cn; Redmi Note 8 Build/PKQ1.190616.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.141 Mobile Safari/537.36 XiaoMi/MiuiBrowser/12.5.22',
      // Android + qq micromsg
      'Mozilla/5.0 (Linux; Android 10; YAL-AL00 Build/HUAWEIYAL-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2581 MMWEBSDK/200801 Mobile Safari/537.36 MMWEBID/3027 MicroMessenger/7.0.18.1740(0x27001235) Process/toolsmp WeChat/arm64 NetType/WIFI Language/zh_CN ABI/arm64',
      'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BKK-AL10 Build/HONORBKK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.6 Mobile Safari/537.36',
    ],
    pc: [
      // macOS 10.15.6  Firefox / Chrome / Safari
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
      // Windows 10 Firefox / Chrome / Edge
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
      // Linux 就算了
    ],
  }
  const realUserAgentList =
    ua
      ? userAgentList[ua]
      : userAgentList.mobile.concat(userAgentList.pc)

  return ['mobile', 'pc', undefined].indexOf(ua) > -1
    ? realUserAgentList[Math.floor(Math.random() * realUserAgentList.length)]
    : ua
}

export const useWymApi = (options: WymApiOptions, cacheTime?: number) => {
  const headers = useMemo(
    () => {
      const {
        url,
        method = 'POST',
        crypto,
        proxy,
        realIP,
        baseURL = HOST
      } = options

      const fetchHeaders: Record<string, any> = {}

      if (method === 'POST') fetchHeaders['Content-Type'] = 'application/x-www-form-urlencoded'
      if (baseURL.includes('music.163.com')) headers.Referer = 'https://music.163.com'

      return fetchHeaders
    },
    [options]
  )

  const fetchInstance = fetch('', {})
}
