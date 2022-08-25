import create, { StateCreator } from 'zustand'

import { App } from '../types'

const createStore: StateCreator<App> = (set, get) => ({
  safeAreaInsets: null,
  navigationContainer: null,
  setSafeAreaInsets: () => {},
  setNavigationContainer: (ref) => set({ navigationContainer: ref })
})

const useApp = create(createStore)

export default useApp
