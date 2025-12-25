import { useGLTF, Sky, Text, PerspectiveCamera } from "@react-three/drei";
import pinsData from "../data/pins.json";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber"
import { Clouds, Cloud, CameraControls, Sky as SkyImpl, StatsGl } from "@react-three/drei"
import { useControls } from "leva"
import { EffectComposer, Bloom } from '@react-three/postprocessing';



const SkyConfig = () => {
  const ref = useRef<THREE.Group>(null)
  const cloud0 = useRef<THREE.Group>(null)
  const { color, x, y, z, range, ...config } = useControls({
    seed: { value: 1, min: 1, max: 100, step: 1 },
    segments: { value: 20, min: 1, max: 80, step: 1 },
    volume: { value: 6, min: 0, max: 100, step: 0.1 },
    opacity: { value: 0.8, min: 0, max: 1, step: 0.01 },
    fade: { value: 10, min: 0, max: 400, step: 1 },
    growth: { value: 4, min: 0, max: 20, step: 1 },
    speed: { value: 0.1, min: 0, max: 1, step: 0.01 },
    x: { value: 6, min: 0, max: 100, step: 1 },
    y: { value: 1, min: 0, max: 100, step: 1 },
    z: { value: 1, min: 0, max: 100, step: 1 },
    range: { value: 100, min: 0, max: 500, step: 1 },
    color: "white",
  })
 
  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={range}>
          <Cloud ref={cloud0} {...config} bounds={[x, y, z]} color={color} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={5} position={[0, 0, 5]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={4} position={[0, 0, -5]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={3} position={[0, 0, 12]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={5} position={[0, 0, 5]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={4} position={[0, 0, -5]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={3} position={[0, 0, 12]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={5} position={[0, 0, 5]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={4} position={[0, 0, -5]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={3} position={[0, 0, 12]} />
        </Clouds>
      </group>
    </>
  )}

export const Home = () => {
  const ContinentModel = useGLTF(
    new URL("../models/AmaralysBaked2.glb", import.meta.url).href
  );


  
  return (
    <>
      {/* Camera - Top View */}
      <PerspectiveCamera makeDefault position={[0, 15, 0]} rotation={[-Math.PI / 2, 0, 0]} />
  
/* Post-Processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
        />
  
      </EffectComposer>

      {/* Sky */}
      <StatsGl />
      <SkyConfig />
      <ambientLight intensity={Math.PI / 1.5} />
      <spotLight position={[0, 40, 0]} decay={0} distance={45} penumbra={1} intensity={100} />
      <spotLight position={[-20, 0, 10]} color="red" angle={0.15} decay={0} penumbra={-1} intensity={30} />
      <spotLight position={[20, -10, 10]} color="red" angle={0.2} decay={0} penumbra={-1} intensity={20} />
      <CameraControls />
            <primitive object={ContinentModel.scene} scale={0.02} position={[0, -1, 0]} />


    </>
  );
};