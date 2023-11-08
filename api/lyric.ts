import type { WyCloudOptions } from '@/utils'

import type { LyricParams } from './types/lyric'

export const lyric = (data?: LyricParams): WyCloudOptions => {
  const { id } = data ?? {}

  return {
    url: 'https://music.163.com/api/song/lyric?_nmclfl=1',
    method: 'POST',
    crypto: 'api',
    data: {
      id,
      tv: -1,
      lv: -1,
      rv: -1,
      kv: -1
    }
  }
}

export const newLyric = (data?: LyricParams): WyCloudOptions => {
  const { id } = data ?? {}

  return {
    url: 'https://interface3.music.163.com/eapi/song/lyric/v1',
    method: 'POST',
    crypto: 'eapi',
    toUrl: '/api/song/lyric/v1',
    data: {
      id,
      cp: false,
      tv: 0,
      lv: 0,
      rv: 0,
      kv: 0,
      yv: 0,
      ytv: 0,
      yrv: 0
    }
  }
}
