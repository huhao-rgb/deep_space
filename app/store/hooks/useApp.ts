import { create, StateCreator } from 'zustand'

export enum ThemeEnum {
  Default = 'white',
  Blue = 'blue',
  Block = 'black' // 暗黑模式默认为黑色主题
}

export type App = {
  theme: ThemeEnum
  tabBarHeight: number | null
  setTheme: (theme: ThemeEnum) => void
  setTabBarHeight: (height: number) => void
}

const createStore: StateCreator<App> = (set) => ({
  theme: ThemeEnum.Default,
  tabBarHeight: null,
  setTheme: (theme) => set({ theme }),
  setTabBarHeight: (height) => set({ tabBarHeight: height })
})

export const useAppStore = create(createStore)
