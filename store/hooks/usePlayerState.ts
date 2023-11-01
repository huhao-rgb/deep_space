import type { RefObject } from 'react'
import { createRef } from 'react'

import { create } from 'zustand'
import { State } from 'react-native-track-player'

import type { BottomPlayerRef } from '@/components/bottom-player'

export interface UsePlayerState {
  playerState: State
  miniPlayerRef: RefObject<BottomPlayerRef>
  miniPlayerHeight: number
  isShowFullPlayer: boolean // 全屏播放器和迷你播放器是互斥的
  isShowMiniPlayer: boolean
  setPlayerState: (state: State) => void
  setIsShowFullPlayer: (show: UsePlayerState['isShowFullPlayer']) => void
  setIsShowMiniPlayer: (show: UsePlayerState['isShowFullPlayer']) => void
  setMniPlayerHeight: (h: UsePlayerState['miniPlayerHeight']) => void
}

export const usePlayerState = create<UsePlayerState>()((set) => ({
  playerState: State.None,
  miniPlayerRef: createRef(),
  miniPlayerHeight: 0,
  isShowFullPlayer: false,
  isShowMiniPlayer: false,
  setIsShowFullPlayer: (show) => { set({ isShowFullPlayer: show }) },
  setIsShowMiniPlayer: (show) => { set({ isShowMiniPlayer: show }) },
  setMniPlayerHeight: (h) => { set({ miniPlayerHeight: h }) },
  setPlayerState: (state) => { set({ playerState: state }) }
}))
