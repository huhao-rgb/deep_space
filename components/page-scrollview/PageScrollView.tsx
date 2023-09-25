import type { FC } from 'react'
import { useMemo } from 'react'

import { View, useWindowDimensions } from 'react-native'
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
  scrollTo
} from 'react-native-reanimated'

import { PageScrollViewProps } from './types'

const PageScrollView: FC<PageScrollViewProps> = (props) => {
  const {
    routes,
    paddingHorizontal = 0,
    offset = 0,
    width,
    thresholdValue = 1,
    style,
    routeStyle,
    RenderScreen
  } = props

  const animatedRef = useAnimatedRef<Animated.ScrollView>()
  const position = useSharedValue(0)

  const finalThresholdValue = useMemo(
    () => {
      const unZero = Math.abs(thresholdValue) || 0.1 // 如果是0，默认赋值0.1
      if (unZero > 1) return 1
      return unZero
    },
    [thresholdValue]
  )

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
    },
    onMomentumEnd (e) {
      scrollToNearestItem(e.contentOffset.x)
    }
  })

  return (
    <Animated.ScrollView
      ref={animatedRef}
      horizontal={true}
      pagingEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      style={style}
      onScroll={scrollHandler}
    >
      {routes.map((route, i) => {
        const style: {
          marginLeft?: number
          marginRight?: number
        } = {}

        if (i === 0) {
          style.marginLeft = paddingHorizontal
        } else if (i === routes.length - 1) {
          style.marginRight = paddingHorizontal
        }

        return (
          <View
            style={[
              { paddingRight: offset, width: itemTotalSize },
              routeStyle,
              style
            ]}
            key={`PageScrollViewRoute_${i}`}
          >
            {RenderScreen({ route })}
          </View>
        )
      })}
    </Animated.ScrollView>
  )
}

export default PageScrollView
