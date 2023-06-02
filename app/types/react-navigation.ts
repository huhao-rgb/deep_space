/**
 * react navigation typescript支持
 * 请参考https://reactnavigation.org/docs/typescript/
 */

import type {
  NativeStackScreenProps,
  NativeStackNavigationProp
} from '@react-navigation/native-stack'
import type {
  NavigatorScreenParams,
  CompositeScreenProps,
  CompositeNavigationProp
} from '@react-navigation/native'
import type {
  BottomTabScreenProps,
  BottomTabNavigationProp
} from '@react-navigation/bottom-tabs'

export type BottomTabsParamsList = {
  Home: undefined
  My: undefined
}

// 所有屏幕的路由参数
export type RootStackParamList = {
  TabNavigation: NavigatorScreenParams<BottomTabsParamsList>
  Search: undefined
}

// route和navigation道具
export type RouteProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>
export type NavigationProps<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>
export type RootStackNavigationProps<T extends keyof RootStackParamList> =
NativeStackNavigationProp<RootStackParamList, T>

// 底部切换 route和navigation道具
export type BottomTabsScreenProps<T extends keyof BottomTabsParamsList> = CompositeScreenProps<
BottomTabScreenProps<BottomTabsParamsList, T>,
RootStackScreenProps<keyof RootStackParamList>
>
export type BottomTabsNavigationProps<T extends keyof BottomTabsParamsList> = CompositeNavigationProp<
BottomTabNavigationProp<BottomTabsParamsList, T>,
RootStackNavigationProps<keyof RootStackParamList>
>
