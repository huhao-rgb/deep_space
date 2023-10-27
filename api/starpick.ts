import type { WyCloudOptions } from '@/utils'

// 云村星评馆 - 简要评论
export const starpickCommentsSummary = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://interface3.music.163.com/eapi/homepage/block/page',
    data: {
      cursor: JSON.stringify({
        offset: 0,
        blockCodeOrderList: ['HOMEPAGE_BLOCK_NEW_HOT_COMMENT'],
        refresh: true
      })
    },
    crypto: 'weapi',
    cookie: {}
  }
}
