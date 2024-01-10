import { memo, useCallback } from 'react'

import { RectButton } from 'react-native-gesture-handler'
import TrackPlayer, { State } from 'react-native-track-player'
import { PlayIcon, PauseIcon } from 'react-native-heroicons/solid'

import { useShallow } from 'zustand/react/shallow'

import { tw, getSvgProps } from '@/utils'
import { usePlayerState } from '@/store'

const PlayPuaseBtn = memo(() => {
  const [playerState] = usePlayerState(useShallow((s) => [s.playerState]))

  const onPlay2Pause = useCallback(
    async () => {
      playerState === State.Playing
        ? TrackPlayer.pause()
        : TrackPlayer.play()
    },
    [playerState]
  )

  return (
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
  )
})

export default PlayPuaseBtn
