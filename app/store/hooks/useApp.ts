import { create, StateCreator } from 'zustand'

type Theme = 'dark' | 'light'

export type App = {
  theme: Theme // 当前主题的模式
  tabBarHeight: number | null // tabbar的高度
  withDeviceColorScheme: boolean // 跟随系统主题
  setTheme: (theme: Theme) => void
  setWithDeviceColorScheme: (withDevice: boolean) => void
  setTabBarHeight: (height: number) => void
}

const createStore: StateCreator<App> = (set) => ({
  theme: 'light',
  tabBarHeight: null,
  withDeviceColorScheme: false,
  setTheme: (theme) => set({ theme }),
  setWithDeviceColorScheme: (withDevice) => { set({ withDeviceColorScheme: withDevice }) },
  setTabBarHeight: (height) => set({ tabBarHeight: height })
})

export const useAppStore = create(createStore)
