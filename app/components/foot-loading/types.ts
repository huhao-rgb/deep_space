import { StyleProp, ViewProps } from 'react-native'
import type { AnimatedLottieViewProps } from 'lottie-react-native'

export type FootLoadingProps = {
  loadingText?: string
  completeText?: string
  containerStyle?: StyleProp<ViewProps>
} & Omit<
  AnimatedLottieViewProps,
  | 'source'
>

export type FootLoadingRef = {
  play: () => void
  pause: () => void
}
