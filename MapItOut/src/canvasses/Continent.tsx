import { useGLTF, OrbitControls, Clone, Sky, Text, Environment } from "@react-three/drei";
import pinsData from "../data/pins.json";
import CameraArcAnimation from "../components/Camera/ArcCamera";
import { useState, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import gsap from 'gsap';
import { Water } from "three-stdlib";
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
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={[0, -2, 0]} />;
}

export const Continent = () => {
  const [startArc, setStartArc] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number, number]>([0, 0, 0]);

  const ContinentModel = useGLTF(
    new URL("../models/AmaralysBaked2.glb", import.meta.url).href
  );

  
  return (
    <>
      {/* Post-Processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={1.1}
          luminanceSmoothing={0.6}
        />
      </EffectComposer>
      {/* Controls */}
      <OrbitControls makeDefault enableZoom={false} enableRotate={true} />

      <CameraArcAnimation
        endPos={targetLocation}
        arcHeight={8}
        play={startArc}
        onComplete={() => {
          setStartArc(false);
          if (pendingLink) {
            window.location.href = pendingLink;
          }
        }}
      />

      {/* World */}
      <directionalLight position={[-3, 2, 1]} intensity={1.8} castShadow />
      <ambientLight intensity={2} />
      <Ocean />
      <group scale={1000}>
        <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      </group>

      {/* Models */}
      <primitive
        object={ContinentModel.scene}
        scale={0.02}
        position={[0, -1, 0]}
      />

      {pinsData.pins.map((pin, index) => (
        <>
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
            onClick={(e) => {
              e.stopPropagation();
              if (!pin.link) return;

              setTargetLocation(pin.position as [number, number, number]);
              setPendingLink(pin.link);
              setStartArc(true);
            }}
            onPointerEnter={() => (document.body.style.cursor = "pointer")}
            onPointerLeave={() => (document.body.style.cursor = "default")}
          >
            {pin.label}
          </Text>
        </>
      ))}
    </>
  );
};

export const WoodContinent = () => {
  const [startArc, setStartArc] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<[number, number, number]>([0, 0, 0]);
  const daggerRefs = useRef<{ [key: number]: THREE.Group }>({});

  const ContinentModel = useGLTF(
    new URL("../models/AmaralysBaked2.glb", import.meta.url).href
  );
  const TableModel = useGLTF(
    new URL("../models/WoodenAmaralys.glb", import.meta.url).href
  );
  const DaggerModel = useGLTF(
    new URL("../models/DaggerOrigin.glb", import.meta.url).href
  );

  const animateDagger = async (index: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const daggerGroup = daggerRefs.current[index];
    if (!daggerGroup) return;

    // Animate dagger moving up
    gsap.to(daggerGroup.position, {
      y: daggerGroup.position.y + 2, // Move up
      duration: 1.5,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    DaggerModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = false;

        const mat = (obj as any).material;
        if (mat?.isMeshStandardMaterial) {
          mat.envMapIntensity = 4;
          mat.roughness = 0.25;
          mat.metalness = 1;
          mat.needsUpdate = true;
        }
      }
    });
  }, [DaggerModel]);


  useEffect(() => {
    ContinentModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = false;
        obj.receiveShadow = true;

        const mat = (obj as any).material;
        if (mat && mat.isMeshStandardMaterial) {
          mat.metalness = 0;
          mat.roughness = 1;
          mat.envMapIntensity = 1;
          mat.needsUpdate = true;
        }
      }
    });
  }, [ContinentModel]);


  useEffect(() => {
    TableModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [TableModel]);
  
  return (
    <>
      {/* Post-Processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={1.1}
          luminanceSmoothing={0.6}
        />
      </EffectComposer>

      {/* Controls */}
      <OrbitControls makeDefault enableZoom={true} enableRotate={true} />

      <CameraArcAnimation
        endPos={targetLocation}
        arcHeight={8}
        play={startArc}
        onComplete={() => {
          setStartArc(false);
          if (pendingLink) {
            window.location.href = pendingLink;
          }
        }}
      />

      {/* World */}
      <directionalLight
        castShadow
        position={[10, 15, 10]}
        intensity={2.5}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={1}
        shadow-camera-far={120}
      />

      <ambientLight intensity={0.2} />
      <Environment preset="city" />
      {/* <Ocean /> */}

      {/* Shadow Plane */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, -0.97, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.35} />
      </mesh>



      {/* Models */}
      <primitive
        object={ContinentModel.scene}
        scale={0.02}
        position={[0, -0.95, 0]}
      />
      {/* <primitive object={TableModel.scene} scale={0.02} position={[0, -1, 0]} /> */}

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
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "default";
            }}
          >
            <Clone object={DaggerModel.scene} scale={0.3} />
          </group>
        );
      })}
    </>
  );
};
