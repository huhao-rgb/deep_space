import type { RefObject } from 'react'
import { createRef } from 'react'

import { createWithEqualityFn } from 'zustand/traditional'

import BottomSheet from '@gorhom/bottom-sheet'
import { State } from 'react-native-track-player'

export interface UsePlayerState {
  playerState: State
  bottomPlayerQueueRef: RefObject<BottomSheet>
  miniPlayerHeight: number
  showMiniPlayer: boolean
  setPlayerState: (state: State) => void
  setMniPlayerHeight: (h: UsePlayerState['miniPlayerHeight']) => void
  setShowMiniPlayer: (isShow: UsePlayerState['showMiniPlayer']) => void
}

export const usePlayerState = createWithEqualityFn<UsePlayerState>(
  (set) => ({
    playerState: State.None,
    bottomPlayerQueueRef: createRef(),
    miniPlayerHeight: 0,
    showMiniPlayer: false,
    setMniPlayerHeight: (h) => { set({ miniPlayerHeight: h }) },
    setPlayerState: (state) => { set({ playerState: state }) },
    setShowMiniPlayer: (isShow) => { set({ showMiniPlayer: isShow }) }
  }),
  Object.is
)
