import { StyleProp, ViewStyle } from 'react-native'
import type { AnimatedLottieViewProps } from 'lottie-react-native'

export type FootLoadingProps = {
  complete?: boolean
  loadingText?: string
  completeText?: string
  containerStyle?: StyleProp<ViewStyle>
} & Omit<
  AnimatedLottieViewProps,
  | 'source'
>

export type FootLoadingRef = {
  play: () => void
  pause: () => void
}
