import {
  memo,
  useMemo,
  useCallback,
  useEffect,
  useState
} from 'react'

import {
  View,
  Text,
  useWindowDimensions
} from 'react-native'

import TrackPlayer, { State } from 'react-native-track-player'
import { RectButton } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import type {
  BottomSheetBackdropProps,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Image } from 'expo-image'

import { shallow } from 'zustand/shallow'

import BottomSheetHandle from '../bottom-sheet-handle'
import SafeAreaView from '../safe-area-view'
import Icon from '../svg-icon'

import ProgressBar from './ProgressBar'
import ButtonIcon from './ButtonIcon'
import Lyric from './Lyric'
import CoverSwitch from './CoverSwitch'

import {
  usePlayerState,
  usePlayer
} from '@/store'
import { tw } from '@/utils'
import { useWyCloudApi } from '@/hooks'

import type { LyricParams, LyricResponse } from '@/api/types'

export interface LyricData {
  lrc: string
  tlyric: string
  transUser?: string
  lyricUser?: string
}

const gapWidth = tw`w-5`.width as number

const TOP_ICON_SIZE = 21
const BOTTOM_ICON_SIZE = 22
const ICON_COLOR = tw.color('slate-800')

const Player = memo(() => {
  const { height, width } = useWindowDimensions()
  const { bottom } = useSafeAreaInsets()

  const lyricApi = useWyCloudApi<LyricResponse, LyricParams>('lyric', 1000 * 60 * 60 * 2)

  const snapPoints = useMemo(() => [height + bottom], [height, bottom])
  const coverWidth = useMemo(() => width - gapWidth * 2, [width])

  const [lyricData, setLyricData] = useState<LyricData>()

  const [songList, currentPlayIndex, setCurrentPlayIndex] = usePlayer(
    (s) => [s.songList, s.currentPlayIndex, s.setCurrentPlayIndex],
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
              tlyric: tlyric.lyric,
              lyricUser: lyricUser?.nickname
            })
          }
        })
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
    },
    [songList, currentPlayIndex, setCurrentPlayIndex]
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
    <BottomSheet
      ref={playerRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableOverDrag={false}
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
        />
        <Text
          numberOfLines={1}
          style={tw`mt-8 font-bold text-3xl text-center text-slate-700`}
        >
          {currentSong?.name}
        </Text>
        <Text
          numberOfLines={1}
          style={tw`mt-1 text-sm text-center text-slate-400`}
        >
          {currentSong?.ar?.[0]?.name}
        </Text>

        <Lyric lyricData={lyricData} />

        <View style={tw`flex-row items-center justify-between`}>
          <ButtonIcon
            name="OutlineHeart"
            size={TOP_ICON_SIZE}
            fill={ICON_COLOR}
            onPress={() => { console.log('测试按钮') }}
          />
          <ButtonIcon
            name="Download"
            size={TOP_ICON_SIZE}
            fill={ICON_COLOR}
            onPress={() => { console.log('测试按钮') }}
          />
          <ButtonIcon
            name="Comment"
            size={TOP_ICON_SIZE}
            fill={ICON_COLOR}
            onPress={() => { console.log('测试按钮') }}
          />
          <ButtonIcon
            name="VerticalMore"
            size={TOP_ICON_SIZE}
            fill={ICON_COLOR}
            onPress={() => { console.log('测试按钮') }}
          />
        </View>
        
        <ProgressBar style={tw`my-8`} />

        <View style={tw`flex-row items-center justify-between pb-5`}>
          <ButtonIcon
            name="OutlineShuffle"
            size={BOTTOM_ICON_SIZE}
            fill={ICON_COLOR}
          />
          <ButtonIcon
            name="SolidPrevious"
            size={BOTTOM_ICON_SIZE}
            fill={ICON_COLOR}
            onPress={() => { onCoverSwitchFinish(true) }}
          />
          <RectButton
            activeOpacity={0.8}
            style={tw`rounded-full w-14 h-14 bg-red-500 flex-row justify-center items-center`}
            onPress={onPlay2Pause}
          >
            <Icon
              name={playerState === State.Playing ? 'Pause' : 'SolidPlay'}
              width={20}
              height={20}
              fill={tw.color('white')}
              style={{ transform: [{ translateX: 1 }] }}
            />
          </RectButton>
          <ButtonIcon
            name="SolidNext"
            size={BOTTOM_ICON_SIZE}
            fill={ICON_COLOR}
            onPress={() => { onCoverSwitchFinish(false) }}
          />
          <ButtonIcon
            name="MusicList"
            size={BOTTOM_ICON_SIZE}
            fill={ICON_COLOR}
            onPress={() => { bottomPlayerQueueRef.current?.snapToIndex(0) }}
          />
        </View>
      </SafeAreaView>
    </BottomSheet>
  )
})

export default Player
