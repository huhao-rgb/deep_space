import type { FC } from 'react'

import { View } from 'react-native'
import { useGlobalSearchParams } from 'expo-router'

import { tw } from '@/utils'

import SearchInput from './SearchInput'

const Search: FC = () => {
  const { defaultKey } = useGlobalSearchParams()

  return (
    <View style={tw`px-5`}>
      <SearchInput placeholder={defaultKey as string} />
    </View>
  )
}

export default Search
