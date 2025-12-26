import { useThree, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export const CameraPinnedCard = ({ children }: { children: React.ReactNode }) => {
  const { camera } = useThree()
  const group = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (!group.current) return
    group.current.position.copy(camera.position)
    group.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={group}>
      <Html
        position={[4, 0, -6]}
        center
        distanceFactor={8}
      >
        {children}
      </Html>
    </group>
  )
}
