import { MMKV } from 'react-native-mmkv'
import type { StateStorage } from 'zustand/middleware'

// 创建mmkv默认实例
export const mmkvDefaultStorage = new MMKV()

// zutand配合mmkv持久化存储配置
export const zutandMmkvStorage: StateStorage = {
  setItem: (name, value) => {
    return mmkvDefaultStorage.set(name, value)
  },
  getItem: (name) => {
    const value = mmkvDefaultStorage.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return mmkvDefaultStorage.delete(name)
  }
}
