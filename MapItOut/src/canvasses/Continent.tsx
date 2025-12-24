import { useGLTF, Html, OrbitControls, Clone } from "@react-three/drei";
import Dagger from "../components/Dagger/Dagger";
import pinsData from "../data/pins.json";
import CameraArcAnimation from "../components/Camera/ArcCamera";
import { useState } from "react";

const Continent = () => {
  const [startArc, setStartArc] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number, number]>([0, 0, 0]);

  const ContinentModel = useGLTF(
    new URL("../models/AmaralysBaked2.glb", import.meta.url).href
  );
  const DaggerModel = useGLTF(
    new URL("../models/DaggerOrigin.glb", import.meta.url).href
  );
  return (
    <>
      {/* Controls */}
      <OrbitControls makeDefault />

      <CameraArcAnimation 
        endPos={targetLocation}     // The map/dagger location
        arcHeight={8}          // Height of the dagger pull
        play={startArc}
        onComplete={() => {
          setStartArc(false);
          if (pendingLink) {
            window.location.href = pendingLink;
          }
        }}
      />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1} />

      {/* Models */}
      <primitive object={ContinentModel.scene} scale={0.02} position={[0, -1, 0]} />

      {/* Pinned Daggers */}
      {pinsData.pins.map((pin, index) => {
        const minYRotation = 0; // Minimum rotation angle in radians
        const maxYRotation = Math.PI * 0.25; // Maximum rotation angle in radians
        const range = maxYRotation - minYRotation;
        const randomRotation = minYRotation + ((index * 0.5) % range); // Different angle for each

        const minXRotation = 0;
        const maxXRotation = Math.PI * 4;
        const xRange = maxXRotation - minXRotation;
        const randomXRotation = minXRotation + ((index * 0.5) % xRange);
        
        return (
          <group 
            key={index} 
            position={pin.position as [number, number, number]}
            rotation={[Math.PI / 2, randomRotation, randomXRotation]} // Point downwards + unique Y rotation
            onClick={(e) => {
              e.stopPropagation();
              if (pin.link) {
                setTargetLocation(pin.position as [number, number, number]);
                setPendingLink(pin.link);
                setStartArc(true);
              }
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'default';
            }}
          >
            <Clone object={DaggerModel.scene} scale={0.4} />
          </group>
        );
      })}
    </>
  );
};

export default Continent;
