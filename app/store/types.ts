import { useNavigationContainerRef } from '@react-navigation/native'
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native'

const nav = useNavigationContainerRef()

export type App = {
  navigationContainer: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null
  setNavigationContainer: (ref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>) => void
}
