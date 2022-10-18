import create, { StateCreator } from 'zustand'

import { App, ThemeEnum } from '../types'

const createStore: StateCreator<App> = (set, get) => ({
  theme: ThemeEnum.Default,
  safeAreaInsets: null,
  navigationContainer: null,
  setTheme: (theme) => set({ theme }),
  setSafeAreaInsets: () => {},
  setNavigationContainer: (ref) => set({ navigationContainer: ref })
})

const useAppStore = create(createStore)

export default useAppStore
