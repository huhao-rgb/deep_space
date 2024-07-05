/**
 * 分页列表，统一处理下拉刷新和上拉加载
 * 这是个高阶组件，包装自flashlist组件
 */
import Animated from 'react-native-reanimated'
import { FlashList } from '@shopify/flash-list'

import { withPagingList } from './withPagingList'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

export const PagingListFlashList = withPagingList(AnimatedFlashList)

export * from './types'
export { withPagingList }
