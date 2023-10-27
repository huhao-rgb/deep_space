import type { FC } from 'react'

import { View, Text } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'

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
    backIconColor = tw.color('slate-800'),
    renderTitle,
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
      <View style={tw`pt-1 flex-row items-center justify-between`}>
        <BorderlessButton onPress={onPress}>
          <Icon
            name="LeftArrow"
            width={26}
            height={26}
            fill={backIconColor}
          />
        </BorderlessButton>
        {isTitle && (<View style={tw`ml-3 flex-1`}>
          {renderTitle?.() || (
            <Text
              numberOfLines={1}
              style={[
                tw`text-base text-slate-800`,
                titleStyle
              ]}
            >
              {title}
            </Text>
          )}
        </View>)}
      </View>
    </SafeAreaView>
  )
}

export default NavBar