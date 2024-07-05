export type SongUrlV1Level =
  | 'standard'
  | 'exhigh'
  | 'lossless'
  | 'hires'
  | 'jyeffect'
  | 'sky'
  | 'jymaster'

export interface SongUrlV1Data {
  ids: string
  level?: SongUrlV1Level
}

export interface SongUrl {
  br: number
  canExtend: boolean
  code: number
  effectTypes: null
  encodeType: string
  expi: number
  fee: number
  flag: number
  freeTimeTrialPrivilege: {
    remainTime: number
    resConsumable: boolean
    type: number
    userConsumable: boolean
  }
  freeTrialInfo: {
    algData: null
    end: number
    fragmentType: number
    start: number
  }
  freeTrialPrivilege: {
    cannotListenReason: number
    listenType: null
    playReason: null
    resConsumable: boolean
    userConsumable: boolean
  }
  gain: number
  id: number
  level: string
  md5: string
  payed: number
  peak: number
  podcastCtrp: null
  rightSource: number
  size: number
  time: number
  type: string
  uf: null
  url: string
  urlSource: number
}

export interface SongUrlV1Res {
  code: number
  data: SongUrl[]
}
