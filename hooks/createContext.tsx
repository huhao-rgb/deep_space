import {
  createContext as createReactContext,
  useContext
} from 'react'
import type {
  ProviderExoticComponent,
  ProviderProps
} from 'react'

type CreateCtx<A> = readonly [
  () => A,
  ProviderExoticComponent<ProviderProps<A | undefined>>
]

export function createContext <A> (): CreateCtx<A> {
  const ctx = createReactContext<A | undefined>(undefined)

  function useCtx(): A {
    const c = useContext(ctx)
    if (!c) throw new Error('useCtx must be inside a Provider with a value')
    return c
  }

  return [useCtx, ctx.Provider] as const
}
