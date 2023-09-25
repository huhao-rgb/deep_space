import type { FC } from 'react'
import {
  useMemo,
  useRef,
  memo,
  Suspense
} from 'react'
import * as random from 'maath/random/dist/maath-random.esm'

import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber/native'
import {
  Points,
  PointMaterial,
  Float
} from '@react-three/drei/native'

import Spaceman from './Spaceman'
import LoadFallback from './LoadFallback'

const Starts = memo(() => {
  const startsRef = useRef<THREE.Points | null>(null)

  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), [])

  useFrame((_, delta) => {
    if (startsRef.current) {
      startsRef.current.rotation.x -= delta / 60
      startsRef.current.rotation.y -= delta / 60
    }
  })

  return (
    <group scale={[3, 3, 3]} rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={startsRef}
        positions={sphere}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
})

const Welcome: FC = () => {
  return (
    <Suspense fallback={<LoadFallback />}>
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

        <Starts />
        <Float>
          <Spaceman scale={[0.04, 0.04, 0.04]} />
        </Float>

        <color attach="background" args={['#12071f']} />
      </Canvas>
    </Suspense>
  )
}

export default Welcome
