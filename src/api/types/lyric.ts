export interface LyricParams {
  id: number
}

export interface Lyric {
  lyric: string
  version: number
}

export interface LyricUser {
  demand: number
  id: number
  nickname: string
  status: number
  uptime: number
  userid: number
}

export interface LyricResponse {
  code: number
  klyric: Lyric
  lrc: Lyric
  lyricUser?: LyricUser // 歌词创建者
  qfy: boolean
  romalrc: Lyric
  sfy: boolean
  sgc: boolean
  tlyric: Lyric // 翻译歌词
  transUser?: LyricUser // 歌词翻译者
}
