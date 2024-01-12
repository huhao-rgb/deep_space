import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface PlayListBlockProps {
  size: number
  name?: string
  imageUrl?: string
  id?: string
  showPlayIcon?: boolean
  showHardShadow?: boolean
  style?: StyleProp<ViewStyle>
  play?: () => void
  renderExtra?: () => ReactNode
}
