import { forwardRef } from 'react'
import type { Ref, ReactElement } from 'react'

import { FlashList } from '@shopify/flash-list'
import { useHeaderTabContext } from '@showtime-xyz/tab-view'

import TabFlashListScrollView from './TabFlashListScrollView'

import type { TabFlashListProps } from './types'

function TabFlashListComponent <T> (
  props: TabFlashListProps<T>,
  ref: Ref<FlashList<T>>
) {
  const { scrollViewPaddingTop } = useHeaderTabContext()

  return (
    <FlashList
      {...props}
      ref={ref}
      renderScrollComponent={TabFlashListScrollView as any}
      contentContainerStyle={{ paddingTop: scrollViewPaddingTop }}
    />
  )
}

const TabFlashList = forwardRef(TabFlashListComponent) as <T> (
  props: TabFlashListProps<T> & { ref?: Ref<FlashList<T>> }
) => ReactElement

export default TabFlashList
