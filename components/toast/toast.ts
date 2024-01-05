import type {
  Renderable,
  Toast,
  ToastType,
  ToastOptions,
  ValueOrFunction,
  DefaultToastOptions
} from './types'
import { resolveValue } from './types'
import { dispatch, ActionType } from './store'

type Message = ValueOrFunction<Renderable, Toast>

type ToastHandler = (message: Message, options?: ToastOptions) => string

export const genId = (() => {
  let count = 0
  return () => {
    return (++count).toString()
  }
})()

const createToast = (
  message: Message,
  type: ToastType = 'blank',
  opts?: ToastOptions
): Toast => ({
  createdAt: Date.now(),
  visible: true,
  type,
  message,
  pauseDuration: 0,
  ...opts,
  id: opts?.id ?? genId()
})

const createHandler =
  (type?: ToastType): ToastHandler =>
  (message, options) => {
    const toast = createToast(message, type, options)
    dispatch({ type: ActionType.UPSERT_TOAST, toast })
    return toast.id
  }

const toast = (message: Message, opts?: ToastOptions) =>
  createHandler('blank')(message, opts)

toast.error = createHandler('error')
toast.success = createHandler('success')
toast.loading = createHandler('loading')
toast.custom = createHandler('custom')

toast.dismiss = (toastId?: string) => {
  dispatch({
    type: ActionType.DISMISS_TOAST,
    toastId
  })
}

toast.remove = (toastId?: string) =>
  dispatch({ type: ActionType.REMOVE_TOAST, toastId })

toast.promise = <T>(
  promise: Promise<T>,
  msgs: {
    loading: Renderable
    success: ValueOrFunction<Renderable, T>
    error: ValueOrFunction<Renderable, any>
  },
  opts?: DefaultToastOptions
) => {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading })

  promise
    .then((p) => {
      toast.success(resolveValue(msgs.success, p), {
        id,
        ...opts,
        ...opts?.success,
      })
      return p
    })
    .catch((e) => {
      toast.error(resolveValue(msgs.error, e), {
        id,
        ...opts,
        ...opts?.error
      })
    })

  return promise
}

export { toast }
