import type { ReactNode, ReactElement } from 'react'

import type { StyleProp, TextStyle } from 'react-native'

export interface RenderInfoProps {
  title: string
  subtitle: string
  titleStyle?: StyleProp<TextStyle>
  subtitleStyle?: StyleProp<TextStyle>
}

export interface RenderPicImgProps {
  picUrl?: string
  picUrlSize?: number
}

export interface ListItemProps extends Partial<RenderInfoProps>, RenderPicImgProps {
  index?: number
  circlePic?: boolean // 圆形pic
  renderInfo?: (info: RenderInfoProps) => ReactNode
  renderPicImg?: (picProps?: RenderPicImgProps) => ReactNode
  ListItemRight?: ReactElement
  onPress?: () => void
}
