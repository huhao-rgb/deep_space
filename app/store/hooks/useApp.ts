import { useNavigationContainerRef } from '@react-navigation/native'
import create, { StateCreator } from 'zustand'

import { App } from '../types'

const createStore: StateCreator<App> = (set, get) => ({
  navigationContainer: useNavigationContainerRef(),
  setNavigationContainer: (ref) => set({ navigationContainer: ref })
})

const useApp = create(createStore)

export default useApp
