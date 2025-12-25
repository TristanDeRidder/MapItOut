import { useGLTF, Sky, Text, PerspectiveCamera } from "@react-three/drei";
import pinsData from "../data/pins.json";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Water } from 'three-stdlib';
import { extend, useThree, useFrame, useLoader } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';


extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: any;
    }
  }
}

function Ocean() {
  const ref = useRef<any>(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
  THREE.TextureLoader,
  '/waternormals.jpeg'
)

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      format: gl.outputColorSpace
    }),
    [waterNormals, gl.outputColorSpace]
  );
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta * 0.1;
    }
  });
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={[0, -1.05, 0]} />;
}

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

      {/* World */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={2} />
      <Ocean />
      <group scale={1000}>
        <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      </group>

      {/* Models */}
      <primitive object={ContinentModel.scene} scale={0.02} position={[0, -1, 0]} />

      {pinsData.pins.map((pin, index) => (
        <Text
        key={index}
        position={pin.position as [number, number, number]}
        rotation={[-Math.PI / 2, 0, 0]}
        font="/fonts/Felipa-Regular.ttf"
        fontSize={0.35}
        color="rgba(255, 255, 255, 1)"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="rgba(255, 238, 0, 1) 0, 1)"
        outlineOpacity={0.35}
        material-toneMapped={false}
      >
        {pin.label}
      </Text>
      ))}


    </>
  );
};