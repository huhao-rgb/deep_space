import type { FlashListProps } from '@shopify/flash-list'

export type PagingListProps = Omit<
FlashListProps<any>,
| 'data'
| 'refreshControl'
| 'refreshing'
| 'onRefresh'
>

export interface Paging {
  offset: number
  limit: number
}

export interface CustomResponse <T> {
  total: number
  ended?: boolean
  list: T[]
}

export interface WithPagingListProps <T = any> extends PagingListProps {
  limit?: number
  /**
   * onCustomApi 自定义请求函数，需要返回一个promise
   * 返回的格式必须和类型CustomResponse一致
   */
  onCustomApi?: (paging: Paging) => Promise<CustomResponse<T>>
}
