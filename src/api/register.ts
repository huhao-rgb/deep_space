import Crypto from 'react-native-quick-crypto'

import type { WyCloudOptions } from '@/utils'

const ID_XOR_KEY_1 = Buffer.from('3go8&$833h0k(2)2')

const cloudMusicDllEncodeId = (someId: string) => {
  const xored = Buffer.from(
    [...someId].map(
      (c, idx) => c.charCodeAt(0) ^ ID_XOR_KEY_1[idx % ID_XOR_KEY_1.length]
    )
  )

  const digest = Crypto.createHash('md5').update(xored).digest()
  return digest.toString('base64')
}

// 游客登录
export const registerAnonimous = (): WyCloudOptions => {
  const cookie = { os: 'ios' }
  const deviceId = `NMUSIC`
  const encodedId = Buffer.from(
    `${deviceId} ${cloudMusicDllEncodeId(deviceId)}`,
  )
  const username = encodedId.toString('base64')

  return {
    method: 'POST',
    url: 'https://music.163.com/api/register/anonimous',
    data: { username },
    crypto: 'weapi',
    cookie
  }
}
