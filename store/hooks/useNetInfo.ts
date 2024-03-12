import { createWithEqualityFn } from 'zustand/traditional'
import axios from 'axios'

import type { NetInfoStateType } from '@react-native-community/netinfo'

// null 没有可用网络，cellular蜂窝网络，other其他网络（如wifi、蓝牙、vpn等）
type NetinfoState = null | 'cellular' | 'other'

export interface UseNetInfoState {
  ip: string,
  netInfoState: NetinfoState
  setIp: () => void
  setNetInfoState: (state: NetInfoStateType) => void
}

interface Response { ip: string }

const nullNetworkType = ['none', 'unknown']

export const useNetInfo = createWithEqualityFn<UseNetInfoState>(
  (set) => ({
    ip: '',
    netInfoState: null,
    async setIp () {
      try {
        const ipResponse = await axios<Response>({
          url: 'https://api.ipify.org',
          params: { format: 'json' }
        })

        if (ipResponse.status === 200 && ipResponse.data.ip) {
          set({ ip: ipResponse.data.ip })
        }
      } catch (err) {
        console.error(`获取ip地址错误，错误信息：${err}`)
      }
    },
    setNetInfoState (state) {
      let netState: NetinfoState = null

      if (nullNetworkType.indexOf(state) !== -1) {
      } else if (state === 'cellular') {
        netState = 'cellular'
      } else {
        netState = 'other'
      }

      set({ netInfoState: netState })
    }
  }),
  Object.is
)
