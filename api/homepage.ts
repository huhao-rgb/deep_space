import type { WyCloudOptions } from '@/utils'
import type { HomepageBlockPageData } from './types/homepage'

export const homepageDragonBall = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://music.163.com/eapi/homepage/dragon/ball/static',
    crypto: 'eapi',
    cookie: {
      os: 'ios',
      appver: '8.7.01'
    }
  }
}

export const homepageBlockPage = (data?: HomepageBlockPageData): WyCloudOptions => {
  const {
    refresh = false,
    cursor
  } = data ?? {}

  return {
    method: 'POST',
    url: 'https://music.163.com/api/homepage/block/page',
    crypto: 'weapi',
    data: { refresh, cursor },
    cookie: {
      os: 'ios',
      appver: '8.10.90'
    }
  }
}

