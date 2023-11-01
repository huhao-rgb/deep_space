// 底部播放队列
import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import { View, Text } from 'react-native'
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BorderlessButton } from 'react-native-gesture-handler'

import Icon from '../svg-icon'

import {
  usePlayer,
  usePlayerState
} from '@/store'
import { tw } from '@/utils'

const BottomPlayerQueue: FC = () => {
  const [songList] = usePlayer((s) => [s.songList])
  const [bottomPlayerQueueRef] = usePlayerState((s) => [s.bottomPlayerQueueRef])

  const snapPoints = useMemo(() => ['60%'], [])

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    []
  )

  return (
    <BottomSheet
      ref={bottomPlayerQueueRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
    >
      <View style={tw`px-4 py-3 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-base text-gray-800`}>播放列表</Text>
          <Text style={tw`ml-3 text-sm text-slate-500`}>{songList.length}首歌曲</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <BorderlessButton
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
            style={tw`p-1 ml-5`}
          >
            <Icon
              name="Delete"
              fill={tw.color('slate-500')}
              width={19}
              height={19}
            />
          </BorderlessButton>
        </View>
      </View>
    </BottomSheet>
  )
}

export default BottomPlayerQueue
