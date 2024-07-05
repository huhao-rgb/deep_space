import type { WyCloudOptions } from '@/utils'

import { SortType } from './types/comment'
import type {
  CommentMusicData,
  CommentNewData,
  CommentFloorData,
  CommentMvData
} from './types/comment'

// 歌曲评价
export const commentMusic = (data: CommentMusicData): WyCloudOptions => {
  const {
    rid,
    limit = 20,
    offset = 0,
    beforeTime = 0
  } = data ?? {}

  return {
    method: 'POST',
    url: `https://music.163.com/api/v1/resource/comments/R_SO_4_${rid}`,
    crypto: 'weapi',
    cookie: { os: 'pc' },
    data: {
      rid,
      limit,
      offset,
      beforeTime
    }
  }
}

const resourceTypeMap = {
  0: 'R_SO_4_',
  1: 'R_MV_5_',
  2: 'A_PL_0_',
  3: 'R_AL_3_',
  4: 'A_DJ_1_',
  5: 'R_VI_62_',
  6: 'A_EV_2_',
  7: 'A_DR_14_'
}

export const commentNew = (data?: CommentNewData): WyCloudOptions => {
  const {
    type,
    id,
    showInner = true,
    pageSize = 20,
    pageNo = 1,
    sortType = SortType.RECOMMEND,
    cursor
  } = data ?? {}

  let newCursor = ''
  switch (sortType) {
    case SortType.RECOMMEND:
      newCursor = `${(pageNo - 1) * pageSize}`
      break
    case SortType.HEAT:
      newCursor = 'normalHot#' + (pageNo - 1) * pageSize
      break
    case SortType.TIME:
      newCursor = cursor || '0'
      break
    default:
      break
  }

  return {
    method: 'POST',
    url: 'https://music.163.com/api/v2/resource/comments',
    crypto: 'eapi',
    cookie: { os: 'pc' },
    toUrl: '/api/v2/resource/comments',
    data: {
      threadId: `${resourceTypeMap[type as 0]}${id}`,
      pageNo,
      pageSize,
      showInner,
      cursor: newCursor,
      sortType
    }
  }
}

export const commentFloor = (data?: CommentFloorData): WyCloudOptions => {
  const {
    parentCommentId,
    type,
    id,
    time = -1,
    limit = 20
  } = data ?? {}

  return {
    method: 'POST',
    url: 'https://music.163.com/api/resource/comment/floor/get',
    crypto: 'weapi',
    data: {
      parentCommentId,
      threadId: `${resourceTypeMap[type as 0]}${id}`,
      time,
      limit
    }
  }
}

/**
 * mv 评论
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 mv 的所有评论 ( 不需要 登录 )
 * 必选参数 :
 * id: mv id
 * 可选参数 :
 * limit: 取出评论数量 , 默认为 20
 * offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 */
export const commentMv = (data?: CommentMvData): WyCloudOptions => {
  const {
    id,
    limit = 20,
    offset = 0,
    beforeTime = 0
  } = data ?? {}

  return {
    method: 'POST',
    url: `https://music.163.com/weapi/v1/resource/comments/R_MV_5_${id}`,
    crypto: 'weapi',
    data: {
      rid: id,
      limit,
      offset,
      beforeTime
    }
  }
}
