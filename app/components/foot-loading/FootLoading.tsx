import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle
} from 'react'
import { View, Text } from 'react-native'

import Lottie from 'lottie-react-native'

import tw from '@/tailwind'
import type { FootLoadingProps, FootLoadingRef } from './types'

const FootLoading = forwardRef<FootLoadingRef, FootLoadingProps>((props, ref) => {
  const {
    complete = false,
    loadingText = '光速飞行中...',
    completeText = '宇宙的尽头在哪里了？',
    style,
    containerStyle
  } = props

  const lottieAnimated = useRef<Lottie>(null)

  useImperativeHandle(ref, () => ({
    play,
    pause
  }))

  useEffect(
    () => {
      complete ? pause() : play()
    },
    [complete]
  )

  const play = useCallback(() => {
    lottieAnimated.current?.play()
  }, [])

  const pause = useCallback(() => {
    lottieAnimated.current?.pause()
  }, [])

  return (
    <View style={[tw.style('flex', 'flex-row', 'items-center', 'justify-center'), containerStyle]}>
      <Lottie
        ref={lottieAnimated}
        source={require('@/assets/lottie/loading.json')}
        style={[tw.style('h-18'), style]}
      />
      <Text style={[tw.style('text-sm', 'text-gray-600')]}>{complete ? completeText : loadingText}</Text>
    </View>
  )
})

export default FootLoading
