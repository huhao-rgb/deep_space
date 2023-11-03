import type { WyCloudOptions } from '@/utils'
import type { SongUrlV1Data } from './types/song'

// 歌曲链接 - v1
// 此版本不再采用 br 作为音质区分的标准
// 而是采用 standard, exhigh, lossless, hires, jyeffect(高清环绕声), sky(沉浸环绕声), jymaster(超清母带) 进行音质判断
// level === sky，需要额外传immerseType = 'c51'
export const songUrlV1 = (data?: SongUrlV1Data): WyCloudOptions => {
  const {
    ids,
    level = 'standard'
  } = data ?? {}

  console.log(`[${ids}]`)

  return {
    method: 'POST',
    url: 'https://interface.music.163.com/eapi/song/enhance/player/url/v1',
    data: {
      ids: `[${ids}]`,
      level,
      encodeType: 'flac'
    },
    crypto: 'eapi',
    cookie: {
      os: 'android',
      appver: '8.10.90'
    },
    toUrl: '/api/song/enhance/player/url/v1'
  }
}
