import { Stack } from 'expo-router'

import { CommonHeader } from '@/components/screen-header'

import { tw } from '@/utils'

export default function Layout () {
  return (
    <Stack
      screenOptions={{
        header: (porps) => <CommonHeader {...porps} />,
        title: '评论',
        contentStyle: tw`bg-white`
      }}
    />
  )
}
