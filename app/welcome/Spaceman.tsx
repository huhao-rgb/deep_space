import { memo, useMemo } from 'react'

import * as THREE from 'three'
import { useTexture } from '@react-three/drei/native'
import { useGLTFCustom } from '@/hooks'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    RetopoGroup1_default_0: THREE.Mesh
    ZBrush_defualt_group_default_0: THREE.Mesh
  }
  materials: {
    ['default.001']: THREE.MeshStandardMaterial
    ['default_0.001']: THREE.MeshStandardMaterial
  }
}

const Spaceman = memo<JSX.IntrinsicElements['group']>((props) => {
  const { nodes, materials } = useGLTFCustom(require('@/assets/model/spaceman/spaceman.glb')) as GLTFResult

  const texture = useTexture(
    require('@/assets/model/spaceman/textures/default_baseColor.png'),
    tex => {
      if (Array.isArray(tex)) {
        throw new Error('Array of textures is not supported')
      }

      tex.flipY = false
      tex.unpackAlignment = 8
    }
  )

  const material = materials['default.001']
  const customMaterial = useMemo(
    () => {
      const cloneMaterial = material.clone()

      cloneMaterial.map = texture
      cloneMaterial.emissiveMap = texture

      return cloneMaterial
    },
    [material, texture]
  )

  return (
    <group {...props} dispose={null}>
      <group
        name="RetopoGroup1"
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <mesh
          name="RetopoGroup1_default_0"
          castShadow
          receiveShadow
          geometry={nodes.RetopoGroup1_default_0.geometry}
          material={customMaterial}
          scale={[13.718, 13.718, 13.718]}
        />
      </group>
      <group
        name="ZBrush_defualt_group"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <mesh
          name="ZBrush_defualt_group_default_0"
          castShadow
          receiveShadow
          geometry={nodes.ZBrush_defualt_group_default_0.geometry}
          scale={[13.718, 13.718, 13.718]}
        />
      </group>
    </group>
  )
})

export default Spaceman
