import type { FC } from 'react'
import {
  useMemo,
  useCallback,
  useRef
} from 'react'

import {
  View,
  Text,
  useWindowDimensions
} from 'react-native'
import { router } from 'expo-router'

import TrackPlayer from 'react-native-track-player'
import { useSharedValue } from 'react-native-reanimated'
import { BorderlessButton } from 'react-native-gesture-handler'
import {
  HeartIcon,
  ArrowDownTrayIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisVerticalIcon
} from 'react-native-heroicons/outline'

import { useShallow } from 'zustand/react/shallow'

import { PlayerContextProvider, GestureState } from './Context'

import SafeAreaView from '@/components/safe-area-view'
import Icon from '@/components/svg-icon'
import VipLabel from '@/components/vip-label'

import ProgressBar from './ProgressBar'
import ButtonIcon from './ButtonIcon'
import RepeatModeBtn from './RepeatModeBtn'
import Lyric, { type LyricRef } from './Lyric'
import CoverSwitch from './CoverSwitch'
import PlayPuaseBtn from './PlayPuaseBtn'

import {
  usePlayerState,
  usePlayer,
  PlayerRepeatMode
} from '@/store'
import { tw, getSvgProps } from '@/utils'
import { ResourceType } from '@/api/types'

const gapWidth = tw`w-5`.width as number

const Player: FC = () => {
  const { width } = useWindowDimensions()

  const gestureState = useSharedValue<GestureState>(GestureState.BEIGIN)
  const translationX = useSharedValue(0)

  const coverWidth = useMemo(() => width - gapWidth * 2, [width])

  const lyricRef = useRef<LyricRef>(null)

  const [
    songList,
    currentPlayIndex,
    repeatMode,
    setCurrentPlayIndex
  ] = usePlayer(
    useShallow((state) => [
      state.songList,
      state.currentPlayIndex,
      state.repeatMode,
      state.setCurrentPlayIndex
    ])
  )
  const [bottomPlayerQueueRef] = usePlayerState(
    useShallow((state) => [
      state.bottomPlayerQueueRef
    ])
  )

  const currentSong = songList[currentPlayIndex] ?? {}

  const onCoverSwitchFinish = useCallback(
    (isPre: boolean) => {
      if (repeatMode === PlayerRepeatMode.Single) {
        TrackPlayer.seekTo(0)
      } else {
        const totalIndex = songList.length - 1

        if (isPre) {
          const prevIndex = currentPlayIndex === 0
            ? totalIndex
            : currentPlayIndex - 1
          setCurrentPlayIndex(prevIndex)
          TrackPlayer.skipToPrevious(0)
        } else {
          const nextIndex = currentPlayIndex === totalIndex
            ? 0
            : currentPlayIndex + 1
          setCurrentPlayIndex(nextIndex)
          TrackPlayer.skipToNext(0)
        }
      }
    },
    [
      songList,
      currentPlayIndex,
      repeatMode,
      setCurrentPlayIndex
    ]
  )

  const onCoverTap = useCallback(
    () => {
      lyricRef.current?.showLyricContainer()
    },
    []
  )

  const toCommentPage = useCallback(
    () => {
      if (currentSong) {
        router.push(`/comment/?type=${ResourceType.SONG}&id=${currentSong.id}&imgUrl=${currentSong.al?.picUrl}&title=${currentSong.name}&subtitle=${currentSong.ar?.[0]?.name}`)
      }
    },
    [currentSong]
  )

  return (
    <PlayerContextProvider
      value={{
        gestureState,
        translationX
      }}
    >
      <SafeAreaView
        edges={['bottom']}
        style={tw`flex-1`}
      >
        <CoverSwitch
          songList={songList}
          currentIndex={currentPlayIndex}
          size={coverWidth}
          windowWidth={width}
          onFinish={onCoverSwitchFinish}
          onTap={onCoverTap}
        />

        <View style={tw`px-5 flex-1`}>
          <Text
            numberOfLines={1}
            style={tw`mt-8 font-bold text-3xl text-center text-slate-700`}
          >
            {currentSong?.name}
          </Text>
          <View style={tw`mt-1 flex-row items-center justify-center`}>
            {currentSong?.fee === 1 && <VipLabel />}
            <Text
              numberOfLines={1}
              style={tw`text-sm text-center text-slate-400`}
            >
              {currentSong?.ar?.[0]?.name}
            </Text>
          </View>

          {/* 该区域后期放视频可视化效果 */}
          <View style={tw`flex-1`}></View>

          <View style={tw`flex-row items-center justify-between`}>
            <ButtonIcon
              icon={HeartIcon}
              {...getSvgProps({ theme: 'light', size: 'lg' })}
              onPress={() => { console.log('测试按钮1') }}
            />
            <ButtonIcon
              icon={ArrowDownTrayIcon}
              {...getSvgProps({ theme: 'light', size: 'lg' })}
              onPress={() => { console.log('测试按钮1') }}
            />
            <ButtonIcon
              icon={ChatBubbleBottomCenterTextIcon}
              {...getSvgProps({ theme: 'light', size: 'lg' })}
              onPress={toCommentPage}
            />
            <ButtonIcon
              icon={EllipsisVerticalIcon}
              {...getSvgProps({ theme: 'light', size: 'lg' })}
              onPress={() => { console.log('测试按钮') }}
            />
          </View>
          
          <ProgressBar style={tw`my-8`} />

          <View style={tw`flex-row items-center justify-between pb-5`}>
            <RepeatModeBtn mode={repeatMode} />
            <BorderlessButton
              style={tw`p-1`}
              onPress={() => { onCoverSwitchFinish(true) }}
            >
              <Icon
                name="SolidPrevious"
                {...getSvgProps({ size: 'lg', theme: 'light', isOutline: false })}
              />
            </BorderlessButton>

            <PlayPuaseBtn />
            
            <BorderlessButton
              style={tw`p-1`}
              onPress={() => { onCoverSwitchFinish(false) }}
            >
              <Icon
                name="SolidNext"
                {...getSvgProps({ size: 'lg', theme: 'light', isOutline: false })}
              />
            </BorderlessButton>
            <BorderlessButton
              style={tw`p-1`}
              onPress={() => { bottomPlayerQueueRef.current?.snapToIndex(0) }}
            >
              <Icon
                name="MusicList"
                {...getSvgProps({ size: 'lg', theme: 'light', isOutline: false })}
              />
            </BorderlessButton>
          </View>
        </View>

        <Lyric
          ref={lyricRef}
          currentSong={currentSong}
        />
      </SafeAreaView>
    </PlayerContextProvider>
  )
}

export default Player
