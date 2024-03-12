import type { FC } from 'react'
import { useRef, useEffect } from 'react'

import Lottie from 'lottie-react-native'
import { State } from 'react-native-track-player'

import { tw } from '@/utils'
import { usePlayerState } from '@/store'

const LottieIcon: FC = () => {
  const lottieRef = useRef<Lottie>(null)

  const [playerState] = usePlayerState((s) => [s.playerState])

  useEffect(
    () => {
      playerState === State.Playing
        ? lottieRef.current?.play()
        : lottieRef.current?.pause()
    },
    [playerState]
  )

  return (
    <Lottie
      ref={lottieRef}
      autoPlay={false}
      loop
      source={require('@/assets/lottie/music-playing.json')}
      style={tw`w-8 h-8`}
    />
  )
}

export default LottieIcon
