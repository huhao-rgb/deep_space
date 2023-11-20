import { forwardRef } from 'react'

import type { ScrollViewProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { SceneComponent } from '@showtime-xyz/tab-view'

type TabScrollViewProps = ScrollViewProps & { index: number }

const TabFlashListScrollView = forwardRef((props: TabScrollViewProps, ref: any) => {
  return (
    <SceneComponent
      {...props}
      useExternalScrollView
      forwardedRef={ref}
      ContainerView={Animated.ScrollView}
    />
  )
})

export default TabFlashListScrollView
