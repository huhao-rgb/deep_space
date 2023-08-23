import type { FC } from 'react'

import { useWindowDimensions } from 'react-native'
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  scrollTo
} from 'react-native-reanimated'

import { PageScrollViewProps } from './types'

const PageScrollView: FC<PageScrollViewProps> = (props) => {
  const {
    routes,
    paddingHorizontal = 0,
    offset = 0,
    width,
    style,
    routeStyle,
    RenderScreen
  } = props

  const animatedRef = useAnimatedRef<Animated.ScrollView>()
  const position = useSharedValue(0)

  const { width: windowWidth } = useWindowDimensions()

  const defaultWidth = width ?? windowWidth
  // 单个页面的宽度
  const itemTotalSize = defaultWidth - paddingHorizontal * 2

  const scrollToNearestItem = (offsetX: number) => {
    'worklet'
    let minDistance
    let minDistanceIndex = 0

    for (let i = 0; i < routes.length; ++i) {
      const distance = Math.abs(i * itemTotalSize - offsetX)
      if (minDistance === undefined || distance < minDistance) {
        minDistance = distance
        minDistanceIndex = i
      }
    }

    scrollTo(animatedRef, minDistanceIndex * itemTotalSize, 0, true)
  }

  // 滚动的处理函数
  const scrollHandler = useAnimatedScrollHandler({
    onScroll (e) {
      position.value = e.contentOffset.x
    },
    onEndDrag (e) {
      scrollToNearestItem(e.contentOffset.x)
      console.log('触发了：onEndDrag')
    },
    onMomentumEnd (e) {
      scrollToNearestItem(e.contentOffset.x)
    }
  })

  return (
    <Animated.ScrollView
      ref={animatedRef}
      horizontal={true}
      style={style}
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
    >
      {routes.map((route, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const uas = useAnimatedStyle(() => {
          const style: {
            marginLeft?: number;
            marginRight?: number;
          } = {}

          if (i === 0) {
            style.marginLeft = paddingHorizontal
          } else if (i === routes.length - 1) {
            style.marginRight = paddingHorizontal
          }

          return style
        })

        return (
          <Animated.View
            style={[
              { paddingRight: offset, width: itemTotalSize },
              routeStyle,
              uas
            ]}
            key={`PageScrollViewRoute_${i}`}
          >
            {RenderScreen({ route })}
          </Animated.View>
        )
      })}
    </Animated.ScrollView>
  )
}

export default PageScrollView
