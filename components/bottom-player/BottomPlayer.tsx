/**
 * 底部mini播放控件
 * 动画配置可以参考 withTIming函数：https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming
 */
import {
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useCallback
} from 'react'

import { shallow } from 'zustand/shallow'

import { View, Text } from 'react-native'
import type { LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import TrackPlayer, { State } from 'react-native-track-player'
import { Shadow } from 'react-native-shadow-2'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  PlayIcon,
  PauseIcon
} from 'react-native-heroicons/solid'

import { Image } from 'expo-image'

import Icon from '../svg-icon'
import VipLabel from '../vip-label'
import ProgressBar from './ProgressBar'

import { tw, getSvgProps } from '@/utils'
import { usePlayer, usePlayerState } from '@/store'

import type { BottomPlayerProps } from './types'

const ptValue = tw`pt-2`.paddingTop as number
const DEFAULT_HEIGHT = 100

const BottomPlayer = forwardRef<unknown, BottomPlayerProps>((props, ref) => {
  const {
    easing = Easing.bezier(0.57, 0.18, 0.26, 0.99),
    duration = 200
  } = props

  const { bottom } = useSafeAreaInsets()

  const [
    songList,
    currentPlayIndex
  ] = usePlayer(
    (s) => [
      s.songList,
      s.currentPlayIndex
    ],
    shallow
  )
  const [
    playerState,
    miniPlayerHeight,
    setMniPlayerHeight,
    isShowFullPlayer,
    setIsShowMiniPlayer,
    bottomPlayerQueueRef,
    playerRef
  ] = usePlayerState(
    (s) => [
      s.playerState,
      s.miniPlayerHeight,
      s.setMniPlayerHeight,
      s.isShowFullPlayer,
      s.setIsShowMiniPlayer,
      s.bottomPlayerQueueRef,
      s.playerRef
    ],
    shallow
  )

  const currentSong = songList[currentPlayIndex] ?? {}

  const bottomValue = useSharedValue(DEFAULT_HEIGHT)
  const playerStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomValue.value }]
  }))

  const setBottomValue = useCallback(
    (show: boolean) => {
      const value = show ? 0 : (miniPlayerHeight || DEFAULT_HEIGHT)
      bottomValue.value = withTiming(value, { duration, easing })
    },
    [easing, duration, miniPlayerHeight]
  )

  useLayoutEffect(
    () => {
      const show = songList.length > 0 && !isShowFullPlayer
      setBottomValue(show)
      setIsShowMiniPlayer(show)
    },
    [songList, isShowFullPlayer]
  )

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { layout } = event.nativeEvent
      setMniPlayerHeight(layout.height)
    },
    []
  )

  const onPlay2Pause = useCallback(
    async () => {
      playerState === State.Playing
        ? TrackPlayer.pause()
        : TrackPlayer.play()
    },
    [playerState, currentPlayIndex]
  )

  const showPlayer = useCallback(
    () => {
      if (songList.length === 0) return
      playerRef.current?.snapToIndex(0)
    },
    [songList, playerRef]
  )

  useImperativeHandle(ref, () => ({
    setShowPlayer: (show: boolean) => {
      setBottomValue(show)
    }
  }))

  return (
    <Animated.View
      style={[
        playerStyles,
        tw`absolute left-0 right-0 bottom-0`
      ]}
      onLayout={onLayout}
    >
      <Shadow
        startColor="#00000010"
        distance={16}
        offset={[0, 3]}
        style={[tw`bg-white`]}
      >
        <ProgressBar />
        <RectButton
          rippleColor={tw.color('red-50')}
          activeOpacity={0.8}
          style={[
            {
              paddingTop: ptValue,
              paddingBottom: bottom + ptValue
            },
            tw`w-full flex-row items-center px-5`
          ]}
          onPress={showPlayer}
        >
          <View style={tw`flex-1 flex-row items-center`}>
            <Image
              source={{ uri: `${currentSong?.al?.picUrl}?param=80y80` }}
              style={tw`h-12 w-12 rounded-lg`}
            />
            <View style={tw`flex-1 ml-4`}>
              <Text
                numberOfLines={1}
                style={tw`text-slate-800 text-sm font-bold`}
              >
                {currentSong?.name}
              </Text>
              <View style={tw`w-full flex-row items-center mt-1`}>
                {currentSong?.fee === 1 && <VipLabel />}
                <Text
                  numberOfLines={1}
                  style={tw`text-slate-500 text-xs`}
                >
                  {currentSong?.ar?.[0]?.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`flex-row items-center ml-6`}>
            <BorderlessButton
              style={tw`p-1.5`}
              onPress={onPlay2Pause}
            >
              {playerState === State.Playing
                ? <PauseIcon
                    {...getSvgProps({
                      theme: 'light',
                      size: 'base',
                      isOutline: false
                    })}
                  />
                : <PlayIcon
                    {...getSvgProps({
                      theme: 'light',
                      size: 'base',
                      isOutline: false
                    })}
                  />}
            </BorderlessButton>
            <BorderlessButton
              style={tw`ml-4 p-1`}
              onPress={() => { bottomPlayerQueueRef.current?.snapToIndex(0) }}
            >
              <Icon
                name="MusicList"
                size={20}
                fill={tw.color('slate-700')}
              />
            </BorderlessButton>
          </View>
        </RectButton>
      </Shadow>
    </Animated.View>
  )
})

export default memo(BottomPlayer)
