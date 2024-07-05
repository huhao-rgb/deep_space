import type { WyCloudOptions } from '@/utils'
import type { CloudsearchData } from './types'

export const searchDefaultKey = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://interface3.music.163.com/eapi/search/defaultkeyword/get',
    toUrl: '/api/search/defaultkeyword/get',
    crypto: 'eapi'
  }
}

export const cloudsearch = (data?: CloudsearchData): WyCloudOptions => {
  const {
    s,
    type = 1, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
    limit = 30,
    offset = 0,
    total = true
  } = data ?? {}

  return {
    method: 'POST',
    url: 'https://interface.music.163.com/eapi/cloudsearch/pc',
    toUrl: '/api/cloudsearch/pc',
    crypto: 'eapi',
    data: {
      s,
      type,
      limit,
      offset: offset * limit,
      total
    }
  }
}
