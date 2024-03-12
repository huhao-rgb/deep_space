import type { WyUserInfo } from './common'

export interface CommentMusicData {
  rid: number
  limit?: number
  offset?: number
  beforeTime?: number
}

export enum SortType {
  RECOMMEND = 99, // 按推荐排序
  HEAT = 2, // 按热度排序
  TIME = 3 // 按时间排序
}

export enum ResourceType {
  SONG = 0,
  MV = 1,
  SONG_LIST = 2,
  ALBUM = 3,
  RADIO_SHOW = 4,
  VIDEO = 5,
  EVENT = 6,
  ANCHOR = 7
}

export interface CommentNewData {
  type: ResourceType
  id: number
  showInner?: boolean
  pageSize?: number
  pageNo?: number
  sortType?: SortType
  cursor?: string
}

export interface Comment {
  args: string
  beReplied: null
  commentId: number
  commentLocationType: number
  commentVideoVO: {
    allowCreation: boolean
    creationOrpheusUrl: null
    forbidCreationText: string
    playOrpheusUrl: null
    showCreationEntrance: boolean
    videoCount: number
  }
  content: string
  contentPicNosKey: null
  contentPicUrl: null
  contentResource: null
  decoration: {}
  expressionUrl: null
  extInfo: {
    statistics: {
      ext_dislike: number
      status_58: number
      status_59: number
      status_60: number
    }
  }
  grade: null
  hideSerialComments: null
  hideSerialTips: null
  ipLocation: {
    ip: null
    location: string
    userId: null
  }
  liked: boolean
  likedCount: number
  musicianSayAirborne: null
  needDisplayTime: boolean
  owner: boolean
  parentCommentId: number
  pendantData: null
  pickInfo: null
  privacy: number
  repliedMark: boolean
  replyCount: number
  resourceSpecialType: null
  richContent: null
  showFloorComment: {
    comments: null
    replyCount: number
    showReplyCount: boolean
    target: null
    topCommentIds: null
  }
  source: null
  status: number
  tag: {
    contentDatas: null
    contentPicDatas: null
    datas: []
    extDatas: []
    relatedCommentIds: null
  }
  tail: null
  threadId: string
  time: number
  timeStr: string
  topicList: null
  track: string
  user: Omit<WyUserInfo, 'accountStatus'>
  userBizLevels: null
  userNameplates: null
}

export interface CommentNewResData {
  bottomAction: null
  comments: Comment[]
  commentsTitle: string
  currentComment: null
  currentCommentTitle: string
  cursor: string
  hasMore: boolean
  likeAnimation: any
  sortType: number
  sortTypeList: Array<{
    sortType: number
    sortTypeName: string
    target: string
  }>
  style: string
  totalCount: number
}

export interface CommentNewRes {
  code: number
  data: CommentNewResData
  msg: string
}

export interface CommentFloorData {
  parentCommentId?: string
  type: ResourceType
  id: number
  time?: number
  limit?: number
}

export type ReplyComment = Omit<Comment, 'args'>

export interface CommentFloorResData {
  bestComments: ReplyComment[]
  comments: ReplyComment[]
  currentComment: null
  hasMore: true
  ownerComment: ReplyComment
  time: number
  totalCount: number
}

export interface CommentFloorRes {
  code: number
  data: CommentFloorResData,
  message: string
}

export interface CommentMvData {
  id: number
  limit?: number
  offset?: number
  beforeTime?: number
}
