import type { FC } from 'react'

import Animated, {
  useAnimatedScrollHandler
} from 'react-native-reanimated'

import { PageScrollViewProps } from './types'

const PageScrollView: FC<PageScrollViewProps> = (props) => {
  const { children } = props

  const scrollHandler = useAnimatedScrollHandler({
    onScroll () {}
  })

  return (
    <Animated.ScrollView onScroll={scrollHandler}>
      {children}
    </Animated.ScrollView>
  )
}

export default PageScrollView
