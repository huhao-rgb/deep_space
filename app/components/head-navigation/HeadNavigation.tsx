import type { FC } from 'react'
import { View, Text } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import PlatformPressable from '../platform-pressable'
import { Icon } from '../svg-icon'

import tw from '@/tailwind'

import { HeadNavationProps } from './types'

const HeadNavitaion: FC<HeadNavationProps> = (props) => {
  const {
    style,
    title,
    leftIcon
  } = props

  const navigation = useNavigation()

  const onLeftIconHandle = () => {
    navigation.goBack()
  }

  return (
    <View style={[tw.style('px-5'), style]}>
      {leftIcon?.() ||
        <PlatformPressable onPress={onLeftIconHandle}>
          <Icon
            name='back'
            width={16}
            height={16}
            viewBox='0 0 1024 1024'
          />
        </PlatformPressable>}
      <View style={tw.style('flex-1')}>
        <Text style={tw.style('text-gray-900', 'text-base')}>{title}</Text>
      </View>
    </View>
  )
}

export default HeadNavitaion
