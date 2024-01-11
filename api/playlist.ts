import type { WyCloudOptions } from '@/utils'
import type {
  PlaylistDetailData,
  PlaylistTrackAllData,
  TopPlaylistData
} from './types/playlist'

export const playlistDetail = (data?: PlaylistDetailData): WyCloudOptions => {
  const {
    id,
    s = 8
  } = data ?? {}

  return {
    method: 'POST',
    url: 'https://music.163.com/api/v6/playlist/detail',
    data: {
      id,
      n: 100000,
      s
    },
    crypto: 'api'
  }
}

/**
 * 获取歌曲详情，或者歌单里面的歌曲
 * 支持传入多条，格式： { c: '[{ id: 'xxx' }, { id: 'xxx' }]' }
 */
export const playlistTrackAll = (data?: PlaylistTrackAllData): WyCloudOptions => {
  const {
    ids = []
  } = data ?? {}

  return {
    method: 'POST',
    url: 'https://music.163.com/api/v3/song/detail',
    crypto: 'weapi',
    data: ids && { c: `[${ids.map(id => `{"id":${id}}`).join(',')}]` },
    cookie: {}
  }
}

// 全部歌单分类
export const playlistCatlist = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://music.163.com/weapi/playlist/catalogue',
    crypto: 'weapi'
  }
}

// 歌单 ( 网友精选碟 )
export const topPlaylist = (data?: TopPlaylistData): WyCloudOptions => {
  const DEFAULT_CAT = '全部'

  const {
    order = 'hot',
    cat = DEFAULT_CAT,
    ...params
  } = data ?? {}

  return {
    method: 'POST',
    url: 'https://music.163.com/weapi/playlist/list',
    crypto: 'weapi',
    data: {
      order,
      cat: cat.indexOf(DEFAULT_CAT) !== -1 ? DEFAULT_CAT : cat,
      ...params
    }
  }
}
