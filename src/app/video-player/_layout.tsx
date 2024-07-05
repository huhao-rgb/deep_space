import { Stack } from 'expo-router'

import { tw } from '@/utils'

export default function Layout () {
  return (
    <Stack
      screenOptions={{
        header: () => null,
        contentStyle: tw`bg-white`
      }}
    />
  )
}
