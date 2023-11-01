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
  toUrl?: string
  method: Method
  crypto: CryptoType
  realIP?: string
  cookie?: AnyObject
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

// 网易云请求加密
export const wyCloudEncode = (options: WyCloudOptions) => {
  const {
    url,
    method,
    crypto,
    realIP,
    cookie,
    data
  } = options

  const headers: AnyObject = {}
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

    const musicAMmkv = mmkvDefaultStorage.getString(ANONYMOUS_TOKEN)

    if (cookie.MUSIC_U) header['MUSIC_U'] = cookie.MUSIC_U
    // if (musicAMmkv) header['MUSIC_A'] = cookie.MUSIC_A ?? musicAMmkv?.split('@')?.[0]
    headers['Cookie'] = Object.keys(header)
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(header[key]),
      )
      .join('; ')
    requestData.header = header
    // 当crypto为eapi时，需要传递toUrl字段
    requestData = eapi(options.toUrl!, requestData)
    requestUrl = url.replace(/\w*api/, 'eapi')
  }

  const settings: AxiosRequestConfig = {
    method,
    url: requestUrl,
    headers,
    proxy: false,
    data: new URLSearchParams(requestData).toString()
  }

  if (crypto === 'eapi') {
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
      answer.body = JSON.parse(Buffer.from(data).toString())
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
