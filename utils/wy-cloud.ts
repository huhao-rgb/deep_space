/**
 * 网易云音乐接口请求数据的包装
 * 核心逻辑来自 https://github.com/Binaryify/NeteaseCloudMusicApi
 */
import Crypto from 'react-native-quick-crypto'

import type {
  AxiosResponse,
  AxiosRequestConfig,
  Method
} from 'axios'

import Constants from 'expo-constants'

import { mmkvDefaultStorage } from './mmkv'
import {
  weapi,
  eapi,
  linuxapi,
  decrypt
} from './crypto'

import { ANONYMOUS_TOKEN } from '@/constants'

type UA = 'mobile' | 'pc' | undefined

export type AnyObject = Record<string, any>

// 加密的方式
export type CryptoType = 'weapi' | 'linuxapi' | 'eapi' | 'api'

export interface WyCloudOptions <T extends Record<string, any> = {}> {
  url: string // 这个是完整的路径，带域名的
  method: Method
  crypto: CryptoType
  realIP?: string
  cookie?: AnyObject
  ua?: UA
  data?: T
}

export interface Response <T = any> {
  code: number
  data: T
  message: string
}

export interface WyCloudDecodeAnswer <T> {
  status: number
  body: T
  cookie: string[]
}

const TAG = 'ReqestCookie'

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
    ]
  }
  const realUserAgentList =
    ua
      ? userAgentList[ua]
      : userAgentList.mobile.concat(userAgentList.pc)

  return ['mobile', 'pc', undefined].indexOf(ua) > -1
    ? realUserAgentList[Math.floor(Math.random() * realUserAgentList.length)]
    : ua
}

// 网易云请求加密
export const wyCloudEncode = (options: WyCloudOptions) => {
  const {
    url,
    method,
    crypto,
    realIP,
    cookie,
    ua,
    data
  } = options

  const headers: AnyObject = { 'User-Agent': chooseUserAgent(ua) }
  let requestData: AnyObject = { ...data }
  let requestUrl: string = url

  if (method.toUpperCase() === 'POST') headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (url.includes('music.163.com')) headers.Referer = 'https://music.163.com'

  if (realIP) {
    headers['X-Real-IP'] = realIP
    headers['X-Forwarded-For'] = realIP
  }

  if (cookie) {
    const cookies: AnyObject = {
      ...cookie,
      __remember_me: true,
      _ntes_nuid: Buffer.from(Crypto.randomBytes(16)).toString('hex')
    }

    if (url.indexOf('login') === -1) {
      cookies.NMTID = Buffer.from(Crypto.randomBytes(16)).toString('hex')
    }

    if (!cookie.MUSIC_U) {
      // 游客
      if (!cookie.MUSIC_A) {
        const musicAMmkv = mmkvDefaultStorage.getString(ANONYMOUS_TOKEN)
        cookies.MUSIC_A = musicAMmkv?.split('@')?.[0]
        cookies.os = cookie.os ?? 'ios'
        cookies.appver = cookie.appver ?? '8.10.90'
      }
    }

    headers['Cookie'] = Object.keys(cookies)
      .map(
        (key) =>
          encodeURIComponent(key) +
          '=' +
          encodeURIComponent(cookies[key]),
      )
      .join('; ')
  } else {
    headers.Cookie = '__remember_me=true; NMTID=xxx'
  }

  if (crypto === 'weapi') {
    headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69'
    const csrfToken = (headers['Cookie'] || '').match(/_csrf=([^(;|$)]+)/)

    requestData.csrf_token = csrfToken ? csrfToken[1] : ''
    requestData = weapi(requestData)
    requestUrl = url.replace(/\w*api/, 'weapi')
  } else if (crypto === 'linuxapi') {
    requestData = linuxapi({
      method,
      url: url.replace(/\w*api/, 'api'),
      params: data,
    })
    headers['User-Agent'] =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
    requestUrl = 'https://music.163.com/api/linux/forward'
  } else if (crypto === 'eapi') {
    const cookie = options.cookie || {}
    const csrfToken = cookie['__csrf'] || ''
    const header: AnyObject = {
      osver: cookie.osver, //系统版本
      deviceId: cookie.deviceId, //encrypt.base64.encode(imei + '\t02:00:00:00:00:00\t5106025eb79a5247\t70ffbaac7')
      appver: cookie.appver || '8.9.70', // app版本
      versioncode: cookie.versioncode || '140', //版本号
      mobilename: cookie.mobilename, //设备model
      buildver: cookie.buildver || Date.now().toString().substr(0, 10),
      resolution: cookie.resolution || '1920x1080', //设备分辨率
      __csrf: csrfToken,
      os: cookie.os || 'android',
      channel: cookie.channel,
      requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, '0')}`,
    }
    if (cookie.MUSIC_U) header['MUSIC_U'] = cookie.MUSIC_U
    if (cookie.MUSIC_A) header['MUSIC_A'] = cookie.MUSIC_A
    headers['Cookie'] = Object.keys(header)
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(header[key]),
      )
      .join('; ')
    requestData.header = header
    requestData = eapi(options.url, requestData)
    requestUrl = url.replace(/\w*api/, 'eapi')
  }

  const settings: AxiosRequestConfig = {
    method,
    url: requestUrl,
    headers: headers,
    proxy: false,
    data: new URLSearchParams(requestData).toString()
  }

  if (crypto === 'eapi') {
    settings.encoding = null
    settings.responseType = 'arraybuffer'
  }

  return settings
}

// 网易云响应解密
export const wyCloudDecode = (crypto: CryptoType, response: AxiosResponse) => {
  const answer: WyCloudDecodeAnswer<any> = {
    status: 500,
    body: {},
    cookie: []
  }

  const { status, data, headers } = response
  answer.cookie = (headers['set-cookie'] || [])
    .map((x) => x.replace(/\s*Domain=[^(;|$)]+;*/, ''))

  try {
    if (crypto === 'eapi') {
      answer.body = JSON.parse(decrypt(data).toString())
    } else {
      answer.body = data
    }

    if (data.code) answer.body.code = Number(data.code)
    answer.status = Number(data.code || status)

    if (
      [201, 302, 400, 502, 800, 801, 802, 803].indexOf(answer.body.code) >
      -1
    ) {
      // 特殊状态码
      answer.status = 200
    }
  } catch (e) {
    // console.log(e)
    try {
      answer.body = JSON.parse(data.toString())
    } catch (err) {
      // console.log(err)
      // can't decrypt and can't parse directly
      answer.body = data
    }
    answer.status = status
  }

  answer.status =
    100 < answer.status && answer.status < 600 ? answer.status : 400

  return answer
}

export const wyCloudCookieToJson = (cookie: string) => {
  if (!cookie) return {}
  const cookieArr = cookie.split(';')
  const obj: AnyObject = {}
  cookieArr.forEach((i) => {
    let arr = (i.trim()).split('=')
    obj[arr[0]] = arr[1]
  })
  return obj
}
