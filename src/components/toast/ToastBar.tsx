import { memo } from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

import type {
  Toast,
  ToastPosition,
  Renderable
} from './types'
import { resolveValue } from './types'

interface ToastBarProps {
  toast: Toast
  position?: ToastPosition
  style?: StyleProp<ViewStyle>
  children?: (components: {
    icon: Renderable
    message: Renderable
  }) => Renderable
}

const ToastBar = memo<ToastBarProps>((props) => {
  const {
    toast,
    position,
    style,
    children
  } = props

  const icon = <View />
  const toastResolveValue = resolveValue(toast.message, toast)

  const message = (
    <View style={styles.message}>
      {typeof toastResolveValue === 'string'
        ? (
            <Text style={styles.messageText}>{toastResolveValue}</Text>
          )
        : toastResolveValue}
    </View>
  )

  return (
    <Shadow
      startColor="#00000009"
      distance={16}
      style={{ width: '100%' }}
    >
      <View
        style={[
          styles.toastBarBase,
          style,
          toast.style
        ]}
      >
        {typeof children === 'function'
          ? children({ icon, message })
          : (
              <>
                {icon}
                {message}
              </>
            )}
      </View>
    </Shadow>
  )
})

export default ToastBar

const styles = StyleSheet.create({
  toastBarBase: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginVertical: 10,
    flex: 1
  },
  messageText: {}
})
