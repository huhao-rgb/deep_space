/**
 * 分页列表，统一处理下拉刷新和上拉加载
 * 这是个高阶组件，包装自flashlist组件
 */
import { FlashList } from '@shopify/flash-list'

import { withPagingList } from './withPagingList'

export const PagingListFlashList = withPagingList(FlashList)

export * from './types'
export { withPagingList }
