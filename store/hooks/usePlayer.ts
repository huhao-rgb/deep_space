import type { RefObject } from 'react'
import { createRef } from 'react'

import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zutandMmkvStorage } from '@/utils'

import type { BottomPlayerRef } from '@/components/bottom-player'

interface PlayerState {
  miniPlayerRef: RefObject<BottomPlayerRef>
  miniPlayerHeight: number
  isShowMiniPlayer: boolean
  songList: any[]
  setShowMiniPlayer: () => void
  setMniPlayerHeight: (h: PlayerState['miniPlayerHeight']) => void
  setSongList: (list: any[]) => void
}

export const usePlayer = createWithEqualityFn<PlayerState>()(
  persist(
    (set, get) => ({
      miniPlayerRef: createRef(),
      miniPlayerHeight: 0,
      isShowMiniPlayer: false,
      songList: [],
      setShowMiniPlayer: () => {
        const { songList, miniPlayerRef } = get()
        const show = songList.length > 0
        set({ isShowMiniPlayer: show })
        console.log(miniPlayerRef.current)
        miniPlayerRef.current?.setShowPlayer(show)
      },
      setMniPlayerHeight: (h) => { set({ miniPlayerHeight: h }) },
      setSongList: (list) => {
        set({ songList: list })
        const { songList, miniPlayerRef } = get()
        miniPlayerRef.current?.setShowPlayer(songList.length > 0)
      }
    }),
    {
      name: 'mmkv-zustand-storage-player',
      storage: createJSONStorage(() => zutandMmkvStorage)
    }
  )
)
