// 底部播放队列
import type { FC } from 'react'
import {
  useMemo,
  useCallback,
  useState,
  useRef,
  memo
} from 'react'

import { shallow } from 'zustand/shallow'

import { View, Text } from 'react-native'

import TrackPlayer from 'react-native-track-player'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps, BottomSheetHandleProps } from '@gorhom/bottom-sheet'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { FlashList } from '@shopify/flash-list'
import type { ListRenderItem } from '@shopify/flash-list'

import VipLabel from '../vip-label'
import Icon from '../svg-icon'
import BottomSheetHandle from '../bottom-sheet-handle'

import LottieIcon from './LottieIcon'

import {
  usePlayer,
  usePlayerState
} from '@/store'
import { tw } from '@/utils'

import type { CostomTrack } from '@/hooks'

const BottomPlayerQueue: FC = () => {
  const [songList, currentPlayIndex] = usePlayer(
    (s) => [s.songList, s.currentPlayIndex],
    shallow
  )
  const [bottomPlayerQueueRef] = usePlayerState(
    (s) => [s.bottomPlayerQueueRef],
    shallow
  )

  const { bottom } = useSafeAreaInsets()

  const snapPoints = useMemo(() => ['60%'], [])
  const [firstOpen, setFirstOpen] = useState(false)

  const flashRef = useRef<FlashList<any>>(null)

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

  const onChange = useCallback(
    (index: number) => {
      if (index === 0 && !firstOpen) {
        setFirstOpen(true)
        setTimeout(() => {
          flashRef.current?.scrollToIndex({
            animated: true,
            index: currentPlayIndex
          })
        }, 500)
      }
      if (index === 0) {
        flashRef.current?.scrollToIndex({
          animated: true,
          index: currentPlayIndex
        })
      }
    },
    [firstOpen, currentPlayIndex]
  )

  const renderItem = useCallback<ListRenderItem<CostomTrack>>(
    ({ item, index, extraData }) => {
      const onPlaySong = () => {
        TrackPlayer.skip(index, 0)
        TrackPlayer.play()
      }

      const { playIndex } = extraData

      return (
        <RectButton
          style={tw`flex-row items-center py-2`}
          onPress={onPlaySong}
        >
          <View style={tw`flex-1 flex-row items-center`}>
            <Text style={tw`text-sm text-slate-700 mr-3`}>{index + 1}</Text>
            {item.fee === 1 && <VipLabel />}
            <Text
              numberOfLines={1}
              style={tw`text-base text-slate-700 flex-1`}
            >
              {item.name} - 

              <Text style={tw`ml-3 text-sm text-slate-600`}>{item.ar?.[0]?.name}</Text>
            </Text>
          </View>
          <View
            style={[
              tw`ml-4 w-8 h-8`,
              { opacity: playIndex === index ? 1 : 0 }
            ]}
          >
            <LottieIcon />
          </View>
          <BorderlessButton
            style={[
              tw`p-1 ml-3`,
              { transform: [{ translateX: 2 }] }
            ]}
          >
            <Icon
              name="Close"
              width={16}
              height={16}
              fill={tw.color('slate-400')}
            />
          </BorderlessButton>
        </RectButton>
      )
    },
    [songList]
  )

  return (
    <BottomSheet
      ref={bottomPlayerQueueRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleComponent={renderHandle}
      onChange={onChange}
    >
      <View style={tw`px-4 py-3 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-lg text-gray-800`}>播放列表</Text>
          <Text style={tw`ml-3 text-sm text-slate-500`}>{songList.length}首歌曲</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <BorderlessButton
            activeOpacity={0.8}
            style={tw`p-1`}
          >
            <Icon
              name="Download"
              fill={tw.color('slate-500')}
              width={22}
              height={22}
            />
          </BorderlessButton>
          <BorderlessButton
            activeOpacity={0.8}
            style={tw`p-1 ml-5`}
          >
            <Icon
              name="Delete"
              fill={tw.color('slate-500')}
              width={18}
              height={18}
            />
          </BorderlessButton>
        </View>
      </View>
      {firstOpen && (
        <FlashList
          ref={flashRef}
          data={songList}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={80}
          contentContainerStyle={{ paddingBottom: bottom, paddingHorizontal: 20 }}
          extraData={{ playIndex: currentPlayIndex }}
          renderItem={renderItem}
          // @ts-ignore
          renderScrollComponent={BottomSheetScrollView}
        />
      )}
    </BottomSheet>
  )
}

export default memo(BottomPlayerQueue)
