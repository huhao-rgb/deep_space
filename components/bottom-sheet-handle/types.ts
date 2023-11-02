import type { ViewStyle, StyleProp } from 'react-native'

import type { BottomSheetHandleProps } from '@gorhom/bottom-sheet'

export interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>
}