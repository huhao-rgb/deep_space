import type { SharedValue } from 'react-native-reanimated'

import { createContext } from '@/hooks'

enum GestureState {
  BEIGIN = 0,
  ACTIVATE,
  ENDED
}

interface PlayerContext {
  translationX: SharedValue<number>
  gestureState: SharedValue<GestureState>
}

const [usePlayerContext, PlayerContextProvider] = createContext<PlayerContext>()

export {
  usePlayerContext,
  PlayerContextProvider,
  GestureState
}
