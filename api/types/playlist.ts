import type { Track, PagingData } from './common'

export interface PlaylistDetailData {
  id: string
  s?: number // s : 歌单最近的 s 个收藏者,默认为 8
}

export interface PlaylistTrackAllData {
  ids: string[] // 逗号分隔的字符串
}

export interface PlaylistDetailPrivileges {
  chargeInfoList: Array<{
    chargeMessage: null
    chargeType: number
    chargeUrl: null
    rate: number
  }>
  cp: number
  cs: boolean
  dl: number
  dlLevel: string
  downloadMaxBrLevel: string
  downloadMaxbr: number
  fee: number
  fl: number
  flLevel: string
  flag: number
  freeTrialPrivilege: {
    cannotListenReason: null
    listenType: null
    resConsumable: boolean
    userConsumable: boolean
  }
  id: number
  maxBrLevel: string
  maxbr: number
  paidBigBang: boolean
  payed: number
  pc: null
  pl: number
  plLevel: string
  playMaxBrLevel: string
  playMaxbr: number
  preSell: boolean
  realPayed: number
  rightSource: number
  rscl: null
  sp: number
  st: number
  subp: number
  toast: boolean
}

export interface PlaylistDetailRes {
  code: number
  fromUserCount: number
  fromUsers: string | null
  playlist: Record<string, any>
  privileges: PlaylistDetailPrivileges[]
  relatedVideos: string | null
  resEntrance: string | null
  sharedPrivilege: string | null
  songFromUsers: string | null
  urls: string | null
}

export interface PlaylistTrackAllRes {
  code: number
  privileges: any[]
  songs: Track[]
}

export interface CatlistItem {
  activity: boolean
  category: number
  hot: boolean
  imgId: number
  imgUrl: string | null
  name: string
  resourceCount: number
  resourceType: number
  type: number
}

export interface PlaylistCatlistRes {
  all: CatlistItem
  categories: Record<number, string>
  code: number
  sub: CatlistItem[]
}

export interface TopPlaylistData extends PagingData {
  order: 'hot' | 'new'
  total?: boolean
  cat?: string
}
