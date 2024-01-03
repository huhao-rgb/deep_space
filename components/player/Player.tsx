import {
  memo,
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react'

import {
  View,
  Text,
  useWindowDimensions
} from 'react-native'
import { router } from 'expo-router'

import TrackPlayer, { State } from 'react-native-track-player'
import { useSharedValue } from 'react-native-reanimated'
import { RectButton, BorderlessButton } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import type {
  BottomSheetBackdropProps,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  HeartIcon,
  ArrowDownTrayIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisVerticalIcon
} from 'react-native-heroicons/outline'
import { PlayIcon, PauseIcon } from 'react-native-heroicons/solid'

import { shallow } from 'zustand/shallow'

import { PlayerContextProvider, GestureState } from './Context'
import { useGestureEventsHandlers } from './useGestureEventsHandlers'

import BottomSheetHandle from '../bottom-sheet-handle'
import SafeAreaView from '../safe-area-view'
import Icon from '../svg-icon'
import VipLabel from '../vip-label'

import ProgressBar from './ProgressBar'
import ButtonIcon from './ButtonIcon'
import RepeatModeBtn from './RepeatModeBtn'
import Lyric, { type LyricRef } from './Lyric'
import CoverSwitch from './CoverSwitch'

import {
  usePlayerState,
  usePlayer,
  PlayerRepeatMode
} from '@/store'
import { tw, getSvgProps } from '@/utils'
import { useWyCloudApi } from '@/hooks'

import type { LyricParams, LyricResponse } from '@/api/types'

export interface LyricData {
  lrc: string
  tlyric: string
  transUser?: string
  lyricUser?: string
}

const gapWidth = tw`w-5`.width as number

const Player = memo(() => {
  const gestureState = useSharedValue<GestureState>(GestureState.BEIGIN)
  const translationX = useSharedValue(0)

  const { height, width } = useWindowDimensions()
  const { bottom } = useSafeAreaInsets()

  const lyricApi = useWyCloudApi<LyricResponse, LyricParams>('lyric', 1000 * 60 * 60 * 2)

  const snapPoints = useMemo(() => [height + bottom], [height, bottom])
  const coverWidth = useMemo(() => width - gapWidth * 2, [width])

  const [lyricData, setLyricData] = useState<LyricData>()
  const lyricRef = useRef<LyricRef>(null)

  const [
    songList,
    currentPlayIndex,
    repeatMode,
    setCurrentPlayIndex
  ] = usePlayer(
    (s) => [
      s.songList,
      s.currentPlayIndex,
      s.repeatMode,
      s.setCurrentPlayIndex
    ],
    shallow
  )
  const [playerRef, playerState, bottomPlayerQueueRef] = usePlayerState(
    (s) => [s.playerRef, s.playerState, s.bottomPlayerQueueRef],
    shallow
  )

  const currentSong = songList[currentPlayIndex] ?? {}

  useEffect(
    () => {
      const { id } = currentSong
      if (id) {
        lyricApi({
          data: { id },
          recordUniqueId: String(id)
        })
          .then(response => {
            const { status, body } = response
            if (status === 200 && body.code === 200) {
              const { lrc, transUser, tlyric, lyricUser } = body
              setLyricData({
                lrc: lrc.lyric,
                transUser: transUser?.nickname,
                tlyric: tlyric?.lyric ?? '',
                lyricUser: lyricUser?.nickname
              })
            }
          })
      }
    },
    [currentSong]
  )

  const onPlay2Pause = useCallback(
    async () => {
      playerState === State.Playing
        ? TrackPlayer.pause()
        : TrackPlayer.play()
    },
    [playerState, currentPlayIndex]
  )

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
      const id = songList[currentPlayIndex]?.id
      if (id) {
        playerRef.current?.close()
        router.push(`/comment/?type=song&id=${id}`)
      }
    },
    [songList, currentPlayIndex]
  )

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  )

  const renderHandle = useCallback(
    (props: BottomSheetHandleProps) => <BottomSheetHandle {...props} />,
    []
  )

  return (
    <PlayerContextProvider
      value={{
        gestureState,
        translationX
      }}
    >
      <BottomSheet
        ref={playerRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableOverDrag={false}
        gestureEventsHandlersHook={useGestureEventsHandlers}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
      >
        <SafeAreaView
          edges={['bottom']}
          style={tw`px-5 flex-1`}
        >
          <CoverSwitch
            uri={`${currentSong?.al?.picUrl}?param=1000y1000`}
            size={coverWidth}
            windowWidth={width}
            onFinish={onCoverSwitchFinish}
            onTap={onCoverTap}
          />
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
              onPress={() => { console.log('测试按钮') }}
            />
            <ButtonIcon
              icon={ArrowDownTrayIcon}
              {...getSvgProps({ theme: 'light', size: 'lg' })}
              onPress={() => { console.log('测试按钮') }}
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
              onPress={() => { onCoverSwitchFinish(false) }}
            >
              <Icon
                name="SolidPrevious"
                {...getSvgProps({ size: 'lg', theme: 'light', isOutline: false })}
              />
            </BorderlessButton>
            <RectButton
              activeOpacity={0.8}
              style={tw`rounded-full w-14 h-14 bg-red-500 flex-row justify-center items-center`}
              onPress={onPlay2Pause}
            >
              {playerState === State.Playing
                ? <PauseIcon {...getSvgProps({ fill: tw.color('white'), size: 'lg' })} />
                : <PlayIcon
                    {...getSvgProps({ fill: tw.color('white'), size: 'lg' })}
                    style={tw`ml-1`}
                  />}
            </RectButton>
            <BorderlessButton
              style={tw`p-1`}
              onPress={() => { onCoverSwitchFinish(true) }}
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

          <Lyric
            ref={lyricRef}
            lyricData={lyricData}
          />
        </SafeAreaView>
      </BottomSheet>
    </PlayerContextProvider>
  )
})

export default Player
