import type { FC } from 'react'
import { useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber/native'

function Box(props) {
  const meshRef = useRef(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.x += 0.01))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Rig = () => {
  useFrame((state) => {
    state.camera.position.lerp({ x: 0, y: -state.pointer.y / 4, z: state.pointer.x / 2 }, 0.1)
    state.camera.lookAt(-1, 0, 0)
  })
}

const Welcome: FC = () => {
  return (
    <Canvas
      shadows
      gl={{
        antialias: false,
        stencil: false
      }}
      camera={{ position: [4, 0, 0], fov: 80 }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <color attach="background" args={['black']} />
      <Box position={[-0.5, 0, 0]} />
      <Box position={[0.8, 0, 0]} />
    </Canvas>
  )
}

export default Welcome
