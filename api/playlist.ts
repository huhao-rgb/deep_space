import type { WyCloudOptions } from '@/utils'

export const playlistDetail = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://music.163.com/api/v6/playlist/detail',
    data: { n: 100000, s: 8 },
    crypto: 'api',
  }
}

export const playlistTrackAll = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://music.163.com/api/v3/song/detail',
    crypto: 'weapi'
  }
}
