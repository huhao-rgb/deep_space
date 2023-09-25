import { memo } from 'react'

import { useGLTF } from '@react-three/drei/native'
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
  const { nodes, materials, animations } = useGLTF(require('@/assets/model/spaceman/spaceman.glb')) as GLTFResult

  console.log('是否有动画：', animations)

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
          material={materials['default.001']}
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
