import type { StyleProp, ViewStyle } from 'react-native'

export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom'

export type ToastPosition =
  | 'top'
  | 'bottom'

export type Renderable = JSX.Element | string | null

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue
export type ValueOrFunction<TValue, TArg> =
  | TValue
  | ValueFunction<TValue, TArg>

const isFunction = <TValue, TArg>(
    valOrFunction: ValueOrFunction<TValue, TArg>
  ): valOrFunction is ValueFunction<TValue, TArg> =>
    typeof valOrFunction === 'function'

export const resolveValue = <TValue, TArg>(
    valOrFunction: ValueOrFunction<TValue, TArg>,
    arg: TArg
  ): TValue => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction)

export interface Toast {
  type: ToastType
  id: string
  message: ValueOrFunction<Renderable, Toast>
  icon?: Renderable
  duration?: number
  pauseDuration: number
  position?: ToastPosition
  style?: StyleProp<ViewStyle>

  createdAt: number
  visible: boolean

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

export interface ToasterProps {
  position?: ToastPosition
  toastOptions?: DefaultToastOptions
  reverseOrder?: boolean
  gutter?: number
  style?: StyleProp<ViewStyle>
  children?: (toast: Toast) => JSX.Element
}

export interface ToastWrapperProps {
  id: string
  style?: StyleProp<ViewStyle>
  onHeightUpdate: (id: string, height: number) => void
  children?: React.ReactNode
}