import type { StyleProp, ViewStyle } from 'react-native'

export type ToastType = 'success' | 'error' | 'loading' | 'warning' | 'custom'

export type ToastPosition =
  | 'top'
  | 'center'
  | 'bottom'

export type Renderable = JSX.Element | string | null

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue
export type ValueOrFunction<TValue, TArg> =
  | TValue
  | ValueFunction<TValue, TArg>

export interface Toast {
  type: ToastType
  id: string
  message: ValueOrFunction<Renderable, Toast>
  icon?: Renderable
  duration?: number
  pauseDuration: number
  position?: ToastPosition
  style?: StyleProp<ViewStyle>
  height?: number
}

export type ToastOptions = Partial<
  Pick<
    Toast,
    | 'id'
    | 'icon'
    | 'duration'
    | 'style'
    | 'position'
  >
>

export type DefaultToastOptions = ToastOptions & {
  [key in ToastType]?: ToastOptions
}
