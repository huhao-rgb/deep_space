import type { Response } from '@/utils'

export type BlockCode = 'HOMEPAGE_BLOCK_PLAYLIST_RCMD' | 'HOMEPAGE_BLOCK_STYLE_RCMD' | 'HOMEPAGE_BLOCK_MGC_PLAYLIST' | 'HOMEPAGE_BLOCK_LISTEN_LIVE' | 'HOMEPAGE_BLOCK_NEW_HOT_COMMENT' | 'HOMEPAGE_BLOCK_TOPLIST' | 'HOMEPAGE_BLOCK_NEW_ALBUM_NEW_SONG'
export type ShowType = 'HOMEPAGE_SLIDE_PLAYLIST'

export interface HomepageBlockPageData {
  refresh: boolean
  cursor?: string
}

export interface HomepageBlockPageBlocks {
  action?: string
  actionType?: string
  blockCode: BlockCode
  blockDemote: boolean
  blockStyle: number
  canClose: boolean
  canFeedback: boolean
  creatives: any[]
  dislikeShowType: number
  showType: ShowType
  sort: number
  uiElement: {
    button: {
      action: string
      actionType: string
      biData: null
      iconUrl: null
      text: string
    }
    mainTitle: {
      canShowTitleLogo: boolean
      title: string
    }
    rcmdShowType: string
    subTitle: {
      canShowTitleLogo: boolean
      title: string
    }
  }
}

export interface HomepageBlockPageResData {
  blockCodeOrderList: null
  blockUUIDs: null
  blocks: HomepageBlockPageBlocks[]
  cursor: string
  demote: boolean
  exposedResource: string
  guideToast: {
    hasGuideToast: boolean
    toastList: string[]
  }
  hasMore: boolean
  internalTest: null
  pageConfig: {
    abtest: string[]
    fullscreen: false
    homepageMode: string
    nodataToast: string
    orderInfo: string
    refreshInterval: number
    refreshToast: string
    showModeEntry: true
    songLabelMarkLimit: number
    songLabelMarkPriority: string[]
    title: string | null
  }
  titles: string[]
}

export interface HomepageBlockPageRes extends Response<HomepageBlockPageResData> {
  trp: string[]
}
