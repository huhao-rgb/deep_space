import { create } from 'zustand'

export interface UseAnonimousState {
  anonimousToken: string | null,
  setAnonimousToken: () => Promise<boolean>
}

export const useAnonimous = create<UseAnonimousState>()(() => ({
  anonimousToken: null,
  setAnonimousToken () {
    return new Promise((resolve, reject) => {})
  }
}))
