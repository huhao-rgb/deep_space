import type { SharedValue } from 'react-native-reanimated'

import { createContext } from '@/hooks'

interface PlayerContext {
  startTranslationX: SharedValue<number>
  translationX: SharedValue<number>
}

const [usePlayerContext, PlayerContextProvider] = createContext<PlayerContext>()

export {
  usePlayerContext,
  PlayerContextProvider
}
