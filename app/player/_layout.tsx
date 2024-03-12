import { Stack } from 'expo-router'

import { CommonHeader } from '@/components/screen-header'

import { tw } from '@/utils'

export default function Layout () {
  return (
    <Stack
      screenOptions={{
        header: (porps) => <CommonHeader {...porps} />,
        contentStyle: tw`bg-white`,
        title: ''
      }}
    />
  )
}
