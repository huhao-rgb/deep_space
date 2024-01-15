import type { FC } from 'react'

import { View, Text } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { useNavigation } from 'expo-router'

import SafeAreaView from '../safe-area-view'
import Icon from '../svg-icon'

import { tw } from '@/utils'

import type { NavBarProps } from './types'

const NavBar: FC<NavBarProps> = (props) => {
  const {
    title,
    bgTransparent = false,
    style,
    titleStyle,
    contentStyle,
    backIconColor = tw.color('slate-800'),
    backIconStyle,
    renderTitle,
    renderRight,
    onPress
  } = props

  const isTitle = title !== undefined || renderTitle !== undefined

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        tw`pb-2 px-5 bg-white`,
        bgTransparent && tw`bg-transparent`,
        style
      ]}
    >
      <View
        style={[
          tw`pt-1 flex-row items-center justify-between`,
          contentStyle
        ]}
      >
        <View
          style={[
            tw`mr-4`,
            backIconStyle
          ]}
        >
          <BorderlessButton onPress={onPress}>
            <Icon
              name="LeftArrow"
              size={26}
              fill={backIconColor}
            />
          </BorderlessButton>
        </View>
        {isTitle && (renderTitle?.() || (
          <View style={tw`my-3 flex-1`}>
            <Text
              numberOfLines={1}
              style={[
                tw`text-base text-slate-800`,
                titleStyle
              ]}
            >
              {title}
            </Text>
          </View>
        ))}
        {renderRight?.()}
      </View>
    </SafeAreaView>
  )
}

export default NavBar
