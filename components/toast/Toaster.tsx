import type { FC } from 'react'
import { useCallback } from 'react'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'

import Animated, { SequencedTransition } from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useToaster } from './hooks'
import type {
  ToasterProps,
  ToastWrapperProps,
  ToastPosition
} from './types'
import { resolveValue } from './types'
import { AmplifiedInUp, AmplifiedOutUp } from './layout-animations'

import ToastBar from './ToastBar'

const ToastWrapper: FC<ToastWrapperProps> = (props) => {
  const {
    id,
    style,
    onHeightUpdate,
    children
  } = props

  const onContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      onHeightUpdate(id, height)
    },
    [id, onHeightUpdate]
  )

  const pan = Gesture.Pan()

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={style}
        pointerEvents="auto"
        entering={AmplifiedInUp as any}
        exiting={AmplifiedOutUp as any}
        layout={SequencedTransition.delay(230)}
        onLayout={onContainerLayout}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}

const getPositionStyle = (
  position: ToastPosition,
  offset: number
): ViewStyle => {
  const isTop = position === 'top'
  const translateY = offset * (isTop ? 1 : -1)
  const verticalStyle = isTop ? { top: 0 } : { bottom: 0 }

  return {
    position: 'absolute',
    left: 0,
    right: 0,
    transform: [{ translateY }],
    ...verticalStyle
  }
}

const DEFAULT_OFFSET = 18

const Toast: FC<ToasterProps> = (props) => {
  const {
    reverseOrder,
    position = 'top',
    toastOptions,
    gutter,
    children,
    style
  } = props

  const { toasts, handlers } = useToaster(toastOptions)

  const { top, bottom } = useSafeAreaInsets()

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        {
          position: 'absolute',
          top: DEFAULT_OFFSET + top,
          right: DEFAULT_OFFSET,
          bottom: DEFAULT_OFFSET + bottom,
          left: DEFAULT_OFFSET
        },
        style
      ]}
    >
      {toasts.map((t) => {
        const toastPosition = t.position || position
        const offset = handlers.calculateOffset(t, {
          reverseOrder,
          gutter,
          defaultPosition: position,
        })
        const positionStyle = getPositionStyle(toastPosition, offset)

        return (
          <ToastWrapper
            id={t.id}
            key={t.id}
            style={[
              positionStyle
            ]}
            onHeightUpdate={handlers.updateHeight}
          >
            {t.type === 'custom'
              ? resolveValue(t.message, t)
              : children
                  ? children(t)
                  : <ToastBar toast={t} position={toastPosition} />}
          </ToastWrapper>
        )
      })}
    </Animated.View>
  )
}

export default Toast
