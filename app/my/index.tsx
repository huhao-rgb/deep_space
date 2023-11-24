import type { FC, ReactNode } from 'react'
import {
  useState,
  useMemo,
  useCallback
} from 'react'

import { View, Text } from 'react-native'
import type { LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  interpolate,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { TabView } from '@showtime-xyz/tab-view'
import type { Route } from '@showtime-xyz/tab-view'
import type { SceneRendererProps } from 'react-native-tab-view'
import { BorderlessButton } from 'react-native-gesture-handler'

import { Image } from 'expo-image'

import TabFlashList from '@/components/tab-flash-list'
import Icon from '@/components/svg-icon'
import NavBar from '@/components/nav-bar'

import Header from './Header'

import { tw } from '@/utils'

type RenderScene = (props: SceneRendererProps & { route: Route }) => ReactNode

const NAV_BAR_TITLE_TRANSLATE_Y = -10

const TabScene = ({ route }: any) => {
  return (
    <TabFlashList
      index={route.index}
      data={new Array(20).fill(0)}
      estimatedItemSize={60}
      renderItem={({ index }) => {
        return (
          <View
            style={{
              height: 60,
              backgroundColor: '#fff',
              marginBottom: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>{`${route.title}-Item-${index}`}</Text>
          </View>
        )
      }}
    />
  )
}

const My: FC = () => {
  const [isRefreshing] = useState(false)
  const [index, setIndex] = useState(0)

  const [navBarHeight, setNavBarHeight] = useState(0)

  const routes = useMemo<Route[]>(
    () => [
      { key: 'music', title: '音乐', index: 0 },
      { key: 'player', title: '博客', index: 1 },
      { key: 'dynamic', title: '动态', index: 2 }
    ],
    []
  )

  const animationHeaderPosition = useSharedValue(0)
  const animationHeaderHeight = useSharedValue(0)

  const navBarTitleOpactiy = useSharedValue(0)
  const navBarTitleTranslateY = useSharedValue(NAV_BAR_TITLE_TRANSLATE_Y)

  const navBarStylez = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(30, 41, 59, ${interpolate(
        -animationHeaderPosition.value,
        [0, animationHeaderHeight.value, animationHeaderHeight.value + 1],
        [0, 1, 1]
      )})`
    }
  })

  const navBarTitleStylez = useAnimatedStyle(() => {
    return {
      opacity: withTiming(navBarTitleOpactiy.value, {
        duration: 200,
        easing: Easing.ease
      }),
      transform: [{
        translateY: withTiming(navBarTitleTranslateY.value, {
          duration: 100,
          easing: Easing.ease
        })
      }]
    }
  })

  useAnimatedReaction(
    () => animationHeaderPosition.value,
    (currentValue) => {
      if (Math.abs(currentValue) > 60) {
        navBarTitleTranslateY.value = 0
        navBarTitleOpactiy.value = 1
      } else {
        navBarTitleTranslateY.value = NAV_BAR_TITLE_TRANSLATE_Y
        navBarTitleOpactiy.value = 0
      }
    }
  )

  const onHeaderNavBarLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      setNavBarHeight(height)
    },
    []
  )

  const renderScrollHeader = useCallback(() => <Header />, [])

  const renderScene = useCallback<RenderScene>(
    ({ route }) => {
      return <TabScene route={route} />
    },
    []
  )

  const renderRight = useCallback(
    () => {
      const onPress = () => {}

      return (
        <BorderlessButton onPress={onPress}>
          <Icon
            name="Setting"
            width={26}
            height={26}
            fill={tw.color('white')}
          />
        </BorderlessButton>
      )
    },
    []
  )

  const renderTitle = useCallback(
    () => {
      return (
        <Animated.View
          style={[
            tw`flex-row items-center justify-center flex-1`,
            navBarTitleStylez
          ]}
        >
          <Image
            source={require('@/assets/test-head.jpg')}
            style={tw`w-7 h-7 rounded-full`}
          />
          <Text style={tw`ml-3 text-base text-white`}>
            用户姓名
          </Text>
        </Animated.View>
      )
    },
    []
  )

  return (
    <>
      <Animated.View
        style={[
          tw`absolute top-0 left-0 right-0 z-10`,
          navBarStylez
        ]}
        onLayout={onHeaderNavBarLayout}
      >
        <NavBar
          bgTransparent
          backIconColor={tw.color('white')}
          renderRight={renderRight}
          renderTitle={renderTitle}
        />
      </Animated.View>
      <TabView
        isRefreshing={isRefreshing}
        navigationState={{ index, routes }}
        lazy
        minHeaderHeight={navBarHeight}
        animationHeaderPosition={animationHeaderPosition}
        animationHeaderHeight={animationHeaderHeight}
        renderScrollHeader={renderScrollHeader}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </>
  )
}

export default My
