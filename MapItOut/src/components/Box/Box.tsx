import React from "react"
import * as THREE from 'three';


interface BoxProps {
    color?: string
    position?: [number, number, number] | number
    scale?: [number, number, number] | number
    rotation?: [number, number, number] | number
    visible?: boolean
    ref?: React.Ref<THREE.Mesh>
    receiveShadow?: boolean
    castShadow?: boolean
    onClick?: (e: React.MouseEvent) => void
}

const Box: React.FC<BoxProps> = ({ ...props }: BoxProps) => {

return (
    <mesh
      {...props}
    >
      <boxGeometry />
       <meshStandardMaterial color={props.color}/>
    </mesh>
  );

}

export default Box