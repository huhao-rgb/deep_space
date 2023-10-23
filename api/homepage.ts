import type { WyCloudOptions } from '@/utils'

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

export const homepageBlockPage = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://music.163.com/api/homepage/block/page',
    crypto: 'weapi',
    cookie: {
      os: 'ios',
      appver: '8.7.01'
    }
  }
}

