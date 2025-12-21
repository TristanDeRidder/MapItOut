import { useGLTF, Html, OrbitControls } from "@react-three/drei";
import Dagger from "../components/Dagger/Dagger";
import pinsData from "../data/pins.json";
import CameraArcAnimation from "../components/Camera/ArcCamera";
import { useState } from "react";

const Continent = () => {
  const [startArc, setStartArc] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number, number]>([0, 0, 0]);

  const ContinentModel = useGLTF(
    new URL("../models/AmaralysNoMaterial.glb", import.meta.url).href
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
      {pinsData.pins.map((pin, index) => (
        <Html key={index} position={pin.position as [number, number, number]} center distanceFactor={10}>
          <div className="flex flex-col items-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
            <a 
              href={pin.link || "#"} 
              className="mb-2 text-white font-bold px-2 py-1 rounded"
              onClick={(e) => {
                if (pin.link) {
                  e.preventDefault();
                  setTargetLocation(pin.position as [number, number, number]);
                  setPendingLink(pin.link);
                  setStartArc(true);
                }
              }}
            >
              <Dagger />
            </a>
          </div>
        </Html>
      ))}
    </>
  );
};

export default Continent;
