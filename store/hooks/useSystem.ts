import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zutandMmkvStorage } from '@/utils'

interface SystemState {
  cacheDuration: number,
  setCacheDuration: (duration: SystemState['cacheDuration']) => void
}

export const useSystem = createWithEqualityFn<SystemState>()(
  persist(
    (set) => ({
      cacheDuration: 1000 * 60 * 60 * 2,
      setCacheDuration: (duration) => { set({ cacheDuration: duration }) }
    }),
    {
      name: 'mmkv-zustand-system',
      storage: createJSONStorage(() => zutandMmkvStorage)
    }
  ),
  Object.is
)
