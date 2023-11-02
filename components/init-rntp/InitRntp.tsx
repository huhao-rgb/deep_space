import type { FC } from 'react'
import { memo, useEffect } from 'react'

import { shallow } from 'zustand/shallow'

import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  Capability
} from 'react-native-track-player'

import { usePlayer, usePlayerState } from '@/store'

TrackPlayer.registerPlaybackService(() => require('../../service'))

const events = [
  Event.PlaybackState,
  Event.RemotePlay,
  Event.RemotePause,
  Event.RemoteNext,
  Event.RemotePrevious
]

const InitRntp: FC = () => {
  const [
    initRntpQuene,
    currentPlayIndex,
    setCurrentPlayIndex
  ] = usePlayer(
    (s) => [
      s.initRntpQuene,
      s.currentPlayIndex,
      s.setCurrentPlayIndex
    ],
    shallow
  )
  const [setPlayerState] = usePlayerState(
    (s) => [s.setPlayerState],
    shallow
  )

  useEffect(
    () => {
      ;(async () => {
        await TrackPlayer.setupPlayer()

        TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious
          ],
          playIcon: require('@/assets/rntp/play.png'),
          pauseIcon: require('@/assets/rntp/pause.png'),
          stopIcon: require('@/assets/rntp/stop.png'),
          previousIcon: require('@/assets/rntp/previous.png'),
          nextIcon: require('@/assets/rntp/next.png')
        })

        initRntpQuene()
      })()
    },
    []
  )

  useTrackPlayerEvents(events, (event) => {
    switch (event.type) {
      case Event.PlaybackState:
        setPlayerState(event.state)
        break
      case Event.RemotePlay:
        setPlayerState(State.Paused)
        break
      case Event.RemotePause:
        setPlayerState(State.Playing)
        break
      case Event.RemoteNext:
        setCurrentPlayIndex(currentPlayIndex + 1)
        break
      case Event.RemotePrevious:
        setCurrentPlayIndex(currentPlayIndex === 0 ? 0 : currentPlayIndex - 1)
        break
      default:
        break
    }
  })

  return null
}

export default memo(InitRntp)
