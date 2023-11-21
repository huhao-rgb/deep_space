import type { Response } from '@/utils'

export interface SearchDefaultKeyData {
  showKeyword: string
  styleKeyword: {
    keyWord: null
    descWord: string
  }
  realkeyword: string
  searchType: number
  action: number
  alg: string
  gap: number
  source: null
  bizQueryInfo: string
  logInfo: null
  imageUrl: null
  trp_type: null
  trp_id: null
}

export type SearchDefaultKeyRes = Response<SearchDefaultKeyData>
