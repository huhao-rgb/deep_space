import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zutandMmkvStorage } from '@/utils'

interface SystemState {
  cacheDuration: number // 接口缓存时间
  maxSearchHistoryNumber: number // 最大搜索记录数
  setCacheDuration: (duration: SystemState['cacheDuration']) => void
  setMaxSearchHistoryNumber: (num: SystemState['maxSearchHistoryNumber']) => void
}

export const useSystem = createWithEqualityFn<SystemState>()(
  persist(
    (set) => ({
      cacheDuration: 1000 * 60 * 60 * 2,
      maxSearchHistoryNumber: 20,
      setCacheDuration: (duration) => { set({ cacheDuration: duration }) },
      setMaxSearchHistoryNumber: (num) => { set({ maxSearchHistoryNumber: num }) }
    }),
    {
      name: 'mmkv-zustand-system',
      storage: createJSONStorage(() => zutandMmkvStorage)
    }
  ),
  Object.is
)
