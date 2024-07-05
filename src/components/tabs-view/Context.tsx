import React from 'react'
import type { TabsViewContext } from './types'

type CreateCtx<A> = readonly [
  () => A,
  React.ProviderExoticComponent<React.ProviderProps<A | undefined>>
]

function createContext<A> (): CreateCtx<A> {
  const ctx = React.createContext<A | undefined>(undefined)
  function useCtx (): A {
    const c = React.useContext(ctx)
    if (c === undefined) throw new Error('useCtx must be inside a Provider with a value')

    return c
  }
  // make TypeScript infer a tuple, not an array of union types
  return [useCtx, ctx.Provider] as const
}
const [useTabsViewContext, TabsViewContextProvider] = createContext<TabsViewContext>()

export { useTabsViewContext, TabsViewContextProvider, createContext }
