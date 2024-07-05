import type { FC } from 'react'

import { View, Text } from 'react-native'

import { tw } from '@/utils'
import type { VipLabelProps } from './types'

const VipLabel: FC<VipLabelProps> = (props) => {
  const {
    labelText = 'vip',
    style,
    labelStyle
  } = props

  return (
    <View
      style={[
        tw`mr-2 px-1 rounded bg-red-500`,
        { paddingVertical: 1 },
        style
      ]}
    >
      <Text
        style={[
          tw`text-white text-2xs`,
          labelStyle
        ]}
      >
        {labelText}
      </Text>
    </View>
  )
}

export default VipLabel
