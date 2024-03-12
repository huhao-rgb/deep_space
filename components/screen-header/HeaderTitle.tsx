import type { FC } from 'react'

import { Text } from 'react-native'
import type {
  TextProps,
  TextStyle,
  StyleProp
} from 'react-native'

import { tw } from '@/utils'

type Props = Omit<TextProps, 'style'> & {
  tintColor?: string
  children?: string
  style?: StyleProp<TextStyle>
}

const HeaderTitle: FC<Props> = (props) => {
  const {
    tintColor,
    style,
    children,
    ...rest
  } = props

  return (
    <Text
      numberOfLines={1}
      {...rest}
      style={[
        { color: tintColor ?? tw.color('slate-800') },
        tw`text-lg`,
        style
      ]}
    >
      {children}
    </Text>
  )
}

export default HeaderTitle
