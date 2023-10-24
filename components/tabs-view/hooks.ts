import { useEvent, useHandler } from 'react-native-reanimated'
import type {
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEventData,
  PageScrollStateChangedNativeEventData
} from 'react-native-pager-view'

export const usePagerScrollHandler = <T extends Record<string, unknown>>(
  handlers: {
    onPageScroll: (
      e: PagerViewOnPageScrollEventData,
      context: T
    ) => void
  },
  dependencies?: any
) => {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies)
  const subscribeForEvents = ['onPageScroll']

  return useEvent<any>(
    (event) => {
      'worklet'
      const { onPageScroll } = handlers
      if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
        onPageScroll(event, context)
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  )
}

export const usePageSelectedHandler = <T extends Record<string, unknown>>(
  handlers: {
    onPageSelected: (
      e: PagerViewOnPageSelectedEventData,
      context: T
    ) => void
  },
  dependencies?: any
) => {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies)
  const subscribeForEvents = ['onPageSelected']

  return useEvent<any>(
    (event) => {
      'worklet'
      const { onPageSelected } = handlers
      if (onPageSelected && event.eventName.endsWith('onPageSelected')) {
        onPageSelected(event, context)
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  )
}

export const usePageScrollStateChangedHandler = <T extends Record<string, unknown>>(
  handlers: {
    onPageScrollStateChanged: (
      e: PageScrollStateChangedNativeEventData,
      context: T
    ) => void
  },
  dependencies?: any
) => {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies)
  const subscribeForEvents = ['onPageScrollStateChanged']

  return useEvent<any>(
    (event) => {
      'worklet'
      const { onPageScrollStateChanged } = handlers
      if (onPageScrollStateChanged && event.eventName.endsWith('onPageScrollStateChanged')) {
        onPageScrollStateChanged(event, context)
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  )
}
