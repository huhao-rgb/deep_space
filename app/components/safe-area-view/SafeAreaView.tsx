import type { FC } from 'react'
import { useMemo } from 'react'
import { View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { SafeAreaViewProps } from './types'

type EdgeStyles = Partial<{
  paddingTop: number
  paddingLeft: number
  paddingRight: number
  paddingBottom: number
}>

const SafeAreaView: FC<SafeAreaViewProps> = (props) => {
  const {
    edges,
    style,
    children
  } = props

  const insets = useSafeAreaInsets()

  const edgeStyles = useMemo<EdgeStyles | undefined>(
    () => {
      if (edges !== undefined) {
        const style: EdgeStyles = {}

        edges.forEach(edge => {
          const edgeUpperCase = edge.replace(edge[0], edge[0].toUpperCase())
          const key = `padding${edgeUpperCase}` as keyof EdgeStyles

          style[key] === undefined && (style[key] = insets[edge])
        })

        return style
      }
    },
    [edges, insets]
  )

  return (
    <View
      style={[
        edgeStyles,
        style
      ]}
    >
      {children}
    </View>
  )
}

export default SafeAreaView
