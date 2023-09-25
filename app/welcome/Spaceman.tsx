import { memo } from 'react'
import { useEffect } from 'react'

import { Asset } from 'expo-asset'

import type { GroupProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei/native'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


export interface SpacemanProps extends GroupProps {}

const Spaceman = memo<SpacemanProps>((props) => {
  useEffect(
    () => {
      (async () => {
        const asset = Asset.fromModule(require('@/assets/model/spaceman.glb'))
        await asset.downloadAsync()

        const loader = new GLTFLoader()
        loader.load(asset.localUri, (obj) => {
          console.log(obj)
        })
      })()
    },
    []
  )

  return (
    <group {...props}></group>
  )
})

export default Spaceman
