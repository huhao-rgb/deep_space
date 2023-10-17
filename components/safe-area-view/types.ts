import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

import type { EdgeInsets } from 'react-native-safe-area-context'

export type Edge = keyof EdgeInsets

export interface SafeAreaViewProps {
  edges?: Edge[]
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}
