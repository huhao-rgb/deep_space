import { useNavigationContainerRef } from '@react-navigation/native'
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import type { EdgeInsets } from 'react-native-safe-area-context'

const nav = useNavigationContainerRef()

export type App = {
  safeAreaInsets: EdgeInsets | null
  navigationContainer: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null
  setSafeAreaInsets: (insets: EdgeInsets) => void
  setNavigationContainer: (ref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>) => void
}
