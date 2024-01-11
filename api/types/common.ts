export type PagingData = {
  offset: number
  limit: number
}

export interface ToneQuality {
  br: number
  fid: number
  size: number
  vd: number
}

export interface TrackId {
  alg: string
  at: number
  f: null
  id: number
  rcmdReason: string
  sc: null
  sr: null
  t: number
  uid: number
  v: number
}

/**
 * 详情查看：https://docs.neteasecloudmusicapi.binaryify.com/#/?id=%e8%8e%b7%e5%8f%96%e6%ad%8c%e6%9b%b2%e8%af%a6%e6%83%85
 */
export interface Track {
  a: null
  al: {
    id: number
    name: string
    pic: number
    picUrl: string
    pic_str: string
    tns: any[]
  }
  alg: string
  alia: []
  ar: Array<{
    alias: any[]
    id: number
    name: string
    tns: any[]
  }>
  awardTags: null
  cd: string
  cf: string
  copyright: number
  cp: number
  crbt: null
  djId: number
  dt: number
  entertainmentTags: null
  fee: number
  ftype: number
  h: ToneQuality
  hr: null
  id: number
  l: ToneQuality
  m: ToneQuality
  mark: number
  mst: number
  mv: number
  name: string
  no: number
  noCopyrightRcmd: null
  originCoverType: number
  originSongSimpleData: null
  pop: number
  pst: number
  publishTime: number
  resourceState: true
  rt: null
  rtUrl: null
  rtUrls: []
  rtype: number
  rurl: null
  s_id: number
  single: number
  songJumpInfo: null
  sq: ToneQuality
  st: number
  t: number
  tagPicList: null
  v: number
  version: number
}
