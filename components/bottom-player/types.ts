import type { WithTimingConfig } from 'react-native-reanimated'

export interface BottomPlayerProps extends WithTimingConfig {}

export interface BottomPlayerRef {
  setShowPlayer: (show: boolean) => void
}
