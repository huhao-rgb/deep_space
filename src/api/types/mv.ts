export interface MvDetailData {
  id: number
}

export interface MvDetailRes {
  bufferPic: string
  bufferPicFS: string
  code: number
  data: {
    artistId: number
    artistName: string
    artists: Array<{
      followed: boolean
      id: number
      img1v1Url: string | null
      name: string
    }>
    briefDesc: string
    brs: Array<{
      br: number
      point: number
      size: number
    }>
    commentCount: number
    commentThreadId: string
    cover: string
    coverId: number
    coverId_str: string
    desc: string
    duration: number
    id: number
    nType: number
    name: string
    playCount: number
    price: string | null
    publishTime: string
    shareCount: number
    subCount: number
    videoGroup: Array<{
      id: number
      name: string
      type: number
    }>
  }
  loadingPic: string
  loadingPicFS: string
  mp: {
    cp: number
    dl: number
    fee: number
    id: number
    msg: string | null
    mvFee: number
    normal: boolean
    payed: number
    pl: number
    sid: number
    st: number
    unauthorized: boolean
  }
  subed: boolean
}

export interface MvUrlData extends MvDetailData {
  r?: number
}
