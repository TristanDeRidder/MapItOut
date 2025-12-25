import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Clouds, Cloud, CameraControls, Sky as SkyImpl, StatsGl } from "@react-three/drei"
import { EffectComposer, Bloom } from '@react-three/postprocessing';



const SkyConfig = () => {
  return (
    <>
      <SkyImpl />
      <group>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={100}>
          <Cloud seed={4} segments={20} volume={6} opacity={0.8} fade={10} growth={4} speed={0.1} bounds={[6, 1, 1]} color="#c0c0dd" position={[-4, 0, -5]} />
          <Cloud seed={3} segments={20} volume={6} opacity={0.8} fade={10} growth={5} speed={0.1} bounds={[6, 1, 1]} color="#c0c0dd" position={[6, 0, 5]} />
          <Cloud seed={3} segments={20} volume={6} opacity={0.8} fade={10} growth={4} speed={0.1} bounds={[6, 1, 1]} color="#c0c0dd" position={[0, 0, 12]} />
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
  
      {/* Post-Processing Effects */}
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