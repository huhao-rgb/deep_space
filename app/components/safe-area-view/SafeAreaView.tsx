import type { FC } from 'react'

import type { SafeAreaViewProps } from 'react-native-safe-area-context'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

import tw from '../../tailwind'

type Props = {
  enablePageMargin?: boolean
} & SafeAreaViewProps

const SafeAreaView: FC<Props> = (props) => {
  const {
    children,
    enablePageMargin = false,
    edges = ['top', 'bottom'],
    style,
    ...safeAreaViewProps
  } = props

  return (
    <RNSafeAreaView
      style={[tw.style('flex-1', enablePageMargin && 'px-4'), style]}
      edges={edges}
      {...safeAreaViewProps}
    >
      {children}
    </RNSafeAreaView>
  )
}

export default SafeAreaView