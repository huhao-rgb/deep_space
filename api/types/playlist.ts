import type { Track } from './common'

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
