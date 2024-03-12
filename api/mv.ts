import type { WyCloudOptions } from '@/utils'

import type {
  MvDetailData,
  MvUrlData
} from './types/mv'

/**
 * 获取 mv 数据
 * 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 , 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
 * { id: xx } 必选参数id: mv 的 id
 */
export const mvDetail = (data?: MvDetailData): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://music.163.com/api/v1/mv/detail',
    crypto: 'weapi',
    data
  }
}

/**
 * 获取 mv 点赞转发评论数数据
 * 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 点赞转发评论数数据
 * { id: xx } 必选参数id: mv 的 id
 */
export const mvDetailInfo = (data?: MvDetailData): WyCloudOptions => {
  const { id } = data ?? {}

  return {
    method: 'POST',
    url: 'https://music.163.com/api/comment/commentthread/info',
    crypto: 'weapi',
    data: {
      threadid: `R_MV_5_${id}`,
      composeliked: true
    }
  }
}

/**
 * 调用此接口 , 传入 mv id,可获取 mv 播放地址
 * 必选参数id: mv 的 id
 * 可选参数 : r: 分辨率,默认 1080,可从 /mv/detail 接口获取分辨率列表
 */
export const mvUrl = (data?: MvUrlData): WyCloudOptions => {
  const {
    id,
    r = 1080
  } = data ?? {}

  return {
    method: 'POST',
    url: 'https://music.163.com/weapi/song/enhance/play/mv/url',
    crypto: 'weapi',
    data: { id, r }
  }
}
