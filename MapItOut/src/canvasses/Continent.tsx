import React from "react";
import { useGLTF, Html } from "@react-three/drei";
import Dagger from "../components/Dagger/Dagger";

// Define your pin locations here (adjust coordinates to match your model)
const pinLocations = [
  { position: [2, 0, 1] as [number, number, number], label: "Location 1" },
  { position: [-1, 0.5, 0] as [number, number, number], label: "Location 2" },
  { position: [0, 0, -2] as [number, number, number], label: "Location 3" },
];

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

      {/* Pinned Daggers */}
      {pinLocations.map((pin, index) => (
        <Html key={index} position={pin.position} center distanceFactor={10}>
          <div className="flex flex-col items-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
            <Dagger />
          </div>
        </Html>
      ))}
    </>
  );
};

export default Continent;
