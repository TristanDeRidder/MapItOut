import { useGLTF, OrbitControls, Clone } from "@react-three/drei";
import pinsData from "../data/pins.json";
import CameraArcAnimation from "../components/Camera/ArcCamera";
import { useState, useRef } from "react";
import * as THREE from "three";
import gsap from 'gsap';

const Continent = () => {
  const [startArc, setStartArc] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number, number]>([0, 0, 0]);
  const daggerRefs = useRef<{ [key: number]: THREE.Group }>({});

  const ContinentModel = useGLTF(
    new URL("../models/AmaralysBaked2.glb", import.meta.url).href
  );
  const DaggerModel = useGLTF(
    new URL("../models/DaggerOrigin.glb", import.meta.url).href
  );

  const animateDagger = async (index: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    const daggerGroup = daggerRefs.current[index];
    if (!daggerGroup) return;

    // Animate dagger moving up
    gsap.to(daggerGroup.position, {
      y: daggerGroup.position.y + 2, // Move up by 2 units
      duration: 1.5,
      ease: "power2.out",
    });
  };
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
            ref={(el) => {
              if (el) daggerRefs.current[index] = el;
            }}
            position={pin.position as [number, number, number]}
            rotation={[Math.PI / 2, randomRotation, randomXRotation]} // Point downwards + unique Y rotation
            onClick={(e) => {
              e.stopPropagation();
              if (pin.link) {
                setTargetLocation(pin.position as [number, number, number]);
                setPendingLink(pin.link);
                setStartArc(true);
                animateDagger(index);
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
