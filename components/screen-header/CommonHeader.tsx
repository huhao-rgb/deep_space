import type { FC, ComponentProps } from 'react'
import { useCallback, useMemo } from 'react'

import {
  View,
  StyleSheet,
  Platform
} from 'react-native'

import { BorderlessButton } from 'react-native-gesture-handler'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'

import SafeAreaView from '../safe-area-view'

import HeaderTitle from './HeaderTitle'
import type { CommonHeaderProps } from './types'

import { tw, getSvgProps } from '@/utils'

const DEFAULT_HEIGHT = Platform.OS === 'ios' ? 50 : 54

const CommonHeader: FC<CommonHeaderProps> = (props) => {
  const {
    options,
    navigation
  } = props
  const {
    title,
    headerTitle: customTitle,
    headerTitleAlign = Platform.select({
      ios: 'center',
      default: 'left'
    }),
    headerTransparent,
    headerStyle,
    headerBackground,
    headerTintColor,
    headerTitleStyle,
    contentStyle
  } = options

  const back = useCallback(
    () => { navigation.goBack() },
    [navigation]
  )

  const headerTitle = useMemo(
    () => typeof customTitle !== 'function'
      ? (hProps: ComponentProps<typeof HeaderTitle>) => <HeaderTitle {...hProps} />
      : customTitle,
    []
  )

  return (
    <SafeAreaView
      edges={['top']}
      style={[headerStyle]}
    >
      <View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          { zIndex: 0 }
        ]}
      >
        {headerBackground?.()}
      </View>
      <View
        style={[
          tw`w-full flex-row items-center`,
          { height: DEFAULT_HEIGHT },
          contentStyle
        ]}
      >
        <BorderlessButton
          style={tw`ml-5 mr-2 h-full justify-center`}
          onPress={back}
        >
          <ArrowLeftIcon
            {...getSvgProps({
              theme: 'light',
              size: 'lg',
              isOutline: false
            })}
          />
        </BorderlessButton>
        <View>
          {headerTitle({
            tintColor: headerTintColor,
            children: title as any,
            style: headerTitleStyle
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CommonHeader
