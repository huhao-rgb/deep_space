/**
 * 使用mmkv结合zustand持久化主题数据
 * zustand配置参考 https://docs.pmnd.rs/zustand/integrations/persisting-store-data
 * react-native-mmkv配置参考 https://github.com/mrousavy/react-native-mmkv/blob/master/docs/WRAPPER_ZUSTAND_PERSIST_MIDDLEWARE.md
 */
import { create } from 'zustand'

import type { StateStorage } from 'zustand/middleware'
import { persist, createJSONStorage } from 'zustand/middleware'

import { mmkvDefaultStorage } from '@/utils'

type Theme = 'dark' | 'light'

export type ThemeStoreState = {
  theme: Theme
}

export type ThemeStoreAction = {
  setTheme: (theme: Theme) => void
}

const zutandStorage: StateStorage = {
  setItem: (name, value) => {
    return mmkvDefaultStorage.set(name, value)
  },
  getItem: (name) => {
    const value = mmkvDefaultStorage.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return mmkvDefaultStorage.delete(name)
  }
}

export const useThemeStore = create<ThemeStoreState & ThemeStoreAction>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => { set({ theme }) }
    }),
    {
      name: 'mmkv-zutand-storage',
      storage: createJSONStorage(() => zutandStorage)
    }
  )
)
