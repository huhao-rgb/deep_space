import {
  memo,
  useMemo,
  useCallback
} from 'react'

import {
  View,
  Text,
  useWindowDimensions
} from 'react-native'

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

import { usePlayerState, usePlayer } from '@/store'
import { tw } from '@/utils'

const gapWidth = tw`w-5`.width as number

const TOP_ICON_SIZE = 21
const BOTTOM_ICON_SIZE = 22
const ICON_COLOR = tw.color('slate-800')

const Player = memo(() => {
  const { height, width } = useWindowDimensions()
  const { bottom } = useSafeAreaInsets()

  const snapPoints = useMemo(() => [height + bottom], [height, bottom])
  const coverWidth = useMemo(() => width - gapWidth * 2, [width])

  const [songList, currentPlayIndex] = usePlayer(
    (s) => [s.songList, s.currentPlayIndex],
    shallow
  )
  const [playerRef] = usePlayerState(
    (s) => [s.playerRef],
    shallow
  )

  const currentSong = songList[currentPlayIndex] ?? {}

  console.log('底部状态栏刷新次数')

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
      enablePanDownToClose
      enableOverDrag={false}
      backdropComponent={renderBackdrop}
      handleComponent={renderHandle}
    >
      <SafeAreaView
        edges={['bottom']}
        style={tw`px-5 flex-1`}
      >
        <Image
          source={{ uri: `${currentSong?.al?.picUrl}?param=1000y1000` }}
          style={[
            { width: coverWidth, height: coverWidth },
            tw`rounded-2xl`
          ]}
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
        {/* 三行歌词滚动区域 */}
        <View style={tw`flex-1 flex-col justify-between my-8`}>
          <Text style={tw`text-base text-center`}>歌词行数1</Text>
          <Text style={tw`text-lg font-bold text-center`}>歌词行数2歌词行数2歌词行数2</Text>
          <Text style={tw`text-base text-center`}>歌词行数3</Text>
        </View>

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
          />
          <RectButton
            activeOpacity={0.8}
            style={tw`rounded-full w-14 h-14 bg-red-500 flex-row justify-center items-center`}
          >
            <Icon
              name="SolidPlay"
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
          />
          <ButtonIcon
            name="MusicList"
            size={BOTTOM_ICON_SIZE}
            fill={ICON_COLOR}
          />
        </View>
      </SafeAreaView>
    </BottomSheet>
  )
})

export default Player
