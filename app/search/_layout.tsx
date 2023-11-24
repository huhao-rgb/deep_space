import { Stack } from 'expo-router'

import { CommonHeader } from '@/components/screen-header'

export default function Layout () {
  return (
    <Stack
      screenOptions={{
        header: (porps) => <CommonHeader {...porps} />
      }}
    />
  )
}
