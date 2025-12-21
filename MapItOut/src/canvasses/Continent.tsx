import React from "react";
import { useGLTF } from "@react-three/drei";


const Continent = (props: any) => {
  const ContinentModel = useGLTF(
    new URL("../models/AmaralysNoMaterial.glb", import.meta.url).href
  );
  return (
    <>
      {/* Controls */}
      {/* <OrbitControls makeDefault /> */}

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1} />

      {/* Models */}
        <primitive object={ContinentModel.scene} scale={0.02} position={[0, -1, 0]} />
    </>
  );
};

export default Continent;
