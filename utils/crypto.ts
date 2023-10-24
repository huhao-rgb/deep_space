// https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/util/crypto.js
import Crypto from 'react-native-quick-crypto'

export type Mode = 'cbc' | 'ecb' | ''

export type AnyObject = Record<string, any>

const iv = Buffer.from('0102030405060708')
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q')
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey =
  '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'
const eapiKey = 'e82ckenh8dichen8'

export const aesEncrypt = (
  buffer: Buffer | Uint8Array,
  mode: Mode,
  key: string | Buffer | Uint8Array,
  iv: string | Buffer
) => {
  const cipher = Crypto.createCipheriv(`aes-128-${mode}`, key, iv)
  return Buffer.concat([
    Buffer.from(cipher.update(buffer) as ArrayBuffer),
    Buffer.from(cipher.final())
  ])
}

export const rsaEncrypt = (buffer: Buffer | Uint8Array, key: string) => {
  buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
  return Crypto.publicEncrypt(
    { key: key, padding: Crypto.constants.RSA_NO_PADDING },
    buffer
  )
}

export const weapi = (object: AnyObject) => {
  const jsonStr = JSON.stringify(object)
  const secretKey = Buffer.from(Crypto.randomBytes(16))
    .map((n) => base62.charAt(n % 62).charCodeAt(0))

  return {
    params: aesEncrypt(
      Buffer.from(
        aesEncrypt(Buffer.from(jsonStr), 'cbc', presetKey, iv).toString('base64'),
      ),
      'cbc',
      secretKey,
      iv,
    ).toString('base64'),
    encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex')
  }
}

export const linuxapi = (object: AnyObject) => {
  const text = JSON.stringify(object)
  return {
    eparams: aesEncrypt(Buffer.from(text), 'ecb', linuxapiKey, '')
      .toString('hex')
      .toUpperCase()
  }
}

export const eapi = (url: string, object: AnyObject) => {
  const text = typeof object === 'object' ? JSON.stringify(object) : object
  const message = `nobody${url}use${text}md5forencrypt`
  const digest = Crypto.createHash('md5').update(message).digest('hex')
  const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
  return {
    params: aesEncrypt(Buffer.from(data), 'ecb', eapiKey, '')
      .toString('hex')
      .toUpperCase()
  }
}

export const decrypt = (cipherBuffer: Buffer) => {
  const decipher = Crypto.createDecipheriv('aes-128-ecb', eapiKey, '')
  return Buffer.concat([
    Buffer.from(decipher.update(cipherBuffer) as ArrayBuffer),
    Buffer.from(decipher.final())
  ])
}
