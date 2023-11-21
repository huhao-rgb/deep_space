import type { WyCloudOptions } from '@/utils'

export const searchDefaultKey = (): WyCloudOptions => {
  return {
    method: 'POST',
    url: 'https://interface3.music.163.com/eapi/search/defaultkeyword/get',
    toUrl: '/api/search/defaultkeyword/get',
    crypto: 'eapi'
  }
}
