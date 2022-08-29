import type { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import type { EdgeInsets } from 'react-native-safe-area-context'

export enum ThemeEnum {
  Default = 'white',
  Blue = 'blue',
  Block = 'black' // 暗黑模式默认为黑色主题
}

export type App = {
  theme: ThemeEnum
  safeAreaInsets: EdgeInsets | null
  navigationContainer: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null
  setTheme: (theme: ThemeEnum) => void
  setSafeAreaInsets: (insets: EdgeInsets) => void
  setNavigationContainer: (ref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>) => void
}
